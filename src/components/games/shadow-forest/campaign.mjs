import { createGame, normalizeAttributes, getEnemyIntent } from './combat.mjs';
import { normalizeAppearance } from './appearance.mjs';
import { STORY_START, isStoryNode, getStoryNode, advanceStoryNode } from './story.mjs';
import { CINEMATIC_DURATION, createCinematic } from './cinematic.mjs';
import { FIRESTORM_DURATION, FIRESTORM_LANDMARK, normalizeFirestormOrigin, finishFirestorm } from './firestorm.mjs';
import { createArena, completeArena, isValidArena, isValidLegacyArena } from './spatial.mjs';
import { SANCTUARY_DIALOGUE_START, isSanctuaryDialogueId } from './sanctuaryStory.mjs';
import { normalizeExploration } from './exploration.mjs';

export const SAVE_KEY = 'lancers.shadow-forest.campaign.v1';
export const SAVE_VERSION = 10;
// Older checkpoints retain a reproducible sequence until the next save.
const LEGACY_RNG_SEED = 0x6d2b79f5;

export function normalizeProfile(value = {}) {
  const input = value && typeof value === 'object' ? value : {};
  const name = typeof input.name === 'string' ? [...input.name.replace(/[\u0000-\u001f\u007f]/g, '').trim().replace(/\s+/g, ' ')].slice(0, 24).join('') : '';
  return { name: name || 'Poutník', appearance: normalizeAppearance(input.appearance), attributes: normalizeAttributes(input.attributes) };
}

export function createCampaign(profile) {
  const selected = normalizeProfile(profile);
  return {
    ...createGame(selected.attributes), heroName: selected.name, appearance: selected.appearance,
    scene: 'menu', resumeScene: 'battle', story: null, cinematic: null, discoveredLandmark: null,
    sanctuaryDialogueId: SANCTUARY_DIALOGUE_START, exploration: null,
  };
}

export function startStory(state) {
  Object.assign(state, createGame(state.attributes), {
    scene: 'camp', resumeScene: 'camp', story: { nodeId: STORY_START }, cinematic: null, discoveredLandmark: null,
    sanctuaryDialogueId: SANCTUARY_DIALOGUE_START, exploration: null,
  });
  return state;
}

export function advanceStory(state, choiceId) {
  if (state.scene !== 'camp' || !isStoryNode(state.story?.nodeId)) return false;
  const node = getStoryNode(state.story.nodeId);
  if (node.end) return false;
  const nextId = advanceStoryNode(state.story.nodeId, choiceId);
  if (!isStoryNode(nextId)) return false;
  state.story = { nodeId: nextId };
  return true;
}

const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
const finite = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
const stable = state => state.motion == null && state.pendingAction == null && state.playerFollowup == null
  && state.enemyFollowup == null && state.eiraFollowup == null && state.combatHome == null
  && state.facingMotion == null && state.reaction == null
  && (['won', 'lost'].includes(state.status) || (['playing', 'paused'].includes(state.status) && state.turn === 'player'));
const copyArena = arena => ({ player: { x: arena.player.x, z: arena.player.z }, enemy: { x: arena.enemy.x, z: arena.enemy.z },
  eira: { x: arena.eira.x, z: arena.eira.z }, enemyFacing: arena.enemyFacing });

/** Shared by combat checkpoints and the outcome carried through the film.
 * Only validated fields enter the state; rules and animation timers are rebuilt. */
