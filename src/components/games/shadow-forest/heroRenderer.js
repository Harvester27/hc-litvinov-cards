import { getAppearancePalette, normalizeAppearance } from "./appearance.mjs";

export const HERO_WIDTH = 112;
export const HERO_HEIGHT = 168;

const INK = "#111c29";
const GOLD = "#c5a66a";
const GOLD_DARK = "#775d3e";

function box(context, color, x, y, width, height = width) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function shape(context, color, points) {
  context.fillStyle = color;
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index) context.lineTo(x, y);
    else context.moveTo(x, y);
  });
  context.closePath();
  context.fill();
}

function cape(context, appearance, palette, view) {
  if (appearance.cloak === "none") return;
  const { cloak } = palette;
  const long = appearance.cloak === "long";
  const bottom = long ? 150 : 100;
  const side = view === "side";
  const left = side ? 31 : 19;
  const right = side ? 62 : 91;
  shape(context, INK, [
    [39, 36], [69, 36], [69, 40], [78, 40], [78, 48],
    [right - 6, 48], [right - 6, bottom - 30], [right, bottom - 30], [right, bottom - 4],
    [right - 5, bottom - 4], [right - 5, bottom], [right - 19, bottom], [right - 19, bottom - 3],
    [left + 16, bottom - 3], [left + 16, bottom], [left, bottom], [left, bottom - 20],
    [left + 4, bottom - 20], [left + 4, 68], [left + 9, 68], [left + 9, 45], [39, 45],
  ]);
  shape(context, cloak.base, [
    [40, 40], [68, 40], [68, 44], [75, 44], [75, 53], [right - 9, 53],
    [right - 9, bottom - 26], [right - 4, bottom - 26], [right - 4, bottom - 7],
    [right - 17, bottom - 7], [right - 17, bottom - 6], [left + 18, bottom - 6],
    [left + 18, bottom - 4], [left + 4, bottom - 4], [left + 4, bottom - 22],
    [left + 8, bottom - 22], [left + 8, 68], [left + 13, 68], [left + 13, 47], [40, 47],
  ]);
  shape(context, cloak.shadow, [[57, 44], [69, 46], [73, 67], [right - 7, bottom - 7], [right - 18, bottom - 7], [62, 75]]);
  shape(context, cloak.shadow, [[42, 49], [46, 55], [40, bottom - 7], [left + 8, bottom - 7], [34, 80]]);
  shape(context, cloak.light, [[36, 52], [41, 50], [37, 82], [left + 11, bottom - 9], [left + 8, bottom - 9], [32, 79]]);
  box(context, cloak.light, left + 7, bottom - 9, 8, 2);
  box(context, GOLD_DARK, left + 4, bottom - 5, 13, 1);
  box(context, GOLD_DARK, right - 16, bottom - 7, 10, 1);
  if (view === "back") {
    shape(context, cloak.light, [[50, 44], [56, 45], [54, 76], [49, 99], [49, bottom - 9], [46, bottom - 9], [46, 95]]);
    box(context, cloak.shadow, 56, 52, 8, 3);
    // Small stitched pine emblem; it belongs to the cloak, not a UI overlay.
    shape(context, GOLD_DARK, [[57, 62], [60, 68], [57, 68], [64, 75], [59, 75], [67, 83], [48, 83], [55, 75], [51, 75], [57, 68], [54, 68]]);
    box(context, GOLD, 57, 68, 1, 18);
    box(context, GOLD, 52, 81, 4, 1);
    box(context, GOLD, 59, 77, 2, 1);
  }
}

function legs(context, palette, appearance, view) {
  const { cloth, leather, metal } = palette;
  const back = view === "back";
  shape(context, INK, [[36, 94], [76, 94], [76, 127], [79, 127], [79, 150], [84, 150], [84, 164], [60, 164], [60, 134], [56, 118], [51, 135], [51, 163], [25, 163], [25, 154], [32, 150], [32, 126], [36, 126]]);
  shape(context, "#303b3c", [[38, 99], [54, 102], [54, 119], [48, 137], [35, 137], [35, 126], [38, 126]]);
  shape(context, "#414e48", [[39, 105], [46, 105], [46, 122], [42, 133], [36, 133], [36, 127], [39, 127]]);
  shape(context, "#27333b", [[58, 103], [72, 100], [72, 128], [75, 128], [75, 140], [63, 140], [63, 129], [58, 116]]);
  box(context, "#4c5c50", 63, 107, 4, 19);
  box(context, leather.shadow, 33, 132, 17, 25);
  box(context, leather.base, 34, 136, 10, 18);
  box(context, leather.light, 34, 135, 3, 17);
  box(context, leather.shadow, 62, 133, 15, 25);
  box(context, leather.base, 63, 138, 7, 18);
  box(context, leather.light, 64, 139, 2, 13);
  shape(context, leather.base, [[33, 151], [47, 151], [47, 159], [29, 159], [29, 155], [33, 155]]);
  shape(context, leather.shadow, [[63, 152], [76, 152], [76, 155], [80, 155], [80, 160], [63, 160]]);
  box(context, leather.light, 31, 156, 13, 2);
  box(context, leather.base, 66, 156, 12, 2);
  box(context, "#18232b", 28, 160, 21, 3);
  box(context, "#18232b", 61, 161, 22, 3);
  box(context, GOLD_DARK, 35, 140, 12, 2);
  box(context, GOLD, 42, 140, 3, 3);
  box(context, GOLD_DARK, 64, 142, 10, 2);
  box(context, GOLD, 71, 142, 2, 3);
  if (appearance.outfit === "knight") {
    for (const [x, y] of [[35, 126], [63, 129]]) {
      box(context, metal.shadow, x, y, 13, 21);
      box(context, metal.base, x + 2, y + 3, 6, 17);
      box(context, metal.light, x + 2, y + 3, 2, 14);
      box(context, metal.light, x, y, 11, 2);
      box(context, INK, x, y + 8, 12, 2);
      box(context, metal.base, x + 2, y + 10, 7, 2);
    }
  }
  // Cloth remains visible below every armor type so tint is always meaningful.
  shape(context, INK, [[34, 87], [76, 87], [79, 111], [63, 116], [56, 108], [50, 116], [31, 109]]);
  shape(context, cloth.base, [[36, 92], [56, 94], [54, 105], [48, 112], [34, 107]]);
  shape(context, cloth.shadow, [[58, 94], [73, 92], [76, 108], [64, 112], [59, 106]]);
  box(context, cloth.light, 36, 103, 3, 4);
  box(context, GOLD_DARK, 35, 108, 13, 2);
  box(context, GOLD_DARK, 65, 110, 10, 2);
  if (!back && appearance.outfit === "knight") {
    shape(context, cloth.light, [[51, 91], [60, 91], [63, 109], [57, 120], [49, 113]]);
    shape(context, cloth.base, [[55, 95], [60, 95], [60, 109], [56, 116], [53, 111]]);
    box(context, GOLD, 54, 99, 2, 9);
    box(context, GOLD, 51, 103, 8, 2);
  }
}

