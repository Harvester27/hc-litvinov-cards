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
  outcome: 'lancers', scorer, topPoints: 'pavel-novak',
  firstGoal: 'lancers', totalGoals: 5,
};
const result = {
  homeGoals: 3, awayGoals: 2, scorerIds: ['marian-dlugopolsky'],
  playerPoints: { 'pavel-novak': 2, 'marian-dlugopolsky': 1, 'gustav-toman': 0 },
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

test('single scorer selection preserves the original 63-point ticket', () => {
  const beforePicks = structuredClone(picks);
  const beforeResult = structuredClone(result);
  const scored = scoreRound(picks, result);
  assert.deepEqual(Object.fromEntries(Object.entries(scored.breakdown)
    .map(([key, value]) => [key, value.points])), {
    outcome: 4, scorer: 30, topPoints: 6, firstGoal: 5, totalGoals: 18,
  });
  assert.equal(scored.total, 63);
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
  assert.equal(scored.total, 39.4);
});

test('two points on each of five scorers can all hit', () => {
  const everyPlayer = { ...picks, scorer: {
    'jan-schubada': 2, 'marian-dlugopolsky': 2, 'lubos-coufal': 2,
    'jan-hanus': 2, 'jiri-salanda': 2, 'none-listed': 0,
  } };
  const scored = scoreRound(everyPlayer, {
    ...result, homeGoals: 5, awayGoals: 0,
    scorerIds: TIPOVACKA_ROUND.questions.scorer.options.slice(0, 5).map(({ id }) => id),
    playerPoints: { ...result.playerPoints, 'pavel-novak': 5 },
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

test('all three risky questions can miss for minus thirty', () => {
  const scored = scoreRound(picks, {
    ...result, homeGoals: 2, awayGoals: 4, scorerIds: [],
    playerPoints: { 'pavel-novak': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 2 },
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
    didNotPlayIds: ['marian-dlugopolsky', 'pavel-novak'],
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
    playerPoints: { 'pavel-novak': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
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
  assert.equal(maxPossiblePoints(picks), 63);
  const named = {
    outcome: 'draw', scorer: { ...scorer,
      'jan-schubada': 10, 'marian-dlugopolsky': 0 },
    topPoints: 'pavel-novak', firstGoal: 'lancers', totalGoals: 2,
  };
  assert.equal(maxPossiblePoints(named), 75);
  assert.equal(scoreRound(named, {
    homeGoals: 1, awayGoals: 1, scorerIds: ['jan-schubada'],
    playerPoints: { 'pavel-novak': 1, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: 'lancers', didNotPlayIds: [],
  }).total, 75);
  const scoreless = { ...named, scorer: { ...scorer,
    'marian-dlugopolsky': 0, 'none-listed': 10 },
    firstGoal: 'wolves', totalGoals: 0 };
  assert.equal(maxPossiblePoints(scoreless), 118);
  assert.equal(scoreRound(scoreless, {
    homeGoals: 0, awayGoals: 0, scorerIds: [],
    playerPoints: { 'pavel-novak': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
    firstGoalTeam: null, didNotPlayIds: [],
  }).total, 118);
});

test('impossible results fail before any payout', () => {
  assert.throws(() => scoreRound(picks, { ...result, homeGoals: -1 }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result, firstGoalTeam: null }));
  assert.throws(() => scoreRound(picks, { ...result, playerPoints: {} }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result,
    playerPoints: { ...result.playerPoints, 'pavel-novak': 4 } }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result, scorerIds: ['unknown'] }), /vypsanou pětici/);
  assert.throws(() => scoreRound(picks, { ...result,
    didNotPlayIds: ['marian-dlugopolsky'] }));
  assert.throws(() => scoreRound(picks, { ...result,
    homeGoals: 0, awayGoals: 2, scorerIds: [], firstGoalTeam: 'lancers',
    playerPoints: { 'pavel-novak': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
  }), /První gól/);
  assert.throws(() => scoreRound(picks, { ...result,
    scorerIds: ['marian-dlugopolsky', 'marian-dlugopolsky'] }), /Seznam střelců/);
});
