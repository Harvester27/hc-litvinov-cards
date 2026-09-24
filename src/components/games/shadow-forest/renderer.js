import { getAppearancePalette, normalizeAppearance } from "./appearance.mjs";
import { getArenaView } from "./spatial.mjs";
import { createArenaBackdrop, getBattleProjection, getEnemyAttackPose } from "./battleSceneRenderer.js";
import { getLivingArenaView, createEiraStaging, getEiraStage } from "./battleAnimation.mjs";
import { createEiraBattleRenderer, getEiraSwordContact } from "./eiraBattleRenderer.js";

const WIDTH = 360;
const HEIGHT = 600;

function randomSource(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function polygon(context, color, points) {
  context.fillStyle = color;
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(Math.round(x), Math.round(y));
    else context.lineTo(Math.round(x), Math.round(y));
  });
  context.closePath();
  context.fill();
}

function pixels(context, color, rectangles) {
  context.fillStyle = color;
  rectangles.forEach(([x, y, width = 1, height = width]) => {
    context.fillRect(Math.round(x), Math.round(y), width, height);
  });
}

function furTufts(context, color, tufts) {
  tufts.forEach(([x, y, size = 1, direction = 1]) => {
    polygon(context, color, [
      [x, y], [x + 3 * size, y - size], [x + 4 * size, y + 2 * size],
      [x + 5 * size, y + 2 * size], [x + (4 + direction) * size, y + 6 * size],
      [x + 2 * size, y + 4 * size], [x + size, y + 5 * size],
    ]);
  });
}

function pine(context, x, bottom, height, palette, seed) {
  const random = randomSource(seed);
  const top = bottom - height;
  const width = height * 0.31;
  polygon(context, palette[0], [
    [x - height * 0.026, bottom], [x - height * 0.01, top + height * 0.12],
    [x + height * 0.013, top + height * 0.12], [x + height * 0.046, bottom],
  ]);
  for (let level = 8; level >= 0; level -= 1) {
    const amount = level / 9;
    const y = top + height * (0.12 + amount * 0.65);
    const half = width * (0.14 + amount * 0.86);
    const depth = height * (0.14 + amount * 0.04);
    polygon(context, palette[1], [
      [x, y - depth], [x - half * 0.23, y - depth * 0.43],
      [x - half * 0.41, y - depth * 0.46], [x - half * 0.36, y - depth * 0.26],
      [x - half * 0.68, y - depth * 0.06], [x - half * 0.60, y + depth * 0.02],
      [x - half, y + depth * 0.23], [x - half * 0.83, y + depth * 0.28],
      [x - half * 0.95, y + depth * 0.40], [x - half * 0.30, y + depth * 0.32],
      [x, y + depth * 0.23], [x + half * 0.76, y + depth * 0.39],
      [x + half, y + depth * 0.25], [x + half * 0.70, y + depth * 0.12],
      [x + half * 0.79, y + depth * 0.07], [x + half * 0.48, y - depth * 0.17],
      [x + half * 0.52, y - depth * 0.25], [x + half * 0.25, y - depth * 0.45],
    ]);
    polygon(context, palette[2], [
      [x, y - depth], [x - half * 0.20, y - depth * 0.39],
      [x - half * 0.34, y - depth * 0.33], [x - half * 0.25, y - depth * 0.20],
      [x - half * 0.66, y + depth * 0.03], [x - half * 0.53, y + depth * 0.09],
      [x - half * 0.88, y + depth * 0.26], [x - half * 0.57, y + depth * 0.23],
      [x - half * 0.35, y + depth * 0.08], [x - half * 0.12, y + depth * 0.07],
      [x - half * 0.04, y - depth * 0.16], [x + half * 0.19, y - depth * 0.09],
    ]);
    context.fillStyle = palette[3] || palette[2];
    for (let detail = 0; detail < 12; detail += 1) {
      const u = random();
      const dx = x - half * (0.2 + u * 0.6);
      const dy = y + depth * (0.21 - (1 - u) * 0.36);
      context.fillRect(Math.round(dx), Math.round(dy), 2 + Math.round(height / 65), 1 + Math.round(height / 150));
      if (height > 180) {
        context.fillRect(Math.round(dx) + 2, Math.round(dy) + 2, 2, 3);
        context.fillRect(Math.round(dx) - 2, Math.round(dy) + 1, 2, 1);
      }
    }
  }
}

