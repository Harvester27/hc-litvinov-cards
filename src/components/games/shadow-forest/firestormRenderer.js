import { createRenderer, createBackground, drawMonster } from './renderer.js';
import { createEiraBattleRenderer } from './eiraBattleRenderer.js';
import { drawHero } from './heroRenderer.js';
import { normalizeAppearance, getAppearancePalette } from './appearance.mjs';
import { getArenaView } from './spatial.mjs';
import { getLivingArenaView } from './battleAnimation.mjs';
import { getBattleProjection } from './battleSceneRenderer.js';

const W = 360, H = 600;
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { const p = clamp(x); return p * p * (3 - 2 * p); };
const mix = (a, b, p) => a + (b - a) * p;
const tint = (a, b, p) => `rgb(${[1, 3, 5].map(i => Math.round(mix(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), p))).join(',')})`;
const hash = (i, salt = 0) => {
  let value = Math.imul(i + 17, 374761393) ^ Math.imul(salt + 31, 668265263);
  value = Math.imul(value ^ value >>> 16, 0x7feb352d); value = Math.imul(value ^ value >>> 15, 0x846ca68b);
  return ((value ^ value >>> 16) >>> 0) / 4294967296;
};
const box = (c, color, x, y, width, height = width) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height)); };
function poly(c, color, points) {
  c.fillStyle = color; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(Math.round(x), Math.round(y)) : c.moveTo(Math.round(x), Math.round(y))); c.closePath(); c.fill();
}
function canvasLayer(doc, draw, width = W, height = H) {
  const canvas = doc.createElement('canvas'); canvas.width = width; canvas.height = height;
  const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false; draw(c); return canvas;
}
function pixelCircle(c, color, x, y, radius) {
  for (let row = -radius; row <= radius; row += 5) {
    const half = Math.sqrt(Math.max(0, radius * radius - row * row));
    box(c, color, x - half, y + row, half * 2, 5);
  }
}
function pine(c, x, y, size, burnt = false) {
  box(c, burnt ? '#181f25' : '#132b32', x - size * .035, y - size, size * .07, size);
  for (let tier = 0; tier < 5; tier++) {
    const width = size * (.12 + tier * .09), top = y - size + tier * size * .15;
    poly(c, burnt ? '#202c32' : '#183b40', [[x, top], [x - width, top + size * .31], [x + width, top + size * .29]]);
    poly(c, burnt ? '#2c3435' : '#285057', [[x, top + 3], [x - width * .8, top + size * .25], [x - width * .36, top + size * .21]]);
  }
}
function meadow(c, burnt = false, overhead = false) {
  box(c, burnt ? '#202a2d' : '#203f3e', 0, 0, W, H);
  if (burnt) for (let i = 0; i < 85; i++) {
    const x = hash(i, 201) * W, y = hash(i, 202) * H, width = 8 + hash(i, 203) * 27;
    poly(c, i % 2 ? '#303436' : '#182328', [[x, y], [x + width * .7, y - 3], [x + width, y + 2], [x + width * .3, y + 5], [x - 3, y + 2]]);
    box(c, '#5a5148', x + 3, y, 4, 1);
    if (i % 3 === 0) { box(c, '#0e1b21', x + 9, y - 7, 2, 9); box(c, '#797068', x + 9, y - 7, 1, 3); }
  }
  for (let i = 0; i < 640; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * H;
    box(c, burnt ? ['#343435', '#1a2529', '#41413a'][i % 3] : ['#2b5048', '#385c4e', '#193734'][i % 3], x, y, 2 + hash(i, 4) * 7, overhead ? 2 : 1);
    if (i % 4 === 0) box(c, burnt ? '#131e23' : '#42634f', x, y - 3, 1, 4);
  }
  for (let i = 0; i < 19; i++) {
    const side = i % 2, x = side ? 338 + hash(i, 9) * 30 : -8 + hash(i, 9) * 26;
    if (overhead) {
      pixelCircle(c, burnt ? '#142228' : '#102f34', x, i * 35, 27 + hash(i, 7) * 22);
      pixelCircle(c, burnt ? '#233033' : '#224840', x - 5, i * 35 - 5, 20);
    }
  }
  if (burnt) for (let i = 0; i < 42; i++) box(c, i % 3 ? '#704332' : '#a76236', hash(i, 71) * W, hash(i, 72) * H, 2, 1);
}