function arms(context, palette, appearance, view) {
  const { cloth, leather, skin, metal } = palette;
  const rightOffset = view === "back" ? -1 : 0;
  shape(context, INK, [[31, 44], [40, 49], [39, 68], [35, 83], [34, 96], [35, 103], [31, 112], [22, 111], [19, 102], [22, 83], [22, 65], [25, 49]]);
  shape(context, cloth.base, [[28, 48], [35, 50], [35, 66], [31, 83], [25, 82], [25, 65]]);
  box(context, cloth.light, 27, 52, 3, 17);
  shape(context, cloth.shadow, [[32, 60], [36, 59], [35, 71], [31, 83], [28, 80]]);
  box(context, skin.base, 25, 79, 7, 7);
  box(context, skin.light, 25, 80, 2, 5);
  shape(context, leather.shadow, [[23, 85], [33, 85], [31, 101], [22, 101]]);
  box(context, leather.base, 24, 87, 6, 12);
  box(context, leather.light, 24, 87, 2, 8);
  box(context, GOLD_DARK, 23, 88, 9, 2);
  box(context, GOLD_DARK, 23, 97, 8, 2);
  shape(context, skin.shadow, [[23, 102], [30, 102], [31, 106], [29, 109], [23, 109], [22, 106]]);
  box(context, skin.base, 24, 102, 4, 6);
  box(context, skin.light, 23, 103, 2, 4);
  box(context, skin.shadow, 27, 106, 1, 3);

  context.save();
  context.translate(rightOffset, 0);
  shape(context, INK, [[72, 47], [81, 44], [88, 51], [89, 72], [85, 83], [89, 95], [94, 102], [92, 111], [82, 114], [77, 107], [75, 89], [72, 76]]);
  shape(context, cloth.shadow, [[77, 50], [82, 49], [85, 54], [86, 70], [81, 82], [77, 76]]);
  box(context, cloth.base, 77, 52, 4, 20);
  box(context, cloth.light, 78, 54, 2, 10);
  shape(context, skin.shadow, [[78, 80], [82, 79], [85, 88], [79, 91]]);
  box(context, skin.base, 79, 83, 3, 6);
  shape(context, leather.shadow, [[78, 89], [85, 87], [89, 103], [80, 105]]);
  shape(context, leather.base, [[79, 91], [82, 90], [85, 101], [81, 102]]);
  box(context, GOLD_DARK, 79, 91, 6, 2);
  box(context, GOLD_DARK, 81, 100, 7, 2);
  shape(context, skin.shadow, [[82, 105], [89, 103], [91, 106], [89, 110], [83, 111]]);
  box(context, skin.base, 83, 104, 5, 4);
  box(context, skin.light, 83, 104, 2, 3);
  context.restore();

  if (appearance.outfit === "knight") {
    shape(context, INK, [[27, 43], [35, 42], [43, 46], [42, 58], [24, 61], [22, 55], [24, 47]]);
    shape(context, metal.base, [[28, 45], [35, 45], [40, 48], [38, 55], [25, 57], [25, 51]]);
    box(context, metal.light, 28, 46, 7, 3);
    box(context, metal.light, 25, 51, 3, 4);
    box(context, metal.shadow, 27, 56, 10, 3);
    box(context, GOLD, 27, 54, 2, 2);
    shape(context, INK, [[72, 44], [80, 42], [88, 48], [91, 57], [85, 61], [73, 57]]);
    shape(context, metal.shadow, [[75, 46], [81, 45], [85, 50], [87, 56], [83, 57], [76, 54]]);
    box(context, metal.base, 75, 46, 5, 7);
    box(context, metal.light, 76, 46, 4, 2);
    box(context, GOLD, 83, 54, 2, 2);
    box(context, metal.shadow, 24, 88, 9, 10);
    box(context, metal.base, 24, 87, 6, 10);
    box(context, metal.light, 24, 87, 2, 9);
    box(context, metal.base, 79, 92, 5, 8);
    box(context, metal.light, 79, 92, 2, 6);
  }
}

