// Static snapshot of the completed Czech Cup seasons from the competition's
// public API. Play-off tables only carry the final order and expose zeroes for
// all statistical columns, so finalStandings intentionally contains no stats.

export const czechCupSeasonOptions = [
  { id: '24/25', label: '2024/25' },
  { id: '25/26', label: '2025/26' }
];

export const czechCupStandingsBySeason = {
  '24/25': {
    rocnikId: 3,
    regularSeasonGroupId: 5,
    fullSeason: '2024/2025',
    title: 'Český pohár 24/25',
    directSemifinalCount: 1,
    directSemifinalTeams: ['HC Ducks Klášterec nad Ohří'],
    sourceUrl: 'https://ceskypohar.cz/',
    sourceLabel: 'Zdroj: oficiální web Českého poháru',
    sources: [
      {
        label: 'Tabulka základní části',
        url: 'https://ceskypohar.cz/api/Data/Tabulka/5'
      },
      {
        label: 'Konečné pořadí',
        url: 'https://ceskypohar.cz/api/Data/KonecnaTabulka/3'
      },
      {
        label: 'Výsledky ročníku',
        url: 'https://ceskypohar.cz/api/Data/ZapasyMin?rocnikId=3'
      },
      {
        label: 'Bodování hráčů',
        url: 'https://ceskypohar.cz/api/Data/HraciBody?rocnikId=3'
      }
    ],
    teams: [
      {
        position: 1,
        team: 'HC Kocouři Beroun',
        code: 'KOC',
        games: 14,
        wins: 12,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 1,
        losses: 1,
        goalsFor: 92,
        goalsAgainst: 40,
        points: 37,
        form: ['W', 'W', 'W', 'W', 'W'],
        trend: 'up',
        lastGames: ['6:2 Netopýři', '7:2 Viper', '6:4 Sharks', '7:5 Ducks', '9:4 Gurmáni']
      },
      {
        position: 2,
        team: 'HC Ducks Klášterec nad Ohří',
        code: 'DUC',
        games: 13,
        wins: 12,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 1,
        goalsFor: 95,
        goalsAgainst: 38,
        points: 36,
        form: ['W', 'W', 'W', 'W', 'L'],
        trend: 'up',
        lastGames: ['7:5 Lancers', '5:4 Netopýři', '13:2 Sharks', '6:2 Viper', '5:7 Kocouři']
      },
      {
        position: 3,
        team: 'HC Litvínov Lancers',
        code: 'LAN',
        games: 12,
        wins: 8,
        shootoutWins: 1,
        draws: 0,
        shootoutLosses: 0,
        losses: 3,
        goalsFor: 77,
        goalsAgainst: 49,
        points: 26,
        form: ['L', 'W', 'W', 'W', 'W'],
        trend: 'up',
        isOurTeam: true,
        lastGames: ['5:7 Ducks', '13:4 Sharks', '6:2 Gurmáni', '5:4 Netopýři', '6:2 Viper']
      },
      {
        position: 4,
        team: 'HC Viper Ústí nad Labem',
        code: 'VIP',
        games: 13,
        wins: 6,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 7,
        goalsFor: 69,
        goalsAgainst: 52,
        points: 18,
        form: ['W', 'W', 'L', 'L', 'L'],
        trend: 'down',
        lastGames: ['10:1 Gurmáni', '6:3 Netopýři', '2:7 Kocouři', '2:6 Ducks', '2:6 Lancers']
      },
      {
        position: 5,
        team: 'Netopýři Černošice',
        code: 'NET',
        games: 13,
        wins: 5,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 1,
        losses: 7,
        goalsFor: 59,
        goalsAgainst: 51,
        points: 16,
        form: ['L', 'L', 'L', 'W', 'L'],
        trend: 'down',
        lastGames: ['3:6 Viper', '2:6 Kocouři', '4:5 Ducks', '8:2 Sharks', '4:5 Lancers']
      },
      {
        position: 6,
        team: 'HC Gurmáni Žatec',
        code: 'GUR',
        games: 13,
        wins: 2,
        shootoutWins: 1,
        draws: 0,
        shootoutLosses: 0,
        losses: 10,
        goalsFor: 36,
        goalsAgainst: 90,
        points: 8,
        form: ['L', 'L', 'L', 'W', 'L'],
        trend: 'down',
        lastGames: ['1:5 Netopýři', '1:10 Viper', '2:6 Lancers', '7:1 Sharks', '4:9 Kocouři']
      },
      {
        position: 7,
        team: 'HC Sharks Ústí nad Labem',
        code: 'SHA',
        games: 12,
        wins: 1,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 11,
        goalsFor: 33,
        goalsAgainst: 111,
        points: 3,
        form: ['L', 'L', 'L', 'L', 'L'],
        trend: 'down',
        lastGames: ['4:13 Lancers', '1:7 Gurmáni', '2:8 Netopýři', '2:13 Ducks', '4:6 Kocouři']
      },
      {
        position: null,
        team: 'HC Lopaty Praha',
        code: 'LOP',
        games: 6,
        wins: 0,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 6,
        goalsFor: 0,
        goalsAgainst: 30,
        points: 0,
        form: ['L', 'L', 'L', 'L', 'L'],
        trend: 'down',
        lastGames: ['0:5 Ducks', '0:5 Viper', '0:5 Netopýři', '0:5 Gurmáni', '0:5 Kocouři'],
        withdrawn: true,
        note: 'Odstoupil ze soutěže'
      }
    ],
    topScorers: [
      { rank: 1, name: 'Jiří Trnka', team: 'HC Ducks Klášterec nad Ohří', games: 15, goals: 34, assists: 16, points: 50, pim: 6 },
      { rank: 2, name: 'Martin Martínek', team: 'HC Kocouři Beroun', games: 14, goals: 23, assists: 7, points: 30, pim: 2 },
      { rank: 3, name: 'Dominik Vlach', team: 'HC Ducks Klášterec nad Ohří', games: 14, goals: 7, assists: 21, points: 28, pim: 0 },
      { rank: 4, name: 'Jan Rychtář', team: 'HC Viper Ústí nad Labem', games: 10, goals: 15, assists: 11, points: 26, pim: 2 },
      { rank: 5, name: 'Dušan Hruška', team: 'HC Viper Ústí nad Labem', games: 16, goals: 14, assists: 9, points: 23, pim: 2 },
      { rank: 6, name: 'Pavel Schubada ml.', team: 'HC Litvínov Lancers', games: 7, goals: 15, assists: 6, points: 21, pim: 0 },
      { rank: 7, name: 'Jan Olšiak', team: 'HC Kocouři Beroun', games: 10, goals: 13, assists: 8, points: 21, pim: 2 },
      { rank: 8, name: 'Marek Tláskal', team: 'HC Kocouři Beroun', games: 12, goals: 13, assists: 8, points: 21, pim: 0 },
      { rank: 9, name: 'Vladimír Havlíček', team: 'Netopýři Černošice', games: 10, goals: 10, assists: 10, points: 20, pim: 8 },
      { rank: 10, name: 'Jan Hanuš', team: 'HC Litvínov Lancers', games: 10, goals: 7, assists: 11, points: 18, pim: 2 }
    ],
    finalStandings: [
      { position: 1, team: 'Netopýři Černošice', code: 'NET' },
      { position: 2, team: 'HC Litvínov Lancers', code: 'LAN', isOurTeam: true },
      { position: 3, team: 'HC Ducks Klášterec nad Ohří', code: 'DUC' },
      { position: 4, team: 'HC Kocouři Beroun', code: 'KOC' },
      { position: 5, team: 'HC Viper Ústí nad Labem', code: 'VIP' },
      { position: 6, team: 'HC Gurmáni Žatec', code: 'GUR' },
      { position: 7, team: 'HC Sharks Ústí nad Labem', code: 'SHA' },
      { position: 8, team: 'HC Lopaty Praha', code: 'LOP', withdrawn: true }
    ],
    lancersMatches: [
      {
        stage: 'Čtvrtfinále',
        date: '27. 4. 2025',
        dateISO: '2025-04-27',
        home: 'HC Litvínov Lancers',
        away: 'HC Gurmáni Žatec',
        score: '4:1',
        result: 'W'
      },
      {
        stage: 'Semifinále',
        date: '27. 4. 2025',
        dateISO: '2025-04-27',
        home: 'HC Kocouři Beroun',
        away: 'HC Litvínov Lancers',
        score: '1:3',
        result: 'W'
      },
      {
        stage: 'Finále',
        date: '27. 4. 2025',
        dateISO: '2025-04-27',
        home: 'Netopýři Černošice',
        away: 'HC Litvínov Lancers',
        score: '2:1',
        result: 'L'
      }
    ],
    formatNotes: [
      'Ročník odstartoval v osmi týmech, tým HC Lopaty Praha však v průběhu základní části odstoupil.',
      'Sedm aktivních týmů pokračovalo do jednodenního play-off 27. dubna 2025; HC Ducks Klášterec nad Ohří měl v prvním kole volný los.'
    ],
    rulesNotes: [
      'Výhra v základní hrací době znamenala 3 body, výhra po nájezdech 2 body a prohra po nájezdech 1 bod.',
      'Číselné statistiky týmů patří výhradně základní části. Konečné pořadí určuje play-off; u konečného pořadí proto nezobrazujeme falešné nuly z pomocné tabulky zdroje.'
    ],
    quickStats: {
      mostGoals: 'HC Ducks Klášterec nad Ohří',
      mostGoalsCount: 95,
      bestDefense: 'HC Ducks Klášterec nad Ohří',
      bestDefenseCount: 38,
      lancersPosition: '3. místo',
      finalPosition: '2. místo',
      record: '8 V + 1 VSN – 3 P',
      score: '77:49',
      playoffRecord: '2 V – 1 P',
      overallRecord: '11 V – 4 P',
      overallScore: '85:53'
    },
    summaryCard: {
      headline: 'Konečné 2. místo',
      detail: 'Český pohár 2024/25',
      note: 'Stříbro po finálové porážce 1:2 s Netopýry'
    }
  },
  '25/26': {
    rocnikId: 4,
    regularSeasonGroupId: 9,
    fullSeason: '2025/2026',
    title: 'Český pohár 25/26',
    directSemifinalCount: 2,
    directSemifinalTeams: ['HC Viper Ústí nad Labem', 'HC Kocouři Beroun'],
    sourceUrl: 'https://ceskypohar.cz/',
    sourceLabel: 'Zdroj: oficiální web Českého poháru',
    sources: [
      {
        label: 'Tabulka základní části',
        url: 'https://ceskypohar.cz/api/Data/Tabulka/9'
      },
      {
        label: 'Konečné pořadí',
        url: 'https://ceskypohar.cz/api/Data/KonecnaTabulka/4'
      },
      {
        label: 'Výsledky ročníku',
        url: 'https://ceskypohar.cz/api/Data/ZapasyMin?rocnikId=4'
      },
      {
        label: 'Bodování hráčů',
        url: 'https://ceskypohar.cz/api/Data/HraciBody?rocnikId=4'
      }
    ],
    teams: [
      {
        position: 1,
        team: 'HC Viper Ústí nad Labem',
        code: 'VIP',
        games: 10,
        wins: 7,
        shootoutWins: 1,
        draws: 0,
        shootoutLosses: 0,
        losses: 2,
        goalsFor: 63,
        goalsAgainst: 25,
        points: 23,
        form: ['W', 'W', 'W', 'W', 'L'],
        trend: 'up',
        lastGames: ['3:1 Lancers', '5:0 Lancers', '15:4 Ducks', '3:1 Gurmáni', '2:3 Kocouři']
      },
      {
        position: 2,
        team: 'HC Kocouři Beroun',
        code: 'KOC',
        games: 10,
        wins: 6,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 3,
        losses: 1,
        goalsFor: 58,
        goalsAgainst: 40,
        points: 21,
        form: ['L', 'L', 'W', 'W', 'W'],
        trend: 'stable',
        lastGames: ['3:4sn Netopýři', '8:9sn Lancers', '5:4 Ducks', '3:2 Viper', '9:1 Gurmáni']
      },
      {
        position: 3,
        team: 'Netopýři Černošice',
        code: 'NET',
        games: 10,
        wins: 6,
        shootoutWins: 1,
        draws: 0,
        shootoutLosses: 0,
        losses: 3,
        goalsFor: 47,
        goalsAgainst: 31,
        points: 20,
        form: ['W', 'W', 'W', 'L', 'L'],
        trend: 'stable',
        lastGames: ['5:1 Viper', '7:3 Ducks', '4:3sn Kocouři', '3:6 Gurmáni', '1:6 Lancers']
      },
      {
        position: 4,
        team: 'HC Litvínov Lancers',
        code: 'LAN',
        games: 10,
        wins: 5,
        shootoutWins: 1,
        draws: 0,
        shootoutLosses: 0,
        losses: 4,
        goalsFor: 53,
        goalsAgainst: 37,
        points: 17,
        form: ['L', 'W', 'W', 'W', 'W'],
        trend: 'up',
        isOurTeam: true,
        lastGames: ['0:5 Viper', '11:2 Ducks', '9:8sn Kocouři', '3:1 Ducks', '6:1 Netopýři']
      },
      {
        position: 5,
        team: 'HC Ducks Klášterec nad Ohří',
        code: 'DUC',
        games: 10,
        wins: 2,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 8,
        goalsFor: 37,
        goalsAgainst: 69,
        points: 6,
        form: ['L', 'L', 'L', 'L', 'W'],
        trend: 'down',
        lastGames: ['2:11 Lancers', '4:15 Viper', '1:3 Lancers', '4:5 Kocouři', '6:5 Gurmáni']
      },
      {
        position: 6,
        team: 'HC Gurmáni Žatec',
        code: 'GUR',
        games: 10,
        wins: 1,
        shootoutWins: 0,
        draws: 0,
        shootoutLosses: 0,
        losses: 9,
        goalsFor: 22,
        goalsAgainst: 78,
        points: 3,
        form: ['L', 'L', 'W', 'L', 'L'],
        trend: 'down',
        lastGames: ['3:7 Lancers', '1:3 Viper', '6:3 Netopýři', '5:6 Ducks', '1:9 Kocouři']
      }
    ],
    topScorers: [
      { rank: 1, name: 'Jiří Trnka', team: 'HC Ducks Klášterec nad Ohří', games: 12, goals: 18, assists: 8, points: 26, pim: 0 },
      { rank: 2, name: 'Pavel Janeček', team: 'Netopýři Černošice', games: 10, goals: 11, assists: 13, points: 24, pim: 4 },
      { rank: 3, name: 'Patrik Čejka', team: 'HC Viper Ústí nad Labem', games: 9, goals: 12, assists: 10, points: 22, pim: 0 },
      { rank: 4, name: 'Václav Materna', team: 'HC Litvínov Lancers', games: 5, goals: 12, assists: 8, points: 20, pim: 2 },
      { rank: 5, name: 'Dušan Hruška', team: 'HC Viper Ústí nad Labem', games: 12, goals: 13, assists: 6, points: 19, pim: 0 },
      { rank: 6, name: 'Jan Bruckner', team: 'Netopýři Černošice', games: 12, goals: 12, assists: 7, points: 19, pim: 6 },
      { rank: 7, name: 'Václav Matějovič', team: 'HC Litvínov Lancers', games: 6, goals: 14, assists: 2, points: 16, pim: 2 },
      { rank: 8, name: 'Jan Olšiak', team: 'HC Kocouři Beroun', games: 7, goals: 9, assists: 6, points: 15, pim: 2 },
      { rank: 9, name: 'Jan Schubada', team: 'HC Litvínov Lancers', games: 10, goals: 6, assists: 9, points: 15, pim: 2 },
      { rank: 10, name: 'Marek Tláskal', team: 'HC Kocouři Beroun', games: 9, goals: 5, assists: 10, points: 15, pim: 27 }
    ],
    finalStandings: [
      { position: 1, team: 'HC Litvínov Lancers', code: 'LAN', isOurTeam: true },
      { position: 2, team: 'HC Kocouři Beroun', code: 'KOC' },
      { position: 3, team: 'HC Viper Ústí nad Labem', code: 'VIP' },
      { position: 4, team: 'Netopýři Černošice', code: 'NET' },
      { position: 5, team: 'HC Gurmáni Žatec', code: 'GUR' },
      { position: 6, team: 'HC Ducks Klášterec nad Ohří', code: 'DUC' }
    ],
    lancersMatches: [
      {
        stage: 'Čtvrtfinále',
        date: '26. 4. 2026',
        dateISO: '2026-04-26',
        home: 'HC Litvínov Lancers',
        away: 'HC Ducks Klášterec nad Ohří',
        score: '8:1',
        result: 'W'
      },
      {
        stage: 'Semifinále',
        date: '26. 4. 2026',
        dateISO: '2026-04-26',
        home: 'HC Viper Ústí nad Labem',
        away: 'HC Litvínov Lancers',
        score: '3:6',
        result: 'W'
      },
      {
        stage: 'Finále',
        date: '26. 4. 2026',
        dateISO: '2026-04-26',
        home: 'HC Litvínov Lancers',
        away: 'HC Kocouři Beroun',
        score: '9:8',
        result: 'W'
      }
    ],
    formatNotes: [
      'Šest týmů odehrálo dvoukolovou základní část, tedy 10 zápasů na tým.',
      'Do jednodenního play-off 26. dubna 2026 postoupilo všech šest týmů; první dva týmy základní části byly nasazeny přímo do semifinále.'
    ],
    rulesNotes: [
      'Výhra v základní hrací době znamenala 3 body, výhra po nájezdech 2 body a prohra po nájezdech 1 bod.',
      'Číselné statistiky týmů patří výhradně základní části. Konečné pořadí určuje play-off; u konečného pořadí proto nezobrazujeme falešné nuly z pomocné tabulky zdroje.'
    ],
    quickStats: {
      mostGoals: 'HC Viper Ústí nad Labem',
      mostGoalsCount: 63,
      bestDefense: 'HC Viper Ústí nad Labem',
      bestDefenseCount: 25,
      lancersPosition: '4. místo',
      finalPosition: '1. místo',
      record: '5 V + 1 VSN – 4 P',
      score: '53:37',
      playoffRecord: '3 V – 0 P',
      overallRecord: '9 V – 4 P',
      overallScore: '76:49'
    },
    summaryCard: {
      headline: 'Mistři Českého poháru',
      detail: 'Český pohár 2025/26',
      note: 'Play-off bez porážky • finále 9:8 proti Kocourům'
    }
  }
};
