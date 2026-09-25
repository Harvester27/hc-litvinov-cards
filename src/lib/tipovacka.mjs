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
        { id: 'none-listed', label: 'Nikdo z uvedené pětice', odds: 7 },
      ],
    },
    topPoints: {
      title: 'Kdo z trojice získá nejvíce bodů (góly + asistence)?',
      stake: 10,
      options: [
        { id: 'tomas-turecek', label: 'Tomáš Tureček', odds: 2.9 },
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
const optionKeys = ['outcome', 'topPoints', 'firstGoal'];
const scorerPlayers = questions.scorer.options.filter(({ id }) => id !== 'none-listed');
const scorerOptionIds = questions.scorer.options.map(({ id }) => id);
const scorerOptionSet = new Set(scorerOptionIds);

const isOptionId = (key, id) => questions[key].options.some((option) => option.id === id);
const isWholeNonnegative = (value) => Number.isSafeInteger(value) && value >= 0;

export function riskOutcome(odds) {
  if (typeof odds !== 'number' || !Number.isFinite(odds) || odds < 1) {
    throw new RangeError('Bodový kurz musí být konečné číslo alespoň 1.');
  }
  return { win: Math.round(10 * (odds - 1)), loss: -10 };
}

// A split stake can yield tenths of a point (e.g. 3 points at 1.6 = +1.8).
export function scorerStakeOutcome(stake, odds) {
  if (!isWholeNonnegative(stake) || stake > questions.scorer.stake) {
    throw new RangeError('Vklad musí být celé číslo od 0 do 10.');
  }
  if (typeof odds !== 'number' || !Number.isFinite(odds) || odds < 1) {
    throw new RangeError('Bodový kurz musí být konečné číslo alespoň 1.');
  }
  return { win: Math.round(stake * (odds - 1) * 10) / 10, loss: -stake };
}

export function hasConflictingScorerStakes(scorer) {
  return Boolean(scorer && typeof scorer === 'object' && !Array.isArray(scorer)
    && scorer['none-listed'] > 0
    && scorerPlayers.some(({ id }) => scorer[id] > 0));
}

function isScorerAllocation(scorer) {
  return scorer && typeof scorer === 'object' && !Array.isArray(scorer)
    && Object.keys(scorer).length === scorerOptionIds.length
    && Object.keys(scorer).every((id) => scorerOptionSet.has(id))
    && scorerOptionIds.every((id) => isWholeNonnegative(scorer[id])
      && scorer[id] <= questions.scorer.stake)
    && !hasConflictingScorerStakes(scorer)
    && scorerOptionIds.reduce((sum, id) => sum + scorer[id], 0) === questions.scorer.stake;
}

export function isCompletePicks(picks) {
  return Boolean(picks && typeof picks === 'object' && !Array.isArray(picks)
    && optionKeys.every((key) => isOptionId(key, picks[key]))
    && isScorerAllocation(picks.scorer)
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
  // scorerIds contains only the five listed candidates, one entry per scorer.
  // An empty list can still accompany home goals scored by other Lancers players.
  if (result.scorerIds.some((id) => !scorerPlayers.some((player) => player.id === id))) {
    throw new Error('Seznam střelců obsahuje hráče mimo vypsanou pětici.');
  }
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
    if (result.playerPoints[id] > result.homeGoals
      || (result.scorerIds.includes(id) && result.playerPoints[id] === 0)) {
      throw new RangeError(`Počet bodů hráče ${id} neodpovídá výsledku.`);
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
  const topPointsOdds = questions.topPoints.options.find(({ id }) => id === picks.topPoints).odds;
  const didNotPlay = new Set(result.didNotPlayIds);
  const namedScorer = scorerPlayers.some(({ id }) => result.scorerIds.includes(id));
  const scorerLines = questions.scorer.options
    .filter(({ id }) => picks.scorer[id] > 0)
    .map(({ id, odds }) => {
      const stake = picks.scorer[id];
      const pick = id;
      if (id !== 'none-listed' && didNotPlay.has(id)) {
        return { ...voided(pick, 'Hráč do zápasu nenastoupil.'), id, stake };
      }
      const hit = id === 'none-listed' ? !namedScorer : result.scorerIds.includes(id);
      return {
        ...scored(pick, hit, scorerStakeOutcome(stake, odds).win,
          scorerStakeOutcome(stake, odds).loss),
        id,
        stake,
      };
    });
  const scorerStatuses = new Set(scorerLines.map(({ status }) => status));
  const breakdown = {
    outcome: scored(picks.outcome, picks.outcome === outcome,
      riskOutcome(outcomeOdds).win, riskOutcome(outcomeOdds).loss),
    scorer: {
      pick: { ...picks.scorer },
      status: scorerStatuses.size === 1 ? scorerLines[0].status : 'mixed',
      points: Math.round(scorerLines.reduce((sum, line) => sum + line.points, 0) * 10) / 10,
      lines: scorerLines,
    },
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
    total: Math.round(Object.values(breakdown).reduce((sum, item) => sum + item.points, 0) * 10) / 10,
    breakdown,
  };
}

// Highest *attainable* net score with all named players taking part. The search
// accounts for mutually exclusive 'none-listed'/player wins, the selected total,
// the first-goal side, the result, and 0:0. Every represented scenario can occur.
// Player nonparticipation can instead void a losing stake, so the actual round's
// ceiling may differ if the roster changes.
export function maxPossiblePoints(picks) {
  if (!isCompletePicks(picks)) {
    throw new Error('Tipy musí obsahovat všech pět platných odpovědí.');
  }
  const scorerPayouts = questions.scorer.options.map(({ id, odds }) => ({
    id,
    ...scorerStakeOutcome(picks.scorer[id], odds),
  }));
  const outcomeWin = riskOutcome(
    questions.outcome.options.find(({ id }) => id === picks.outcome).odds,
  ).win;
  const topWin = riskOutcome(
    questions.topPoints.options.find(({ id }) => id === picks.topPoints).odds,
  ).win;
  let maximum = -Infinity;

  // 31 is sufficient for all answer patterns: exact total guesses end at 30;
  // a larger score only repeats a miss on that question and no other new state.
  for (let homeGoals = 0; homeGoals <= 31; homeGoals += 1) {
    for (let awayGoals = 0; awayGoals <= 31; awayGoals += 1) {
      const outcome = homeGoals > awayGoals
        ? 'lancers' : homeGoals < awayGoals ? 'wolves' : 'draw';
      const outcomePoints = picks.outcome === outcome ? outcomeWin : -10;
      const firstGoalPoints = homeGoals + awayGoals === 0
        ? 0 : ((picks.firstGoal === 'lancers' ? homeGoals > 0 : awayGoals > 0) ? 5 : 0);
      const totalPoints = picks.totalGoals === homeGoals + awayGoals ? 18 : 0;

      for (let mask = 0; mask < (1 << scorerPlayers.length); mask += 1) {
        if (mask.toString(2).replaceAll('0', '').length > homeGoals) continue;
        const namedScorers = new Set(scorerPlayers
          .filter((_, index) => mask & (1 << index)).map(({ id }) => id));
        let scorerPoints = 0;
        for (const { id, win, loss } of scorerPayouts) {
          scorerPoints += (id === 'none-listed' ? namedScorers.size === 0
            : namedScorers.has(id)) ? win : loss;
        }

        // With one Lancers goal, an assist cannot outrank a different selected
        // top-three scorer; the best is a tied (void) top-points question.
        const otherTopScored = questions.topPoints.options.some(({ id }) =>
          id !== picks.topPoints && namedScorers.has(id));
        const topPoints = homeGoals === 0 || (homeGoals === 1 && otherTopScored)
          ? 0 : topWin;
        maximum = Math.max(maximum,
          outcomePoints + firstGoalPoints + totalPoints + scorerPoints + topPoints);
      }
    }
  }
  return Math.round(maximum * 10) / 10;
}

export const maxPotentialPoints = maxPossiblePoints;