function torso(context, palette, appearance, view) {
  const { cloth, leather, metal, skin } = palette;
  const back = view === "back";
  shape(context, INK, [[41, 38], [67, 38], [67, 41], [76, 41], [80, 53], [76, 71], [74, 87], [76, 99], [34, 99], [36, 84], [33, 57], [32, 44], [41, 44]]);
  shape(context, cloth.base, [[42, 43], [65, 43], [65, 46], [73, 46], [76, 53], [71, 77], [72, 94], [38, 94], [39, 79], [36, 51], [42, 49]]);
  shape(context, cloth.shadow, [[58, 49], [72, 47], [73, 58], [68, 77], [72, 91], [56, 91], [60, 75]]);
  box(context, cloth.light, 39, 54, 3, 17);
  box(context, cloth.light, 43, 64, 3, 13);
  box(context, cloth.shadow, 42, 83, 10, 3);

  if (appearance.outfit === "ranger") {
    // A folded high collar and reinforced shoulders distinguish the cloth outfit.
    shape(context, cloth.shadow, [[39, 41], [49, 40], [55, 51], [64, 40], [72, 42], [67, 54], [57, 60], [45, 54]]);
    shape(context, cloth.light, [[41, 43], [46, 42], [53, 52], [50, 54], [44, 50]]);
    box(context, cloth.light, 62, 44, 6, 3);
    box(context, cloth.base, 47, 55, 15, 3);
    shape(context, leather.shadow, [[35, 45], [40, 43], [46, 48], [44, 56], [34, 57]]);
    box(context, leather.base, 36, 46, 5, 7);
    shape(context, leather.shadow, [[68, 45], [74, 45], [76, 53], [68, 56], [64, 50]]);
    box(context, leather.base, 69, 46, 4, 6);
    // Diagonal scabbard strap: rectangular steps keep the sprite crisp.
    for (let i = 0; i < 9; i += 1) {
      box(context, leather.shadow, 65 - i * 3, 51 + i * 4, 6, 7);
      box(context, leather.base, 65 - i * 3, 51 + i * 4, 3, 5);
    }
    box(context, GOLD_DARK, 52, 66, 7, 6);
    box(context, GOLD, 52, 66, 6, 2);
    box(context, GOLD, 52, 68, 2, 4);
  } else if (appearance.outfit === "leather") {
    shape(context, leather.shadow, [[39, 48], [45, 46], [55, 54], [66, 46], [71, 49], [69, 88], [39, 88]]);
    shape(context, leather.base, [[41, 50], [46, 50], [54, 57], [54, 84], [42, 84]]);
    shape(context, "#8b6542", [[57, 57], [65, 51], [68, 51], [66, 80], [57, 84]]);
    box(context, leather.light, 41, 54, 2, 23);
    box(context, leather.shadow, 52, 56, 6, 30);
    for (let y = 62; y < 83; y += 7) {
      box(context, leather.shadow, 41, y, 27, 2);
      box(context, leather.light, 42, y + 2, 9, 1);
      box(context, GOLD, 45, y - 2, 1, 1);
      box(context, GOLD_DARK, 63, y - 2, 1, 1);
      box(context, GOLD_DARK, 53, y, 5, 2);
    }
    box(context, GOLD, 53, 58, 2, 2);
    box(context, GOLD, 56, 67, 2, 2);
    shape(context, leather.base, [[33, 45], [39, 45], [43, 50], [39, 58], [28, 58], [28, 52]]);
    box(context, leather.light, 32, 47, 5, 2);
    box(context, GOLD_DARK, 31, 56, 8, 2);
    shape(context, leather.shadow, [[72, 45], [79, 46], [85, 53], [84, 60], [74, 57]]);
    box(context, leather.base, 74, 47, 5, 7);
  } else {
    // Faceted plate over a dyed gambeson, with overlapping waist lames.
    shape(context, INK, [[42, 47], [50, 49], [56, 53], [63, 48], [69, 47], [73, 58], [69, 82], [59, 87], [41, 82], [37, 59]]);
    shape(context, metal.base, [[43, 50], [51, 54], [56, 56], [64, 52], [68, 51], [70, 60], [66, 78], [57, 83], [44, 78], [40, 59]]);
    shape(context, metal.light, [[43, 52], [47, 55], [45, 62], [46, 72], [42, 66], [41, 59]]);
    shape(context, metal.shadow, [[57, 58], [68, 54], [69, 61], [65, 76], [58, 81]]);
    box(context, metal.light, 53, 59, 3, 19);
    box(context, metal.light, 46, 76, 9, 2);
    box(context, metal.shadow, 39, 81, 31, 4);
    box(context, metal.base, 40, 82, 24, 2);
    box(context, INK, 39, 86, 31, 2);
    box(context, metal.base, 40, 88, 29, 3);
    box(context, metal.light, 41, 88, 12, 1);
    box(context, GOLD_DARK, 50, 57, 11, 3);
    box(context, GOLD, 54, 56, 3, 6);
  }

  box(context, INK, 36, 91, 38, 8);
  box(context, leather.base, 37, 93, 36, 4);
  box(context, leather.light, 38, 93, 34, 1);
  box(context, GOLD_DARK, 51, 91, 10, 8);
  box(context, GOLD, 52, 92, 8, 5);
  box(context, leather.shadow, 54, 93, 4, 3);
  box(context, GOLD, 55, 94, 5, 1);
  // Belt pouch and a tiny travel vial, details visible in the full-body view.
  box(context, INK, 34, 95, 12, 13);
  box(context, leather.base, 35, 97, 9, 9);
  box(context, leather.light, 36, 97, 7, 2);
  box(context, leather.shadow, 36, 100, 7, 2);
  box(context, GOLD, 39, 100, 2, 3);
  box(context, INK, 67, 96, 6, 11);
  box(context, "#658d8b", 68, 100, 4, 5);
  box(context, "#b4c8ba", 68, 100, 1, 3);
  box(context, GOLD_DARK, 68, 97, 4, 2);
  if (!back) {
    box(context, skin.shadow, 46, 32, 17, 11);
    box(context, skin.base, 48, 32, 12, 10);
    box(context, skin.light, 48, 36, 5, 4);
    shape(context, cloth.shadow, [[44, 40], [47, 39], [54, 45], [62, 39], [66, 41], [62, 48], [54, 52], [48, 48]]);
    box(context, cloth.light, 45, 41, 3, 4);
    box(context, GOLD, 62, 43, 3, 3);
  }
}

