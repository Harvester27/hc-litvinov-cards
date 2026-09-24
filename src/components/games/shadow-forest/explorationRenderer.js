import { drawMonster } from './renderer.js';
import { drawGuardianOak, drawMeadowPine } from './firestormRenderer.js';
import { createCampRenderer, drawCampSupplies, drawCampLog, drawFireplace, drawCampFlames, drawCampForeground, createEiraLayers, limb, articulatedArm, drawEiraScabbard, drawForestPine } from './campRenderer.js';
import { normalizeAppearance, getAppearancePalette } from './appearance.mjs';

const W = 360, H = 600, FOCAL = 220;
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
const mix = (a, b, p) => a + (b - a) * p;
const hash = (n, salt = 0) => {
  let v = Math.imul(n + 17, 374761393) ^ Math.imul(salt + 31, 668265263);
  v = Math.imul(v ^ v >>> 16, 0x7feb352d); v = Math.imul(v ^ v >>> 15, 0x846ca68b);
  return ((v ^ v >>> 16) >>> 0) / 4294967296;
};
const box = (c, color, x, y, w, h = w) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
function poly(c, color, points) {
  if (points.length < 3) return;
  c.fillStyle = color; c.beginPath();
  points.forEach(([x, y], i) => i ? c.lineTo(Math.round(x), Math.round(y)) : c.moveTo(Math.round(x), Math.round(y)));
  c.closePath(); c.fill();
}
const LANDMARKS = { oak: { x: -2.1, z: 4.2 }, creature: { x: 1.4, z: 3.8 }, camp: { x: -12, z: 36 } };
// A small authored stage: only these camera paths are reachable. Angles are
// interpolated with position, so near objects pass faster than the tree line.
const VIEWS = {
  clearing: { x: 0, z: -2.8, yaw: -.025, horizon: 229, eye: 1.5 },
  oak: { x: -2.1, z: .5, yaw: 0, horizon: 258, eye: 1.5 },
  creature: { x: 1.4, z: 1.2, yaw: .015, horizon: 234, eye: 1.25 },
  tracks: { x: 1.1, z: 4.5, yaw: .06, horizon: 197, eye: 1.5 },
  camp: { x: -12, z: 32.6, yaw: 0, horizon: 294, eye: 1.15 },
};
const FOREST_PATH = [{ x: -3.8, z: 3.8 }, { x: -3.8, z: 7 }, { x: -6.8, z: 12 }, { x: -8.5, z: 18 }, { x: -6.5, z: 23 }, { x: -10.5, z: 28.5 }, { x: -12, z: 32.6 }];
function segmentDistance(point, a, b) {
  const dx = b.x - a.x, dz = b.z - a.z, t = clamp(((point.x - a.x) * dx + (point.z - a.z) * dz) / (dx * dx + dz * dz));
  return Math.hypot(point.x - mix(a.x, b.x, t), point.z - mix(a.z, b.z, t));
}
const FOREST_TREES = Array.from({ length: 220 }, (_, i) => ({ id: 'forest', variant: i % 3, point: { x: -24 + hash(i, 71) * 31, z: 8.5 + hash(i, 72) * 38 }, size: 4.7 + hash(i, 73) * 3.5 }))
  .filter(o => Math.hypot(o.point.x + 12, o.point.z - 35.3) > 4 && FOREST_PATH.slice(1).every((b, i) => segmentDistance(o.point, FOREST_PATH[i], b) > 2.15));
const pathCurve = (points, t) => {
  const along = clamp(t) * (points.length - 1), i = Math.min(points.length - 2, Math.floor(along)), u = along - i;
  const a = points[Math.max(0, i - 1)], b = points[i], d = points[i + 1], f = points[Math.min(points.length - 1, i + 2)];
  const p = {};
  for (const key of ['x', 'z']) p[key] = .5 * (2 * b[key] + (-a[key] + d[key]) * u + (2 * a[key] - 5 * b[key] + 4 * d[key] - f[key]) * u * u + (-a[key] + 3 * b[key] - 3 * d[key] + f[key]) * u * u * u);
  return p;
};
const CAMP_ROUTES = Object.fromEntries(Object.entries(VIEWS).filter(([id]) => id !== 'camp').map(([id, view]) => {
  const points = [view, ...(id === 'tracks' ? FOREST_PATH.slice(1) : FOREST_PATH)], samples = []; let length = 0;
  for (let i = 0; i <= 120; i++) {
    const point = pathCurve(points, i / 120), last = samples.at(-1);
    if (last) length += Math.hypot(point.x - last.x, point.z - last.z);
    samples.push({ ...point, length });
  }
  return [id, { samples, length }];
}));
function forestPosition(id, progress) {
  const route = CAMP_ROUTES[id] || CAMP_ROUTES.clearing, length = clamp(progress) * route.length;
  const index = Math.max(1, route.samples.findIndex(p => p.length >= length));
  const a = route.samples[index - 1], b = route.samples[index], u = (length - a.length) / Math.max(.00001, b.length - a.length);
  return { x: mix(a.x, b.x, u), z: mix(a.z, b.z, u), yaw: Math.atan2(b.x - a.x, b.z - a.z) };
}

