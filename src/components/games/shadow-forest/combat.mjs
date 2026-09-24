/** Turn-based rules. Wall-clock time only completes already chosen animations. */
import { createArena, getAutoMovement, getArenaView, angleBetween } from './spatial.mjs';
const EPSILON = 1e-8;
const ENEMY_INITIATIVE = 24;
const TIMER_KEYS = ['attackTimer', 'dodgeTimer', 'hurtTimer', 'enemyHurtTimer', 'enemyBlockTimer', 'eiraHurtTimer', 'eiraBlockTimer', 'parryTimer', 'restTimer'];
export const ENEMY_MAX_HEALTH = 450;

export const BASE_ATTRIBUTE = 5;
export const ATTRIBUTE_POINTS = 6;
export const DEFAULT_ATTRIBUTES = Object.freeze({ strength: 7, speed: 7, vitality: 7, defense: 5 });
export const ATTRIBUTES = Object.freeze([
  { key: 'strength', label: 'Síla', description: 'Zvyšuje poškození seku i těžkého úderu.' },
  { key: 'speed', label: 'Obratnost', description: 'Zrychluje tahy a zvyšuje šanci automaticky uhnout útoku.' },
  { key: 'vitality', label: 'Odolnost', description: 'Přidává životy, zbroj a léčení při oddechu.' },
  { key: 'defense', label: 'Obrana', description: 'Zvyšuje šanci automaticky zachytit útok štítem.' },
]);
export const ACTIONS = Object.freeze({
  attack: { label: 'Sek', cost: 16, tempo: 100, description: 'Sám dojdeš na dosah a sekneš mečem.' },
  power: { label: 'Těžký úder', cost: 30, tempo: 150, description: 'Silnější úder, který hůře zastaví kryt. Další tah přijde později.' },
  rest: { label: 'Oddech', cost: 0, tempo: 90, description: 'Obnovíš výdrž a část životů. Pohyb a obranu řeší postava sama.' },
});
const ENEMY_PATTERN = Object.freeze([
  { kind: 'slash', label: 'Sek drápem', description: 'Strážce se přiblíží a sekne drápem. Obrana proběhne automaticky.', damage: 18, tempo: 100 },
  { kind: 'heavy', label: 'Drtivý úder', description: 'Silný, pomalý útok. Štít nebo úhyb závisí na tvých atributech.', damage: 30, tempo: 145 },
  { kind: 'recover', label: 'Nabírá dech', description: 'Příští tah nezaútočí. Čas zaútočit nebo odpočívat.', damage: 0, tempo: 90 },
]);
const intentAt = (cycle) => ({ ...ENEMY_PATTERN[cycle % ENEMY_PATTERN.length] });

// Save restoration derives enemy rules from the game, never from stored values.
export function getEnemyIntent(cycle = 0) {
  return intentAt(Number.isInteger(cycle) && cycle >= 0 ? cycle : 0);
}

/** Keep unspent points available; never silently invent points above the budget. */
export function normalizeAttributes(attributes = DEFAULT_ATTRIBUTES) {
  const source = attributes && typeof attributes === 'object' ? attributes : DEFAULT_ATTRIBUTES;
  const normalized = {};
  for (const { key } of ATTRIBUTES) {
    const value = source[key];
    normalized[key] = Number.isFinite(value)
      ? Math.max(BASE_ATTRIBUTE, Math.min(BASE_ATTRIBUTE + ATTRIBUTE_POINTS, Math.floor(value)))
      : DEFAULT_ATTRIBUTES[key];
  }
  let excess = Object.values(normalized).reduce((sum, value) => sum + value, 0) - (BASE_ATTRIBUTE * ATTRIBUTES.length + ATTRIBUTE_POINTS);
  // Trim the largest allocation first, with a stable tie-breaker.
  while (excess > 0) {
    const key = ATTRIBUTES.reduce((largest, item) => normalized[item.key] > normalized[largest] ? item.key : largest, ATTRIBUTES[0].key);
    normalized[key] -= 1;
    excess -= 1;
  }
  return normalized;
}