function hairBack(context, palette, appearance, side = false) {
  if (appearance.hairStyle !== "long") return;
  const { hair } = palette;
  shape(context, INK, [[43, 9], [65, 9], [72, 19], [72, 34], [75, 34], [75, 48], [70, 52], [65, 49], [62, 53], [44, 51], [40, 46], [36, 48], [37, 33], [38, 18]]);
  shape(context, hair.shadow, [[44, 12], [64, 12], [69, 20], [69, 35], [72, 37], [72, 46], [67, 47], [63, 49], [45, 47], [40, 43], [41, 21]]);
  box(context, hair.base, side ? 45 : 40, 22, 5, 21);
  box(context, hair.light, side ? 47 : 41, 24, 1, 16);
  box(context, hair.base, 66, 24, 3, 21);
}

function head(context, palette, appearance, view) {
  const { skin, hair } = palette;
  const back = view === "back";
  const angular = appearance.face === "angular";
  const soft = appearance.face === "soft";
  const left = soft ? 43 : angular ? 44 : 42;
  const right = soft ? 67 : 68;
  const jaw = soft ? 37 : angular ? 39 : 38;
  shape(context, INK, [[left + 4, 10], [right - 5, 10], [right - 5, 12], [right, 12], [right, 18], [right + 2, 18], [right + 2, 29], [right, 29], [right, jaw - 5], [right - 5, jaw - 5], [right - 5, jaw], [left + 7, jaw], [left + 7, jaw - 3], [left + 2, jaw - 3], [left + 2, 29], [left - 2, 29], [left - 2, 20], [left, 20], [left, 14], [left + 4, 14]]);
  shape(context, skin.base, [[left + 4, 14], [right - 4, 14], [right - 4, 17], [right - 1, 17], [right - 1, 28], [right - 4, 28], [right - 4, jaw - 5], [right - 7, jaw - 5], [right - 7, jaw - 2], [left + 7, jaw - 2], [left + 7, jaw - 5], [left + 3, jaw - 5], [left + 3, 27], [left, 27], [left, 22], [left + 3, 22], [left + 3, 16]]);
  shape(context, skin.shadow, [[59, 16], [right - 2, 17], [right - 2, 28], [right - 4, 28], [right - 4, jaw - 5], [right - 7, jaw - 5], [right - 7, jaw - 2], [56, jaw - 2], [56, jaw - 6], [60, jaw - 6]]);
  box(context, skin.light, left + 4, 18, 6, 6);
  box(context, skin.light, left + 5, 28, soft ? 6 : 4, 3);
  box(context, skin.light, 54, 28, 2, 3);
  box(context, skin.shadow, left, 23, 2, 3);
  box(context, skin.shadow, right - 1, 23, 2, 3);
  if (!back) {
    const eyeY = soft ? 25 : 24;
    box(context, hair.shadow, 46, eyeY - 3, soft ? 4 : 6, angular ? 2 : 1);
    box(context, hair.shadow, 59, eyeY - 3, 5, angular ? 2 : 1);
    if (angular) {
      box(context, hair.shadow, 50, eyeY - 2, 2, 1);
      box(context, hair.shadow, 59, eyeY - 2, 2, 1);
    }
    box(context, "#dfddd0", 47, eyeY, 4, 2);
    box(context, "#d2cbb9", 59, eyeY, 4, 2);
    box(context, "#243b3c", 49, eyeY, 2, 2);
    box(context, "#203434", 59, eyeY, 2, 2);
    box(context, skin.shadow, 54, 26, 2, angular ? 5 : 4);
    box(context, skin.light, 53, 26, 1, 3);
    box(context, skin.shadow, 52, 33, soft ? 5 : 7, 1);
    box(context, skin.light, 53, 35, soft ? 3 : 5, 1);
    if (angular) {
      box(context, skin.shadow, 47, 29, 3, 1);
      box(context, skin.shadow, 61, 29, 3, 1);
    }
  }

  if (appearance.hairStyle === "shaved") {
    // A narrow hairline and temples expose the entire head silhouette.
    shape(context, hair.shadow, [[46, 11], [63, 11], [63, 13], [67, 13], [67, 19], [64, 19], [64, 16], [47, 16], [47, 18], [43, 18], [43, 14], [46, 14]]);
    box(context, hair.base, 47, 12, 14, 2);
    box(context, hair.light, 47, 12, 5, 1);
    box(context, hair.shadow, 44, 18, 2, 4);
    box(context, hair.shadow, 65, 18, 2, 4);
    if (back) {
      box(context, hair.base, 46, 17, 19, 13);
      box(context, hair.shadow, 48, 29, 15, 3);
      box(context, hair.light, 47, 18, 4, 7);
    }
  } else if (appearance.hairStyle === "cropped") {
    shape(context, INK, [[45, 8], [48, 5], [54, 6], [54, 4], [61, 5], [61, 7], [66, 7], [66, 11], [69, 11], [69, 21], [64, 21], [64, 16], [60, 16], [60, 18], [54, 16], [48, 18], [45, 24], [41, 24], [41, 13], [45, 13]]);
    shape(context, hair.base, [[45, 11], [49, 8], [55, 9], [56, 7], [63, 9], [64, 13], [66, 13], [66, 18], [62, 16], [59, 14], [51, 14], [46, 18], [43, 21], [43, 14], [45, 14]]);
    box(context, hair.light, 47, 10, 7, 2);
    box(context, hair.light, 55, 9, 5, 2);
    box(context, hair.shadow, 60, 13, 5, 3);
    if (back) {
      box(context, hair.base, 45, 16, 21, 14);
      box(context, hair.shadow, 57, 18, 9, 14);
      box(context, hair.shadow, 49, 29, 14, 5);
      box(context, hair.light, 46, 18, 3, 8);
    }
  } else if (appearance.hairStyle === "swept") {
    shape(context, INK, [[43, 8], [49, 8], [49, 5], [61, 5], [61, 7], [68, 7], [68, 12], [71, 12], [71, 22], [67, 25], [64, 23], [64, 16], [59, 16], [59, 19], [53, 19], [53, 22], [47, 22], [47, 26], [41, 26], [40, 19], [39, 19], [39, 12], [43, 12]]);
    shape(context, hair.base, [[44, 10], [51, 10], [51, 8], [60, 8], [60, 10], [65, 10], [68, 14], [68, 21], [66, 22], [64, 14], [59, 14], [59, 17], [52, 17], [52, 20], [46, 20], [44, 24], [43, 24], [42, 17], [42, 13], [44, 13]]);
    shape(context, hair.light, [[45, 11], [54, 9], [60, 10], [53, 12], [53, 14], [47, 14], [47, 17], [43, 19], [43, 15], [45, 15]]);
    box(context, hair.shadow, 62, 11, 4, 4);
    box(context, hair.shadow, 43, 21, 2, 4);
    if (back) {
      shape(context, hair.base, [[43, 17], [65, 15], [68, 20], [66, 31], [63, 31], [63, 35], [50, 35], [50, 33], [46, 33], [46, 28], [43, 28]]);
      box(context, hair.shadow, 59, 21, 7, 10);
      box(context, hair.shadow, 53, 31, 10, 4);
      box(context, hair.light, 45, 18, 3, 9);
      box(context, hair.light, 49, 18, 2, 13);
    }
  } else {
    shape(context, INK, [[44, 8], [50, 8], [50, 6], [61, 6], [61, 8], [67, 8], [67, 12], [71, 12], [71, 30], [68, 35], [64, 33], [64, 17], [57, 15], [49, 18], [47, 26], [43, 29], [40, 26], [40, 14], [44, 14]]);
    shape(context, hair.base, [[45, 11], [51, 11], [51, 9], [60, 9], [60, 11], [65, 11], [68, 15], [68, 30], [66, 32], [66, 18], [62, 15], [57, 13], [49, 16], [46, 21], [45, 25], [43, 25], [43, 15], [45, 15]]);
    box(context, hair.light, 45, 13, 3, 10);
    box(context, hair.light, 49, 11, 7, 2);
    box(context, hair.shadow, 63, 15, 3, 11);
    if (back) {
      shape(context, hair.base, [[43, 15], [66, 14], [69, 24], [68, 40], [65, 47], [48, 47], [42, 41]]);
      shape(context, hair.shadow, [[56, 16], [66, 17], [68, 29], [65, 45], [57, 48], [59, 35]]);
      box(context, hair.light, 45, 17, 3, 23);
      box(context, hair.light, 50, 25, 2, 18);
      box(context, hair.shadow, 53, 21, 2, 23);
    }
  }
}

