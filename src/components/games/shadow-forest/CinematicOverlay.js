'use client';

import { Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { getCinematicCaption } from './cinematic.mjs';
import styles from './CinematicOverlay.module.css';

export default function CinematicOverlay({ elapsed, kind, state, paused, onPause, onSkip, savingAvailable = true, sound = false, onToggleSound }) {
  const caption = getCinematicCaption(elapsed, kind, state);

  return (
    <div className={styles.overlay} data-paused={paused} aria-label={kind === 'firestorm' ? 'Příběhová scénka: Ohnivá vlna' : 'Příběhová scénka'}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleSound}
          aria-label={sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}
          aria-pressed={sound}
          title={sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}
        >
          {sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onPause}
          aria-label={paused ? 'Pokračovat ve scénce' : 'Pozastavit scénku'}
          aria-pressed={paused}
          title={paused ? 'Pokračovat ve scénce' : 'Pozastavit scénku'}
        >
          {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
        <button type="button" className={styles.skip} onClick={onSkip}>
          Přeskočit <SkipForward size={15} aria-hidden="true" />
        </button>
      </div>

      {paused && (
        <div className={styles.pauseShade}>
          <div className={styles.pausePanel}>
            <Pause size={22} className={styles.pauseIcon} aria-hidden="true" />
            <h2>Scénka pozastavena</h2>
            <button type="button" className={styles.resume} onClick={onPause}>
              <Play size={15} aria-hidden="true" /> Pokračovat
            </button>
          </div>
        </div>
      )}

      <div className={styles.captionArea}>
        {!savingAvailable && <p className={styles.saveNotice}>Postup se teď nemůže uložit.</p>}
        <div className={styles.liveCaption} aria-live="polite" aria-atomic="true">
          {caption && <div className={styles.caption}><span>{caption.speaker}</span><p>{caption.text}</p></div>}
        </div>
      </div>
    </div>
  );
}