/** The fire can be heard only inside its clearing, beyond the final bend. */
export function getExplorationCampProximity(state) {
  const e = state.exploration;
  if (!e) return 0;
  if (e.mode !== 'travel' || !e.travel) return e.location === 'camp' ? 1 : 0;
  const { from, to, elapsed, duration } = e.travel;
  if (from !== 'camp' && to !== 'camp') return 0;
  const p = clamp(elapsed / Math.max(.1, duration));
  return smooth(((to === 'camp' ? p : 1 - p) - .82) / .18);
}

function cameraFor(state, reduced) {
  const e = state.exploration || {}, route = e.travel;
  const from = VIEWS[route?.from || e.location] || VIEWS.clearing;
  const to = VIEWS[route?.to] || from;
  const travel = e.mode === 'travel' && route;
  const raw = travel ? clamp(route.elapsed / Math.max(.1, route.duration || 3)) : 0;
  const p = smooth(raw), camera = {};
  const forestTravel = travel && (route.from === 'camp' || route.to === 'camp');
  for (const key of ['x', 'z', 'yaw', 'horizon', 'eye']) camera[key] = mix(from[key], to[key], p);
  if (travel && !reduced) {
    const heading = Math.atan2(to.x - from.x, to.z - from.z);
    const delta = Math.atan2(Math.sin(heading - camera.yaw), Math.cos(heading - camera.yaw));
    const turn = smooth(raw / .24) * (1 - smooth((raw - .76) / .24));
    camera.yaw += delta * turn;
  }
  if (travel && !forestTravel && (route.from === 'tracks' || route.to === 'tracks')) {
    const corner = { x: -.9, z: 4.65 };
    const a = route.to === 'tracks' ? from : to;
    const along = route.to === 'tracks' ? p : 1 - p;
    if (along < .8) {
      const q = smooth(along / .8); camera.x = mix(a.x, corner.x, q); camera.z = mix(a.z, corner.z, q);
    } else {
      const q = smooth((along - .8) / .2); camera.x = mix(corner.x, VIEWS.tracks.x, q); camera.z = mix(corner.z, VIEWS.tracks.z, q);
    }
  }
  if (forestTravel) {
    const forward = route.to === 'camp', along = forward ? raw : 1 - raw;
    const at = forestPosition(forward ? route.from : route.to, smooth(along));
    camera.x = at.x; camera.z = at.z;
    const baseYaw = mix(from.yaw, to.yaw, p), heading = at.yaw + (forward ? 0 : Math.PI);
    const turn = smooth(raw / (reduced ? .18 : .1)) * (1 - smooth((raw - (reduced ? .82 : .9)) / (reduced ? .18 : .1)));
    camera.yaw = baseYaw + Math.atan2(Math.sin(heading - baseYaw), Math.cos(heading - baseYaw)) * turn;
    const begin = 1 - smooth(raw / .12), finish = smooth((raw - .88) / .12);
    camera.horizon = 244 + (from.horizon - 244) * begin + (to.horizon - 244) * finish;
    camera.eye = 1.5 + (from.eye - 1.5) * begin + (to.eye - 1.5) * finish;
  }
  const cadence = !forestTravel && state.eira?.health <= 0 ? .7 : 1 / 1.3;
  const stride = travel ? Math.sin(route.elapsed * Math.PI * 2 * cadence) * Math.sin(raw * Math.PI) : 0;
  if (!reduced) camera.horizon += Math.abs(stride) * 1.8;
  camera.stride = reduced ? 0 : stride;
  const campAlong = forestTravel ? (route.to === 'camp' ? raw : 1 - raw) : 0;
  camera.camp = forestTravel ? smooth((campAlong - .92) / .08) : e.location === 'camp' ? 1 : 0;
  camera.companionExit = forestTravel ? smooth((campAlong - .82) / .055) : e.location === 'camp' ? 1 : 0;
  camera.companionSeat = forestTravel ? smooth((campAlong - .9) / .1) : e.location === 'camp' ? 1 : 0;
  camera.campReveal = getExplorationCampProximity(state);
  return camera;
}

