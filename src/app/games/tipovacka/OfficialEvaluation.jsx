'use client';

import { TIPOVACKA_ROUND } from '@/lib/tipovacka.mjs';
import styles from './OfficialEvaluation.module.css';

const questionOrder = ['outcome', 'scorer', 'topPoints', 'firstGoal', 'totalGoals'];

const labelFor = (key, id) => TIPOVACKA_ROUND.questions[key].options?.find((option) => option.id === id)?.label ?? id;
const pointsText = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} b.`;

function correctAnswer(key, result) {
  if (key === 'outcome') {
    const winner = result.homeGoals > result.awayGoals ? 'lancers' : result.homeGoals < result.awayGoals ? 'wolves' : 'draw';
    return labelFor(key, winner);
  }
  if (key === 'scorer') {
    return result.scorerIds.length
      ? result.scorerIds.map((id) => labelFor('scorer', id)).join(', ')
      : 'Nikdo z uvedené pětice';
  }
  if (key === 'topPoints') {
    const eligible = TIPOVACKA_ROUND.questions.topPoints.options.filter(({ id }) => !result.didNotPlayIds.includes(id));
    if (!eligible.length) return 'Všichni tři nenastoupili';
    const most = Math.max(...eligible.map(({ id }) => result.playerPoints[id]));
    const leaders = eligible.filter(({ id }) => result.playerPoints[id] === most);
    return `${leaders.map(({ label }) => label).join(', ')} (${most} b.)${leaders.length > 1 ? ' · shoda' : ''}`;
  }
  if (key === 'firstGoal') return result.firstGoalTeam ? labelFor(key, result.firstGoalTeam) : 'V zápase nepadl gól';
  return `${result.homeGoals + result.awayGoals} gólů`;
}

function pickedAnswer(key, item) {
  if (key === 'scorer') {
    return item.lines?.map((line) => `${labelFor('scorer', line.id)}: ${line.stake} b.`).join(' · ') || 'Bez tipu';
  }
  if (key === 'totalGoals') return `${item.pick} gólů`;
  return labelFor(key, item.pick);
}

function statusText(item) {
  if (item.status === 'void') return 'Anulováno';
  if (item.status === 'hit') return 'Trefa';
  if (item.status === 'mixed') return 'Částečná trefa';
  return 'Netrefeno';
}

export default function OfficialEvaluation({ round, evaluation }) {
  if (!round?.result) return null;
  const { result } = round;

  return (
    <section className={styles.wrap} aria-labelledby="official-result-title">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>OFICIÁLNÍ VYHODNOCENÍ · KOLO 01</span>
          <h2 id="official-result-title">Výsledek zápasu</h2>
        </div>
        <strong className={styles.score}>Lancers {result.homeGoals} : {result.awayGoals} Wolves</strong>
      </div>
      <p className={styles.resultNote}>Skóre je po prodloužení bez nájezdů. První gól: {correctAnswer('firstGoal', result)}.</p>
      {evaluation ? (
        <>
          <div className={styles.total}><span>Tvůj výsledek za toto kolo</span><strong>{pointsText(evaluation.total)}</strong></div>
          <div className={styles.questions}>
            {questionOrder.map((key, index) => {
              const item = evaluation.breakdown?.[key];
              if (!item) return null;
              return (
                <article className={styles.question} key={key}>
                  <div className={styles.questionTitle}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{TIPOVACKA_ROUND.questions[key].title}</h3>
                    <strong className={item.points < 0 ? styles.loss : item.points > 0 ? styles.win : styles.zero}>{pointsText(item.points)}</strong>
                  </div>
                  <div className={styles.answers}>
                    <p><span>Tvůj tip</span>{pickedAnswer(key, item)}</p>
                    <p><span>Skutečnost</span>{correctAnswer(key, result)}</p>
                  </div>
                  <p className={styles.status}>{statusText(item)}{item.reason ? ` · ${item.reason}` : ''}</p>
                  {key === 'scorer' && item.lines?.length > 0 && (
                    <ul className={styles.scorerLines}>
                      {item.lines.map((line) => (
                        <li key={line.id}>
                          <span>{labelFor('scorer', line.id)} · vklad {line.stake} b.{line.reason ? ` · ${line.reason}` : ''}</span>
                          <strong className={line.points < 0 ? styles.loss : line.points > 0 ? styles.win : styles.zero}>{pointsText(line.points)}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : <p className={styles.noTicket}>Pro toto kolo nemáš uložený tiket. Správný výsledek a tabulku přesto uvidíš.</p>}
    </section>
  );
}