function sword(context, palette, pose = "idle") {
  const { metal, leather } = palette;
  context.save();
  if (pose === "ready") {
    context.translate(85, 108);
    context.rotate(-0.16);
    context.translate(-85, -108);
  }
  // The asymmetric point-down sword rests safely outside the hero's legs.
  shape(context, INK, [[87, 100], [93, 100], [93, 110], [101, 110], [101, 117], [94, 117], [97, 153], [91, 167], [85, 156], [85, 118], [78, 117], [78, 111], [87, 111]]);
  box(context, leather.base, 88, 103, 4, 9);
  box(context, GOLD, 88, 101, 4, 3);
  box(context, GOLD_DARK, 88, 106, 4, 2);
  box(context, GOLD, 81, 112, 17, 3);
  box(context, GOLD_DARK, 80, 115, 7, 2);
  box(context, GOLD_DARK, 94, 114, 5, 2);
  shape(context, metal.shadow, [[87, 118], [92, 118], [95, 153], [91, 163], [88, 155]]);
  shape(context, metal.base, [[87, 119], [90, 119], [92, 153], [91, 161], [88, 154]]);
  box(context, metal.light, 87, 120, 2, 26);
  box(context, metal.light, 88, 145, 2, 10);
  box(context, "#f2ead0", 87, 119, 2, 5);
  context.restore();
}

