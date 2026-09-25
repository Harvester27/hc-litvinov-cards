'use client';

import { useMemo, useState } from 'react';
import { Check, ClipboardCheck, Eye, LoaderCircle } from 'lucide-react';
import { isCompletePicks, TIPOVACKA_ROUND, validateResult } from '@/lib/tipovacka.mjs';
import styles from './ResultAdminPanel.module.css';

const QUESTION_KEYS = ['outcome', 'scorer', 'topPoints', 'firstGoal', 'totalGoals'];
const scorerPlayers = TIPOVACKA_ROUND.questions.scorer.options.filter(({ id }) => id !== 'none-listed');
const pointPlayers = TIPOVACKA_ROUND.questions.topPoints.options;
const allPlayers = [...new Map([...scorerPlayers, ...pointPlayers].map((player) => [player.id, player])).values()];

const blankDraft = () => ({
  homeGoals: '',
  awayGoals: '',
  scorerIds: [],
  playerPoints: Object.fromEntries(pointPlayers.map(({ id }) => [id, ''])),
  firstGoalTeam: '',
  didNotPlayIds: [],
});

const playerLabel = (id) => allPlayers.find((player) => player.id === id)?.label ?? id;
const optionLabel = (key, id) => TIPOVACKA_ROUND.questions[key].options.find((option) => option.id === id)?.label ?? id;
const pointsLabel = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} b.`;
const statusLabel = (status) => status === 'hit' ? 'Trefa' : status === 'miss' ? 'Chyba' : status === 'void' ? 'Anulováno' : 'Část trefena';

function answerLabel(key, item) {
  if (key === 'totalGoals') return `${item.pick} gólů`;
  if (key === 'scorer') return item.lines.map(({ id, stake }) => `${optionLabel('scorer', id)} (${stake} b.)`).join(', ');
  return optionLabel(key, item.pick);
}

function buildResult(draft) {
  if (draft.homeGoals === '' || draft.awayGoals === '') {
    throw new Error('Vyplň konečné skóre obou týmů. Nájezdy do skóre nezapočítávej.');
  }
  const homeGoals = Number(draft.homeGoals);
  const awayGoals = Number(draft.awayGoals);
  if (![homeGoals, awayGoals].every((goals) => Number.isSafeInteger(goals) && goals >= 0)) {
    throw new Error('Skóre musí obsahovat celá nezáporná čísla.');
  }
  for (const { id, label } of pointPlayers) {
    if (!draft.didNotPlayIds.includes(id) && draft.playerPoints[id] === '') {
      throw new Error(`Vyplň góly a asistence hráče ${label}. Pokud nenastoupil, označ to níže.`);
    }
  }
  if (homeGoals + awayGoals > 0 && !draft.firstGoalTeam) {
    throw new Error('Vyber tým, který vstřelil první gól.');
  }
  const result = {
    homeGoals,
    awayGoals,
    scorerIds: [...draft.scorerIds],
    playerPoints: Object.fromEntries(pointPlayers.map(({ id }) => [
      id, draft.didNotPlayIds.includes(id) ? 0 : Number(draft.playerPoints[id]),
    ])),
    firstGoalTeam: homeGoals + awayGoals === 0 ? null : draft.firstGoalTeam,
    didNotPlayIds: [...draft.didNotPlayIds],
  };
  if (result.scorerIds.length > homeGoals) {
    throw new Error('Zaškrtl jsi více střelců z vypsané pětice, než kolik Lancers vstřelili gólů.');
  }
  const impossibleScorer = result.scorerIds.find((id) => result.didNotPlayIds.includes(id));
  if (impossibleScorer) {
    throw new Error(`${playerLabel(impossibleScorer)} je současně označen jako střelec a jako hráč, který nenastoupil.`);
  }
  for (const { id, label } of pointPlayers) {
    if (!result.didNotPlayIds.includes(id) && result.playerPoints[id] > homeGoals) {
      throw new Error(`${label} nemůže mít více gólů a asistencí, než Lancers vstřelili branek.`);
    }
  }
  validateResult(result);
  return result;
}

function ScorePreview({ result, evaluations, published = false }) {
  return (
    <section className={styles.preview} aria-labelledby="official-result-preview-title">
      <div className={styles.previewHead}>
        <div>
          <span className={styles.eyebrow}>{published ? 'ZVEŘEJNĚNÉ VYHODNOCENÍ' : 'NÁHLED PŘED ZVEŘEJNĚNÍM'}</span>
          <h3 id="official-result-preview-title">Lancers {result.homeGoals} : {result.awayGoals} Wolves</h3>
          <p>{published ? 'Body za toto kolo jsou započítané v tabulce.' : 'Zkontroluj výsledek a body každého hráče. Náhled zatím nikomu body nepřipisuje.'}</p>
        </div>
        <strong className={styles.ticketCount}>{evaluations.length} {evaluations.length === 1 ? 'tiket' : evaluations.length >= 2 && evaluations.length <= 4 ? 'tikety' : 'tiketů'}</strong>
      </div>
      <dl className={styles.resultFacts}>
        <div><dt>Střelci z pětice</dt><dd>{result.scorerIds.length ? result.scorerIds.map(playerLabel).join(', ') : 'Nikdo'}</dd></div>
        <div><dt>Body vybrané trojice</dt><dd>{pointPlayers.map(({ id, label }) => `${label}: ${result.didNotPlayIds.includes(id) ? 'nenastoupil' : `${result.playerPoints[id]} b.`}`).join(' · ')}</dd></div>
        <div><dt>První gól</dt><dd>{result.firstGoalTeam ? optionLabel('firstGoal', result.firstGoalTeam) : 'Bez gólu'}</dd></div>
        <div><dt>Nenastoupili</dt><dd>{result.didNotPlayIds.length ? result.didNotPlayIds.map(playerLabel).join(', ') : 'Nikdo z vypsaných'}</dd></div>
      </dl>
      {evaluations.length === 0 ? (
        <p className={styles.empty}>Zatím není uložený žádný dokončený tiket. Výsledek lze i tak zveřejnit, body se nepřičtou nikomu.</p>
      ) : (
        <div className={styles.evaluations}>
          {evaluations.map(({ uid, displayName, score, previousTotal, delta }) => (
            <article className={styles.playerResult} key={uid}>
              <div className={styles.playerResultHead}>
                <h4>{displayName}</h4>
                <strong className={score.total < 0 ? styles.loss : styles.gain}>{pointsLabel(score.total)}</strong>
              </div>
              {previousTotal !== null && previousTotal !== undefined && <p className={styles.delta}>Před opravou {pointsLabel(previousTotal)} · změna v tabulce {pointsLabel(delta)}</p>}
              <ol className={styles.breakdown}>
                {QUESTION_KEYS.map((key) => {
                  const item = score.breakdown[key];
                  return (
                    <li key={key}>
                      <div className={styles.breakdownMain}>
                        <div>
                          <strong>{TIPOVACKA_ROUND.questions[key].title}</strong>
                          <span>{answerLabel(key, item)}</span>
                        </div>
                        <div className={styles.breakdownOutcome}>
                          <span>{statusLabel(item.status)}</span>
                          <strong className={item.points < 0 ? styles.loss : item.points > 0 ? styles.gain : styles.even}>{pointsLabel(item.points)}</strong>
                        </div>
                      </div>
                      {item.reason && <p className={styles.voidReason}>{item.reason}</p>}
                      {key === 'scorer' && item.lines.length > 0 && (
                        <div className={styles.scorerLines}>
                          {item.lines.map((line) => (
                            <span key={line.id}>{optionLabel('scorer', line.id)}: <b className={line.points < 0 ? styles.loss : line.points > 0 ? styles.gain : styles.even}>{pointsLabel(line.points)}</b>{line.reason ? ` · ${line.reason}` : ''}</span>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/** Both preview and publication are validated and calculated by the server. */
export default function ResultAdminPanel({ tickets = [], onPreview, onPublish, publishing = false, publishedResult = null, canPublish = true }) {
  const [draft, setDraft] = useState(() => publishedResult ? {
    ...publishedResult, homeGoals: String(publishedResult.homeGoals), awayGoals: String(publishedResult.awayGoals),
    firstGoalTeam: publishedResult.firstGoalTeam ?? '',
    playerPoints: Object.fromEntries(Object.entries(publishedResult.playerPoints).map(([id, value]) => [id, String(value)])),
  } : blankDraft());
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishSucceeded, setPublishSucceeded] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const ticketSignature = JSON.stringify(tickets.map(({ uid, displayName, picks }) => [uid, displayName, picks]));
  const invalidTickets = useMemo(() => tickets.filter(({ picks }) => !isCompletePicks(picks)), [tickets]);
  const previewCurrent = preview?.ticketSignature === ticketSignature ? preview : null;
  const locked = Boolean(publishSucceeded || publishing || saving || previewing);

  const setField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setPreview(null);
    setError('');
  };
  const setPlayerPoints = (id, value) => {
    setDraft((current) => ({ ...current, playerPoints: { ...current.playerPoints, [id]: value } }));
    setPreview(null);
    setError('');
  };
  const togglePlayer = (key, id) => {
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((entry) => entry !== id) : [...current[key], id],
    }));
    setPreview(null);
    setError('');
  };

  const showPreview = async () => {
    if (locked) return;
    setPreviewing(true);
    setReviewConfirmed(false);
    try {
      if (!finalConfirmed) throw new Error('Nejdřív potvrď, že jde o konečný výsledek odehraného zápasu.');
      if (publishedResult && correctionReason.trim().length < 10) throw new Error('Popiš důvod opravy alespoň 10 znaky.');
      if (invalidTickets.length) {
        throw new Error(`Nejdřív oprav ${invalidTickets.length} neúplný nebo neplatný tiket. Jinak by hráči přišli o vyhodnocení.`);
      }
      const result = buildResult(draft);
      const response = await onPreview(result, publishedResult ? correctionReason.trim() : undefined);
      const evaluations = response.evaluations.map((item) => ({
        ...item,
        previousTotal: response.mode === 'correct' ? item.previousTotal : null,
        displayName: item.displayName ?? tickets.find(({ uid }) => uid === item.uid)?.displayName ?? item.uid,
        score: { total: item.total, breakdown: item.breakdown },
      }));
      setPreview({ ...response, evaluations, ticketSignature });
      setError('');
    } catch (cause) {
      setPreview(null);
      setError(cause instanceof Error ? cause.message : 'Zkontroluj zadaný výsledek a zkus náhled znovu.');
    } finally {
      setPreviewing(false);
    }
  };

  const publish = async () => {
    if (!previewCurrent || !reviewConfirmed || !finalConfirmed || locked || !canPublish || typeof onPublish !== 'function') return;
    setSaving(true);
    setError('');
    try {
      await onPublish(previewCurrent.previewId);
      setPublishSucceeded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Zveřejnění se nepovedlo. Zkus to znovu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.panel} aria-labelledby="admin-result-title">
      <div className={styles.heading}>
        <ClipboardCheck size={27} aria-hidden="true" />
        <div><span className={styles.eyebrow}>ADMINISTRACE TIPOVAČKY</span><h2 id="admin-result-title">{publishedResult ? 'Opravit zveřejněný výsledek' : 'Zadat skutečný výsledek'}</h2><p>{publishedResult ? 'Oprava zachová historii a hráčům započte jen rozdíl bodů. Počet odehraných kol se nezmění.' : 'Vyplň konečný zápis po utkání, prohlédni body všech uložených tiketů a teprve potom vyhodnocení zveřejni.'}</p></div>
      </div>

      <div className={styles.formGrid}>
        <fieldset className={styles.fieldset}>
          <legend>1. Konečné skóre</legend>
          <div className={styles.scoreFields}>
            <label>Litvínov Lancers<input type="number" inputMode="numeric" min="0" step="1" value={draft.homeGoals} onChange={(event) => setField('homeGoals', event.target.value)} disabled={locked} /></label>
            <span aria-hidden="true">:</span>
            <label>HC Glacier Wolves<input type="number" inputMode="numeric" min="0" step="1" value={draft.awayGoals} onChange={(event) => setField('awayGoals', event.target.value)} disabled={locked} /></label>
          </div>
          <p>Zadej skóre po prodloužení. Vítězný nájezd se jako gól nepočítá; například 2:2 po prodloužení zůstane pro tipování remízou.</p>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>2. Střelci z vypsané pětice</legend>
          <p>Označ každého z těchto hráčů, který dal aspoň jeden gól. Pokud nikdo z nich neskóroval, nech vše nezaškrtnuté.</p>
          <div className={styles.checkGrid}>
            {scorerPlayers.map(({ id, label }) => <label key={id}><input type="checkbox" checked={draft.scorerIds.includes(id)} onChange={() => togglePlayer('scorerIds', id)} disabled={locked} /><span>{label}</span></label>)}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>3. Góly + asistence vybrané trojice</legend>
          <p>U každého hráče zadej jeho skutečný počet kanadských bodů v zápase. Nulu zadej výslovně.</p>
          <div className={styles.pointsGrid}>
            {pointPlayers.map(({ id, label }) => (
              <label key={id}><span>{label}</span><input type="number" inputMode="numeric" min="0" step="1" value={draft.didNotPlayIds.includes(id) ? '' : draft.playerPoints[id]} onChange={(event) => setPlayerPoints(id, event.target.value)} disabled={locked || draft.didNotPlayIds.includes(id)} placeholder={draft.didNotPlayIds.includes(id) ? 'Nenastoupil' : '—'} /></label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>4. První gól zápasu</legend>
          <p>Při výsledku 0:0 se bonusová otázka automaticky anuluje.</p>
          <select value={draft.homeGoals === '0' && draft.awayGoals === '0' ? '' : draft.firstGoalTeam} onChange={(event) => setField('firstGoalTeam', event.target.value)} disabled={locked || (draft.homeGoals === '0' && draft.awayGoals === '0')} aria-label="Tým prvního střelce">
            <option value="">Vyber tým</option><option value="lancers">Litvínov Lancers</option><option value="wolves">HC Glacier Wolves</option>
          </select>
        </fieldset>

        <fieldset className={`${styles.fieldset} ${styles.fullWidth}`}>
          <legend>5. Kdo nenastoupil?</legend>
          <p>U označeného hráče se jeho tip anuluje. Pokud nenastoupí celá pětice střelců, anuluje se i „Nikdo z uvedené pětice“. Pokud z trojice pro kanadské body nastoupí nejvýše jeden hráč, anuluje se celá třetí otázka.</p>
          <div className={styles.checkGrid}>
            {allPlayers.map(({ id, label }) => <label key={id}><input type="checkbox" checked={draft.didNotPlayIds.includes(id)} onChange={() => togglePlayer('didNotPlayIds', id)} disabled={locked} /><span>{label}</span></label>)}
          </div>
        </fieldset>
      </div>

      {publishedResult && <label className={styles.correctionReason}>Důvod opravy<textarea minLength={10} maxLength={500} value={correctionReason} disabled={locked} onChange={(event) => { setCorrectionReason(event.target.value); setPreview(null); }} placeholder="Co bylo v původním výsledku chybně a proč to opravuješ?" /></label>}
      <label className={styles.confirmation}><input type="checkbox" checked={finalConfirmed} disabled={locked} onChange={(event) => { setFinalConfirmed(event.target.checked); setPreview(null); }} /> Potvrzuji, že zápas skončil a zadávám jeho konečný výsledek.</label>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {!publishSucceeded && <button className={styles.previewButton} type="button" onClick={() => void showPreview()} disabled={locked || !finalConfirmed}><Eye size={18} aria-hidden="true" /> {previewing ? 'Ověřuji náhled na serveru…' : 'Zobrazit náhled bodů'}</button>}
      {preview && !previewCurrent && <p className={styles.stale} role="status">Uložené tikety se mezitím změnily. Zobraz nový náhled před zveřejněním.</p>}
      {previewCurrent && <ScorePreview result={previewCurrent.result} evaluations={previewCurrent.evaluations} />}
      {previewCurrent && <p className={styles.stale}>Náhled platí 15 minut. Při změně výsledku nebo tiketů je potřeba vytvořit a zkontrolovat nový náhled.</p>}
      {previewCurrent && !locked && (
        <div className={styles.publishBar}>
          <label className={styles.confirmation}><input type="checkbox" checked={reviewConfirmed} onChange={(event) => setReviewConfirmed(event.target.checked)} /> Zkontroloval jsem výsledek i body všech tiketů v tomto náhledu.</label>
          <p><strong>{canPublish ? 'Údaje souhlasí se zápisem?' : 'Zveřejnění bude možné po začátku zápasu.'}</strong><span>{canPublish ? 'Po zveřejnění se hráčům zobrazí vyhodnocení a body se zapíšou do tabulky.' : 'Náhled skutečného výsledku připrav až po skončení utkání. Před začátkem zápasu jej server nepovolí.'}</span></p>
          <button className={styles.publishButton} type="button" onClick={() => void publish()} disabled={saving || publishing || !canPublish || !reviewConfirmed || typeof onPublish !== 'function'}>
            {saving || publishing ? <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
            {saving || publishing ? 'Zveřejňuji…' : publishedResult ? 'Zveřejnit opravu a rozdíl bodů' : 'Zveřejnit vyhodnocení'}
          </button>
        </div>
      )}
      {publishSucceeded && !publishedResult && <p className={styles.success} role="status">Vyhodnocení bylo odesláno. Čekám na potvrzení zveřejnění z databáze.</p>}
    </section>
  );
}
