import { FIRESTORM_DURATION, FIRESTORM_CUES, getFirestormCaption } from './firestorm.mjs';

export const CINEMATIC_DURATION = 18;
export const CREATURE_ROAR_START = 14.35;
export const CREATURE_ROAR_DURATION = 2.4;

const captions = Object.freeze([
  { from: 0, to: 1.9, speaker: 'Eira', text: 'Zítra už budeme spát v pořádné…' },
  { from: 2.4, to: 5.2, speaker: 'Eira', text: 'Počkej. Slyšels to?' },
  { from: 16, to: CINEMATIC_DURATION, speaker: 'Eira', text: 'Připrav se.' },
].map(Object.freeze));

const cues = Object.freeze([
  { time: 1.9, type: 'branch_snap' },
  { time: 4.8, type: 'cloth_rustle' },
  { time: 6.5, type: 'draw_blade' },
  { time: 13, type: 'creature_breath', audio: { gain: .5, pan: .25 } },
  { time: 14, type: 'approach_step', audio: { gain: .5, pan: .12 } },
  { time: CREATURE_ROAR_START, type: 'creature_roar', audio: { gain: .45, gainTo: 1, pan: .2, panTo: 0, duration: CREATURE_ROAR_DURATION } },
  { time: 15.1, type: 'approach_step', audio: { gain: .75, pan: .06 } },
  { time: 16.2, type: 'approach_step', audio: { gain: 1, pan: 0 } },
  { time: 16.6, type: 'hero_draw' },
].map(Object.freeze));

export function createCinematic() {
  return { elapsed: 0, paused: false };
}

export function startCinematic(state) {
  Object.assign(state, {
    scene: 'cinematic', resumeScene: 'cinematic', story: null,
    status: 'ready', cinematic: createCinematic(),
  });
  return state;
}

export function getCinematicDuration(cinematicOrKind) {
  const kind = typeof cinematicOrKind === 'string' ? cinematicOrKind : cinematicOrKind?.kind;
  return kind === 'firestorm' ? FIRESTORM_DURATION : CINEMATIC_DURATION;
}

export function getCinematicCaption(elapsed, kind, state) {
  if ((typeof kind === 'string' ? kind : kind?.kind) === 'firestorm') return getFirestormCaption(elapsed, state);
  if (!Number.isFinite(elapsed)) return null;
  const caption = captions.find(({ from, to }) => elapsed >= from && elapsed < to);
  return caption ? { speaker: caption.speaker, text: caption.text } : null;
}

/** A bounded visual clock; crossing a cue emits its sound exactly once. */
export function stepCinematic(state, dt) {
  const cinematic = state?.cinematic;
  const duration = getCinematicDuration(cinematic);
  if (state?.scene !== 'cinematic' || !cinematic || cinematic.paused
    || ![undefined, 'camp', 'firestorm'].includes(cinematic.kind)
    || !Number.isFinite(dt) || dt <= 0
    || !Number.isFinite(cinematic.elapsed) || cinematic.elapsed < 0 || cinematic.elapsed >= duration) return false;
  const previous = cinematic.elapsed;
  const next = Math.min(duration, previous + Math.min(dt, 0.25));
  cinematic.elapsed = next;
  if (!Array.isArray(state.events)) state.events = [];
  for (const cue of cinematic.kind === 'firestorm' ? FIRESTORM_CUES : cues) {
    if (previous < cue.time && next >= cue.time) state.events.push({ type: cue.type, ...(cue.audio ? { audio: { ...cue.audio } } : {}) });
  }
  return previous < duration && next === duration;
}