function project(camera, x, z, height = 0) {
  const dx = x - camera.x, dz = z - camera.z;
  const depth = dx * Math.sin(camera.yaw) + dz * Math.cos(camera.yaw);
  if (depth < .18) return null;
  const side = dx * Math.cos(camera.yaw) - dz * Math.sin(camera.yaw);
  return { x: 180 + side * FOCAL / depth, y: camera.horizon + (camera.eye - height) * FOCAL / depth, depth, scale: FOCAL / depth };
}

function groundShape(c, camera, color, points) {
  const local = points.map(([x, z]) => {
    const dx = x - camera.x, dz = z - camera.z;
    return [dx * Math.cos(camera.yaw) - dz * Math.sin(camera.yaw), dx * Math.sin(camera.yaw) + dz * Math.cos(camera.yaw)];
  });
  const clipped = [];
  for (let i = 0; i < local.length; i++) {
    const a = local[i], b = local[(i + 1) % local.length], aIn = a[1] >= .18, bIn = b[1] >= .18;
    if (aIn) clipped.push(a);
    if (aIn !== bIn) { const t = (.18 - a[1]) / (b[1] - a[1]); clipped.push([mix(a[0], b[0], t), .18]); }
  }
  poly(c, color, clipped.map(([x, z]) => [180 + x * FOCAL / z, camera.horizon + camera.eye * FOCAL / z]));
}

/** Canvas coordinates are converted to 44px DOM targets by the game overlay. */
export function getExplorationHotspots(state) {
  const e = state.exploration;
  if (!e || e.paused || ['travel', 'sleep', 'dawn'].includes(e.mode)) return [];
  if (e.location === 'clearing') return [
    { id: 'to-oak', kind: 'travel', target: 'oak', label: 'Starý dub', x: 111, y: 211 },
    { id: 'to-creature', kind: 'travel', target: 'creature', label: 'Padlý strážce', x: 248, y: 305 },
    { id: 'to-tracks', kind: 'travel', target: 'tracks', label: 'Stopy v popelu', x: 249, y: 380 },
    { id: 'to-camp', kind: 'travel', target: 'camp', label: 'Cesta do lesa', x: 98, y: 387 },
  ];
  const inspect = {
    oak: { id: 'oak', kind: 'inspect', target: 'oak', label: 'Prohlédnout runu', x: 186, y: 259 },
    creature: { id: 'shackle', kind: 'inspect', target: 'shackle', label: 'Rozbité okovy', x: 146, y: 374 },
    tracks: { id: 'tracks', kind: 'inspect', target: 'tracks', label: 'Prozkoumat stopy', x: 238, y: 377 },
  }[e.location];
  return [...(inspect ? [inspect] : []), { id: 'to-clearing', kind: 'travel', target: 'clearing', label: 'Zpět na louku', x: 95, y: 406 }];
}

function layer(doc, width, height, paint) {
  const image = doc.createElement('canvas'); image.width = width; image.height = height;
  const c = image.getContext('2d'); c.imageSmoothingEnabled = false; paint(c); return image;
}

function drawShackle(c, x, y, fragmentTaken = false) {
  c.save(); c.translate(x, y); c.rotate(-.22);
  poly(c, '#07141e', [[-22, -11], [-9, -18], [9, -16], [18, -9], [11, -4], [6, -9], [-6, -10], [-14, -5], [-11, 8], [1, 12], [11, 6], [17, 11], [5, 20], [-13, 16], [-22, 7]]);
  poly(c, '#59656b', [[-18, -9], [-8, -14], [7, -13], [14, -9], [10, -7], [6, -11], [-7, -12], [-17, -5], [-14, 9], [0, 15], [12, 8], [14, 11], [4, 17], [-11, 13], [-18, 5]]);
  box(c, '#adc1bb', -16, -9, 7, 2); box(c, '#768a8b', -19, -4, 3, 8);
  for (let i = 0; i < 3; i++) {
    poly(c, '#17252e', [[-18 - i * 10, 8 + i * 4], [-28 - i * 10, 10 + i * 4], [-32 - i * 10, 17 + i * 4], [-21 - i * 10, 19 + i * 4]]);
    box(c, '#7f8f8e', -27 - i * 10, 12 + i * 4, 8, 2);
  }
  // Only the stamped broken fragment is collected; the cuff stays on the wrist.
  if (!fragmentTaken) {
    poly(c, '#4d6168', [[-17, -7], [-6, -7], [-4, 7], [-9, 12], [-17, 8]]);
    box(c, '#a9b5a5', -11, -2, 2, 10); box(c, '#a9b5a5', -14, -2, 8, 2); box(c, '#a9b5a5', -14, -5, 2, 5); box(c, '#a9b5a5', -8, -5, 2, 5);
  }
  c.restore();
}

