import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, setLogLevel, updateDoc } from 'firebase/firestore';
import { TIPOVACKA_ROUND } from '../src/lib/tipovacka.mjs';

const ROUND_ID = 'glacier-wolves-2026-09-26';
const deadlineExpression = 'timestamp.value(1790442900000)';
const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');
// Expected permission-denied writes are asserted below; avoid duplicating
// dozens of expected SDK warnings in the test report.
setLogLevel('silent');
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):\d+$/.test(host)) {
  throw new Error('Run npm run test:emulators; rules tests require a loopback Firestore emulator.');
}
const [hostname, port] = host.split(':');
const token = (name, email) => ({ name, email, email_verified: true });
const actors = {
  alice: ['player-alice', token('Alice Lancers', 'alice@example.test')],
  bob: ['player-bob', token('Bob Wolves', 'bob@example.test')],
  admin: ['admin', token('Správce', 'sanarycogames@outlook.cz')],
  unverified: ['unverified', { ...token('Neověřený', 'unverified@example.test'), email_verified: false }],
  unnamed: ['unnamed', { email: 'unnamed@example.test', email_verified: true }],
  blank: ['blank', token('   ', 'blank@example.test')],
};
const picks = {
  outcome: 'lancers',
  scorer: { 'jan-schubada': 0, 'marian-dlugopolsky': 10, 'lubos-coufal': 0, 'jan-hanus': 0, 'jiri-salanda': 0, 'none-listed': 0 },
  topPoints: 'tomas-turecek', firstGoal: 'lancers', totalGoals: 5,
};
const ticket = (overrides = {}) => ({ roundId: ROUND_ID, picks: structuredClone(picks), updatedAt: serverTimestamp(), ...overrides });
const standing = (displayName) => ({ displayName, totalPoints: 0, roundsPlayed: 0, joinedAt: serverTimestamp() });
let env;
let closedEnv;
let boundaryEnv;
const dbFor = (who, target = env) => who === 'anonymous'
  ? target.unauthenticatedContext().firestore()
  : target.authenticatedContext(...actors[who]).firestore();
const ticketRef = (db, uid) => doc(db, 'tipovackaPreview', uid);
const roundRef = (db) => doc(db, 'tipovackaRounds', ROUND_ID);
const evaluationRef = (db, uid) => doc(db, 'tipovackaRounds', ROUND_ID, 'evaluations', uid);
async function seed(documents, target = env) {
  await target.withSecurityRulesDisabled(async (context) => {
    for (const [path, data] of Object.entries(documents)) {
      await setDoc(doc(context.firestore(), path), data);
    }
  });
}

before(async () => {
  // The emulator cannot set request.time. Vary only the production deadline
  // expression to exercise before, exact equality, and after deterministically.
  // All remaining rules, including request.time on writes, are unchanged.
  assert.equal(rules.split(deadlineExpression).length - 1, 1);
  assert.equal(new Date(TIPOVACKA_ROUND.startsAt).getTime(), 1790442900000);
  const setup = (projectId, expression) => initializeTestEnvironment({
    projectId,
    firestore: { host: hostname, port: Number(port), rules: rules.replace(deadlineExpression, expression) },
  });
  env = await setup('demo-lancers-rules-open', 'request.time + duration.value(1, "s")');
  boundaryEnv = await setup('demo-lancers-rules-boundary', 'request.time');
  closedEnv = await setup('demo-lancers-rules-closed', 'request.time - duration.value(1, "s")');
});
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await Promise.all([env, boundaryEnv, closedEnv].filter(Boolean).map((item) => item.cleanup())); });

test('two verified named players create, read, and update only their own ticket', async () => {
  const alice = dbFor('alice');
  const bob = dbFor('bob');
  await assertSucceeds(setDoc(doc(alice, 'tipovackaStandings', 'player-alice'), standing('Alice Lancers')));
  await assertSucceeds(setDoc(doc(bob, 'tipovackaStandings', 'player-bob'), standing('Bob Wolves')));
  await assertSucceeds(setDoc(ticketRef(alice, 'player-alice'), ticket()));
  await assertSucceeds(setDoc(ticketRef(bob, 'player-bob'), ticket()));
  await assertSucceeds(getDoc(ticketRef(alice, 'player-alice')));
  await assertSucceeds(getDoc(ticketRef(bob, 'player-bob')));
  await assertSucceeds(updateDoc(ticketRef(alice, 'player-alice'), { 'picks.totalGoals': 6, updatedAt: serverTimestamp() }));
  await assertFails(getDoc(ticketRef(alice, 'player-bob')));
  await assertFails(getDoc(ticketRef(bob, 'player-alice')));
  await assertFails(setDoc(ticketRef(alice, 'player-bob'), ticket()));
  await assertFails(getDocs(collection(alice, 'tipovackaPreview')));
  await assertFails(deleteDoc(ticketRef(alice, 'player-alice')));
});

