'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, ChevronRight, Footprints, MessageCircle, Moon, Play, Search, Sunrise, TreePine } from 'lucide-react';
import { EXPLORATION_SLEEP_DURATION, getExplorationDialogue } from './exploration.mjs';
import { getExplorationCampProximity, getExplorationHotspots } from './explorationRenderer.js';
import styles from './ExplorationOverlay.module.css';

const LOCATIONS = {
  clearing: 'Spálená mýtina', oak: 'Ohořelý strážce', creature: 'Popelavý běs', tracks: 'Stopy v popelu', camp: 'Tábořiště v lese',
};
const JOURNEYS = {
  clearing: 'Jdeš na mýtinu', oak: 'Jdeš ke starému dubu', creature: 'Jdeš k příšeře', tracks: 'Jdeš po stopách', camp: 'Vracíš se k táboráku',
};

function objectOffset(value, available) {
  if (value === 'left' || value === 'top') return 0;
  if (value === 'right' || value === 'bottom') return available;
  if (value?.endsWith('%')) return available * parseFloat(value) / 100;
  if (value?.endsWith('px')) return parseFloat(value);
  return available / 2;
}

// Canvas CSS can crop or letterbox the native 360 × 600 world independently of
// the arena. Pins follow its painted content, including the wider mobile canvas.
function measureCanvas(overlay) {
  const canvas = overlay?.parentElement?.closest('[data-scene]')?.querySelector('canvas');
  if (!canvas) return null;
  const bounds = canvas.getBoundingClientRect(), owner = overlay.getBoundingClientRect(), css = getComputedStyle(canvas);
  const left = parseFloat(css.borderLeftWidth) + parseFloat(css.paddingLeft);
  const top = parseFloat(css.borderTopWidth) + parseFloat(css.paddingTop);
  const width = bounds.width - left - parseFloat(css.borderRightWidth) - parseFloat(css.paddingRight);
  const height = bounds.height - top - parseFloat(css.borderBottomWidth) - parseFloat(css.paddingBottom);
  if (width <= 0 || height <= 0 || owner.width <= 0 || owner.height <= 0) return null;
  let scaleX = width / canvas.width, scaleY = height / canvas.height;
  if (css.objectFit === 'contain') scaleX = scaleY = Math.min(scaleX, scaleY);
  else if (css.objectFit === 'cover') scaleX = scaleY = Math.max(scaleX, scaleY);
  else if (css.objectFit === 'none') scaleX = scaleY = 1;
  else if (css.objectFit === 'scale-down') scaleX = scaleY = Math.min(1, scaleX, scaleY);
  const [positionX = '50%', positionY = '50%'] = css.objectPosition.split(/\s+/);
  return {
    x: bounds.left - owner.left + left + objectOffset(positionX, width - canvas.width * scaleX),
    y: bounds.top - owner.top + top + objectOffset(positionY, height - canvas.height * scaleY),
    scaleX, scaleY, width: owner.width, height: owner.height,
  };
}

