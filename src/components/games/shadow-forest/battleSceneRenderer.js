const WIDTH = 360;
const HEIGHT = 600;
const HORIZON = 291;
const FOCAL = 223;
const EYE_HEIGHT = 368 / FOCAL;
const START_DISTANCE = 3.2;

/** The strike reaches the player exactly when combat applies damage, then recoils. */
export function getEnemyAttackPose(state, time = 0) {
  const progress = Math.max(0, Math.min(1, (state.phaseTime || 0) / (state.phaseDuration || 1)));
  const eased = progress * progress * (3 - 2 * progress);
  const idleArm = Math.sin(time * 1.5) * .035;
  const idleHead = Math.sin(time) * .018;
  const enemyTurn = state.turn === 'enemy';
  if (enemyTurn && state.phase === 'windup') return {
    lunge: 0, arm: idleArm + (-2.07 - idleArm) * eased,
    headTilt: idleHead + (-.08 - idleHead) * eased, headLift: -4 * eased,
  };
  if (enemyTurn && state.phase === 'strike') return {
    lunge: eased, arm: -2.07 + 2.67 * eased,
    headTilt: -.08 * (1 - eased), headLift: -4 * (1 - eased),
  };
  if (enemyTurn && state.phase === 'recover' && state.strikeResolved) return {
    lunge: 1 - eased, arm: .6 + (idleArm - .6) * eased,
    headTilt: idleHead * eased, headLift: 0,
  };
  return {
    lunge: 0, arm: state.phase === 'stunned' ? .22 : idleArm,
    headTilt: state.phase === 'stunned' ? .12 : idleHead, headLift: 0,
  };
}

/** Camera basis is shared by the floor, scenery and actors; it always looks at the opponent. */
export function getBattleProjection(view, reducedMotion = false) {
  const angle = view.orbit || 0;
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const progress = Math.max(0, Math.min(1, view.moveProgress || 0));
  const stepping = view.movingActor === 'player' && !reducedMotion;
  const envelope = Math.sin(progress * Math.PI);
  const step = stepping ? Math.sin(progress * Math.PI * 4) * envelope : 0;
  const cameraBob = stepping ? (Math.cos(progress * Math.PI * 8) - 1) * envelope * 1.1 : 0;
  const distance = Math.max(1.15, view.distance || START_DISTANCE);
  const rawScale = START_DISTANCE / distance;
  // Keep eye contact as the giant approaches. A small FOV adjustment at the
  // very closest distance keeps the head clear of the phone's top controls.
  const monsterScale = Math.min(2.05, rawScale);
  let focal = FOCAL * monsterScale / rawScale;
  let pitch = Math.max(0, monsterScale - 1) * 98;
  const renderEnemy = view.renderEnemy || view.enemy;
  const enemyDx = renderEnemy.x - view.player.x, enemyDz = renderEnemy.z - view.player.z;
  const enemyDepth = Math.max(1, -enemyDx * sine - enemyDz * cosine);
  const enemyLateral = enemyDx * cosine - enemyDz * sine;
  const group = view.groupAmount || 0;
  let eiraProjection = null;
  if (view.eira) {
    const dx = view.eira.x - view.player.x, dz = view.eira.z - view.player.z;
    const depth = Math.max(.65, -dx * sine - dz * cosine);
    const lateral = dx * cosine - dz * sine;
    const frameEira = view.framingEira || view.eira;
    const frameDx = frameEira.x - view.player.x, frameDz = frameEira.z - view.player.z;
    const frameDepth = Math.max(.65, -frameDx * sine - frameDz * cosine);
    const frameLateral = frameDx * cosine - frameDz * sine;
    const baseDx = view.enemy.x - view.player.x, baseDz = view.enemy.z - view.player.z;
    const baseDepth = Math.max(1, -baseDx * sine - baseDz * cosine);
    const baseLateral = baseDx * cosine - baseDz * sine;
    // Eira's visible exchange can use a wider lens; the player-facing fight
    // keeps its distance-based perspective while she waits outside the frame.
    const widthLimit = Math.min(FOCAL, 108 * frameDepth / Math.max(.1, Math.abs(frameLateral)), 78 * baseDepth / Math.max(.1, Math.abs(baseLateral)));
    const groupFocal = Math.min(widthLimit, FOCAL * 1.08 * baseDepth / START_DISTANCE);
    focal += (groupFocal - focal) * group;
    const groupPitch = Math.min(0, 421 - HORIZON - focal * EYE_HEIGHT / Math.min(frameDepth, baseDepth));
    pitch += (groupPitch - pitch) * group;
    const scale = START_DISTANCE * .72 / depth * focal / FOCAL;
    const contactX = 180 + lateral * focal / depth;
    const amount = view.eiraStage?.amount ?? 1;
    // Walk along the camera's ground-plane tangent. Keeping depth unchanged
    // preserves the rigid sword and contact scale; the whole silhouette, even
    // its forward-pointing blade, rests beyond the left edge between exchanges.
    const offstageX = -170 * scale - 24;
    const stagedLateral = lateral - (1 - amount) * (contactX - offstageX) * depth / focal;
    eiraProjection = { x: 180 + stagedLateral * focal / depth, y: HORIZON + focal * EYE_HEIGHT / depth + pitch, depth, scale, contactX, stageAmount: amount };
  }
  return {
    view, sine, cosine, step, cameraBob, focal, pitch, eira: eiraProjection, monsterDepth: enemyDepth,
    monsterX: 180 + enemyLateral * focal / enemyDepth - step * 1.4,
    monsterFoot: HORIZON + focal * EYE_HEIGHT / enemyDepth + pitch,
    monsterScale: START_DISTANCE / enemyDepth * focal / FOCAL,
    project(x, z) {
      const dx = x - view.player.x;
      const dz = z - view.player.z;
      const depth = -dx * sine - dz * cosine;
      if (depth <= .12) return null;
      const lateral = dx * cosine - dz * sine;
      return { x: 180 + lateral * focal / depth, y: HORIZON + focal * EYE_HEIGHT / depth + pitch, depth };
    },
  };
}

