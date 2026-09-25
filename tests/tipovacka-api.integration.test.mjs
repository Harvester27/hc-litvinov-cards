import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { POST as preview } from '../src/app/api/tipovacka/preview/route.js';
import { POST as publish } from '../src/app/api/tipovacka/publish/route.js';
import { GET as tickets } from '../src/app/api/tipovacka/tickets/route.js';
import { ROUND_ID, ADMIN_EMAIL, normalizeTicket } from '../src/lib/tipovacka-publication.mjs';

const projectId = process.env.GCLOUD_PROJECT;
if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST
  || !projectId?.startsWith('demo-') || process.env.NODE_ENV === 'production') {
  throw new Error('Integration tests require both local emulators, a demo project and non-production NODE_ENV.');
}
const app = initializeApp({ projectId }, 'tipovacka-api-tests');
const store = getFirestore(app);
const auth = getAuth(app);
const kickoff = Date.parse('2026-09-26T17:15:00.000Z');
const actors = [
  { uid: 'api-admin', email: ADMIN_EMAIL, emailVerified: true, displayName: 'Administrátor' },
  { uid: 'api-player-a', email: 'api-player-a@example.test', emailVerified: true, displayName: 'Hráč A' },
  { uid: 'api-player-b', email: 'api-player-b@example.test', emailVerified: true, displayName: 'Hráč B' },
];
const basePicks = { outcome: 'lancers', scorer: 'marian-dlugopolsky', topPoints: 'tomas-turecek',
  firstGoal: 'lancers', totalGoals: 5 };
const result = { homeGoals: 3, awayGoals: 2, scorerIds: ['marian-dlugopolsky'],
  playerPoints: { 'tomas-turecek': 2, 'marian-dlugopolsky': 1, 'gustav-toman': 0 },
  firstGoalTeam: 'lancers', didNotPlayIds: [] };
const changedResult = { ...result, homeGoals: 4, scorerIds: [],
  playerPoints: { 'tomas-turecek': 0, 'marian-dlugopolsky': 0, 'gustav-toman': 1 },
  didNotPlayIds: ['jan-schubada', 'marian-dlugopolsky', 'lubos-coufal', 'jan-hanus', 'jiri-salanda', 'tomas-turecek'] };

