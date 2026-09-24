import { getAppearancePalette, normalizeAppearance } from "./appearance.mjs";
import { EIRA_SWORD, eiraSwordPose, eiraElbow } from "./eiraSword.mjs";

const WIDTH = 360;
const HEIGHT = 600;
const INK = "#101a25";

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
    context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  });
}

function pine(context, x, ground, height, colors, seed) {
  const random = randomSource(seed);
  const top = ground - height;
  polygon(context, colors[0], [[x - height * 0.025, ground], [x - height * 0.01, top], [x + height * 0.012, top], [x + height * 0.033, ground]]);
  for (let tier = 7; tier >= 0; tier -= 1) {
    const half = height * (0.033 + tier * 0.025);
    const y = top + height * (0.12 + tier * 0.105);
    const depth = height * 0.16;
    polygon(context, colors[1], [
      [x, y - depth], [x - half * 0.3, y - depth * 0.35], [x - half * 0.43, y - depth * 0.4],
      [x - half * 0.35, y - depth * 0.17], [x - half * 0.71, y + depth * 0.07],
      [x - half * 0.61, y + depth * 0.11], [x - half, y + depth * 0.4],
      [x - half * 0.65, y + depth * 0.34], [x - half * 0.1, y + depth * 0.25],
      [x + half * 0.72, y + depth * 0.4], [x + half, y + depth * 0.3],
      [x + half * 0.66, y + depth * 0.09], [x + half * 0.74, y + depth * 0.08],
      [x + half * 0.41, y - depth * 0.2], [x + half * 0.47, y - depth * 0.22], [x + half * 0.19, y - depth * 0.49],
    ]);
    polygon(context, colors[2], [
      [x - 1, y - depth + 3], [x - half * 0.25, y - depth * 0.36],
      [x - half * 0.17, y - depth * 0.21], [x - half * 0.65, y + depth * 0.05],
      [x - half * 0.46, y + depth * 0.07], [x - half * 0.84, y + depth * 0.32],
      [x - half * 0.39, y + depth * 0.2], [x - half * 0.12, y - depth * 0.01], [x + half * 0.18, y + depth * 0.1],
    ]);
    for (let i = 0; i < 8; i += 1) {
      const d = random();
      pixels(context, colors[3] || colors[2], [[x - half * (0.16 + d * 0.6), y + depth * (0.22 - (1 - d) * 0.33), 2 + height / 120, 1]]);
    }
  }
}

function stone(context, x, y, size, warm = false) {
  polygon(context, "#17242b", [[x - size, y], [x - size * 0.7, y - size * 0.6], [x + size * 0.1, y - size * 0.8], [x + size * 0.8, y - size * 0.4], [x + size, y + size * 0.12], [x + size * 0.5, y + size * 0.3], [x - size * 0.7, y + size * 0.25]]);
  polygon(context, warm ? "#927453" : "#496174", [[x - size * 0.8, y - 1], [x - size * 0.6, y - size * 0.5], [x + size * 0.05, y - size * 0.65], [x + size * 0.7, y - size * 0.3], [x + size * 0.1, y - size * 0.15], [x - size * 0.25, y - size * 0.25]]);
  polygon(context, warm ? "#544f43" : "#2b414f", [[x - size * 0.25, y - size * 0.25], [x + size * 0.1, y - size * 0.15], [x + size * 0.7, y - size * 0.3], [x + size * 0.8, y + size * 0.05], [x + size * 0.45, y + size * 0.17], [x - size * 0.7, y + size * 0.12]]);
  pixels(context, warm ? "#bd9463" : "#68818b", [[x - size * 0.5, y - size * 0.5, size * 0.35, 1]]);
}

function campSupplies(context) {
  // Two rolled blankets, straps, and a well-travelled pack beside Eira's log.
  polygon(context, "#0d202c", [[252, 257], [258, 230], [265, 218], [285, 219], [295, 231], [298, 264], [288, 276], [260, 275]]);
  polygon(context, "#544b37", [[258, 254], [262, 232], [267, 222], [282, 223], [290, 233], [293, 262], [286, 270], [264, 269]]);
  polygon(context, "#777051", [[264, 229], [269, 224], [279, 225], [286, 232], [287, 240], [263, 241]]);
  polygon(context, "#3b4135", [[277, 242], [289, 239], [292, 261], [285, 267], [277, 265]]);
  polygon(context, "#857556", [[264, 244], [275, 245], [274, 263], [266, 263], [262, 259]]);
  pixels(context, "#9a855c", [[264, 234, 20, 2], [263, 245, 2, 11], [268, 224, 10, 1]]);
  pixels(context, "#352e25", [[268, 231, 4, 33], [282, 232, 4, 33]]);
  pixels(context, "#a4834e", [[268, 247, 5, 6], [282, 247, 5, 6]]);
  pixels(context, "#3c3428", [[269, 248, 2, 3], [283, 248, 2, 3]]);
  polygon(context, "#233a3b", [[257, 265], [282, 266], [289, 272], [287, 281], [260, 282], [253, 274]]);
  pixels(context, "#4d6455", [[258, 267, 24, 3], [256, 270, 3, 5]]);
  pixels(context, "#304843", [[264, 272, 19, 7]]);
  pixels(context, "#806646", [[263, 267, 3, 13], [279, 267, 3, 13]]);
  pixels(context, "#b09158", [[263, 273, 3, 2], [279, 273, 3, 2]]);

  // A quiet lantern is secondary to the central fire.
  pixels(context, "#141f29", [[76, 244, 3, 34], [65, 247, 12, 3], [65, 250, 1, 7], [59, 257, 13, 21]]);
  pixels(context, "#635540", [[77, 245, 1, 31], [61, 258, 9, 3], [61, 273, 9, 3]]);
  pixels(context, "#b28147", [[62, 261, 7, 11]]);
  pixels(context, "#e0b76e", [[64, 263, 3, 7]]);
  pixels(context, "#4d4030", [[61, 261, 2, 12], [68, 261, 2, 12]]);

  // A spare sheathed sword rests against the log, never in Eira's hand.
  polygon(context, "#0e1c27", [[103, 234], [107, 234], [108, 245], [115, 246], [114, 251], [108, 250], [94, 292], [88, 296], [87, 289], [100, 249], [94, 247], [95, 243], [102, 244]]);
  polygon(context, "#59616b", [[103, 249], [107, 250], [93, 290], [90, 292], [91, 287]]);
  polygon(context, "#343b40", [[104, 252], [106, 252], [93, 289], [91, 290]]);
  pixels(context, "#b99860", [[97, 245, 15, 2], [103, 235, 3, 3]]);
  pixels(context, "#7c6247", [[103, 238, 3, 7]]);
}

function fallenLog(context) {
  polygon(context, "#101e25", [[93, 263], [246, 249], [258, 253], [264, 269], [259, 282], [103, 294], [91, 286], [87, 273]]);
  polygon(context, "#554735", [[97, 265], [246, 253], [256, 258], [259, 269], [253, 278], [104, 289], [96, 282], [92, 273]]);
  polygon(context, "#7b6243", [[99, 266], [245, 255], [254, 258], [254, 262], [106, 276], [94, 273]]);
  polygon(context, "#332f2b", [[107, 278], [255, 264], [257, 272], [251, 277], [106, 286]]);
  pixels(context, "#ac8655", [[107, 265, 24, 2], [213, 257, 22, 2], [151, 263, 17, 1], [123, 270, 31, 2], [172, 266, 19, 1]]);
  polygon(context, "#302d27", [[113, 272], [137, 268], [155, 269], [150, 271], [126, 272], [118, 276], [109, 277]]);
  polygon(context, "#292d2b", [[181, 270], [199, 265], [231, 265], [227, 268], [201, 267], [192, 272]]);
  polygon(context, "#8b6c49", [[95, 270], [99, 267], [105, 271], [109, 279], [106, 286], [100, 284], [94, 279]]);
  polygon(context, "#594835", [[98, 272], [101, 271], [105, 277], [105, 282], [101, 281], [98, 277]]);
  pixels(context, "#b58c59", [[97, 273, 1, 5], [102, 280, 3, 1]]);
  // Small patches of lichen catch the cool moonlight along the far edge.
  pixels(context, "#52654e", [[108, 265, 8, 2], [115, 263, 5, 2], [237, 254, 10, 2], [242, 252, 4, 2]]);
}