test('ticket creation and updates require the owner to have a scoring row', async () => {
  await seed({ 'tipovackaStandings/player-bob': standing('Bob Wolves') });
  for (const who of ['alice', 'admin']) {
    const [uid, identity] = actors[who];
    const db = dbFor(who);
    const ref = ticketRef(db, uid);
    // Another player's row must not satisfy the invariant.
    await assertFails(setDoc(ref, ticket()));
    await seed({ [`tipovackaPreview/${uid}`]: ticket() });
    await assertFails(updateDoc(ref, { 'picks.totalGoals': 6, updatedAt: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(db, 'tipovackaStandings', uid), standing(identity.name)));
    await assertSucceeds(updateDoc(ref, { 'picks.totalGoals': 6, updatedAt: serverTimestamp() }));
  }
});

test('only the verified exact administrator can inspect all tickets', async () => {
  await seed({
    'tipovackaPreview/player-alice': ticket(), 'tipovackaPreview/player-bob': ticket(),
    'tipovackaStandings/player-alice': standing('Alice Lancers'),
    'tipovackaStandings/player-bob': standing('Bob Wolves'),
  });
  const admin = dbFor('admin');
  assert.equal((await assertSucceeds(getDocs(collection(admin, 'tipovackaPreview')))).size, 2);
  await assertSucceeds(getDoc(ticketRef(admin, 'player-alice')));
  await assertFails(setDoc(ticketRef(admin, 'player-alice'), ticket()));
  const spoof = env.authenticatedContext('impostor', token('Správce', 'sanarycogames@outlook.cz.evil.test')).firestore();
  const unverifiedAdmin = env.authenticatedContext('unverified-admin', { ...actors.admin[1], email_verified: false }).firestore();
  await assertFails(getDocs(collection(spoof, 'tipovackaPreview')));
  await assertFails(getDocs(collection(unverifiedAdmin, 'tipovackaPreview')));
});

test('anonymous, unverified, unnamed, and blank-name users cannot access the game data', async () => {
  for (const who of ['anonymous', 'unverified', 'unnamed', 'blank']) {
    const db = dbFor(who);
    const uid = actors[who]?.[0] ?? 'anonymous';
    await seed({ [`tipovackaStandings/${uid}`]: standing('Existing scoring row') });
    await assertFails(setDoc(ticketRef(db, uid), ticket()));
    await assertFails(getDoc(ticketRef(db, uid)));
    await assertFails(getDocs(collection(db, 'tipovackaStandings')));
    await assertFails(getDoc(roundRef(db)));
  }
});

test('stored legacy administrator ticket stays readable and remains valid when saved', async () => {
  const legacy = ticket({ picks: { ...picks, scorer: 'marian-dlugopolsky' } });
  await seed({ 'tipovackaPreview/admin': legacy, 'tipovackaStandings/admin': standing('Správce') });
  const admin = dbFor('admin');
  assert.equal((await assertSucceeds(getDoc(ticketRef(admin, 'admin')))).data().picks.scorer, 'marian-dlugopolsky');
  await assertSucceeds(setDoc(ticketRef(admin, 'admin'), legacy));
});

test('tickets reject invalid stakes, enum values, numeric ranges, fields, and stale timestamps', async () => {
  const alice = dbFor('alice');
  const ref = ticketRef(alice, 'player-alice');
  await seed({ 'tipovackaStandings/player-alice': standing('Alice Lancers') });
  const invalid = [
    ticket({ roundId: 'other-round' }), ticket({ injected: true }), ticket({ updatedAt: new Date(0) }),
    ticket({ picks: { ...picks, outcome: 'invalid' } }),
    ticket({ picks: { ...picks, firstGoal: 'draw' } }),
    ticket({ picks: { ...picks, topPoints: 'unlisted-player' } }),
    ticket({ picks: { ...picks, totalGoals: 31 } }),
    ticket({ picks: { ...picks, totalGoals: -1 } }),
    ticket({ picks: { ...picks, totalGoals: 2.5 } }),
    ticket({ picks: { ...picks, injected: true } }),
    ticket({ picks: { ...picks, scorer: { ...picks.scorer, 'jan-schubada': 1 } } }),
    ticket({ picks: { ...picks, scorer: { ...picks.scorer, 'jan-schubada': -1, 'marian-dlugopolsky': 11 } } }),
    ticket({ picks: { ...picks, scorer: { ...picks.scorer, 'marian-dlugopolsky': 9.5, 'jan-schubada': 0.5 } } }),
    ticket({ picks: { ...picks, scorer: { ...picks.scorer, 'marian-dlugopolsky': 5, 'none-listed': 5 } } }),
    ticket({ picks: { ...picks, scorer: { ...picks.scorer, other: 0 } } }),
  ];
  for (const data of invalid) await assertFails(setDoc(ref, data));
  await assertSucceeds(setDoc(ref, ticket({ picks: { ...picks, scorer: { ...picks.scorer, 'marian-dlugopolsky': 0, 'none-listed': 10 } } })));
});

test('deadline blocks creates and updates exactly at cutoff and after cutoff, including admin', async () => {
  for (const target of [boundaryEnv, closedEnv]) {
    for (const who of ['alice', 'admin']) {
      const uid = actors[who][0];
      const ref = ticketRef(dbFor(who, target), uid);
      await seed({ [`tipovackaStandings/${uid}`]: standing(actors[who][1].name) }, target);
      await assertFails(setDoc(ref, ticket()));
      await seed({ [`tipovackaPreview/${uid}`]: ticket() }, target);
      await assertFails(updateDoc(ref, { 'picks.totalGoals': 7, updatedAt: serverTimestamp() }));
      await assertSucceeds(getDoc(ref));
    }
  }
});

test('published round closes ticket creation and edits even before the deadline', async () => {
  await seed({
    [`tipovackaRounds/${ROUND_ID}`]: { status: 'published' }, 'tipovackaPreview/player-alice': ticket(),
    'tipovackaStandings/player-alice': standing('Alice Lancers'),
    'tipovackaStandings/player-bob': standing('Bob Wolves'),
  });
  await assertFails(setDoc(ticketRef(dbFor('bob'), 'player-bob'), ticket()));
  await assertFails(updateDoc(ticketRef(dbFor('alice'), 'player-alice'), { 'picks.totalGoals': 7, updatedAt: serverTimestamp() }));
});

test('published result is shared; players may read only their own evaluation after publication', async () => {
  await assertSucceeds(getDoc(roundRef(dbFor('alice'))));
  await seed({
    [`tipovackaRounds/${ROUND_ID}`]: { status: 'draft' },
    [`tipovackaRounds/${ROUND_ID}/evaluations/player-alice`]: { score: { total: 76 } },
    [`tipovackaRounds/${ROUND_ID}/evaluations/player-bob`]: { score: { total: -10 } },
  });
  await assertFails(getDoc(roundRef(dbFor('alice'))));
  await assertFails(getDoc(evaluationRef(dbFor('alice'), 'player-alice')));
  await seed({ [`tipovackaRounds/${ROUND_ID}`]: { status: 'published' } });
  await assertSucceeds(getDoc(roundRef(dbFor('alice'))));
  await assertSucceeds(getDoc(evaluationRef(dbFor('alice'), 'player-alice')));
  await assertSucceeds(getDoc(evaluationRef(dbFor('bob'), 'player-bob')));
  await assertFails(getDoc(evaluationRef(dbFor('alice'), 'player-bob')));
  await assertFails(getDoc(evaluationRef(dbFor('bob'), 'player-alice')));
  await assertFails(getDocs(collection(dbFor('alice'), 'tipovackaRounds', ROUND_ID, 'evaluations')));
  assert.equal((await assertSucceeds(getDocs(collection(dbFor('admin'), 'tipovackaRounds', ROUND_ID, 'evaluations')))).size, 2);
});

test('standings share names and points; only an own zero row with authenticated name can be created', async () => {
  const alice = dbFor('alice');
  const bob = dbFor('bob');
  const ref = doc(alice, 'tipovackaStandings', 'player-alice');
  await assertFails(setDoc(ref, standing('Someone Else')));
  await assertFails(setDoc(ref, { ...standing('Alice Lancers'), email: 'private@example.test' }));
  await assertFails(setDoc(ref, { ...standing('Alice Lancers'), totalPoints: 10 }));
  await assertFails(setDoc(ref, { ...standing('Alice Lancers'), roundsPlayed: 1 }));
  await assertSucceeds(setDoc(ref, standing('Alice Lancers')));
  await assertSucceeds(setDoc(doc(bob, 'tipovackaStandings', 'player-bob'), standing('Bob Wolves')));
  const rows = await assertSucceeds(getDocs(collection(alice, 'tipovackaStandings')));
  assert.equal(rows.size, 2);
  assert.deepEqual(rows.docs.map((row) => row.data().displayName).sort(), ['Alice Lancers', 'Bob Wolves']);
  await assertFails(setDoc(doc(alice, 'tipovackaStandings', 'player-bob'), standing('Alice Lancers')));
});

test('standings name updates follow refreshed auth name; points and counts cannot be changed by any client', async () => {
  await seed({ 'tipovackaStandings/player-alice': standing('Alice Lancers'), 'tipovackaStandings/admin': standing('Správce') });
  const renamed = env.authenticatedContext('player-alice', token('  Alice   Nová  ', 'alice@example.test')).firestore();
  const ref = doc(renamed, 'tipovackaStandings', 'player-alice');
  await assertSucceeds(updateDoc(ref, { displayName: 'Alice Nová' }));
  await assertFails(updateDoc(ref, { displayName: 'Invented Name' }));
  for (const who of ['alice', 'admin']) {
    const own = doc(dbFor(who), 'tipovackaStandings', actors[who][0]);
    await assertFails(updateDoc(own, { totalPoints: 9999 }));
    await assertFails(updateDoc(own, { roundsPlayed: 10 }));
    await assertFails(deleteDoc(own));
  }
});

test('all client writes to results, evaluations, preview approvals, and revision history are denied', async () => {
  for (const who of ['alice', 'admin']) {
    const db = dbFor(who);
    const paths = [
      `tipovackaRounds/${ROUND_ID}`, `tipovackaRounds/${ROUND_ID}/evaluations/${actors[who][0]}`,
      `tipovackaRounds/${ROUND_ID}/revisions/1`, 'tipovackaAdminPreviews/approval',
    ];
    for (const path of paths) await assertFails(setDoc(doc(db, path), { status: 'published', totalPoints: 9999 }));
  }
});

test('revision audit is admin-only and approval documents cannot be read by any client', async () => {
  await seed({ [`tipovackaRounds/${ROUND_ID}/revisions/1`]: { reason: 'Corrected score' }, 'tipovackaAdminPreviews/approval': { digest: 'private' } });
  for (const who of ['alice', 'bob']) {
    await assertFails(getDoc(doc(dbFor(who), 'tipovackaRounds', ROUND_ID, 'revisions', '1')));
    await assertFails(getDocs(collection(dbFor(who), 'tipovackaRounds', ROUND_ID, 'revisions')));
  }
  await assertSucceeds(getDoc(doc(dbFor('admin'), 'tipovackaRounds', ROUND_ID, 'revisions', '1')));
  for (const who of ['alice', 'admin']) await assertFails(getDoc(doc(dbFor(who), 'tipovackaAdminPreviews', 'approval')));
});

test('existing private profile restrictions and public leaderboard read remain intact', async () => {
  await seed({ 'users/player-alice/profile/data': { email: 'alice@example.test' }, 'leaderboard/player-alice': { score: 1 } });
  await assertSucceeds(getDoc(doc(dbFor('alice'), 'users', 'player-alice', 'profile', 'data')));
  await assertFails(getDoc(doc(dbFor('bob'), 'users', 'player-alice', 'profile', 'data')));
  await assertFails(setDoc(doc(dbFor('alice'), 'users', 'player-alice', 'profile', 'data'), { credits: 9999 }));
  await assertSucceeds(getDocs(collection(dbFor('anonymous'), 'leaderboard')));
  await assertFails(setDoc(doc(dbFor('alice'), 'leaderboard', 'player-alice'), { score: 9999 }));
});

test('the launch flag is publicly readable but only trusted server code may change it', async () => {
  await seed({ 'publicFeatures/tipovacka': { visible: true }, 'publicFeatures/private-feature': { internal: true } });
  for (const who of ['anonymous', 'alice', 'admin']) {
    const db = dbFor(who);
    assert.equal((await assertSucceeds(getDoc(doc(db, 'publicFeatures', 'tipovacka')))).data().visible, true);
    await assertFails(getDocs(collection(db, 'publicFeatures')));
    await assertFails(getDoc(doc(db, 'publicFeatures', 'private-feature')));
    await assertFails(setDoc(doc(db, 'publicFeatures', 'tipovacka'), { visible: false }));
  }
});