/** The same forked, broad old oak in every shot, with a permanently standing trunk. */
export function drawGuardianOak(c, x, ground, scale = 1, burnt = false, rune = 0) {
  c.save(); c.translate(x, ground); c.scale(scale, scale);
  const char = Number(burnt);
  const dark = tint('#1a282a', '#121d24', char), bark = tint('#594d3c', '#303034', char), light = tint('#837359', '#58504b', char);
  if (char < 1) {
    c.save(); c.globalAlpha *= 1 - char;
    for (const [cx, cy, r] of [[-80, -228, 54], [2, -260, 66], [86, -228, 55], [-32, -208, 58], [45, -196, 58]]) {
      pixelCircle(c, '#102d32', cx, cy, r); pixelCircle(c, '#24463e', cx - 4, cy - 9, r * .75); pixelCircle(c, '#385947', cx - 11, cy - 16, r * .43);
    }
    c.restore();
  }
  poly(c, dark, [[-84, 14], [-57, -3], [-38, -49], [-27, -139], [-35, -185], [-80, -210], [-123, -247], [-116, -257], [-72, -231], [-40, -221], [-61, -270], [-46, -276], [-9, -222], [3, -178], [18, -207], [23, -252], [35, -259], [36, -214], [58, -229], [80, -270], [92, -270], [79, -228], [119, -247], [127, -237], [73, -205], [42, -166], [30, -95], [42, -22], [74, 2], [96, 17], [57, 12], [20, 7], [-15, 9], [-54, 22]]);
  poly(c, bark, [[-63, 9], [-38, -15], [-26, -59], [-18, -151], [-25, -189], [-73, -220], [-36, -207], [-13, -185], [-4, -136], [9, -178], [24, -206], [32, -204], [22, -153], [16, -93], [26, -19], [59, 8], [20, 1], [-3, 5], [-30, 9]]);
  poly(c, light, [[-29, -12], [-17, -69], [-11, -148], [-16, -182], [-8, -171], [-2, -132], [-6, -61], [-15, -8], [-40, 12]]);
  for (let i = 0; i < 21; i++) {
    const px = -22 + hash(i, 14) * 40, py = -15 - hash(i, 18) * 132;
    box(c, i % 3 ? dark : light, px, py, 2, 9 + hash(i, 5) * 20);
  }
  if (char > .7) for (let i = 0; i < 17; i++) box(c, '#a05b38', -24 + hash(i, 22) * 47, -18 - hash(i, 23) * 123, 1, 4);
  // An old carved sign catches the blow; it is part of the bark, not a shield UI.
  const runeColor = rune > .08 ? '#d8ead0' : char > .7 ? '#627067' : '#81775b';
  if (rune > 0) { c.globalAlpha = rune * .16; pixelCircle(c, '#a7d9b4', 5, -75, 30); c.globalAlpha = 1; }
  poly(c, runeColor, [[5, -104], [21, -78], [5, -51], [-11, -78]]);
  poly(c, bark, [[5, -95], [14, -78], [5, -61], [-4, -78]]);
  box(c, runeColor, 3, -111, 3, 68);
  c.restore();
}

const oak = drawGuardianOak;
export { pine as drawMeadowPine };

function overheadOak(c, burnt = false) {
  for (const [x, y, radius] of [[215, 327, 41], [257, 296, 44], [300, 327, 44], [265, 350, 51]]) {
    pixelCircle(c, burnt ? '#142329' : '#16382f', x, y, radius);
    pixelCircle(c, burnt ? '#283337' : '#365443', x - 4, y - 7, radius * .7);
  }
  poly(c, '#151f27', [[255, 374], [240, 386], [231, 395], [256, 390], [268, 402], [284, 394], [310, 395], [290, 383], [281, 357]]);
  poly(c, burnt ? '#454044' : '#766548', [[255, 337], [271, 340], [283, 383], [273, 391], [258, 383]]);
  box(c, burnt ? '#718579' : '#b2b08a', 266, 370, 3, 13);
}