export function createBackground(ownerDocument) {
  const canvas = ownerDocument.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  const scenery = { props: [] };
  const snapshot = () => {
    const layer = ownerDocument.createElement("canvas");
    layer.width = WIDTH; layer.height = HEIGHT;
    layer.getContext("2d").drawImage(canvas, 0, 0);
    return layer;
  };
  const prop = (x, bottom, width, height, draw) => {
    const layer = ownerDocument.createElement("canvas");
    const left = Math.floor(x - width / 2 - 4);
    const top = Math.floor(bottom - height - 4);
    layer.width = Math.ceil(width + 8); layer.height = Math.ceil(height + 12);
    const brush = layer.getContext("2d");
    brush.translate(-left, -top);
    draw(brush);
    draw(context);
    scenery.props.push({ canvas: layer, x, bottom, left, top });
  };
  const random = randomSource(381947);
  const skyTop = [5, 12, 32];
  const skyBottom = [22, 66, 100];
  for (let y = 0; y < 345; y += 3) {
    const blend = (y / 345) ** 1.45;
    const values = skyTop.map((channel, index) => Math.round(channel + (skyBottom[index] - channel) * blend));
    pixels(context, `rgb(${values.join(",")})`, [[0, y, WIDTH, 3]]);
  }
  pixels(context, "#08213a", [[0, 337, WIDTH, 263]]);

  // The halo and moon use stepped pixels, including the edge of the light.
  polygon(context, "#0b1b33", [[238, 3], [284, 3], [284, 12], [299, 12], [299, 26], [307, 26], [307, 59], [299, 59], [299, 73], [284, 73], [284, 82], [238, 82], [238, 73], [224, 73], [224, 59], [216, 59], [216, 26], [224, 26], [224, 12], [238, 12]]);
  polygon(context, "#102944", [[242, 12], [279, 12], [279, 19], [290, 19], [290, 29], [297, 29], [297, 54], [290, 54], [290, 65], [279, 65], [279, 72], [242, 72], [242, 65], [232, 65], [232, 54], [225, 54], [225, 29], [232, 29], [232, 19], [242, 19]]);
  polygon(context, "#193851", [[246, 18], [276, 18], [276, 24], [284, 24], [284, 32], [290, 32], [290, 51], [284, 51], [284, 59], [276, 59], [276, 65], [246, 65], [246, 59], [239, 59], [239, 51], [233, 51], [233, 32], [239, 32], [239, 24], [246, 24]]);
  polygon(context, "#8eadb3", [[252, 21], [270, 21], [270, 24], [279, 24], [279, 29], [284, 29], [284, 49], [280, 49], [280, 57], [273, 57], [273, 61], [252, 61], [252, 57], [245, 57], [245, 50], [241, 50], [241, 33], [245, 33], [245, 25], [252, 25]]);
  polygon(context, "#d0dfce", [[253, 22], [269, 22], [269, 26], [277, 26], [277, 31], [281, 31], [281, 46], [277, 46], [277, 53], [270, 53], [270, 58], [254, 58], [254, 53], [246, 53], [246, 33], [251, 33], [251, 26], [253, 26]]);
  pixels(context, "#a6c4be", [[250, 33, 5, 7], [255, 30, 7, 5], [255, 38, 3, 3], [266, 44, 8, 6], [263, 48, 4, 5], [273, 30, 4, 7], [251, 49, 5, 3]]);
  for (let index = 0; index < 93; index += 1) {
    const x = Math.floor(random() * WIDTH);
    const y = Math.floor(random() * 227);
    if (x > 230 && x < 292 && y < 78) continue;
    const size = random() > 0.88 ? 2 : 1;
    pixels(context, index % 3 ? "#80a8c2" : "#d0dcce", [[x, y, size, size]]);
    if (size === 2 && index % 2 === 0) pixels(context, "#385a7b", [[x - 1, y, 1, 2], [x + 2, y, 1, 2], [x, y - 1, 2, 1], [x, y + 2, 2, 1]]);
  }
  polygon(context, "#16385a", [[0, 229], [28, 204], [45, 211], [63, 190], [92, 210], [112, 197], [143, 229], [175, 211], [208, 222], [235, 190], [254, 202], [271, 185], [294, 204], [324, 184], [360, 206], [360, 337], [0, 337]]);

  for (let index = 0; index < 32; index += 1) {
    const x = index * 13 - 12;
    const height = 42 + random() * 55;
    pine(context, x, 295 + random() * 10, height, ["#204869", "#204968", "#285572"], index + 8);
  }
  polygon(context, "#2b5874", [[0, 291], [52, 280], [100, 286], [139, 278], [190, 283], [236, 280], [303, 289], [360, 278], [360, 310], [0, 310]]);
  for (let index = 0; index < 16; index += 1) {
    const x = index * 26 - 11;
    const height = 100 + random() * 88;
    if (x > 128 && x < 223) continue;
    pine(context, x, 324 + random() * 16, height, ["#122c46", "#10304e", "#1b4260", "#24516c"], 600 + index);
  }
  scenery.distant = snapshot();
  // Distant mist stays behind the creature so its outline reads clearly.
  polygon(context, "#39677f", [[62, 292], [121, 291], [143, 287], [204, 288], [221, 292], [284, 292], [306, 298], [233, 301], [205, 298], [138, 300], [120, 298], [63, 299]]);
  polygon(context, "#244d68", [[0, 318], [45, 307], [86, 312], [114, 304], [176, 308], [208, 300], [256, 307], [278, 299], [324, 305], [360, 300], [360, 353], [0, 353]]);
  polygon(context, "#0e3551", [[0, 338], [61, 328], [112, 332], [164, 321], [230, 327], [285, 315], [360, 321], [360, 600], [0, 600]]);
  polygon(context, "#174763", [[0, 353], [60, 336], [118, 343], [151, 331], [195, 337], [243, 328], [311, 335], [360, 328], [360, 407], [307, 394], [221, 408], [135, 397], [63, 411], [0, 397]]);
  polygon(context, "#1b4c68", [[184, 292], [204, 291], [231, 302], [236, 315], [224, 331], [184, 350], [174, 367], [188, 385], [249, 406], [284, 449], [319, 488], [351, 539], [360, 600], [13, 600], [49, 541], [81, 495], [133, 453], [153, 423], [139, 397], [130, 374], [143, 350], [183, 327], [206, 312], [204, 302]]);
  polygon(context, "#3b6480", [[187, 295], [203, 295], [221, 304], [225, 315], [213, 329], [176, 348], [164, 367], [172, 387], [225, 411], [248, 436], [223, 445], [194, 416], [153, 395], [145, 376], [155, 350], [192, 326], [211, 313], [211, 305]]);
  polygon(context, "#2c5674", [[178, 399], [200, 416], [214, 444], [195, 472], [155, 506], [122, 550], [104, 600], [24, 600], [61, 540], [95, 500], [145, 456], [164, 424], [154, 399]]);
  polygon(context, "#244a68", [[195, 426], [194, 448], [166, 480], [113, 529], [81, 586], [78, 600], [94, 600], [111, 559], [147, 516], [190, 478], [215, 449], [209, 432]]);
  polygon(context, "#46728b", [[212, 303], [218, 306], [219, 315], [203, 329], [170, 349], [159, 366], [160, 377], [155, 371], [157, 358], [168, 345], [204, 324], [214, 314]]);
  for (let index = 0; index < 680; index += 1) {
    const y = 327 + Math.floor(random() * 273);
    const x = Math.floor(random() * WIDTH);
    const depth = (y - 300) / 300;
    const color = ["#1c4560", "#24516b", "#102d48", "#315c75"][index % 4];
    const width = 1 + Math.floor(random() * (2 + depth * 6));
    const height = 1 + Math.floor(depth * 2);
    if (random() > 0.3) pixels(context, color, [[x, y, width, height]]);
  }
  scenery.ground = snapshot();
  // Each tree has a world anchor so walking changes its perspective separately.
  prop(13, 373, 389 * .67, 389 * 1.13, c => pine(c, 13, 373, 389, ["#07192b", "#06192d", "#0d2941", "#153851"], 412));
  prop(60, 334, 247 * .67, 247 * 1.13, c => pine(c, 60, 334, 247, ["#0a2237", "#0b2239", "#133650", "#1d4862"], 719));
  prop(342, 373, 426 * .67, 426 * 1.13, c => pine(c, 342, 373, 426, ["#061729", "#06182c", "#0b2941", "#123b54"], 803));
  prop(294, 323, 236 * .67, 236 * 1.13, c => pine(c, 294, 323, 236, ["#0b243a", "#0a2137", "#10324b", "#1b4560"], 811));
  prop(48, 405, 112, 32, c => polygon(c, "#071b2c", [[0, 387], [28, 378], [61, 382], [83, 375], [74, 385], [103, 381], [91, 391], [42, 402], [0, 408]]));
  prop(318, 385, 98, 42, c => polygon(c, "#081f32", [[279, 363], [310, 351], [332, 355], [360, 346], [360, 386], [302, 382], [315, 369], [272, 374]]));
  // Small rocks are outlined with cold, chipped moonlit upper faces.
  const rock = (context, x, y, size) => {
    polygon(context, "#081d31", [[x - size, y], [x - size * 0.8, y - size * 0.5], [x - size * 0.25, y - size * 0.8], [x + size * 0.55, y - size * 0.6], [x + size, y - size * 0.1], [x + size * 0.8, y + size * 0.2], [x - size * 0.6, y + size * 0.2]]);
    polygon(context, "#36556a", [[x - size, y], [x - size * 0.7, y - size * 0.5], [x - size * 0.25, y - size * 0.7], [x + size * 0.5, y - size * 0.5], [x + size * 0.13, y - size * 0.22], [x - size * 0.4, y - size * 0.28]]);
    polygon(context, "#1b354b", [[x - size * 0.4, y - size * 0.28], [x + size * 0.13, y - size * 0.22], [x + size * 0.5, y - size * 0.5], [x + size, y - size * 0.1], [x + size * 0.7, y + size * 0.12], [x - size * 0.4, y + size * 0.1]]);
    pixels(context, "#557080", [[x - size * 0.57, y - size * 0.52, size * 0.28, 2]]);
  };
  [[87, 375, 14], [249, 352, 8], [321, 437, 26], [39, 471, 19], [108, 420, 6]].forEach(([x, y, size]) => {
    prop(x, y, size * 2.1, size, c => rock(c, x, y, size));
  });
  for (let index = 0; index < 120; index += 1) {
    const x = Math.floor(random() * WIDTH);
    const y = 338 + Math.floor(random() * 235);
    const pathCenter = y < 390 ? 175 : 170;
    const pathHalf = (y - 300) * 0.33;
    if (Math.abs(x - pathCenter) < pathHalf) continue;
    const height = 3 + Math.floor(random() * 7 * (y / 400));
    const color = index % 3 === 0 ? "#386a78" : "#0c2b41";
    prop(x, y, 12, height + 4, c => polygon(c, color, [[x - 3, y], [x - 5, y - height], [x - 1, y - 3], [x, y - height - 3], [x + 2, y - 4], [x + 5, y - height + 2], [x + 3, y]]));
  }
  // Tiny fungi give the foreground a little life and scale.
  // Keep their original painting order at the establishing shot.
  pixels(context, "#628b8b", [[48, 404, 2, 5], [55, 407, 1, 4], [316, 388, 2, 5]]);
  pixels(context, "#80b7ad", [[44, 402, 9, 2], [47, 400, 4, 2], [53, 405, 5, 2], [312, 386, 9, 2], [315, 384, 4, 2]]);
  return { image: canvas, ...scenery };
}

function drawArm(context, side, lift, flash) {
  context.save();
  context.translate(side * 44, -58);
  context.scale(side, 1);
  context.rotate(lift);
  polygon(context, "#030c19", [[-16, -6], [-1, -15], [8, -12], [13, -18], [23, 1], [27, 16], [24, 26], [30, 21], [31, 45], [39, 60], [40, 78], [36, 88], [31, 99], [27, 99], [29, 78], [23, 82], [22, 103], [17, 106], [15, 104], [17, 80], [11, 81], [9, 100], [4, 100], [3, 96], [6, 75], [0, 65], [4, 52], [-2, 32], [-10, 24], [-13, 8]]);
  polygon(context, flash ? "#446578" : "#10273d", [[-13, -4], [0, -11], [6, -8], [10, -12], [19, 3], [23, 19], [18, 16], [21, 29], [15, 26], [18, 42], [10, 52], [7, 43], [4, 25], [-4, 15]]);
  polygon(context, flash ? "#5f8390" : "#214158", [[-10, -3], [-2, -8], [5, -6], [13, 5], [14, 14], [8, 9], [10, 20], [5, 16], [-1, 2]]);
  polygon(context, "#101e31", [[21, 38], [24, 51], [33, 62], [35, 76], [29, 71], [19, 75], [7, 70], [6, 60], [12, 51]]);
  furTufts(context, "#1a354a", [[-4, -3, 0.9], [3, 8, 1.1], [10, 24, 0.9], [11, 41, 1.1], [18, 48, 0.8], [25, 57, 0.8]]);
  furTufts(context, "#0a172a", [[6, 1, 0.7], [14, 13, 0.9], [7, 28, 0.8], [19, 32, 1], [11, 59, 0.8], [23, 68, 0.7]]);
  pixels(context, "#2c4a5d", [[-4, -4, 2, 4], [1, 3, 1, 4], [6, 13, 1, 5], [11, 30, 1, 4], [14, 47, 2, 3], [25, 57, 1, 3]]);
  pixels(context, "#2a3f51", [[15, 57, 3, 7], [22, 60, 3, 6], [30, 64, 3, 6]]);
  polygon(context, "#8faba9", [[5, 92], [8, 91], [7, 101], [4, 105], [3, 101]]);
  polygon(context, "#9bb3af", [[17, 98], [21, 98], [19, 107], [15, 112], [14, 107]]);
  polygon(context, "#6f9296", [[29, 91], [33, 87], [31, 99], [26, 105], [26, 100]]);
  context.restore();
}

