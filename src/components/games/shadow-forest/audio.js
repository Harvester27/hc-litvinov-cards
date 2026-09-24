import { SOUND_EFFECTS, CINEMATIC_SOUND_CUES, soundEffectName, soundEffectUrl } from './soundEffects.mjs';

// Local ElevenLabs recordings: sound effects, a fire loop, and the battle score.
export function createAudio() {
  let context;
  let enabled = false;
  let ambience = null;
  let fire = null;
  let firestormOffset = 0;
  let campDistance = 1;
  let campPan = 0;
  let musicBuffer = null;
  let musicPending = null;
  let musicRequest = null;
  let musicUnavailable = false;
  let music = null;
  let musicOffset = 0;
  let destroyed = false;
  let activeLoads = 0;
  const musicVoices = new Set();
  const effects = new Set();
  const buffers = new Map();
  const requests = new Map();
  const unavailable = new Set();
  const loadQueue = [];
  const queued = new Set();

  function disconnectVoice(voice) {
    voice.source.onended = null;
    voice.source.disconnect();
    voice.gain.disconnect();
    voice.panner?.disconnect();
    voice.filter?.disconnect();
  }

  function stopVoice(voice) {
    try { voice.source.stop(); } catch { /* Already ended. */ }
    disconnectVoice(voice);
  }

  function stopMusic(immediate = false) {
    if (music) {
      const { source, gain, startedAt, offset } = music;
      musicOffset = (offset + Math.max(0, context.currentTime - startedAt)) % musicBuffer.duration;
      music = null;
      if (!immediate) {
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + .18);
        source.stop(now + .2);
      }
    }
    if (immediate) {
      for (const voice of musicVoices) stopVoice(voice);
      musicVoices.clear();
    }
  }

  function syncMusic() {
    if (destroyed || !enabled || ambience !== 'battle' || context?.state !== 'running') {
      stopMusic();
      return;
    }
    if (music || musicUnavailable) return;
    if (!musicBuffer) {
      if (!musicPending) {
        const musicContext = context;
        musicRequest = new AbortController();
        musicPending = fetch('/audio/shadow-forest/battle-theme-elevenlabs-v2.mp3', { signal: musicRequest.signal })
          .then((response) => {
            if (!response.ok) throw new Error('Battle music could not be loaded.');
            return response.arrayBuffer();
          }).then((data) => musicContext.decodeAudioData(data)).then((buffer) => {
            if (destroyed) return;
            musicBuffer = buffer;
            if (!buffer) musicUnavailable = true;
            syncMusic();
          }).catch(() => { musicUnavailable = true; }).finally(() => { musicPending = null; musicRequest = null; });
      }
      return;
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    const now = context.currentTime;
    source.buffer = musicBuffer;
    source.loop = true;
    gain.gain.setValueAtTime(.65, now);
    source.connect(gain); gain.connect(context.destination);
    music = { source, gain, startedAt: now, offset: musicOffset };
    const voice = music;
    musicVoices.add(voice);
    source.onended = () => { musicVoices.delete(voice); disconnectVoice(voice); };
    source.start(now, musicOffset);
  }

  function queueSample(name, priority = false) {
    if (!enabled || destroyed || buffers.has(name) || requests.has(name) || unavailable.has(name)) return;
    if (queued.has(name)) {
      if (priority) loadQueue.splice(loadQueue.indexOf(name), 1);
      else return;
    }
    queued.add(name);
    if (priority) loadQueue.unshift(name);
    else loadQueue.push(name);
  }

  function pumpSamples() {
    if (!enabled || destroyed || !context || context.state === 'closed') return;
    // Keep both downloads and decodes bounded on phones. Each recording is cached once.
    while (activeLoads < 3 && loadQueue.length) {
      const name = loadQueue.shift();
      queued.delete(name);
      const request = new AbortController();
      const sampleContext = context;
      requests.set(name, request);
      activeLoads++;
      Promise.resolve().then(() => fetch(soundEffectUrl(name), { signal: request.signal }))
        .then((response) => {
          if (!response.ok) throw new Error('Sound effect could not be loaded.');
          return response.arrayBuffer();
        })
        .then((data) => {
          if (destroyed || request.signal.aborted) return null;
          return sampleContext.decodeAudioData(data);
        })
        .then((buffer) => {
          if (destroyed || request.signal.aborted || context !== sampleContext || !buffer) return;
          buffers.set(name, buffer);
          // Only the current ambience may start after loading. One-shot cues never wait.
          if (name === 'camp_fire') syncAmbience();
        })
        .catch(() => { if (!destroyed && !request.signal.aborted) unavailable.add(name); })
        .finally(() => {
          requests.delete(name);
          activeLoads--;
          // A quick mute/unmute can abort a request before the next opt-in sees it.
          if (request.signal.aborted && enabled && !destroyed) queueSample(name);
          pumpSamples();
        });
    }
  }

  function preloadSamples() {
    if (ambience === 'battle') {
      // Start with the first exchange when sound is enabled in an existing battle.
      for (const name of ['swing', 'hit', 'windup', 'block', 'hurt', 'rest']) queueSample(name);
    }
    for (const name of Object.keys(SOUND_EFFECTS)) queueSample(name);
    pumpSamples();
  }

  function abortSamples() {
    loadQueue.length = 0;
    queued.clear();
    for (const request of requests.values()) request.abort();
  }

  function stopEffects() {
    // There is no pending playback queue: an unloaded cue is dropped in play().
    for (const voice of effects) stopVoice(voice);
    effects.clear();
  }

  function stopAmbience() {
    if (!fire) return;
    if (fire.kind === 'firestorm' && context) {
      firestormOffset = (fire.offset + Math.max(0, context.currentTime - fire.startedAt) * fire.rate) % fire.source.buffer.duration;
    }
    stopVoice(fire);
    fire = null;
  }

  function syncAmbience() {
    try { syncMusic(); } catch { stopMusic(true); }
    if (destroyed || !enabled || !['camp', 'firestorm'].includes(ambience) || context?.state !== 'running') {
      stopAmbience();
      return;
    }
    if (fire && fire.kind !== ambience) stopAmbience();
    if (fire) return;
    const buffer = buffers.get('camp_fire');
    if (!buffer) {
      queueSample('camp_fire', true);
      pumpSamples();
      return;
    }
    let voice;
    try {
      const source = context.createBufferSource();
      const gain = context.createGain();
      const panner = context.createStereoPanner?.();
      const storm = ambience === 'firestorm';
      const filter = storm ? context.createBiquadFilter?.() : null;
      const now = context.currentTime;
      const rate = storm ? .94 : 1;
      const offset = storm ? firestormOffset : 0;
      voice = { source, gain, panner, filter, kind: ambience, startedAt: now, offset, rate };
      source.buffer = buffer;
      source.loop = true;
      source.playbackRate.setValueAtTime(rate, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(storm ? .18 : SOUND_EFFECTS.camp_fire.gain * campDistance, now + .3);
      if (filter) {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1900, now);
        filter.Q.setValueAtTime(.65, now);
        source.connect(filter); filter.connect(gain);
      } else source.connect(gain);
      if (panner) { panner.pan.value = storm ? .05 : campPan; gain.connect(panner); panner.connect(context.destination); }
      else gain.connect(context.destination);
      source.onended = () => { if (fire === voice) fire = null; disconnectVoice(voice); };
      source.start(now, offset);
      fire = voice;
    } catch {
      if (voice) stopVoice(voice);
    }
  }

  function unlock() {
    if (destroyed) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      context ??= new AudioContext();
      if (enabled) preloadSamples();
      if (context.state !== 'running' && context.state !== 'closed') context.resume().then(syncAmbience).catch(() => {});
      else syncAmbience();
    } catch {
      // Audio is optional (including browsers with restrictive audio policies).
    }
  }

  function bounded(value, fallback, min, max) {
    return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  }

  function playSample(name, settings = {}, defaultPan = 0) {
    const buffer = buffers.get(name);
    if (!buffer) {
      queueSample(name, true);
      pumpSamples();
      return false;
    }
    const sample = SOUND_EFFECTS[name];
    const now = context.currentTime;
    const rate = bounded(settings.rate, 1, .65, 1.35);
    const offset = bounded(settings.offset, 0, 0, Math.max(0, buffer.duration - .01));
    const clipLength = Math.max(.01, (buffer.duration - offset) / rate);
    const length = bounded(settings.length, clipLength, .01, settings.loop ? 12 : clipLength);
    const fadeIn = bounded(settings.fadeIn, 0, 0, length * .45);
    const fadeOut = bounded(settings.fadeOut, 0, 0, length * .45);
    const level = bounded(settings.gain, 1, 0, 2);
    const levelTo = bounded(settings.gainTo, level, 0, 2);
    const pan = bounded(settings.pan, defaultPan, -1, 1);
    const panTo = bounded(settings.panTo, pan, -1, 1);
    const duration = bounded(settings.duration, length - fadeOut, Math.max(.01, fadeIn), length - fadeOut);
    let voice;
    try {
      // Prevent stacked combat events from creating an unbounded number of sources.
      if (effects.size >= 8) {
        const oldest = effects.values().next().value;
        effects.delete(oldest);
        stopVoice(oldest);
      }
      const source = context.createBufferSource();
      const gain = context.createGain();
      const panner = context.createStereoPanner?.();
      const filter = Number.isFinite(settings.lowpass) ? context.createBiquadFilter?.() : null;
      voice = { source, gain, panner, filter };
      source.buffer = buffer;
      source.playbackRate.setValueAtTime(rate, now);
      source.loop = Boolean(settings.loop);
      gain.gain.setValueAtTime(fadeIn ? 0 : sample.gain * level, now);
      if (fadeIn) gain.gain.linearRampToValueAtTime(sample.gain * level, now + fadeIn);
      if (levelTo !== level) gain.gain.linearRampToValueAtTime(sample.gain * levelTo, now + duration);
      if (fadeOut) {
        gain.gain.setValueAtTime(sample.gain * levelTo, now + length - fadeOut);
        gain.gain.linearRampToValueAtTime(0, now + length);
      }
      if (filter) {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(bounded(settings.lowpass, 1800, 80, 18000), now);
        filter.Q.setValueAtTime(.65, now);
        source.connect(filter); filter.connect(gain);
      } else source.connect(gain);
      if (panner) {
        panner.pan.setValueAtTime(pan, now);
        if (panTo !== pan) panner.pan.linearRampToValueAtTime(panTo, now + duration);
        gain.connect(panner);
        panner.connect(context.destination);
      } else gain.connect(context.destination);
      effects.add(voice);
      source.onended = () => { effects.delete(voice); disconnectVoice(voice); };
      source.start(now, offset);
      source.stop(now + length);
      return true;
    } catch {
      if (voice) { effects.delete(voice); stopVoice(voice); }
      return false;
    }
  }

  // gain/gainTo multiply mix levels; pan/panTo are -1 (left) to 1. duration
  // controls the ramp. Cinematic layers stop themselves and share the same
  // eight-voice limit and pause/mute cleanup as ordinary effects.
  function play(type, options = {}) {
    if (destroyed || !enabled || context?.state !== 'running') return false;
    const settings = options && typeof options === 'object' ? options : {};
    if (Object.hasOwn(CINEMATIC_SOUND_CUES, type)) {
      const gain = bounded(settings.gain, 1, 0, 1.25);
      const pan = bounded(settings.pan, 0, -1, 1);
      let played = false;
      for (const layer of CINEMATIC_SOUND_CUES[type]) {
        const mixed = { ...layer, gain: layer.gain * gain, gainTo: (layer.gainTo ?? layer.gain) * gain,
          pan: bounded((layer.pan ?? 0) + pan, 0, -1, 1), panTo: bounded((layer.panTo ?? layer.pan ?? 0) + pan, 0, -1, 1) };
        played = playSample(layer.sample, mixed) || played;
      }
      return played;
    }
    const name = soundEffectName(type);
    if (!name || name === 'camp_fire') return false;
    return playSample(name, settings, type === 'hero_draw' ? .4 : SOUND_EFFECTS[name].pan ?? 0);
  }

  return {
    setEnabled(value) {
      enabled = Boolean(value) && !destroyed;
      if (enabled) {
        // Explicit opt-in retries a transient failure without a background retry loop.
        unavailable.clear();
        musicUnavailable = false;
        unlock();
      }
      else { abortSamples(); stopMusic(true); stopAmbience(); stopEffects(); }
    },
    setAmbience(value) {
      ambience = value;
      syncAmbience();
      if (value === 'camp') { musicOffset = 0; firestormOffset = 0; }
    },
    setCampPerspective(pan, distance) {
      if (!Number.isFinite(pan) || !Number.isFinite(distance)) return;
      campPan = Math.max(-1, Math.min(1, pan));
      campDistance = Math.max(0, Math.min(1, distance));
      if (fire?.kind === 'camp' && context) {
        fire.gain.gain.setTargetAtTime(SOUND_EFFECTS.camp_fire.gain * campDistance, context.currentTime, .12);
        fire.panner?.pan.setTargetAtTime(campPan, context.currentTime, .12);
      }
    },
    stopEffects,
    unlock,
    play,
    destroy() {
      destroyed = true;
      enabled = false;
      musicRequest?.abort();
      abortSamples();
      stopMusic(true);
      stopAmbience();
      stopEffects();
      buffers.clear();
      musicBuffer = null;
      if (context) context.close().catch(() => {});
      context = null;
    },
  };
}
