'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, Check, Clock3, FlaskConical, LockKeyhole, RotateCcw, Save, ShieldCheck, Trophy } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase';
import { TIPOVACKA_ROUND, riskOutcome, isCompletePicks, scoreRound } from '@/lib/tipovacka.mjs';
import styles from './page.module.css';

const ADMIN_EMAIL = 'sanarycogames@outlook.cz';
const PREVIEW_COLLECTION = 'tipovackaPreview';
const QUESTION_KEYS = ['outcome', 'scorer', 'topPoints', 'firstGoal', 'totalGoals'];
const INITIAL_PICKS = { outcome: null, scorer: null, topPoints: null, firstGoal: null, totalGoals: null };
const QUESTION_DESCRIPTIONS = {
  outcome: 'Rozhoduje skóre po prodloužení. Vítězství na nájezdy se zde počítá jako remíza.',
  scorer: 'Vyber jednoho hráče. Tip vyjde, pokud v zápase vstřelí alespoň jeden gól.',
  topPoints: 'Body hráčů znamenají góly a asistence. Při shodě na prvním místě se otázka anuluje.',
  firstGoal: 'Který tým vstřelí první gól? Při zápase bez gólu se otázka anuluje.',
  totalGoals: 'Tipni přesný počet gólů obou týmů včetně prodloužení; nájezdy se nepočítají.',
};

const formatPoints = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('cs-CZ')}`;
const formatOdds = (value) => Number(value).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

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
  const risky = questionKey === 'outcome' || questionKey === 'scorer' || questionKey === 'topPoints';

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

function QuestionCard({ index, questionKey, question, selected, onSelect }) {
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
      {totalGoals ? (
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
                {TIPOVACKA_ROUND.questions.scorer.options.map((player) => (
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
                {[...new Map([...TIPOVACKA_ROUND.questions.scorer.options, ...TIPOVACKA_ROUND.questions.topPoints.options].map((player) => [player.id, player])).values()].map((player) => (
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
  const [loadState, setLoadState] = useState('loading');
  const [loadedUid, setLoadedUid] = useState(null);
  const [picks, setPicks] = useState(INITIAL_PICKS);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!admin) {
      setPicks(INITIAL_PICKS);
      setLoadedUid(null);
      router.replace('/games');
      return;
    }

    let active = true;
    const uid = user.uid;
    const loadDraft = async () => {
      setLoadState('loading');
      setLoadedUid(null);
      setNotice('');
      setPicks(INITIAL_PICKS);
      try {
        const snapshot = await getDoc(doc(db, PREVIEW_COLLECTION, uid));
        if (!active || !isCurrentAdmin(uid)) return;
        const data = snapshot.data();
        if (data?.roundId === TIPOVACKA_ROUND.id && isCompletePicks(data.picks)) {
          setPicks(data.picks);
          setNotice('Uložený návrh byl načten.');
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
  }, [admin, loading, router, retryCount, user]);

  const selectPick = (questionKey, value) => {
    setPicks((previous) => ({ ...previous, [questionKey]: value }));
    setNotice('');
  };

  const saveDraft = async () => {
    if (!admin || !user || saving || !isCompletePicks(picks) || !isCurrentAdmin(user.uid)) return;
    setSaving(true);
    setNotice('');
    try {
      await setDoc(doc(db, PREVIEW_COLLECTION, user.uid), {
        roundId: TIPOVACKA_ROUND.id,
        picks,
        updatedAt: serverTimestamp(),
      });
      if (isCurrentAdmin(user.uid)) setNotice('Návrh tipů je uložený jen pro tvůj administrátorský účet.');
    } catch {
      if (isCurrentAdmin(user.uid)) setNotice('Uložení se nepovedlo. Zkus to prosím znovu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !admin || loadState === 'loading' || loadedUid !== user.uid) return <LoadingScreen />;
  if (loadState === 'error') return <LoadingScreen message="Soukromý návrh tipů se nepodařilo načíst." retry={() => setRetryCount((count) => count + 1)} />;

  const complete = isCompletePicks(picks);
  const selectedCount = QUESTION_KEYS.filter((key) => picks[key] !== null && picks[key] !== undefined && picks[key] !== '').length;
  const adminName = user.displayName || user.email.split('@')[0];

  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.shell}>
        <div className={styles.breadcrumb}><Link href="/games"><ArrowLeft size={15} aria-hidden="true" /> Všechny hry</Link><span>/</span><span>Tipovačka</span></div>
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.heroKicker}><span className={styles.liveDot} /> LANCERS PLAY / TIPOVAČKA</span>
            <h1>Každý zápas<br /><em>má svůj tip.</em></h1>
            <p>Vyber výsledek, střelce a odpověz na dvě otázky bez rizika. Body mohou jít i do mínusu.</p>
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
            <div className={styles.sectionIntro}>
              <span className={styles.eyebrow}>KOLO 01 / PŘÍPRAVA</span>
              <h2>Tvůj tiket</h2>
              <p>Vyber jednu odpověď v každé otázce. Tohle je zatím soukromá zkouška, ostatní hráči nic neuvidí.</p>
            </div>
            <div className={styles.questions}>
              {QUESTION_KEYS.map((key, index) => <QuestionCard key={key} index={index} questionKey={key} question={TIPOVACKA_ROUND.questions[key]} selected={picks[key]} onSelect={selectPick} />)}
            </div>
            <div className={styles.savePanel}>
              <div><strong>{selectedCount} z 5 tipů vybráno</strong><p>Uložení návrhu neotevře Tipovačku ostatním.</p></div>
              <button type="button" className={styles.saveButton} disabled={!complete || saving} onClick={saveDraft}><Save size={17} aria-hidden="true" /> {saving ? 'Ukládám…' : 'Uložit svůj návrh'}</button>
            </div>
            {notice && <p className={styles.notice} role="status">{notice}</p>}
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.rulesCard}>
              <span className={styles.eyebrow}>JAK FUNGUJÍ BODY</span>
              <h2>Riskuješ. Nebo získáš.</h2>
              <p>První tři odpovědi mají vklad 10 bodů. Každá chybná odpověď ti odečte 10 bodů.</p>
              <div className={styles.ruleStat}><span>Všechno špatně</span><strong className={styles.negative}>−30 b.</strong></div>
              <div className={styles.ruleStat}><span>Bonus a extra tip při chybě</span><strong>0 b.</strong></div>
              <p className={styles.rulesSmall}>Záporné skóre je možné. Přesný počet gólů přidá za trefu 18 bodů.</p>
            </div>
            <div className={styles.privateCard}><LockKeyhole size={20} aria-hidden="true" /><div><strong>Soukromý náhled</strong><p>Tipy teď ukládá pouze administrátor. Výsledky a veřejný žebříček ještě nejsou spuštěné.</p></div></div>
          </aside>
        </div>

        <Simulation picks={picks} adminName={adminName} />
        <footer className={styles.footer}><Trophy size={16} aria-hidden="true" /><span>LANCERS PLAY</span><Link href="/games">Zpět na hry <RotateCcw size={13} aria-hidden="true" /></Link></footer>
      </main>
    </div>
  );
}
