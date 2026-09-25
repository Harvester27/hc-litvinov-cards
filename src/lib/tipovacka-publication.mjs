import { createHash } from 'node:crypto';
import { TIPOVACKA_ROUND, isCompletePicks, scoreRound, validateResult } from './tipovacka.mjs';

export const ADMIN_EMAIL = 'sanarycogames@outlook.cz';
export const ROUND_ID = TIPOVACKA_ROUND.id;
export const MAX_TICKETS = 200;
export const PREVIEW_LIFETIME_MS = 15 * 60 * 1000;
const RESULT_FIELDS = ['homeGoals', 'awayGoals', 'scorerIds', 'playerPoints', 'firstGoalTeam', 'didNotPlayIds'];
const POINT_IDS = TIPOVACKA_ROUND.questions.topPoints.options.map(({ id }) => id);
const SCORER_IDS = TIPOVACKA_ROUND.questions.scorer.options.map(({ id }) => id);
const PLAYER_IDS = new Set([...POINT_IDS, ...SCORER_IDS.filter((id) => id !== 'none-listed')]);

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function normalizeTicket(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const fields = ['outcome', 'scorer', 'topPoints', 'firstGoal', 'totalGoals'];
  if (Object.keys(raw).length !== fields.length || !fields.every((key) => Object.hasOwn(raw, key))) return null;
  // Preserve the original admin ticket: legacy single-player selections mean 10 points.
  const scorer = typeof raw.scorer === 'string' && SCORER_IDS.includes(raw.scorer)
    ? Object.fromEntries(SCORER_IDS.map((id) => [id, id === raw.scorer ? 10 : 0]))
    : raw.scorer;
  const picks = { outcome: raw.outcome, scorer, topPoints: raw.topPoints,
    firstGoal: raw.firstGoal, totalGoals: raw.totalGoals };
  return isCompletePicks(picks) ? picks : null;
}

export function officialResult(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== RESULT_FIELDS.length
    || !RESULT_FIELDS.every((key) => Object.hasOwn(input, key))) {
    throw new ApiError(400, 'Výsledek zápasu nemá požadovaná pole.');
  }
  if (!input.playerPoints || typeof input.playerPoints !== 'object' || Array.isArray(input.playerPoints)
    || Object.keys(input.playerPoints).length !== POINT_IDS.length
    || !POINT_IDS.every((id) => Object.hasOwn(input.playerPoints, id))) {
    throw new ApiError(400, 'Vyplň body všech tří vypsaných hráčů.');
  }
  if (!Array.isArray(input.didNotPlayIds)
    || new Set(input.didNotPlayIds).size !== input.didNotPlayIds.length
    || input.didNotPlayIds.some((id) => !PLAYER_IDS.has(id))) {
    throw new ApiError(400, 'Seznam hráčů bez účasti obsahuje neplatné nebo opakované jméno.');
  }
  if (POINT_IDS.some((id) => input.didNotPlayIds.includes(id) && input.playerPoints[id] !== 0)) {
    throw new ApiError(400, 'Hráč bez účasti musí mít u gólů a asistencí nula bodů.');
  }
  if (![input.homeGoals, input.awayGoals].every((goals) => Number.isSafeInteger(goals) && goals >= 0 && goals <= 100)) {
    throw new ApiError(400, 'Konečné skóre musí obsahovat celá čísla od 0 do 100.');
  }
  try { validateResult(input); } catch (error) {
    throw new ApiError(400, error.message || 'Výsledek zápasu není platný.');
  }
  return { homeGoals: input.homeGoals, awayGoals: input.awayGoals,
    scorerIds: [...input.scorerIds].sort(),
    playerPoints: Object.fromEntries(POINT_IDS.map((id) => [id, input.playerPoints[id]])),
    firstGoalTeam: input.firstGoalTeam, didNotPlayIds: [...input.didNotPlayIds].sort() };
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export const fingerprint = (value) => createHash('sha256').update(canonicalJson(value)).digest('hex');
export const roundPoints = (points) => Math.round(points * 10) / 10;

export function evaluationsFromTickets(tickets, result) {
  if (tickets.length > MAX_TICKETS) throw new ApiError(413, 'Toto kolo podporuje nejvýše 200 tiketů pro společné vyhodnocení.');
  return tickets.map((ticket) => {
    const data = ticket.data();
    const picks = normalizeTicket(data?.picks);
    if (data?.roundId !== ROUND_ID || !picks) {
      throw new ApiError(409, `Tiket hráče ${ticket.id} je neplatný. Zveřejnění je zablokované; oprav data a vytvoř nový náhled.`);
    }
    const score = scoreRound(picks, result);
    return { uid: ticket.id, picks, total: score.total, breakdown: score.breakdown };
  }).sort((a, b) => a.uid.localeCompare(b.uid));
}

export function ticketFingerprint(tickets) {
  return fingerprint(tickets.map((ticket) => ({ uid: ticket.id, data: ticket.data() }))
    .sort((a, b) => a.uid.localeCompare(b.uid)));
}

export function roundRevision(round) {
  if (!round) return 0;
  if (round.status !== 'published' || round.roundId !== ROUND_ID
    || (round.revision !== undefined && (!Number.isSafeInteger(round.revision) || round.revision < 1))) {
    throw new ApiError(409, 'Uložené vyhodnocení kola má neplatný stav.');
  }
  return round.revision ?? 1;
}

export function correctionReason(value, isCorrection) {
  if (!isCorrection) return null;
  if (typeof value !== 'string' || value.trim().length < 10 || value.trim().length > 500) {
    throw new ApiError(400, 'U opravy uveď konkrétní důvod v délce 10 až 500 znaků.');
  }
  return value.trim();
}

export function assertRoundStarted(now) {
  if (now < Date.parse(TIPOVACKA_ROUND.startsAt)) {
    throw new ApiError(409, 'Konečný výsledek lze připravit a zveřejnit až po začátku zápasu.');
  }
}

export function addPreviousEvaluations(evaluations, previousDocs, isCorrection) {
  const previous = new Map(previousDocs.map((doc) => [doc.id, doc.data()]));
  if (isCorrection && (previous.size !== evaluations.length
    || evaluations.some(({ uid }) => !previous.has(uid)))) {
    throw new ApiError(409, 'Seznam tiketů neodpovídá zveřejněnému kolu. Oprava nesmí přidávat ani odebírat hráče.');
  }
  return evaluations.map((evaluation) => {
    const old = previous.get(evaluation.uid);
    if (isCorrection && (!Number.isFinite(old.total)
      || canonicalJson(normalizeTicket(old.picks)) !== canonicalJson(evaluation.picks))) {
      throw new ApiError(409, `Zveřejněný tiket hráče ${evaluation.uid} se změnil nebo má neplatné body.`);
    }
    const previousTotal = isCorrection ? old.total : 0;
    return { ...evaluation, previousTotal, delta: roundPoints(evaluation.total - previousTotal) };
  });
}