export default function ExplorationOverlay({ state, active = true, onTravel, onInspect, onAdvance, onPause, onSleep, onJournal }) {
  const overlay = useRef(null), speech = useRef(null);
  const [frame, setFrame] = useState(null);
  const exploration = state.exploration;
  const node = getExplorationDialogue(state);
  const idle = exploration.mode === 'idle' && !exploration.paused;
  const interactive = active && idle;
  const moving = exploration.mode === 'travel';
  const forestJourney = moving && [exploration.travel.from, exploration.travel.to].includes('camp');
  const nearCamp = getExplorationCampProximity(state) > 0;
  const journeyText = forestJourney
    ? nearCamp ? (exploration.travel.to === 'camp' ? 'Mezi stromy prosvítá táborák' : 'Opouštíte tábořiště') : 'Jdete lesní pěšinou'
    : moving ? JOURNEYS[exploration.travel.to] : '';
  const sleeping = exploration.mode === 'sleep';
  const dawn = exploration.mode === 'dawn';
  const hotspots = idle ? getExplorationHotspots(state) : [];
  const compactTargets = frame && frame.width > frame.height && frame.width < 1100;
  const speaker = node?.speaker === 'hero' ? state.heroName || 'Poutník' : 'Eira';
  const progress = moving ? exploration.travel.elapsed / exploration.travel.duration
    : sleeping ? exploration.sleepElapsed / EXPLORATION_SLEEP_DURATION : 0;

  useLayoutEffect(() => {
    const update = () => {
      const next = measureCanvas(overlay.current);
      setFrame(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(overlay.current);
    const canvas = overlay.current.parentElement?.closest('[data-scene]')?.querySelector('canvas');
    if (canvas) observer.observe(canvas);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      observer.disconnect(); window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => { if (speech.current) speech.current.scrollTop = 0; }, [node?.id]);

  useEffect(() => {
    if (!active || exploration.paused || !node) return;
    const advanceOnKey = event => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey
        || !['Enter', 'Space'].includes(event.code) || event.target.isContentEditable
        || event.target.closest('button, a, input, select, textarea')) return;
      event.preventDefault(); onAdvance();
    };
    window.addEventListener('keydown', advanceOnKey);
    return () => window.removeEventListener('keydown', advanceOnKey);
  }, [active, exploration.paused, node, onAdvance]);

  return (
    <section ref={overlay} className={styles.scene} data-exploration-location={exploration.location}
      data-exploration-mode={exploration.mode} data-exploration-inspection={node?.id || ''}
      data-exploration-paused={exploration.paused} aria-label="Průzkum nočního lesa">
      <header className={styles.heading}>
        <p>{dawn ? <Sunrise size={12} /> : <Moon size={11} />}{dawn ? 'PRVNÍ SVĚTLO' : 'STARÝ HVOZD · PO OHNIVÉ VLNĚ'}</p>
        <h2 data-screen-title tabIndex={-1}>{dawn ? 'Noc je za vámi' : forestJourney ? (nearCamp ? 'Tábořiště v lese' : 'Lesní pěšina') : LOCATIONS[exploration.location]}</h2>
      </header>

      {idle && frame && <div className={compactTargets ? styles.targetList : styles.worldTargets} aria-label="Místa k prozkoumání" data-hotspot-layout={compactTargets ? 'list' : 'world'}>
        {hotspots.map(hotspot => <button key={hotspot.id} type="button" className={styles.hotspot}
          data-hotspot-id={hotspot.id} data-hotspot-kind={hotspot.kind} data-hotspot-target={hotspot.target}
          style={compactTargets ? undefined : { left: frame.x + hotspot.x * frame.scaleX, top: frame.y + hotspot.y * frame.scaleY }}
          disabled={!interactive} onClick={() => { if (!interactive) return; if (hotspot.kind === 'inspect') onInspect(); else onTravel(hotspot.target); }}>
          {hotspot.kind === 'inspect' ? <Search size={15} aria-hidden="true" /> : <Footprints size={15} aria-hidden="true" />}
          <span>{hotspot.label}</span>
        </button>)}
      </div>}

      {idle && exploration.location !== 'camp' && !hotspots.some(hotspot => hotspot.kind === 'travel' && hotspot.target === 'camp')
        && <button type="button" className={styles.campRoute} disabled={!interactive} onClick={() => { if (interactive) onTravel('camp'); }}><TreePine size={14} aria-hidden="true" /> Lesem k táboráku</button>}

      {idle && exploration.location === 'camp' && <div className={styles.campActions}>
        <button type="button" disabled={!interactive} onClick={() => { if (interactive) onInspect(); }}><MessageCircle size={15} aria-hidden="true" /> Promluvit s Eirou</button>
        <button type="button" className={styles.sleepButton} disabled={!interactive} onClick={() => { if (interactive) onSleep(); }}><Moon size={15} aria-hidden="true" /> Jít spát</button>
      </div>}

      {node && <div className={styles.dialogue}>
        <div className={styles.speaker}><MessageCircle size={14} aria-hidden="true" /><span>{speaker}</span><small>{node.speaker === 'hero' ? 'TVÁ POSTAVA' : 'SPOLEČNICE'}</small></div>
        <div ref={speech} className={styles.speech} tabIndex={0} aria-live="polite" aria-atomic="true"><span className={styles.srOnly}>{speaker}: </span><p>{node.text}</p></div>
        <button type="button" className={styles.advance} disabled={!active || exploration.paused} onClick={() => { if (active && !exploration.paused) onAdvance(); }}>{node.actionLabel}<ChevronRight size={16} aria-hidden="true" /></button>
      </div>}

      {(moving || sleeping) && <div className={styles.journey}>
        <p>{sleeping ? <Moon size={15} aria-hidden="true" /> : <Footprints size={15} aria-hidden="true" />}{sleeping ? 'Oči se ti pomalu zavírají…' : journeyText}</p>
        <div className={styles.progress} role="progressbar" aria-label={sleeping ? 'Noc pomalu končí' : 'Cesta k cíli'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }} /></div>
      </div>}

      {exploration.paused && !dawn && <div className={styles.pauseShade}>
        <div className={styles.pausePanel}>
          <Moon size={20} aria-hidden="true" /><h3>Les počká.</h3><p>{sleeping ? 'Noc je pozastavená.' : moving ? 'Cesta je pozastavená.' : 'Chvíle klidu.'}</p>
          <button type="button" disabled={!active} onClick={onPause}><Play size={15} aria-hidden="true" /> Pokračovat</button>
        </div>
      </div>}

      {dawn && <div className={styles.dawn}>
        <Sunrise size={24} aria-hidden="true" /><p className={styles.dawnLead}>Mezi stromy se prodírá první světlo.</p>
        <p>Popel už dávno vychladl. {state.eira?.health === 0 ? 'Zraněná Eira odpočívá u ohně. Je v bezpečí.' : 'Eira odpočívá vedle dohasínajícího ohně.'} Před vámi leží cesta do města. A otázky, které si nesete s sebou.</p>
        <button type="button" disabled={!active} onClick={onJournal}><BookOpen size={15} aria-hidden="true" /> Prohlédnout deník</button>
      </div>}
    </section>
  );
}
