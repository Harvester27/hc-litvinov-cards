'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, Check, Clock3, FlaskConical, LockKeyhole, RotateCcw, Save, ShieldCheck, Trophy } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase';
import { TIPOVACKA_ROUND, riskOutcome, scorerStakeOutcome, isCompletePicks, maxPossiblePoints, scoreRound } from '@/lib/tipovacka.mjs';
import styles from './page.module.css';

const ADMIN_EMAIL = 'sanarycogames@outlook.cz';
const PREVIEW_COLLECTION = 'tipovackaPreview';
const QUESTION_KEYS = ['outcome', 'scorer', 'topPoints', 'firstGoal', 'totalGoals'];
const emptyScorerStakes = () => Object.fromEntries(TIPOVACKA_ROUND.questions.scorer.options.map(({ id }) => [id, 0]));
const INITIAL_PICKS = { outcome: null, scorer: emptyScorerStakes(), topPoints: null, firstGoal: null, totalGoals: null };
const QUESTION_DESCRIPTIONS = {
  outcome: 'Rozhoduje skóre po prodloužení. Vítězství na nájezdy se zde počítá jako remíza.',
  scorer: 'Rozděl přesně 10 bodů mezi libovolné možnosti. Můžeš vsadit na jednoho, více hráčů i na to, že nedá gól nikdo z uvedených.',
  topPoints: 'Body hráčů znamenají góly a asistence. Při shodě na prvním místě se otázka anuluje.',
  firstGoal: 'Který tým vstřelí první gól? Při zápase bez gólu se otázka anuluje.',
  totalGoals: 'Tipni přesný počet gólů obou týmů včetně prodloužení; nájezdy se nepočítají.',
};

