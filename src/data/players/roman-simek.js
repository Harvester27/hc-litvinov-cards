// 🏒 ROMAN ŠIMEK - Kompletní data hráče
// Soubor: src/data/players/roman-simek.js

const RomanSimekData = {
  // Základní informace
  id: 'roman-simek-27',
  name: 'Roman Šimek',
  number: '27',
  position: 'Obránce',
  team: 'HC Lancers',
  league: 'KHLA',
  birthDate: '1995-03-15',
  height: 185,
  weight: 92,
  shoots: 'Pravá',
  nationality: 'CZ',
  hometown: 'Litvínov',
  
  // Cesty k obrázkům
  images: {
    front: '/images/players/Roman_Simek_Bronze.png',
    teamLogo: '/images/players/lancers-logo.png',
    leagueLogo: '/images/players/KHLA.png'
  },
  
  // Kartička info
  card: {
    edition: 'Bronze Edition',
    rarity: 'bronze',
    overall: 82,
    cardNumber: 'LAN-027',
    season: '2024/25'
  },
  
  // Detailní atributy (0-99)
  attributes: {
    // Útočné
    strela: 72,           // Střela - síla a přesnost střely
    prihravka: 78,        // Přihrávka - přesnost nahrávek
    klicky: 65,           // Kličky - dovednost s pukem
    vhazovani: 58,        // Vhazování - úspěšnost na buly
    napadeniHoli: 75,     // Napadání holí - agresivita v napadání
    
    // Rychlost a pohyb
    rychlost: 74,         // Rychlost - maximální rychlost
    zrychleni: 71,        // Zrychlení - jak rychle nabírá rychlost
    hbitost: 76,          // Hbitost - obratnost na bruslích
    stabilita: 83,        // Stabilita - odolnost proti srážkám
    
    // Obranné
    blokovani: 88,        // Blokování - blokování střel
    braneni: 85,          // Bránění - poziční hra v obraně
    presnost: 79,         // Přesnost - přesnost zásahů a čistota hry
    sila: 84,             // Síla - fyzická síla
    
    // Mentální
    predvidavost: 81,     // Předvídavost - čtení hry
    mentalita: 77,        // Mentalita - psychická odolnost
    disciplina: 80,       // Disciplína - vyhýbání se trestům
    vydrz: 82,            // Vydrž - kondice během zápasu
  },
  
  // Statistiky ze sezóny
  seasonStats: {
    games: 42,
    goals: 8,
    assists: 24,
    points: 32,
    plusMinus: '+18',
    pim: 36,              // Penalty minutes
    hits: 145,
    blockedShots: 89,
    timeOnIce: '22:45'
  },
  
  // Speciální schopnosti (pro budoucí features)
  abilities: [
    {
      name: 'Shutdown',
      description: 'Vynikající v defenzivní hře proti nejlepším útočníkům',
      level: 3
    },
    {
      name: 'Big Hitter',
      description: 'Devastující bodyčeky',
      level: 2
    },
    {
      name: 'Shot Blocker',
      description: 'Mistr v blokování střel',
      level: 3
    }
  ],
  
  // Bio a zajímavosti
  bio: {
    description: 'Spolehlivý obránce známý svou tvrdou hrou a defenzivními schopnostmi. Roman je pilířem obrany týmu Lancers.',
    achievements: [
      'Nejlepší obránce KHLA 2023',
      'All-Star tým 2024',
      'Rekord sezóny v blokovaných střelách'
    ],
    playStyle: 'Defenzivní obránce s důrazem na fyzickou hru a blokování střel.'
  }
};

// Export pro použití v jiných komponentách
export default RomanSimekData;

// Pomocná funkce pro získání barvy podle hodnoty atributu
export const getAttributeColor = (value) => {
  if (value >= 90) return 'from-purple-500 to-pink-500';      // Legendární
  if (value >= 80) return 'from-yellow-500 to-orange-500';   // Výborný
  if (value >= 70) return 'from-green-500 to-emerald-500';   // Dobrý
  if (value >= 60) return 'from-blue-500 to-cyan-500';       // Průměrný
  if (value >= 50) return 'from-gray-500 to-slate-500';      // Podprůměrný
  return 'from-red-500 to-rose-500';                         // Slabý
};

// Pomocná funkce pro kategorizaci atributů
export const categorizeAttributes = (attributes) => {
  return {
    utocne: {
      strela: attributes.strela,
      prihravka: attributes.prihravka,
      klicky: attributes.klicky,
      vhazovani: attributes.vhazovani,
      napadeniHoli: attributes.napadeniHoli
    },
    pohyb: {
      rychlost: attributes.rychlost,
      zrychleni: attributes.zrychleni,
      hbitost: attributes.hbitost,
      stabilita: attributes.stabilita
    },
    obranne: {
      blokovani: attributes.blokovani,
      braneni: attributes.braneni,
      presnost: attributes.presnost,
      sila: attributes.sila
    },
    mentalni: {
      predvidavost: attributes.predvidavost,
      mentalita: attributes.mentalita,
      disciplina: attributes.disciplina,
      vydrz: attributes.vydrz
    }
  };
};