const EIRA_PALETTE = {
  hair: { shadow: "#34292b", base: "#644332", light: "#a17648" },
  skin: { shadow: "#97664b", base: "#c78f64", light: "#e9b780" },
  cloak: { shadow: "#263e42", base: "#3d5b58", light: "#718572" },
};

function drawEiraCape(context) {
  const { cloak } = EIRA_PALETTE;
  // Eira is an original seated adult actor, drawn at scene scale. The broad
  // bent legs, narrow shoulders and tilted head are independent of player art.
  polygon(context, "#111d26", [[150, 180], [170, 174], [198, 172], [214, 181], [226, 204], [228, 229], [238, 253], [235, 273], [210, 280], [163, 282], [131, 274], [129, 254], [138, 224], [139, 199]]);
  polygon(context, cloak.shadow, [[151, 183], [171, 178], [197, 176], [212, 184], [221, 205], [223, 232], [234, 254], [231, 268], [210, 275], [164, 278], [136, 270], [134, 256], [143, 225], [143, 201]]);
  polygon(context, cloak.base, [[153, 186], [166, 182], [173, 191], [166, 212], [158, 231], [151, 258], [136, 266], [138, 251], [146, 223], [146, 201]]);
  polygon(context, cloak.light, [[154, 186], [160, 185], [153, 205], [151, 223], [147, 240], [147, 228], [150, 206]]);
  polygon(context, cloak.base, [[207, 183], [214, 189], [219, 206], [218, 229], [230, 254], [226, 267], [211, 271], [211, 253], [205, 232]]);
  polygon(context, "#53675b", [[210, 189], [213, 195], [215, 218], [214, 232], [226, 257], [222, 262], [220, 252], [209, 231]]);

}

function drawEiraSeatedLegs(context) {
  // Crossed, relaxed legs, sitting on the log. One knee catches the firelight.
  polygon(context, INK, [[171, 227], [192, 224], [207, 229], [226, 242], [239, 258], [231, 272], [210, 278], [184, 268], [163, 260], [144, 271], [122, 275], [119, 265], [131, 249], [150, 235]]);
  polygon(context, "#5c5544", [[166, 233], [183, 233], [186, 244], [174, 251], [153, 253], [139, 265], [128, 268], [127, 264], [140, 251], [156, 240]]);
  polygon(context, "#807054", [[163, 235], [173, 234], [178, 239], [168, 244], [156, 245], [142, 254], [151, 245]]);
  polygon(context, "#3c4139", [[186, 233], [201, 232], [217, 243], [231, 259], [226, 268], [211, 273], [192, 264], [174, 258], [172, 251], [183, 246]]);
  polygon(context, "#6a614b", [[197, 237], [206, 240], [220, 253], [223, 262], [215, 266], [206, 261], [209, 253], [196, 243]]);
  polygon(context, "#847556", [[199, 239], [204, 241], [217, 254], [218, 258], [213, 256], [205, 247], [197, 243]]);
  pixels(context, "#292e2d", [[164, 251, 8, 3], [179, 259, 10, 2], [210, 269, 7, 2]]);

  // Leather boots are angled outward rather than standing beneath her.
  polygon(context, INK, [[143, 255], [154, 266], [143, 278], [123, 282], [112, 279], [110, 270], [119, 269], [131, 263]]);
  polygon(context, "#614833", [[143, 259], [150, 266], [141, 273], [124, 278], [115, 276], [115, 273], [124, 272], [133, 267]]);
  polygon(context, "#8d6743", [[140, 260], [145, 264], [136, 271], [124, 274], [120, 273], [132, 268]]);
  pixels(context, "#ad8959", [[139, 262, 3, 2], [119, 274, 9, 1]]);
  polygon(context, "#34312b", [[125, 277], [141, 273], [145, 275], [141, 278], [126, 281], [115, 279], [115, 277]]);
  polygon(context, INK, [[213, 259], [225, 254], [238, 266], [250, 271], [253, 278], [246, 283], [228, 280], [217, 272]]);
  polygon(context, "#57432f", [[215, 261], [224, 258], [235, 269], [246, 274], [248, 278], [242, 279], [228, 277], [221, 270]]);
  polygon(context, "#95714a", [[217, 262], [223, 261], [230, 267], [228, 271], [223, 270]]);
  pixels(context, "#bd9861", [[222, 265, 4, 2], [233, 274, 7, 1]]);
  pixels(context, "#292b29", [[232, 279, 15, 2]]);

}

function drawEiraTorso(context) {
  // Fitted travelling jerkin over a high linen shirt, with a practical belt.
  polygon(context, "#252a2a", [[166, 179], [192, 176], [207, 184], [215, 203], [208, 228], [196, 241], [176, 241], [159, 231], [158, 209], [153, 192]]);
  polygon(context, "#76523b", [[168, 182], [191, 180], [202, 187], [208, 203], [203, 224], [194, 235], [177, 236], [164, 228], [164, 210], [159, 193]]);
  polygon(context, "#9c744c", [[168, 188], [180, 190], [183, 208], [179, 226], [166, 224], [168, 209], [163, 194]]);
  polygon(context, "#553f30", [[189, 184], [202, 190], [206, 202], [201, 221], [192, 232], [184, 231], [188, 215]]);
  polygon(context, "#e0bd85", [[174, 179], [187, 178], [195, 183], [188, 199], [183, 204], [176, 190]]);
  polygon(context, "#ac9270", [[187, 180], [192, 183], [186, 198], [183, 201], [181, 188]]);
  pixels(context, "#efcd91", [[178, 185, 2, 7], [182, 195, 2, 4]]);
  // Stitches and fastenings follow the diagonal center seam.
  for (let i = 0; i < 4; i += 1) {
    pixels(context, "#c4a06a", [[181 + (i % 2), 207 + i * 5, 4, 1], [165, 209 + i * 4, 1, 2]]);
  }
  pixels(context, "#3b3027", [[163, 229, 39, 6]]);
  pixels(context, "#936b44", [[165, 230, 33, 2]]);
  pixels(context, "#c9a063", [[180, 228, 9, 7]]);
  pixels(context, "#5a4834", [[182, 230, 5, 3]]);
  pixels(context, "#d6b276", [[184, 231, 4, 1]]);

}

function drawEiraCollar(context) {
  const { cloak } = EIRA_PALETTE;
  // Folded hood and asymmetrical cloak clasp frame the exposed neck.
  polygon(context, cloak.shadow, [[153, 183], [166, 175], [178, 177], [181, 188], [171, 199], [161, 198], [151, 193]]);
  polygon(context, cloak.base, [[156, 183], [167, 178], [175, 180], [177, 187], [170, 192], [161, 191], [154, 188]]);
  polygon(context, cloak.light, [[159, 182], [166, 180], [173, 182], [172, 185], [164, 185], [158, 188]]);
  polygon(context, cloak.shadow, [[192, 174], [204, 178], [216, 187], [216, 195], [204, 199], [190, 186]]);
  polygon(context, cloak.base, [[195, 177], [202, 180], [212, 187], [212, 192], [205, 193], [194, 185]]);
  pixels(context, "#b6945b", [[169, 190, 6, 6]]);
  pixels(context, "#e3bd75", [[170, 190, 4, 2], [169, 192, 2, 3]]);
  pixels(context, "#47736b", [[171, 192, 3, 3]]);

}

function drawEiraLeftArm(context) {
  const { skin } = EIRA_PALETTE;
  // Her left elbow rests on the raised knee, palm relaxed beside the fire.
  polygon(context, INK, [[153, 188], [163, 193], [165, 207], [157, 220], [154, 234], [169, 240], [172, 249], [163, 254], [149, 248], [141, 239], [143, 222], [143, 207]]);
  polygon(context, "#656755", [[152, 192], [159, 195], [161, 206], [152, 220], [149, 233], [146, 234], [147, 220], [147, 208]]);
  polygon(context, "#929077", [[152, 195], [156, 196], [156, 206], [149, 217], [148, 214], [150, 203]]);
  polygon(context, "#75533b", [[147, 226], [152, 225], [153, 236], [164, 242], [160, 248], [148, 242], [144, 237]]);
  pixels(context, "#b18c5a", [[146, 230, 7, 2]]);
  polygon(context, skin.shadow, [[160, 241], [166, 241], [171, 245], [170, 250], [164, 253], [158, 249], [157, 246]]);
  polygon(context, skin.light, [[160, 242], [164, 243], [166, 247], [164, 249], [160, 247]]);
  pixels(context, skin.base, [[166, 246, 3, 4]]);
  pixels(context, "#78523d", [[162, 249, 1, 2], [166, 248, 1, 3]]);

}