function drawMonsterLeg(context, side, stride = 0) {
  context.save();
  if (stride !== 0) {
    // Pivot each leg at the hip. A forward paw reaches down toward the camera;
    // the other knee bends and lifts before their roles reverse.
    const hipX = side < 0 ? -22 : 20;
    context.translate(hipX, 19 - Math.max(0, -stride) * 5);
    context.rotate(stride * 0.09);
    context.scale(1 + Math.max(0, stride) * 0.035, 1 + stride * 0.12);
    context.translate(-hipX, -19);
  }
  if (side < 0) {
    polygon(context, "#030c18", [[-36, 11], [-7, 15], [1, 35], [-10, 61], [-11, 87], [-4, 91], [-4, 98], [-44, 98], [-47, 91], [-40, 76], [-44, 60], [-39, 36]]);
    polygon(context, "#11273a", [[-33, 27], [-21, 34], [-18, 50], [-27, 65], [-26, 88], [-37, 89], [-34, 68], [-38, 59]]);
    polygon(context, "#203b4d", [[-35, 29], [-28, 31], [-27, 46], [-33, 54], [-35, 48]]);
    furTufts(context, "#1b3345", [[-32, 37, 0.8], [-28, 54, 0.8], [-32, 70, 0.7]]);
    furTufts(context, "#0b1c2d", [[-28, 43, 0.8], [-23, 62, 0.7]]);
    pixels(context, "#76969a", [[-43, 95, 5, 2], [-34, 95, 5, 2], [-24, 95, 5, 2]]);
  } else {
    polygon(context, "#030c18", [[4, 18], [31, 11], [39, 39], [34, 62], [43, 80], [49, 87], [48, 95], [8, 95], [6, 88], [13, 81], [8, 61], [-1, 44]]);
    polygon(context, "#102436", [[12, 34], [28, 26], [32, 42], [25, 60], [32, 85], [22, 86], [17, 63], [9, 51]]);
    furTufts(context, "#1b3345", [[20, 37, 0.9], [19, 56, 0.8], [25, 75, 0.8]]);
    furTufts(context, "#0b1c2d", [[17, 44, 0.9], [24, 62, 0.7]]);
    pixels(context, "#76969a", [[18, 92, 5, 2], [28, 92, 5, 2], [39, 92, 5, 2]]);
  }
  context.restore();
}

function drawMonsterGuard(context, flash, facing = 0, amount = 1) {
  // Elbows remain outside the ribcage; both furry forearms and pale claws cross
  // over the chest. This is a defensive pose, not the attack's raised arm.
  for (const side of [facing < 0 ? 1 : -1, facing < 0 ? -1 : 1]) {
    context.save();
    context.globalAlpha *= amount;
    context.scale(side, 1);
    context.translate(42, -60);
    context.rotate((1 - amount) * -1.3);
    context.translate(-42, 60);
    polygon(context, "#030c19", [[33, -73], [49, -68], [57, -40], [56, -16], [45, -9], [28, -17], [6, -36], [-10, -40], [-20, -52], [-17, -67], [-5, -72], [8, -58], [28, -44], [31, -58]]);
    polygon(context, flash ? "#7cabae" : "#244b5e", [[35, -66], [44, -63], [50, -39], [49, -23], [42, -20], [20, -37], [2, -44], [-10, -45], [-14, -54], [-11, -63], [-5, -64], [6, -52], [29, -36], [35, -41]]);
    polygon(context, flash ? "#c2dfd7" : "#3c6170", [[35, -65], [41, -61], [43, -44], [37, -39], [27, -43], [5, -57], [0, -62], [8, -56], [31, -44]]);
    polygon(context, "#122b3e", [[41, -25], [47, -23], [44, -16], [26, -25], [6, -40], [-6, -41], [-14, -48], [-5, -47], [14, -39], [32, -28]]);
    furTufts(context, flash ? "#b4d1cb" : "#3b5b6a", [[34, -59, .8], [38, -47, .8], [29, -35, 1, -1], [17, -43, .9, -1], [4, -50, .7, -1]]);
    for (let finger = 0; finger < 3; finger++) {
      const x = -12 + finger * 7;
      const y = -52 - finger * 3;
      polygon(context, "#081726", [[x - 4, y + 4], [x - 6, y - 6], [x - 12, y - 18], [x - 9, y - 21], [x - 1, y - 13], [x + 3, y - 3], [x + 2, y + 4]]);
      polygon(context, flash ? "#effff1" : "#afc5b8", [[x - 4, y - 5], [x - 10, y - 18], [x - 8, y - 17], [x - 2, y - 11], [x, y - 3]]);
    }
    context.restore();
  }
}

function drawMonsterRearHead(context, flash) {
  polygon(context, "#020b17", [[-29, 2], [-32, -48], [-23, -42], [-14, -26], [-6, -40], [0, -47], [7, -31], [15, -26], [23, -43], [31, -49], [30, -4], [37, 9], [29, 11], [30, 23], [19, 22], [15, 37], [5, 32], [-1, 42], [-8, 34], [-18, 35], [-21, 21], [-31, 23], [-29, 12], [-36, 9]]);
  polygon(context, flash ? "#64858f" : "#1b384d", [[-27, -38], [-19, -26], [-10, -19], [-4, -32], [1, -37], [6, -22], [17, -17], [25, -35], [24, -7], [29, 5], [23, 7], [23, 17], [12, 14], [9, 28], [2, 24], [-2, 33], [-10, 23], [-15, 27], [-17, 12], [-25, 13], [-22, 2]]);
  polygon(context, "#10283b", [[5, -22], [18, -14], [21, -2], [24, 3], [18, 10], [18, 18], [10, 15], [6, 28], [1, 22], [-3, 31], [-7, 19], [-3, 7], [-8, -2], [-3, -13]]);
  furTufts(context, flash ? "#a8c0be" : "#315165", [[-24, -26, .8], [-17, -19, .8], [-11, -15, .8], [-20, -5, 1], [-12, 5, 1.1], [-6, 17, 1], [6, -18, .9], [14, -11, .8], [18, 3, .9]]);
  furTufts(context, "#091b2d", [[-10, -23, .8], [0, -16, 1], [8, -6, .9], [0, 6, 1.1], [9, 15, .9], [-18, 11, .7]]);
}

function drawMonsterProfileHead(context, flash, flank, windup, time) {
  context.save();
  context.scale(flank < 0 ? -1 : 1, 1);
  polygon(context, "#020b17", [[-16, -28], [-24, -51], [-12, -43], [-6, -31], [4, -40], [10, -44], [12, -29], [25, -22], [24, -7], [32, 3], [26, 10], [29, 20], [19, 19], [17, 34], [5, 38], [-8, 32], [-16, 24], [-35, 23], [-44, 18], [-46, 8], [-34, 1], [-25, -10], [-25, -20]]);
  polygon(context, flash ? "#638692" : "#274b5f", [[-20, -42], [-12, -34], [-9, -22], [0, -29], [8, -35], [8, -23], [17, -17], [17, -6], [23, 4], [15, 10], [7, 22], [-3, 19], [-9, 10], [-24, 10], [-37, 12], [-39, 7], [-28, 3], [-18, -10], [-20, -20]]);
  polygon(context, "#112a3e", [[7, -22], [19, -17], [17, -3], [25, 4], [18, 9], [21, 16], [12, 15], [9, 30], [3, 32], [-6, 24], [-2, 17], [5, 8], [0, -3]]);
  polygon(context, "#06101e", [[-42, 12], [-27, 14], [-10, 11], [-10, 23], [-22, 26], [-34, 21], [-43, 18]]);
  polygon(context, "#593243", [[-30, 18], [-12, 16], [-14, 22], [-24, 23]]);
  polygon(context, "#d9d5b7", [[-31, 14], [-26, 14], [-28, 21]]);
  polygon(context, "#d9d5b7", [[-16, 13], [-12, 12], [-13, 22], [-16, 19]]);
  pixels(context, "#030a15", [[-44, 6, 8, 5]]);
  furTufts(context, "#35586c", [[-11, -22, .7], [-17, -12, .75], [7, -16, .85], [10, 1, .8], [9, 13, .8], [-2, 22, .7]]);
  context.save();
  context.globalAlpha *= .4 + Math.sin(time * 3) * .07;
  pixels(context, "#da292e", [[-23, -9, 20, 12]]);
  context.restore();
  polygon(context, "#681d31", [[-22, -6], [-10, -10], [-3, -5], [-8, 2], [-20, 1]]);
  polygon(context, windup ? "#ff6e47" : "#f33e35", [[-19, -5], [-11, -7], [-6, -4], [-10, -1], [-19, -1]]);
  pixels(context, "#fff0b2", [[-15, -5, 3, 4]]);
  context.restore();
}

