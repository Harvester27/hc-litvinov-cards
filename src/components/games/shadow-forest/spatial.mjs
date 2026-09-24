export const MELEE_RANGE = 1.9;
export const MIN_DISTANCE = 1.25;
export const MAX_DISTANCE = 4.8;
export const ARENA_RADIUS = 5.5;
export const STEP_DISTANCE = 1.35;
export const ORBIT_ANGLE = Math.PI / 6;
const EPSILON = 1e-7;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const point = value => value && Number.isFinite(value.x) && Number.isFinite(value.z);
export const angleBetween = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
export const wrapAngle = angle => Math.atan2(Math.sin(angle), Math.cos(angle));
export const distanceBetween = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export function createArena() {
  return { player: { x: 0, z: 3.2 }, enemy: { x: 0, z: 0 }, eira: { x: -1.8, z: .65 }, enemyFacing: 0 };
}

export function isValidLegacyArena(value) {
  if (!value || !point(value.player) || !point(value.enemy)
    || !Number.isFinite(value.enemyFacing) || Math.abs(value.enemyFacing) > Math.PI + EPSILON) return false;
  const distance = distanceBetween(value.player, value.enemy);
  return [value.player, value.enemy].every(position => Math.hypot(position.x, position.z) <= ARENA_RADIUS + EPSILON)
    && distance >= MIN_DISTANCE - EPSILON && distance <= MAX_DISTANCE + EPSILON;
}

export function isValidArena(value) {
  return Boolean(value && Number.isFinite(value.enemyFacing) && Math.abs(value.enemyFacing) <= Math.PI + EPSILON
    && [value.player, value.enemy, value.eira].every(position => point(position) && Math.hypot(position.x, position.z) <= ARENA_RADIUS + EPSILON));
}

/** Legacy arenas retain both original actors. Only the companion is added;
 * corrupt positions are rejected rather than silently resetting progress. */
export function completeArena(value) {
  if (value?.eira !== undefined) return isValidArena(value) ? { player: { ...value.player }, enemy: { ...value.enemy }, eira: { ...value.eira }, enemyFacing: value.enemyFacing } : null;
  if (!isValidLegacyArena(value)) return null;
  const result = { player: { ...value.player }, enemy: { ...value.enemy }, enemyFacing: value.enemyFacing };
  const angle = angleBetween(value.enemy, value.player);
  for (const [side, forward] of [[-1.8, .65], [-1.55, .5], [-1.25, .3], [-1.25, -.3], [-.9, 1], [.9, 1]]) {
    const eira = boundedPoint({ x: value.enemy.x + Math.sin(angle) * forward + Math.cos(angle) * side,
      z: value.enemy.z + Math.cos(angle) * forward - Math.sin(angle) * side });
    if (isValidArena({ ...result, eira }) && distanceBetween(eira, value.player) >= .65
      && distanceBetween(eira, value.enemy) >= MIN_DISTANCE - EPSILON) return { ...result, eira };
  }
  return null;
}

function arenaOf(state) {
  const arena = state?.arena;
  return isValidArena(arena) ? arena : completeArena(arena) ?? createArena();
}

function boundedPoint(position) {
  const radius = Math.hypot(position.x, position.z);
  const ratio = radius > ARENA_RADIUS ? ARENA_RADIUS / radius : 1;
  return { x: position.x * ratio, z: position.z * ratio };
}

export function getMovementTarget(state, kind, actor = 'player', options = {}) {
  const arena = arenaOf(state);
  const from = arena[actor];
  const other = arena[options.target ?? (actor === 'enemy' ? state.enemyTarget ?? 'player' : 'enemy')];
  const distance = distanceBetween(from, other);
  const angle = angleBetween(other, from);
  const orbiting = ['left', 'right', 'circle'].includes(kind);
  if (orbiting) {
    const angleDelta = options.angleDelta ?? (kind === 'left' ? -ORBIT_ANGLE : kind === 'right' ? ORBIT_ANGLE : -ORBIT_ANGLE * .85);
    const to = { x: other.x + Math.sin(angle + angleDelta) * distance, z: other.z + Math.cos(angle + angleDelta) * distance };
    if (Math.hypot(to.x, to.z) > ARENA_RADIUS + EPSILON) return null;
    const outward = angleBetween({ x: 0, z: 0 }, other);
    const offset = wrapAngle(outward - angle);
    if (offset * angleDelta >= 0 && Math.abs(offset) <= Math.abs(angleDelta)
      && Math.hypot(other.x, other.z) + distance > ARENA_RADIUS + EPSILON) return null;
    return { to, center: { ...other }, angleDelta };
  }
  const desired = kind === 'engage' || kind === 'approach' ? Math.min(distance, options.range ?? 1.75)
    : kind === 'advance' ? Math.max(MIN_DISTANCE, distance - STEP_DISTANCE)
      : Math.min(MAX_DISTANCE, distance + (options.distance ?? (actor === 'enemy' ? 1 : STEP_DISTANCE)));
  const to = boundedPoint({ x: other.x + Math.sin(angle) * desired, z: other.z + Math.cos(angle) * desired });
  const resultDistance = distanceBetween(to, other);
  if (resultDistance < MIN_DISTANCE - EPSILON || resultDistance > MAX_DISTANCE + EPSILON
    || distanceBetween(from, to) < (kind === 'engage' || kind === 'approach' ? EPSILON : .04)) return null;
  if (kind === 'retreat' && resultDistance <= distance + .04) return null;
  return { to };
}