export function deriveHero(attributes = DEFAULT_ATTRIBUTES) {
  const { strength, speed, vitality, defense } = normalizeAttributes(attributes);
  return {
    maxHealth: 75 + vitality * 7,
    attackDamage: 13 + strength * 3,
    powerDamage: 23 + strength * 5,
    initiative: 10 + speed * 2,
    armor: vitality - 4,
    dodgeChance: 10 + (speed - BASE_ATTRIBUTE) * 2,
    blockChance: 18 + (defense - BASE_ATTRIBUTE) * 4,
    guardPercent: 70,
    restRecovery: 32,
    restHealing: 7 + vitality,
  };
}

export function deriveEira() {
  return { health: 100, maxHealth: 100, initiative: 18, tempo: 110, damage: 18,
    armor: 2, dodgeChance: 14, blockChance: 16, guardPercent: 60 };
}

function initialSeed(seed) {
  if (Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff) return seed;
  if (globalThis.crypto?.getRandomValues) return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  return Math.floor(Math.random() * 0x100000000) >>> 0;
}

/** The saved generator is used only to commit an enemy target or a defense.
 * Previews, movement, rendering and decision time never consume it. */
function randomPercent(state) {
  state.rngState = (state.rngState + 0x6d2b79f5) >>> 0;
  let value = state.rngState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 0x100000000 * 100;
}

function defenseReaction(state, actor, attacker, impactAt, duration) {
  const roll = randomPercent(state);
  const defender = actor === 'player' ? state.hero : actor === 'eira' ? state.eira : { dodgeChance: 8, blockChance: 18 };
  return { actor, attacker, kind: roll < defender.dodgeChance ? 'dodge' : roll < defender.dodgeChance + defender.blockChance ? 'block' : 'hit',
    side: (state.stats.turns + state.enemyCycle + state.eiraCycle) % 2 === 0 ? -1 : 1, time: 0, duration, impactAt };
}

export function createGame(attributes = DEFAULT_ATTRIBUTES, seed) {
  const selected = normalizeAttributes(attributes);
  const hero = deriveHero(selected);
  return {
    status: 'ready', turn: 'player', turnNumber: 1,
    attributes: selected, hero,
    health: hero.maxHealth, maxHealth: hero.maxHealth,
    stamina: 100, maxStamina: 100,
    enemyHealth: ENEMY_MAX_HEALTH, enemyMaxHealth: ENEMY_MAX_HEALTH,
    playerNext: 0, enemyNext: 0, enemyInitiative: ENEMY_INITIATIVE,
    eira: deriveEira(), eiraNext: 0, eiraCycle: 0,
    enemyIntent: intentAt(0), enemyCycle: 0, enemyTarget: 'player',
    rngState: initialSeed(seed), reaction: null, facingMotion: null, combatHome: null,
    arena: createArena(), motion: null, enemyBlock: false, enemyBlockTimer: 0,
    pendingAction: null, playerFollowup: null, enemyFollowup: null, eiraFollowup: null,
    elapsed: 0, phase: 'idle', phaseTime: 0, phaseDuration: 1,
    resolutionTimer: 0, lastAction: null,
    attackTimer: 0, attackDuration: 0.48, attackCooldown: 0,
    dodgeTimer: 0, dodgeDuration: 0.55, dodgeCooldown: 0,
    hurtTimer: 0, enemyHurtTimer: 0, eiraHurtTimer: 0, eiraBlockTimer: 0, parryTimer: 0, restTimer: 0,
    guardCooldown: 0, block: false, strikeResolved: false,
    events: [], log: [], logId: 0,
    stats: { hits: 0, blocks: 0, dodges: 0, parries: 0, turns: 0, damageDealt: 0, damageTaken: 0,
      eiraHits: 0, eiraBlocks: 0, eiraDodges: 0, eiraDamageDealt: 0, eiraDamageTaken: 0 },
  };
}

export function startGame(state, attributes = state.attributes, seed) {
  Object.assign(state, createGame(attributes, seed), { status: 'playing' });
  return state;
}

function emit(state, type, text, amount, audio, actors) {
  state.events.push({ type, ...(text ? { text } : {}), ...(amount === undefined ? {} : { amount }), ...(audio ? { audio } : {}), ...actors });
}

function addLog(state, actor, text) {
  state.log.push({ id: ++state.logId, actor, text });
  if (state.log.length > 8) state.log.splice(0, state.log.length - 8);
}