function sideHero(context, palette, appearance, pose) {
  const { skin, cloth, leather, metal, hair } = palette;
  cape(context, appearance, palette, "side");
  // Far leg is deliberately behind the near leg for a readable profile stance.
  shape(context, INK, [[45, 95], [64, 95], [67, 120], [61, 151], [68, 154], [68, 163], [44, 163], [44, 154], [48, 150], [49, 121], [44, 112]]);
  box(context, "#303c3d", 49, 107, 10, 25);
  box(context, leather.shadow, 48, 132, 11, 22);
  box(context, leather.base, 46, 154, 18, 6);
  shape(context, INK, [[56, 94], [74, 97], [76, 125], [74, 148], [79, 154], [87, 154], [87, 163], [61, 163], [60, 147], [63, 123], [55, 112]]);
  shape(context, "#3b4845", [[59, 102], [71, 104], [72, 125], [70, 139], [64, 139], [66, 121]]);
  box(context, "#526052", 64, 111, 4, 12);
  box(context, leather.shadow, 63, 136, 11, 19);
  box(context, leather.base, 64, 137, 6, 18);
  box(context, leather.light, 64, 138, 2, 12);
  box(context, GOLD_DARK, 64, 143, 9, 2);
  box(context, GOLD, 70, 143, 2, 3);
  shape(context, leather.base, [[64, 152], [73, 152], [76, 156], [83, 156], [83, 160], [64, 160]]);
  box(context, leather.light, 65, 156, 6, 2);
  if (appearance.outfit === "knight") {
    box(context, metal.shadow, 64, 129, 10, 19);
    box(context, metal.base, 64, 130, 6, 16);
    box(context, metal.light, 64, 130, 2, 13);
    box(context, INK, 64, 136, 10, 2);
  }
  shape(context, INK, [[47, 38], [66, 38], [66, 42], [74, 42], [79, 53], [78, 68], [73, 81], [77, 109], [62, 116], [46, 109], [44, 88], [39, 71], [38, 51], [41, 43]]);
  shape(context, cloth.shadow, [[46, 44], [66, 44], [72, 47], [75, 55], [72, 73], [69, 83], [74, 106], [63, 111], [49, 106], [48, 84], [43, 70], [42, 52]]);
  box(context, cloth.base, 49, 49, 10, 37);
  shape(context, cloth.base, [[49, 94], [61, 94], [61, 109], [50, 105]]);
  box(context, cloth.light, 50, 101, 2, 5);
  box(context, GOLD_DARK, 50, 107, 11, 2);
  if (appearance.outfit === "leather") {
    shape(context, leather.shadow, [[55, 46], [66, 47], [73, 52], [74, 63], [68, 82], [71, 90], [51, 90], [47, 66], [48, 53]]);
    shape(context, leather.base, [[56, 49], [65, 50], [70, 54], [68, 70], [64, 84], [54, 84], [51, 65]]);
    box(context, leather.light, 54, 55, 2, 21);
    for (let y = 64; y < 85; y += 7) box(context, leather.shadow, 54, y, 16, 2);
  } else if (appearance.outfit === "knight") {
    shape(context, INK, [[52, 45], [68, 48], [77, 56], [77, 64], [70, 83], [51, 86], [46, 58]]);
    shape(context, metal.shadow, [[56, 48], [67, 51], [73, 57], [73, 64], [67, 81], [54, 82], [49, 58]]);
    shape(context, metal.base, [[56, 49], [61, 52], [63, 64], [60, 80], [54, 80], [51, 59]]);
    box(context, metal.light, 53, 57, 2, 16);
    box(context, metal.base, 52, 86, 18, 4);
    box(context, metal.light, 52, 86, 12, 1);
  }
  box(context, INK, 47, 91, 27, 8);
  box(context, leather.base, 48, 93, 25, 4);
  box(context, GOLD, 70, 93, 3, 4);
  box(context, INK, 47, 97, 12, 11);
  box(context, leather.base, 49, 99, 8, 7);
  box(context, leather.light, 49, 99, 6, 2);
  box(context, GOLD, 53, 101, 2, 2);
  // Near arm and its bracer are visible in front of the torso.
  shape(context, INK, [[49, 46], [59, 45], [65, 50], [65, 68], [62, 80], [66, 94], [72, 101], [71, 109], [62, 112], [56, 105], [55, 91], [49, 77], [45, 60]]);
  shape(context, cloth.base, [[51, 49], [58, 48], [62, 53], [62, 67], [58, 80], [52, 75], [49, 58]]);
  box(context, cloth.light, 50, 52, 3, 13);
  box(context, cloth.shadow, 58, 56, 4, 17);
  shape(context, skin.base, [[55, 79], [59, 79], [62, 88], [57, 90]]);
  shape(context, leather.shadow, [[56, 89], [63, 87], [68, 100], [60, 104]]);
  shape(context, leather.base, [[57, 91], [60, 90], [64, 100], [61, 101]]);
  box(context, GOLD_DARK, 58, 93, 6, 2);
  box(context, skin.base, 62, 103, 6, 6);
  box(context, skin.light, 62, 103, 2, 4);
  if (appearance.outfit === "knight") {
    shape(context, INK, [[50, 43], [59, 43], [65, 48], [67, 57], [60, 62], [46, 59], [45, 51]]);
    shape(context, metal.base, [[51, 46], [57, 46], [62, 50], [63, 56], [59, 58], [49, 56], [48, 51]]);
    box(context, metal.light, 50, 48, 3, 5);
    box(context, metal.shadow, 57, 50, 5, 7);
    box(context, GOLD, 51, 56, 2, 2);
    box(context, metal.base, 57, 92, 5, 9);
    box(context, metal.light, 57, 92, 2, 6);
  }
  if (appearance.cloak !== "none") {
    shape(context, palette.cloak.base, [[44, 40], [53, 38], [62, 42], [57, 48], [48, 47], [42, 55], [40, 48]]);
    box(context, palette.cloak.light, 45, 42, 9, 2);
    box(context, GOLD, 60, 43, 3, 3);
  }
  box(context, skin.shadow, 53, 31, 13, 11);
  box(context, skin.base, 57, 32, 7, 9);
  hairBack(context, palette, appearance, true);
  const angular = appearance.face === "angular";
  const soft = appearance.face === "soft";
  shape(context, INK, [[51, 10], [67, 10], [67, 14], [72, 14], [72, 23], [76, 26], [76, 29], [72, 29], [72, 34], [68, 34], [68, 38], [56, 38], [56, 34], [49, 31], [47, 20], [48, 14], [51, 14]]);
  shape(context, skin.base, [[53, 14], [66, 14], [66, 17], [69, 17], [69, 24], [73, 27], [69, 28], [69, 33], [65, 35], [58, 35], [58, 31], [52, 29], [50, 20]]);
  box(context, skin.shadow, 52, 24, 7, 9);
  box(context, skin.light, 62, 19, 6, 4);
  box(context, skin.light, 68, 26, 4, 2);
  box(context, skin.shadow, 66, 31, soft ? 3 : 5, 1);
  box(context, hair.shadow, 64, 21, 6, angular ? 2 : 1);
  box(context, "#d7dace", 65, 24, 4, 2);
  box(context, "#293d3c", 67, 24, 2, 2);
  box(context, skin.light, 55, 23, 3, 4);
  box(context, skin.shadow, 56, 25, 2, 3);
  if (angular) box(context, skin.shadow, 62, 29, 4, 1);
  if (appearance.hairStyle === "shaved") {
    shape(context, hair.shadow, [[52, 11], [65, 11], [69, 15], [69, 19], [65, 17], [55, 16], [53, 23], [49, 22], [49, 15]]);
    box(context, hair.base, 53, 12, 11, 2);
  } else if (appearance.hairStyle === "cropped") {
    shape(context, INK, [[51, 9], [54, 6], [58, 7], [60, 5], [66, 7], [69, 10], [72, 10], [72, 16], [68, 19], [64, 16], [60, 17], [57, 21], [54, 20], [52, 27], [48, 26], [47, 16]]);
    shape(context, hair.base, [[52, 11], [56, 9], [60, 9], [63, 8], [68, 12], [69, 15], [65, 14], [58, 17], [54, 19], [51, 24], [50, 17]]);
    box(context, hair.light, 53, 11, 7, 2);
  } else if (appearance.hairStyle === "swept") {
    shape(context, INK, [[50, 9], [56, 5], [65, 6], [68, 9], [74, 11], [74, 17], [70, 21], [66, 19], [61, 16], [57, 19], [53, 24], [54, 32], [48, 33], [45, 26], [45, 15]]);
    shape(context, hair.base, [[51, 11], [57, 8], [64, 9], [67, 12], [72, 13], [71, 17], [68, 18], [62, 13], [57, 16], [51, 24], [52, 29], [49, 29], [48, 24], [48, 16]]);
    shape(context, hair.light, [[52, 12], [58, 10], [64, 11], [58, 13], [54, 16], [49, 20], [50, 15]]);
  } else {
    shape(context, INK, [[51, 9], [56, 6], [66, 8], [71, 12], [72, 19], [68, 21], [64, 17], [59, 18], [55, 25], [54, 42], [51, 49], [44, 45], [43, 32], [45, 16]]);
    shape(context, hair.base, [[52, 11], [57, 9], [64, 11], [68, 14], [69, 17], [63, 14], [58, 16], [52, 25], [51, 40], [49, 45], [47, 43], [46, 32], [48, 17]]);
    box(context, hair.light, 49, 17, 2, 21);
    box(context, hair.light, 53, 12, 6, 2);
  }
  context.save();
  context.translate(-20, 0);
  sword(context, palette, pose);
  context.restore();
}

