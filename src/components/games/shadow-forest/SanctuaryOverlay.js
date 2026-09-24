'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronRight, Eye, MessageCircle, RotateCcw, TreePine, Moon } from 'lucide-react';
import { getSanctuaryDialogue, SANCTUARY_DIALOGUE_START } from './sanctuaryStory.mjs';
import styles from './SanctuaryOverlay.module.css';

export default function SanctuaryOverlay({ dialogueId, heroName, active = true, onAdvance, onRestart, onExplore, onSleep, eiraDown, savingAvailable, onReplay, onJournal }) {
  const [looking, setLooking] = useState(false);
  const node = getSanctuaryDialogue(dialogueId || SANCTUARY_DIALOGUE_START);
  const speaker = node?.speaker === 'hero' ? heroName || 'Poutník' : 'Eira';
  const speech = useRef(null);
  const restartButton = useRef(null);
  const previousNode = useRef(node);

  useEffect(() => {
    if (speech.current) speech.current.scrollTop = 0;
    if (previousNode.current && !node) restartButton.current?.focus({ preventScroll: true });
    previousNode.current = node;
  }, [node]);

  useEffect(() => {
    if (!active || looking || !node) return;
    const advanceOnKey = event => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey
        || !['Enter', 'Space'].includes(event.code) || event.target.isContentEditable
        || event.target.closest('button, a, input, select, textarea')) return;
      event.preventDefault(); onAdvance();
    };
    window.addEventListener('keydown', advanceOnKey);
    return () => window.removeEventListener('keydown', advanceOnKey);
  }, [active, looking, node, onAdvance]);

  return (
    <section className={styles.scene} data-sanctuary-dialogue={dialogueId || SANCTUARY_DIALOGUE_START} aria-label="Ohořelý strážce – objevené místo">
      <header className={styles.heading}>
        <p><TreePine size={12} /> STARÝ HVOZD · OBJEVENÉ MÍSTO</p>
        <h2 data-screen-title tabIndex={-1}>Ohořelý strážce</h2>
      </header>
      <div className={styles.bottom} data-dialogue-active={Boolean(node && !looking)}>
        {!looking && node && <div className={styles.dialogue}>
          <div className={styles.speaker}><MessageCircle size={14} aria-hidden="true" /><span>{speaker}</span><small>{node.speaker === 'hero' ? 'TVÁ POSTAVA' : 'SPOLEČNICE'}</small></div>
          <div ref={speech} className={styles.speech} tabIndex={0} aria-live="polite" aria-atomic="true">
            <span className={styles.srOnly}>{speaker}: </span><p>{node.text}</p>
          </div>
          <div className={styles.dialogueActions}>
            {!savingAvailable && <p className={styles.notice}>Rozhovor se teď nemůže uložit.</p>}
            <button type="button" onClick={onAdvance}>{node.end ? 'Dokončit rozhovor' : 'Pokračovat'}<ChevronRight size={16} aria-hidden="true" /></button>
          </div>
        </div>}
        {!looking && !node && <div className={styles.story}>
          <p>{eiraDown ? 'Eira se ti opře o rameno. Oba jste v bezpečí.' : 'Eira pomalu vydechne. Oba jste v bezpečí.'} Louka doutná. Starý dub stále stojí.</p>
          <p className={styles.memory}>Pod spálenou kůrou zůstalo znamení. Na tohle místo nezapomenete.</p>
          <div className={styles.nextSteps}>
            <button type="button" onClick={onExplore}><Eye size={15} aria-hidden="true" /> Prozkoumat okolí</button>
            <button type="button" onClick={onSleep} aria-label="Vrátit se k táboráku a jít spát"><Moon size={15} aria-hidden="true" /><span>Jít spát<small>Lesem k táboráku</small></span></button>
          </div>
          <button type="button" className={styles.journal} onClick={onJournal}><BookOpen size={14} /> Zapsáno do deníku</button>
          <button ref={restartButton} type="button" className={styles.journal} onClick={onRestart}><MessageCircle size={14} /> Přehrát rozhovor</button>
          {!savingAvailable && <p className={styles.notice}>Postup se teď nemůže uložit.</p>}
        </div>}
        <div className={styles.actions}>
          <button type="button" onClick={() => setLooking(!looking)} aria-pressed={looking}><Eye size={14} /> {looking ? (node ? 'Zpět k rozhovoru' : 'Zobrazit příběh') : 'Rozhlédnout se'}</button>
          <button type="button" onClick={onReplay}><RotateCcw size={14} /> Přehrát scénku</button>
        </div>
      </div>
    </section>
  );
}
