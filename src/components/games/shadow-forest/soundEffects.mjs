// These local ElevenLabs recordings are normalized before shipping with the game.
export const SOUND_EFFECTS = Object.freeze({
  camp_fire: { gain: .26 },
  branch_snap: { gain: .75, pan: .8 },
  cloth_rustle: { gain: .42, pan: -.2 },
  draw_blade: { gain: .65, pan: -.2 },
  approach_step: { gain: .62, pan: .2 },
  creature_breath: { gain: .62, pan: .6 },
  creature_roar: { gain: .9, pan: .6 },
  swing: { gain: .66 },
  dodge: { gain: .5 },
  hit: { gain: .75 },
  hurt: { gain: .72 },
  windup: { gain: .58 },
  rest: { gain: .45 },
  block: { gain: .72 },
  parry: { gain: .8 },
  win: { gain: .65 },
  lose: { gain: .6 },
});

// Firestorm cues reuse the approved local recordings. Length is wall-clock
// seconds; even looped layers have a finite envelope and an explicit stop.
export const CINEMATIC_SOUND_CUES = Object.freeze({
  fire_charge: [
    { sample: 'camp_fire', gain: .25, gainTo: 1.05, length: 4.15, loop: true, rate: .9, lowpass: 1300, fadeIn: .6, fadeOut: .4, pan: -.15, panTo: .1 },
    { sample: 'creature_breath', gain: .22, gainTo: .45, length: 3.9, loop: true, rate: .8, lowpass: 270, fadeIn: .65, fadeOut: .4 },
    { sample: 'windup', gain: .28, rate: .85, lowpass: 380, fadeIn: .15, fadeOut: .25 },
  ],
  fire_wave: [
    { sample: 'camp_fire', gain: 1.4, gainTo: .85, length: 8.5, loop: true, rate: 1.06, offset: 1.1, fadeIn: .18, fadeOut: 1.1, pan: -.45, panTo: .12 },
    { sample: 'camp_fire', gain: .85, gainTo: .5, length: 8.3, loop: true, rate: .94, offset: 3.2, lowpass: 2400, fadeIn: .25, fadeOut: 1.1, pan: .45, panTo: .05 },
    { sample: 'creature_breath', gain: .48, rate: .9, lowpass: 900, fadeIn: .08, fadeOut: .5, pan: -.15 },
  ],
  fire_impact: [
    { sample: 'hit', gain: .85, rate: .78, lowpass: 950, fadeIn: .005, fadeOut: .12, pan: .1 },
    { sample: 'branch_snap', gain: .7, rate: .82, fadeIn: .005, fadeOut: .15, pan: .15 },
    { sample: 'camp_fire', gain: .95, gainTo: .28, length: 6.2, loop: true, rate: .94, offset: 2.1, lowpass: 1900, fadeIn: .06, fadeOut: .8, pan: .1 },
  ],
  tree_creak: [
    { sample: 'branch_snap', gain: .5, rate: .7, lowpass: 1500, fadeIn: .025, fadeOut: .25, pan: .15 },
    { sample: 'creature_breath', gain: .22, gainTo: .1, length: 3.8, loop: true, rate: .75, lowpass: 420, fadeIn: .3, fadeOut: .9, pan: .15 },
  ],
  fire_tail: [
    { sample: 'camp_fire', gain: .75, gainTo: .05, length: 6.3, loop: true, rate: .92, offset: .6, lowpass: 1600, fadeIn: .25, fadeOut: 1.6, pan: .1, panTo: 0 },
  ],
  creature_fall: [
    { sample: 'approach_step', gain: .85, rate: .72, lowpass: 950, fadeIn: .005, fadeOut: .15, pan: .1 },
    { sample: 'cloth_rustle', gain: .65, rate: .85, fadeIn: .01, fadeOut: .2, pan: .1 },
  ],
  run_step: [
    { sample: 'approach_step', gain: .55, rate: 1.16, length: .42, fadeIn: .005, fadeOut: .07 },
  ],
});

export function soundEffectName(type) {
  const name = type === 'hero_draw' ? 'draw_blade' : type;
  return Object.hasOwn(SOUND_EFFECTS, name) ? name : null;
}

export function soundEffectUrl(name) {
  return `/audio/shadow-forest/sfx-v1/${name}.mp3`;
}
