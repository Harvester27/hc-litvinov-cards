const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };

/** Eira joins an exchange from the left wing; this never changes her saved position. */
export function getEiraStage(state) {
  const inactive = { amount: 0, moving: false, progress: 0, direction: 1, exchange: null };
  if (!state?.eira || ['won', 'lost'].includes(state.status)) return inactive;
  const attacking = state.turn === 'eira';
  const defending = state.turn === 'enemy' && state.enemyTarget === 'eira'
    && !(state.enemyIntent?.kind === 'recover' && !state.strikeResolved);
  if (!attacking && !defending) return inactive;
  const exchange = `${attacking ? 'eira' : 'enemy'}:${attacking ? state.eiraCycle : state.enemyCycle}`;
  const actor = attacking ? 'eira' : 'enemy';
  const motion = state.motion?.actor === actor ? state.motion : null;
  const progress = motion ? clamp(motion.time / Math.max(.01, motion.duration)) : 0;
  if (state.phase === 'approach' && motion) return { amount: smooth(progress), moving: true, progress, direction: 1, exchange };
  if (state.phase === 'move' && motion?.kind === 'retreat') return { amount: 1 - smooth(progress), moving: true, progress, direction: -1, exchange };
  return { amount: 1, moving: false, progress: 0, direction: 1, exchange };
}

/** Combat may clear motion on victory. Finish the visible exit on the paused-aware
 * renderer clock instead of removing an actor at the instant of the final hit. */
export function createEiraStaging() {
  let previous = null, bridge = null;
  return {
    update(state, time) {
      const target = getEiraStage(state);
      if (previous && target.exchange !== previous.exchange && Math.abs(target.amount - previous.amount) > .2) {
        bridge = { from: previous.amount, at: time, duration: target.amount > previous.amount ? .2 : .48 };
      }
      let result = target;
      if (bridge) {
        const progress = clamp((time - bridge.at) / bridge.duration);
        result = { ...target, amount: bridge.from + (target.amount - bridge.from) * smooth(progress),
          moving: progress < 1, progress, direction: target.amount >= bridge.from ? 1 : -1 };
        if (progress >= 1) bridge = null;
      }
      previous = result;
      return result;
    },
    reset() { previous = null; bridge = null; },
  };
}

/** The defender anticipates an already chosen result; this never decides a hit. */
export function getDefensiveReaction(state, reducedMotion = false) {
  const pose = { enemyBlock: 0, enemyDodge: 0, enemyDodgeSide: 1, enemyHop: 0, heroBlock: 0, heroDodge: 0, heroDodgeSide: -1, eiraBlock: 0, eiraDodge: 0, eiraDodgeSide: -1 };
  const reaction = state?.reaction;
  if (!reaction || !['player', 'enemy', 'eira'].includes(reaction.actor)
    || !Number.isFinite(reaction.time) || !Number.isFinite(reaction.impactAt)
    || !Number.isFinite(reaction.duration) || reaction.duration <= reaction.impactAt) return pose;
  const time = Math.max(0, reaction.time);
  const start = Math.max(0, reaction.impactAt - .3);
  const peak = Math.max(start + .01, reaction.impactAt - .045);
  const hold = reaction.impactAt + Math.min(.045, (reaction.duration - reaction.impactAt) * .2);
  const amount = smooth((time - start) / (peak - start)) * (1 - smooth((time - hold) / Math.max(.01, reaction.duration - hold)));
  const actor = reaction.actor === 'player' ? 'hero' : reaction.actor;
  const side = reaction.side === -1 ? -1 : 1;
  if (reaction.kind === 'block') pose[`${actor}Block`] = amount;
  if (reaction.kind === 'dodge') {
    pose[`${actor}Dodge`] = amount;
    pose[`${actor}DodgeSide`] = side;
    if (actor === 'enemy' && !reducedMotion) pose.enemyHop = Math.sin(clamp((time - start) / Math.max(.01, reaction.duration - start)) * Math.PI) * 7;
  }
  return pose;
}

