'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, SlidersHorizontal, Sword, ZoomIn, ZoomOut } from 'lucide-react';
import { APPEARANCE_OPTIONS, normalizeAppearance } from './appearance.mjs';
import { createHeroPreview } from './heroRenderer';
import styles from './CharacterCreator.module.css';

const VIEWS = [
  { id: 'front', label: 'Zepředu' },
  { id: 'side', label: 'Zboku' },
  { id: 'back', label: 'Zezadu' },
];

const TABS = [
  { id: 'appearance', label: 'Vzhled' },
  { id: 'clothing', label: 'Oblečení' },
];

function ChoiceRow({ field, label, previousLabel, nextLabel, value, onChange, disabled = false }) {
  const options = APPEARANCE_OPTIONS[field];
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === value));

  function cycle(direction) {
    const option = options[(selectedIndex + direction + options.length) % options.length];
    onChange(field, option.id);
  }

  return (
    <div className={styles.choiceRow} role="group" aria-label={label}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.cycler}>
        <button type="button" onClick={() => cycle(-1)} disabled={disabled} aria-label={previousLabel}>
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <output aria-live="polite" aria-atomic="true">{options[selectedIndex].label}</output>
        <button type="button" onClick={() => cycle(1)} disabled={disabled} aria-label={nextLabel}>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SwatchRow({ field, label, value, onChange, disabled = false }) {
  return (
    <div className={`${styles.choiceRow} ${disabled ? styles.disabledRow : ''}`} role="group" aria-label={label}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.swatches}>
        {APPEARANCE_OPTIONS[field].map((option) => (
          <button
            type="button"
            key={option.id}
            className={value === option.id ? styles.selectedSwatch : ''}
            style={{ '--swatch-color': option.color }}
            aria-label={`${label}: ${option.label}`}
            aria-pressed={value === option.id}
            title={option.label}
            onClick={() => onChange(field, option.id)}
            disabled={disabled}
          >
            <span aria-hidden="true">{value === option.id && <Check size={14} strokeWidth={3} />}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CharacterCreator({ profile, onChange, onStart, onBack, onAttributes, savingAvailable = true }) {
  const [tab, setTab] = useState('appearance');
  const [view, setView] = useState('front');
  const [detail, setDetail] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const canvas = useRef(null);
  const heading = useRef(null);
  const tabButtons = useRef({});
  const appearance = normalizeAppearance(profile.appearance);
  const previewState = useRef({ appearance, view, detail });

  useEffect(() => {
    previewState.current = { appearance, view, detail };
  }, [appearance, view, detail]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (!canvas.current) return undefined;
    let preview;
    try {
      preview = createHeroPreview(canvas.current);
    } catch {
      setPreviewError(true);
      return undefined;
    }
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;

    function render(time) {
      if (!document.hidden) {
        const current = previewState.current;
        try {
          preview.render(current.appearance, current.view, time / 1000, motionPreference.matches, current.detail);
        } catch {
          setPreviewError(true);
          return;
        }
      }
      frame = window.requestAnimationFrame(render);
    }

    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      preview.destroy();
    };
  }, []);

  function changeAppearance(field, value) {
    onChange({ ...profile, appearance: { ...appearance, [field]: value } });
  }

  function switchTab(event, currentIndex) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? TABS.length - 1
      : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    const nextTab = TABS[nextIndex].id;
    setTab(nextTab);
    tabButtons.current[nextTab]?.focus();
  }

  return (
    <section className={styles.creator} aria-labelledby="hero-creator-title">
      <header className={styles.heading}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Zpět do menu">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <p className={styles.eyebrow}>TVŮJ PŘÍBĚH ZAČÍNÁ TADY</p>
          <h2 ref={heading} tabIndex={-1} id="hero-creator-title">Vytvoř svého hrdinu</h2>
        </div>
      </header>

      <div className={styles.preview}>
        <canvas
          ref={canvas}
          width={360}
          height={300}
          aria-label={`${detail ? 'Detail tváře' : 'Náhled'} hrdiny ${VIEWS.find((option) => option.id === view).label.toLocaleLowerCase('cs')}`}
          role="img"
          hidden={previewError}
        />
        {previewError && <p className={styles.previewError} role="status">Portrét se nepodařilo zobrazit.<br />Vzhled můžeš stále upravit.</p>}
        <button
          type="button"
          className={styles.detail}
          aria-label={detail ? 'Zobrazit celou postavu' : 'Přiblížit tvář'}
          title={detail ? 'Zobrazit celou postavu' : 'Přiblížit tvář'}
          aria-pressed={detail}
          disabled={previewError}
          onClick={() => setDetail((current) => !current)}
        >
          {detail ? <ZoomOut size={18} aria-hidden="true" /> : <ZoomIn size={18} aria-hidden="true" />}
        </button>
        <div className={styles.views} role="group" aria-label="Otočení postavy">
          {VIEWS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={view === option.id}
              disabled={previewError}
              onClick={() => setView(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.customization}>
        <div className={styles.tabs} role="tablist" aria-label="Úpravy postavy">
          {TABS.map((option, index) => (
            <button
              key={option.id}
              ref={(element) => { tabButtons.current[option.id] = element; }}
              id={`hero-tab-${option.id}`}
              type="button"
              role="tab"
              aria-selected={tab === option.id}
              aria-controls={`hero-panel-${option.id}`}
              tabIndex={tab === option.id ? 0 : -1}
              onClick={() => setTab(option.id)}
              onKeyDown={(event) => switchTab(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className={styles.editor}>
          <div className={styles.nameField}>
            <label htmlFor="hero-name">Jméno hrdiny</label>
            <input
              id="hero-name"
              name="heroName"
              type="text"
              autoComplete="off"
              spellCheck={false}
              maxLength={24}
              value={profile.name ?? ''}
              placeholder="Jak ti budou říkat?"
              onChange={(event) => onChange({ ...profile, name: event.target.value })}
            />
          </div>

          <div id={`hero-panel-${tab}`} role="tabpanel" aria-labelledby={`hero-tab-${tab}`}>
            {tab === 'appearance' ? (
              <>
                <SwatchRow field="skin" label="Barva pleti" value={appearance.skin} onChange={changeAppearance} />
                <ChoiceRow field="face" label="Tvář" previousLabel="Předchozí tvář" nextLabel="Další tvář" value={appearance.face} onChange={changeAppearance} />
                <ChoiceRow field="hairStyle" label="Účes" previousLabel="Předchozí účes" nextLabel="Další účes" value={appearance.hairStyle} onChange={changeAppearance} />
                <SwatchRow field="hairColor" label="Barva vlasů" value={appearance.hairColor} onChange={changeAppearance} />
              </>
            ) : (
              <>
                <ChoiceRow field="outfit" label="Oděv" previousLabel="Předchozí oděv" nextLabel="Další oděv" value={appearance.outfit} onChange={changeAppearance} />
                <SwatchRow field="outfitColor" label="Barva oděvu" value={appearance.outfitColor} onChange={changeAppearance} />
                <ChoiceRow field="cloak" label="Plášť" previousLabel="Předchozí plášť" nextLabel="Další plášť" value={appearance.cloak} onChange={changeAppearance} />
                <SwatchRow field="cloakColor" label="Barva pláště" value={appearance.cloakColor} onChange={changeAppearance} disabled={appearance.cloak === 'none'} />
              </>
            )}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInfo}>
          <p>Oblečení mění vzhled.<br />Boj určují atributy.</p>
          <button type="button" className={styles.attributes} onClick={onAttributes}>
            <SlidersHorizontal size={14} aria-hidden="true" /> Atributy
          </button>
        </div>
        {!savingAvailable && <p className={styles.saveNotice} role="status">Prohlížeč nepovolil ukládání. Hrdina zůstane jen do zavření hry.</p>}
        <button type="button" className={styles.start} onClick={onStart}>
          <Sword size={17} aria-hidden="true" /> ZAČÍT PŘÍBĚH <ChevronRight size={17} aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}