/** Draw a reusable full-body actor without resetting the caller's canvas. */
export function drawHero(context, input, {
  x = 0,
  y = 0,
  scale = 1,
  view = "front",
  time = 0,
  pose = "idle",
  reducedMotion = false,
} = {}) {
  const appearance = normalizeAppearance(input);
  const palette = getAppearancePalette(appearance);
  const facing = ["front", "side", "back"].includes(view) ? view : "front";
  const breathe = reducedMotion ? 0 : Math.round(Math.sin(time * 1.8) * 0.65);
  context.save();
  context.translate(Math.round(x), Math.round(y));
  context.scale(scale, scale);
  context.translate(0, breathe);
  if (facing === "side") {
    sideHero(context, palette, appearance, pose);
  } else {
    cape(context, appearance, palette, facing === "back" ? "front" : facing);
    legs(context, palette, appearance, facing);
    arms(context, palette, appearance, facing);
    torso(context, palette, appearance, facing);
    if (facing === "back" && appearance.cloak !== "none") cape(context, appearance, palette, "back");
    hairBack(context, palette, appearance);
    head(context, palette, appearance, facing);
    sword(context, palette, pose);
  }
  context.restore();
}

function pine(context, x, ground, height, color, highlight) {
  box(context, "#111f2b", x - 2, ground - height + 8, 4, height);
  for (let tier = 0; tier < 6; tier += 1) {
    const y = Math.round(ground - height + tier * height * 0.14);
    const width = Math.round(height * (0.08 + tier * 0.028));
    shape(context, color, [[x, y - 8], [x - width * 0.4, y + 1], [x - width * 0.3, y + 1], [x - width, y + 19], [x - width * 0.6, y + 18], [x - width * 1.2, y + 29], [x + width, y + 27], [x + width * 0.7, y + 18], [x + width * 0.9, y + 19], [x + width * 0.3, y + 3]]);
    shape(context, highlight, [[x - 1, y - 5], [x - width * 0.4, y + 6], [x - width * 0.25, y + 6], [x - width * 0.9, y + 21], [x - width * 0.6, y + 20], [x - width * 0.3, y + 11]]);
  }
}

