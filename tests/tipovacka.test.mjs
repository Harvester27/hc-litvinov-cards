import assert from 'node:assert/strict';
import test from 'node:test';
import {
  TIPOVACKA_ROUND,
  isCompletePicks,
  riskOutcome,
  scoreRound,
} from '../src/lib/tipovacka.mjs';

const picks = {
  outcome: 'lancers',
  scorer: 'marian-dlugopolsky',
  topPoints: 'pavel-novak',
  firstGoal: 'lancers',
  totalGoals: 5,
};
const result = {
  homeGoals: 3,
  awayGoals: 2,
  scorerIds: ['marian-dlugopolsky'],
  playerPoints: {
    'pavel-novak': 2,
    'marian-dlugopolsky': 1,
    'gustav-toman': 0,
  },
  firstGoalTeam: 'lancers',
  didNotPlayIds: [],
};

test('published odds show net gains and the full loss before placing a tip', () => {
  assert.deepEqual(riskOutcome(1.4), { win: 4, loss: -10 });
  assert.deepEqual(riskOutcome(2.2), { win: 12, loss: -10 });
  assert.deepEqual(riskOutcome(5), { win: 40, loss: -10 });
  assert.throws(() => riskOutcome(0.9), RangeError);
  assert.deepEqual(TIPOVACKA_ROUND.questions.scorer.options.map(({ id }) => id), [
    'jan-schubada', 'marian-dlugopolsky', 'lubos-coufal', 'jan-hanus', 'jiri-salanda',
  ]);
});

test('all five correct answers sum their net gains without subtracting a stake twice', () => {
  const beforePicks = structuredClone(picks);
  const beforeResult = structuredClone(result);
  const scored = scoreRound(picks, result);
  assert.deepEqual(Object.fromEntries(Object.entries(scored.breakdown).map(([key, value]) => [key, value.points])), {
    outcome: 4,
    scorer: 30,
    topPoints: 6,
    firstGoal: 5,
    totalGoals: 18,
  });
  assert.equal(scored.total, 63);
  assert.deepEqual(picks, beforePicks);
  assert.deepEqual(result, beforeResult);
});

test('three wrong risk questions can put a player at minus thirty; free tips never subtract', () => {
  const scored = scoreRound(picks, {
    ...result,
    homeGoals: 2,
    awayGoals: 4,
    scorerIds: [],
    playerPoints: {
      'pavel-novak': 0,
      'marian-dlugopolsky': 0,
      'gustav-toman': 2,
    },
    firstGoalTeam: 'wolves',
  });
  assert.equal(scored.total, -30);
  assert.deepEqual(Object.values(scored.breakdown).map(({ points }) => points), [-10, -10, -10, 0, 0]);
});

test('draw uses goal totals excluding shootout winner and 0:0 has no first-goal loser', () => {
  const draw = scoreRound({ ...picks, outcome: 'draw', totalGoals: 4 }, {
    ...result,
    homeGoals: 2,
    awayGoals: 2,
    shootoutWinner: 'wolves',
  });
  assert.equal(draw.breakdown.outcome.points, 40);
  assert.equal(draw.breakdown.totalGoals.points, 18);

  const nilNil = scoreRound({ ...picks, outcome: 'draw', totalGoals: 0 }, {
    ...result,
    homeGoals: 0,
    awayGoals: 0,
    scorerIds: [],
    playerPoints: {
      'pavel-novak': 0,
      'marian-dlugopolsky': 0,
      'gustav-toman': 0,
    },
    firstGoalTeam: null,
  });
  assert.equal(nilNil.breakdown.firstGoal.status, 'void');
  assert.equal(nilNil.breakdown.firstGoal.points, 0);
});

test('a tie among the three point leaders voids that question for any selected player', () => {
  const scored = scoreRound(picks, {
    ...result,
    playerPoints: {
      ...result.playerPoints,
      'marian-dlugopolsky': 2,
    },
  });
  assert.equal(scored.breakdown.topPoints.status, 'void');
  assert.equal(scored.breakdown.topPoints.points, 0);
});

test('a chosen player who never plays does not lose the risk stake', () => {
  const scored = scoreRound(picks, {
    ...result,
    scorerIds: [],
    didNotPlayIds: ['marian-dlugopolsky', 'pavel-novak'],
    playerPoints: { 'gustav-toman': 1 },
  });
  assert.equal(scored.breakdown.scorer.status, 'void');
  assert.equal(scored.breakdown.topPoints.status, 'void');
  assert.equal(scored.breakdown.scorer.points + scored.breakdown.topPoints.points, 0);
});

test('invalid or incomplete picks and unverified results cannot be scored', () => {
  assert.equal(isCompletePicks(picks), true);
  assert.equal(isCompletePicks({ ...picks, totalGoals: 31 }), false);
  assert.equal(isCompletePicks({ ...picks, firstGoal: 'both' }), false);
  assert.equal(isCompletePicks({ ...picks, scorer: null }), false);
  assert.throws(() => scoreRound({ ...picks, totalGoals: 31 }, result));
  assert.throws(() => scoreRound(picks, { ...result, homeGoals: -1 }), RangeError);
  assert.throws(() => scoreRound(picks, { ...result, firstGoalTeam: null }));
  assert.throws(() => scoreRound(picks, { ...result, playerPoints: {} }), RangeError);
  assert.throws(() => scoreRound(picks, {
    ...result,
    didNotPlayIds: ['marian-dlugopolsky'],
  }));
});

test('impossible first-goal and Lancers scorer data is rejected before awarding points', () => {
  assert.throws(() => scoreRound(picks, {
    ...result,
    homeGoals: 0,
    awayGoals: 2,
    scorerIds: [],
    firstGoalTeam: 'lancers',
  }), /První gól/);
  assert.throws(() => scoreRound(picks, {
    ...result,
    homeGoals: 2,
    awayGoals: 0,
    firstGoalTeam: 'wolves',
  }), /První gól/);
  assert.throws(() => scoreRound(picks, {
    ...result,
    homeGoals: 0,
    scorerIds: ['marian-dlugopolsky'],
  }), /Seznam střelců/);
  assert.throws(() => scoreRound(picks, {
    ...result,
    scorerIds: ['marian-dlugopolsky', 'marian-dlugopolsky'],
  }), /Seznam střelců/);
});
