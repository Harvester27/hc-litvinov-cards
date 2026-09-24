export const FIRESTORM_DURATION = 32;
export const FIRESTORM_LANDMARK = 'charred-guardian';

export const FIRESTORM_CUES = Object.freeze([
  { time: .2, type: 'cloth_rustle', audio: { gain: .35 } },
  { time: .8, type: 'approach_step', audio: { gain: .6 } },
  { time: 2.2, type: 'approach_step', audio: { gain: .45 } },
  { time: 5.1, type: 'fire_charge' },
  { time: 6.3, type: 'cloth_rustle', audio: { gain: .45, pan: -.45 } },
  { time: 10.2, type: 'fire_wave' },
  ...Array.from({ length: 12 }, (_, index) => ({ time: Math.round((9.1 + index * .6) * 10) / 10,
    type: 'run_step', audio: { gain: .55, pan: index % 2 === 0 ? -.35 : .1 } })),
  { time: 16.7, type: 'cloth_rustle', audio: { gain: .65, pan: -.2 } },
  { time: 17.8, type: 'fire_impact' },
  { time: 19.2, type: 'tree_creak' },
  { time: 23, type: 'fire_tail' },
  { time: 29, type: 'creature_fall' },
  { time: 28.5, type: 'cloth_rustle', audio: { gain: .25, pan: -.4 } },
].sort((a, b) => a.time - b.time).map(cue => Object.freeze({ ...cue, ...(cue.audio ? { audio: Object.freeze(cue.audio) } : {}) })));

const finite = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
const timerKeys = ['enemyHurtTimer', 'enemyBlockTimer', 'eiraHurtTimer', 'eiraBlockTimer', 'hurtTimer', 'parryTimer'];
const clamp = (value, fallback, min, max) => Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

/** Only pose scalars are stored. Health, world positions and equipment belong
 * to the validated battle outcome, never to an arbitrary cinematic snapshot. */
export function normalizeFirestormOrigin(value) {
  if (!value || !['player', 'resolving', 'enemy', 'eira'].includes(value.turn)
    || !['idle', 'approach', 'move', 'windup', 'strike', 'recover'].includes(value.phase)
    || !['player', 'eira'].includes(value.enemyTarget)
    || ![null, 'attack', 'power', 'rest'].includes(value.lastAction)
    || typeof value.strikeResolved !== 'boolean'
    || !finite(value.phaseDuration, .001, 10) || !finite(value.phaseTime, 0, value.phaseDuration + 1e-7)
    || !finite(value.attackDuration, .001, 10) || !finite(value.attackTimer, 0, value.attackDuration + 1e-7)
    || !finite(value.elapsed, 0, 1e9) || !finite(value.visualTime, 0, 1e9)
    || timerKeys.some(key => !finite(value[key], 0, 10))) return null;
  return {
    turn: value.turn, phase: value.phase, phaseTime: value.phaseTime, phaseDuration: value.phaseDuration,
    attackTimer: value.attackTimer, attackDuration: value.attackDuration, enemyTarget: value.enemyTarget,
    lastAction: value.lastAction, strikeResolved: value.strikeResolved, elapsed: value.elapsed, visualTime: value.visualTime,
    ...Object.fromEntries(timerKeys.map(key => [key, value[key]])),
  };
}

function captureOrigin(state, visualTime) {
  const phaseDuration = clamp(state.phaseDuration, 1, .001, 10), attackDuration = clamp(state.attackDuration, .52, .001, 10);
  return normalizeFirestormOrigin({
    turn: ['player', 'resolving', 'enemy', 'eira'].includes(state.turn) ? state.turn : 'player',
    phase: ['idle', 'approach', 'move', 'windup', 'strike', 'recover'].includes(state.phase) ? state.phase : 'idle',
    phaseTime: clamp(state.phaseTime, 0, 0, phaseDuration), phaseDuration,
    attackTimer: clamp(state.attackTimer, 0, 0, attackDuration), attackDuration,
    enemyTarget: state.enemyTarget === 'eira' ? 'eira' : 'player',
    lastAction: ['attack', 'power', 'rest'].includes(state.lastAction) ? state.lastAction : null,
    strikeResolved: Boolean(state.strikeResolved), elapsed: clamp(state.elapsed, 0, 0, 1e9),
    visualTime: clamp(visualTime, 3.2, 0, 1e9),
    ...Object.fromEntries(timerKeys.map(key => [key, clamp(state[key], 0, 0, 10)])),
  });
}

/** First entry follows a won battle. Replay is explicit and only available
 * after discovering the landmark; neither path restarts or heals the party. */
export function startFirestorm(state, options = {}) {
  if (!state || state.status !== 'won' || state.enemyHealth !== 0 || !(state.health > 0)) return false;
  const replay = options?.replay === true;
  if (replay) {
    if (state.resumeScene !== 'sanctuary' || state.discoveredLandmark !== FIRESTORM_LANDMARK
      || state.cinematic?.kind !== 'firestorm' || state.cinematic.elapsed !== FIRESTORM_DURATION) return false;
  } else if (state.cinematic?.kind === 'firestorm' || state.discoveredLandmark === FIRESTORM_LANDMARK) return false;
  const origin = replay ? normalizeFirestormOrigin(state.cinematic.origin) : captureOrigin(state, options?.visualTime);
  if (!origin) return false;
  state.scene = state.resumeScene = 'cinematic';
  state.story = null;
  state.cinematic = { kind: 'firestorm', elapsed: 0, paused: false, origin };
  state.events = replay ? [] : (Array.isArray(state.events) ? state.events.filter(event => event.type !== 'win') : []);
  return true;
}

export function finishFirestorm(state) {
  if (!state || state.status !== 'won' || state.enemyHealth !== 0 || !(state.health > 0)
    || state.cinematic?.kind !== 'firestorm' || !finite(state.cinematic.elapsed, 0, FIRESTORM_DURATION)
    || !normalizeFirestormOrigin(state.cinematic.origin) || state.resumeScene !== 'cinematic') return false;
  state.cinematic.elapsed = FIRESTORM_DURATION;
  state.cinematic.paused = false;
  state.scene = state.resumeScene = 'sanctuary';
  state.events = [];
  if (state.discoveredLandmark !== FIRESTORM_LANDMARK) {
    state.discoveredLandmark = FIRESTORM_LANDMARK;
    if (!Array.isArray(state.log)) state.log = [];
    state.logId = (Number.isInteger(state.logId) ? state.logId : 0) + 1;
    state.log.push({ id: state.logId, actor: 'system', text: 'Objeveno místo: Ohořelý strážce. Staré znamení ve kmeni vás ochránilo.' });
    if (state.log.length > 8) state.log.splice(0, state.log.length - 8);
  }
  return true;
}

export function getFirestormCaption(elapsed, state) {
  if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed >= FIRESTORM_DURATION) return null;
  const wounded = state?.eira?.health === 0;
  if (elapsed >= 1.2 && elapsed < 4.3) return { speaker: 'Eira', text: 'Počkej! Něco se děje!' };
  if (elapsed >= 5.6 && elapsed < 8.9) return { speaker: 'Eira', text: wounded ? 'Za strom! Hned… pomoz mi!' : 'Za strom! Hned!' };
  if (elapsed >= 17.8 && elapsed < 20.9) return wounded
    ? { speaker: state?.heroName || 'Poutník', text: 'Vydrž, Eiro. Tady jsme v bezpečí.' }
    : { speaker: 'Eira', text: 'Zůstaň u kmene!' };
  if (elapsed >= 27.2) return { speaker: 'Eira', text: 'Ten strom… ochránil nás.' };
  return null;
}