function drawEiraRightArm(context) {
  const { skin } = EIRA_PALETTE;
  // The other forearm crosses her lap and loosely holds a little tin cup.
  polygon(context, INK, [[209, 191], [220, 199], [228, 218], [224, 230], [209, 239], [192, 244], [183, 239], [186, 231], [204, 229], [214, 222], [210, 214], [203, 203]]);
  polygon(context, "#5b6252", [[210, 195], [217, 201], [223, 219], [219, 226], [214, 224], [217, 219], [209, 207], [207, 202]]);
  polygon(context, "#7f8267", [[213, 201], [216, 204], [220, 216], [219, 220], [217, 213], [211, 205]]);
  polygon(context, "#684b35", [[214, 224], [219, 229], [209, 235], [195, 239], [192, 233], [204, 231]]);
  polygon(context, "#a0784c", [[212, 225], [215, 227], [206, 232], [197, 234], [197, 232], [205, 230]]);
  pixels(context, "#c8a065", [[203, 232, 3, 3]]);
  polygon(context, skin.base, [[193, 231], [197, 233], [196, 239], [190, 242], [183, 240], [183, 235], [187, 232]]);
  polygon(context, skin.light, [[185, 234], [190, 233], [193, 235], [191, 238], [186, 238]]);
  pixels(context, skin.shadow, [[187, 238, 1, 3], [190, 237, 1, 4]]);
}

function drawEiraCup(context) {
  pixels(context, "#151f26", [[175, 233, 10, 16], [184, 236, 5, 2], [187, 238, 2, 6], [184, 244, 4, 2]]);
  pixels(context, "#8d9180", [[177, 235, 6, 11]]);
  pixels(context, "#ccc3a0", [[177, 235, 2, 10], [177, 234, 6, 2], [184, 237, 3, 1]]);
  pixels(context, "#525d56", [[181, 237, 2, 9]]);

}

function drawEiraHead(context) {
  const { hair, skin } = EIRA_PALETTE;
  // Neck, long hair behind the face, then the softly angled adult face.
  polygon(context, hair.shadow, [[174, 132], [187, 124], [201, 128], [211, 140], [214, 159], [211, 178], [215, 190], [206, 201], [197, 196], [177, 190], [167, 176], [167, 152]]);
  polygon(context, hair.base, [[175, 137], [189, 130], [201, 136], [207, 147], [209, 167], [204, 184], [208, 192], [201, 194], [177, 181], [171, 170], [171, 151]]);
  polygon(context, skin.shadow, [[182, 168], [195, 168], [196, 179], [193, 185], [185, 188], [179, 181]]);
  polygon(context, skin.base, [[182, 171], [191, 172], [192, 180], [185, 184], [181, 180]]);
  polygon(context, skin.light, [[182, 176], [185, 178], [190, 178], [188, 181], [184, 182], [181, 179]]);

  polygon(context, "#392d2c", [[180, 134], [195, 132], [202, 137], [205, 147], [206, 158], [202, 169], [196, 176], [189, 178], [181, 174], [175, 166], [172, 155], [173, 143]]);
  polygon(context, skin.base, [[180, 138], [194, 136], [200, 140], [202, 148], [202, 158], [199, 167], [194, 172], [188, 174], [182, 170], [178, 164], [175, 154], [177, 145]]);
  polygon(context, skin.shadow, [[195, 138], [200, 142], [201, 151], [202, 158], [198, 167], [194, 171], [190, 172], [192, 167], [194, 159], [192, 149]]);
  polygon(context, "#d9a272", [[179, 145], [186, 140], [191, 140], [191, 148], [187, 155], [189, 159], [186, 164], [180, 161], [177, 153]]);
  polygon(context, skin.light, [[178, 157], [182, 157], [185, 163], [190, 165], [193, 170], [188, 172], [183, 168], [179, 163]]);
  pixels(context, "#f2c38d", [[181, 162, 3, 2], [186, 169, 4, 2], [188, 158, 2, 3]]);
  // Eyelids are narrow; the whites do not become oversized cartoon eyes.
  polygon(context, "#614337", [[178, 148], [181, 146], [186, 147], [187, 148], [182, 148], [179, 149]]);
  polygon(context, "#513932", [[193, 146], [197, 145], [200, 147], [199, 148], [196, 147], [193, 148]]);
  pixels(context, "#5b4537", [[178, 151, 8, 1], [193, 150, 7, 1]]);
  pixels(context, "#e1c79e", [[180, 152, 6, 1], [194, 151, 5, 1]]);
  pixels(context, "#37514b", [[182, 151, 2, 3], [195, 150, 2, 3]]);
  pixels(context, "#1c3434", [[183, 152, 1, 2], [196, 151, 1, 2]]);
  pixels(context, "#edd0a2", [[182, 151, 1, 1], [195, 150, 1, 1]]);
  pixels(context, "#9e6d4e", [[188, 151, 1, 6], [190, 155, 1, 3], [187, 158, 4, 1]]);
  pixels(context, "#f0bd85", [[187, 155, 1, 3], [188, 157, 2, 1]]);
  // A small relaxed smile and cheek shading, not a floating facial icon.
  polygon(context, "#a16850", [[183, 164], [187, 163], [191, 163], [195, 161], [193, 165], [188, 167], [184, 166]]);
  pixels(context, "#784c3f", [[184, 164, 5, 1], [189, 163, 4, 1]]);
  pixels(context, "#e3a779", [[186, 166, 4, 1]]);
  pixels(context, "#bd855e", [[178, 157, 2, 1], [182, 156, 1, 1], [197, 156, 1, 1]]);

  // Side part, loose strands and an unmistakable braid over her right shoulder.
  polygon(context, hair.shadow, [[173, 140], [178, 131], [187, 127], [197, 129], [204, 135], [207, 145], [204, 149], [199, 143], [194, 137], [188, 137], [180, 143], [177, 151], [177, 160], [172, 160], [169, 153]]);
  polygon(context, hair.base, [[175, 140], [180, 133], [188, 130], [196, 132], [201, 138], [203, 143], [200, 141], [194, 134], [187, 135], [180, 140], [175, 150], [175, 156], [173, 154]]);
  polygon(context, hair.light, [[178, 138], [183, 134], [190, 132], [191, 134], [184, 137], [179, 143], [176, 149], [175, 145]]);
  pixels(context, "#c4965c", [[182, 135, 3, 1], [177, 143, 1, 4]]);
  polygon(context, "#80583b", [[197, 134], [200, 136], [205, 146], [207, 157], [205, 171], [202, 172], [204, 159], [202, 149]]);
  polygon(context, hair.shadow, [[201, 164], [208, 161], [211, 169], [207, 177], [211, 184], [210, 195], [207, 204], [204, 207], [201, 202], [202, 194], [198, 187], [201, 179], [198, 171]]);
  for (let i = 0; i < 5; i += 1) {
    const y = 166 + i * 7;
    const x = i % 2 ? 202 : 201;
    polygon(context, hair.base, [[x + 3, y], [x + 7, y + 3], [x + 5, y + 7], [x, y + 4], [x, y + 2]]);
    pixels(context, hair.light, [[x + 1, y + 2, 3, 1], [x + 3, y + 3, 2, 1]]);
    pixels(context, "#bc8e57", [[x + 1, y + 2, 1, 1]]);
  }
  pixels(context, "#b28d5c", [[203, 201, 5, 2]]);
  polygon(context, hair.base, [[204, 203], [207, 204], [207, 210], [203, 213], [204, 208]]);
  pixels(context, hair.light, [[205, 205, 1, 4]]);
  // A tiny brass earring is the last point of warm reflected light.
  pixels(context, "#dab16f", [[199, 165, 2, 3]]);
  pixels(context, "#f5d293", [[199, 165, 1, 1]]);
}

function drawEira(context) {
  drawEiraCape(context);
  drawEiraSeatedLegs(context);
  drawEiraTorso(context);
  drawEiraCollar(context);
  drawEiraSword(context, eiraSwordPose(0));
  drawEiraScabbard(context);
  drawEiraLeftArm(context);
  drawEiraRightArm(context);
  drawEiraCup(context);
  drawEiraHead(context);
}

