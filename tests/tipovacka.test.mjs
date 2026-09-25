import assert from 'node:assert/strict';
import test from 'node:test';
import {
  TIPOVACKA_ROUND, isCompletePicks, maxPossiblePoints,
  riskOutcome, scorerStakeOutcome, scoreRound,
} from '../src/lib/tipovacka.mjs';

const scorer = {
  'jan-schubada': 0, 'marian-dlugopolsky': 10, 'lubos-coufal': 0,
  'jan-hanus': 0, 'jiri-salanda': 0, 'none-listed': 0,
};
const picks = {
  outcome: 'lancers', scorer, topPoints: 'tomas-turecek',
  firstGoal: 'lancers', totalGoals: 5,
};
const result = {
  homeGoals: 3, awayGoals: 2, scorerIds: ['marian-dlugopolsky'],
  playerPoints: { 'tomas-turecek': 2, 'marian-dlugopolsky': 1, 'gustav-toman': 0 },
  firstGoalTeam: 'lancers', didNotPlayIds: [],
};

test('six scorer odds and allocated stakes pay net gains in tenths', () => {
  assert.deepEqual(riskOutcome(1.4), { win: 4, loss: -10 });
  assert.deepEqual(scorerStakeOutcome(3, 1.6), { win: 1.8, loss: -3 });
  assert.deepEqual(scorerStakeOutcome(1, 1.3), { win: 0.3, loss: -1 });
  assert.deepEqual(scorerStakeOutcome(10, 7), { win: 60, loss: -10 });
  assert.throws(() => scorerStakeOutcome(1.5, 2), RangeError);
  assert.equal(TIPOVACKA_ROUND.questions.scorer.options.at(-1).id, 'none-listed');
});

test('Tomáš Tureček at 2.9 pays 19 points on a winning ten-point pick', () => {
  const beforePicks = structuredClone(picks);
  const beforeResult = structuredClone(result);
  const scored = scoreRound(picks, result);
  assert.deepEqual(Object.fromEntries(Object.entries(scored.breakdown)
    .map(([key, value]) => [key, value.points])), {
    outcome: 4, scorer: 30, topPoints: 19, firstGoal: 5, totalGoals: 18,
  });
  assert.equal(scored.total, 76);
  assert.deepEqual(picks, beforePicks);
  assert.deepEqual(result, beforeResult);
});

test('all five named scorers can receive stakes, with multiple goals scored', () => {
  const split = { ...picks, scorer: {
    'jan-schubada': 2, 'marian-dlugopolsky': 3, 'lubos-coufal': 2,
    'jan-hanus': 1, 'jiri-salanda': 2, 'none-listed': 0,
  } };
  const scored = scoreRound(split, {
    ...result, scorerIds: ['marian-dlugopolsky', 'lubos-coufal'],
  });
  assert.equal(scored.breakdown.scorer.status, 'mixed');
  assert.deepEqual(scored.breakdown.scorer.lines.map(({ id, points }) => [id, points]), [
    ['jan-schubada', -2], ['marian-dlugopolsky', 9],
    ['lubos-coufal', 2.4], ['jan-hanus', -1],
    ['jiri-salanda', -2],
  ]);
  assert.equal(scored.breakdown.scorer.points, 6.4);
  assert.equal(scored.total, 52.4);
});

test('two points on each of five scorers can all hit', () => {
  const everyPlayer = { ...picks, scorer: {
    'jan-schubada': 2, 'marian-dlugopolsky': 2, 'lubos-coufal': 2,
    'jan-hanus': 2, 'jiri-salanda': 2, 'none-listed': 0,
  } };
  const scored = scoreRound(everyPlayer, {
    ...result, homeGoals: 5, awayGoals: 0,
    scorerIds: TIPOVACKA_ROUND.questions.scorer.options.slice(0, 5).map(({ id }) => id),
    playerPoints: { ...result.playerPoints, 'tomas-turecek': 5 },
  });
  assert.equal(scored.breakdown.scorer.status, 'hit');
  assert.equal(scored.breakdown.scorer.points, 12.2);
});

test('nobody listed wins even if another Lancers player scores', () => {
  const nobody = { ...picks, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10 } };
  const scored = scoreRound(nobody, {
    ...result, scorerIds: [],
    playerPoints: { ...result.playerPoints, 'marian-dlugopolsky': 0 },
  });
  assert.equal(scored.breakdown.scorer.points, 60);
});