function previewBackground(ownerDocument) {
  const canvas = ownerDocument.createElement("canvas");
  canvas.width = 360;
  canvas.height = 300;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  // Fixed seeded noise ensures switching cosmetics never moves the scenery.
  let seed = 6219;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < 230; y += 3) {
    const fraction = y / 230;
    const rgb = [9 + Math.round(fraction * 12), 19 + Math.round(fraction * 23), 35 + Math.round(fraction * 24)];
    box(context, `rgb(${rgb.join(",")})`, 0, y, 360, 3);
  }
  for (let i = 0; i < 38; i += 1) {
    box(context, i % 7 === 0 ? "#779aa3" : "#3f5c70", Math.round(random() * 360), Math.round(random() * 105), i % 9 === 0 ? 2 : 1, 1);
  }
  box(context, "#b8c8c0", 284, 25, 9, 13);
  box(context, "#b8c8c0", 281, 28, 15, 7);
  box(context, "#14283d", 280, 25, 10, 8);
  shape(context, "#1c3545", [[0, 151], [36, 125], [80, 142], [129, 121], [182, 138], [228, 127], [281, 142], [322, 119], [360, 136], [360, 230], [0, 230]]);
  for (const [x, h] of [[9, 85], [47, 103], [82, 80], [119, 69], [229, 79], [266, 94], [307, 91], [344, 111]]) {
    pine(context, x, 211, h, "#16323d", "#20404a");
  }
  pine(context, 40, 239, 204, "#112732", "#183b43");
  pine(context, 321, 234, 219, "#102530", "#18353e");
  pine(context, 3, 247, 179, "#0c202c", "#14313a");
  pine(context, 360, 247, 177, "#0a1d28", "#12303a");
  shape(context, "#1c333a", [[0, 218], [62, 226], [103, 218], [150, 223], [188, 216], [245, 223], [281, 220], [360, 212], [360, 300], [0, 300]]);
  shape(context, "#273f42", [[107, 219], [196, 218], [233, 230], [267, 257], [310, 278], [328, 300], [58, 300], [83, 275], [126, 250]]);
  for (let i = 0; i < 230; i += 1) {
    const x = Math.round(random() * 360);
    const y = 230 + Math.round(random() * 69);
    box(context, ["#30484a", "#20383e", "#3a4b47", "#152d35"][i % 4], x, y, 1 + Math.round(random() * 4), 1);
  }
  // Weathered stone circle gives the character a quiet, grounded stage.
  shape(context, "#13282f", [[113, 260], [137, 250], [209, 250], [241, 260], [250, 272], [238, 284], [211, 291], [140, 290], [109, 280], [103, 270]]);
  shape(context, "#4a5751", [[114, 258], [138, 249], [207, 249], [237, 258], [246, 269], [236, 277], [209, 284], [141, 283], [111, 274], [107, 267]]);
  shape(context, "#3b4b49", [[120, 259], [143, 253], [206, 253], [232, 261], [237, 269], [230, 273], [207, 279], [144, 279], [115, 271], [113, 267]]);
  box(context, "#657064", 137, 250, 19, 1);
  box(context, "#647064", 111, 262, 6, 2);
  box(context, "#253b3e", 130, 273, 14, 2);
  box(context, "#253b3e", 143, 275, 5, 5);
  box(context, "#293e40", 216, 256, 2, 9);
  box(context, "#293e40", 212, 264, 6, 1);
  // A travel lantern and bedroll establish a camp, distinct from the battle.
  box(context, "#101f29", 75, 224, 4, 42);
  box(context, "#705c41", 76, 225, 2, 38);
  box(context, "#101f29", 65, 228, 14, 3);
  box(context, "#a98a53", 67, 231, 1, 6);
  box(context, "#152027", 60, 237, 16, 22);
  box(context, "#9d8050", 62, 238, 12, 3);
  box(context, "#d99b52", 63, 241, 10, 13);
  box(context, "#f1c675", 65, 242, 6, 10);
  box(context, "#ffe0a0", 66, 243, 3, 8);
  box(context, "#594835", 62, 254, 12, 3);
  box(context, "#664e37", 63, 241, 2, 13);
  box(context, "#664e37", 71, 241, 2, 13);
  for (let i = 0; i < 24; i += 1) {
    const x = 45 + Math.round(random() * 54);
    const y = 264 + Math.round(random() * 15);
    box(context, i % 2 ? "#5c5742" : "#434c42", x, y, 4, 1);
  }
  shape(context, "#14252e", [[270, 254], [290, 254], [296, 260], [296, 274], [269, 278], [260, 271], [260, 260]]);
  shape(context, "#596355", [[270, 255], [288, 255], [292, 261], [292, 271], [270, 274], [264, 268], [264, 261]]);
  box(context, "#727864", 267, 258, 20, 3);
  box(context, "#364c45", 273, 262, 17, 9);
  box(context, "#765e43", 270, 257, 3, 17);
  box(context, "#a8905b", 270, 265, 4, 3);
  return canvas;
}

/** Canvas adapter; requestAnimationFrame remains owned by the React component. */
export function createHeroPreview(canvas) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Hero preview canvas is unavailable");
  canvas.width = 360;
  canvas.height = 300;
  const background = previewBackground(canvas.ownerDocument);
  const actor = canvas.ownerDocument.createElement("canvas");
  actor.width = HERO_WIDTH;
  actor.height = HERO_HEIGHT + 2;
  const actorContext = actor.getContext("2d");
  if (!actorContext) throw new Error("Hero sprite canvas is unavailable");
  let destroyed = false;

  return {
    render(appearance, view = "front", time = 0, reducedMotion = false, detail = false) {
      if (destroyed || !context || !actorContext) return;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, 360, 300);
      context.drawImage(background, 0, 0);
      if (!detail) {
        context.fillStyle = "#1d3032";
        context.beginPath();
        context.ellipse(178, 269, view === "side" ? 24 : 39, 7, 0, 0, Math.PI * 2);
        context.fill();
      }
      actorContext.clearRect(0, 0, actor.width, actor.height);
      drawHero(actorContext, appearance, { view, time, reducedMotion, y: 1 });
      if (detail) {
        const actorScale = 3.5;
        const offset = view === "side" ? -44 : -16;
        context.drawImage(actor, offset, 17, HERO_WIDTH * actorScale, (HERO_HEIGHT + 2) * actorScale);
      } else {
        context.drawImage(actor, 99, 31, HERO_WIDTH * 1.42, (HERO_HEIGHT + 2) * 1.42);
      }
      // Sparse ambient motes remain behind UI and never cover the face.
      if (!reducedMotion) {
        for (let i = 0; i < 4; i += 1) {
          const phase = time * 0.2 + i * 1.9;
          const x = Math.round(83 + (i % 2) * 186 + Math.sin(phase) * 8);
          const y = Math.round(140 + i * 25 + Math.cos(phase * 0.7) * 10);
          box(context, Math.sin(time * 1.1 + i) > 0.2 ? "#a4ab77" : "#566d59", x, y, 1, 1);
        }
      }
    },
    destroy() {
      destroyed = true;
      background.width = 0;
      actor.width = 0;
    },
  };
}