export function drawMonster(context, state, time, reducedMotion, deathElapsed, opacity = 1, stride = 0, pose = null) {
  const roar = Math.max(0, Math.min(1, state.roarAmount || 0));
  const windup = state.turn === "enemy" && state.phase === "windup";
  const heavyIntent = state.enemyIntent?.kind === "heavy";
  const phaseProgress = Math.max(0, Math.min(1, (state.phaseTime || 0) / (state.phaseDuration || 1)));
  const flash = state.enemyHurtTimer > 0;
  const guardAmount = pose ? Math.max(pose.enemyBlock || 0, state.enemyBlock ? 1 : 0) : 0;
  const guarding = guardAmount > .001;
  const rawFlank = pose ? Math.sin(pose.flankAngle || 0) : 0;
  const flank = Math.abs(rawFlank) < 1e-6 ? 0 : rawFlank;
  const rear = Boolean(pose && Math.cos(pose.flankAngle || 0) < -.35);
  const profile = !rear && Math.abs(flank) > .76;
  const breathing = Math.sin(time * 2.1) * 1.3;
  const attackPose = getEnemyAttackPose(state, time);
  const lunge = attackPose.lunge;
  const sideAttack = state.turn === 'enemy' && state.enemyTarget === 'eira' && pose?.eira;
  const won = state.status === "won";
  const dissolve = won ? Math.min(1, deathElapsed / 1.2) : 0;
  context.save();
  context.translate(180 + (flash && !reducedMotion ? Math.sin(time * 83) * 2 : 0) - (sideAttack ? lunge * 19 : 0), 308 + Math.round(breathing + (sideAttack ? 0 : lunge * 23)));
  const size = 1 + (sideAttack ? 0 : lunge * .18);
  context.scale(size, size);
  if (flank) {
    context.transform(1 - Math.abs(flank) * .16, 0, -flank * .08, 1, flank * 7, 0);
  }
  const bodyAlpha = opacity * (won ? 1 - dissolve : 1);
  context.globalAlpha = bodyAlpha;
  if (!pose?.hideGroundShadow) polygon(context, "#0a243b", [[-68, 93], [-43, 86], [40, 84], [73, 92], [91, 98], [71, 102], [-48, 105], [-84, 101]]);
  context.save();
  if (pose?.enemyLean || pose?.enemyHop) {
    context.translate(0, 98);
    context.rotate(pose.enemyLean || 0);
    context.translate(0, -98 - (pose.enemyHop || 0));
  }
  const lift = attackPose.arm;
  const easedPhase = phaseProgress * phaseProgress * (3 - 2 * phaseProgress);
  const sideLift = state.phase === 'strike' ? -2.07 + 1.42 * easedPhase
    : state.phase === 'recover' && state.strikeResolved ? -.65 + (Math.sin(time * 1.5) * .035 + .65) * easedPhase : lift;
  if (guardAmount < .999) {
    context.save();
    context.globalAlpha *= 1 - guardAmount;
    context.save();
    context.translate(0, -stride * 5);
    drawArm(context, -1, sideAttack ? sideLift : -0.08 + breathing * 0.018 + stride * 0.22, flash);
    context.restore();
    context.save();
    context.translate(0, stride * 5);
    drawArm(context, 1, (sideAttack ? Math.sin(time * 1.5) * .035 : lift) - stride * 0.22, flash);
    context.restore();
    context.restore();
  }
  if (guarding && rear) drawMonsterGuard(context, state.enemyBlockTimer > 0, flank, guardAmount);

  // Bent, heavy legs; broad feet plant the creature in the lit path.
  drawMonsterLeg(context, -1, stride);
  drawMonsterLeg(context, 1, -stride);

  polygon(context, "#030c18", [[-15, -91], [-31, -94], [-35, -86], [-48, -88], [-44, -76], [-59, -77], [-51, -61], [-57, -57], [-46, -43], [-43, -24], [-38, -9], [-41, 6], [-31, 4], [-34, 22], [-22, 16], [-19, 33], [-5, 28], [3, 35], [11, 26], [23, 30], [24, 16], [35, 19], [31, 5], [39, 8], [36, -9], [43, -26], [46, -48], [54, -61], [48, -67], [53, -77], [40, -78], [41, -88], [26, -85], [20, -94], [7, -88]]);
  polygon(context, flash ? "#527887" : "#143047", [[-17, -85], [-31, -86], [-30, -77], [-44, -80], [-40, -66], [-48, -68], [-39, -54], [-37, -35], [-29, -19], [-22, -23], [-19, -7], [-12, -20], [-6, -14], [-1, -34], [-3, -63]]);
  polygon(context, "#294b5f", [[-23, -85], [-30, -82], [-26, -74], [-37, -76], [-33, -63], [-38, -63], [-31, -50], [-29, -61], [-23, -53], [-26, -69], [-19, -66]]);
  polygon(context, flash ? "#365e72" : "#0d2034", [[12, -82], [29, -82], [29, -76], [40, -74], [35, -63], [42, -63], [35, -51], [33, -34], [24, -23], [14, -31], [6, -16], [5, -39]]);
  polygon(context, "#152c40", [[-26, -10], [-15, -15], [-12, -6], [-4, -12], [0, -3], [11, -11], [13, -1], [25, -8], [23, 10], [16, 9], [17, 20], [8, 16], [3, 25], [-4, 17], [-12, 22], [-14, 12], [-23, 15]]);
  pixels(context, "#244257", [[-26, -37, 3, 7], [-20, -29, 2, 5], [-33, -48, 2, 5], [-13, 4, 3, 4], [17, -56, 2, 6], [25, -48, 2, 5]]);
  furTufts(context, "#1c3a50", [[-37, -68, 0.85], [-30, -72, 1], [-34, -55, 0.8], [-26, -51, 1.1], [-18, -47, 0.8], [-23, -37, 1.1], [-15, -30, 0.8], [-19, -17, 0.8], [-8, -25, 0.7], [14, -65, 0.7], [25, -57, 0.8], [20, -40, 0.9], [11, -34, 0.6], [-22, 0, 0.7], [-8, 8, 0.8], [10, 6, 0.8]]);
  furTufts(context, "#0a192b", [[-22, -67, 0.8], [-15, -59, 1.1], [-29, -44, 0.8], [-16, -37, 1], [-13, -17, 0.7], [17, -55, 0.9], [25, -34, 0.7], [8, -28, 0.7], [-18, 8, 0.8], [-3, 4, 0.9], [16, 11, 0.7]]);
  pixels(context, "#335366", [[-33, -76, 3, 2], [-29, -69, 2, 3], [-39, -66, 2, 2], [-28, -56, 2, 4], [-20, -43, 2, 3], [-21, -35, 1, 4], [27, -63, 1, 4], [21, -47, 1, 3], [-12, 11, 1, 3]]);
  if (rear) {
    polygon(context, flash ? "#4c6c7e" : "#10283c", [[-29, -74], [-5, -83], [18, -79], [35, -65], [31, -42], [25, -22], [17, -6], [19, 12], [9, 9], [2, 24], [-7, 16], [-16, 18], [-18, 4], [-28, 8], [-26, -13], [-36, -30], [-35, -50]]);
    furTufts(context, "#28485c", [[-22, -68, 1.2], [-9, -71, 1.1], [4, -65, 1.3], [16, -61, 1], [-27, -51, 1.1], [-14, -45, 1.3], [-1, -43, 1.1], [15, -43, 1.2], [-21, -28, 1.1], [-7, -23, 1.2], [10, -22, 1.1], [-15, -7, 1], [1, -3, 1.1]]);
    furTufts(context, "#07192b", [[-3, -66, 1], [2, -51, 1.1], [-6, -36, 1.1], [0, -21, 1.2], [-4, -8, 1.1], [3, 8, .9]]);
  }

  // A pointed wolf head, deep eyes, ragged cheeks and a short toothy muzzle.
  const headTilt = attackPose.headTilt;
  context.save();
  context.translate(-flank * 13, -66 + attackPose.headLift - roar * 5);
  context.rotate(headTilt);
  if (rear) drawMonsterRearHead(context, flash);
  else if (profile) drawMonsterProfileHead(context, flash, flank, windup, time);
  else {
  polygon(context, "#020b17", [[-28, -12], [-31, -49], [-20, -40], [-15, -28], [-8, -37], [-3, -46], [3, -35], [10, -42], [14, -30], [22, -39], [31, -47], [29, -10], [37, -5], [31, 3], [35, 10], [25, 11], [27, 22], [18, 19], [14, 34], [5, 40], [-9, 36], [-16, 25], [-26, 24], [-23, 14], [-32, 16], [-28, 5], [-36, 1]]);
  polygon(context, flash ? "#6a8d95" : "#24465a", [[-28, -42], [-22, -37], [-18, -24], [-9, -30], [-3, -39], [-1, -29], [5, -24], [-3, -17], [-16, -15], [-22, -4], [-28, -2], [-25, -17]]);
  polygon(context, "#132e44", [[8, -28], [12, -23], [22, -31], [28, -39], [25, -16], [26, -3], [20, 5], [11, -5], [3, -8]]);
  furTufts(context, "#315166", [[-25, -29, 0.7], [-18, -23, 0.7], [-11, -27, 0.65], [-7, -20, 0.75], [-27, -14, 0.65], [17, -23, 0.65]]);
  furTufts(context, "#0a1c30", [[-20, -32, 0.6], [-14, -18, 0.7], [-7, -28, 0.6], [13, -20, 0.7], [20, -15, 0.65]]);
  polygon(context, "#163044", [[-22, 6], [-15, 7], [-6, 1], [7, 2], [16, 7], [22, 6], [18, 20], [11, 26], [6, 33], [-5, 32], [-11, 24], [-18, 18]]);
  context.save();
  context.translate(0, 12);
  context.scale(1 + roar * .08, 1 + roar * .52);
  context.translate(0, -12);
  polygon(context, "#070e1b", [[-17, 13], [-8, 12], [-3, 16], [5, 16], [11, 12], [18, 13], [11, 29], [3, 32], [-6, 27]]);
  polygon(context, "#493145", [[-12, 16], [-3, 20], [9, 18], [8, 27], [0, 29], [-7, 24]]);
  pixels(context, "#c4c5af", [[-12, 14, 3, 5], [-8, 16, 2, 2], [10, 14, 3, 6], [6, 17, 2, 2], [-4, 25, 2, 3], [5, 24, 2, 3]]);
  polygon(context, "#c4c5af", [[-13, 14], [-9, 15], [-10, 23], [-12, 21]]);
  polygon(context, "#e1ddba", [[10, 14], [14, 13], [12, 23], [10, 20]]);
  pixels(context, "#375368", [[-20, 10, 2, 5], [-17, 18, 2, 3], [-11, 27, 2, 3], [15, 24, 1, 3]]);
  context.restore();
  polygon(context, "#284256", [[-9, 6], [-3, 2], [4, 2], [11, 7], [7, 10], [-5, 10]]);
  pixels(context, "#010917", [[-5, 6, 11, 4], [-2, 10, 5, 2]]);
  if (state.enemyEyesClosed) {
    polygon(context, "#0b1b2a", [[-25, -7], [-19, -10], [-7, -5], [-7, 2], [-19, 3], [-24, 0]]);
    polygon(context, "#0b1b2a", [[7, -5], [19, -10], [25, -7], [24, 0], [18, 3], [7, 2]]);
    pixels(context, "#294557", [[-21, -2, 12, 2], [10, -2, 12, 2]]);
  } else {
  const glow = windup ? 0.7 + Math.sin(time * 15) * 0.2 : (heavyIntent ? 0.58 : 0.43) + Math.sin(time * 3) * 0.07;
  context.globalAlpha *= glow;
  pixels(context, "#dc272d", [[-26, -9, 23, 13], [5, -9, 23, 13]]);
  context.globalAlpha = bodyAlpha;
  polygon(context, "#621c30", [[-25, -7], [-19, -10], [-7, -5], [-7, 2], [-19, 3], [-24, 0]]);
  polygon(context, "#621c30", [[7, -5], [19, -10], [25, -7], [24, 0], [18, 3], [7, 2]]);
  polygon(context, windup ? "#ff6e47" : "#f33e35", [[-22, -6], [-17, -6], [-9, -3], [-10, 0], [-18, 0], [-21, -2]]);
  polygon(context, windup ? "#ff6e47" : "#f33e35", [[10, -3], [18, -6], [22, -6], [21, -2], [18, 0], [10, 0]]);
  pixels(context, "#fff0b2", [[-18, -5, 3, 4], [16, -5, 3, 4]]);
  }
  }
  context.restore();
  if (guarding && !rear) drawMonsterGuard(context, state.enemyBlockTimer > 0, flank, guardAmount);
  if (windup) {
    context.globalAlpha = 0.25 + phaseProgress * 0.5;
    pixels(context, "#f15d42", [[63, -88 - phaseProgress * 31, 2, 9], [72, -71 - phaseProgress * 32, 2, 6], [58, -63 - phaseProgress * 29, 2, 4]]);
  }
  context.restore();
  context.restore();
  if (won) {
    for (let index = 0; index < 42; index += 1) {
      const cycle = (time * 0.18 + index * 0.079) % 1;
      const x = 122 + ((index * 31) % 115) + Math.sin(time + index) * 8;
      const y = 388 - cycle * 207;
      context.globalAlpha = Math.sin(cycle * Math.PI) * 0.7;
      pixels(context, index % 3 === 0 ? "#a4d4ca" : "#3d8192", [[x, y, index % 3 === 0 ? 2 : 3, 3]]);
    }
    context.globalAlpha = 1;
  }
}

