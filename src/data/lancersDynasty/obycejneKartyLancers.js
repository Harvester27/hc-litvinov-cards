// Centrální správa obyčejných karet HC Litvínov Lancers
// Každá karta má své ID, základní info a defaultní atributy

export const CARD_ATTRIBUTES = [
  { key: 'speed', name: 'Rychlost', icon: '⚡' },
  { key: 'shooting', name: 'Střelba', icon: '🎯' },
  { key: 'passing', name: 'Přihrávky', icon: '🔄' },
  { key: 'defense', name: 'Obrana', icon: '🛡️' },
  { key: 'physical', name: 'Fyzička', icon: '💪' },
  { key: 'skating', name: 'Bruslení', icon: '⛸️' },
  { key: 'handling', name: 'Vedení puku', icon: '🏒' },
  { key: 'checking', name: 'Napadání', icon: '👊' },
  { key: 'positioning', name: 'Postavení', icon: '📍' },
  { key: 'endurance', name: 'Vytrvalost', icon: '🔋' }
];

// Ceny vylepšení atributů (úroveň -> cena)
export const UPGRADE_COSTS = {
  1: 0,     // Start
  2: 100,   // 1->2
  3: 200,   // 2->3
  4: 400,   // 3->4
  5: 800,   // 4->5
  6: 1500,  // 5->6
  7: 2500,  // 6->7
  8: 4000,  // 7->8
  9: 6000,  // 8->9
  10: 10000 // 9->10 (MAX)
};

