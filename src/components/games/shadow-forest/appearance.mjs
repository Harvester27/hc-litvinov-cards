// Cosmetic identifiers are deliberately separate from colors and combat stats.
// Save files contain only these identifiers, so every view uses the same hero.
const options = {
  skin: [
    { id: "fair", label: "Světlá", color: "#e8b28a" },
    { id: "tan", label: "Zlatavá", color: "#bc8258" },
    { id: "brown", label: "Snědá", color: "#8e5940" },
    { id: "deep", label: "Tmavá", color: "#593b32" },
  ],
  face: [
    { id: "steady", label: "Odhodlaná" },
    { id: "angular", label: "Ostré rysy" },
    { id: "soft", label: "Jemné rysy" },
  ],
  hairStyle: [
    { id: "cropped", label: "Krátké" },
    { id: "swept", label: "Na stranu" },
    { id: "long", label: "Dlouhé" },
    { id: "shaved", label: "Vyholené" },
  ],
  hairColor: [
    { id: "chestnut", label: "Kaštanové", color: "#744b35" },
    { id: "black", label: "Havraní", color: "#29313d" },
    { id: "ash", label: "Popelavé", color: "#939ba4" },
    { id: "gold", label: "Zlaté", color: "#c49346" },
  ],
  outfit: [
    { id: "ranger", label: "Hraničář" },
    { id: "leather", label: "Kožená zbroj" },
    { id: "knight", label: "Rytířská zbroj" },
  ],
  outfitColor: [
    { id: "pine", label: "Lesní zelená", color: "#466758" },
    { id: "oxblood", label: "Vínová", color: "#843f48" },
    { id: "navy", label: "Noční modrá", color: "#43617d" },
    { id: "sand", label: "Písková", color: "#b09768" },
  ],
  cloak: [
    { id: "none", label: "Bez pláště" },
    { id: "short", label: "Krátký plášť" },
    { id: "long", label: "Dlouhý plášť" },
  ],
  cloakColor: [
    { id: "moss", label: "Mechový", color: "#43564b" },
    { id: "burgundy", label: "Bordó", color: "#6f3544" },
    { id: "slate", label: "Břidlicový", color: "#4d596f" },
  ],
};

export const APPEARANCE_OPTIONS = Object.freeze(Object.fromEntries(
  Object.entries(options).map(([key, values]) => [key, Object.freeze(values.map(Object.freeze))]),
));

export const DEFAULT_APPEARANCE = Object.freeze({
  skin: "tan",
  face: "steady",
  hairStyle: "swept",
  hairColor: "chestnut",
  outfit: "ranger",
  outfitColor: "pine",
  cloak: "short",
  cloakColor: "moss",
});

export function normalizeAppearance(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  return Object.fromEntries(Object.keys(DEFAULT_APPEARANCE).map((key) => {
    const value = Object.hasOwn(source, key) ? source[key] : undefined;
    const valid = typeof value === "string" && APPEARANCE_OPTIONS[key].some((option) => option.id === value);
    return [key, valid ? value : DEFAULT_APPEARANCE[key]];
  }));
}

const tones = (light, base, shadow) => Object.freeze({ light, base, shadow });
const PALETTES = Object.freeze({
  skin: Object.freeze({
    fair: tones("#f8d1a7", "#e8b28a", "#a87359"),
    tan: tones("#e1ad79", "#bc8258", "#80523c"),
    brown: tones("#b78059", "#8e5940", "#603c32"),
    deep: tones("#855d47", "#593b32", "#392934"),
  }),
  hair: Object.freeze({
    chestnut: tones("#a1744a", "#744b35", "#402b29"),
    black: tones("#4a5360", "#29313d", "#171e2a"),
    ash: tones("#c8c6b8", "#939ba4", "#576472"),
    gold: tones("#e7c478", "#c49346", "#78572f"),
  }),
  cloth: Object.freeze({
    pine: tones("#75937b", "#466758", "#294539"),
    oxblood: tones("#b16b6a", "#843f48", "#512e3b"),
    navy: tones("#7490a7", "#43617d", "#2a3d59"),
    sand: tones("#d6bd86", "#b09768", "#776348"),
  }),
  cloak: Object.freeze({
    moss: tones("#6a7b5f", "#43564b", "#283c36"),
    burgundy: tones("#995764", "#6f3544", "#432b3d"),
    slate: tones("#7c869b", "#4d596f", "#2f394f"),
  }),
});

export function getAppearancePalette(input) {
  const appearance = normalizeAppearance(input);
  return {
    skin: { ...PALETTES.skin[appearance.skin] },
    hair: { ...PALETTES.hair[appearance.hairColor] },
    cloth: { ...PALETTES.cloth[appearance.outfitColor] },
    cloak: { ...PALETTES.cloak[appearance.cloakColor] },
    leather: { light: "#a67c52", base: "#765139", shadow: "#493628" },
    metal: { light: "#d8e4dd", base: "#8babb8", shadow: "#4d697e" },
  };
}
