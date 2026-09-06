const normalizeTeamName = (teamName) => String(teamName || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

export const isLancersTeam = (teamName) => /\blancers\b/i.test(String(teamName || ''));

// These are the existing club assets also used on the results page.
const teamLogos = [
  [/\blancers\b/, 'lancers-logo.png'],
  [/\bviper(?:s)?\b/, 'Viper.png'],
  [/\bberlin\b/, 'Berlin.png'],
  [/\bnetopyri\b/, 'Netopyri.png'],
  [/\bkocouri\b/, 'Kocouri.png'],
  [/\bgurmani\b/, 'Gurmani.png'],
  [/\bducks\b/, 'Ducks.png'],
  [/\bsharks\b/, 'Sharks.png'],
  [/\bkrokodyl\b/, 'HCKrokodyl.png'],
  [/\bkopyta\b/, 'HCKopyta.png'],
  [/\bzihadla\b/, 'HCZihadla.png'],
  [/\bband of brothers\b/, 'HCBandofBrothers.png'],
  [/\bnorth blades\b/, 'HCNorthBlades.png'],
  [/\bf\.?r\.?i\.?e\.?n\.?d\.?s\b/, 'HCFriends.png'],
  [/\bwarriors\b/, 'HCWarriors.png'],
];

export const getTeamLogo = (teamName) => {
  const name = normalizeTeamName(teamName);
  const entry = teamLogos.find(([pattern]) => pattern.test(name));
  return entry ? `/images/loga/${entry[1]}` : null;
};

const isShootoutGoal = (goal) => goal?.shootout === true
  || /^sn$/i.test(String(goal?.time || '').trim());

export const getRegulationGoals = (match) => Array.isArray(match?.goals)
  ? match.goals.filter((goal) => goal && typeof goal === 'object' && !isShootoutGoal(goal))
  : [];

const normalizeShootoutEntries = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.attempts)) return value.attempts;
  if (value && typeof value === 'object') return [value];
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
};

export const getShootoutAttempts = (match) => {
  const plural = normalizeShootoutEntries(match?.shootouts);
  if (plural.length) return plural;
  const singular = normalizeShootoutEntries(match?.shootout);
  if (singular.length) return singular;
  return Array.isArray(match?.goals) ? match.goals.filter(isShootoutGoal) : [];
};

export const getShootoutResult = (attempt) => {
  if (!attempt || typeof attempt !== 'object') return '';
  // Keep a supplied note such as "Rozhodující nájezd" alongside scored=true.
  if (typeof attempt.result === 'string' && attempt.result.trim()) return attempt.result;
  const converted = attempt.scored ?? attempt.converted ?? attempt.result;
  if (converted === true) return 'Proměněno';
  if (converted === false) return 'Neproměněno';
  return attempt.result !== undefined && attempt.result !== null ? String(attempt.result) : '';
};

const getEventSeconds = (event) => {
  const time = /^(\d+):([0-5]\d)$/.exec(String(event.time || '').trim());
  return time ? Number(time[1]) * 60 + Number(time[2]) : Number.POSITIVE_INFINITY;
};

export const getTimelineEvents = (match) => {
  const penalties = Array.isArray(match?.penalties)
    ? match.penalties.filter((penalty) => penalty && typeof penalty === 'object')
    : [];
  return [
    ...getRegulationGoals(match).map((goal) => ({ ...goal, kind: 'goal' })),
    ...penalties.map((penalty) => ({ ...penalty, kind: 'penalty' })),
  ].sort((left, right) => {
    const leftTime = getEventSeconds(left);
    const rightTime = getEventSeconds(right);
    // Unknown timestamps remain intact and are displayed after timed events.
    return leftTime === rightTime ? 0 : leftTime - rightTime;
  });
};

export const getLineupGroups = (lineup) => {
  if (!lineup || typeof lineup !== 'object') return [];
  return [
    { label: 'Brankář', players: lineup.goalie ? [lineup.goalie] : [] },
    { label: 'Obránci', players: lineup.defenders },
    { label: 'Útočníci', players: lineup.forwards },
    { label: '1. řada', players: lineup.line1 },
    { label: '2. řada', players: lineup.line2 },
    { label: '3. řada', players: lineup.line3 },
  ].filter((group) => Array.isArray(group.players) && group.players.length > 0);
};

export const getPeriodScores = (periods) => typeof periods === 'string'
  ? (periods.match(/\d+\s*:\s*\d+/g) || []).map((score) => score.replace(/\s/g, ''))
  : [];
