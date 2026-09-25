import { adminStore, errorResponse, json, parseJsonBody, publicationNow, requireAdmin } from '../_server.js';
import { createResultPreview } from '../_publication.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const actor = await requireAdmin(request);
    const body = await parseJsonBody(request);
    return json(await createResultPreview(adminStore(), actor, body, publicationNow()));
  } catch (error) {
    return errorResponse(error);
  }
}