function drawEiraProfileHead(context) {
  const { hair, skin } = EIRA_PALETTE;
  // A separately drawn three-quarter/profile pose turns her gaze into the trees.
  polygon(context, hair.shadow, [[175, 136], [182, 127], [194, 125], [204, 129], [211, 138], [213, 151], [210, 169], [206, 181], [207, 194], [197, 201], [179, 191], [169, 177], [168, 154]]);
  polygon(context, hair.base, [[177, 139], [184, 130], [194, 129], [203, 133], [208, 140], [209, 153], [205, 168], [201, 181], [203, 190], [196, 195], [181, 184], [174, 174], [173, 154]]);
  polygon(context, skin.shadow, [[184, 167], [197, 167], [197, 180], [192, 187], [183, 182], [180, 177]]);
  polygon(context, skin.base, [[187, 170], [195, 172], [193, 180], [189, 183], [183, 179]]);
  pixels(context, skin.light, [[184, 177, 3, 3], [188, 181, 3, 1]]);
  polygon(context, "#48312c", [[188, 135], [199, 134], [207, 139], [208, 148], [216, 155], [216, 158], [210, 159], [211, 162], [209, 164], [209, 169], [202, 176], [194, 177], [186, 171], [183, 158], [182, 148]]);
  polygon(context, skin.base, [[189, 139], [199, 137], [204, 141], [205, 149], [212, 155], [212, 157], [206, 158], [208, 161], [206, 164], [207, 168], [201, 172], [195, 174], [189, 168], [186, 157], [186, 148]]);
  polygon(context, skin.shadow, [[188, 145], [193, 143], [194, 150], [192, 157], [195, 167], [202, 171], [195, 173], [190, 168], [186, 158]]);
  polygon(context, skin.light, [[197, 154], [201, 157], [205, 159], [204, 164], [206, 168], [200, 171], [196, 168], [194, 163]]);
  pixels(context, "#f2bf87", [[198, 166, 3, 2], [207, 155, 5, 2], [201, 169, 2, 1]]);
  polygon(context, hair.shadow, [[198, 144], [204, 143], [207, 145], [207, 147], [203, 146], [199, 147]]);
  pixels(context, "#533d32", [[198, 149, 8, 1]]);
  pixels(context, "#ead0a5", [[199, 150, 7, 1]]);
  pixels(context, "#345149", [[203, 149, 2, 3]]);
  pixels(context, "#1d3333", [[204, 150, 1, 2]]);
  pixels(context, "#f2d6a7", [[203, 149, 1, 1]]);
  pixels(context, "#a77352", [[203, 154, 1, 3], [207, 158, 3, 1]]);
  pixels(context, "#754c40", [[204, 162, 5, 1]]);
  pixels(context, "#dd9e72", [[203, 164, 4, 1]]);
  polygon(context, hair.shadow, [[173, 143], [178, 133], [186, 128], [197, 128], [205, 133], [209, 140], [209, 145], [204, 142], [199, 137], [192, 138], [187, 145], [185, 157], [180, 162], [177, 160], [173, 154]]);
  polygon(context, hair.base, [[176, 143], [181, 136], [187, 132], [196, 131], [204, 136], [207, 141], [199, 135], [191, 136], [185, 144], [183, 155], [180, 158], [177, 153]]);
  polygon(context, hair.light, [[178, 141], [184, 135], [191, 132], [197, 133], [189, 136], [183, 143], [180, 151], [178, 151]]);
  pixels(context, "#c7995f", [[181, 139, 2, 2], [179, 146, 1, 4]]);
  polygon(context, skin.shadow, [[185, 155], [188, 154], [191, 156], [190, 162], [187, 165], [184, 161]]);
  pixels(context, skin.base, [[186, 156, 3, 5]]);
  pixels(context, skin.light, [[186, 156, 1, 3]]);
  pixels(context, "#d4aa67", [[188, 163, 2, 3]]);
  pixels(context, "#f3cf89", [[188, 163, 1, 1]]);
  polygon(context, hair.shadow, [[178, 160], [184, 161], [190, 168], [190, 177], [194, 185], [195, 194], [192, 204], [190, 208], [187, 204], [187, 195], [183, 187], [185, 180], [180, 174]]);
  for (let i = 0; i < 6; i += 1) {
    const y = 166 + i * 6;
    const x = 182 + Math.floor(i * 1.1);
    polygon(context, hair.base, [[x + 3, y], [x + 7, y + 3], [x + 5, y + 6], [x, y + 3]]);
    pixels(context, hair.light, [[x + 1, y + 2, 3, 1], [x + 3, y + 3, 2, 1]]);
  }
  pixels(context, "#b8955f", [[188, 202, 5, 2]]);
  polygon(context, hair.base, [[190, 205], [193, 205], [194, 211], [191, 214], [188, 212]]);
  pixels(context, hair.light, [[190, 206, 1, 5]]);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothRange(value, start, end) {
  const x = clamp01((value - start) / (end - start));
  return x * x * (3 - 2 * x);
}

function mixPoint(a, b, amount) {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount];
}

export function limb(context, from, to, widthFrom, widthTo, colors) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / length;
  const ny = dx / length;
  const points = (a, b) => [
    [from[0] + nx * a, from[1] + ny * a], [to[0] + nx * b, to[1] + ny * b],
    [to[0] - nx * b, to[1] - ny * b], [from[0] - nx * a, from[1] - ny * a],
  ];
  polygon(context, INK, points(widthFrom + 2, widthTo + 2));
  polygon(context, colors.shadow, points(widthFrom, widthTo));
  polygon(context, colors.base, [
    [from[0] + nx * widthFrom * 0.6, from[1] + ny * widthFrom * 0.6],
    [to[0] + nx * widthTo * 0.65, to[1] + ny * widthTo * 0.65],
    [to[0] - nx * widthTo * 0.42, to[1] - ny * widthTo * 0.42],
    [from[0] - nx * widthFrom * 0.38, from[1] - ny * widthFrom * 0.38],
  ]);
  polygon(context, colors.light, [
    [from[0] + nx * widthFrom * 0.48, from[1] + ny * widthFrom * 0.48],
    [to[0] + nx * widthTo * 0.6, to[1] + ny * widthTo * 0.6],
    [to[0] + nx * widthTo * 0.12, to[1] + ny * widthTo * 0.12],
    [from[0] + nx * widthFrom * 0.16, from[1] + ny * widthFrom * 0.16],
  ]);
}

export function animatedHand(context, position, grip = false) {
  const [x, y] = position;
  const { skin } = EIRA_PALETTE;
  polygon(context, INK, [[x - 5, y - 6], [x + 2, y - 7], [x + 7, y - 2], [x + 6, y + 4], [x + 1, y + 7], [x - 5, y + 3]]);
  polygon(context, skin.shadow, [[x - 4, y - 4], [x + 1, y - 5], [x + 5, y - 1], [x + 4, y + 3], [x, y + 5], [x - 4, y + 2]]);
  polygon(context, skin.base, [[x - 3, y - 3], [x, y - 4], [x + 3, y - 1], [x + 2, y + 2], [x - 2, y + 3]]);
  pixels(context, skin.light, [[x - 3, y - 3, 2, 4], [x - 1, y - 3, 3, 1]]);
  pixels(context, skin.shadow, [[x + 1, y, 1, 3], [x + 3, y - 1, 1, 3]]);
  if (grip) pixels(context, "#76513a", [[x - 1, y + 1, 5, 1]]);
}

export function articulatedArm(context, shoulder, elbow, wrist, grip = false) {
  const sleeve = { shadow: "#495449", base: "#656755", light: "#929077" };
  const bracer = { shadow: "#573e30", base: "#75533b", light: "#ad8554" };
  limb(context, shoulder, elbow, 7, 5, sleeve);
  const bareWrist = mixPoint(elbow, wrist, 0.84);
  limb(context, elbow, bareWrist, 5, 3, bracer);
  limb(context, mixPoint(elbow, wrist, 0.83), wrist, 3, 3, EIRA_PALETTE.skin);
  const buckle = mixPoint(elbow, wrist, 0.34);
  pixels(context, "#c39c61", [[buckle[0] - 1, buckle[1] - 1, 3, 2]]);
  animatedHand(context, wrist, grip);
}