test('nobody listed is void when all five candidates did not play', () => {
  const nobody = { ...picks, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10 } };
  const absent = TIPOVACKA_ROUND.questions.scorer.options
    .filter(({ id }) => id !== 'none-listed').map(({ id }) => id);
  const scored = scoreRound(nobody, {
    ...result, scorerIds: [], didNotPlayIds: absent,
    playerPoints: { ...result.playerPoints, 'marian-dlugopolsky': 0 },
  });
  assert.equal(scored.breakdown.scorer.status, 'void');
  assert.equal(scored.breakdown.scorer.points, 0);
  assert.deepEqual(scored.breakdown.scorer.lines, [{
    pick: 'none-listed', status: 'void', points: 0,
    reason: 'Nikdo z uvedené pětice do zápasu nenastoupil.',
    id: 'none-listed', stake: 10,
  }]);
  assert.equal(scored.total, 46);
});

test('one participating scorer keeps nobody-listed active for both a hit and a miss', () => {
  const nobody = { ...picks, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10 } };
  const players = TIPOVACKA_ROUND.questions.scorer.options
    .filter(({ id }) => id !== 'none-listed').map(({ id }) => id);
  for (const participating of players) {
    const onlyOnePlaying = {
      ...result, didNotPlayIds: players.filter((id) => id !== participating),
      playerPoints: { ...result.playerPoints, 'marian-dlugopolsky': participating === 'marian-dlugopolsky' ? 1 : 0 },
    };
    const hit = scoreRound(nobody, { ...onlyOnePlaying, scorerIds: [] });
    assert.equal(hit.breakdown.scorer.status, 'hit', participating);
    assert.equal(hit.breakdown.scorer.points, 60, participating);
    const miss = scoreRound(nobody, { ...onlyOnePlaying, scorerIds: [participating] });
    assert.equal(miss.breakdown.scorer.status, 'miss', participating);
    assert.equal(miss.breakdown.scorer.points, -10, participating);
  }
});

test('all three risky questions can miss for minus thirty', () => {
  const scored = scoreRound(picks, {
    ...result, homeGoals: 2, awayGoals: 4, scorerIds: [],
    playerPoints: { 'tomas-turecek': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 2 },
    firstGoalTeam: 'wolves',
  });
  assert.equal(scored.total, -30);
  assert.deepEqual(Object.values(scored.breakdown).map(({ points }) => points),
    [-10, -10, -10, 0, 0]);
});

test('a nonparticipant voids only their scorer stake', () => {
  const split = { ...picks, scorer: { ...scorer,
    'jan-schubada': 5, 'marian-dlugopolsky': 5 } };
  const scored = scoreRound(split, {
    ...result, scorerIds: ['jan-schubada'],
    didNotPlayIds: ['marian-dlugopolsky', 'tomas-turecek'],
    playerPoints: { 'gustav-toman': 1 },
  });
  assert.equal(scored.breakdown.scorer.points, 3);
  assert.equal(scored.breakdown.scorer.lines.find((line) =>
    line.id === 'marian-dlugopolsky').status, 'void');
  assert.equal(scored.breakdown.topPoints.status, 'void');
});

