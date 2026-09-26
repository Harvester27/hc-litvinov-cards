import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp,
  setDoc, setLogLevel, Timestamp, updateDoc, where,
} from 'firebase/firestore';

const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');
const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):\d+$/.test(host)) {
  throw new Error('Run npm run test:rules; retirement tests require a loopback Firestore emulator.');
}
const [hostname, port] = host.split(':');
setLogLevel('silent');
const identity = (name, email, verified = true) => ({ name, email, email_verified: verified });
const actors = {
  alice: ['player-alice', identity('Alice Lancers', 'alice@example.test')],
  bob: ['player-bob', identity('Bob Wolves', 'bob@example.test')],
  admin: ['admin', identity('Správce', 'sanarycogames@outlook.cz')],
  unverifiedAdmin: ['admin', identity('Správce', 'sanarycogames@outlook.cz', false)],
  impostor: ['impostor', identity('Správce', 'sanarycogames@outlook.cz.evil.test')],
  unverified: ['unverified', identity('Neověřený', 'unverified@example.test', false)],
};
const nonAdmins = ['anonymous', 'alice', 'bob', 'unverifiedAdmin', 'impostor', 'unverified'];
const allActors = [...nonAdmins, 'admin'];
const roundPath = 'tipovackaRounds/glacier-wolves-2026-09-26';
const savedAt = Timestamp.fromMillis(1790356500000);
const legacyPicks = {
  outcome: 'lancers', scorer: 'marian-dlugopolsky', topPoints: 'tomas-turecek',
  firstGoal: 'lancers', totalGoals: 5,
};
const archive = {
  'tipovackaPreview/admin': { roundId: 'glacier-wolves-2026-09-26', picks: legacyPicks, updatedAt: savedAt },
  'tipovackaPreview/player-alice': { roundId: 'glacier-wolves-2026-09-26', picks: legacyPicks, updatedAt: savedAt },
  'tipovackaPreview/player-bob': { roundId: 'glacier-wolves-2026-09-26', picks: { ...legacyPicks, totalGoals: 4 }, updatedAt: savedAt },
  'tipovackaStandings/admin': { displayName: 'Správce', totalPoints: 76, roundsPlayed: 1, joinedAt: savedAt },
  'tipovackaStandings/player-alice': { displayName: 'Alice Lancers', totalPoints: 50, roundsPlayed: 1, joinedAt: savedAt },
  [roundPath]: { status: 'published', result: { homeGoals: 3, awayGoals: 2 }, revision: 2, publishedAt: savedAt },
  [`${roundPath}/evaluations/player-alice`]: { total: 50, picks: legacyPicks, revision: 2 },
  [`${roundPath}/evaluations/player-bob`]: { total: 30, picks: legacyPicks, revision: 2 },
  [`${roundPath}/revisions/2`]: { reason: 'Oprava konečného výsledku', actorUid: 'admin', createdAt: savedAt },
  'tipovackaAdminPreviews/approval': { state: 'published', actorUid: 'admin', createdAt: savedAt },
};
const archiveCollections = [
  'tipovackaPreview', 'tipovackaStandings', 'tipovackaRounds',
  `${roundPath}/evaluations`, `${roundPath}/revisions`, 'tipovackaAdminPreviews',
];
let env;
const dbFor = (who) => who === 'anonymous' ? env.unauthenticatedContext().firestore()
  : env.authenticatedContext(...actors[who]).firestore();
async function seed(documents) {
  await env.withSecurityRulesDisabled(async (context) => {
    for (const [path, data] of Object.entries(documents)) await setDoc(doc(context.firestore(), path), data);
  });
}
async function assertArchiveUnchanged() {
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    for (const [path, data] of Object.entries(archive)) {
      const snapshot = await getDoc(doc(db, path));
      assert.equal(snapshot.exists(), true, path);
      assert.deepEqual(snapshot.data(), data, path);
    }
    for (const path of archiveCollections) {
      const expectedCount = Object.keys(archive).filter((key) => key.slice(0, key.lastIndexOf('/')) === path).length;
      assert.equal((await getDocs(collection(db, path))).size, expectedCount, path);
    }
  });
}
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-lancers-rules-retired',
    firestore: { host: hostname, port: Number(port), rules },
  });
});
beforeEach(async () => { await env.clearFirestore(); await seed(archive); });
after(async () => { await env?.cleanup(); });

test('only the verified exact administrator can read every preserved archive collection', async () => {
  const db = dbFor('admin');
  for (const [path, expected] of Object.entries(archive)) {
    assert.deepEqual((await assertSucceeds(getDoc(doc(db, path)))).data(), expected);
  }
  for (const path of archiveCollections) await assertSucceeds(getDocs(collection(db, path)));
  await assertArchiveUnchanged();
});

test('players, anonymous visitors and an unverified or lookalike admin cannot read any game archive', async () => {
  for (const who of nonAdmins) {
    const db = dbFor(who);
    for (const path of Object.keys(archive)) await assertFails(getDoc(doc(db, path)));
    for (const path of archiveCollections) await assertFails(getDocs(collection(db, path)));
    // Retirement also closes owner reads, regardless of published status or
    // whether a document exists yet.
    await assertFails(getDoc(doc(db, 'tipovackaPreview', actors[who]?.[0] ?? 'anonymous')));
    await assertFails(getDoc(doc(db, 'tipovackaRounds', 'nonexistent-round')));
  }
});

