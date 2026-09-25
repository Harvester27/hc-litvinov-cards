import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiError, ROUND_ID, officialResult, evaluationsFromTickets, normalizeTicket,
  addPreviousEvaluations, ticketFingerprint, assertRoundStarted } from '../src/lib/tipovacka-publication.mjs';
import { firebaseConfiguration, publicationNow } from '../src/app/api/tipovacka/_server.js';

const picks = { outcome: 'lancers', scorer: 'marian-dlugopolsky', topPoints: 'tomas-turecek',
  firstGoal: 'lancers', totalGoals: 5 };
const result = { homeGoals: 3, awayGoals: 2, scorerIds: ['marian-dlugopolsky'],
  playerPoints: { 'tomas-turecek': 2, 'marian-dlugopolsky': 1, 'gustav-toman': 0 },
  firstGoalTeam: 'lancers', didNotPlayIds: [] };
const ticket = (id, value = picks) => ({ id, data: () => ({ roundId: ROUND_ID, picks: value }) });

test('legacy admin picks normalize without changing saved input', () => {
  const original = structuredClone(picks);
  const normalized = normalizeTicket(picks);
  assert.equal(normalized.scorer['marian-dlugopolsky'], 10);
  assert.deepEqual(picks, original);
  assert.equal(normalizeTicket({ ...picks, scorer: 'none-listed' }).scorer['none-listed'], 10);
});

test('one invalid ticket blocks evaluation rather than silently excluding its player', () => {
  assert.throws(() => evaluationsFromTickets([ticket('valid'), ticket('broken', {})], result),
    (error) => error instanceof ApiError && error.status === 409 && /broken/.test(error.message));
  assert.equal(evaluationsFromTickets([ticket('valid')], result)[0].total, 76);
});

test('official result rejects unknown fields, unknown nonparticipants and impossible points', () => {
  for (const invalid of [{ ...result, extra: 1 }, { ...result, playerPoints: [] },
    { ...result, didNotPlayIds: ['unknown'] }, { ...result, didNotPlayIds: ['tomas-turecek'] },
    { ...result, homeGoals: 101 }, { ...result, playerPoints: { ...result.playerPoints, 'gustav-toman': 4 } }]) {
    assert.throws(() => officialResult(invalid), (error) => error.status === 400);
  }
  assert.deepEqual(officialResult(result), result);
});

test('corrections preserve the original participants and picks, expose only score deltas', () => {
  const evaluations = evaluationsFromTickets([ticket('player')], result);
  const prior = [{ id: 'player', data: () => ({ ...evaluations[0], total: 70.4 }) }];
  assert.equal(addPreviousEvaluations(evaluations, prior, true)[0].delta, 5.6);
  assert.throws(() => addPreviousEvaluations(evaluations, [], true), /Seznam tiketů/);
  assert.throws(() => addPreviousEvaluations(evaluations, [{ id: 'player',
    data: () => ({ total: 70.4, picks: { ...picks, totalGoals: 1 } }) }], true), /změnil/);
});

test('snapshot fingerprint is stable in ticket order and changes when a ticket changes', () => {
  assert.equal(ticketFingerprint([ticket('a'), ticket('b')]), ticketFingerprint([ticket('b'), ticket('a')]));
  assert.notEqual(ticketFingerprint([ticket('a')]), ticketFingerprint([ticket('a', { ...picks, totalGoals: 4 })]));
  assert.throws(() => assertRoundStarted(Date.parse('2026-09-26T17:14:59.999Z')), /začátku/);
  assert.doesNotThrow(() => assertRoundStarted(Date.parse('2026-09-26T17:15:00.000Z')));
});

test('emulator configuration cannot bypass production or use a real project', () => {
  const env = { NODE_ENV: 'test', GCLOUD_PROJECT: 'demo-lancers-tipovacka',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099' };
  assert.equal(firebaseConfiguration(env).emulator, true);
  for (const invalid of [{ ...env, NODE_ENV: 'production' }, { ...env, GCLOUD_PROJECT: 'lancers-web-cards-2026' },
    { ...env, FIREBASE_AUTH_EMULATOR_HOST: '' }, { ...env, FIRESTORE_EMULATOR_HOST: 'remote.example:8080' }]) {
    assert.throws(() => firebaseConfiguration(invalid), (error) => error.status === 503);
  }
  assert.throws(() => firebaseConfiguration({}), (error) => error.status === 503);
});

test('test clock is limited to both loopback emulators in a non-production demo project', () => {
  const env = { NODE_ENV: 'test', GCLOUD_PROJECT: 'demo-lancers-tipovacka',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
    TIPOVACKA_EMULATOR_NOW: '2026-09-26T21:15:00.000Z' };
  assert.equal(publicationNow(env), Date.parse(env.TIPOVACKA_EMULATOR_NOW));
  for (const invalid of [{ ...env, NODE_ENV: 'production' },
    { ...env, GCLOUD_PROJECT: 'lancers-web-cards-2026' },
    { ...env, FIREBASE_AUTH_EMULATOR_HOST: '' }, { ...env, TIPOVACKA_EMULATOR_NOW: 'tomorrow' },
    { NODE_ENV: 'production', TIPOVACKA_EMULATOR_NOW: env.TIPOVACKA_EMULATOR_NOW,
      FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({ project_id: 'lancers-web-cards-2026',
        client_email: 'configured@example.test', private_key: 'configured' }) }]) {
    assert.throws(() => publicationNow(invalid), (error) => error.status === 503);
  }
});