test('draw after shootout and 0:0 retain their original handling', () => {
  const draw = scoreRound({ ...picks, outcome: 'draw', totalGoals: 4 }, {
    ...result, homeGoals: 2, awayGoals: 2, shootoutWinner: 'wolves',
  });
  assert.equal(draw.breakdown.outcome.points, 40);
  const zero = scoreRound({ ...picks, outcome: 'draw', totalGoals: 0 }, {
    ...result, homeGoals: 0, awayGoals: 0, scorerIds: [],
    playerPoints: { 'tomas-turecek': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: null,
  });
  assert.equal(zero.breakdown.firstGoal.status, 'void');
  assert.equal(zero.breakdown.topPoints.status, 'void');
});

test('a tie for top scorer points voids the top-points question', () => {
  const scored = scoreRound(picks, {
    ...result, playerPoints: { ...result.playerPoints, 'marian-dlugopolsky': 2 },
  });
  assert.equal(scored.breakdown.topPoints.status, 'void');
});

test('the entire top-points question is void with zero or one participant, for every pick', () => {
  const candidates = TIPOVACKA_ROUND.questions.topPoints.options.map(({ id }) => id);
  for (const participating of [null, ...candidates]) {
    const roundResult = {
      ...result, scorerIds: [],
      didNotPlayIds: candidates.filter((id) => id !== participating),
      playerPoints: participating ? { [participating]: 3 } : {},
    };
    for (const topPoints of candidates) {
      const scored = scoreRound({ ...picks, topPoints }, roundResult);
      assert.deepEqual(scored.breakdown.topPoints, {
        pick: topPoints, status: 'void', points: 0,
        reason: 'Z vypsané trojice nastoupil nejvýše jeden hráč.',
      });
    }
  }
});

test('two top-points participants still compete and a third absent pick is void', () => {
  const twoPlayers = {
    ...result, scorerIds: [], didNotPlayIds: ['marian-dlugopolsky'],
    playerPoints: { 'tomas-turecek': 2, 'gustav-toman': 1 },
  };
  const winner = scoreRound(picks, twoPlayers).breakdown.topPoints;
  assert.equal(winner.status, 'hit');
  assert.equal(winner.points, 19);
  const loser = scoreRound({ ...picks, topPoints: 'gustav-toman' }, twoPlayers).breakdown.topPoints;
  assert.equal(loser.status, 'miss');
  assert.equal(loser.points, -10);
  const absent = scoreRound({ ...picks, topPoints: 'marian-dlugopolsky' }, twoPlayers).breakdown.topPoints;
  assert.equal(absent.status, 'void');
  assert.equal(absent.reason, 'Hráč do zápasu nenastoupil.');
  const tied = scoreRound(picks, {
    ...twoPlayers, playerPoints: { 'tomas-turecek': 2, 'gustav-toman': 2 },
  }).breakdown.topPoints;
  assert.equal(tied.status, 'void');
  assert.equal(tied.reason, 'O nejvyšší počet bodů se hráči dělí.');
});

test('allocation needs six integer values adding to exactly ten', () => {
  assert.equal(isCompletePicks(picks), true);
  for (const invalid of [
    'marian-dlugopolsky',
    { ...scorer, 'none-listed': 1 },
    { ...scorer, 'marian-dlugopolsky': 9.5, 'none-listed': 0.5 },
    { ...scorer, unknown: 0 },
    { ...scorer, 'jan-schubada': -1, 'marian-dlugopolsky': 11 },
  ]) assert.equal(isCompletePicks({ ...picks, scorer: invalid }), false);
  assert.equal(isCompletePicks({ ...picks, totalGoals: 31 }), false);
  assert.equal(isCompletePicks({ ...picks, firstGoal: 'both' }), false);
});

test('nobody listed cannot share a stake with named scorers', () => {
  const mixed = { ...picks, scorer: { ...scorer,
    'marian-dlugopolsky': 5, 'none-listed': 5,
  } };
  assert.equal(isCompletePicks(mixed), false);
  assert.throws(() => scoreRound(mixed, result), /platných odpovědí/);
  assert.throws(() => maxPossiblePoints(mixed), /platných odpovědí/);
  const nobody = { ...picks, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10,
  } };
  assert.equal(isCompletePicks(nobody), true);
});

test('maximum is feasible for both named scorers and nobody listed', () => {
  assert.equal(maxPossiblePoints(picks), 76);
  const named = {
    outcome: 'draw', scorer: { ...scorer,
      'jan-schubada': 10, 'marian-dlugopolsky': 0 },
    topPoints: 'tomas-turecek', firstGoal: 'lancers', totalGoals: 2,
  };
  assert.equal(maxPossiblePoints(named), 88);
  assert.equal(scoreRound(named, {
    homeGoals: 1, awayGoals: 1, scorerIds: ['jan-schubada'],
    playerPoints: { 'tomas-turecek': 1, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: 'lancers', didNotPlayIds: [],
  }).total, 88);
  const nobodyListed = { ...named, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10 },
    firstGoal: 'wolves', totalGoals: 0 };
  assert.equal(maxPossiblePoints(nobodyListed), 124);
  assert.equal(scoreRound(nobodyListed, {
    homeGoals: 2, awayGoals: 2, scorerIds: [],
    playerPoints: { 'tomas-turecek': 1, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: 'wolves', didNotPlayIds: [],
  }).total, 124);
  assert.equal(scoreRound(nobodyListed, {
    homeGoals: 0, awayGoals: 0, scorerIds: [],
    playerPoints: { 'tomas-turecek': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: null, didNotPlayIds: [],
  }).total, 118);
});

test('impossible results fail before any payout', () => {
  assert.throws(() => scoreRound(picks, { ...result, homeGoals: -1 }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result, firstGoalTeam: null }));
  assert.throws(() => scoreRound(picks, { ...result, playerPoints: {} }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result,
    playerPoints: { ...result.playerPoints, 'tomas-turecek': 4 } }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result, scorerIds: ['unknown'] }), /vypsanou pětici/);
  assert.throws(() => scoreRound(picks, { ...result,
    didNotPlayIds: ['marian-dlugopolsky'] }));
  assert.throws(() => scoreRound(picks, { ...result,
    homeGoals: 0, awayGoals: 2, scorerIds: [], firstGoalTeam: 'lancers',
    playerPoints: { 'tomas-turecek': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
  }), /První gól/);
  assert.throws(() => scoreRound(picks, { ...result,
    scorerIds: ['marian-dlugopolsky', 'marian-dlugopolsky'] }), /Seznam střelců/);
});