function drawShield(context, raised, time, parry, palette) {
  context.save();
  context.translate(Math.round(15 + raised * 56), Math.round(493 - raised * 71 + Math.sin(time * 1.8) * 1.4));
  context.rotate(-0.1 + raised * 0.12);
  const outer = [[-55, -70], [-15, -87], [30, -87], [71, -68], [92, -32], [96, 19], [75, 71], [29, 107], [-17, 94], [-56, 54], [-74, 7], [-70, -39]];
  polygon(context, "#040d1b", outer);
  polygon(context, "#34425b", [[-52, -65], [-13, -81], [29, -81], [66, -64], [86, -30], [90, 17], [69, 68], [28, 100], [-13, 88], [-50, 51], [-68, 7], [-64, -37]]);
  polygon(context, "#a8b7c2", [[-52, -65], [-13, -81], [29, -81], [66, -64], [86, -30], [80, -24], [60, -57], [27, -71], [-13, -70], [-44, -56], [-58, -32], [-60, 5], [-49, 44], [-56, 48], [-68, 7], [-64, -37]]);
  polygon(context, "#637c91", [[80, -24], [86, -30], [90, 17], [69, 68], [28, 100], [26, 88], [60, 61], [78, 16]]);
  polygon(context, "#182a40", [[-44, -55], [-12, -69], [26, -69], [60, -55], [78, -23], [78, 15], [60, 60], [25, 86], [-10, 76], [-42, 43], [-57, 3], [-55, -29]]);
  polygon(context, "#775033", [[-42, -52], [-12, -65], [25, -65], [57, -52], [74, -22], [75, 13], [57, 56], [24, 82], [-8, 73], [-39, 41], [-53, 2], [-52, -28]]);
  polygon(context, "#a37848", [[-40, -51], [-14, -62], [-19, 65], [-36, 39], [-49, 1], [-49, -27]]);
  polygon(context, "#b18751", [[-10, -63], [10, -63], [4, 74], [-13, 67]]);
  polygon(context, "#90643d", [[14, -63], [26, -62], [34, -59], [29, 72], [23, 78], [9, 75]]);
  polygon(context, "#68442e", [[39, -57], [54, -49], [69, -24], [69, 13], [53, 53], [35, 68]]);
  polygon(context, "#4a322b", [[-16, -63], [-12, -64], [-17, 67], [-20, 65]]);
  polygon(context, "#49332b", [[11, -64], [15, -63], [10, 76], [5, 74]]);
  polygon(context, "#402e29", [[34, -58], [39, -56], [35, 68], [29, 73]]);
  pixels(context, "#c69a5d", [[-35, -40, 2, 31], [-31, -33, 1, 17], [-6, -53, 2, 35], [20, -46, 2, 26], [-27, 26, 2, 19], [-5, 43, 2, 19], [18, 47, 2, 20], [46, -29, 2, 19]]);
  pixels(context, "#63402d", [[-40, -9, 2, 17], [-4, -38, 1, 21], [23, 24, 2, 11], [45, 22, 2, 18]]);
  polygon(context, "#3f302c", [[-44, 25], [-17, 3], [-9, -9], [-14, 2], [-39, 28]]);
  polygon(context, "#c39962", [[-43, 27], [-18, 6], [-13, 0], [-15, 6], [-39, 29]]);
  polygon(context, "#443029", [[25, 40], [48, 21], [57, 10], [53, 20], [29, 43]]);
  pixels(context, "#ba935d", [[28, 43, 4, 1], [35, 37, 3, 1], [42, 31, 3, 1], [48, 25, 2, 1]]);
  // A narrow painted stripe carries the hero's chosen cloth color onto the shield.
  polygon(context, palette.cloth.shadow, [[20, -64], [33, -59], [27, 76], [15, 77]]);
  polygon(context, palette.cloth.base, [[22, -62], [29, -59], [23, 76], [17, 77]]);
  pixels(context, palette.cloth.light, [[23, -53, 2, 17], [19, 47, 2, 14]]);
  polygon(context, "#263950", [[-13, -23], [8, -29], [29, -18], [36, 3], [24, 23], [2, 28], [-16, 15], [-23, -6]]);
  polygon(context, "#9caeba", [[-10, -20], [7, -25], [25, -16], [30, 2], [20, 19], [3, 23], [-12, 12], [-18, -5]]);
  polygon(context, "#607991", [[8, -23], [25, -16], [30, 2], [20, 19], [3, 23], [4, 6]]);
  polygon(context, "#c6d5d6", [[-8, -16], [6, -22], [5, -7], [-11, 6], [-15, -4]]);
  polygon(context, "#465d76", [[-11, 8], [5, -6], [18, 0], [19, 13], [3, 19]]);
  [[-13, -75], [30, -74], [69, -48], [84, -5], [73, 40], [49, 77], [-29, 70], [-59, 27], [-60, -36]].forEach(([x, y]) => {
    pixels(context, "#23354c", [[x - 2, y - 2, 5, 5]]);
    pixels(context, "#d0dbd5", [[x - 2, y - 2, 3, 2], [x - 2, y, 2, 1]]);
  });
  if (parry > 0) {
    context.globalAlpha = Math.min(0.75, parry * 2);
    polygon(context, "#9ae9e7", [[-52, -65], [-13, -81], [29, -81], [66, -64], [86, -30], [80, -24], [60, -57], [27, -71], [-13, -70], [-44, -56]]);
  }
  context.restore();
}