function finish(state, status) {
  state.status = status;
  state.block = false;
  state.resolutionTimer = 0;
  state.pendingAction = null;
  state.reaction = null;
  state.facingMotion = null;
  state.combatHome = null;
  state.playerFollowup = null;
  state.motion = null;
  state.enemyFollowup = null;
  state.eiraFollowup = null;
  state.enemyBlock = false;
  const text = status === 'won' ? 'Hvozd je zase v bezpečí.' : 'Strážce tě přemohl. Zkus jinou taktiku.';
  emit(state, status === 'won' ? 'win' : 'lose', text);
  addLog(state, 'system', text);
}

export function getActionInfo(state, kind) {
  const action = Object.hasOwn(ACTIONS, kind) ? ACTIONS[kind] : null;
  if (!action) return { label: '', cost: 0, tempo: 0, damage: 0, description: '', disabled: true, reason: 'Neznámá akce.' };
  let reason = '';
  if (state.status !== 'playing') reason = state.status === 'paused' ? 'Hra je pozastavená.' : 'Nejdřív zahaj souboj.';
  else if (state.turn !== 'player') reason = 'Počkej na svůj tah.';
  else if (state.stamina < action.cost) reason = 'Chybí výdrž. Zvol oddech.';
  return {
    ...action,
    damage: kind === 'attack' || kind === 'power' ? playerDamage(state, kind) : 0,
    movementHint: '',
    disabled: Boolean(reason), reason,
  };
}

function playerDamage(state, kind) {
  return kind === 'power' ? state.hero.powerDamage : state.hero.attackDamage;
}

function damageEnemy(state, damage) {
  const actual = Math.min(state.enemyHealth, damage);
  state.enemyHealth -= actual;
  state.stats.damageDealt += actual;
  state.enemyHurtTimer = 0.3;
  return actual;
}

function changePhase(state, phase, duration) {
  state.phase = phase;
  state.phaseTime = 0;
  state.phaseDuration = duration;
}

function startMotion(state, actor, kind, target, duration) {
  state.motion = { actor, kind, from: { ...state.arena[actor] }, to: { ...target.to }, time: 0, duration,
    ...(target.center ? { center: { ...target.center }, angleDelta: target.angleDelta } : {}) };
}

function finishMotion(state) {
  if (!state.motion) return;
  state.arena[state.motion.actor] = { ...state.motion.to };
  state.motion = null;
}

function faceEnemy(state, target) {
  state.facingMotion = { from: getArenaView(state).enemyFacing,
    to: angleBetween(state.arena.enemy, state.arena[target]), time: 0, duration: .26 };
}

function startPlayerSwing(state) {
  const kind = state.lastAction;
  state.playerFollowup = 'withdraw';
  state.resolutionTimer = kind === 'power' ? .72 : .52;
  state.attackDuration = state.resolutionTimer;
  state.attackTimer = state.attackDuration;
  state.pendingAction = { kind, remaining: kind === 'power' ? .4 : .28 };
  state.reaction = defenseReaction(state, 'enemy', 'player', state.pendingAction.remaining, state.attackDuration);
  changePhase(state, 'idle', 1);
  emit(state, 'swing');
}

function finishPlayerPhase(state) {
  finishMotion(state);
  if (state.playerFollowup === 'strike') startPlayerSwing(state);
  else if (state.playerFollowup === 'withdraw') {
    state.playerFollowup = null;
    const movement = getAutoMovement(state, 'withdraw');
    if (movement) {
      startMotion(state, 'player', movement.kind, movement, movement.duration);
      state.resolutionTimer = movement.duration;
      changePhase(state, 'move', movement.duration);
      emit(state, 'approach_step', undefined, undefined, { gain: .3 });
    } else beginNextTurn(state);
  } else beginNextTurn(state);
}