/** Project the original painted floor through a ground plane, with independent world-space props. */
export function createArenaBackdrop(ownerDocument, scenery) {
  const canvas = ownerDocument.createElement('canvas');
  canvas.width = WIDTH; canvas.height = HEIGHT;
  const context = canvas.getContext('2d', { alpha: false });
  context.imageSmoothingEnabled = false;
  const source = scenery.ground.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT).data;
  const floorCanvas = ownerDocument.createElement('canvas');
  floorCanvas.width = WIDTH; floorCanvas.height = HEIGHT - HORIZON + 96;
  const floorContext = floorCanvas.getContext('2d');
  const floor = floorContext.createImageData(WIDTH, HEIGHT - HORIZON + 96);
  const props = scenery.props.map(prop => {
    const depth = 368 / Math.max(1, prop.bottom - HORIZON);
    return { ...prop, worldX: (prop.x - 180) * depth / FOCAL, worldZ: START_DISTANCE - depth, referenceDepth: depth };
  });
  let cacheKey = '';

  function render(projection) {
    const { view, sine, cosine, focal, pitch } = projection;
    // Exact original pixels at the establishing position also preserve the cinematic handoff.
    if (Math.abs(view.player.x) < 1e-7 && Math.abs(view.player.z - START_DISTANCE) < 1e-7 && Math.abs(view.orbit || 0) < 1e-7 && pitch === 0 && focal === FOCAL) return scenery.image;
    const key = [view.player.x, view.player.z, sine, cosine, focal / 10, pitch / 10]
      .map(value => Math.round(value * 10000)).join(',');
    if (key === cacheKey) return canvas;
    cacheKey = key;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
    context.fillStyle = '#050c20';
    context.fillRect(0, 0, WIDTH, HEIGHT);
    // One full turn is one complete panorama, including the +PI/-PI seam.
    const skyShift = ((view.orbit || 0) / (Math.PI * 2) * WIDTH) % WIDTH;
    // Looking upward reveals more of the same night sky instead of a blank band.
    context.fillStyle = '#80a8c2';
    for (let star = 0; star < 47; star++) {
      const y = (star * 47 % 190) - 190 + pitch;
      if (y < 0 || y >= pitch) continue;
      const x = ((star * 83 + skyShift) % WIDTH + WIDTH) % WIDTH;
      context.fillRect(Math.round(x), Math.round(y), star % 11 ? 1 : 2, 1);
    }
    for (let repeat = -1; repeat <= 1; repeat++) context.drawImage(scenery.distant, Math.round(skyShift + repeat * WIDTH), Math.round(pitch));

    const target = floor.data;
    for (let y = HORIZON; y < HEIGHT + Math.max(0, -Math.floor(pitch)); y++) {
      const depth = focal * EYE_HEIGHT / Math.max(1, y - HORIZON);
      const lateralStep = depth / focal;
      const worldStartX = view.player.x - sine * depth - cosine * 180 * lateralStep;
      const worldStartZ = view.player.z - cosine * depth + sine * 180 * lateralStep;
      for (let x = 0; x < WIDTH; x++) {
        const worldX = worldStartX + cosine * x * lateralStep;
        const worldZ = worldStartZ - sine * x * lateralStep;
        const originalDepth = START_DISTANCE - worldZ;
        const sx = Math.round(180 + worldX * FOCAL / originalDepth);
        const sy = Math.round(HORIZON + 368 / originalDepth);
        const offset = ((y - HORIZON) * WIDTH + x) * 4;
        if (originalDepth > .1 && sx >= 0 && sx < WIDTH && sy >= HORIZON && sy < HEIGHT) {
          const from = (sy * WIDTH + sx) * 4;
          target[offset] = source[from]; target[offset + 1] = source[from + 1]; target[offset + 2] = source[from + 2];
        } else {
          // Continue the same clearing outside the original painting. Texture cells stay
          // fixed on the ground, so orbiting never turns into a screen-space sliding image.
          const cellX = Math.floor(worldX * 17);
          const cellZ = Math.floor(worldZ * 17);
          const hash = ((cellX * 374761393) ^ (cellZ * 668265263)) >>> 0;
          const light = hash % 11;
          const path = Math.abs(worldX - Math.sin(worldZ * .65) * .4) < 1.15;
          const fog = Math.min(1, depth / 18);
          target[offset] = (path ? 31 : 17) + light + Math.round(fog * 10);
          target[offset + 1] = (path ? 71 : 53) + light + Math.round(fog * 11);
          target[offset + 2] = (path ? 95 : 76) + light + Math.round(fog * 9);
        }
        target[offset + 3] = 255;
      }
    }
    floorContext.putImageData(floor, 0, 0);
    context.drawImage(floorCanvas, 0, HORIZON + Math.round(pitch));
    const projected = props.map(prop => ({ prop, at: projection.project(prop.worldX, prop.worldZ) }))
      .filter(item => item.at && item.at.depth > .3)
      .sort((a, b) => b.at.depth - a.at.depth);
    for (const { prop, at } of projected) {
      const scale = Math.min(5, prop.referenceDepth / at.depth * focal / FOCAL);
      const left = at.x + (prop.left - prop.x) * scale;
      const top = at.y + (prop.top - prop.bottom) * scale;
      const width = prop.canvas.width * scale;
      if (left > WIDTH || left + width < 0 || top > HEIGHT) continue;
      context.drawImage(prop.canvas, Math.round(left), Math.round(top), Math.round(width), Math.round(prop.canvas.height * scale));
    }
    // The first tiny step reveals reconstructed scenery gradually, keeping the
    // cinematic's painted establishing frame from popping into a new layer order.
    const departure = Math.min(1, Math.hypot(view.player.x, view.player.z - START_DISTANCE, Math.sin(view.orbit || 0) * START_DISTANCE) * 32 + Math.abs(pitch) * .05);
    if (departure < 1) {
      context.globalAlpha = 1 - departure * departure * (3 - 2 * departure);
      context.drawImage(scenery.image, 0, 0);
      context.globalAlpha = 1;
    }
    return canvas;
  }

  return { render, destroy() { canvas.width = 0; floorCanvas.width = 0; } };
}
