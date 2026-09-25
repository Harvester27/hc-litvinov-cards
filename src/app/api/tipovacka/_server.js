import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { TIPOVACKA_ROUND, isCompletePicks, scoreRound, validateResult } from '@/lib/tipovacka.mjs';

export const ADMIN_EMAIL = 'sanarycogames@outlook.cz';
export const ROUND_ID = TIPOVACKA_ROUND.id;
const PROJECT_ID = 'lancers-web-cards-2026';
const APP_NAME = 'tipovacka-results';
const MAX_BODY_LENGTH = 256_000;
const ALLOWED_RESULT_FIELDS = [
  'homeGoals', 'awayGoals', 'scorerIds', 'playerPoints', 'firstGoalTeam', 'didNotPlayIds',
];
const POINT_PLAYER_IDS = TIPOVACKA_ROUND.questions.topPoints.options.map(({ id }) => id);
const SCORER_IDS = TIPOVACKA_ROUND.questions.scorer.options
  .filter(({ id }) => id !== 'none-listed').map(({ id }) => id);
const PLAYER_IDS = new Set([...POINT_PLAYER_IDS, ...SCORER_IDS]);

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function firebaseApp() {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return getApp(APP_NAME);

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new ApiError(503, 'Serverové ověření Firebase zatím není nastavené.');
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new ApiError(503, 'Serverové ověření Firebase má neplatné nastavení.');
  }
  if (serviceAccount.project_id !== PROJECT_ID
    || typeof serviceAccount.client_email !== 'string'
    || typeof serviceAccount.private_key !== 'string') {
    throw new ApiError(503, 'Serverové ověření Firebase neodpovídá projektu Tipovačky.');
  }

  return initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID }, APP_NAME);
}

export function adminStore() {
  return getFirestore(firebaseApp());
}

export async function requireAdmin(request) {
  const authorization = request.headers.get('authorization') || '';
  const match = /^Bearer (\S+)$/i.exec(authorization);
  if (!match) throw new ApiError(401, 'Nejdřív se přihlas ke svému administrátorskému účtu.');

  let decoded;
  try {
    decoded = await getAuth(firebaseApp()).verifyIdToken(match[1], true);
  } catch (error) {
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
  try {
    return JSON.parse(body);
  } catch {
    throw new ApiError(400, 'Odeslaná data nejsou platný JSON.');
  }
}

export function normalizeTicket(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const scorer = typeof raw.scorer === 'string' && SCORER_IDS.includes(raw.scorer)
    ? Object.fromEntries(TIPOVACKA_ROUND.questions.scorer.options
      .map(({ id }) => [id, id === raw.scorer ? 10 : 0]))
    : raw.scorer;
  const picks = {
    outcome: raw.outcome,
    scorer,
    topPoints: raw.topPoints,
    firstGoal: raw.firstGoal,
    totalGoals: raw.totalGoals,
  };
  return isCompletePicks(picks) ? picks : null;
}

export function officialResult(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== ALLOWED_RESULT_FIELDS.length
    || !ALLOWED_RESULT_FIELDS.every((key) => Object.hasOwn(input, key))) {
    throw new ApiError(400, 'Výsledek zápasu nemá požadovaná pole.');
  }
  if (Object.keys(input.playerPoints ?? {}).length !== POINT_PLAYER_IDS.length
    || !POINT_PLAYER_IDS.every((id) => Object.hasOwn(input.playerPoints, id))) {
    throw new ApiError(400, 'Vyplň body všech tří vypsaných hráčů.');
  }
  if (!Array.isArray(input.didNotPlayIds)
    || new Set(input.didNotPlayIds).size !== input.didNotPlayIds.length
    || input.didNotPlayIds.some((id) => !PLAYER_IDS.has(id))) {
    throw new ApiError(400, 'Seznam hráčů bez účasti obsahuje neplatné nebo opakované jméno.');
  }
  if (!Array.isArray(input.scorerIds)
    || new Set(input.scorerIds).size !== input.scorerIds.length) {
    throw new ApiError(400, 'Střelce z vypsané pětice zadej každého nejvýše jednou.');
  }
  if (POINT_PLAYER_IDS.some((id) => input.didNotPlayIds.includes(id)
    && input.playerPoints[id] !== 0)) {
    throw new ApiError(400, 'Hráč bez účasti musí mít u gólů a asistencí nula bodů.');
  }
  try {
    validateResult(input);
  } catch (error) {
    throw new ApiError(400, error.message || 'Výsledek zápasu není platný.');
  }
  return {
    homeGoals: input.homeGoals,
    awayGoals: input.awayGoals,
    scorerIds: input.scorerIds,
    playerPoints: input.playerPoints,
    firstGoalTeam: input.firstGoalTeam,
    didNotPlayIds: input.didNotPlayIds,
  };
}

export function evaluationsFromTickets(tickets, result) {
  return tickets.flatMap((ticket) => {
    const picks = normalizeTicket(ticket.data().picks);
    if (!picks) return [];
    const score = scoreRound(picks, result);
    return [{ uid: ticket.id, picks, total: score.total, breakdown: score.breakdown }];
  });
}

export function assertPreviewMatches(previewEvaluations, evaluations) {
  if (!Array.isArray(previewEvaluations)
    || previewEvaluations.length !== evaluations.length) {
    throw new ApiError(409, 'Náhled bodů už není aktuální. Načti tikety znovu.');
  }
  const byUid = new Map();
  for (const item of previewEvaluations) {
    if (!item || typeof item !== 'object' || typeof item.uid !== 'string'
      || byUid.has(item.uid)) {
      throw new ApiError(400, 'Náhled bodů obsahuje neplatné nebo duplicitní hráče.');
    }
    byUid.set(item.uid, item);
  }
  for (const evaluation of evaluations) {
    const preview = byUid.get(evaluation.uid);
    if (!preview || preview.total !== evaluation.total
      || canonicalJson(preview.breakdown) !== canonicalJson(evaluation.breakdown)) {
      throw new ApiError(409, 'Náhled bodů už není aktuální. Načti tikety znovu.');
    }
  }
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function errorResponse(error) {
  if (!(error instanceof ApiError)) {
    console.error('Tipovačka API error:', error);
  }
  return json({ error: error instanceof ApiError
    ? error.message : 'Vyhodnocení se nepodařilo zpracovat. Zkus to znovu.' },
  error instanceof ApiError ? error.status : 500);
}