function resolvePlayerStrike(state) {
  const action = state.pendingAction;
  state.pendingAction = null;
  if (!action) return;
  const outcome = state.reaction.kind;
  if (outcome === 'dodge') {
    emit(state, 'dodge', 'Strážce uhnul meči.');
    addLog(state, 'player', `${ACTIONS[action.kind].label}: strážce uhnul, bez poškození.`);
    return;
  }
  const blocked = outcome === 'block';
  const base = playerDamage(state, action.kind);
  const damage = damageEnemy(state, blocked ? Math.max(1, Math.round(base * (action.kind === 'power' ? .7 : .4))) : base);
  state.stats.hits += 1;
  if (blocked) {
    state.enemyHurtTimer = 0;
    state.enemyBlockTimer = .42;
    emit(state, 'block', 'Strážce zachytil část úderu!', damage);
  } else emit(state, 'hit', action.kind === 'power' ? 'Těžký úder!' : 'Zásah mečem!', damage);
  addLog(state, 'player', `${ACTIONS[action.kind].label}${blocked ? ' do krytu' : ''}: ${damage} poškození.`);
  if (state.enemyHealth === 0) finish(state, 'won');
}

export function chooseAction(state, kind) {
  const action = getActionInfo(state, kind);
  // Reject repeated taps and unavailable actions without changing any state.
  if (action.disabled) return false;
  const movement = getAutoMovement(state, kind);
  state.combatHome = { actor: 'player', position: { ...state.arena.player } };
  state.stamina -= action.cost;
  state.stats.turns += 1;
  state.lastAction = kind;
  state.turn = 'resolving';
  state.playerNext += action.tempo / state.hero.initiative;
  state.resolutionTimer = kind === 'rest' ? .65 : .52;
  state.pendingAction = null;
  state.playerFollowup = null;
  state.attackTimer = 0;
  changePhase(state, 'idle', 1);

  if (kind === 'attack' || kind === 'power') {
    faceEnemy(state, 'player');
    if (movement) state.playerFollowup = 'strike';
    else startPlayerSwing(state);
  } else {
    const recovered = Math.min(state.hero.restRecovery, state.maxStamina - state.stamina);
    const healed = Math.min(state.hero.restHealing, state.maxHealth - state.health);
    state.stamina += recovered;
    state.health += healed;
    state.restTimer = 0.65;
    emit(state, 'rest', `Oddech: +${recovered} výdrže, +${healed} životů.`, recovered);
    addLog(state, 'player', `Oddech: +${recovered} výdrže, +${healed} životů.`);
  }
  if (movement) {
    startMotion(state, 'player', movement.kind, movement, movement.duration);
    state.resolutionTimer = movement.duration;
    changePhase(state, movement.kind === 'approach' ? 'approach' : 'move', movement.duration);
    emit(state, 'approach_step', undefined, undefined, { gain: .4 });
    emit(state, 'cloth_rustle', undefined, undefined, { gain: .35 });
    if (movement.kind === 'approach') addLog(state, 'player', 'Přicházíš na dosah a připravuješ úder.');
  }
  return true;
}

export function togglePause(state) {
  if (state.status === 'playing') { state.status = 'paused'; return true; }
  if (state.status === 'paused') { state.status = 'playing'; return true; }
  return false;
}

function beginNextTurn(state) {
  state.reaction = null;
  state.combatHome = null;
  const eiraNext = state.eira.health > 0 ? state.eiraNext : Infinity;
  if (state.playerNext <= state.enemyNext + EPSILON && state.playerNext <= eiraNext + EPSILON) {
    state.turn = 'player';
    state.turnNumber = state.stats.turns + 1;
    state.stamina = Math.min(state.maxStamina, state.stamina + 8);
    changePhase(state, 'idle', 1);
    return;
  }
  if (eiraNext <= state.enemyNext + EPSILON) {
    state.turn = 'eira';
    state.strikeResolved = false;
    state.eiraNext += state.eira.tempo / state.eira.initiative;
    state.eiraFollowup = null;
    state.combatHome = { actor: 'eira', position: { ...state.arena.eira } };
    faceEnemy(state, 'eira');
    const movement = getAutoMovement(state, 'attack', 'eira');
    if (movement) {
      startMotion(state, 'eira', 'approach', movement, movement.duration);
      changePhase(state, 'approach', movement.duration);
      emit(state, 'approach_step', 'Eira přichází s mečem.', undefined, { gain: .35, pan: -.65 }, { actor: 'eira', target: 'enemy' });
    } else startEiraWindup(state);
    return;
  }
  state.turn = 'enemy';
  state.strikeResolved = false;
  state.enemyNext += state.enemyIntent.tempo / state.enemyInitiative;
  state.enemyBlock = false;
  state.enemyFollowup = null;
  state.combatHome = { actor: 'enemy', position: { ...state.arena.enemy } };
  if (state.enemyIntent.kind === 'recover') {
    changePhase(state, 'recover', 0.65);
    emit(state, 'rest', 'Strážce nabírá dech. Tentokrát neútočí.');
    addLog(state, 'enemy', 'Strážce nabírá dech a tento tah neútočí.');
  } else {
    // A companion who is the only one attacking draws more attention; resting
    // cannot outsource the whole fight to Eira while keeping her untouchable.
    state.enemyTarget = state.eira.health > 0 && randomPercent(state) < (state.lastAction === 'rest' ? 70 : 40) ? 'eira' : 'player';
    addLog(state, 'enemy', state.enemyTarget === 'eira' ? 'Strážce se obrací na Eiru.' : 'Strážce se obrací k tobě.');
    prepareEnemyAttack(state);
  }
}