function standingLegs(context, rise, ready, bodyX, bodyY) {
  const cloth = { shadow: "#343c36", base: "#5c5544", light: "#807054" };
  const boot = { shadow: "#3b3129", base: "#614833", light: "#a17b4c" };
  const leftHip = [175 + bodyX, 234 + bodyY];
  const rightHip = [198 + bodyX, 234 + bodyY];
  const leftKnee = mixPoint([150, 251], [174 - ready * 5, 223], rise);
  const leftAnkle = mixPoint([133, 272], [162 - ready * 7, 278], rise);
  const rightKnee = mixPoint([217, 251], [218 + ready * 5, 225], rise);
  const rightAnkle = mixPoint([234, 273], [229 + ready * 6, 279], rise);
  for (const [hip, knee, ankle, side] of [[rightHip, rightKnee, rightAnkle, 1], [leftHip, leftKnee, leftAnkle, -1]]) {
    limb(context, hip, knee, 11, 7, cloth);
    limb(context, knee, ankle, 7, 5, cloth);
    const bootTop = mixPoint(knee, ankle, 0.48);
    limb(context, bootTop, ankle, 7, 6, boot);
    const [x, y] = ankle;
    polygon(context, INK, [[x - 7, y - 4], [x + 6, y - 4], [x + 8 + side * 5, y + 4], [x + 8 + side * 5, y + 11], [x - 10 + side * 5, y + 11], [x - 9, y + 5]]);
    polygon(context, boot.base, [[x - 5, y - 3], [x + 4, y - 3], [x + 6 + side * 4, y + 5], [x + 6 + side * 4, y + 8], [x - 7 + side * 4, y + 8], [x - 6, y + 4]]);
    pixels(context, boot.light, [[x - 4, y + 4, 9, 2], [bootTop[0] - 3, bootTop[1] + 4, 5, 2]]);
    pixels(context, "#c2a068", [[bootTop[0], bootTop[1] + 4, 2, 3]]);
  }
  // A split leather-and-cloth skirt follows the moving hips above the legs.
  polygon(context, "#514532", [[165 + bodyX, 230 + bodyY], [203 + bodyX, 230 + bodyY], [207 + bodyX, 248 + bodyY], [194 + bodyX, 252 + bodyY], [184 + bodyX, 244 + bodyY], [175 + bodyX, 252 + bodyY], [160 + bodyX, 245 + bodyY]]);
  polygon(context, "#87704a", [[168 + bodyX, 233 + bodyY], [181 + bodyX, 233 + bodyY], [179 + bodyX, 242 + bodyY], [172 + bodyX, 248 + bodyY], [164 + bodyX, 244 + bodyY]]);
  pixels(context, "#ae8f5e", [[166 + bodyX, 244 + bodyY, 7, 1]]);
}

export function drawEiraSword(context, { grip: [x, y], angle }) {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const vx = -uy;
  const vy = ux;
  const point = (along, across) => [x + ux * along + vx * across, y + uy * along + vy * across];
  const tip = EIRA_SWORD.bladeTip;
  polygon(context, INK, [point(-8, -3), point(-8, 3), point(5, 3), point(5, 10), point(10, 10), point(10, 4), point(tip - 8, 4), point(tip, 0), point(tip - 8, -4), point(10, -4), point(10, -10), point(5, -10), point(5, -3)]);
  polygon(context, "#755039", [point(-5, -2), point(-5, 2), point(6, 2), point(6, -2)]);
  polygon(context, "#d0aa69", [point(6, -8), point(6, 8), point(9, 8), point(9, -8)]);
  polygon(context, "#9c835b", [point(-7, -3), point(-7, 3), point(-4, 3), point(-4, -3)]);
  polygon(context, "#668a9b", [point(11, -2), point(11, 2), point(tip - 8, 2), point(tip - 2, 0), point(tip - 8, -2)]);
  polygon(context, "#d0d7bc", [point(11, -2), point(11, 0), point(tip - 2, 0), point(tip - 8, -2)]);
  polygon(context, "#f4dfaa", [point(12, -2), point(12, -1), point(tip - 9, -1), point(tip - 9, -2)]);
}

export function drawEiraScabbard(context) {
  const [x, y] = EIRA_SWORD.mouth;
  const ux = Math.cos(EIRA_SWORD.sheathAngle);
  const uy = Math.sin(EIRA_SWORD.sheathAngle);
  const point = (along, across) => [x + ux * along - uy * across, y + uy * along + ux * across];
  const end = EIRA_SWORD.sheathLength;
  // Belt hanger, leather body, brass mouth and chape. Draw over the entire
  // sword so the tip cannot appear until it physically clears this mouth.
  polygon(context, "#382f27", [[164, 231], [171, 228], [178, 230], [175, 241], [170, 239], [172, 233], [165, 236]]);
  polygon(context, INK, [point(-1, -5), point(-1, 5), point(end - 3, 5), point(end + 2, 1), point(end, -3), point(end - 3, -5)]);
  polygon(context, "#423f35", [point(2, -3), point(2, 3), point(end - 4, 3), point(end, 0), point(end - 4, -3)]);
  polygon(context, "#726448", [point(3, -3), point(3, -1), point(end - 5, -1), point(end - 5, -3)]);
  polygon(context, "#b59158", [point(0, -5), point(0, 5), point(3, 5), point(3, -5)]);
  polygon(context, "#d4b576", [point(0, -5), point(0, 4), point(1, 4), point(1, -5)]);
  polygon(context, "#8b7958", [point(end - 6, -4), point(end - 6, 4), point(end - 2, 4), point(end + 1, 0), point(end - 2, -3)]);
}

export function createEiraLayers(ownerDocument, names = null) {
  const definitions = {
    cape: drawEiraCape,
    legs: drawEiraSeatedLegs,
    torso: drawEiraTorso,
    collar: drawEiraCollar,
    leftArm: drawEiraLeftArm,
    rightArm: drawEiraRightArm,
    cup: drawEiraCup,
    head: drawEiraHead,
    profile: drawEiraProfileHead,
  };
  return Object.fromEntries(Object.entries(definitions).filter(([name]) => !names || names.includes(name)).map(([name, draw]) => {
    const layer = ownerDocument.createElement("canvas");
    layer.width = WIDTH;
    layer.height = HEIGHT;
    const context = layer.getContext("2d");
    if (context) draw(context);
    return [name, layer];
  }));
}