/** Position is choreography, not a combat advantage. Both attackers close the
 * entire gap in their current turn; a short withdrawal separates the actors
 * afterwards. Clearing edges can shorten that purely visual withdrawal. */
export function getAutoMovement(state, kind, actor = 'player') {
  const arena = arenaOf(state);
  const targetActor = actor === 'enemy' ? state.enemyTarget ?? 'player' : 'enemy';
  const distance = distanceBetween(arena[actor], arena[targetActor]);
  const range = actor === 'eira' ? 1.3 : targetActor === 'eira' ? 1.35 : 1.75;
  if (['attack', 'power', 'slash', 'heavy'].includes(kind) && distance > range + EPSILON) {
    const target = getMovementTarget(state, 'engage', actor, { range });
    return target ? { ...target, kind: 'approach', duration: Math.min(1.25, .3 + distanceBetween(arena[actor], target.to) * .24) } : null;
  }
  if (kind === 'withdraw' && state.combatHome?.actor === actor) {
    const to = state.combatHome.position;
    const travel = distanceBetween(arena[actor], to);
    return travel > EPSILON ? { to: { ...to }, kind: 'retreat', duration: Math.min(1.15, .3 + travel * .2) } : null;
  }
  return null;
}

/** Logical coordinates commit only when motion ends. This read-only view eases
 * the moving actor between them; orbit steps follow an arc of constant radius. */
export function getArenaView(state) {
  const arena = arenaOf(state);
  const player = { ...arena.player }, enemy = { ...arena.enemy }, eira = { ...arena.eira };
  const motion = state?.motion;
  const validMotion = motion && ['player', 'enemy', 'eira'].includes(motion.actor) && point(motion.from) && point(motion.to)
    && Number.isFinite(motion.time) && Number.isFinite(motion.duration) && motion.duration > 0;
  const moveProgress = validMotion ? clamp(motion.time / motion.duration, 0, 1) : 0;
  const eased = moveProgress * moveProgress * (3 - 2 * moveProgress);
  if (validMotion) {
    const target = motion.actor === 'player' ? player : motion.actor === 'eira' ? eira : enemy;
    if (point(motion.center) && Number.isFinite(motion.angleDelta)) {
      const radius = distanceBetween(motion.from, motion.center);
      const angle = angleBetween(motion.center, motion.from) + motion.angleDelta * eased;
      target.x = motion.center.x + Math.sin(angle) * radius;
      target.z = motion.center.z + Math.cos(angle) * radius;
    } else {
      target.x = motion.from.x + (motion.to.x - motion.from.x) * eased;
      target.z = motion.from.z + (motion.to.z - motion.from.z) * eased;
    }
  }
  const distance = distanceBetween(player, enemy);
  const orbit = angleBetween(enemy, player);
  const facing = state?.facingMotion;
  const facingProgress = facing ? clamp(facing.time / facing.duration, 0, 1) : 0;
  const enemyFacing = facing ? wrapAngle(facing.from + wrapAngle(facing.to - facing.from) * facingProgress * facingProgress * (3 - 2 * facingProgress)) : arena.enemyFacing;
  const flankAngle = wrapAngle(orbit - enemyFacing);
  return { player, enemy, eira, distance, orbit, enemyFacing, flankAngle, flanking: false,
    movingActor: validMotion ? motion.actor : null, moveProgress };
}

export function getPositionInfo(state) {
  const view = getArenaView(state);
  return { ...view, label: 'Pohyb při boji je automatický',
    inRange: view.distance <= MELEE_RANGE + EPSILON, enemyGuarding: state?.reaction?.actor === 'enemy' && state.reaction.kind === 'block' };
}
