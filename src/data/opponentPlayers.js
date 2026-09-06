// Portréty spárované podle celých jmen na oficiální soupisce Českého poháru.
// Zdroj: https://ceskypohar.cz/players/53, ověřeno 6. 9. 2026.
// Původní soubory jsou uloženy lokálně; chybějící fotografie vracejí null.
export const viperPlayerPhotos = [
  { name: 'Dušan Hruška', photo: '/images/players/opponents/viper/hruska-dusan.png', source: 'https://ceskypohar.cz/Image/10' },
  { name: 'Martin Novák', photo: '/images/players/opponents/viper/novak-martin.png', source: 'https://ceskypohar.cz/Image/181' },
  { name: 'Roman Pecha', photo: '/images/players/opponents/viper/pecha-roman.png', source: 'https://ceskypohar.cz/Image/23' },
  { name: 'Alena Kančiová', photo: '/images/players/opponents/viper/kanciova-alena.png', source: 'https://ceskypohar.cz/Image/114' },
  { name: 'Jaroslav Kašpar', photo: '/images/players/opponents/viper/kaspar-jaroslav.png', source: 'https://ceskypohar.cz/Image/196' },
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
const photoByName = new Map(viperPlayerPhotos.map((player) => [normalizeName(player.name), player.photo]));

export const getOpponentPlayerPhoto = (teamName, playerName) => {
  if (!viperTeamNames.has(normalizeName(teamName))) return null;
  return photoByName.get(normalizeName(playerName)) || null;
};