function restingHands(c, appearance, palette, stride, supported = false, companionGround = 482) {
  for (const side of [-1, 1]) {
    c.save(); c.translate(side < 0 ? 0 : W, 17 + stride * side * 4); c.scale(side < 0 ? 1 : -1, 1);
    const bracer = appearance.outfit === 'knight' ? palette.metal : palette.leather;
    if (supported && side < 0) {
      const lift = companionGround - 482;
      poly(c, '#081720', [[0, 600], [0, 452 + lift], [28, 410 + lift], [60, 378 + lift], [78, 379 + lift], [91, 391 + lift], [85, 407 + lift], [58, 429 + lift], [35, 494 + lift], [42, 600]]);
      poly(c, palette.cloth.shadow, [[0, 600], [0, 471 + lift], [22, 432 + lift], [41, 449 + lift], [25, 500 + lift], [34, 600]]);
      poly(c, palette.cloth.base, [[0, 536 + lift], [0, 473 + lift], [21, 440 + lift], [29, 449 + lift], [14, 497 + lift]]);
      c.translate(0, lift);
      poly(c, bracer.base, [[19, 439], [35, 410], [52, 396], [69, 414], [45, 440], [36, 460]]);
      poly(c, bracer.light, [[32, 416], [46, 402], [51, 406], [38, 427], [29, 442], [25, 439]]);
      poly(c, palette.skin.shadow, [[46, 397], [60, 383], [76, 384], [85, 392], [79, 403], [65, 412], [54, 407]]);
      poly(c, palette.skin.base, [[53, 395], [63, 386], [75, 388], [80, 393], [75, 400], [64, 403], [57, 401]]);
      box(c, '#b89e68', 34, 423, 12, 3); c.restore(); continue;
    }
    poly(c, '#081720', [[-10, 600], [12, 536], [34, 497], [53, 469], [66, 457], [82, 462], [88, 474], [80, 488], [65, 496], [53, 528], [39, 600]]);
    poly(c, palette.cloth.shadow, [[-4, 598], [17, 540], [34, 520], [55, 531], [36, 599]]);
    poly(c, palette.cloth.base, [[0, 580], [17, 544], [31, 528], [43, 534], [25, 575]]);
    poly(c, bracer.shadow, [[22, 535], [34, 502], [47, 482], [66, 494], [50, 532], [41, 544]]);
    poly(c, bracer.base, [[30, 529], [42, 499], [47, 490], [60, 497], [47, 526], [39, 535]]);
    poly(c, bracer.light, [[40, 501], [46, 490], [51, 492], [42, 515], [36, 522]]);
    box(c, '#b89e68', 38, 509, 12, 3);
    poly(c, palette.skin.shadow, [[48, 481], [55, 468], [66, 461], [79, 465], [83, 474], [77, 484], [64, 491]]);
    poly(c, palette.skin.base, [[54, 480], [59, 471], [67, 466], [75, 469], [78, 475], [72, 483], [64, 484]]);
    poly(c, palette.skin.light, [[59, 474], [65, 468], [70, 469], [65, 475], [61, 480]]);
    for (let i = 0; i < 3; i++) box(c, palette.skin.shadow, 69 + i * 3, 470 + i * 2, 1, 5);
    c.restore();
  }
}