const formatPoints = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}`;
const formatOdds = (value) => Number(value).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function normalizeSavedPicks(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return INITIAL_PICKS;
  const scorer = raw.scorer && typeof raw.scorer === 'object' && !Array.isArray(raw.scorer)
    ? Object.fromEntries(TIPOVACKA_ROUND.questions.scorer.options.map(({ id }) => [id, Number.isInteger(raw.scorer[id]) ? raw.scorer[id] : 0]))
    : TIPOVACKA_ROUND.questions.scorer.options.some(({ id }) => id === raw.scorer)
      ? Object.fromEntries(TIPOVACKA_ROUND.questions.scorer.options.map(({ id }) => [id, id === raw.scorer ? 10 : 0]))
      : emptyScorerStakes();
  return {
    outcome: raw.outcome ?? null,
    scorer,
    topPoints: raw.topPoints ?? null,
    firstGoal: raw.firstGoal ?? null,
    totalGoals: raw.totalGoals ?? null,
  };
}

function hasAnswered(key, picks) {
  const question = TIPOVACKA_ROUND.questions[key];
  if (key === 'scorer') {
    const stakes = picks.scorer;
    return question.options.every(({ id }) => Number.isInteger(stakes?.[id]) && stakes[id] >= 0 && stakes[id] <= question.stake)
      && Object.values(stakes ?? {}).reduce((sum, stake) => sum + stake, 0) === question.stake;
  }
  if (key === 'totalGoals') return Number.isInteger(picks.totalGoals) && picks.totalGoals >= question.min && picks.totalGoals <= question.max;
  return question.options.some(({ id }) => id === picks[key]);
}

function makeInitialSimulation() {
  const pointPlayers = TIPOVACKA_ROUND.questions.topPoints.options;
  return {
    homeGoals: 2,
    awayGoals: 1,
    scorerIds: [],
    playerPoints: Object.fromEntries(pointPlayers.map((player) => [player.id, 0])),
    firstGoalTeam: 'lancers',
    didNotPlayIds: [],
  };
}

function isCurrentAdmin(uid) {
  const current = auth.currentUser;
  return current?.uid === uid && current.emailVerified && current.email?.toLowerCase() === ADMIN_EMAIL;
}

function LoadingScreen({ message = 'Ověřuji přístup…', retry }) {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.loadingWrap}>
        <div className={styles.loadingCard} role={retry ? 'alert' : 'status'}>
          <LockKeyhole aria-hidden="true" size={25} />
          <p>{message}</p>
          {retry && <button type="button" onClick={retry}>Zkusit znovu</button>}
        </div>
      </main>
    </div>
  );
}

function OptionGroup({ questionKey, question, selected, onSelect }) {
  const risky = questionKey === 'outcome' || questionKey === 'topPoints';

  return (
    <div className={styles.options} role="group" aria-label={question.title}>
      {question.options.map((option) => {
        const outcome = risky ? riskOutcome(option.odds) : { win: question.win, loss: question.loss };
        return (
          <label key={option.id} className={`${styles.option} ${selected === option.id ? styles.optionSelected : ''}`}>
            <input
              type="radio"
              name={`tip-${questionKey}`}
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(questionKey, option.id)}
            />
            <span className={styles.optionCheck} aria-hidden="true">{selected === option.id && <Check size={14} strokeWidth={3} />}</span>
            <span className={styles.optionBody}>
              <span className={styles.optionName}>{option.label}</span>
              <span className={styles.optionScores}>
                <span className={styles.positive}>Správně {formatPoints(outcome.win)} b.</span>
                <span className={outcome.loss < 0 ? styles.negative : styles.neutral}>Špatně {formatPoints(outcome.loss)} b.</span>
              </span>
            </span>
            {risky && <span className={styles.odds}>× {formatOdds(option.odds)}</span>}
          </label>
        );
      })}
    </div>
  );
}

function ScorerStakes({ question, selected, onSelect }) {
  const allocated = Object.values(selected).reduce((sum, stake) => sum + stake, 0);
  return (
    <div className={styles.stakesWrap}>
      <div className={styles.stakesProgress} aria-live="polite">
        <span>Rozděleno <strong className={allocated === question.stake ? styles.positive : allocated > question.stake ? styles.negative : ''}>{allocated} / {question.stake} bodů</strong></span>
        <span>{allocated === question.stake ? 'Hotovo' : allocated > question.stake ? `O ${allocated - question.stake} více` : `Zbývá ${question.stake - allocated}`}</span>
      </div>
      <div className={styles.stakesBar}><span style={{ width: `${Math.min(allocated / question.stake, 1) * 100}%` }} /></div>
      <div className={styles.stakeOptions} role="group" aria-label="Rozdělení bodů mezi střelce">
        {question.options.map((option) => {
          const stake = selected[option.id] ?? 0;
          const outcome = scorerStakeOutcome(stake, option.odds);
          return (
            <div key={option.id} className={`${styles.stakeOption} ${stake > 0 ? styles.stakeOptionActive : ''}`}>
              <div className={styles.stakeOptionInfo}>
                <strong>{option.label}</strong>
                <span>Kurz × {formatOdds(option.odds)}</span>
              </div>
              <label className={styles.stakeAmount}>
                <span className={styles.srOnly}>Body pro {option.label}</span>
                <input type="number" inputMode="numeric" min="0" max="10" step="1" value={stake} onChange={(event) => onSelect(option.id, event.target.value)} />
                <span>b.</span>
              </label>
              <div className={styles.stakeReturns}>
                <span className={styles.positive}>Trefa: {formatPoints(outcome.win)} b.</span>
                <span className={outcome.loss < 0 ? styles.negative : styles.neutral}>Chyba: {formatPoints(outcome.loss)} b.</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className={styles.stakeHint}>Možnost „Nikdo z uvedené pětice“ vyhrává, když neskóruje žádný z těchto pěti hráčů. Můžeš ji kombinovat s tipy na hráče, ale současně s nimi vyhrát nemůže.</p>
    </div>
  );
}

function QuestionCard({ index, questionKey, question, selected, onSelect, onStakeChange }) {
  const risky = index < 3;
  const totalGoals = questionKey === 'totalGoals';

  return (
    <section className={styles.question} aria-labelledby={`tip-title-${questionKey}`}>
      <div className={styles.questionHeading}>
        <span className={styles.questionNumber}>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <span className={styles.eyebrow}>{risky ? `TIP S RIZIKEM · VKLAD ${question.stake} BODŮ` : index === 3 ? 'BONUS · BEZ ZTRÁTY BODŮ' : 'EXTRA TIP · BEZ ZTRÁTY BODŮ'}</span>
          <h2 id={`tip-title-${questionKey}`}>{question.title}</h2>
          <p>{QUESTION_DESCRIPTIONS[questionKey]}</p>
        </div>
      </div>
      {questionKey === 'scorer' ? (
        <ScorerStakes question={question} selected={selected} onSelect={onStakeChange} />
      ) : totalGoals ? (
        <div className={styles.goalsPick}>
          <label htmlFor="tip-total-goals">Celkový počet gólů</label>
          <div className={styles.goalsInputRow}>
            <input
              id="tip-total-goals"
              type="number"
              inputMode="numeric"
              min={question.min}
              max={question.max}
              step="1"
              value={selected ?? ''}
              onChange={(event) => onSelect(questionKey, event.target.value === '' ? null : Number(event.target.value))}
              placeholder="?"
            />
            <span><strong className={styles.positive}>Správně {formatPoints(question.win)} b.</strong><br /><span className={styles.neutral}>Špatně {formatPoints(question.loss)} b.</span></span>
          </div>
          <small>Přesný tip má bodový kurz × {formatOdds(question.odds)} při vkladu 2 bodů.</small>
        </div>
      ) : (
        <OptionGroup questionKey={questionKey} question={question} selected={selected} onSelect={onSelect} />
      )}
    </section>
  );
}

function Simulation({ picks, adminName }) {
  const [result, setResult] = useState(makeInitialSimulation);
  const [visible, setVisible] = useState(false);
  const complete = isCompletePicks(picks);

  const evaluated = useMemo(() => {
    if (!complete) return { score: null, error: '' };
    try {
      return { score: scoreRound(picks, result), error: '' };
    } catch {
      return { score: null, error: 'Zkontroluj zadaný testovací výsledek a body hráčů.' };
    }
  }, [complete, picks, result]);

  const setNumber = (key, value) => setResult((previous) => ({ ...previous, [key]: value === '' ? null : Number(value) }));
  const toggleId = (key, id) => setResult((previous) => ({
    ...previous,
    [key]: previous[key].includes(id) ? previous[key].filter((current) => current !== id) : [...previous[key], id],
  }));

  return (
    <section className={styles.simulation} aria-labelledby="sim-title">
      <div className={styles.simulationIntro}>
        <div className={styles.simulationIcon}><FlaskConical size={22} aria-hidden="true" /></div>
        <div>
          <span className={styles.eyebrow}>POUZE V TOMTO PROHLÍŽEČI</span>
          <h2 id="sim-title">Zkusit vyhodnocení</h2>
          <p>Testovací výsledek se neukládá. Zatím nejde o skutečný zápas ani veřejný žebříček.</p>
        </div>
        <button type="button" className={styles.simulationToggle} onClick={() => setVisible((value) => !value)} aria-expanded={visible}>
          {visible ? 'Skrýt simulaci' : 'Otevřít simulaci'} <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      {visible && (
        <div className={styles.simulationContent}>
          <div className={styles.simulationFields}>
            <div className={styles.simBlock}>
              <h3>Testovací skóre</h3>
              <div className={styles.scoreInputs}>
                <label>Lancers<input type="number" min="0" max="30" step="1" value={result.homeGoals ?? ''} onChange={(event) => setNumber('homeGoals', event.target.value)} /></label>
                <span>:</span>
                <label>Wolves<input type="number" min="0" max="30" step="1" value={result.awayGoals ?? ''} onChange={(event) => setNumber('awayGoals', event.target.value)} /></label>
              </div>
              <p>Skóre po prodloužení; nájezdy se nezapočítávají.</p>
            </div>
            <div className={styles.simBlock}>
              <h3>Kdo z pěti vstřelil gól?</h3>
              <div className={styles.checkGrid}>
                {TIPOVACKA_ROUND.questions.scorer.options.filter((player) => player.id !== 'none-listed').map((player) => (
                  <label key={player.id}><input type="checkbox" checked={result.scorerIds.includes(player.id)} onChange={() => toggleId('scorerIds', player.id)} />{player.label}</label>
                ))}
              </div>
            </div>
            <div className={styles.simBlock}>
              <h3>Body vybrané trojice (góly + asistence)</h3>
              <div className={styles.playerPoints}>
                {TIPOVACKA_ROUND.questions.topPoints.options.map((player) => (
                  <label key={player.id}><span>{player.label}</span><input type="number" min="0" max="30" step="1" value={result.playerPoints[player.id] ?? ''} onChange={(event) => setResult((previous) => ({ ...previous, playerPoints: { ...previous.playerPoints, [player.id]: event.target.value === '' ? null : Number(event.target.value) } }))} /></label>
                ))}
              </div>
              <p>Shoda na nejvyšším počtu bodů znamená 0 bodů za tuto otázku.</p>
            </div>
            <div className={styles.simBlock}>
              <h3>První gól</h3>
              <select value={result.firstGoalTeam ?? ''} onChange={(event) => setResult((previous) => ({ ...previous, firstGoalTeam: event.target.value || null }))}>
                <option value="lancers">Lancers</option>
                <option value="wolves">Wolves</option>
                <option value="">Bez gólu</option>
              </select>
              <p>Pokud vybraný hráč nenastoupil, označ ho níže.</p>
              <div className={styles.checkGrid}>
                {[...new Map([...TIPOVACKA_ROUND.questions.scorer.options.filter((player) => player.id !== 'none-listed'), ...TIPOVACKA_ROUND.questions.topPoints.options].map((player) => [player.id, player])).values()].map((player) => (
                  <label key={player.id}><input type="checkbox" checked={result.didNotPlayIds.includes(player.id)} onChange={() => toggleId('didNotPlayIds', player.id)} />{player.label} nenastoupil</label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.simResult} aria-live="polite">
            <span className={styles.eyebrow}>ZKUŠEBNÍ ŽEBŘÍČEK</span>
            {!complete ? <p>Nejdřív vyber všech pět tipů.</p> : evaluated.error ? <p role="alert">{evaluated.error}</p> : (
              <>
                <div className={styles.leaderRow}><span className={styles.rank}>01</span><strong>{adminName}</strong><strong className={styles.leaderPoints}>{formatPoints(evaluated.score.total)} b.</strong></div>
                <ul className={styles.breakdown}>
                  {QUESTION_KEYS.map((key, index) => (
                    <li key={key}><span>{String(index + 1).padStart(2, '0')} · {TIPOVACKA_ROUND.questions[key].title}</span><strong className={evaluated.score.breakdown[key].points < 0 ? styles.negative : styles.positive}>{formatPoints(evaluated.score.breakdown[key].points)}</strong></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default function TipovackaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const admin = Boolean(user?.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL);
  const uid = user?.uid;
  const [loadState, setLoadState] = useState('loading');
  const [loadedUid, setLoadedUid] = useState(null);
  const [picks, setPicks] = useState(INITIAL_PICKS);
  const [activeStep, setActiveStep] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [notice, setNotice] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!admin) {
      setPicks(INITIAL_PICKS);
      setLoadedUid(null);
      setActiveStep(null);
      setFinished(false);
      router.replace('/games');
      return;
    }

    let active = true;
    const loadDraft = async () => {
      setLoadState('loading');
      setLoadedUid(null);
      setNotice('');
      setPicks(INITIAL_PICKS);
      setActiveStep(null);
      setFinished(false);
      setShowSimulation(false);
      try {
        const snapshot = await getDoc(doc(db, PREVIEW_COLLECTION, uid));
        if (!active || !isCurrentAdmin(uid)) return;
        const data = snapshot.data();
        if (data?.roundId === TIPOVACKA_ROUND.id) {
          const restored = normalizeSavedPicks(data.picks);
          setPicks(restored);
          setFinished(isCompletePicks(restored));
          setNotice(typeof data.picks?.scorer === 'string'
            ? 'Starší tip na střelce byl převeden na vklad 10 bodů. Po úpravě tiket znovu ulož.'
            : 'Uložený návrh byl načten.');
        }
        setLoadedUid(uid);
        setLoadState('ready');
      } catch {
        if (!active || !isCurrentAdmin(uid)) return;
        setLoadedUid(uid);
        setLoadState('error');
      }
    };

    loadDraft();
    return () => { active = false; };
  }, [admin, loading, router, retryCount, uid]);

  useEffect(() => {
    if (activeStep !== null) document.getElementById('tip-flow-heading')?.focus();
  }, [activeStep]);

  const selectPick = (questionKey, value) => {
    setPicks((previous) => ({ ...previous, [questionKey]: value }));
    setFinished(false);
    setSaveFailed(false);
    setNotice('');
  };

  const selectStake = (id, raw) => {
    const amount = raw === '' ? 0 : Number(raw);
    if (!Number.isInteger(amount) || amount < 0 || amount > 10) return;
    setPicks((previous) => ({ ...previous, scorer: { ...previous.scorer, [id]: amount } }));
    setFinished(false);
    setSaveFailed(false);
    setNotice('');
  };

  const saveDraft = async () => {
    if (!admin || !user || saving || !isCompletePicks(picks) || !isCurrentAdmin(user.uid)) return;
    setSaving(true);
    setSaveFailed(false);
    setNotice('');
    try {
      await setDoc(doc(db, PREVIEW_COLLECTION, user.uid), {
        roundId: TIPOVACKA_ROUND.id,
        picks,
        updatedAt: serverTimestamp(),
      });
      if (isCurrentAdmin(user.uid)) setNotice('Návrh tipů je uložený jen pro tvůj administrátorský účet.');
    } catch {
      if (isCurrentAdmin(user.uid)) {
        setSaveFailed(true);
        setNotice('Uložení se nepovedlo. Tipy zůstaly v tomto prohlížeči, zkus je uložit znovu.');
      }
    } finally {
      setSaving(false);
    }
  };

  const showStep = (step) => {
    setActiveStep(step);
    setShowSimulation(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startPicks = () => {
    const firstIncomplete = QUESTION_KEYS.findIndex((key) => !hasAnswered(key, picks));
    showStep(firstIncomplete < 0 ? 0 : firstIncomplete);
  };

  const finishPicks = () => {
    if (!isCompletePicks(picks)) return;
    setActiveStep(null);
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    void saveDraft();
  };

  const maximum = useMemo(
    () => finished && isCompletePicks(picks) ? maxPossiblePoints(picks) : null,
    [finished, picks],
  );

  if (loading || !admin || loadState === 'loading' || loadedUid !== user.uid) return <LoadingScreen />;
  if (loadState === 'error') return <LoadingScreen message="Soukromý návrh tipů se nepodařilo načíst." retry={() => setRetryCount((count) => count + 1)} />;

  const complete = isCompletePicks(picks);
  const selectedCount = QUESTION_KEYS.filter((key) => hasAnswered(key, picks)).length;
  const adminName = user.displayName || user.email.split('@')[0];
  const showingIntro = activeStep === null;
  const activeKey = showingIntro ? null : QUESTION_KEYS[activeStep];

  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.shell}>
        <div className={styles.breadcrumb}><Link href="/games"><ArrowLeft size={15} aria-hidden="true" /> Všechny hry</Link><span>/</span><span>Tipovačka</span></div>
        {showingIntro ? (
          <>
            <header className={styles.hero}>
              <div className={styles.heroText}>
                <span className={styles.heroKicker}><span className={styles.liveDot} /> LANCERS PLAY / TIPOVAČKA</span>
                <h1>Každý zápas<br /><em>má svůj tip.</em></h1>
                <p>Tipni si zápas Lancers proti Wolves. Na pět otázek odpovíš postupně, jednu po druhé.</p>
                <div className={styles.adminBadge}><ShieldCheck size={16} aria-hidden="true" /> Administrátorský náhled · vidíš jen ty</div>
              </div>
              <div className={styles.matchCard}>
                <span className={styles.matchEyebrow}>PŘÍŠTÍ ZÁPAS / ČESKÝ POHÁR</span>
                <div className={styles.matchNames}><strong>LANCERS</strong><span>VS</span><strong>WOLVES</strong></div>
                <div className={styles.matchMeta}><span><Clock3 size={15} aria-hidden="true" /> Sobota 26. září 2026 · 19:15</span><span>Most</span></div>
              </div>
            </header>

            <div className={styles.contentGrid}>
              <div className={styles.mainColumn}>
                <section className={styles.introPanel} aria-labelledby="intro-title">
                  <span className={styles.eyebrow}>KOLO 01 / PŘÍPRAVA</span>
                  {finished && complete ? (
                    <>
                      <h2 id="intro-title">Tiket je připravený.</h2>
                      <p>Všech pět odpovědí máš vyplněných. Kdykoli je můžeš projít a upravit.</p>
                      <div className={styles.maximumCard} aria-live="polite">
                        <span>TEORETICKÉ MAXIMUM TVÉHO TIKETU</span>
                        <strong>{formatPoints(maximum)} b.</strong>
                        <p>Jde o nejvyšší možný čistý zisk podle tvých tipů, pokud všichni uvedení hráči nastoupí. Skutečný počet bodů určí výsledek zápasu.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 id="intro-title">Jsi připravený tipovat?</h2>
                      <p>Čeká tě pět krátkých otázek. U střelců rozdělíš 10 bodů, jak budeš chtít. Chybné rizikové tipy mohou skóre dostat i do mínusu.</p>
                    </>
                  )}
                  <div className={styles.introActions}>
                    <button type="button" className={styles.startButton} onClick={startPicks}>{finished && complete ? 'Upravit tipy' : 'Začít tipovačku'} <ArrowRight size={20} aria-hidden="true" /></button>
                    <span>{selectedCount} z 5 odpovědí připraveno</span>
                  </div>
                </section>
                {finished && complete && (
                  <div className={styles.savePanel}>
                    <div><strong>{saving ? 'Ukládám tiket…' : saveFailed ? 'Uložení vyžaduje opakování' : 'Tvůj soukromý tiket'}</strong><p>Uložení návrhu neotevře Tipovačku ostatním.</p></div>
                    <button type="button" className={styles.saveButton} disabled={saving} onClick={() => void saveDraft()}><Save size={17} aria-hidden="true" /> {saveFailed ? 'Zkusit uložit znovu' : 'Uložit znovu'}</button>
                  </div>
                )}
                {notice && <p className={styles.notice} role="status">{notice}</p>}
              </div>
              <aside className={styles.sidebar}>
                <div className={styles.rulesCard}>
                  <span className={styles.eyebrow}>JAK FUNGUJÍ BODY</span>
                  <h2>Riskuješ. Nebo získáš.</h2>
                  <p>V první a třetí otázce riskuješ po 10 bodech. Ve druhé rozdělíš dalších 10 bodů mezi střelce; chybný dílčí tip odečte jen body, které jsi mu přidělil.</p>
                  <div className={styles.ruleStat}><span>Všechno špatně</span><strong className={styles.negative}>−30 b.</strong></div>
                  <div className={styles.ruleStat}><span>Bonus a extra tip při chybě</span><strong>0 b.</strong></div>
                  <p className={styles.rulesSmall}>Záporné skóre je možné. Přesný počet gólů přidá za trefu 18 bodů.</p>
                </div>
                <div className={styles.privateCard}><LockKeyhole size={20} aria-hidden="true" /><div><strong>Soukromý náhled</strong><p>Tipy teď ukládá pouze administrátor. Výsledky a veřejný žebříček ještě nejsou spuštěné.</p></div></div>
              </aside>
            </div>
            {finished && complete && (
              <div className={styles.simulationAccess}>
                <button type="button" onClick={() => setShowSimulation((value) => !value)} aria-expanded={showSimulation}>
                  <FlaskConical size={17} aria-hidden="true" /> {showSimulation ? 'Skrýt test vyhodnocení' : 'Otestovat vyhodnocení'}
                </button>
                {showSimulation && <Simulation picks={picks} adminName={adminName} />}
              </div>
            )}
          </>
        ) : (
          <section className={styles.flowWrap} aria-labelledby="tip-flow-heading">
            <div className={styles.flowHead}>
              <span className={styles.eyebrow}>KOLO 01 / TVŮJ TIKET</span>
              <h1 id="tip-flow-heading" tabIndex="-1">Otázka {activeStep + 1} <span>z 5</span></h1>
              <p>Na každé obrazovce je jedna otázka. K odpovědi se můžeš vrátit.</p>
              <div className={styles.flowProgress} aria-label={`Otázka ${activeStep + 1} z 5`}>
                {QUESTION_KEYS.map((key, index) => <span key={key} className={index <= activeStep ? styles.flowProgressActive : ''} />)}
              </div>
            </div>
            <QuestionCard index={activeStep} questionKey={activeKey} question={TIPOVACKA_ROUND.questions[activeKey]} selected={picks[activeKey]} onSelect={selectPick} onStakeChange={selectStake} />
            <div className={styles.flowActions}>
              <button type="button" className={styles.backButton} onClick={() => activeStep === 0 ? showStep(null) : showStep(activeStep - 1)}><ArrowLeft size={17} aria-hidden="true" /> {activeStep === 0 ? 'Úvod tipovačky' : 'Předchozí otázka'}</button>
              <button type="button" className={styles.startButton} disabled={!hasAnswered(activeKey, picks)} onClick={() => activeStep === QUESTION_KEYS.length - 1 ? finishPicks() : showStep(activeStep + 1)}>{activeStep === QUESTION_KEYS.length - 1 ? 'Dokončit tipovačku' : 'Další otázka'} <ArrowRight size={17} aria-hidden="true" /></button>
            </div>
            <p className={styles.flowHint}>Odpovězeno {selectedCount} z 5. Dokončený návrh se uloží k tvému administrátorskému účtu.</p>
          </section>
        )}
        <footer className={styles.footer}><Trophy size={16} aria-hidden="true" /><span>LANCERS PLAY</span><Link href="/games">Zpět na hry <RotateCcw size={13} aria-hidden="true" /></Link></footer>
      </main>
    </div>
  );
}