function prepareEnemyAttack(state) {
  faceEnemy(state, state.enemyTarget);
  const movement = getAutoMovement(state, 'attack', 'enemy');
  if (movement) {
    startMotion(state, 'enemy', 'approach', movement, movement.duration);
    changePhase(state, 'approach', movement.duration);
    emit(state, 'approach_step', 'Strážce se přibližuje.', undefined, { gain: .85 });
    return;
  }
  const target = { to: { ...state.arena.enemy } };
  startMotion(state, 'enemy', 'turn', target, .26);
  changePhase(state, 'approach', .26);
}

function startEnemyWindup(state) {
  const windup = state.enemyIntent.kind === 'heavy' ? .72 : .48;
  state.reaction = defenseReaction(state, state.enemyTarget, 'enemy', windup + .24, windup + .24 + .3);
  changePhase(state, 'windup', windup);
  emit(state, 'windup', `${state.enemyIntent.label}${state.enemyTarget === 'eira' ? ' na Eiru' : ' na tebe'}.`, undefined,
    { pan: state.enemyTarget === 'eira' ? -.5 : 0 }, { actor: 'enemy', target: state.enemyTarget });
}

function startEiraWindup(state) {
  state.reaction = defenseReaction(state, 'enemy', 'eira', .64, .92);
  changePhase(state, 'windup', .42);
  emit(state, 'cloth_rustle', 'Eira se napřahuje.', undefined, { gain: .25, pan: -.6 }, { actor: 'eira', target: 'enemy' });
}

function resolveEiraStrike(state) {
  if (state.strikeResolved) return;
  state.strikeResolved = true;
  const kind = state.reaction.kind;
  if (kind === 'dodge') {
    emit(state, 'dodge', 'Strážce uhnul Eiřinu meči.', undefined, { gain: .4, pan: -.35 }, { actor: 'eira', target: 'enemy' });
    addLog(state, 'eira', 'Eira sekla, ale strážce uhnul.');
    return;
  }
  const damage = damageEnemy(state, kind === 'block' ? Math.max(1, Math.round(state.eira.damage * .4)) : state.eira.damage);
  state.stats.eiraDamageDealt += damage;
  state.stats.eiraHits += 1;
  if (kind === 'block') { state.enemyBlockTimer = .42; state.enemyHurtTimer = 0; }
  emit(state, kind === 'block' ? 'block' : 'hit', kind === 'block' ? 'Strážce kryje Eiřin sek!' : 'Eira zasáhla mečem!', damage,
    { gain: .55, pan: -.35 }, { actor: 'eira', target: 'enemy' });
  addLog(state, 'eira', `Eiřin sek${kind === 'block' ? ' do krytu' : ''}: ${damage} poškození.`);
  if (state.enemyHealth === 0) finish(state, 'won');
}