function travelCompanion(c, layers, stride, injured) {
  const cloth = { shadow: '#343c36', base: '#5c5544', light: '#807054' }, boot = { shadow: '#352b27', base: '#654d35', light: '#99754d' };
  const bodyY = -61 + (injured ? 11 : 0), pace = stride * (injured ? 2 : 6);
  c.save(); if (injured) { c.translate(195, 290); c.rotate(.08); c.translate(-195, -290); }
  c.save(); c.translate(0, 174 + bodyY); c.scale(.94, 1.42); c.translate(10, -174); c.drawImage(layers.cape, 0, 0); c.restore();
  for (const side of [-1, 1]) {
    const hip = [187 + side * 13, 175], knee = [188 + side * 18, 226 + pace * side], foot = [187 + side * 23, 280 - Math.max(0, pace * side)];
    limb(c, hip, knee, 10, 7, cloth); limb(c, knee, foot, 7, 6, boot);
    poly(c, '#111c25', [[foot[0] - 8, foot[1] - 4], [foot[0] + 7, foot[1] - 4], [foot[0] + 12, foot[1] + 9], [foot[0] - 9, foot[1] + 10]]);
    box(c, boot.light, foot[0] - 5, foot[1] + 3, 13, 3);
  }
  c.drawImage(layers.torso, 0, bodyY); c.drawImage(layers.collar, 0, bodyY);
  c.save(); c.translate(0, bodyY); drawEiraScabbard(c); c.restore();
  articulatedArm(c, [155, 196 + bodyY], [148, 176 + pace], injured ? [215, 179] : [151, 209 - pace], false);
  articulatedArm(c, [214, 199 + bodyY], [229, 170 - pace], [229, 208 + pace], false);
  c.drawImage(layers.profile, 2, bodyY - 1);
  if (injured) { box(c, '#dccdb3', 181, 152, 22, 5); box(c, '#a79a81', 181, 157, 22, 2); }
  c.restore();
}