function topDownActor(c, x, y, time, appearance, eira = false, supported = false, moving = true) {
  const p = getAppearancePalette(appearance), stride = moving ? Math.sin(time * (supported ? 6 : 12)) * (supported ? 2 : 4) : 0;
  const cloth = eira ? '#556c45' : appearance.outfit === 'knight' ? p.metal.base : p.cloth.base;
  const hair = eira ? '#b76632' : p.hair.base, skin = eira ? '#e6b083' : p.skin.base;
  c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(supported && eira ? -.25 : -.32);
  pixelCircle(c, '#10262b', 0, 8, supported ? 12 : 11);
  box(c, '#111f28', -7, 6 + stride, 5, 13); box(c, '#111f28', 3, 6 - stride, 5, 13);
  box(c, '#76523a', -6, 10 + stride, 4, 7); box(c, '#76523a', 4, 10 - stride, 4, 7);
  if (eira || appearance.cloak !== 'none') poly(c, eira ? '#2c493b' : p.cloak.shadow, [[-9, -4], [8, -4], [12 + stride, 17], [-11 + stride, 19]]);
  box(c, '#0e1c26', -11, -8, 22, 17); box(c, cloth, -9, -6, 18, 14);
  box(c, eira ? '#a08c57' : p.cloth.light, -8, -5, 4, 8);
  box(c, '#5b4131', -13, -2 - stride, 4, 12); box(c, skin, -13, 7 - stride, 4, 4);
  box(c, '#5b4131', 9, -2 + stride, 4, 11); box(c, skin, 9, 6 + stride, 4, 4);
  box(c, '#151f28', -6, -15, 12, 12); box(c, skin, -5, -13, 10, 10);
  if (eira || appearance.hairStyle !== 'shaved') { box(c, hair, -6, -15, 12, 7); box(c, eira ? '#e39348' : p.hair.light, -5, -15, 5, 2); }
  if (eira) for (let i = 0; i < 6; i++) box(c, i % 2 ? '#6e3e2c' : '#b86b34', -7 + i % 2, -9 + i * 3, 4, 4);
  if (!supported || !eira) { box(c, '#12232c', 13, -17 + stride, 4, 26); box(c, '#cbdcce', 14, -16 + stride, 2, 21); box(c, '#a88957', 10, 3 + stride, 9, 2); }
  c.restore();
}

function overheadGuardian(c, time, reduced) {
  c.save(); c.translate(92, 95);
  const breath = reduced ? 0 : Math.sin(time * 2) * 1.1;
  pixelCircle(c, '#14232b', 0, 7, 32);
  poly(c, '#0a1422', [[-25, -12], [-31, -25], [-15, -19], [-9, -30], [0, -22], [11, -30], [17, -18], [31, -24], [27, -9], [34, 13], [23, 24], [13, 19], [0, 27], [-15, 20], [-26, 23], [-34, 9]]);
  poly(c, '#284355', [[-20, -9], [-24, -19], [-12, -13], [-6, -21], [1, -14], [10, -21], [16, -12], [24, -16], [20, -3], [26, 12], [17, 17], [7, 13], [0, 19], [-12, 13], [-21, 16], [-25, 7]]);
  for (const side of [-1, 1]) {
    poly(c, '#101d2b', [[side * 18, -2], [side * 33, 0], [side * 36, 23], [side * 28, 38], [side * 20, 34], [side * 24, 17]]);
    for (let finger = 0; finger < 3; finger++) poly(c, '#9baea7', [[side * (23 + finger * 4), 29], [side * (25 + finger * 3), 40], [side * (20 + finger * 4), 34]]);
  }
  c.translate(0, breath);
  poly(c, '#09121f', [[-16, 0], [-20, -10], [-9, -5], [0, -12], [9, -5], [20, -10], [16, 7], [20, 18], [9, 27], [-10, 27], [-20, 18]]);
  poly(c, '#36556a', [[-12, 3], [0, -4], [12, 3], [13, 15], [7, 21], [-7, 21], [-13, 15]]);
  box(c, '#f24b32', -12, 15, 8, 3); box(c, '#f24b32', 5, 15, 8, 3);
  box(c, '#101826', -7, 22, 15, 7); box(c, '#ffc879', -5, 23, 11, 3);
  c.restore();
}