function resolveEnemyStrike(state) {
  if (state.strikeResolved) return;
  state.strikeResolved = true;
  const outcome = state.reaction.kind;
  const eiraTarget = state.enemyTarget === 'eira';
  const defender = eiraTarget ? state.eira : state.hero;
  const audio = eiraTarget ? { gain: .55, pan: -.65 } : undefined;
  const actors = { actor: 'enemy', target: state.enemyTarget };
  if (outcome === 'dodge') {
    state.stats[eiraTarget ? 'eiraDodges' : 'dodges'] += 1;
    emit(state, 'dodge', eiraTarget ? 'Eira uhnula drápům!' : 'Uhnul jsi drápům!', undefined, audio, actors);
    addLog(state, 'enemy', `${state.enemyIntent.label}: ${eiraTarget ? 'Eira uhnula' : 'automaticky jsi uhnul'}, bez poškození.`);
    return;
  }
  const rawDamage = Math.max(1, state.enemyIntent.damage - defender.armor);
  const protectedByGuard = outcome === 'block';
  const damage = Math.min(eiraTarget ? state.eira.health : state.health,
    protectedByGuard ? Math.max(1, Math.ceil(rawDamage * (1 - defender.guardPercent / 100))) : rawDamage);
  if (eiraTarget) state.eira.health -= damage;
  else state.health -= damage;
  state.stats[eiraTarget ? 'eiraDamageTaken' : 'damageTaken'] += damage;
  state[eiraTarget ? 'eiraHurtTimer' : 'hurtTimer'] = protectedByGuard ? 0 : .35;
  if (protectedByGuard) {
    state.stats[eiraTarget ? 'eiraBlocks' : 'blocks'] += 1;
    state[eiraTarget ? 'eiraBlockTimer' : 'parryTimer'] = .42;
    emit(state, 'block', eiraTarget ? 'Eira zachytila útok!' : 'Zachyceno štítem!', damage, audio, actors);
    addLog(state, 'enemy', `${state.enemyIntent.label}: ${eiraTarget ? 'Eiřin kryt' : 'automatický kryt'} snížil zásah na ${damage}.`);
  } else {
    emit(state, eiraTarget ? 'hit' : 'hurt', eiraTarget ? 'Eira dostala zásah!' : state.enemyIntent.label, damage, audio, actors);
    addLog(state, 'enemy', `${state.enemyIntent.label}: ${eiraTarget ? 'Eira ztrácí' : 'ztrácíš'} ${damage} životů.`);
  }
  if (eiraTarget && state.eira.health === 0) {
    emit(state, 'cloth_rustle', 'Eira je zraněná. Dál bojuješ sám.', undefined, { gain: .45, pan: -.65 }, { actor: 'eira', target: 'eira', outcome: 'down' });
    addLog(state, 'eira', 'Eira klesla zraněná k zemi. Už nemůže bojovat.');
  }
  if (state.health === 0) finish(state, 'lost');
}

function finishEnemyTurn(state) {
  if (state.eira.health === 0) state.enemyTarget = 'player';
  state.enemyCycle += 1;
  state.enemyIntent = intentAt(state.enemyCycle);
  beginNextTurn(state);
}

function finishNpcTurn(state) {
  if (state.turn === 'eira') { state.eiraCycle += 1; state.eiraFollowup = null; beginNextTurn(state); }
  else finishEnemyTurn(state);
}

function advanceNpcPhase(state) {
  const eiraTurn = state.turn === 'eira';
  if (state.phase === 'approach' || state.phase === 'move') {
    const approaching = state.phase === 'approach';
    finishMotion(state);
    state.enemyFollowup = null;
    state.eiraFollowup = null;
    if (approaching) { if (eiraTurn) startEiraWindup(state); else startEnemyWindup(state); }
    else finishNpcTurn(state);
  } else if (state.phase === 'windup') {
    changePhase(state, 'strike', eiraTurn ? .22 : .24);
    if (eiraTurn) emit(state, 'swing', undefined, undefined, { gain: .5, pan: -.6 }, { actor: 'eira', target: 'enemy' });
  } else if (state.phase === 'strike') {
    // The hit lands at the end of the visible swing, never at windup start.
    if (eiraTurn) resolveEiraStrike(state); else resolveEnemyStrike(state);
    if (state.status === 'playing') changePhase(state, 'recover', eiraTurn ? .28 : .3);
  } else {
    const actor = eiraTurn ? 'eira' : 'enemy';
    const movement = !eiraTurn && state.enemyIntent.kind === 'recover' ? null : getAutoMovement(state, 'withdraw', actor);
    if (movement) {
      state[eiraTurn ? 'eiraFollowup' : 'enemyFollowup'] = 'finish';
      startMotion(state, actor, movement.kind, movement, movement.duration);
      changePhase(state, 'move', movement.duration);
      emit(state, 'approach_step', undefined, undefined, { gain: eiraTurn ? .3 : .6, pan: eiraTurn ? -.6 : 0 });
    } else finishNpcTurn(state);
  }
}