function drawEiraCinematic(context, layers, elapsed, reducedMotion) {
  const look = smoothRange(elapsed, 2.08, 3.22);
  const place = smoothRange(elapsed, 4.0, 4.85);
  const rise = smoothRange(elapsed, 5.0, 6.35);
  const sword = eiraSwordPose(elapsed);
  const ready = smoothRange(elapsed, 7.0, 8.0);
  const startled = reducedMotion ? 0 : Math.sin(clamp01((elapsed - 1.9) / 0.34) * Math.PI);
  const lean = Math.sin(rise * Math.PI);
  const bodyX = Math.round(rise * 11 + lean * 7 - startled * 2);
  const bodyY = Math.round(-rise * 61 + lean * 3 - startled * 3);
  // Her weight comes forward off the log as she stands. Move the complete
  // articulated actor together so the feet land on the clearing, below it.
  const groundAdvance = Math.round(rise * 14);
  context.save();
  context.translate(0, groundAdvance);
  const layer = (name, x = bodyX, y = bodyY, alpha = 1) => {
    if (alpha <= 0) return;
    context.save();
    context.globalAlpha = alpha;
    context.drawImage(layers[name], Math.round(x), Math.round(y));
    context.restore();
  };
  // The cape lengthens independently of the torso as its folds drop behind her.
  context.save();
  context.translate(bodyX, 174 + bodyY);
  context.scale(1 - rise * 0.06, 1 + rise * 0.42);
  context.translate(rise * 10, -174);
  context.drawImage(layers.cape, 0, 0);
  context.restore();
  const unseat = smoothRange(rise, 0, 0.2);
  layer("legs", 0, 0, 1 - unseat);
  if (unseat > 0) {
    context.save();
    context.globalAlpha = unseat;
    standingLegs(context, rise, ready, bodyX, bodyY);
    context.restore();
  }
  layer("torso");
  layer("collar");
  const heldSword = sword.reach === 1;
  context.save();
  context.translate(bodyX, bodyY);
  if (!heldSword) drawEiraSword(context, sword);
  drawEiraScabbard(context);
  context.restore();

  // The left arm braces against the knee while the right sets the cup down.
  const leftDynamic = smoothRange(rise, 0, 0.2);
  let leftWrist;
  const leftGrip = sword.support > .8 && sword.release < .2;
  layer("leftArm", bodyX, bodyY, 1 - leftDynamic);
  if (leftDynamic > 0) {
    const shoulder = [155 + bodyX, 196 + bodyY];
    const support = [EIRA_SWORD.mouth[0] + Math.cos(EIRA_SWORD.sheathAngle) * 7 + bodyX, EIRA_SWORD.mouth[1] + Math.sin(EIRA_SWORD.sheathAngle) * 7 + bodyY];
    const bracedWrist = mixPoint([162 + bodyX, 247 + bodyY], support, sword.support);
    const wrist = mixPoint(bracedWrist, [192 + bodyX, 206 + bodyY], sword.release);
    leftWrist = wrist;
    const elbow = eiraElbow(shoulder, wrist, -1);
    context.save();
    context.globalAlpha = leftDynamic;
    articulatedArm(context, shoulder, elbow, wrist, leftGrip);
    context.restore();
  }
  const rightDynamic = smoothRange(place, 0, 0.2);
  layer("rightArm", bodyX, bodyY, 1 - rightDynamic);
  const putWrist = mixPoint([190, 237], [248, 247], place);
  const risingWrist = mixPoint(putWrist, [180 + bodyX, 229 + bodyY], rise);
  const rightWrist = mixPoint(risingWrist, [sword.grip[0] + bodyX, sword.grip[1] + bodyY], sword.reach);
  if (rightDynamic > 0) {
    const initialElbow = mixPoint([220, 224], [237, 222], place);
    const shoulder = [214 + bodyX, 199 + bodyY];
    const rightElbow = mixPoint(initialElbow, eiraElbow(shoulder, rightWrist), rise);
    context.save();
    context.globalAlpha = rightDynamic;
    articulatedArm(context, shoulder, rightElbow, rightWrist, sword.reach > .98);
    context.restore();
  }
  if (heldSword) {
    // Once gripped, the rigid blade swings in front of the forearm. Only
    // the scabbard and closed fingers cover it, never the sleeve or bracer.
    context.save();
    context.translate(bodyX, bodyY);
    drawEiraSword(context, sword);
    drawEiraScabbard(context);
    context.restore();
    if (leftWrist) animatedHand(context, leftWrist, leftGrip);
    animatedHand(context, rightWrist, true);
  }
  // The cup is a separate prop: it stays on the log when her hand lets go.
  layer("cup", 58 * place + (place === 0 ? bodyX : 0), 10 * place + (place === 0 ? bodyY : 0) - groundAdvance);
  context.save();
  context.translate(bodyX + Math.round(look * 3), bodyY - Math.round(startled * 3 + look));
  context.translate(188, 177);
  context.rotate(reducedMotion ? 0 : -startled * 0.075);
  context.translate(-188, -177);
  // The quick head turn blends two actual pixel poses, not a mirrored face.
  const profile = smoothRange(look, 0.35, 0.8);
  if (profile < 1) {
    context.globalAlpha = 1 - profile;
    context.drawImage(layers.head, 0, 0);
  }
  if (profile > 0) {
    context.globalAlpha = profile;
    context.drawImage(layers.profile, 0, 0);
  }
  context.restore();
  context.restore();
}

function fireplace(context) {
  polygon(context, "#2d2b25", [[145, 330], [164, 322], [197, 323], [217, 333], [219, 349], [206, 360], [167, 365], [143, 354], [138, 341]]);
  polygon(context, "#48382b", [[149, 331], [168, 326], [195, 327], [211, 336], [212, 348], [199, 356], [168, 358], [148, 350], [144, 341]]);
  polygon(context, "#242526", [[153, 335], [166, 329], [195, 331], [206, 339], [204, 349], [192, 354], [168, 351], [152, 346]]);
  for (const [x, y, size] of [[144, 341, 10], [151, 330, 8], [169, 324, 7], [197, 327, 9], [214, 336, 9]]) {
    stone(context, x, y, size, true);
  }
  // Crossed wood with bark cuts and glowing, split ends.
  polygon(context, "#151f22", [[151, 340], [156, 334], [205, 348], [209, 355], [202, 361], [152, 347]]);
  polygon(context, "#64432b", [[155, 336], [201, 349], [205, 354], [201, 357], [155, 345], [153, 340]]);
  polygon(context, "#916035", [[156, 337], [196, 348], [198, 351], [156, 341]]);
  polygon(context, "#b87d3e", [[199, 351], [203, 352], [204, 355], [201, 357], [198, 354]]);
  pixels(context, "#3a2f25", [[165, 342, 8, 2], [180, 346, 5, 1]]);
  polygon(context, "#182125", [[154, 352], [199, 332], [207, 335], [207, 342], [160, 362], [153, 359]]);
  polygon(context, "#6d482c", [[156, 353], [198, 335], [204, 337], [203, 340], [160, 358], [156, 357]]);
  polygon(context, "#a16836", [[159, 352], [197, 336], [200, 337], [169, 352], [160, 356], [157, 355]]);
  pixels(context, "#df9446", [[161, 352, 4, 2], [186, 341, 4, 2], [195, 337, 3, 1]]);
  pixels(context, "#d57633", [[173, 348, 3, 2], [180, 351, 2, 2], [192, 347, 4, 2], [170, 337, 3, 1]]);
  pixels(context, "#f1b25c", [[178, 348, 2, 1], [192, 347, 2, 1]]);
  for (const [x, y, size] of [[150, 355, 10], [170, 365, 12], [193, 365, 10], [211, 355, 10]]) {
    stone(context, x, y, size, true);
  }
}

