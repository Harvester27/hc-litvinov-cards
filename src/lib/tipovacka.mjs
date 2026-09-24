// A round's published choices and payouts should remain fixed once picks open.
// homeGoals/awayGoals in a result include overtime, but never a shootout winner.
export const TIPOVACKA_ROUND = {
  id: 'glacier-wolves-2026-09-26',
  homeTeam: 'Litvínov Lancers',
  awayTeam: 'HC Glacier Wolves',
  startsAt: '2026-09-26T19:15:00+02:00',
  venue: 'Most',
  questions: {
    outcome: {
      title: 'Kdo vyhraje?',
      stake: 10,
      options: [
        { id: 'lancers', label: 'Litvínov Lancers', odds: 1.4 },
        { id: 'wolves', label: 'HC Glacier Wolves', odds: 3 },
        { id: 'draw', label: 'Remíza', odds: 5 },
      ],
    },
    scorer: {
      title: 'Kdo z těchto hráčů dá gól?',
      stake: 10,
      options: [
        { id: 'jan-schubada', label: 'Jan Schubada', odds: 1.6 },
        { id: 'marian-dlugopolsky', label: 'Marian Dlugopolský', odds: 4 },
        { id: 'lubos-coufal', label: 'Luboš Coufal', odds: 2.2 },
        { id: 'jan-hanus', label: 'Jan Hanuš', odds: 2 },
        { id: 'jiri-salanda', label: 'Jiří Šalanda', odds: 1.3 },
      ],
    },
    topPoints: {
      title: 'Kdo z trojice získá nejvíce bodů (góly + asistence)?',
      stake: 10,
      options: [
        { id: 'pavel-novak', label: 'Pavel Novák', odds: 1.6 },
        { id: 'marian-dlugopolsky', label: 'Marian Dlugopolský', odds: 3 },
        { id: 'gustav-toman', label: 'Gustav Toman', odds: 2.5 },
      ],
    },
    firstGoal: {
      title: 'Kdo dá první gól v zápase?',
      win: 5,
      loss: 0,
      options: [
        { id: 'lancers', label: 'Litvínov Lancers' },
        { id: 'wolves', label: 'HC Glacier Wolves' },
      ],
    },
    totalGoals: {
      title: 'Kolik padne v zápase gólů?',
      odds: 10,
      win: 18,
      loss: 0,
      min: 0,
      max: 30,
    },
  },
};

const { questions } = TIPOVACKA_ROUND;
const riskKeys = ['outcome', 'scorer', 'topPoints'];
const optionKeys = [...riskKeys, 'firstGoal'];

const isOptionId = (key, id) => questions[key].options.some((option) => option.id === id);
const isWholeNonnegative = (value) => Number.isSafeInteger(value) && value >= 0;

export function riskOutcome(odds) {
  if (typeof odds !== 'number' || !Number.isFinite(odds) || odds < 1) {
    throw new RangeError('Bodový kurz musí být konečné číslo alespoň 1.');
  }
  return { win: Math.round(10 * (odds - 1)), loss: -10 };
}

export function isCompletePicks(picks) {
  return Boolean(picks && typeof picks === 'object' && !Array.isArray(picks)
    && optionKeys.every((key) => isOptionId(key, picks[key]))
    && Number.isInteger(picks.totalGoals)
    && picks.totalGoals >= questions.totalGoals.min
    && picks.totalGoals <= questions.totalGoals.max);
}