/** Preview repeats the highlighted player action; choosing another action replans it. */
export function getTurnOrder(state, actionKind = 'attack', count = 5) {
  if (state.status === 'won' || state.status === 'lost') return [];
  const limit = Number.isFinite(count) ? Math.max(0, Math.min(20, Math.floor(count))) : 5;
  const action = Object.hasOwn(ACTIONS, actionKind) ? ACTIONS[actionKind] : ACTIONS.attack;
  let playerNext = state.playerNext;
  let enemyNext = state.enemyNext;
  let eiraNext = state.eira.health > 0 ? state.eiraNext : Infinity;
  let cycle = state.enemyCycle;
  const order = [];
  if (state.turn === 'enemy' && order.length < limit) {
    order.push('enemy');
    cycle += 1; // Its place on the timeline was reserved when its animation began.
  }
  else if (state.turn === 'eira' && order.length < limit) order.push('eira');
  while (order.length < limit) {
    if (playerNext <= enemyNext + EPSILON && playerNext <= eiraNext + EPSILON) {
      order.push('player');
      playerNext += action.tempo / state.hero.initiative;
    } else if (eiraNext <= enemyNext + EPSILON) {
      order.push('eira');
      eiraNext += state.eira.tempo / state.eira.initiative;
    } else {
      order.push('enemy');
      enemyNext += intentAt(cycle).tempo / state.enemyInitiative;
      cycle += 1;
    }
  }
  return order;
}

export function stepGame(state, dt) {
  if (state.status !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
  // Background tabs may skip animation frames, but never get free combat turns.
  let remaining = Math.min(dt, 0.25);
  while (remaining > EPSILON && state.status === 'playing') {
    const untilTransition = state.turn === 'resolving'
      ? Math.min(state.resolutionTimer, state.pendingAction?.remaining ?? Infinity)
      : state.turn === 'enemy' || state.turn === 'eira' ? state.phaseDuration - state.phaseTime : Infinity;
    if (untilTransition <= EPSILON) {
      if (state.turn === 'resolving') {
        if (state.pendingAction?.remaining <= EPSILON) resolvePlayerStrike(state);
        if (state.status === 'playing' && state.resolutionTimer <= EPSILON) finishPlayerPhase(state);
      }
      else advanceNpcPhase(state);
      continue;
    }
    const delta = Math.min(remaining, untilTransition);
    state.elapsed += delta;
    for (const key of TIMER_KEYS) state[key] = Math.max(0, state[key] - delta);
    if (state.facingMotion) {
      state.facingMotion.time = Math.min(state.facingMotion.duration, state.facingMotion.time + delta);
      if (state.facingMotion.time >= state.facingMotion.duration - EPSILON) {
        state.arena.enemyFacing = state.facingMotion.to;
        state.facingMotion = null;
      }
    }
    if (state.reaction) {
      state.reaction.time = Math.min(state.reaction.duration, state.reaction.time + delta);
      if (state.reaction.time >= state.reaction.duration - EPSILON) state.reaction = null;
    }
    if (state.motion) state.motion.time = Math.min(state.motion.duration, state.motion.time + delta);
    if (state.turn === 'resolving') {
      state.resolutionTimer = Math.max(0, state.resolutionTimer - delta);
      if (state.pendingAction) state.pendingAction.remaining = Math.max(0, state.pendingAction.remaining - delta);
    }
    if (state.turn === 'enemy' || state.turn === 'eira') state.phaseTime += delta;
    remaining -= delta;
    if (state.turn === 'resolving' && state.pendingAction?.remaining <= EPSILON) resolvePlayerStrike(state);
    if (state.status !== 'playing') break;
    if (state.turn === 'resolving' && state.resolutionTimer <= EPSILON) finishPlayerPhase(state);
    else if ((state.turn === 'enemy' || state.turn === 'eira') && state.phaseTime + EPSILON >= state.phaseDuration) advanceNpcPhase(state);
  }
}