function createBackground(ownerDocument, includeEira = true) {
  const canvas = ownerDocument.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const random = randomSource(849270);
  // Quiet navy sky leaves the first 50 pixels clear for the in-game toolbar.
  for (let y = 0; y < HEIGHT; y += 3) {
    const d = Math.min(1, y / 230);
    pixels(context, `rgb(${Math.round(7 + d * 16)},${Math.round(16 + d * 28)},${Math.round(31 + d * 29)})`, [[0, y, WIDTH, 3]]);
  }
  for (let i = 0; i < 72; i += 1) {
    const x = Math.floor(random() * WIDTH);
    const y = 46 + Math.floor(random() * 135);
    pixels(context, i % 7 === 0 ? "#adc7c3" : "#668ba3", [[x, y, i % 11 === 0 ? 2 : 1, 1]]);
  }
  polygon(context, "#1c3850", [[113, 60], [139, 60], [139, 67], [146, 67], [146, 84], [139, 84], [139, 91], [113, 91], [113, 85], [106, 85], [106, 67], [113, 67]]);
  polygon(context, "#aec2ba", [[119, 65], [133, 65], [133, 68], [139, 68], [139, 79], [135, 79], [135, 84], [120, 84], [120, 81], [115, 81], [115, 70], [119, 70]]);
  polygon(context, "#213d51", [[115, 63], [126, 63], [126, 70], [123, 70], [123, 77], [120, 77], [120, 81], [114, 81]]);
  pixels(context, "#849e9e", [[130, 75, 3, 3], [127, 68, 2, 2]]);
  polygon(context, "#24475a", [[0, 173], [35, 151], [66, 170], [102, 155], [132, 171], [166, 158], [207, 171], [245, 156], [285, 169], [319, 151], [360, 174], [360, 274], [0, 274]]);
  for (let i = 0; i < 26; i += 1) {
    pine(context, i * 15 - 10, 248 + random() * 9, 46 + random() * 70, ["#183446", "#1c4051", "#285263"], i + 32);
  }
  polygon(context, "#315465", [[0, 237], [51, 229], [96, 235], [143, 227], [184, 232], [233, 227], [277, 235], [322, 228], [360, 232], [360, 263], [0, 263]]);
  for (const [x, height] of [[10, 165], [43, 181], [80, 146], [113, 113], [256, 141], [285, 184], [321, 178], [354, 209]]) {
    pine(context, x, 270, height, ["#122a39", "#14323f", "#1e4350", "#2b5260"], x + 63);
  }
  polygon(context, "#213e46", [[0, 261], [48, 249], [93, 256], [130, 246], [172, 251], [216, 244], [267, 254], [310, 246], [360, 253], [360, 600], [0, 600]]);
  polygon(context, "#344443", [[74, 278], [120, 257], [171, 252], [223, 254], [274, 277], [308, 312], [335, 366], [360, 414], [360, 600], [0, 600], [0, 404], [37, 328]]);
  polygon(context, "#514d3d", [[106, 293], [145, 274], [188, 273], [236, 290], [269, 320], [282, 348], [271, 379], [237, 402], [165, 411], [105, 391], [77, 359], [84, 319]]);
  polygon(context, "#62533a", [[137, 311], [175, 294], [214, 306], [246, 331], [251, 356], [229, 376], [182, 388], [136, 375], [113, 347], [121, 327]]);
  // Texture is seeded and becomes larger with depth, reinforcing the viewpoint.
  for (let i = 0; i < 820; i += 1) {
    const y = 257 + Math.floor(random() * 343);
    const x = Math.floor(random() * WIDTH);
    const near = (y - 250) / 350;
    const warm = y > 280 && y < 393 && Math.abs(x - 180) < 50 + (y - 280) * 0.7;
    const colors = warm ? ["#766242", "#504d3a", "#8b7049", "#3b4037"] : ["#314543", "#253b3e", "#46534a", "#1d343c"];
    pixels(context, colors[i % colors.length], [[x, y, 1 + random() * (2 + near * 5), 1 + Math.floor(near * 2)]]);
  }
  pine(context, 0, 318, 339, ["#0a1927", "#0a1d2c", "#123340", "#1d4150"], 272);
  pine(context, 348, 319, 362, ["#081724", "#0b202d", "#173541", "#244b52"], 374);
  // Fire-facing trunks are warm on the inside and blue toward the moon.
  polygon(context, "#112630", [[28, 173], [34, 170], [43, 310], [52, 323], [33, 325], [26, 318], [31, 299]]);
  polygon(context, "#62523a", [[34, 237], [38, 261], [39, 300], [46, 316], [42, 319], [36, 305]]);
  pixels(context, "#897044", [[37, 287, 1, 14], [39, 310, 2, 6]]);
  polygon(context, "#122930", [[319, 211], [325, 205], [328, 297], [340, 319], [314, 320], [316, 308]]);
  polygon(context, "#5c5138", [[320, 259], [322, 260], [322, 299], [319, 313], [315, 317], [317, 302]]);
  pixels(context, "#857047", [[319, 285, 1, 14]]);
  campSupplies(context);
  fallenLog(context);
  if (includeEira) drawEira(context);
  fireplace(context);
  for (const [x, y, size] of [[60, 344, 15], [306, 338, 13], [92, 394, 9], [288, 402, 19], [24, 435, 18], [325, 478, 26]]) {
    stone(context, x, y, size, y < 410);
  }
  // A few fern fronds and fallen needles border the clearing.
  for (let i = 0; i < 65; i += 1) {
    const x = Math.floor(random() * WIDTH);
    const y = 279 + Math.floor(random() * 219);
    if (x > 89 && x < 281 && y < 390) continue;
    const size = 4 + random() * 7;
    polygon(context, i % 4 === 0 ? "#617150" : "#233d3d", [[x, y], [x - 4, y - size], [x - 1, y - 3], [x + 1, y - size - 2], [x + 2, y - 4], [x + 6, y - size + 1], [x + 3, y]]);
  }
  // A quiet lower vignette sits behind the dialogue area.
  for (let y = 430; y < HEIGHT; y += 4) {
    context.globalAlpha = Math.min(0.72, (y - 430) / 210);
    pixels(context, "#09151f", [[0, y, WIDTH, 4]]);
  }
  context.globalAlpha = 1;
  return canvas;
}

function flames(context, time, reducedMotion) {
  const phase = reducedMotion ? 0.7 : time;
  const sway = Math.round(Math.sin(phase * 3.1) * 3);
  const lick = Math.round(Math.sin(phase * 5.7 + 0.8) * 3);
  const lift = Math.round(Math.sin(phase * 4.3) * 4);
  // Broad dull-red flame behind amber tongues, then a tiny white-hot core.
  polygon(context, "#a64c26", [
    [158, 343], [154, 334], [156, 324], [152, 319], [157, 320], [164, 328],
    [165, 313], [172 + sway, 303], [174 + sway, 293 + lift], [180 + sway, 303],
    [179, 316], [186, 312], [190 + lick, 300], [194 + lick, 291 - lift],
    [193 + lick, 308], [200, 321], [202, 333], [205, 327], [207, 338],
    [201, 349], [188, 351], [173, 350],
  ]);
  polygon(context, "#d9732d", [
    [162, 343], [159, 335], [161, 329], [165, 334], [169, 325],
    [170, 316], [175 + sway, 307], [176, 320], [174, 328], [181, 329],
    [186, 320], [188 + lick, 309], [191 + lick, 303 - lift], [190, 317],
    [194, 325], [195, 336], [200, 331], [201, 340], [195, 347], [181, 349],
  ]);
  polygon(context, "#f2a13e", [
    [166, 343], [164, 337], [166, 332], [168, 337], [173, 334],
    [174, 325], [180 + sway, 315 + lift], [180, 329], [184, 332],
    [188, 325], [188 + lick, 318], [191, 327], [191, 339], [195, 337],
    [193, 344], [184, 347], [175, 346],
  ]);
  polygon(context, "#ffd16a", [[171, 343], [171, 338], [175, 332], [176, 325 + lift], [179, 333], [180, 339], [184, 337], [187, 330], [188, 339], [187, 345], [180, 346]]);
  polygon(context, "#fff0b5", [[176, 343], [176, 338], [179, 333], [180, 341], [184, 340], [183, 345], [178, 345]]);
  pixels(context, "#ffcb5b", [[165, 349, 3, 1], [195, 350, 2, 1], [179, 352, 3, 1]]);
  if (reducedMotion) return;
  // Slow sparks rise away from Eira's face, with no flashing or screen shake.
  for (let i = 0; i < 7; i += 1) {
    const travel = ((time * (0.15 + i * 0.009) + i * 0.143) % 1 + 1) % 1;
    const x = Math.round(168 + (i % 4) * 7 + Math.sin(time * 1.4 + i * 2) * (3 + travel * 5));
    const y = Math.round(328 - travel * (51 + i * 4));
    const color = travel < 0.2 ? "#f5c268" : travel < 0.6 ? "#da9149" : "#92673f";
    pixels(context, color, [[x, y, 1, travel < 0.6 && i % 2 === 0 ? 2 : 1]]);
  }
}

