'use client';

import { useEffect, useRef } from 'react';
import { ChevronRight, Feather, Flame, MessageCircle, Moon } from 'lucide-react';
import { getStoryNode } from './story.mjs';
import styles from './CampDialogue.module.css';

export default function CampDialogue({ nodeId, heroName, onAdvance, onDepart, savingAvailable = true }) {
  const node = getStoryNode(nodeId);
  const speech = useRef(null);
  const actions = useRef(null);
  const focusNextAction = useRef(false);
  const speaker = node.speaker === 'hero' ? heroName?.trim() || 'Poutník' : node.speaker === 'eira' ? 'Eira' : 'Vypravěč';
  const SpeakerIcon = node.speaker === 'hero' ? MessageCircle : node.speaker === 'eira' ? Flame : Feather;

  useEffect(() => {
    if (speech.current) speech.current.scrollTop = 0;
    if (focusNextAction.current) {
      actions.current?.querySelector('button')?.focus({ preventScroll: true });
      focusNextAction.current = false;
    }
  }, [nodeId]);

  function advance(choiceId) {
    focusNextAction.current = true;
    onAdvance(choiceId);
  }

  return (
    <section className={styles.camp} aria-labelledby="camp-story-title">
      <header className={styles.chapter}>
        <p><Moon size={10} aria-hidden="true" /> VEČER · LESNÍ TÁBOŘIŠTĚ</p>
        <h2 id="camp-story-title" data-screen-title tabIndex={-1}>Cesta do Březové brány</h2>
      </header>

      <div className={`${styles.panel} ${node.speaker === 'narrator' ? styles.narration : ''}`}>
        <div className={styles.speaker}>
          <SpeakerIcon size={14} aria-hidden="true" />
          <span>{speaker}</span>
          <span className={styles.speakerRule} aria-hidden="true" />
          {node.speaker === 'eira' && <small>SPOLEČNICE</small>}
          {node.speaker === 'hero' && <small>TVÁ POSTAVA</small>}
        </div>

        <div ref={speech} className={styles.speech} aria-live="polite" aria-atomic="true">
          <span className={styles.srOnly}>{speaker}: </span>
          <p>{node.text}</p>
        </div>

        <div ref={actions} className={styles.actions}>
          {!savingAvailable && <p className={styles.saveNotice}>Rozhovor se teď nemůže uložit.</p>}
          {node.choices ? (
            <div className={styles.choices} role="group" aria-label="Tvoje odpověď">
              {node.choices.map((choice) => (
                <button key={choice.id} type="button" className={styles.choice} onClick={() => advance(choice.id)}>
                  <span>{choice.label}</span>
                  <ChevronRight size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : node.end ? (
            <button type="button" className={styles.continue} onClick={onDepart}>
              Pokračovat <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className={styles.continue} onClick={() => advance()}>
              Pokračovat <ChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
