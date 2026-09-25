import { randomUUID } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import {
  ApiError, ROUND_ID, PREVIEW_LIFETIME_MS, officialResult, roundRevision,
  evaluationsFromTickets, ticketFingerprint, addPreviousEvaluations,
  correctionReason, assertRoundStarted, fingerprint, canonicalJson, roundPoints,
} from '../../../lib/tipovacka-publication.mjs';

const roundReference = (store) => store.collection('tipovackaRounds').doc(ROUND_ID);
// This collection currently holds one round only. Read every document so that
// malformed/missing roundId values cannot silently remove a player's ticket.
const ticketQuery = (store) => store.collection('tipovackaPreview');

async function readScoringState(store, transaction, result) {
  const roundRef = roundReference(store);
  const roundSnapshot = await transaction.get(roundRef);
  const round = roundSnapshot.exists ? roundSnapshot.data() : null;
  const revision = roundRevision(round);
  const tickets = await transaction.get(ticketQuery(store));
  const previous = await transaction.get(roundRef.collection('evaluations'));
  if (!revision && !previous.empty) throw new ApiError(409, 'Kolo obsahuje vyhodnocení bez zveřejněného výsledku.');
  const evaluations = addPreviousEvaluations(
    evaluationsFromTickets(tickets.docs, result), previous.docs, revision > 0,
  );
  const standings = new Map();
  for (const evaluation of evaluations) {
    const ref = store.collection('tipovackaStandings').doc(evaluation.uid);
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();
    if (!snapshot.exists || typeof data.displayName !== 'string' || !data.displayName.trim()
      || !Number.isFinite(data.totalPoints) || !Number.isSafeInteger(data.roundsPlayed)
      || data.roundsPlayed < (revision > 0 ? 1 : 0)) {
      throw new ApiError(409, `Hráč ${evaluation.uid} nemá platný řádek v tabulce. Oprav data před vyhodnocením.`);
    }
    standings.set(evaluation.uid, { ref, data });
  }
  return { roundRef, round, revision, evaluations, standings,
    stateFingerprint: fingerprint({ tickets: ticketFingerprint(tickets.docs), round,
      previous: previous.docs.map((doc) => ({ uid: doc.id, data: doc.data() }))
        .sort((a, b) => a.uid.localeCompare(b.uid)) }) };
}

export async function createResultPreview(store, actor, body, now = Date.now()) {
  assertRoundStarted(now);
  if (body?.finalConfirmed !== true) {
    throw new ApiError(400, 'Nejdřív potvrď, že zadáváš konečný výsledek odehraného zápasu.');
  }
  const result = officialResult(body?.result);
  const previewId = randomUUID();
  const expiresAt = Timestamp.fromMillis(now + PREVIEW_LIFETIME_MS);
  return store.runTransaction(async (transaction) => {
    const state = await readScoringState(store, transaction, result);
    const reason = correctionReason(body?.correctionReason, state.revision > 0);
    if (state.revision > 0 && canonicalJson(officialResult(state.round.result)) === canonicalJson(result)) {
      throw new ApiError(409, 'Oprava neobsahuje žádnou změnu výsledku.');
    }
    const evaluations = state.evaluations.map((evaluation) => ({ ...evaluation,
      displayName: state.standings.get(evaluation.uid).data.displayName }));
    const mode = state.revision > 0 ? 'correct' : 'publish';
    transaction.create(store.collection('tipovackaAdminPreviews').doc(previewId), {
      roundId: ROUND_ID, actorUid: actor.uid, state: 'pending', mode,
      result, correctionReason: reason, baseRevision: state.revision,
      stateFingerprint: state.stateFingerprint, evaluations,
      createdAt: Timestamp.fromMillis(now), expiresAt,
    });
    return { roundId: ROUND_ID, previewId, mode, baseRevision: state.revision,
      result, correctionReason: reason, evaluations, evaluatedCount: evaluations.length,
      expiresAt: expiresAt.toDate().toISOString() };
  });
}

export async function publishResultPreview(store, actor, body, now = Date.now()) {
  assertRoundStarted(now);
  if (body?.confirmPreview !== true || typeof body?.previewId !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(body.previewId)) {
    throw new ApiError(400, 'Nejdřív vytvoř a zkontroluj serverový náhled bodů.');
  }
  const previewRef = store.collection('tipovackaAdminPreviews').doc(body.previewId);
  const changedAt = Timestamp.fromMillis(now);
  return store.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(previewRef);
    const preview = snapshot.data();
    if (!snapshot.exists || preview.roundId !== ROUND_ID || preview.actorUid !== actor.uid) {
      throw new ApiError(404, 'Tento náhled výsledku nebyl nalezen.');
    }
    // Retries of an acknowledged or timed-out response must never add points again.
    if (preview.state === 'published' && preview.response) return { ...preview.response, alreadyApplied: true };
    if (preview.state !== 'pending' || !preview.expiresAt?.toMillis || preview.expiresAt.toMillis() <= now) {
      throw new ApiError(409, 'Platnost náhledu vypršela. Vytvoř a zkontroluj nový náhled.');
    }
    const result = officialResult(preview.result);
    const state = await readScoringState(store, transaction, result);
    if (state.revision !== preview.baseRevision || state.stateFingerprint !== preview.stateFingerprint) {
      throw new ApiError(409, 'Tikety nebo zveřejněný výsledek se změnily. Vytvoř a zkontroluj nový náhled.');
    }
    const revision = state.revision + 1;
    const correcting = state.revision > 0;
    const reason = correctionReason(preview.correctionReason, correcting);
    const response = { roundId: ROUND_ID, status: 'published', mode: correcting ? 'correct' : 'publish',
      revision, evaluatedCount: state.evaluations.length,
      publishedAt: (state.round?.publishedAt ?? changedAt).toDate().toISOString(),
      updatedAt: changedAt.toDate().toISOString(), alreadyApplied: false };

    // All reads finished above. One transaction owns the round revision, standings,
    // evaluation snapshots, audit record and consumption of the preview token.
    transaction.set(state.roundRef, { roundId: ROUND_ID, status: 'published', result, revision,
      evaluatedCount: state.evaluations.length, publishedAt: state.round?.publishedAt ?? changedAt,
      updatedAt: changedAt }, { merge: true });
    transaction.create(state.roundRef.collection('revisions').doc(String(revision)), {
      roundId: ROUND_ID, revision, previousRevision: state.revision,
      beforeResult: state.round?.result ?? null, afterResult: result,
      reason, actorUid: actor.uid, actorEmail: actor.email, createdAt: changedAt,
      previewId: body.previewId,
      evaluationChanges: Object.fromEntries(state.evaluations.map(({ uid, previousTotal, total, delta }) =>
        [uid, { previousTotal, total, delta }])),
    });
    for (const evaluation of state.evaluations) {
      const standing = state.standings.get(evaluation.uid);
      transaction.update(standing.ref, {
        totalPoints: roundPoints(standing.data.totalPoints + evaluation.delta),
        roundsPlayed: standing.data.roundsPlayed + (correcting ? 0 : 1),
      });
      transaction.set(state.roundRef.collection('evaluations').doc(evaluation.uid), {
        uid: evaluation.uid, roundId: ROUND_ID, picks: evaluation.picks,
        total: evaluation.total, breakdown: evaluation.breakdown,
        previousTotal: evaluation.previousTotal, delta: evaluation.delta,
        publishedAt: state.round?.publishedAt ?? changedAt, updatedAt: changedAt, revision,
      });
    }
    transaction.update(previewRef, { state: 'published', consumedAt: changedAt, response });
    return response;
  });
}