export function drawCampForeground(context, appearance, palette) {
  const { cloth, skin, leather, metal } = palette;
  // Seated first-person knees enter from both sides, leaving the fire visible.
  polygon(context, "#08151f", [[0, 389], [18, 378], [49, 378], [72, 395], [83, 424], [94, 463], [79, 510], [0, 534]]);
  polygon(context, cloth.shadow, [[0, 397], [21, 386], [46, 386], [65, 401], [75, 426], [83, 463], [70, 501], [0, 519]]);
  polygon(context, cloth.base, [[8, 393], [24, 389], [45, 390], [59, 403], [65, 423], [53, 433], [35, 421], [0, 416], [0, 399]]);
  polygon(context, cloth.light, [[20, 390], [34, 390], [49, 397], [54, 406], [49, 405], [40, 398], [19, 396], [8, 400]]);
  polygon(context, "#172b2f", [[0, 421], [32, 429], [50, 442], [55, 464], [41, 490], [0, 503]]);
  polygon(context, "#08151f", [[360, 386], [341, 377], [314, 382], [294, 399], [283, 425], [272, 463], [286, 510], [360, 532]]);
  polygon(context, cloth.shadow, [[360, 394], [341, 386], [316, 390], [301, 404], [291, 429], [281, 462], [293, 502], [360, 518]]);
  polygon(context, cloth.base, [[356, 391], [341, 390], [319, 394], [306, 406], [301, 423], [309, 432], [333, 421], [360, 418]]);
  polygon(context, cloth.light, [[340, 391], [322, 396], [312, 406], [313, 410], [324, 402], [339, 397], [351, 398]]);

  // Resting hands visibly carry the saved skin tone, sleeves and bracers.
  polygon(context, "#0a1720", [[0, 417], [18, 408], [34, 403], [48, 392], [62, 387], [75, 391], [89, 398], [94, 405], [90, 411], [75, 409], [66, 417], [51, 421], [40, 429], [15, 445], [0, 449]]);
  polygon(context, skin.shadow, [[33, 408], [47, 399], [60, 392], [70, 393], [85, 400], [90, 405], [88, 407], [76, 404], [66, 412], [51, 415], [40, 423]]);
  polygon(context, skin.base, [[43, 405], [51, 399], [61, 395], [70, 396], [82, 401], [81, 404], [73, 402], [65, 407], [52, 411], [46, 415]]);
  polygon(context, skin.light, [[49, 402], [61, 396], [68, 397], [72, 399], [68, 401], [59, 400], [51, 405]]);
  polygon(context, skin.base, [[53, 410], [61, 407], [66, 409], [65, 413], [58, 417], [52, 417], [50, 414]]);
  pixels(context, skin.shadow, [[63, 398, 1, 3], [69, 400, 1, 3], [75, 401, 1, 3], [61, 410, 3, 1]]);
  polygon(context, leather.shadow, [[0, 418], [27, 407], [35, 408], [45, 423], [35, 432], [0, 449]]);
  polygon(context, leather.base, [[5, 418], [27, 411], [33, 412], [37, 423], [25, 431], [0, 441], [0, 427]]);
  polygon(context, leather.light, [[9, 417], [25, 413], [29, 414], [27, 417], [12, 422], [2, 427], [0, 424]]);
  polygon(context, "#b9975d", [[20, 413], [24, 412], [34, 429], [30, 432]]);
  pixels(context, "#dfbd7a", [[26, 420, 4, 3]]);

  polygon(context, "#0a1720", [[360, 420], [341, 410], [326, 403], [312, 393], [299, 388], [289, 392], [275, 401], [272, 408], [278, 413], [288, 408], [300, 417], [315, 422], [337, 440], [360, 450]]);
  polygon(context, skin.shadow, [[324, 409], [311, 399], [300, 393], [291, 395], [279, 402], [277, 407], [279, 408], [290, 403], [300, 411], [313, 416], [321, 424]]);
  polygon(context, skin.base, [[316, 407], [308, 401], [300, 396], [293, 398], [284, 403], [288, 404], [295, 403], [301, 408], [311, 412]]);
  polygon(context, skin.light, [[308, 402], [300, 397], [296, 398], [299, 401], [307, 405]]);
  polygon(context, skin.base, [[312, 411], [303, 408], [299, 411], [302, 416], [309, 419], [314, 417]]);
  pixels(context, skin.shadow, [[297, 399, 1, 3], [291, 401, 1, 3], [305, 412, 3, 1]]);
  polygon(context, leather.shadow, [[360, 420], [334, 408], [326, 408], [317, 424], [331, 436], [360, 451]]);
  polygon(context, leather.base, [[357, 420], [335, 412], [329, 413], [324, 424], [336, 433], [360, 444]]);
  polygon(context, leather.light, [[353, 419], [337, 414], [331, 415], [335, 419], [350, 423], [360, 430], [360, 424]]);
  polygon(context, "#b9975d", [[337, 413], [341, 415], [330, 433], [326, 431]]);
  pixels(context, "#dfbd7a", [[331, 421, 4, 3]]);
  if (appearance.outfit === "knight") {
    polygon(context, metal.shadow, [[5, 418], [23, 411], [30, 414], [40, 427], [27, 438], [5, 446], [0, 440]]);
    polygon(context, metal.base, [[7, 419], [22, 414], [27, 416], [32, 426], [24, 433], [5, 440], [2, 437]]);
    polygon(context, metal.light, [[9, 418], [21, 415], [25, 417], [23, 420], [11, 424], [3, 430], [2, 426]]);
    polygon(context, metal.shadow, [[355, 420], [337, 412], [331, 414], [321, 427], [333, 438], [356, 447], [360, 441]]);
    polygon(context, metal.base, [[353, 421], [338, 415], [333, 417], [327, 426], [335, 433], [355, 441], [358, 437]]);
    polygon(context, metal.light, [[351, 421], [340, 417], [335, 418], [338, 421], [350, 426], [357, 431], [358, 428]]);
  }
}

const playerForeground = drawCampForeground;
export { drawEira as drawSeatedEira, campSupplies as drawCampSupplies, fallenLog as drawCampLog, fireplace as drawFireplace, flames as drawCampFlames, pine as drawForestPine };

/** First-person camp interlude. The game owns animation timing and dialogue. */
export function createCampRenderer(canvas) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Camp canvas is unavailable");
  const background = createBackground(canvas.ownerDocument);
  let cinematicBackground = null;
  let eiraLayers = null;
  const foreground = canvas.ownerDocument.createElement("canvas");
  foreground.width = WIDTH;
  foreground.height = HEIGHT;
  const foregroundContext = foreground.getContext("2d");
  if (!foregroundContext) throw new Error("Camp foreground canvas is unavailable");
  let previousAppearance = null;
  let destroyed = false;

  return {
    render(state = {}, time = 0, reducedMotion = false, daylight = 0) {
      if (destroyed || !context || !foregroundContext) return;
      const daylightAmount = Number.isFinite(daylight) ? Math.max(0, Math.min(1, daylight)) : 0;
      const appearance = normalizeAppearance(state.appearance);
      const appearanceKey = JSON.stringify(appearance);
      if (appearanceKey !== previousAppearance) {
        foregroundContext.clearRect(0, 0, WIDTH, HEIGHT);
        playerForeground(foregroundContext, appearance, getAppearancePalette(appearance));
        previousAppearance = appearanceKey;
      }
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const elapsed = state.scene === "cinematic" && Number.isFinite(state.cinematic?.elapsed)
        ? Math.max(0, Math.min(18, state.cinematic.elapsed))
        : 0;
      if (elapsed > 1.9) {
        if (!cinematicBackground) cinematicBackground = createBackground(canvas.ownerDocument, false);
        if (!eiraLayers) eiraLayers = createEiraLayers(canvas.ownerDocument);
        context.drawImage(cinematicBackground, 0, 0);
        drawEiraCinematic(context, eiraLayers, elapsed, reducedMotion);
      } else {
        // The opening frame is exactly the same cached camp image as gameplay.
        context.drawImage(background, 0, 0);
      }
      // Subtle stepped light pool breathes with the fire; no blur or bloom.
      const phase = Number.isFinite(time) ? time : 0;
      const light = reducedMotion ? 0.04 : 0.035 + Math.sin(phase * 3.1) * 0.009 + Math.sin(phase * 5.7) * 0.004;
      context.globalAlpha = light * (1 - daylightAmount);
      polygon(context, "#ffc773", [[119, 302], [140, 286], [172, 281], [204, 286], [236, 304], [250, 329], [250, 357], [234, 377], [205, 390], [156, 390], [124, 375], [110, 351], [109, 327]]);
      context.globalAlpha = 1;
      if (daylightAmount < 1) {
        context.globalAlpha = 1 - daylightAmount;
        flames(context, phase, reducedMotion);
        context.globalAlpha = 1;
      }
      const playerRise = smoothRange(elapsed, 5.0, 6.5);
      context.drawImage(foreground, 0, Math.round(playerRise * 225));
      if (daylightAmount > 0) {
        // Morning relights the same campsite; actors and props keep their seats.
        context.globalAlpha = daylightAmount * 0.2;
        pixels(context, "#e0bc86", [[0, 0, WIDTH, HEIGHT]]);
        for (let y = 0; y < 270; y += 3) {
          context.globalAlpha = daylightAmount * 0.44 * (1 - y / 270);
          pixels(context, y < 140 ? "#a4afb0" : "#d4ba99", [[0, y, WIDTH, 3]]);
        }
        context.globalAlpha = 1;
      }
    },
    destroy() {
      destroyed = true;
      previousAppearance = null;
      background.width = 0;
      foreground.width = 0;
      if (cinematicBackground) cinematicBackground.width = 0;
      if (eiraLayers) Object.values(eiraLayers).forEach((layer) => { layer.width = 0; });
      cinematicBackground = null;
      eiraLayers = null;
    },
  };
}