// Výpočet celkového overallu z atributů
export const calculateOverall = (attributes) => {
  const values = Object.values(attributes);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

// Výpočet ceny vylepšení
export const getUpgradeCost = (currentLevel) => {
  if (currentLevel >= 10) return null; // Max level
  return UPGRADE_COSTS[currentLevel + 1] || 0;
};

// Základní atributy pro novou kartu (všechny na 1)
export const getDefaultAttributes = () => {
  const attrs = {};
  CARD_ATTRIBUTES.forEach(attr => {
    attrs[attr.key] = 1;
  });
  return attrs;
};

// NOVÉ - Defaultní data karty včetně vztahu
export const getDefaultCardData = () => ({
  attributes: getDefaultAttributes(),
  relationship: 0, // Pro obyčejné karty vždy 0
  lastInviteRefused: null, // Datum posledního odmítnutí
  inviteCooldownDays: 30, // Cooldown 30 dní (měsíc)
  mood: 50, // Nálada hráče (0-100)
  sharedActivities: 0 // Počet společných aktivit
});

// NOVÉ - Funkce pro kontrolu cooldownu
export const canInvitePlayer = (cardData, currentGameDate) => {
  if (!cardData || !cardData.lastInviteRefused) return true;
  
  const lastRefused = new Date(cardData.lastInviteRefused);
  const daysSinceRefused = Math.floor((currentGameDate - lastRefused) / (1000 * 60 * 60 * 24));
  
  return daysSinceRefused >= (cardData.inviteCooldownDays || 30);
};

// NOVÉ - Funkce pro získání dní do dalšího pozvání
export const getDaysUntilCanInvite = (cardData, currentGameDate) => {
  if (!cardData || !cardData.lastInviteRefused) return 0;
  
  const lastRefused = new Date(cardData.lastInviteRefused);
  const daysSinceRefused = Math.floor((currentGameDate - lastRefused) / (1000 * 60 * 60 * 24));
  const cooldownDays = cardData.inviteCooldownDays || 30;
  
  return Math.max(0, cooldownDays - daysSinceRefused);
};

// NOVÉ - Funkce pro update cooldownu
export const updatePlayerCooldown = (cardData, currentGameDate) => {
  return {
    ...cardData,
    lastInviteRefused: currentGameDate.toISOString()
  };
};

// NOVÉ - Funkce pro zvýšení vztahu (pro budoucí použití)
export const improveRelationship = (cardData, amount = 1) => {
  return {
    ...cardData,
    relationship: Math.min(10, (cardData.relationship || 0) + amount),
    sharedActivities: (cardData.sharedActivities || 0) + 1
  };
};

// Databáze všech obyčejných karet HC Litvínov Lancers
export const OBYCEJNE_KARTY_LANCERS = [
  {
    id: 'adamschubadaobyc',
    name: 'Adam Schubada',
    position: 'Útočník',
    number: 17,
    birthYear: 1998,
    height: 185,
    weight: 88,
    shoots: 'Pravá',
    history: 'Odchovanec HC Litvínov. Rychlý a technický útočník s výbornou střelou. Několikanásobný reprezentant v mládežnických kategoriích.',
    achievements: [
      'Mistr ČR U20 (2018)',
      'Nejlepší střelec juniorské ligy (2017)',
      'Debut v extralize v 17 letech'
    ],
    imageUrl: '/CardGames/obyckartylancers/adamschubadaobyc.png'
  },
  {
    id: 'janschubadaobyc',
    name: 'Jan Schubada',
    position: 'Útočník',
    number: 23,
    birthYear: 1996,
    height: 188,
    weight: 92,
    shoots: 'Levá',
    history: 'Bratr Adama Schubady. Silový forvard s výbornou hrou před brankou. Kapitán juniorského týmu.',
    achievements: [
      'Kapitán juniorského týmu (2016)',
      'Vítěz kanadského bodování U18',
      '50+ bodů v juniorské lize'
    ],
    imageUrl: '/CardGames/obyckartylancers/janschubadaobyc.png'
  },
  {
    id: 'ostepanovskyobyc',
    name: 'Oldřich Štěpanovský',
    position: 'Obránce',
    number: 5,
    birthYear: 1997,
    height: 192,
    weight: 95,
    shoots: 'Levá',
    history: 'Defenzivní obránce s tvrdou střelou. Specialista na oslabení. Vychován v Litvínově.',
    achievements: [
      'Nejlepší obránce juniorské ligy (2017)',
      'Reprezentant U20',
      'Tvrdá střela přes 150 km/h'
    ],
    imageUrl: '/CardGames/obyckartylancers/ostepanovskyobyc.png'
  },
  {
    id: 'michaelanovakovaobyc',
    name: 'Michaela Nováková',
    position: 'Brankář',
    number: 32,
    birthYear: 1999,
    height: 172,
    weight: 68,
    shoots: 'Pravá',
    history: 'Jedna z nejtalentovanějších hráček ženského hokeje. Technická hráčka s výborným přehledem.',
    achievements: [
      'Mistryně světa U18 (2017)',
      'MVP ženské ligy (2021)',
      'Olympijská reprezentantka'
    ],
    imageUrl: '/CardGames/obyckartylancers/michaelanovakovaobyc.png'
  },
  {
    id: 'vlastanistorobyc',
    name: 'Vlastimil Nistor',
    position: 'Brankář',
    number: 71,
    birthYear: 1995,
    height: 180,
    weight: 82,
    shoots: 'Pravá',
    history: 'Rychlý křídlo s výborným bruslením. Specialista na přesilovky. Odchovanec Litvínova.',
    achievements: [
      'Nejrychlejší bruslař týmu',
      '100+ extraligových zápasů',
      'Mistr ČR s juniory (2015)'
    ],
    imageUrl: '/CardGames/obyckartylancers/vlastanistorobyc.png'
  },
  {
    id: 'pavelnovakobyc',
    name: 'Pavel Novák',
    position: 'Obránce',
    number: 88,
    birthYear: 1994,
    height: 183,
    weight: 86,
    shoots: 'Pravá',
    history: 'Centr s výbornou rozehrávkou. Lídr týmu na ledě i mimo něj. Dlouholetý kapitán juniorů.',
    achievements: [
      'Kapitán A-týmu',
      '200+ bodů v juniorské lize',
      'Držitel Zlaté helmy juniorů'
    ],
    imageUrl: '/CardGames/obyckartylancers/pavelnovakobyc.png'
  },
  {
    id: 'jindrabelingerobyc',
    name: 'Jindřich Belinger',
    position: 'Obránce',
    number: 3,
    birthYear: 1996,
    height: 189,
    weight: 91,
    shoots: 'Pravá',
    history: 'Ofenzivní obránce s výbornou rozehrávkou. Specialista na přesilovky. Bratr Jiřího.',
    achievements: [
      'Nejproduktivnější obránce U20',
      'Asistent kapitána',
      'Reprezentant všech mládežnických kategorií'
    ],
    imageUrl: '/CardGames/obyckartylancers/jindrabelingerobyc.png'
  },
  {
    id: 'jiribelingerobyc',
    name: 'Jiří Belinger',
    position: 'Obránce',
    number: 7,
    birthYear: 1998,
    height: 186,
    weight: 88,
    shoots: 'Levá',
    history: 'Mladší bratr Jindřicha. Spolehlivý defenzivní obránce. Mistr blokování střel.',
    achievements: [
      'Nejlepší +/- statistika v týmu',
      'Mistr v blokování střel',
      'Železný muž - 100+ zápasů v řadě'
    ],
    imageUrl: '/CardGames/obyckartylancers/jiribelingerobyc.png'
  },
  {
    id: 'maternaobyc',
    name: 'Vašek Materna',
    position: 'Útočník',
    number: 15,
    birthYear: 1997,
    height: 178,
    weight: 79,
    shoots: 'Levá',
    history: 'Technický centr s výbornou hrou v přesilovkách. Kreativní hráč s přehledem.',
    achievements: [
      'Nejlepší nahrávač juniorské ligy',
      'Talent roku HC Litvínov (2016)',
      'Držitel rekordu v asistencích za sezónu'
    ],
    imageUrl: '/CardGames/obyckartylancers/maternaobyc.png'
  },
  {
    id: 'ondrahrubyobyc',
    name: 'Ondřej Hrubý',
    position: 'Útočník',
    number: 30,
    birthYear: 1996,
    height: 190,
    weight: 87,
    shoots: 'Levá',
    history: 'Talentovaný brankář s výbornými reflexy. Odchovanec Litvínova. Mentálně silný.',
    achievements: [
      'Nejlepší brankář juniorské ligy (2016)',
      'Úspěšnost zákroků přes 93%',
      '5 čistých kont za sezónu'
    ],
    imageUrl: '/CardGames/obyckartylancers/ondrahrubyobyc.png'
  },
  {
    id: 'gustavtomanobyc',
    name: 'Gustav Toman',
    position: 'Útočník',
    number: 12,
    birthYear: 1997,
    height: 182,
    weight: 84,
    shoots: 'Pravá',
    history: 'Rychlý a technický útočník s výbornou střelou. Odchovanec Litvínova s velkým potenciálem.',
    achievements: [
      'Nejlepší střelec juniorské ligy (2018)',
      'Reprezentant U20',
      'Debut v extralize v 18 letech'
    ],
    imageUrl: '/CardGames/obyckartylancers/gustavtomanobyc.png'
  },
  {
    id: 'janhanusobyc',
    name: 'Jan Hanuš',
    position: 'Obránce',
    number: 22,
    birthYear: 1996,
    height: 190,
    weight: 93,
    shoots: 'Levá',
    history: 'Fyzicky silný obránce s výbornou rozehrávkou. Lídr defenzivy.',
    achievements: [
      'Nejlepší obránce juniorské ligy (2017)',
      'Kapitán juniorského týmu',
      'Mistr ČR U20 (2016)'
    ],
    imageUrl: '/CardGames/obyckartylancers/janhanusobyc.png'
  },
  {
    id: 'mariandlugopolskyobyc',
    name: 'Marián Dlugopolský',
    position: 'Útočník',
    number: 18,
    birthYear: 1998,
    height: 185,
    weight: 87,
    shoots: 'Pravá',
    history: 'Silový forvard s výbornou hrou před brankou. Specialista na dorážky.',
    achievements: [
      'Vítěz kanadského bodování U18',
      'Nejlepší hráč play-off juniorů',
      '100+ bodů v juniorské lize'
    ],
    imageUrl: '/CardGames/obyckartylancers/mariandlugopolskyobyc.png'
  },
  {
    id: 'luboscoufalobyc',
    name: 'Luboš Coufal',
    position: 'Obránce',
    number: 44,
    birthYear: 1997,
    height: 188,
    weight: 90,
    shoots: 'Pravá',
    history: 'Defenzivní specialista s tvrdou hrou. Mistr v blokování střel.',
    achievements: [
      'Nejlepší +/- statistika v lize',
      'Specialista na oslabení',
      'Reprezentant U20'
    ],
    imageUrl: '/CardGames/obyckartylancers/luboscoufalobyc.png'
  },
  {
    id: 'petrpetrovobyc',
    name: 'Petr Petrov',
    position: 'Útočník',
    number: 91,
    birthYear: 1999,
    height: 179,
    weight: 78,
    shoots: 'Levá',
    history: 'Rychlý křídlo s výborným bruslením. Kreativní hráč s výbornou technikou.',
    achievements: [
      'Nejrychlejší bruslař juniorské ligy',
      'Talent roku HC Litvínov (2019)',
      'Držitel rekordu v asistencích za sezónu'
    ],
    imageUrl: '/CardGames/obyckartylancers/petrpetrovobyc.png'
  },
  {
    id: 'tomasturecekobyc',
    name: 'Tomáš Tureček',
    position: 'Obránce',
    number: 33,
    birthYear: 1996,
    height: 194,
    weight: 98,
    shoots: 'Levá',
    history: 'Nejvyšší obránce týmu s výborným přehledem. Specialista na přesilovky.',
    achievements: [
      'Tvrdá střela přes 160 km/h',
      'Nejproduktivnější obránce U20',
      'Mistr ČR s juniory (2016)'
    ],
    imageUrl: '/CardGames/obyckartylancers/tomasturecekobyc.png'
  }
];

// Funkce pro získání karty podle ID
export const getCardById = (cardId) => {
  return OBYCEJNE_KARTY_LANCERS.find(card => card.id === cardId);
};

// Funkce pro získání náhodných karet (pro pack opening)
export const getRandomCards = (count = 3) => {
  const shuffled = [...OBYCEJNE_KARTY_LANCERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Funkce pro získání karet podle pozice
export const getCardsByPosition = (position) => {
  return OBYCEJNE_KARTY_LANCERS.filter(card => card.position === position);
};

// Export pro použití v jiných souborech
export default {
  CARD_ATTRIBUTES,
  UPGRADE_COSTS,
  OBYCEJNE_KARTY_LANCERS,
  calculateOverall,
  getUpgradeCost,
  getDefaultAttributes,
  getDefaultCardData,
  canInvitePlayer,
  getDaysUntilCanInvite,
  updatePlayerCooldown,
  improveRelationship,
  getCardById,
  getRandomCards,
  getCardsByPosition
};