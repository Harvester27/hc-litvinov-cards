import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ADMIN_EMAIL, ApiError } from '../../../lib/tipovacka-publication.mjs';

export { ADMIN_EMAIL, ApiError, ROUND_ID, normalizeTicket, officialResult,
  evaluationsFromTickets } from '../../../lib/tipovacka-publication.mjs';

const PROJECT_ID = 'lancers-web-cards-2026';
const MAX_BODY_LENGTH = 256_000;

// Emulator mode is deliberately restricted to an isolated demo project and both
// loopback emulators. A production build can never accept unsigned emulator tokens.
export function firebaseConfiguration(env = process.env) {
  const firestoreHost = env.FIRESTORE_EMULATOR_HOST;
  const authHost = env.FIREBASE_AUTH_EMULATOR_HOST;
  if (firestoreHost || authHost) {
    const localHost = /^(localhost|127\.0\.0\.1|\[::1\]):\d{1,5}$/;
    if (env.NODE_ENV === 'production' || !firestoreHost || !authHost
      || !localHost.test(firestoreHost) || !localHost.test(authHost)
      || !/^demo-[a-z0-9-]+$/.test(env.GCLOUD_PROJECT || '')) {
      throw new ApiError(503, 'Neplatná nebo nebezpečná konfigurace lokálních emulátorů.');
    }
    return { projectId: env.GCLOUD_PROJECT, emulator: true };
  }
  const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new ApiError(503, 'Serverové ověření Firebase zatím není nastavené.');
  let serviceAccount;
  try { serviceAccount = JSON.parse(raw); } catch {
    throw new ApiError(503, 'Serverové ověření Firebase má neplatné nastavení.');
  }
  if (serviceAccount.project_id !== PROJECT_ID
    || typeof serviceAccount.client_email !== 'string'
    || typeof serviceAccount.private_key !== 'string') {
    throw new ApiError(503, 'Serverové ověření Firebase neodpovídá projektu Tipovačky.');
  }
  return { projectId: PROJECT_ID, serviceAccount, emulator: false };
}

function firebaseApp() {
  const config = firebaseConfiguration();
  const appName = `tipovacka-results-${config.projectId}`;
  if (getApps().some((app) => app.name === appName)) return getApp(appName);
  return initializeApp({ projectId: config.projectId,
    ...(config.emulator ? {} : { credential: cert(config.serviceAccount) }) }, appName);
}

export const adminStore = () => getFirestore(firebaseApp());

export function publicationNow(env = process.env) {
  if (!env.TIPOVACKA_EMULATOR_NOW) return Date.now();
  if (!firebaseConfiguration(env).emulator) {
    throw new ApiError(503, 'Testovací čas je povolený pouze v izolovaných lokálních emulátorech.');
  }
  const value = env.TIPOVACKA_EMULATOR_NOW;
  const timestamp = Date.parse(value);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value) || !Number.isFinite(timestamp)) {
    throw new ApiError(503, 'Testovací čas emulátoru musí být platný čas ISO v UTC.');
  }
  return timestamp;
}

export async function requireAdmin(request) {
  const match = /^Bearer (\S+)$/i.exec(request.headers.get('authorization') || '');
  if (!match) throw new ApiError(401, 'Nejdřív se přihlas ke svému administrátorskému účtu.');
  let decoded;
  try { decoded = await getAuth(firebaseApp()).verifyIdToken(match[1], true); } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Přihlášení vypršelo. Přihlas se znovu.');
  }
  if (decoded.email_verified !== true || decoded.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new ApiError(403, 'Vyhodnocení Tipovačky může spravovat jen administrátor.');
  }
  return decoded;
}

export async function parseJsonBody(request) {
  const body = await request.text();
  if (body.length > MAX_BODY_LENGTH) throw new ApiError(413, 'Odeslaná data jsou příliš velká.');
  try { return JSON.parse(body); } catch {
    throw new ApiError(400, 'Odeslaná data nejsou platný JSON.');
  }
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function errorResponse(error) {
  if (!(error instanceof ApiError)) console.error('Tipovačka API error:', error);
  return json({ error: error instanceof ApiError
    ? error.message : 'Vyhodnocení se nepodařilo zpracovat. Zkus to znovu.' },
  error instanceof ApiError ? error.status : 500);
}