function drawSword(context, state, time, appearance, palette, blockAmount = state.block ? 1 : 0) {
  const duration = state.attackDuration || 0.48;
  const attack = state.attackTimer > 0 ? 1 - state.attackTimer / duration : -1;
  const swing = attack >= 0 ? Math.sin(attack * Math.PI) : 0;
  const power = state.lastAction === "power" && attack >= 0;
  const recoil = state.hurtTimer > 0 ? Math.sin(state.hurtTimer * 18) * 0.06 : 0;
  context.save();
  context.translate(Math.round(286 - swing * 51 + Math.sin(time * 1.5) * 1.5), Math.round(508 + swing * 7 + blockAmount * 15 + Math.sin(time * 2) * 2));
  context.rotate(-0.055 - swing * (power ? 1.7 : 1.42) + recoil + blockAmount * 0.16);
  // Blade bevels are intentionally broad enough to read on a phone.
  polygon(context, "#030b18", [[-10, -53], [-22, -78], [-21, -236], [-15, -269], [-4, -300], [7, -272], [14, -239], [19, -79], [9, -55]]);
  polygon(context, "#7a91ad", [[-8, -61], [-17, -80], [-17, -235], [-11, -268], [-4, -290], [3, -268], [10, -237], [14, -81], [7, -63]]);
  polygon(context, "#d8e6e7", [[-11, -80], [-12, -234], [-8, -264], [-4, -287], [-2, -255], [1, -91], [-4, -72]]);
  polygon(context, "#f2f2d9", [[-12, -232], [-8, -264], [-4, -287], [-4, -250], [-6, -89], [-10, -80]]);
  polygon(context, "#adc8d7", [[-2, -254], [-4, -287], [3, -264], [8, -234], [11, -82], [6, -71], [1, -91]]);
  polygon(context, "#647b9b", [[-5, -237], [-2, -250], [2, -93], [-3, -79]]);
  pixels(context, "#e3edf0", [[3, -188, 2, 26], [4, -160, 2, 18], [-11, -208, 1, 24]]);
  // Small stamped runes, not UI, make the sword feel like an actual object.
  pixels(context, power ? "#ffde95" : "#486882", [[-3, -122, 2, 12], [-6, -118, 8, 2], [-5, -108, 6, 2], [-3, -103, 2, 5]]);
  polygon(context, "#030b18", [[-34, -81], [-17, -82], [-7, -68], [7, -68], [21, -83], [33, -82], [36, -63], [19, -55], [9, -39], [-9, -39], [-23, -56], [-35, -63]]);
  polygon(context, "#52637f", [[-30, -78], [-20, -78], [-12, -64], [-3, -59], [-6, -47], [-20, -59], [-30, -65]]);
  polygon(context, "#abc0ce", [[-30, -78], [-20, -78], [-12, -64], [-3, -59], [-5, -54], [-17, -61], [-24, -72], [-30, -71]]);
  polygon(context, "#7188a1", [[20, -79], [29, -78], [31, -65], [17, -58], [7, -46], [3, -57], [12, -65]]);
  polygon(context, "#bbced6", [[21, -79], [29, -78], [29, -73], [22, -72], [14, -62], [7, -58], [12, -65]]);
  polygon(context, "#2f344b", [[-10, -48], [9, -48], [12, 5], [3, 16], [-8, 8]]);
  polygon(context, "#6f4733", [[-6, -45], [5, -45], [8, 5], [1, 11], [-5, 5]]);
  pixels(context, "#ac7950", [[-6, -40, 11, 3], [-5, -29, 11, 3], [-4, -18, 11, 3], [-3, -7, 10, 3]]);
  const gauntlet = appearance.outfit === "knight";
  const glove = gauntlet ? palette.metal : palette.leather;
  polygon(context, "#080e1b", [[-16, -34], [-4, -40], [10, -34], [18, -21], [26, -13], [36, 12], [71, 29], [91, 60], [108, 104], [45, 132], [21, 78], [6, 41], [-14, 25], [-22, 4], [-21, -20]]);
  polygon(context, glove.shadow, [[-14, -30], [-4, -34], [6, -29], [14, -16], [21, -10], [30, 14], [15, 31], [-10, 21], [-17, 3], [-16, -19]]);
  polygon(context, glove.base, [[-14, -30], [-4, -34], [6, -29], [11, -19], [3, -17], [-6, -23], [-7, -9], [-15, -13]]);
  polygon(context, glove.light, [[-14, -29], [-5, -31], [4, -26], [6, -21], [-3, -23], [-7, -19], [-14, -21]]);
  polygon(context, glove.base, [[-15, -8], [-5, -5], [3, -7], [12, -3], [14, 7], [3, 10], [-11, 3]]);
  polygon(context, glove.light, [[-12, -7], [-4, -4], [3, -6], [10, -3], [9, 1], [-1, 1], [-10, -2]]);
  polygon(context, glove.shadow, [[-7, 10], [3, 14], [14, 10], [21, 13], [24, 20], [14, 29], [-6, 19]]);
  polygon(context, glove.base, [[17, -13], [22, -8], [31, 15], [22, 24], [16, 12], [11, 5], [13, -5]]);
  polygon(context, glove.light, [[17, -9], [20, -6], [26, 11], [22, 14], [17, 3]]);
  // The same appearance as the full-body portrait: cloth cuffs, leather bracers,
  // or a plated gauntlet, with the chosen skin visible between cuff and sleeve.
  const cuff = gauntlet ? palette.metal : appearance.outfit === "leather" ? palette.leather : palette.cloth;
  polygon(context, "#192335", [[16, 30], [32, 15], [70, 31], [80, 48], [55, 71], [28, 66]]);
  polygon(context, cuff.base, [[20, 31], [33, 20], [65, 35], [71, 47], [51, 61], [31, 59]]);
  polygon(context, cuff.light, [[23, 31], [33, 22], [63, 36], [66, 41], [34, 29], [26, 37]]);
  polygon(context, cuff.shadow, [[49, 36], [57, 38], [63, 50], [55, 58], [48, 54]]);
  if (appearance.outfit !== "ranger") {
    pixels(context, palette.metal.light, [[33, 35, 3, 3], [59, 42, 3, 3], [42, 52, 3, 3]]);
  } else {
    polygon(context, palette.cloth.light, [[31, 54], [50, 56], [67, 44], [70, 48], [52, 62], [32, 60]]);
    pixels(context, palette.cloth.shadow, [[37, 34, 2, 7], [43, 39, 2, 8]]);
  }
  const forearm = gauntlet ? palette.metal : palette.skin;
  polygon(context, forearm.shadow, [[55, 70], [80, 48], [88, 65], [108, 111], [57, 132], [39, 88]]);
  polygon(context, forearm.base, [[61, 72], [79, 55], [84, 67], [101, 108], [69, 121], [52, 86]]);
  polygon(context, forearm.light, [[65, 74], [77, 63], [95, 107], [85, 111]]);
  if (gauntlet) {
    // Overlapping plates remain readable while the arm follows its existing swing.
    polygon(context, palette.metal.shadow, [[49, 78], [82, 58], [85, 65], [52, 86]]);
    polygon(context, palette.metal.light, [[52, 81], [82, 62], [83, 65], [54, 84]]);
    polygon(context, palette.metal.shadow, [[58, 101], [93, 81], [96, 88], [61, 108]]);
    polygon(context, palette.metal.light, [[62, 102], [93, 84], [94, 88], [63, 106]]);
    pixels(context, palette.metal.light, [[-11, -17, 3, 3], [-3, -14, 3, 3], [6, -10, 3, 3]]);
  }
  // A sleeve enters the lower frame; its color survives even beneath steel armor.
  polygon(context, palette.cloth.shadow, [[60, 104], [96, 87], [113, 116], [63, 137], [53, 113]]);
  polygon(context, palette.cloth.base, [[67, 107], [96, 91], [106, 113], [70, 128]]);
  polygon(context, palette.cloth.light, [[69, 108], [77, 104], [87, 120], [80, 124]]);
  context.restore();
}