function aroundOak(progress, from, end, outerX) {
  if (progress < .38) { const p = smooth(progress / .38); return [mix(from[0], outerX, p), mix(from[1], 274, p)]; }
  if (progress < .78) { const p = smooth((progress - .38) / .4); return [outerX + Math.sin(p * Math.PI) * 4, mix(274, 402, p)]; }
  const p = smooth((progress - .78) / .22); return [mix(outerX, end[0], p), mix(402, end[1], p)];
}

function fireFront(c, elapsed, reduced, radius, origin = [92, 95]) {
  const [ox, oy] = origin;
  for (let band = 0; band < 4; band++) {
    const outer = Math.max(1, radius - band * 9), inner = Math.max(1, outer - [100, 60, 28, 16][band]), points = [];
    for (let x = -15; x <= 380; x += 10) {
      const d = outer * outer - (x - ox) ** 2;
      if (d < 0) continue;
      const tongue = (Math.sin(x * .19 + elapsed * (reduced ? 1 : 5)) + Math.sin(x * .053 - elapsed * 2) * .6) * (reduced ? 4 : 10);
      points.push([x, oy + Math.sqrt(d) + tongue]);
    }
    for (let x = 380; x >= -15; x -= 10) {
      const d = inner * inner - (x - ox) ** 2;
      if (d >= 0) points.push([x, oy + Math.sqrt(d)]);
    }
    if (points.length > 3) poly(c, ['#8d3027', '#dc5728', '#f5a442', '#ffdda0'][band], points);
  }
}