test('all clients including the verified admin are forbidden to create archived game documents', async () => {
  for (const who of allActors) {
    const db = dbFor(who);
    for (const path of archiveCollections) {
      await assertFails(setDoc(doc(db, path, `new-${who}`), { state: 'new', updatedAt: serverTimestamp() }));
    }
  }
  await assertArchiveUnchanged();
});

test('all clients including the verified admin are forbidden to update or delete archived game documents', async () => {
  for (const who of allActors) {
    const db = dbFor(who);
    for (const path of Object.keys(archive)) {
      await assertFails(updateDoc(doc(db, path), { changed: true }));
      await assertFails(deleteDoc(doc(db, path)));
    }
  }
  await assertArchiveUnchanged();
});

test('a stale game tab cannot save a valid-looking own ticket or update its scoring row', async () => {
  for (const who of ['alice', 'admin']) {
    const db = dbFor(who);
    const uid = actors[who][0];
    await assertFails(setDoc(doc(db, 'tipovackaPreview', uid), {
      roundId: 'glacier-wolves-2026-09-26', picks: legacyPicks, updatedAt: serverTimestamp(),
    }));
    await assertFails(updateDoc(doc(db, 'tipovackaStandings', uid), { displayName: 'Nové jméno' }));
    await assertFails(updateDoc(doc(db, 'tipovackaStandings', uid), { totalPoints: 9999, roundsPlayed: 2 }));
  }
  await assertArchiveUnchanged();
});

test('the retired launch flag is unreadable and unwritable for every client even if stale data says visible', async () => {
  for (const visible of [true, false]) {
    await seed({ 'publicFeatures/tipovacka': { visible } });
    for (const who of allActors) {
      const db = dbFor(who);
      const ref = doc(db, 'publicFeatures', 'tipovacka');
      await assertFails(getDoc(ref));
      await assertFails(getDocs(collection(db, 'publicFeatures')));
      await assertFails(setDoc(ref, { visible: true }));
      await assertFails(deleteDoc(ref));
    }
  }
});

test('existing private profiles remain readable only by their verified owner with client writes denied', async () => {
  const path = 'users/player-alice/profile/data';
  await seed({ [path]: { email: 'alice@example.test', displayName: 'Alice Lancers' } });
  await assertSucceeds(getDoc(doc(dbFor('alice'), path)));
  for (const who of ['anonymous', 'bob', 'admin', 'unverified']) await assertFails(getDoc(doc(dbFor(who), path)));
  await assertFails(updateDoc(doc(dbFor('alice'), path), { credits: 9999 }));
  await assertFails(deleteDoc(doc(dbFor('alice'), path)));
});

test('other game profiles still permit verified owners to create only their own zero-balance profile', async () => {
  const alice = dbFor('alice');
  const data = { playerName: 'Alice', teamName: 'Lancers', balance: 0, createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(alice, 'lancersCardsPlayers', 'player-alice'), data));
  await assertSucceeds(getDoc(doc(alice, 'lancersCardsPlayers', 'player-alice')));
  await assertFails(getDoc(doc(dbFor('bob'), 'lancersCardsPlayers', 'player-alice')));
  await assertFails(setDoc(doc(alice, 'lancersCardsPlayers', 'player-bob'), data));
  await assertFails(setDoc(doc(dbFor('unverified'), 'lancersCardsPlayers', 'unverified'), data));
  await assertFails(updateDoc(doc(alice, 'lancersCardsPlayers', 'player-alice'), { balance: 100 }));
});

test('public leaderboard reads and verified article-comment writes remain unchanged', async () => {
  await seed({ 'leaderboard/player-alice': { score: 1 } });
  await assertSucceeds(getDocs(collection(dbFor('anonymous'), 'leaderboard')));
  await assertFails(setDoc(doc(dbFor('alice'), 'leaderboard', 'player-alice'), { score: 9999 }));
  const alice = dbFor('alice');
  const ref = doc(alice, 'comments', 'article-comment');
  const comment = {
    articleId: 'club-news', userId: 'player-alice', userDisplayName: 'Alice Lancers',
    userAvatar: null, content: 'Díky za zápas.', createdAt: serverTimestamp(),
    editedAt: null, likes: 0, likedBy: [], isDeleted: false,
  };
  await assertSucceeds(setDoc(ref, comment));
  await assertSucceeds(getDoc(doc(dbFor('anonymous'), 'comments', 'article-comment')));
  await assertSucceeds(getDocs(query(collection(dbFor('anonymous'), 'comments'), where('isDeleted', '==', false))));
  await assertFails(updateDoc(doc(dbFor('bob'), 'comments', 'article-comment'), { content: 'Cizí změna', editedAt: serverTimestamp() }));
  await assertSucceeds(updateDoc(ref, { content: 'Díky týmu.', editedAt: serverTimestamp() }));
  await assertSucceeds(updateDoc(ref, { isDeleted: true, deletedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(dbFor('anonymous'), 'comments', 'article-comment')));
  await assertFails(setDoc(doc(dbFor('unverified'), 'comments', 'unverified-comment'), { ...comment, userId: 'unverified' }));
});
