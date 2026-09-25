import { adminStore, errorResponse, json, normalizeTicket, requireAdmin, ROUND_ID } from '../_server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await requireAdmin(request);
    const snapshot = await adminStore().collection('tipovackaPreview')
      .where('roundId', '==', ROUND_ID).get();
    const tickets = [];
    const skipped = [];
    for (const document of snapshot.docs) {
      const picks = normalizeTicket(document.data().picks);
      if (picks) {
        const updatedAt = document.data().updatedAt;
        tickets.push({
          uid: document.id,
          picks,
          updatedAt: typeof updatedAt?.toDate === 'function'
            ? updatedAt.toDate().toISOString() : null,
        });
      } else {
        skipped.push({ uid: document.id, reason: 'Tiket není kompletní nebo používá staré možnosti.' });
      }
    }
    return json({ roundId: ROUND_ID, tickets, skipped });
  } catch (error) {
    return errorResponse(error);
  }
}
