import { Timestamp } from 'firebase-admin/firestore';
import { TIPOVACKA_ROUND } from '@/lib/tipovacka.mjs';
import {
  adminStore, ApiError, assertPreviewMatches, errorResponse,
  evaluationsFromTickets, json, officialResult, parseJsonBody, requireAdmin, ROUND_ID,
} from '../_server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await requireAdmin(request);
    if (Date.now() < Date.parse(TIPOVACKA_ROUND.startsAt)) {
      throw new ApiError(409, 'Výsledek lze zveřejnit až po začátku zápasu.');
    }
    const body = await parseJsonBody(request);
    const result = officialResult(body?.result);
    const store = adminStore();
    const roundRef = store.collection('tipovackaRounds').doc(ROUND_ID);
    const ticketQuery = store.collection('tipovackaPreview').where('roundId', '==', ROUND_ID);
    const publishedAt = Timestamp.now();

    const evaluatedCount = await store.runTransaction(async (transaction) => {
      const existing = await transaction.get(roundRef);
      if (existing.exists) {
        throw new ApiError(409, 'Výsledek tohoto kola už byl zveřejněn. Body nelze přičíst podruhé.');
      }
      const ticketSnapshot = await transaction.get(ticketQuery);
      const evaluations = evaluationsFromTickets(ticketSnapshot.docs, result);
      assertPreviewMatches(body?.previewEvaluations, evaluations);
      if (evaluations.length > 200) {
        throw new ApiError(413, 'Příliš mnoho tiketů pro jedno společné vyhodnocení.');
      }

      // Firestore transactions require every read to finish before the first write.
      const standings = new Map();
      for (const evaluation of evaluations) {
        const ref = store.collection('tipovackaStandings').doc(evaluation.uid);
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists) {
          throw new ApiError(409, `Hráč ${evaluation.uid} nemá řádek v tabulce. Obnov náhled po jeho vstupu do hry.`);
        }
        const previous = snapshot.data();
        if (typeof previous.totalPoints !== 'number' || !Number.isFinite(previous.totalPoints)
          || !Number.isSafeInteger(previous.roundsPlayed) || previous.roundsPlayed < 0) {
          throw new ApiError(409, `Hráč ${evaluation.uid} má neplatné dosavadní skóre.`);
        }
        standings.set(evaluation.uid, { ref, previous });
      }

      transaction.create(roundRef, {
        roundId: ROUND_ID,
        status: 'published',
        result,
        publishedAt,
      });
      for (const evaluation of evaluations) {
        const { ref, previous } = standings.get(evaluation.uid);
        transaction.update(ref, {
          totalPoints: Math.round((previous.totalPoints + evaluation.total) * 10) / 10,
          roundsPlayed: previous.roundsPlayed + 1,
        });
        transaction.create(roundRef.collection('evaluations').doc(evaluation.uid), {
          uid: evaluation.uid,
          roundId: ROUND_ID,
          picks: evaluation.picks,
          total: evaluation.total,
          breakdown: evaluation.breakdown,
          publishedAt,
        });
      }
      return evaluations.length;
    });

    return json({ roundId: ROUND_ID, status: 'published', evaluatedCount,
      publishedAt: publishedAt.toDate().toISOString() });
  } catch (error) {
    return errorResponse(error);
  }
}