function drawSlash(context, state, pose = null, centerOffset = 0) {
  if (!(state.attackTimer > 0)) return;
  const progress = 1 - state.attackTimer / (state.attackDuration || 0.48);
  if (progress < 0.16 || progress > 0.77) return;
  context.save();
  // A missed swing cuts through the space the defender has just left.
  context.translate(centerOffset - (pose?.enemyDodge || 0) * (pose?.enemyDodgeSide || 1) * 142, 0);
  context.globalAlpha = Math.sin(((progress - 0.16) / 0.61) * Math.PI) * 0.8;
  const power = state.lastAction === "power";
  polygon(context, power ? "#e6b66e" : "#87c9df", [[57, 209], [91, 230], [149, 271], [216, 331], [268, 390], [220, 346], [147, 286], [86, 239]]);
  polygon(context, power ? "#fff0ba" : "#eef7de", [[84, 228], [148, 272], [211, 326], [254, 372], [211, 334], [145, 282]]);
  context.restore();
}

function drawRest(context, state) {
  if (!(state.restTimer > 0)) return;
  const progress = Math.max(0, Math.min(1, 1 - state.restTimer / 0.65));
  context.save();
  context.globalAlpha = Math.sin(progress * Math.PI) * 0.85;
  for (let index = 0; index < 12; index += 1) {
    const x = 41 + index * 25 + Math.sin(index * 1.7 + progress * 2) * 6;
    const y = 511 - (index % 4) * 18 - progress * 64;
    pixels(context, index % 3 ? "#83d7d4" : "#e9dba1", [[x, y, 2, 4], [x - 1, y + 1, 4, 1]]);
  }
  context.restore();
}

function drawSparks(context, state, projection = null, time = 0, reducedMotion = false) {
  const impact = Math.max(state.enemyHurtTimer || 0, state.parryTimer || 0, state.enemyBlockTimer || 0, state.eiraHurtTimer || 0, state.eiraBlockTimer || 0);
  if (!impact) return;
  const parry = state.parryTimer > 0;
  const blocked = state.enemyBlockTimer > 0;
  const eiraHit = Boolean(projection?.eira && (state.eiraHurtTimer > 0 || state.eiraBlockTimer > 0));
  const eiraSword = state.turn === 'eira' && (state.enemyHurtTimer > 0 || state.enemyBlockTimer > 0) ? getEiraSwordContact(state, time, reducedMotion, projection) : null;
  const progress = Math.max(0, 1 - impact / (parry ? 0.5 : blocked ? .4 : 0.25));
  const centerX = eiraSword ? eiraSword.x : eiraHit ? projection.eira.x + 25 * projection.eira.scale : parry ? 111 : projection ? projection.monsterX : 180;
  const centerY = eiraSword ? eiraSword.y : eiraHit ? projection.eira.y - 139 * projection.eira.scale : parry ? 327 : projection ? projection.monsterFoot - (blocked ? 133 : 120) * projection.monsterScale : 286;
  context.save();
  context.globalAlpha = Math.max(0, 1 - progress);
  for (let index = 0; index < 13; index += 1) {
    const angle = index * 2.399;
    const distance = 9 + progress * (28 + (index % 4) * 11);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance + progress * progress * 13;
    pixels(context, parry ? "#c9ffff" : index % 3 ? "#edc795" : "#fff6d2", [[x, y, 2 + (index % 2), index % 3 === 0 ? 6 : 2]]);
  }
  if (progress < 0.3) {
    polygon(context, "#fff5d3", [[centerX - 19, centerY], [centerX - 3, centerY - 3], [centerX, centerY - 23], [centerX + 3, centerY - 3], [centerX + 19, centerY], [centerX + 3, centerY + 3], [centerX, centerY + 21], [centerX - 3, centerY + 3]]);
  }
  context.restore();
}