/** Authored first-person walks through one fixed, small scene; no domain mutation. */
export function createExplorationRenderer(canvas) {
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d', { alpha: false });
  if (!c) throw new Error('Exploration canvas is unavailable');
  const doc = canvas.ownerDocument;
  let assets = null, destroyed = false, clock = 0, floorKey = '', clockInitialized = false;
  let canonicalCamp = null, campFrame = null;
  const cover = amount => {
    if (amount <= 0) return;
    box(c, '#060c12', 0, 0, W, H * .52 * amount);
    box(c, '#060c12', 0, H * (1 - .52 * amount), W, H * .52 * amount);
  };
  const campRouteCover = (elapsed, duration) => {
    const local = elapsed < .32 ? elapsed : elapsed > duration - .32 ? elapsed - (duration - .32) : -1;
    return local < 0 ? 0 : smooth(local / .12) * (1 - smooth((local - .2) / .12));
  };
  function renderCanonicalCamp(state, reduced, daylight) {
    if (!canonicalCamp) { campFrame = doc.createElement('canvas'); canonicalCamp = createCampRenderer(campFrame); }
    canonicalCamp.render({ ...state, scene: 'camp', cinematic: null }, clock, reduced, daylight);
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.imageSmoothingEnabled = false;
    c.drawImage(campFrame, 0, 0);
  }
  function prepare() {
    if (assets) return;
    const sky = layer(doc, 1080, 330, brush => {
      for (let y = 0; y < 330; y += 3) box(brush, `rgb(${8 + Math.round(y * .025)},${19 + Math.round(y * .05)},${35 + Math.round(y * .064)})`, 0, y, 1080, 3);
      for (let i = 0; i < 190; i++) box(brush, i % 7 ? '#658296' : '#b0c4c2', hash(i, 1) * 1080, 22 + hash(i, 2) * 155, i % 13 ? 1 : 2);
      poly(brush, '#a7beb7', [[619, 64], [634, 64], [640, 70], [640, 84], [634, 90], [619, 90], [613, 84], [613, 71]]);
      poly(brush, '#1c3446', [[619, 64], [627, 64], [624, 73], [624, 82], [630, 88], [619, 87], [615, 81], [615, 70]]);
      for (let i = 0; i < 80; i++) drawMeadowPine(brush, i * 14 - 8, 294 + hash(i, 31) * 10, 57 + hash(i, 32) * 65, false);
    });
    const dawnSky = layer(doc, 1080, 330, brush => {
      for (let y = 0; y < 330; y += 3) box(brush, `rgb(${Math.round(43 + y * .45)},${Math.round(66 + y * .3)},${Math.round(85 + y * .12)})`, 0, y, 1080, 3);
      poly(brush, '#f0c58b', [[619, 147], [637, 147], [644, 154], [644, 171], [637, 178], [619, 178], [612, 171], [612, 154]]);
      for (let i = 0; i < 80; i++) drawMeadowPine(brush, i * 14 - 8, 294 + hash(i, 31) * 10, 57 + hash(i, 32) * 65, false);
    });
    const oak = layer(doc, 320, 330, brush => drawGuardianOak(brush, 160, 298, 1, true, 0));
    const corpse = layer(doc, 440, 230, brush => {
      poly(brush, '#142127', [[55, 151], [103, 116], [241, 103], [360, 116], [393, 143], [366, 166], [135, 179]]);
      brush.save(); brush.translate(106, 155); brush.rotate(1.48); brush.scale(.8, .8); brush.translate(-180, -406);
      drawMonster(brush, { status: 'playing', turn: 'player', phase: 'idle', enemyEyesClosed: true, enemyHurtTimer: 0, roarAmount: 0 }, 29, true, 0, 1, 0, { hideGroundShadow: true });
      brush.restore();
    });
    const camp = layer(doc, 360, 390, brush => { drawCampSupplies(brush); drawCampLog(brush); drawFireplace(brush); });
    const forest = {};
    for (let i = 0; i < 3; i++) forest[`pine${i}`] = layer(doc, 370, 350, brush => drawForestPine(brush, 185, 339, 329, ['#081724', '#0c242c', '#173b3c', '#2b5050'], 481 + i * 17));
    const eiraLayers = createEiraLayers(doc, ['cape', 'torso', 'collar', 'profile']);
    for (const hurt of [false, true]) for (let frame = 0; frame < 4; frame++) forest[`walk${Number(hurt)}${frame}`] = layer(doc, 360, 340, brush => travelCompanion(brush, eiraLayers, Math.sin(frame * Math.PI / 2), hurt));
    Object.values(eiraLayers).forEach(image => { image.width = 0; });
    assets = { sky, dawnSky, oak, corpse, camp, ...forest, floor: layer(doc, W, H, () => {}) };
  }

  function floor(camera, c) {
    box(c, '#222c2d', 0, camera.horizon, W, H - camera.horizon);
    // The ash trail and surviving patch behind the oak share world coordinates.
    groundShape(c, camera, '#303737', [[-1.1, -7], [.1, -7], [2.1, 4.4], [2.5, 9.4], [1.3, 17], [.55, 17], [1.2, 8.2], [.35, 4.8]]);
    groundShape(c, camera, '#263d35', [[-5.7, 4], [-1.2, 4], [-.9, 8.7], [-7.6, 12], [-8, 7]]);
    groundShape(c, camera, '#35463b', [[-4.9, 4.5], [-1.7, 4.6], [-2.1, 7], [-5.8, 7.7]]);
    groundShape(c, camera, '#213b35', [[-30, 7], [-5, 7], [7, 10], [10, 55], [-30, 55]]);
    const trail = [{ x: -1, z: -.5 }, ...FOREST_PATH, { x: -12, z: 36 }];
    for (let i = 0; i < trail.length - 1; i++) {
      const a = trail[i], b = trail[i + 1], angle = Math.atan2(b.x - a.x, b.z - a.z), sideX = Math.cos(angle) * .74, sideZ = -Math.sin(angle) * .74;
      groundShape(c, camera, '#39483c', [[a.x - sideX, a.z - sideZ], [a.x + sideX, a.z + sideZ], [b.x + sideX, b.z + sideZ], [b.x - sideX, b.z - sideZ]]);
    }
    groundShape(c, camera, '#514d3d', [[-14.2, 33.8], [-9.8, 33.8], [-9.5, 37.4], [-14.5, 37.4]]);
    // Stable small world tiles keep the nearby ash detailed without a full
    // per-pixel floor calculation; tiles entering the bounds are off camera.
    const corners = [];
    for (const depth of [.3, 14]) for (const side of [-.84, .84]) corners.push({ x: camera.x + Math.sin(camera.yaw) * depth + Math.cos(camera.yaw) * side * depth, z: camera.z + Math.cos(camera.yaw) * depth - Math.sin(camera.yaw) * side * depth });
    const startX = Math.floor(Math.min(...corners.map(p => p.x)) / .24) - 1, endX = Math.ceil(Math.max(...corners.map(p => p.x)) / .24) + 1;
    const startZ = Math.floor(Math.min(...corners.map(p => p.z)) / .24) - 1, endZ = Math.ceil(Math.max(...corners.map(p => p.z)) / .24) + 1;
    for (let column = 0; column <= endX - startX; column++) for (let row = 0; row <= endZ - startZ; row++) {
      const tx = startX + column, tz = startZ + row, i = Math.imul(tx, 173) ^ Math.imul(tz, 751);
      const x = (tx + hash(i, 45)) * .24, z = (tz + hash(i, 46)) * .24;
      const p = project(camera, x, z);
      if (!p || p.y < camera.horizon || p.y > 620 || p.x < -20 || p.x > 380) continue;
      const green = z > 8 || (x < -1.2 && z > 4);
      const index = Math.abs(i);
      box(c, green ? ['#3f5540', '#586247', '#1c332f'][index % 3] : ['#41423d', '#59605a', '#172327', '#313a39'][index % 4], p.x, p.y, Math.min(14, p.scale * (.02 + hash(i, 47) * .075)), Math.min(3, p.scale * .017));
      if (i % 6 === 0) box(c, green ? '#586247' : '#141e23', p.x, p.y - p.scale * .08, Math.min(3, p.scale * .02), Math.min(12, p.scale * .1));
    }
    // Three-toed impressions are flat in the ash, becoming larger at our feet.
    for (let i = 0; i < 7; i++) {
      const x = .8 + (i % 2) * .82, z = 6.45 + i * .8;
      const shape = [[-.18, -.22], [.13, -.24], [.26, -.05], [.18, .23], [.11, .29], [.06, .18], [-.02, .31], [-.09, .19], [-.21, .27], [-.18, .08], [-.27, -.05]];
      groundShape(c, camera, '#101d22', shape.map(([a, b]) => [x + a, z + b]));
      groundShape(c, camera, '#6b6b59', [[x - .18, z - .22], [x + .13, z - .24], [x + .13, z - .2], [x - .12, z - .18]]);
    }
    const bootX = 1.82, bootZ = 6.2;
    groundShape(c, camera, '#111f23', [[bootX - .1, bootZ - .27], [bootX + .09, bootZ - .25], [bootX + .13, bootZ + .15], [bootX + .07, bootZ + .25], [bootX - .07, bootZ + .24], [bootX - .13, bootZ + .14]]);
    for (let i = 0; i < 4; i++) groundShape(c, camera, '#6d7061', [[bootX - .07, bootZ + i * .075], [bootX + .07, bootZ + i * .075], [bootX + .07, bootZ + .02 + i * .075], [bootX - .07, bootZ + .02 + i * .075]]);
  }

  function billboard(image, camera, point, units, originX, originY) {
    const p = project(camera, point.x, point.z);
    if (!p) return;
    const scale = p.scale / units;
    if (p.x + (image.width - originX) * scale < -50 || p.x - originX * scale > 410) return;
    c.drawImage(image, Math.round(p.x - originX * scale), Math.round(p.y - originY * scale), Math.round(image.width * scale), Math.round(image.height * scale));
  }

  return {
    render: function render(state = {}, visualTime = 0, reducedMotion = false) {
      if (destroyed) return;
      const e = state.exploration || {}, isPaused = !!e.paused;
      if (!isPaused || !clockInitialized) { clock = Number.isFinite(visualTime) ? visualTime : 0; clockInitialized = true; }
      const campRoute = e.mode === 'travel' && e.travel && (e.travel.from === 'camp' || e.travel.to === 'camp');
      const dawn = e.mode === 'dawn' ? 1 : e.mode === 'sleep' ? smooth((e.sleepElapsed - 3.1) / 1.4) : 0;
      if (campRoute) {
        const { elapsed, duration, from, to } = e.travel;
        const endpoint = elapsed < .16 ? from : elapsed >= duration - .16 ? to : null;
        if (endpoint) {
          // The viewpoint changes only while the brief downward blink is fully
          // covered. Both endpoint frames are the ordinary idle composition.
          render({ ...state, exploration: { ...e, mode: 'idle', location: endpoint, travel: null } }, visualTime, reducedMotion);
          cover(campRouteCover(elapsed, duration));
          return;
        }
      }
      if (e.location === 'camp' && e.mode !== 'travel') {
        renderCanonicalCamp(state, reducedMotion, dawn);
        if (e.mode === 'sleep') cover(smooth(e.sleepElapsed / .9) * (1 - smooth((e.sleepElapsed - 3.1) / 1.4)));
        return;
      }
      prepare();
      const camera = cameraFor(state, reducedMotion), moving = e.mode === 'travel';
      const time = moving ? e.travel.elapsed : clock;
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.imageSmoothingEnabled = false;
      box(c, '#0b1827', 0, 0, W, H);
      const skyOffset = ((camera.yaw / (Math.PI * 2) * 1080 + camera.x * 2) % 1080 + 1080) % 1080;
      for (let k = -1; k <= 1; k++) c.drawImage(assets.sky, Math.round(k * 1080 - skyOffset - 360), Math.round(camera.horizon - 294));
      if (dawn > 0) { c.globalAlpha = dawn; for (let k = -1; k <= 1; k++) c.drawImage(assets.dawnSky, Math.round(k * 1080 - skyOffset - 360), Math.round(camera.horizon - 294)); c.globalAlpha = 1; }
      const nextFloorKey = [camera.x, camera.z, camera.yaw, camera.horizon, camera.eye].join('|');
      if (nextFloorKey !== floorKey) {
        const brush = assets.floor.getContext('2d'); brush.clearRect(0, 0, W, H); floor(camera, brush); floorKey = nextFloorKey;
      }
      c.drawImage(assets.floor, 0, 0);
      const injured = state.eira?.health <= 0;
      const companionGround = camera.horizon + camera.eye * FOCAL / 2;
      const objects = [
        { id: 'oak', point: LANDMARKS.oak }, { id: 'creature', point: LANDMARKS.creature }, ...(camera.campReveal > 0 ? [{ id: 'camp', point: LANDMARKS.camp }] : []),
        ...Array.from({ length: 15 }, (_, i) => ({ id: 'tree', point: { x: -9 + i * 1.3, z: 15 + hash(i, 60) * 4 }, size: 2.5 + hash(i, 61) * 2.4 }))
          .filter(o => FOREST_PATH.slice(1).every((b, i) => segmentDistance(o.point, FOREST_PATH[i], b) > 2.1)),
        ...[[-4.2, -7.3, 2.1], [3.4, -7.6, 2.5], [-1.2, -11, 2.8]].map(([x, z, size]) => ({ id: 'tree', point: { x, z }, size })),
        ...FOREST_TREES,
      ].map(o => ({ ...o, p: project(camera, o.point.x, o.point.z) })).filter(o => o.p).sort((a, b) => b.p.depth - a.p.depth);
      for (const o of objects) {
        if (o.id === 'oak') {
          billboard(assets.oak, camera, o.point, 50, 160, 298);
        }
        else if (o.id === 'creature') {
          billboard(assets.corpse, camera, o.point, 100, 220, 163);
          const s = o.p.scale / 100;
          c.save(); c.translate(o.p.x - 220 * s, o.p.y - 163 * s); c.scale(s, s); drawShackle(c, 182, 203, !!e.findings?.shackle); c.restore();
        }
        else if (o.id === 'tree') drawMeadowPine(c, o.p.x, o.p.y, o.size * o.p.scale, o.point.x > -1);
        else if (o.id === 'forest') billboard(assets[`pine${o.variant}`], camera, o.point, 329 / o.size, 185, 339);
        else {
          billboard(assets.camp, camera, o.point, 64, 180, 366);
          const s = o.p.scale / 64;
          c.save(); c.translate(o.p.x - 180 * s, o.p.y - 366 * s); c.scale(s, s);
          if (dawn < .9) { c.globalAlpha = 1 - dawn; drawCampFlames(c, time, reducedMotion); c.globalAlpha = 1; }
          c.restore();
        }
      }
      if (!campRoute && camera.companionExit < 1) {
        const foot = moving && !reducedMotion ? Math.round(camera.stride) : 0;
        const frame = foot < 0 ? 3 : foot > 0 ? 1 : 0;
        const x = 52 - camera.companionExit * 220, y = companionGround + camera.stride * (injured ? .5 : 1);
        // The companion stays beside the player's shoulder. Her sheathed sword
        // and walking pose are distinct from the seated actor at the fire.
        c.drawImage(assets[`walk${Number(injured)}${frame}`], Math.round(x - 195 * .82), Math.round(y - 290 * .82), Math.round(360 * .82), Math.round(340 * .82));
      }
      if (dawn > 0) {
        c.globalAlpha = dawn * .2; box(c, '#d0a473', 0, 0, W, H); c.globalAlpha = 1;
      }
      const appearance = normalizeAppearance(state.appearance), palette = getAppearancePalette(appearance);
      const supported = injured && !campRoute;
      c.save(); c.translate(0, camera.camp * (supported ? 250 : 170)); restingHands(c, appearance, palette, camera.stride, supported, companionGround); c.restore();
      if (camera.camp > .5) { c.save(); c.translate(0, 40 + (1 - camera.camp) * 380); drawCampForeground(c, appearance, palette); c.restore(); }
      // Falling eyelids close the night, then reveal the same camp at dawn.
      if (e.mode === 'sleep') {
        const close = smooth(e.sleepElapsed / .9) * (1 - smooth((e.sleepElapsed - 3.1) / 1.4));
        box(c, '#060c12', 0, 0, W, H * .52 * close); box(c, '#060c12', 0, H * (1 - .52 * close), W, H * .52 * close);
      }
      if (campRoute) cover(campRouteCover(e.travel.elapsed, e.travel.duration));
    },
    destroy() {
      destroyed = true;
      if (assets) Object.values(assets).forEach(image => { image.width = 0; });
      assets = null;
      if (canonicalCamp) canonicalCamp.destroy();
      if (campFrame) campFrame.width = 0;
      canonicalCamp = null; campFrame = null;
    },
  };
}