function restoreBattle(state, battle, version) {
  if (!battle) return false;
  if (version >= 4 && version < 6 && !isValidLegacyArena(battle.arena)) return false;
  const arena = version >= 6 ? battle.arena : version >= 4 ? completeArena({
    player: battle.arena.player, enemy: battle.arena.enemy, enemyFacing: battle.arena.enemyFacing,
  }) : createArena();
  const rngState = version >= 5 ? battle.rngState : LEGACY_RNG_SEED;
  const savedEnemyMaxHealth = version >= 6 ? battle.enemyMaxHealth : 300;
  const eiraHealth = version >= 6 ? battle.eira?.health : state.eira.maxHealth;
  const eiraNext = version >= 6 ? battle.eiraNext : battle.playerNext;
  const eiraCycle = version >= 6 ? battle.eiraCycle : 0;
  const savedEnemyTarget = version >= 6 ? battle.enemyTarget : 'player';
  if (!isValidArena(arena) || !integer(rngState, 0, 0xffffffff)) return false;
  if (!['playing', 'won', 'lost'].includes(battle.status)
    || !integer(battle.health, 0, state.maxHealth) || !integer(battle.stamina, 0, state.maxStamina)
    || !integer(savedEnemyMaxHealth, 1, 1000000) || !integer(battle.enemyHealth, 0, savedEnemyMaxHealth)
    || !integer(eiraHealth, 0, state.eira.maxHealth)
    || !finite(battle.playerNext, 0, 1000000) || !finite(battle.enemyNext, 0, 1000000)
    || !finite(eiraNext, 0, 1000000) || !integer(eiraCycle, 0, 1000000)
    || !['player', 'eira'].includes(savedEnemyTarget) || !integer(battle.enemyCycle, 0, 1000000)) return false;
  if (battle.status === 'playing' && (battle.health === 0 || battle.enemyHealth === 0 || battle.playerNext > battle.enemyNext + 1e-8
    || (eiraHealth > 0 && battle.playerNext > eiraNext + 1e-8))) return false;
  if (battle.status === 'won' && (battle.enemyHealth !== 0 || battle.health === 0)) return false;
  if (battle.status === 'lost' && battle.health !== 0) return false;
  if (!battle.stats) return false;
  const stats = Object.fromEntries(Object.keys(state.stats).map(key => [key,
    (version < 5 && key === 'dodges') || (version < 6 && key.startsWith('eira')) ? 0 : battle.stats[key],
  ]));
  if (Object.values(stats).some(count => !integer(count, 0, 1000000000))) return false;
  const log = Array.isArray(battle.log) ? battle.log.slice(-8)
    .filter(entry => entry && ['player', 'enemy', 'eira', 'system'].includes(entry.actor) && typeof entry.text === 'string')
    .map((entry, index) => ({ id: index + 1, actor: entry.actor, text: entry.text.slice(0, 200) })) : [];
  const enemyHealth = battle.enemyHealth === 0 ? 0 : Math.max(1, Math.round(battle.enemyHealth / savedEnemyMaxHealth * state.enemyMaxHealth));
  Object.assign(state, {
    status: battle.status, health: battle.health, stamina: battle.stamina, enemyHealth,
    playerNext: battle.playerNext, enemyNext: battle.enemyNext, enemyCycle: battle.enemyCycle,
    eira: { ...state.eira, health: eiraHealth }, eiraNext, eiraCycle,
    enemyTarget: eiraHealth > 0 ? savedEnemyTarget : 'player', enemyIntent: getEnemyIntent(battle.enemyCycle), block: false,
    arena: copyArena(arena), rngState, enemyBlock: false, motion: null, reaction: null, enemyBlockTimer: 0,
    stats, turnNumber: stats.turns + 1, log, logId: log.length,
  });
  return true;
}

function battleFields(state) {
  return {
    status: state.status === 'paused' ? 'playing' : state.status,
    health: state.health, stamina: state.stamina, enemyHealth: state.enemyHealth, enemyMaxHealth: state.enemyMaxHealth,
    playerNext: state.playerNext, enemyNext: state.enemyNext, enemyCycle: state.enemyCycle,
    eira: { health: state.eira?.health }, eiraNext: state.eiraNext, eiraCycle: state.eiraCycle, enemyTarget: state.enemyTarget,
    stats: state.stats, log: state.log, arena: copyArena(state.arena), rngState: state.rngState,
  };
}

function captureBattle(state, profile) {
  if (!stable(state) || !isValidArena(state.arena) || !integer(state.rngState, 0, 0xffffffff)) return null;
  const checked = createGame(profile.attributes, 0);
  if (!restoreBattle(checked, battleFields(state), SAVE_VERSION)) return null;
  return battleFields(checked);
}

/** One checkpoint: conversation, film, combat decision or post-battle night. */
export function encodeCampaign(state, profile) {
  const selected = normalizeProfile(profile);
  const resumeScene = state.resumeScene === undefined ? 'battle' : state.resumeScene;
  const base = { version: SAVE_VERSION, profile: selected, resumeScene };
  if (['sanctuary', 'exploration'].includes(resumeScene) || (resumeScene === 'cinematic' && state.cinematic?.kind === 'firestorm')) {
    const origin = normalizeFirestormOrigin(state.cinematic?.origin);
    const battle = captureBattle(state, selected);
    const exploration = state.exploration == null ? null : normalizeExploration(state.exploration);
    if (state.cinematic?.kind !== 'firestorm' || !finite(state.cinematic.elapsed, 0, FIRESTORM_DURATION)
      || !origin || !battle || battle.status !== 'won' || !isSanctuaryDialogueId(state.sanctuaryDialogueId)
      || (state.exploration != null && !exploration)
      || ![undefined, null, FIRESTORM_LANDMARK].includes(state.discoveredLandmark)
      || (['sanctuary', 'exploration'].includes(resumeScene) && (state.cinematic.elapsed !== FIRESTORM_DURATION || state.discoveredLandmark !== FIRESTORM_LANDMARK))
      || (resumeScene === 'exploration' && (!exploration || state.sanctuaryDialogueId !== 'complete'))) return null;
    return JSON.stringify({ ...base, cinematic: { kind: 'firestorm', elapsed: state.cinematic.elapsed, origin }, battle,
      sanctuaryDialogueId: state.sanctuaryDialogueId,
      ...(exploration ? { exploration } : {}),
      ...(state.discoveredLandmark === FIRESTORM_LANDMARK ? { discoveredLandmark: FIRESTORM_LANDMARK } : {}) });
  }
  if (resumeScene === 'cinematic') {
    if (![undefined, 'camp'].includes(state.cinematic?.kind) || state.cinematic?.origin !== undefined
      || !finite(state.cinematic?.elapsed, 0, CINEMATIC_DURATION)) return null;
    return JSON.stringify({ ...base, cinematic: { elapsed: state.cinematic.elapsed } });
  }
  if (resumeScene === 'camp') {
    if (!isStoryNode(state.story?.nodeId)) return null;
    return JSON.stringify({ ...base, story: { nodeId: state.story.nodeId } });
  }
  if (resumeScene !== 'battle') return null;
  const battle = captureBattle(state, selected);
  return battle ? JSON.stringify({ ...base, battle }) : null;
}

