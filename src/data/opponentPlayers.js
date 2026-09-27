// Portréty spárované podle celých jmen na oficiálních soupiskách Českého poháru.
// Původní soubory jsou uloženy lokálně; chybějící fotografie vracejí null.
// Viper: https://ceskypohar.cz/players/53 (ověřeno 6. 9. 2026).
export const viperPlayerPhotos = [
  { name: 'Dušan Hruška', photo: '/images/players/opponents/viper/hruska-dusan.png', source: 'https://ceskypohar.cz/Image/10' },
  { name: 'Martin Novák', photo: '/images/players/opponents/viper/novak-martin.png', source: 'https://ceskypohar.cz/Image/181' },
  { name: 'Roman Pecha', photo: '/images/players/opponents/viper/pecha-roman.png', source: 'https://ceskypohar.cz/Image/23' },
  { name: 'Alena Kančiová', photo: '/images/players/opponents/viper/kanciova-alena.png', source: 'https://ceskypohar.cz/Image/114' },
  { name: 'Jaroslav Kašpar', photo: '/images/players/opponents/viper/kaspar-jaroslav.png', source: 'https://ceskypohar.cz/Image/196' },
];

// Zápis: https://ceskypohar.cz/match/403 (26. 9. 2026).
export const glacierWolvesPlayerPhotos = [
  { name: 'Marek Vild', photo: '/images/players/opponents/glacier-wolves/vild-marek.jpg', source: 'https://ceskypohar.cz/Image/235' },
  { name: 'Tomáš Krist', photo: '/images/players/opponents/glacier-wolves/krist-tomas.jpg', source: 'https://ceskypohar.cz/Image/172' },
  { name: 'Radomír Moučka', photo: '/images/players/opponents/glacier-wolves/moucka-radomir.png', source: 'https://ceskypohar.cz/Image/184' },
  { name: 'Petr Stehlík', photo: '/images/players/opponents/glacier-wolves/stehlik-petr.jpg', source: 'https://ceskypohar.cz/Image/234' },
];

const normalizeName = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .replace(/\s+/g, ' ')
  .toLowerCase();

const viperTeamNames = new Set([
  'HC Viper Ústí nad Labem', 'Viper Ústí nad Labem', 'HC Viper Ústí', 'Viper Ústí',
].map(normalizeName));
const glacierWolvesTeamNames = new Set(['HC Glacier Wolves', 'Glacier Wolves'].map(normalizeName));
const viperPhotoByName = new Map(viperPlayerPhotos.map((player) => [normalizeName(player.name), player.photo]));
const glacierWolvesPhotoByName = new Map(glacierWolvesPlayerPhotos.map((player) => [normalizeName(player.name), player.photo]));

export const getOpponentPlayerPhoto = (teamName, playerName) => {
  const normalizedTeam = normalizeName(teamName);
  const normalizedPlayer = normalizeName(playerName);
  if (viperTeamNames.has(normalizedTeam)) return viperPhotoByName.get(normalizedPlayer) || null;
  if (glacierWolvesTeamNames.has(normalizedTeam)) return glacierWolvesPhotoByName.get(normalizedPlayer) || null;
  return null;
};