function validateResult(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new TypeError('Výsledek zápasu musí být objekt.');
  }
  if (!isWholeNonnegative(result.homeGoals) || !isWholeNonnegative(result.awayGoals)) {
    throw new RangeError('Počet gólů musí být nezáporné celé číslo.');
  }
  for (const key of ['scorerIds', 'didNotPlayIds']) {
    if (!Array.isArray(result[key]) || result[key].some((id) => typeof id !== 'string' || !id)) {
      throw new TypeError(`${key} musí být pole identifikátorů hráčů.`);
    }
  }
  // scorerIds lists distinct Lancers players with at least one goal, not each goal event.
  if (new Set(result.scorerIds).size !== result.scorerIds.length
    || result.scorerIds.length > result.homeGoals) {
    throw new Error('Seznam střelců Lancers neodpovídá počtu jejich gólů.');
  }
  if (!result.playerPoints || typeof result.playerPoints !== 'object' || Array.isArray(result.playerPoints)) {
    throw new TypeError('playerPoints musí být objekt s body hráčů.');
  }
  const didNotPlay = new Set(result.didNotPlayIds);
  if (result.scorerIds.some((id) => didNotPlay.has(id))) {
    throw new Error('Hráč bez účasti nemůže být mezi střelci.');
  }
  for (const { id } of questions.topPoints.options) {
    if (didNotPlay.has(id)) continue;
    if (!isWholeNonnegative(result.playerPoints[id])) {
      throw new RangeError(`Chybí platný počet bodů hráče ${id}.`);
    }
  }
  const hasGoal = result.homeGoals + result.awayGoals > 0;
  if (hasGoal && !isOptionId('firstGoal', result.firstGoalTeam)) {
    throw new Error('U zápasu s gólem je potřeba určit tým prvního střelce.');
  }
  if (!hasGoal && result.firstGoalTeam !== null) {
    throw new Error('Zápas bez gólu nemůže mít prvního střelce.');
  }
  if ((result.firstGoalTeam === 'lancers' && result.homeGoals === 0)
    || (result.firstGoalTeam === 'wolves' && result.awayGoals === 0)) {
    throw new Error('První gól nemůže dát tým bez vstřelené branky.');
  }
}

const scored = (pick, hit, win, loss) => ({
  pick,
  status: hit ? 'hit' : 'miss',
  points: hit ? win : loss,
});
const voided = (pick, reason) => ({ pick, status: 'void', points: 0, reason });

export function scoreRound(picks, result) {
  if (!isCompletePicks(picks)) {
    throw new Error('Tipy musí obsahovat všech pět platných odpovědí.');
  }
  validateResult(result);

  const outcome = result.homeGoals > result.awayGoals
    ? 'lancers'
    : result.homeGoals < result.awayGoals ? 'wolves' : 'draw';
  const outcomeOdds = questions.outcome.options.find(({ id }) => id === picks.outcome).odds;
  const scorerOdds = questions.scorer.options.find(({ id }) => id === picks.scorer).odds;
  const topPointsOdds = questions.topPoints.options.find(({ id }) => id === picks.topPoints).odds;
  const didNotPlay = new Set(result.didNotPlayIds);
  const breakdown = {
    outcome: scored(picks.outcome, picks.outcome === outcome,
      riskOutcome(outcomeOdds).win, riskOutcome(outcomeOdds).loss),
    scorer: didNotPlay.has(picks.scorer)
      ? voided(picks.scorer, 'Hráč do zápasu nenastoupil.')
      : scored(picks.scorer, result.scorerIds.includes(picks.scorer),
        riskOutcome(scorerOdds).win, riskOutcome(scorerOdds).loss),
    topPoints: null,
    firstGoal: result.firstGoalTeam === null
      ? voided(picks.firstGoal, 'V zápase nepadl gól.')
      : scored(picks.firstGoal, picks.firstGoal === result.firstGoalTeam,
        questions.firstGoal.win, questions.firstGoal.loss),
    totalGoals: scored(picks.totalGoals,
      picks.totalGoals === result.homeGoals + result.awayGoals,
      questions.totalGoals.win, questions.totalGoals.loss),
  };

  if (didNotPlay.has(picks.topPoints)) {
    breakdown.topPoints = voided(picks.topPoints, 'Hráč do zápasu nenastoupil.');
  } else {
    const eligible = questions.topPoints.options.filter(({ id }) => !didNotPlay.has(id));
    const highest = Math.max(...eligible.map(({ id }) => result.playerPoints[id]));
    const leaders = eligible.filter(({ id }) => result.playerPoints[id] === highest);
    breakdown.topPoints = leaders.length !== 1
      ? voided(picks.topPoints, 'O nejvyšší počet bodů se hráči dělí.')
      : scored(picks.topPoints, leaders[0].id === picks.topPoints,
        riskOutcome(topPointsOdds).win, riskOutcome(topPointsOdds).loss);
  }

  return {
    total: Object.values(breakdown).reduce((sum, item) => sum + item.points, 0),
    breakdown,
  };
}
