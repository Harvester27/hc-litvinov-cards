export const khlaSeasonOptions = [
  { id: '24/25', label: '2024/25' },
  { id: '25/26', label: '2025/26' }
];

export const khlaStandingsBySeason = {
  '24/25': {
    fullSeason: '2024/2025',
    title: 'KHLA Sportega Liga 24/25',
    teams: [
      {
        position: 1,
        team: 'HC Krokodýl',
        code: 'KRO',
        games: 14,
        wins: 10,
        draws: 0,
        losses: 4,
        goalsFor: 81,
        goalsAgainst: 46,
        points: 30,
        form: ['W', 'L', 'W', 'W', 'W'],
        trend: 'up',
        lastGames: ['4:2 Warriors', '2:3 Kopyta', '5:3 Žíhadla', '6:2 NBL', '3:1 Lancers']
      },
      {
        position: 2,
        team: 'HC Kopyta',
        code: 'KPT',
        games: 14,
        wins: 9,
        draws: 2,
        losses: 3,
        goalsFor: 85,
        goalsAgainst: 55,
        points: 29,
        form: ['W', 'W', 'D', 'W', 'L'],
        trend: 'stable',
        lastGames: ['3:2 Krokodýl', '4:1 Warriors', '2:2 BOB', '5:2 Friends', '1:3 Žíhadla']
      },
      {
        position: 3,
        team: 'HC Žíhadla',
        code: 'ŽHD',
        games: 14,
        wins: 9,
        draws: 1,
        losses: 4,
        goalsFor: 63,
        goalsAgainst: 47,
        points: 28,
        form: ['L', 'W', 'W', 'W', 'W'],
        trend: 'up',
        lastGames: ['3:5 Krokodýl', '4:2 NBL', '3:1 Friends', '2:0 Warriors', '3:1 Kopyta']
      },
      {
        position: 4,
        team: 'HC Band Of Brothers',
        code: 'BOB',
        games: 14,
        wins: 8,
        draws: 1,
        losses: 5,
        goalsFor: 85,
        goalsAgainst: 78,
        points: 25,
        form: ['W', 'D', 'L', 'W', 'W'],
        trend: 'stable',
        lastGames: ['5:3 Friends', '2:2 Kopyta', '3:4 Krokodýl', '6:4 Warriors', '4:2 Lancers']
      },
      {
        position: 5,
        team: 'HC North Blades',
        code: 'NBL',
        games: 14,
        wins: 5,
        draws: 0,
        losses: 9,
        goalsFor: 61,
        goalsAgainst: 82,
        points: 15,
        form: ['L', 'L', 'W', 'L', 'L'],
        trend: 'down',
        lastGames: ['2:6 Krokodýl', '2:4 Žíhadla', '3:2 Warriors', '1:5 BOB', '2:4 Lancers']
      },
      {
        position: 6,
        team: 'HC F.R.I.E.N.D.S.',
        code: 'FRD',
        games: 14,
        wins: 4,
        draws: 2,
        losses: 8,
        goalsFor: 80,
        goalsAgainst: 85,
        points: 14,
        form: ['L', 'L', 'D', 'W', 'L'],
        trend: 'down',
        lastGames: ['3:5 BOB', '2:5 Kopyta', '3:3 Warriors', '4:3 Lancers', '2:4 Žíhadla']
      },
      {
        position: 7,
        team: 'HC Lancers',
        code: 'LNR',
        games: 14,
        wins: 4,
        draws: 2,
        losses: 8,
        goalsFor: 58,
        goalsAgainst: 88,
        points: 14,
        form: ['L', 'W', 'L', 'W', 'L'],
        trend: 'down',
        isOurTeam: true,
        lastGames: ['1:3 Krokodýl', '4:2 NBL', '3:4 Friends', '3:1 Warriors', '2:4 BOB']
      },
      {
        position: 8,
        team: 'HC Warriors',
        code: 'WAR',
        games: 14,
        wins: 2,
        draws: 2,
        losses: 10,
        goalsFor: 60,
        goalsAgainst: 93,
        points: 8,
        form: ['L', 'L', 'D', 'L', 'L'],
        trend: 'down',
        lastGames: ['2:4 Krokodýl', '1:4 Kopyta', '3:3 Friends', '1:3 Lancers', '0:2 Žíhadla']
      }
    ],
    placementTitle: 'Play-out KHLA Sportega Liga 24/25',
    placementSubtitle: 'O konečné 5.–8. místo',
    placementTeams: [
      { position: 5, team: 'HC Lancers', code: 'LNR', games: 3, wins: 3, draws: 0, losses: 0, goalsFor: 12, goalsAgainst: 5, points: 9, isOurTeam: true },
      { position: 6, team: 'HC F.R.I.E.N.D.S.', code: 'FRD', games: 3, wins: 2, draws: 0, losses: 1, goalsFor: 12, goalsAgainst: 9, points: 6 },
      { position: 7, team: 'HC Warriors', code: 'WAR', games: 3, wins: 1, draws: 0, losses: 2, goalsFor: 10, goalsAgainst: 14, points: 3 },
      { position: 8, team: 'HC North Blades', code: 'NBL', games: 3, wins: 0, draws: 0, losses: 3, goalsFor: 5, goalsAgainst: 13, points: 0 }
    ],
    placementNoteTitle: 'Lancers úspěšně zvládli play-out!',
    placementNoteText: 'Konečné 5. místo je velkým úspěchem v kvalitní KHLA lize 🎉',
    lancersMatches: [
      { date: '11.1.', home: 'Lancers', away: 'HC Krokodýl', score: '1:3', result: 'L' },
      { date: '8.1.', home: 'HC North Blades', away: 'Lancers', score: '2:4', result: 'W' },
      { date: '5.1.', home: 'Lancers', away: 'HC F.R.I.E.N.D.S.', score: '3:4', result: 'L' },
      { date: '2.1.', home: 'HC Warriors', away: 'Lancers', score: '1:3', result: 'W' },
      { date: '28.12.', home: 'HC Band Of Brothers', away: 'Lancers', score: '4:2', result: 'L' },
      { date: '22.12.', home: 'Lancers', away: 'HC Žíhadla', score: '2:5', result: 'L' }
    ],
    quickStats: {
      mostGoals: 'HC Krokodýl',
      bestDefense: 'HC Krokodýl',
      lancersPosition: '7. místo',
      record: '4V-2R-8P',
      score: '58:88'
    },
    summaryCard: {
      headline: 'Konečné 5. místo',
      detail: 'KHLA Sportega Liga 24/25',
      note: 'Play-out bez porážky'
    }
  },
  '25/26': {
    fullSeason: '2025/2026',
    title: 'KHLA Sportega Liga 25/26',
    sourceUrl: 'https://www.khla.cz/liga/umisteni',
    sourceLabel: 'Zdroj: oficiální tabulka KHLA',
    teams: [
      { position: 1, team: 'HC F.R.I.E.N.D.S.', code: 'FRD', games: 14, wins: 11, draws: 0, losses: 3, goalsFor: 103, goalsAgainst: 59, points: 33, form: [], trend: 'stable' },
      { position: 2, team: 'HC Band Of Brothers', code: 'BOB', games: 14, wins: 9, draws: 2, losses: 3, goalsFor: 86, goalsAgainst: 57, points: 29, form: [], trend: 'stable' },
      { position: 3, team: 'HC Žihadla', code: 'ŽHD', games: 14, wins: 9, draws: 1, losses: 4, goalsFor: 92, goalsAgainst: 63, points: 28, form: [], trend: 'stable' },
      { position: 4, team: 'HC Wariors', code: 'WAR', games: 14, wins: 7, draws: 1, losses: 6, goalsFor: 73, goalsAgainst: 61, points: 22, form: [], trend: 'stable' },
      { position: 5, team: 'HC Krokodýl', code: 'KRO', games: 14, wins: 6, draws: 0, losses: 8, goalsFor: 71, goalsAgainst: 77, points: 18, form: [], trend: 'stable' },
      { position: 6, team: 'HC Lancers', code: 'LNR', games: 14, wins: 5, draws: 0, losses: 9, goalsFor: 74, goalsAgainst: 87, points: 15, form: [], trend: 'stable', isOurTeam: true },
      { position: 7, team: 'HC Kopyta', code: 'KPT', games: 14, wins: 5, draws: 0, losses: 9, goalsFor: 50, goalsAgainst: 98, points: 15, form: [], trend: 'stable' },
      { position: 8, team: 'HC North Blades', code: 'NBL', games: 14, wins: 2, draws: 0, losses: 12, goalsFor: 51, goalsAgainst: 96, points: 6, form: [], trend: 'stable' }
    ],
    placementTitle: 'Tabulka o umístění KHLA 25/26',
    placementSubtitle: 'O konečné 5.–8. místo • všechny týmy odehrály 3 zápasy',
    placementTeams: [
      { position: 5, team: 'HC Lancers', code: 'LNR', games: 3, wins: 3, draws: 0, losses: 0, goalsFor: 30, goalsAgainst: 8, points: 9, isOurTeam: true },
      { position: 6, team: 'HC Krokodýl', code: 'KRO', games: 3, wins: 2, draws: 0, losses: 1, goalsFor: 20, goalsAgainst: 16, points: 6 },
      { position: 7, team: 'HC Kopyta', code: 'KPT', games: 3, wins: 1, draws: 0, losses: 2, goalsFor: 10, goalsAgainst: 23, points: 3 },
      { position: 8, team: 'HC North Blades', code: 'NBL', games: 3, wins: 0, draws: 0, losses: 3, goalsFor: 9, goalsAgainst: 22, points: 0 }
    ],
    placementNoteTitle: 'Lancers vyhráli tabulku o umístění!',
    placementNoteText: 'Tři výhry ze tří zápasů znamenají konečné 5. místo v sezóně 2025/26 🎉',
    lancersMatches: [
      { date: '28.3.', home: 'Lancers', away: 'HC Krokodýl', score: '9:1', result: 'W' },
      { date: '20.3.', home: 'Lancers', away: 'HC North Blades', score: '10:4', result: 'W' },
      { date: '14.3.', home: 'Lancers', away: 'HC Kopyta', score: '11:3', result: 'W' },
      { date: '27.2.', home: 'Lancers', away: 'HC North Blades', score: '10:2', result: 'W' },
      { date: '13.2.', home: 'HC F.R.I.E.N.D.S.', away: 'Lancers', score: '15:5', result: 'L' },
      { date: '31.1.', home: 'HC Band Of Brothers', away: 'Lancers', score: '15:5', result: 'L' }
    ],
    quickStats: {
      mostGoals: 'HC F.R.I.E.N.D.S.',
      bestDefense: 'HC Band Of Brothers',
      lancersPosition: '6. místo',
      record: '5V-0R-9P',
      score: '74:87'
    },
    summaryCard: {
      headline: 'Konečné 5. místo',
      detail: 'KHLA Sportega Liga 25/26',
      note: 'Tabulka o umístění: 3 výhry ze 3'
    }
  }
};