/** Visual footwork is separate from saved arena coordinates, range and combat rules. */
export function getLivingArenaView(view, state, lifeTime = 0, reducedMotion = false, eiraStage = getEiraStage(state)) {
  const reaction = getDefensiveReaction(state, reducedMotion);
  const intro = smooth(lifeTime / 1.4);
  const life = reducedMotion ? 0 : intro;
  const sine = Math.sin(view.orbit || 0), cosine = Math.cos(view.orbit || 0);
  const playerSide = Math.sin(lifeTime * .62) * .09 * life;
  const playerBack = Math.sin(lifeTime * .83) * .027 * life;
  const enemySide = Math.sin(lifeTime * .47) * .13 * life;
  const enemyBack = Math.sin(lifeTime * .71) * .04 * life;
  const cameraDodge = reaction.heroDodge * (reducedMotion ? .045 : .25);
  const player = {
    x: view.player.x + cosine * (playerSide + cameraDodge * reaction.heroDodgeSide) + sine * (playerBack + cameraDodge),
    z: view.player.z - sine * (playerSide + cameraDodge * reaction.heroDodgeSide) + cosine * (playerBack + cameraDodge),
  };
  const enemy = { x: view.enemy.x + cosine * enemySide - sine * enemyBack, z: view.enemy.z - sine * enemySide - cosine * enemyBack };
  const eira = view.eira ? { ...view.eira } : null;
  if (eira) {
    eira.x += Math.sin(lifeTime * .68) * .04 * life;
    eira.z += Math.sin(lifeTime * .52) * .025 * life;
    const away = Math.atan2(eira.x - enemy.x, eira.z - enemy.z);
    eira.x += Math.sin(away) * reaction.eiraDodge * .6;
    eira.z += Math.cos(away) * reaction.eiraDodge * .6;
  }
  const subjectOrbit = Math.atan2(player.x - enemy.x, player.z - enemy.z);
  const target = state.reaction?.attacker === 'eira' && eira ? eira : player;
  const attackOrbit = Math.atan2(target.x - enemy.x, target.z - enemy.z);
  const rightX = Math.cos(attackOrbit), rightZ = -Math.sin(attackOrbit);
  const awayX = -Math.sin(attackOrbit), awayZ = -Math.cos(attackOrbit);
  const dodgeSide = reaction.enemyDodge * reaction.enemyDodgeSide * (reducedMotion ? .47 : .7);
  const dodgeBack = reaction.enemyDodge * (reducedMotion ? .7 : .9);
  const renderEnemy = { x: enemy.x + rightX * dodgeSide + awayX * dodgeBack, z: enemy.z + rightZ * dodgeSide + awayZ * dodgeBack };
  // Open the framing only while Eira joins an exchange. Reserving room for an
  // offscreen companion would cancel the perspective of either combatant's approach.
  const groupAmount = eira ? intro * eiraStage.amount : 0;
  const focus = eira ? { x: enemy.x + (view.eira.x - enemy.x) * .38 * groupAmount, z: enemy.z + (view.eira.z - enemy.z) * .38 * groupAmount } : enemy;
  const orbit = Math.atan2(player.x - focus.x, player.z - focus.z);
  const enemyFacing = eira ? view.enemyFacing : subjectOrbit;
  const flankAngle = Math.atan2(Math.sin(subjectOrbit - enemyFacing), Math.cos(subjectOrbit - enemyFacing));
  return {
    ...view, player, enemy, eira, framingEira: view.eira, renderEnemy, orbit, groupAmount,
    distance: Math.hypot(player.x - enemy.x, player.z - enemy.z),
    enemyFacing, flankAngle, flanking: false,
    idleStride: Math.sin(lifeTime * 1.18) * .32 * life,
    idleHands: Math.sin(lifeTime * 1.02) * 1.7 * life,
    enemyLean: Math.sin(lifeTime * .9) * .009 * life - reaction.enemyDodge * reaction.enemyDodgeSide * (reducedMotion ? .025 : .09),
    intro, eiraStage, ...reaction,
  };
}