export function createRenderer(canvas) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Prohlížeč nepodporuje vykreslení hry.");
  context.imageSmoothingEnabled = false;
  let background = createBackground(canvas.ownerDocument);
  const arenaBackdrop = createArenaBackdrop(canvas.ownerDocument, background);
  let lastTime = 0;
  let animationTime = 0;
  let lifeClock = 0;
  let wasBattle = false;
  let eiraRenderer = null;
  const eiraStaging = createEiraStaging();
  let eiraDownAt = null;
  let shieldRaised = 0;
  let victoryStartedAt = null;
  let appearanceInput;
  let appearance = normalizeAppearance();
  let palette = getAppearancePalette(appearance);

  const unit = (value, fallback = 1) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;

  function paint(state, time, reducedMotion, shot = null, frame = null) {
      if (!background) return;
      const isBattle = Boolean(shot) || state.scene === "battle" || state.scene === undefined;
      if (state.appearance !== appearanceInput) {
        appearanceInput = state.appearance;
        appearance = normalizeAppearance(appearanceInput);
        palette = getAppearancePalette(appearance);
      }
      if (isBattle && state.status === "won") victoryStartedAt ??= time;
      else victoryStartedAt = null;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalAlpha = 1;
      context.imageSmoothingEnabled = false;
      const arenaView = !shot && isBattle ? getLivingArenaView(getArenaView(state), state, frame?.lifeTime ?? lifeClock, reducedMotion, frame?.eiraStage ?? eiraStaging.update(state, time)) : null;
      const projection = arenaView ? getBattleProjection(arenaView, reducedMotion) : null;
      if (arenaView?.eira && state.eira) {
        eiraRenderer ??= createEiraBattleRenderer(canvas.ownerDocument);
        if (state.eira.health <= 0) eiraDownAt ??= time - (lifeClock === 0 ? .75 : 0);
        else eiraDownAt = null;
      }
      const downProgress = eiraDownAt === null ? 0 : unit((time - eiraDownAt) / .75);
      const drawCompanion = () => eiraRenderer?.draw(context, state, time, reducedMotion, arenaView, projection, downProgress * downProgress * (3 - 2 * downProgress));
      const backdrop = projection ? arenaBackdrop.render(projection) : background.image;
      context.drawImage(backdrop, 0, 0);
      context.save();
      const reactingDodge = state.reaction?.actor === 'player' && state.reaction.kind === 'dodge';
      const dodge = isBattle && !reactingDodge && state.dodgeTimer > 0 ? Math.sin((1 - state.dodgeTimer / (state.dodgeDuration || 0.55)) * Math.PI) : 0;
      const shake = isBattle && !reducedMotion && state.hurtTimer > 0 ? Math.sin(time * 103) * state.hurtTimer * 9 : 0;
      context.translate(Math.round(shake - dodge * (reducedMotion ? 6 : 17)), Math.round(projection?.cameraBob || 0));
      if (shake || dodge || projection?.cameraBob) context.drawImage(backdrop, 0, 0);

      // Sparse drifting motes never compete with the combat silhouette.
      for (let index = 0; index < 19; index += 1) {
        const x = (index * 67 + Math.sin(time * 0.29 + index) * 10 + 360) % 360;
        const y = 247 + ((index * 37 + time * (1 + index % 3)) % 213);
        context.globalAlpha = 0.15 + (Math.sin(time * 1.5 + index * 2) + 1) * 0.2;
        pixels(context, index % 4 ? "#7ebfbf" : "#d8d2a0", [[x, y, index % 5 === 0 ? 2 : 1, 1]]);
      }
      context.globalAlpha = 1;
      if (isBattle) {
        const monsterProgress = unit(shot?.monsterProgress);
        const monsterVisibility = unit(shot?.monsterVisibility);
        const eyesVisibility = unit(shot?.eyesVisibility, 0);
        const weaponProgress = unit(shot?.weaponProgress);
        if (projection?.eira && projection.eira.depth >= projection.monsterDepth) drawCompanion();
        context.save();
        if (projection) {
          context.translate(projection.monsterX, projection.monsterFoot);
          context.scale(projection.monsterScale, projection.monsterScale);
          context.translate(-180, -406);
        }
        if (monsterProgress < 1) {
          // The feet move toward the camera along the path as the creature grows.
          const scale = 0.28 + monsterProgress * 0.72;
          const step = reducedMotion ? 0 : Math.sin(monsterProgress * Math.PI * 10) * (1 - monsterProgress) * 3;
          context.translate(180 + step, 321 + monsterProgress * 85);
          context.scale(scale, scale);
          context.translate(-180, -406);
        }
        if (monsterVisibility > 0) {
          // The walk eases in and out, reaching exactly the canonical idle pose.
          const walking = arenaView?.movingActor === 'enemy' && !reducedMotion;
          const walkEnvelope = walking ? Math.sin(arenaView.moveProgress * Math.PI) : 0;
          const stride = shot && monsterProgress < 1 && !reducedMotion
            ? Math.sin(monsterProgress * Math.PI * 3) * Math.sin(monsterProgress * Math.PI)
            : (walking ? Math.sin(arenaView.moveProgress * Math.PI * 4) * walkEnvelope : 0)
              + (arenaView?.idleStride || 0) * (1 - walkEnvelope * .75)
              + (arenaView?.enemyDodge || 0) * (arenaView?.enemyDodgeSide || 1) * .36;
          drawMonster(context, state, time, reducedMotion, victoryStartedAt === null ? 0 : time - victoryStartedAt, monsterVisibility, stride, arenaView);
        }
        if (eyesVisibility > 0) {
          // A steady pair of eyes is visible before the body leaves the darkness.
          context.globalAlpha = eyesVisibility;
          pixels(context, "#b43032", [[160, 235, 8, 5], [193, 235, 8, 5]]);
          pixels(context, "#ef6947", [[162, 235, 5, 3], [194, 235, 5, 3]]);
          pixels(context, "#ffe2a1", [[164, 235, 2, 2], [195, 235, 2, 2]]);
        }
        context.restore();
        if (projection?.eira && projection.eira.depth < projection.monsterDepth) drawCompanion();
        if (weaponProgress > 0) {
          const idleHands = arenaView?.idleHands || 0;
          const heroDodge = arenaView?.heroDodge || 0;
          const heroSide = arenaView?.heroDodgeSide || 1;
          const heroBlock = shot ? 0 : Math.max(shieldRaised, arenaView?.heroBlock || 0);
          context.save();
          if (reducedMotion && weaponProgress < 1) context.globalAlpha = weaponProgress;
          context.translate(Math.round((projection?.step || 0) * 3), Math.round((1 - weaponProgress) * (reducedMotion ? 18 : 245) + Math.abs(projection?.step || 0) * 5));
          context.translate(Math.round(idleHands + heroDodge * heroSide * 18), Math.round(Math.abs(idleHands) + heroDodge * 24));
          drawShield(context, heroBlock, time, state.parryTimer || 0, palette);
          context.restore();
          if (!shot) drawSlash(context, state, arenaView, arenaView?.groupAmount ? (projection.project(arenaView.enemy.x, arenaView.enemy.z)?.x || 180) - 180 : 0);
          context.save();
          if (reducedMotion && weaponProgress < 1) context.globalAlpha = weaponProgress;
          context.translate(Math.round(-(projection?.step || 0) * 4), Math.round((1 - weaponProgress) * (reducedMotion ? 22 : 425) - (projection?.step || 0) * 5));
          context.translate(Math.round(-idleHands + heroDodge * heroSide * 28), Math.round(Math.abs(idleHands) + heroDodge * 30));
          drawSword(context, state, time, appearance, palette, heroBlock);
          context.restore();
        }
        if (!shot) {
          drawSparks(context, state, projection, time, reducedMotion);
          drawRest(context, state);
        }
      }
      context.restore();

      // A stepped vignette leaves the middle crisp and frames the HUD.
      context.fillStyle = "rgba(2, 7, 17, 0.2)";
      context.fillRect(0, 0, 8, HEIGHT);
      context.fillRect(WIDTH - 8, 0, 8, HEIGHT);
      context.fillStyle = "rgba(2, 7, 17, 0.12)";
      context.fillRect(8, 0, 8, HEIGHT);
      context.fillRect(WIDTH - 16, 0, 8, HEIGHT);
      if (isBattle && state.hurtTimer > 0) {
        const opacity = Math.min(0.34, state.hurtTimer * 0.8);
        context.fillStyle = `rgba(170, 30, 38, ${opacity})`;
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = `rgba(114, 12, 27, ${opacity})`;
        context.fillRect(0, 0, 16, HEIGHT);
        context.fillRect(344, 0, 16, HEIGHT);
      }
      if (isBattle && state.health < 30 && state.status === "playing") {
        context.fillStyle = `rgba(116, 23, 39, ${0.06 + Math.sin(time * 3) * 0.025})`;
        context.fillRect(0, 0, 10, HEIGHT);
        context.fillRect(350, 0, 10, HEIGHT);
      }
      if (isBattle && state.status === "lost") {
        context.fillStyle = "rgba(9, 10, 24, 0.38)";
        context.fillRect(0, 0, WIDTH, HEIGHT);
      }
  }

  return {
    render(state, visualTime = 0, reducedMotion = false) {
      const inputTime = Number.isFinite(visualTime) ? visualTime : 0;
      const delta = state.status === "paused" ? 0 : Math.min(0.08, Math.max(0, inputTime - lastTime));
      lastTime = inputTime;
      animationTime += delta;
      const isBattle = state.scene === "battle" || state.scene === undefined;
      if (isBattle && !wasBattle) { lifeClock = 0; eiraStaging.reset(); }
      else if (isBattle && state.status === 'playing') lifeClock += delta;
      wasBattle = isBattle;
      shieldRaised += ((isBattle && state.block ? 1 : 0) - shieldRaised) * Math.min(1, delta * 19);
      paint(state, animationTime, reducedMotion);
    },
    /** All shot values are 0..1; the complete shot matches an idle battle frame. */
    renderCinematic(state, visualTime = 0, reducedMotion = false, shot = {}) {
      paint(state, Number.isFinite(visualTime) ? visualTime : 0, reducedMotion, shot);
    },
    /** A directed world-space pose, independent of previous frames and game ticks. */
    renderBattleSnapshot(state, visualTime = 0, reducedMotion = false, options = {}) {
      paint(state, Number.isFinite(visualTime) ? visualTime : 0, reducedMotion, null, {
        lifeTime: Number.isFinite(options.lifeTime) ? options.lifeTime : 3.2,
        eiraStage: options.eiraStage ?? getEiraStage(state),
      });
    },
    /** Match an offscreen cinematic's final frame before handing over to combat. */
    syncClock(visualTime = 0) {
      animationTime = Number.isFinite(visualTime) ? visualTime : 0;
      lastTime = animationTime;
      lifeClock = 0;
      wasBattle = false;
      eiraDownAt = null;
      eiraStaging.reset();
      shieldRaised = 0;
      victoryStartedAt = null;
    },
    destroy() {
      arenaBackdrop.destroy();
      eiraRenderer?.destroy();
      background = null;
    },
  };
}