/** 32-second film; elapsed is the only animation clock, so seeks and reloads match. */
export function createFirestormRenderer(canvas) {
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d', { alpha: false });
  if (!c) throw new Error('Firestorm canvas is unavailable');
  const doc = canvas.ownerDocument;
  const battleCanvas = doc.createElement('canvas'), capture = doc.createElement('canvas'); capture.width = W; capture.height = H;
  const battle = createRenderer(battleCanvas), eira = createEiraBattleRenderer(doc), forest = createBackground(doc);
  const green = canvasLayer(doc, brush => meadow(brush, false, true)), black = canvasLayer(doc, brush => meadow(brush, true, true));
  const wide = canvasLayer(doc, brush => {
    brush.drawImage(forest.image, 0, 0, W, 293, 0, 0, W, 293);
    poly(brush, '#183b43', [[0, 267], [61, 248], [150, 280], [214, 256], [W, 271], [W, H], [0, H]]);
    brush.save(); brush.beginPath(); brush.rect(0, 320, W, H - 320); brush.clip(); meadow(brush, true); brush.restore();
    for (let i = 0; i < 17; i++) pine(brush, i * 24 - 10, 332 + hash(i, 49) * 15, 46 + hash(i, 48) * 40, true);
  });
  const hero = doc.createElement('canvas'); hero.width = 112; hero.height = 170;
  let appearanceKey = '', appearance = normalizeAppearance(), captured = false, destroyed = false;
  const ember = (time, amount = 1, ash = false, reduced = false) => {
    c.save(); c.globalAlpha = amount;
    const count = reduced ? 24 : 65;
    for (let i = 0; i < count; i++) {
      const x = (hash(i, 85) * 470 + time * (ash ? 7 : 34)) % 470 - 55;
      const y = (hash(i, 86) * 660 - time * (ash ? -9 : 26) + 1320) % 660 - 30;
      box(c, ash ? (i % 3 ? '#8a8c81' : '#d3c7a7') : (i % 3 ? '#e2813b' : '#ffcf7c'), x, y, i % 5 ? 2 : 3, 2);
    }
    c.restore();
  };
  const drawCompanion = (state, x, ground, scale, time, reduced, crouch = 0, mirror = false) => {
    const pose = { ...state, status: 'playing', turn: 'player', phase: 'idle', eiraHurtTimer: 0 };
    c.save(); if (mirror) { c.translate(x * 2, 0); c.scale(-1, 1); }
    eira.draw(c, pose, time, reduced, { intro: 1, eiraStage: { amount: 1, moving: false }, eiraBlock: crouch * .25, eiraDodge: 0 }, { eira: { x, y: ground, scale } }, crouch);
    c.restore();
  };
  const drawPlayer = (x, ground, scale, crouch = 0) => {
    c.save(); c.translate(x, ground); c.rotate(-crouch * .14); c.drawImage(hero, -56 * scale, -168 * scale + crouch * 24 * scale, 112 * scale, 170 * scale); c.restore();
  };
  const originPose = (state, t) => {
    const source = state.cinematic?.origin || {}, arena = state.arena || { player: { x: 0, z: 3.2 }, enemy: { x: 0, z: 0 }, eira: { x: -1.8, z: .65 }, enemyFacing: 0 };
    const angle = Math.atan2(arena.enemy.x - arena.player.x, arena.enemy.z - arena.player.z);
    const retreat = 2.4, eiraStrike = source.turn === 'eira';
    return {
      ...state, ...source, arena, status: 'playing', scene: 'battle', cinematic: null, turn: eiraStrike && t < .7 ? 'eira' : 'player',
      phase: eiraStrike && t < .7 ? 'recover' : 'idle', phaseTime: Math.min(.28, t), phaseDuration: .28, strikeResolved: eiraStrike,
      reaction: null, facingMotion: null, enemyTarget: 'player', block: false,
      attackTimer: Math.max(0, (source.attackTimer || 0) - t), attackDuration: source.attackDuration || .72,
      enemyHurtTimer: Math.max(0, (source.enemyHurtTimer || .12) - t), hurtTimer: 0, parryTimer: 0, restTimer: 0, eiraHurtTimer: 0, eiraBlockTimer: 0, enemyBlockTimer: 0,
      roarAmount: smooth((t - 5.1) / 1.8),
      motion: { actor: 'enemy', kind: 'retreat', from: { ...arena.enemy }, to: { x: arena.enemy.x + Math.sin(angle) * retreat, z: arena.enemy.z + Math.cos(angle) * retreat }, time: clamp(t / 4.7) * 4.7, duration: 4.7 },
    };
  };
  const opening = (state, t, reduced) => {
    const pose = originPose(state, t), source = state.cinematic?.origin || {}, stage = { amount: source.turn === 'eira' ? 1 - smooth(t / 1.1) : 0, moving: t < 1.1, progress: clamp(t / 1.1), direction: -1 };
    battle.renderBattleSnapshot(pose, t + 3.2, reduced, { lifeTime: 3.2, eiraStage: stage });
    c.drawImage(battleCanvas, 0, 0);
    if (captured && t < 1.25) { c.globalAlpha = 1 - smooth((t - .1) / 1.15); c.drawImage(capture, 0, 0); c.globalAlpha = 1; }
    const heat = smooth((t - 4.7) / 3.5);
    if (heat > 0) {
      const view = getLivingArenaView(getArenaView(pose), pose, 3.2, reduced, stage), p = getBattleProjection(view, reduced);
      c.save(); c.globalAlpha = heat * .43;
      poly(c, '#611f25', [[0, H], [40, 432], [p.monsterX, p.monsterFoot - 30], [330, 450], [W, H]]);
      c.restore();
      for (let i = 0; i < 15; i++) {
        const x = p.monsterX + (hash(i, 100) - .5) * 75 * p.monsterScale, y = p.monsterFoot - hash(i, 102) * 165 * p.monsterScale;
        c.globalAlpha = heat * .8; box(c, i % 3 ? '#ee7035' : '#ffd179', x, y, 2, 5 * p.monsterScale);
      }
      c.globalAlpha = 1;
      for (let i = 0; i < 15; i++) {
        const x = hash(i, 111) * W, y = 438 + hash(i, 112) * 160;
        poly(c, '#152129', [[x, y], [x + 4, y - heat * 30], [x + 9, y - heat * 13], [x + 13, y + 3]]);
      }
      ember(t, heat * .45, false, reduced);
    }
    if (t > 5.5) drawCompanion(state, mix(-100, 66, smooth((t - 5.5) / .8)), 440, .91, t, reduced, state.eira?.health <= 0 ? .72 : 0);
  };
  const overhead = (state, t, reduced) => {
    c.drawImage(green, 0, 0);
    const radius = 35 + Math.pow(clamp((t - 10.2) / 6.8), 1.23) * 450;
    c.save(); c.beginPath(); c.arc(92, 95, radius, 0, Math.PI * 2); c.clip(); c.drawImage(black, 0, 0); c.restore();
    // The trunk intercepts the wave; its shadow follows the incoming radial fire.
    const reachedOak = radius > 307;
    overheadGuardian(c, t, reduced);
    if (t > 10.2) fireFront(c, t, reduced, radius);
    if (reachedOak) { c.save(); c.beginPath(); c.moveTo(220, 365); c.lineTo(269, 355); c.lineTo(515, 700); c.lineTo(376, 700); c.closePath(); c.clip(); c.drawImage(green, 0, 0); c.restore(); }
    c.save(); c.translate(-22, 0); overheadOak(c, reachedOak); c.restore();
    const run = clamp((t - 9.25) / 7), wounded = state.eira?.health <= 0;
    const [hx, hy] = aroundOak(run, [166, 234], [wounded ? 262 : 258, 424], wounded ? 277 : 279);
    const [ex, ey] = wounded ? [hx + 18, hy - 1] : aroundOak(run, [202, 246], [290, 420], 299);
    topDownActor(c, hx, hy, t, appearance, false, wounded, run < .999);
    topDownActor(c, ex, ey, t, appearance, true, wounded, run < .999);
    if (wounded) { box(c, '#18312e', hx + 5, hy - 5, 19, 5); box(c, getAppearancePalette(appearance).skin.base, hx + 8, hy - 4, 11, 3); }
    ember(t, smooth((t - 10.5) / 3) * .6, false, reduced);
  };
  const shelter = (state, t, reduced) => {
    const force = smooth((t - 17.8) / .8) * (1 - smooth((t - 22.1) / 2.7)), impact = smooth((t - 17.8) / .5) * (1 - smooth((t - 20.5) / 1.6));
    c.drawImage(wide, 0, 0);
    c.save();
    if (!reduced) c.translate(Math.round(Math.sin(t * 39) * impact * 2), Math.round(Math.sin(t * 31) * impact));
    // A continuous wall, visibly split around the huge trunk instead of one flash.
    poly(c, '#542027', [[0, 0], [162, 190], [170, 467], [222, H], [0, H]]);
    c.save(); c.globalAlpha = force; c.beginPath(); c.rect(0, 0, 225, H); c.clip();
    poly(c, '#b34327', [[0, 0], [154, 186], [178, 486], [205, H], [0, H]]);
    for (let i = 0; i < 43; i++) {
      const x = ((t * (reduced ? 15 : 51) + hash(i, 167) * 320) % 320) - 90, y = hash(i, 168) * 670 - 25;
      const width = 48 + hash(i, 169) * 49, height = 15 + hash(i, 170) * 28;
      poly(c, i % 3 ? '#dd692d' : '#f08d36', [[x - width, y + height], [x - width * .6, y - height * .4], [x - 8, y], [x + 15, y - height * .8], [x + width * .42, y - height * .45], [x + width, y], [x + 23, y + height * .7], [x - 18, y + height * .5]]);
      poly(c, '#ffc568', [[x - 35, y + 9], [x - 13, y], [x + 16, y + 3], [x + width * .7, y], [x + 11, y + height * .44]]);
    }
    c.restore();
    poly(c, '#10292c', [[214, 310], [361, 265], [361, 588], [222, 548]]);
    oak(c, 160, 551, 2.03, smooth((t - 19.4) / 4.4), impact);
    const crouch = .45 + impact * .4;
    drawPlayer(251, 487, .9, crouch);
    drawCompanion(state, 284, 490, .57, t, reduced, state.eira?.health <= 0 ? 1 : crouch, true);
    if (state.eira?.health <= 0) {
      const skin = getAppearancePalette(appearance).skin.base;
      poly(c, '#213c39', [[263, 401], [275, 404], [285, 424], [278, 430], [270, 414], [263, 413]]);
      box(c, skin, 277, 418, 8, 7);
    }
    // Streaming fire passes overhead and at the roots, leaving the people in the lee.
    c.globalAlpha = force;
    for (const baseY of [138, 550]) for (let i = 0; i < 6; i++) {
      const x = (t * (reduced ? 19 : 74) + i * 61) % 490 - 85;
      const y = baseY + Math.sin(i * 2 + t * 1.3) * 15;
      poly(c, i % 2 ? '#d85f2d' : '#efa04a', [[x, y], [x + 36, y - 9], [x + 70, y - 1], [x + 34, y + 8], [x - 8, y + 4]]);
    }
    c.globalAlpha = 1; c.restore(); ember(t, force * .6, false, reduced);
  };
  const aftermath = (state, t, reduced) => {
    c.drawImage(wide, 0, 0);
    const clearing = smooth((t - 24) / 5), collapse = smooth((t - 27.1) / 1.9);
    c.save(); c.globalAlpha = (1 - clearing) * .36; box(c, '#9c684d', 0, 0, W, H); c.restore();
    const threat = { ...state, status: 'playing', turn: 'player', phase: 'idle', enemyHurtTimer: 0, roarAmount: 0, enemyEyesClosed: collapse >= 1 };
    c.save(); c.translate(77, 390); c.rotate(collapse * 1.48); c.scale(.49, .49); c.translate(-180, -406);
    drawMonster(c, threat, collapse >= 1 ? 29 : t, reduced, 0, 1, collapse < .15 ? Math.sin(t * 3) * .12 : 0);
    c.restore();
    oak(c, 248, 391, .9, true, .18 * (1 - smooth((t - 25) / 5)));
    drawPlayer(278, 425, .39, .18);
    drawCompanion(state, 303, 425, .245, t, reduced, state.eira?.health <= 0 ? .95 : .25, true);
    if (state.eira?.health <= 0) box(c, getAppearancePalette(appearance).skin.base, 288, 386, 13, 3);
    for (let i = 0; i < 24; i++) {
      const x = hash(i, 144) * W, y = 347 + hash(i, 145) * 205;
      box(c, i % 4 ? '#393536' : '#8c5239', x, y, 3, 1);
    }
    ember(t, .45 * (1 - smooth((t - 29) / 7)), true, reduced);
  };
  return {
    captureBattleFrame(sourceCanvas) {
      if (destroyed || !sourceCanvas?.width || !sourceCanvas?.height) return;
      const brush = capture.getContext('2d'); brush.imageSmoothingEnabled = false; brush.clearRect(0, 0, W, H); brush.drawImage(sourceCanvas, 0, 0, W, H); captured = true;
    },
    render(state, visualTime = 0, reducedMotion = false) {
      if (destroyed) return;
      // visualTime is intentionally irrelevant: pause, seeking and reload all use elapsed.
      void visualTime;
      const t = state.scene === 'sanctuary' ? 32 : Math.max(0, Math.min(32, Number.isFinite(state.cinematic?.elapsed) ? state.cinematic.elapsed : 0));
      const next = normalizeAppearance(state.appearance), key = JSON.stringify(next);
      if (key !== appearanceKey) { appearanceKey = key; appearance = next; const brush = hero.getContext('2d'); brush.clearRect(0, 0, hero.width, hero.height); drawHero(brush, appearance, { view: 'side', time: 0, reducedMotion: true, y: 1 }); }
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.imageSmoothingEnabled = false;
      if (t < 9) opening(state, t, reducedMotion);
      else if (t < 17) overhead(state, t, reducedMotion);
      else if (t < 24) shelter(state, t, reducedMotion);
      else aftermath(state, t, reducedMotion);
      // Brief motivated editorial cuts; no flashing white screens or strobing.
      for (const cut of [9, 17, 24]) {
        const veil = Math.max(0, 1 - Math.abs(t - cut) / .18);
        if (veil) { c.globalAlpha = veil * (reducedMotion ? .35 : .6); box(c, '#0b1620', 0, 0, W, H); c.globalAlpha = 1; }
      }
    },
    destroy() {
      if (destroyed) return; destroyed = true; battle.destroy(); eira.destroy();
      for (const layer of [battleCanvas, capture, hero, green, black, wide, forest.image, forest.distant, forest.ground, ...forest.props.map(p => p.canvas)]) if (layer) layer.width = 0;
    },
  };
}