// Unsigned tokens are accepted only by the Auth emulator. A long expiry lets a
// mocked wall clock exercise the real route's deadline without an app bypass.
function token(actor, overrides = {}) {
  const nowSeconds = Math.floor(new Date().getTime() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ iss: `https://securetoken.google.com/${projectId}`,
    aud: projectId, sub: actor.uid, user_id: actor.uid, uid: actor.uid,
    iat: nowSeconds, auth_time: nowSeconds, exp: nowSeconds + 365 * 86400,
    email: actor.email, email_verified: actor.emailVerified, name: actor.displayName,
    firebase: { sign_in_provider: 'password', identities: { email: [actor.email] } }, ...overrides })}.`;
}
const request = (actor, body, overrides) => new Request('http://localhost/api/tipovacka/test', {
  method: body === undefined ? 'GET' : 'POST',
  headers: { ...(actor ? { Authorization: `Bearer ${token(actor, overrides)}` } : {}), 'Content-Type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
async function call(handler, actor, body, status = 200, overrides) {
  const response = await handler(request(actor, body, overrides));
  const data = await response.json();
  assert.equal(response.status, status, JSON.stringify(data));
  return data;
}
async function clearRound() {
  for (const collection of ['tipovackaRounds', 'tipovackaAdminPreviews', 'tipovackaPreview', 'tipovackaStandings']) {
    await store.recursiveDelete(store.collection(collection));
  }
}
async function seed() {
  await clearRound();
  for (const [index, actor] of actors.entries()) {
    await store.collection('tipovackaStandings').doc(actor.uid).set({
      displayName: actor.displayName, totalPoints: 100, roundsPlayed: 2,
      joinedAt: Timestamp.fromMillis(kickoff - 100_000),
    });
    const picks = index === 1 ? { ...basePicks, scorer: normalizeTicket({ ...basePicks, scorer: 'none-listed' }).scorer }
      : index === 2 ? normalizeTicket({ ...basePicks, topPoints: 'gustav-toman' }) : basePicks;
    await store.collection('tipovackaPreview').doc(actor.uid).set({ roundId: ROUND_ID, picks,
      updatedAt: Timestamp.fromMillis(kickoff - 10_000) });
  }
}
before(async () => {
  for (const actor of actors) {
    try { await auth.deleteUser(actor.uid); } catch (error) { if (error.code !== 'auth/user-not-found') throw error; }
    await auth.createUser(actor);
  }
});
after(async () => { await clearRound(); await deleteApp(app); });

test('real API routes: admin authorization, preview, atomic scoring and controlled correction', async (t) => {
  await seed();
  t.mock.method(Date, 'now', () => kickoff + 4 * 60 * 60 * 1000);
  await t.test('only the verified designated admin can read tickets or invoke either write endpoint', async () => {
    for (const handler of [tickets, preview, publish]) {
      const body = handler === tickets ? undefined : { result, finalConfirmed: true };
      await call(handler, null, body, 401);
      for (const actor of actors.slice(1)) await call(handler, actor, body, 403);
      await call(handler, actors[0], body, 403, { email_verified: false });
    }
    const list = await call(tickets, actors[0]);
    assert.equal(list.tickets.length, 3);
    assert.equal(list.publicationBlocked, false);
    assert.equal(list.tickets.find(({ uid }) => uid === 'api-admin').picks.scorer['marian-dlugopolsky'], 10);
  });
  await t.test('cutoff, explicit final-result confirmation and valid scores are enforced on server', async () => {
    Date.now.mock.mockImplementation(() => kickoff - 1);
    await call(preview, actors[0], { result, finalConfirmed: true }, 409);
    await call(publish, actors[0], { previewId: 'anything', confirmPreview: true }, 409);
    Date.now.mock.mockImplementation(() => kickoff + 4 * 60 * 60 * 1000);
    await call(preview, actors[0], { result }, 400);
    await call(preview, actors[0], { result: { ...result, homeGoals: -1 }, finalConfirmed: true }, 400);
    await call(publish, actors[0], { result, previewEvaluations: [] }, 400);
  });
  let first;
  let competing;
  await t.test('server preview changes no player points; invalid or changed tickets block publication', async () => {
    first = await call(preview, actors[0], { result, finalConfirmed: true });
    assert.equal(first.evaluatedCount, 3);
    assert.equal((await store.collection('tipovackaStandings').doc('api-admin').get()).data().totalPoints, 100);
    const originalTicket = (await store.collection('tipovackaPreview').doc('api-player-b').get()).data();
    for (const malformed of [{ picks: originalTicket.picks },
      { ...originalTicket, roundId: 'wrong-round' },
      { ...originalTicket, picks: { ...originalTicket.picks, unknown: 1 } }]) {
      await store.collection('tipovackaPreview').doc('api-player-b').set(malformed);
      const listing = await call(tickets, actors[0]);
      assert.equal(listing.publicationBlocked, true);
      await call(preview, actors[0], { result, finalConfirmed: true }, 409);
      await call(publish, actors[0], { previewId: first.previewId, confirmPreview: true }, 409);
    }
    await store.collection('tipovackaPreview').doc('api-player-b').update({ picks: {} });
    await call(preview, actors[0], { result, finalConfirmed: true }, 409);
    await call(publish, actors[0], { previewId: first.previewId, confirmPreview: true }, 409);
    assert.equal((await store.collection('tipovackaRounds').doc(ROUND_ID).get()).exists, false);
    await store.collection('tipovackaPreview').doc('api-player-b').update({
      picks: normalizeTicket({ ...basePicks, topPoints: 'gustav-toman' }), updatedAt: Timestamp.fromMillis(kickoff - 1),
    });
    await call(publish, actors[0], { previewId: first.previewId, confirmPreview: true }, 409);
    first = await call(preview, actors[0], { result, finalConfirmed: true });
    competing = await call(preview, actors[0], { result, finalConfirmed: true });
    await call(publish, actors[0], { previewId: first.previewId }, 400);
  });
  await t.test('concurrent retries publish once, competing preview is stale and original ticket is preserved', async () => {
    const legacyBefore = (await store.collection('tipovackaPreview').doc('api-admin').get()).data();
    const responses = await Promise.all([1, 2].map(() => call(publish, actors[0], { previewId: first.previewId, confirmPreview: true })));
    assert.equal(responses.filter(({ alreadyApplied }) => !alreadyApplied).length, 1);
    await call(publish, actors[0], { previewId: competing.previewId, confirmPreview: true }, 409);
    for (const evaluation of first.evaluations) {
      const standing = (await store.collection('tipovackaStandings').doc(evaluation.uid).get()).data();
      assert.equal(standing.totalPoints, 100 + evaluation.total);
      assert.equal(standing.roundsPlayed, 3);
    }
    assert.deepEqual((await store.collection('tipovackaPreview').doc('api-admin').get()).data(), legacyBefore);
    assert.equal((await store.collection('tipovackaRounds').doc(ROUND_ID).collection('revisions').get()).size, 1);
  });
  await t.test('correction requires a reason, voids nonparticipants and applies only deltas with audit history', async () => {
    await call(preview, actors[0], { result: changedResult, finalConfirmed: true }, 400);
    const correction = await call(preview, actors[0], { result: changedResult, finalConfirmed: true,
      correctionReason: 'Oprava účasti hráčů podle konečného zápisu.' });
    assert.equal(correction.mode, 'correct');
    assert.equal(correction.baseRevision, 1);
    assert.equal(correction.evaluations.find(({ uid }) => uid === 'api-player-a').breakdown.scorer.status, 'void');
    assert.ok(correction.evaluations.every(({ breakdown }) => breakdown.topPoints.status === 'void'));
    for (const evaluation of correction.evaluations) {
      assert.equal(evaluation.delta, Math.round((evaluation.total - first.evaluations.find(({ uid }) => uid === evaluation.uid).total) * 10) / 10);
    }
    const beforeRound = (await store.collection('tipovackaRounds').doc(ROUND_ID).get()).data();
    const response = await call(publish, actors[0], { previewId: correction.previewId, confirmPreview: true });
    assert.equal(response.revision, 2);
    await call(publish, actors[0], { previewId: correction.previewId, confirmPreview: true });
    for (const evaluation of correction.evaluations) {
      const standing = (await store.collection('tipovackaStandings').doc(evaluation.uid).get()).data();
      assert.equal(standing.totalPoints, 100 + evaluation.total);
      assert.equal(standing.roundsPlayed, 3);
    }
    const round = (await store.collection('tipovackaRounds').doc(ROUND_ID).get()).data();
    assert.equal(round.publishedAt.toMillis(), beforeRound.publishedAt.toMillis());
    assert.equal(round.actorEmail, undefined);
    const audit = (await store.collection('tipovackaRounds').doc(ROUND_ID).collection('revisions').doc('2').get()).data();
    assert.equal(audit.actorEmail, ADMIN_EMAIL);
    assert.deepEqual(audit.beforeResult, beforeRound.result);
    assert.deepEqual(audit.afterResult, round.result);
    assert.equal(Object.keys(audit.evaluationChanges).length, 3);
  });
  await t.test('expired preview cannot mutate points or create another revision', async () => {
    const candidate = await call(preview, actors[0], { result, finalConfirmed: true,
      correctionReason: 'Kontrola vypršení náhledu bez nové publikace.' });
    Date.now.mock.mockImplementation(() => Date.parse(candidate.expiresAt));
    await call(publish, actors[0], { previewId: candidate.previewId, confirmPreview: true }, 409);
    assert.equal((await store.collection('tipovackaRounds').doc(ROUND_ID).get()).data().revision, 2);
  });
});
