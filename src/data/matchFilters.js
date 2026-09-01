export const matchSeasons = [
  { id: '2024/25', label: '24/25', fullLabel: '2024/2025' },
  { id: '2025/26', label: '25/26', fullLabel: '2025/2026' },
  { id: '2026/27', label: '26/27', fullLabel: '2026/2027' }
];

export const matchCompetitionFilters = [
  { id: 'all', label: 'Vše', fullLabel: 'Všechny soutěže' },
  { id: 'czech-cup', label: 'Český pohár', fullLabel: 'Český pohár' },
  { id: 'khla', label: 'KHLA', fullLabel: 'KHLA' },
  { id: 'friendly', label: 'Přátelské zápasy', fullLabel: 'Přátelské zápasy' },
  { id: 'tournament', label: 'Turnaje', fullLabel: 'Turnaje' }
];

export const getLatestSeasonWithMatches = (matches = []) => {
  const latestSeason = [...matchSeasons]
    .reverse()
    .find((season) =>
      matches.some((match) => match.status === 'completed' && match.season === season.id)
    );

  return latestSeason?.id || matchSeasons[matchSeasons.length - 1].id;
};
