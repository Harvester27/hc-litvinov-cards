// An original 16-bar D-minor cue, synthesized once and then looped as a buffer.
// No real-time scheduler, downloaded recording, or dependency on a music service.
export async function createBattleMusicBuffer(context) {
  const OfflineContext = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!OfflineContext) throw new Error('Offline audio rendering is unavailable.');

  const sampleRate = Math.min(44100, context.sampleRate || 44100);
  const loopFrames = Math.round(sampleRate * 64 * 60 / 116);
  const duration = loopFrames / sampleRate;
  const beat = duration / 64;
  const tailFrames = Math.ceil(sampleRate * 2);
  const offline = new OfflineContext(2, loopFrames + tailFrames, sampleRate);
  const mix = offline.createGain();
  const room = offline.createGain();
  mix.gain.value = 1.64;
  room.gain.value = .16;
  mix.connect(offline.destination);

  // Short, filtered reflections give the instruments a shared space. Their
  // finite tails can be folded into the loop without a feedback discontinuity.
  for (const [delayTime, pan, volume] of [[.113, -.65, .48], [.197, .6, .36], [.337, -.25, .22]]) {
    const delay = offline.createDelay(.5);
    const filter = offline.createBiquadFilter();
    const gain = offline.createGain();
    delay.delayTime.value = delayTime;
    filter.type = 'lowpass';
    filter.frequency.value = 1700;
    gain.gain.value = volume;
    room.connect(delay); delay.connect(filter); filter.connect(gain);
    connectPan(gain, mix, pan);
  }

  function connectPan(source, destination, pan) {
    if (pan && offline.createStereoPanner) {
      const panner = offline.createStereoPanner();
      panner.pan.value = pan;
      source.connect(panner); panner.connect(destination);
    } else source.connect(destination);
  }

  function route(source, pan = 0, reverb = true) {
    connectPan(source, mix, pan);
    if (reverb) source.connect(room);
  }

  // Share the room, filters and stereo positions between notes. Hundreds of
  // separate filters would keep working through silence during offline rendering.
  function instrument(type, cutoff, pan = 0, q = .55) {
    const filter = offline.createBiquadFilter();
    filter.type = type; filter.frequency.value = cutoff; filter.Q.value = q;
    route(filter, pan);
    return filter;
  }
  const stringBuses = [instrument('lowpass', 780, -.2), instrument('lowpass', 780, .2)];
  const padBuses = [-.45, 0, .45].map((pan) => instrument('lowpass', 780, pan));
  const hornBus = instrument('lowpass', 1150, .16);
  const skinBuses = [instrument('bandpass', 670, 0, .8), instrument('bandpass', 1250, 0, .8)];
  const brushBuses = [instrument('bandpass', 2200, -.35, .8), instrument('bandpass', 2000, .35, .8)];
  const drumBuses = [-.3, 0, .3].map((pan) => {
    const bus = offline.createGain();
    route(bus, pan);
    return bus;
  });

  const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

  function oscillator(type, midi, at, length, destination, detune = 0) {
    const voice = offline.createOscillator();
    voice.type = type;
    voice.frequency.value = frequency(midi);
    voice.detune.value = detune;
    voice.connect(destination);
    voice.start(at); voice.stop(at + length);
    return voice;
  }

  function envelope(at, length, volume, attack = .012, sustain = .36) {
    const gain = offline.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + attack);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0001, volume * sustain), at + length * .55);
    gain.gain.exponentialRampToValueAtTime(.0001, at + length - .006);
    gain.gain.linearRampToValueAtTime(0, at + length);
    return gain;
  }

  function strings(midi, at, accent, pan) {
    const length = beat * .67;
    const body = offline.createGain();
    const edge = offline.createGain();
    const gain = envelope(at, length, .041 * accent, .018, .22);
    body.gain.value = .82; edge.gain.value = .13;
    oscillator('triangle', midi, at, length, body, -2);
    oscillator('sawtooth', midi, at, length, edge, 2);
    body.connect(gain); edge.connect(gain);
    gain.connect(stringBuses[pan < 0 ? 0 : 1]);
  }

  function bass(midi, at, accent) {
    const length = beat * .86;
    const gain = envelope(at, length, .054 * accent, .016, .5);
    const harmonic = offline.createGain();
    harmonic.gain.value = .24;
    oscillator('sine', midi, at, length, gain);
    oscillator('triangle', midi + 12, at, length, harmonic);
    harmonic.connect(gain);
    route(gain, 0, false);
  }

  function pad(notes, at) {
    const length = beat * 4 + .55;
    for (let index = 0; index < notes.length; index++) {
      const gain = offline.createGain();
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(.008, at + .42);
      gain.gain.setValueAtTime(.008, at + beat * 3.35);
      gain.gain.linearRampToValueAtTime(0, at + length);
      oscillator('triangle', notes[index], at, length, gain, index % 2 ? -4 : 4);
      gain.connect(padBuses[index]);
    }
  }

  function horn(midi, at, beats, accent = 1) {
    const length = beat * beats;
    const gain = envelope(at, length, .025 * accent, .065, .72);
    oscillator('triangle', midi, at, length, gain);
    gain.connect(hornBus);
  }

  // One repeatable noise sample supplies the drum skins and quiet brush accents.
  const noiseBuffer = offline.createBuffer(1, Math.ceil(sampleRate * .4), sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  let seed = 71237;
  for (let index = 0; index < noiseData.length; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    noiseData[index] = seed / 2147483648 - 1;
  }

  function brush(at, volume, cutoff, pan) {
    const length = .12;
    const source = offline.createBufferSource();
    const gain = envelope(at, length, volume, .003, .12);
    source.buffer = noiseBuffer;
    source.connect(gain);
    gain.connect(cutoff > 1500 ? brushBuses[pan < 0 ? 0 : 1] : skinBuses[cutoff > 900 ? 1 : 0]);
    source.start(at); source.stop(at + length);
  }

  function drum(at, accent, high = false, pan = 0) {
    const length = high ? .24 : .38;
    const gain = envelope(at, length, .12 * accent, .005, .12);
    const voice = offline.createOscillator();
    voice.type = 'sine';
    voice.frequency.setValueAtTime(high ? 174 : 122, at);
    voice.frequency.exponentialRampToValueAtTime(high ? 83 : 49, at + length * .6);
    voice.connect(gain); gain.connect(drumBuses[pan < 0 ? 0 : pan > 0 ? 2 : 1]);
    voice.start(at); voice.stop(at + length);
    brush(at, .019 * accent, high ? 1250 : 670, pan);
  }

  // Dm – Dm – Bb – C – Dm – Gm – Bb – A, then a varied response.
  const roots = [38, 38, 34, 36, 38, 31, 34, 33, 38, 38, 34, 36, 31, 34, 33, 33];
  const accents = [1, .44, .63, .46, .86, .44, .66, .5];
  for (let bar = 0; bar < 16; bar++) {
    const root = roots[bar];
    const start = bar * 4 * beat;
    const major = root === 34 || root === 36 || root === 33;
    const third = major ? 4 : 3;
    pad([root + 24, root + 24 + third, root + 31], start);
    for (let eighth = 0; eighth < 8; eighth++) {
      const interval = eighth === 3 || eighth === 7 ? 7 : eighth === 6 ? third : 0;
      strings(root + 12 + interval, start + eighth * beat / 2, accents[eighth], eighth % 2 ? .2 : -.2);
    }
    for (let quarter = 0; quarter < 4; quarter++) {
      bass(root + (quarter === 3 && bar % 2 ? 7 : 0), start + quarter * beat, quarter % 2 ? .6 : .85);
    }
    drum(start, .86);
    drum(start + beat * 1.5, .36, true, -.3);
    drum(start + beat * 2, .69);
    drum(start + beat * 3, .5, true, .3);
    brush(start + beat, .017, 2200, -.35);
    brush(start + beat * 3.5, .012, 2000, .35);
    if (bar % 4 === 3) {
      drum(start + beat * 3.5, .38, true, -.25);
      drum(start + beat * 3.75, .3, true, .25);
    }
  }

  // A spacious call and response leaves the midrange open for swords and voices.
  const motif = [
    [0, 62, 1.4], [1.75, 65, .65], [3, 64, .8],
    [5, 62, 1.6], [7, 57, .7],
    [9, 58, 1.4], [11, 62, .8], [13, 60, 1.5],
    [16, 62, 1.4], [18, 69, .8], [19.25, 65, .65],
    [21, 67, 1.5], [23, 65, .7], [25, 62, 1.6],
    [29, 61, 1.6],
    [33, 62, 1.4], [35, 65, .8], [37, 64, 1.6],
    [41, 62, 1.4], [43, 58, .7], [45, 60, 1.5],
    [49, 67, 1.5], [51, 65, .7], [53, 62, 1.6],
    [57, 61, 1.5], [60, 57, 1.5], [62, 61, 1.6],
  ];
  for (const [position, note, length] of motif) horn(note, position * beat, length, position >= 32 ? .86 : 1);

  const rendered = await offline.startRendering();
  const buffer = context.createBuffer(2, loopFrames, sampleRate);
  let peak = 0;
  for (let channel = 0; channel < 2; channel++) {
    const source = rendered.getChannelData(channel);
    const target = buffer.getChannelData(channel);
    target.set(source.subarray(0, loopFrames));
    for (let index = 0; index < tailFrames; index++) target[index] += source[loopFrames + index];
    for (let index = 0; index < target.length; index++) peak = Math.max(peak, Math.abs(target[index]));
  }
  // Preserve dynamics and headroom; the caller owns the user's volume and fades.
  if (peak > .32) {
    const scale = .32 / peak;
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let index = 0; index < data.length; index++) data[index] *= scale;
    }
  }
  return buffer;
}