export function decodeCampaign(serialized) {
  try {
    if (typeof serialized !== 'string' || serialized.length > 16000) return null;
    const value = JSON.parse(serialized);
    if (!value || ![1, 2, 3, 4, 5, 6, 7, 8, 9, SAVE_VERSION].includes(value.version) || !value.profile) return null;
    const profile = normalizeProfile(value.profile), state = createCampaign(profile);
    const resumeScene = value.version === 1 ? 'battle' : value.resumeScene;
    if (['sanctuary', 'exploration'].includes(resumeScene) || (resumeScene === 'cinematic' && value.cinematic?.kind === 'firestorm')) {
      const origin = normalizeFirestormOrigin(value.cinematic?.origin);
      const sanctuaryDialogueId = value.version >= 8 ? value.sanctuaryDialogueId : SANCTUARY_DIALOGUE_START;
      const exploration = value.version >= 9 && value.exploration != null ? normalizeExploration(value.exploration, value.version) : null;
      if (value.version < 7 || value.cinematic?.kind !== 'firestorm' || !finite(value.cinematic.elapsed, 0, FIRESTORM_DURATION)
        || !origin || !isSanctuaryDialogueId(sanctuaryDialogueId) || ![undefined, null, FIRESTORM_LANDMARK].includes(value.discoveredLandmark)
        || (value.version >= 9 && value.exploration != null && !exploration)
        || (['sanctuary', 'exploration'].includes(resumeScene) && (value.cinematic.elapsed !== FIRESTORM_DURATION || value.discoveredLandmark !== FIRESTORM_LANDMARK))
        || (resumeScene === 'exploration' && (value.version < 9 || !exploration || sanctuaryDialogueId !== 'complete'))
        || !restoreBattle(state, value.battle, value.version) || state.status !== 'won') return null;
      state.resumeScene = 'cinematic';
      state.sanctuaryDialogueId = sanctuaryDialogueId;
      state.exploration = exploration;
      state.cinematic = { kind: 'firestorm', elapsed: value.cinematic.elapsed, paused: true, origin };
      state.discoveredLandmark = value.discoveredLandmark === FIRESTORM_LANDMARK ? FIRESTORM_LANDMARK : null;
      if (state.cinematic.elapsed === FIRESTORM_DURATION) { finishFirestorm(state); state.scene = 'menu'; }
      if (resumeScene === 'exploration') {
        state.resumeScene = 'exploration';
        if (['travel', 'sleep'].includes(exploration.mode)) exploration.paused = true;
      }
      return { profile, state };
    }
    if (resumeScene === 'cinematic') {
      if (value.version < 3 || ![undefined, 'camp'].includes(value.cinematic?.kind) || value.cinematic?.origin !== undefined || value.battle !== undefined
        || !finite(value.cinematic?.elapsed, 0, CINEMATIC_DURATION)) return null;
      state.resumeScene = 'cinematic';
      state.cinematic = { ...createCinematic(), elapsed: value.cinematic.elapsed, paused: true };
      return { profile, state };
    }
    if (resumeScene === 'camp') {
      const oldNode = value.story?.nodeId;
      const nodeId = value.version === 2 && ['goodnight', 'morning'].includes(oldNode) ? 'company' : oldNode;
      if (!isStoryNode(nodeId)) return null;
      state.resumeScene = 'camp'; state.story = { nodeId };
      return { profile, state };
    }
    if (resumeScene !== 'battle' || !restoreBattle(state, value.battle, value.version)) return null;
    return { profile, state };
  } catch { return null; }
}
