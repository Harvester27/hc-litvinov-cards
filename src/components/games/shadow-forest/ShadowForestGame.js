'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Heart, Maximize2, Minimize2, Moon, Pause, Play, RotateCcw, Shield, Skull, Sparkles, Sword, Swords, UserRound, Volume2, VolumeX, Wind, X, Zap, Backpack } from 'lucide-react';
import { startGame, stepGame, chooseAction, togglePause, getTurnOrder, getActionInfo, deriveHero } from './combat.mjs';
import { getPositionInfo } from './spatial.mjs';
import { SAVE_KEY, normalizeProfile, createCampaign, encodeCampaign, decodeCampaign, startStory, advanceStory } from './campaign.mjs';
import { getStoryNode } from './story.mjs';
import { getCinematicDuration, startCinematic, stepCinematic } from './cinematic.mjs';
import { startFirestorm, finishFirestorm } from './firestorm.mjs';
import { advanceSanctuaryDialogue, restartSanctuaryDialogue } from './sanctuaryStory.mjs';
import { enterExploration, travelTo, stepExploration, inspectLocation, advanceInspection, sleepAtCamp, toggleExplorationPause } from './exploration.mjs';
import { createRenderer } from './renderer';
import { createCampRenderer } from './campRenderer';
import { createCinematicRenderer } from './cinematicRenderer';
import { createFirestormRenderer } from './firestormRenderer';
import { createExplorationRenderer, getExplorationCampProximity } from './explorationRenderer';
import { createAudio } from './audio';
import { MOBILE_GAME_MEDIA, enterFullscreen, leaveFullscreen, getFullscreenElement } from './fullscreen.mjs';
import CharacterSheet from './CharacterSheet';
import CharacterCreator from './CharacterCreator';
import GameMenu from './GameMenu';
import CampDialogue from './CampDialogue';
import CinematicOverlay from './CinematicOverlay';
import SanctuaryOverlay from './SanctuaryOverlay';
import ExplorationOverlay from './ExplorationOverlay';
import styles from './ShadowForestGame.module.css';

const actionIcons = { attack: Sword, power: Swords, rest: Wind };
const actionKeys = { attack: '1 / MEZERNÍK', power: '2', rest: '3 / R' };
const actionNames = { attack: 'Útok mečem', power: 'Těžký úder', rest: 'Oddech' };
const actionOrder = ['attack', 'power', 'rest'];
const actorNames = { player: 'Ty', eira: 'Eira', enemy: 'Strážce' };
const actorIcons = { player: Sword, eira: UserRound, enemy: Skull };

function snapshot(state) {
  return {
    ...state,
    arena: state.arena ? { ...state.arena, player: { ...state.arena.player }, enemy: { ...state.arena.enemy }, eira: state.arena.eira ? { ...state.arena.eira } : undefined } : undefined,
    eira: state.eira ? { ...state.eira, stats: state.eira.stats ? { ...state.eira.stats } : undefined } : null,
    reaction: state.reaction ? { ...state.reaction } : null,
    motion: state.motion ? { ...state.motion, from: { ...state.motion.from }, to: { ...state.motion.to } } : null,
    story: state.story ? { ...state.story } : null, cinematic: state.cinematic ? { ...state.cinematic } : null,
    exploration: state.exploration ? { ...state.exploration, travel: state.exploration.travel ? { ...state.exploration.travel } : null, findings: { ...state.exploration.findings }, inventory: [...state.exploration.inventory] } : null,
    attributes: { ...state.attributes }, hero: { ...state.hero }, stats: { ...state.stats }, log: [...state.log], events: [],
  };
}

function trapFocus(event) {
  if (event.key !== 'Tab') return;
  const elements = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')];
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (!first) { event.preventDefault(); return; }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
    event.preventDefault(); first.focus();
  }
}

export default function ShadowForestGame() {
  const game = useRef(null);
  if (!game.current) game.current = createCampaign();
  const [view, setView] = useState(() => snapshot(game.current));
  const [scene, setScene] = useState('menu');
  const [profile, setProfile] = useState(() => normalizeProfile());
  const profileRef = useRef(profile);
  const [draft, setDraft] = useState(() => normalizeProfile());
  const [hasRun, setHasRun] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savingAvailable, setSavingAvailable] = useState(true);
  const lastSaved = useRef(null);
  const lastSaveAttempt = useRef(null);
  const [sound, setSound] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState(null);
  const [previewAction, setPreviewAction] = useState('attack');
  const [feedback, setFeedback] = useState(null);
  const [renderError, setRenderError] = useState(false);
  const canvas = useRef(null);
  const arena = useRef(null);
  const gameColumn = useRef(null);
  const audio = useRef(null);
  const feedbackUntil = useRef(0);
  const dialog = useRef(null);
  const returnFocus = useRef(null);
  const resumeAfterPanel = useRef(false);

  const startMobileFullscreen = () => {
    if (window.matchMedia(MOBILE_GAME_MEDIA).matches && !getFullscreenElement(document)) {
      void enterFullscreen(gameColumn.current);
    }
  };
  const toggleFullscreen = () => {
    if (getFullscreenElement(document) === gameColumn.current) {
      void leaveFullscreen(document);
    } else if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      void enterFullscreen(gameColumn.current);
    }
  };

  const publish = useCallback(() => setView(snapshot(game.current)), []);
  const persist = useCallback((state, retry = false) => {
    const serialized = encodeCampaign(state, profileRef.current);
    if (!serialized || serialized === lastSaved.current || (!retry && serialized === lastSaveAttempt.current)) return;
    lastSaveAttempt.current = serialized;
    try { window.localStorage.setItem(SAVE_KEY, serialized); lastSaved.current = serialized; setSavingAvailable(true); }
    catch { setSavingAvailable(false); }
  }, []);
  const action = useCallback((kind) => {
    if (game.current.scene !== 'battle') return;
    audio.current?.unlock();
    if (!chooseAction(game.current, kind) && game.current.turn === 'player') {
      const { reason } = getActionInfo(game.current, kind);
      if (reason) { setFeedback({ text: reason, type: 'notice' }); feedbackUntil.current = performance.now() + 1900; }
    }
    publish();
  }, [publish]);
  const pause = useCallback(() => {
    if (game.current.status === 'paused') audio.current?.unlock();
    togglePause(game.current);
    if (game.current.status === 'paused') audio.current?.stopEffects();
    publish();
  }, [publish]);
  const pauseCinematic = useCallback(() => {
    const state = game.current;
    if (state.scene !== 'cinematic' || !state.cinematic) return;
    state.cinematic.paused = !state.cinematic.paused;
    if (state.cinematic.paused) audio.current?.stopEffects();
    else audio.current?.unlock();
    persist(state, true); publish();
  }, [persist, publish]);
  const closePanel = useCallback(() => {
    setPanel(null);
    if (resumeAfterPanel.current) audio.current?.unlock();
    if (resumeAfterPanel.current === 'battle' && game.current.status === 'paused') { togglePause(game.current); publish(); }
    if (resumeAfterPanel.current === 'cinematic' && game.current.scene === 'cinematic') { game.current.cinematic.paused = false; publish(); }
    if (resumeAfterPanel.current === 'exploration' && game.current.scene === 'exploration') { game.current.exploration.paused = false; publish(); }
    resumeAfterPanel.current = false;
  }, [publish]);
  const pauseExploration = useCallback(() => {
    if (!toggleExplorationPause(game.current)) return;
    if (game.current.exploration.paused) audio.current?.stopEffects();
    else audio.current?.unlock();
    persist(game.current, true); publish();
  }, [persist, publish]);
  const openPanel = (kind) => {
    if (!panel) {
      returnFocus.current = document.activeElement;
      resumeAfterPanel.current = game.current.scene === 'battle' && game.current.status === 'playing' ? 'battle'
        : game.current.scene === 'cinematic' && !game.current.cinematic.paused ? 'cinematic'
        : game.current.scene === 'exploration' && !game.current.exploration.paused && game.current.exploration.mode !== 'dawn' ? 'exploration' : false;
      if (resumeAfterPanel.current === 'battle') pause();
      if (resumeAfterPanel.current === 'cinematic') pauseCinematic();
      if (resumeAfterPanel.current === 'exploration') { game.current.exploration.paused = true; audio.current?.stopEffects(); persist(game.current, true); publish(); }
    }
    setPanel(kind);
  };
  const launch = (selectedProfile, entry = 'camp') => {
    startMobileFullscreen();
    const selected = normalizeProfile(selectedProfile);
    profileRef.current = selected;
    setProfile(selected);
    game.current = createCampaign(selected);
    if (entry === 'camp') startStory(game.current);
    else { startGame(game.current); game.current.scene = 'battle'; game.current.resumeScene = 'battle'; }
    setScene(entry);
    setHasRun(true);
    lastSaved.current = null;
    persist(game.current, true);
    setFeedback(null);
    feedbackUntil.current = 0;
    setPanel(null);
    setPreviewAction('attack');
    audio.current?.unlock();
    publish();
    arena.current?.focus({ preventScroll: true });
  };
  const begin = () => launch(profileRef.current, 'battle');
  const advanceDialogue = useCallback((choiceId) => {
    if (!advanceStory(game.current, choiceId)) return;
    persist(game.current, true);
    publish();
  }, [persist, publish]);
  const departCamp = useCallback(() => {
    const state = game.current;
    if (state.scene !== 'camp' || !getStoryNode(state.story?.nodeId).end) return;
    startCinematic(state);
    setScene('cinematic'); setFeedback(null); feedbackUntil.current = 0;
    audio.current?.unlock();
    persist(state, true); publish();
    arena.current?.focus({ preventScroll: true });
  }, [persist, publish]);
  const finishCinematic = useCallback(() => {
    const state = game.current;
    if (state.scene !== 'cinematic') return;
    audio.current?.stopEffects();
    if (state.cinematic?.kind === 'firestorm') {
      if (!finishFirestorm(state)) return;
      setScene('sanctuary'); setFeedback(null); feedbackUntil.current = 0;
      persist(state, true); publish();
      arena.current?.focus({ preventScroll: true });
      return;
    }
    startGame(state);
    state.scene = 'battle'; state.resumeScene = 'battle'; state.story = null; state.cinematic = null;
    setScene('battle'); setFeedback(null); setPreviewAction('attack');
    persist(state, true); publish();
    arena.current?.focus({ preventScroll: true });
  }, [persist, publish]);
  const replayFirestorm = useCallback(() => {
    if (!startFirestorm(game.current, { replay: true })) return;
    audio.current?.stopEffects(); audio.current?.unlock();
    setScene('cinematic'); setPanel(null); setFeedback(null); feedbackUntil.current = 0;
    persist(game.current, true); publish();
    arena.current?.focus({ preventScroll: true });
  }, [persist, publish]);
  const advanceOakDialogue = useCallback(() => {
    if (!advanceSanctuaryDialogue(game.current)) return;
    persist(game.current, true); publish();
  }, [persist, publish]);
  const restartOakDialogue = useCallback(() => {
    if (!restartSanctuaryDialogue(game.current)) return;
    persist(game.current, true); publish();
  }, [persist, publish]);
  const beginExploration = useCallback((sleep = false) => {
    if (!enterExploration(game.current, { sleep })) return;
    setScene('exploration'); setPanel(null); setFeedback(null); feedbackUntil.current = 0;
    audio.current?.unlock(); persist(game.current, true); publish();
    arena.current?.focus({ preventScroll: true });
  }, [persist, publish]);
  const exploreAction = useCallback((change, ...args) => {
    if (!change(game.current, ...args)) return;
    audio.current?.unlock(); persist(game.current, true); publish();
  }, [persist, publish]);
  const exploreTravel = useCallback(target => exploreAction(travelTo, target), [exploreAction]);
  const exploreInspect = useCallback(() => exploreAction(inspectLocation), [exploreAction]);
  const exploreAdvance = useCallback(() => exploreAction(advanceInspection), [exploreAction]);
  const exploreSleep = useCallback(() => exploreAction(sleepAtCamp), [exploreAction]);
  const toMenu = useCallback(() => {
    audio.current?.stopEffects();
    if (game.current.status === 'playing') togglePause(game.current);
    if (game.current.scene === 'cinematic') game.current.cinematic.paused = true;
    if (game.current.scene === 'exploration' && game.current.exploration.mode !== 'dawn') game.current.exploration.paused = true;
    persist(game.current, true);
    game.current.scene = 'menu';
    setScene('menu'); setPanel(null); setFeedback(null); publish();
    arena.current?.focus({ preventScroll: true });
  }, [persist, publish]);
  const newGame = () => {
    audio.current?.stopEffects();
    if (game.current.status === 'playing') togglePause(game.current);
    setDraft(normalizeProfile(profileRef.current));
    game.current.scene = 'creator'; setScene('creator'); setPanel(null); publish();
  };
  const continueGame = () => {
    if (!hasRun) return;
    startMobileFullscreen();
    audio.current?.unlock();
    const destination = ['camp', 'cinematic', 'sanctuary', 'exploration'].includes(game.current.resumeScene) ? game.current.resumeScene : 'battle';
    if (destination === 'cinematic' && game.current.cinematic.elapsed >= getCinematicDuration(game.current.cinematic)) {
      game.current.scene = 'cinematic'; finishCinematic(); return;
    }
    if (destination === 'battle' && game.current.status === 'won' && startFirestorm(game.current)) {
      setScene('cinematic'); setPanel(null); persist(game.current, true); publish();
      arena.current?.focus({ preventScroll: true });
      return;
    }
    if (destination === 'battle' && game.current.status === 'paused') togglePause(game.current);
    if (destination === 'cinematic') game.current.cinematic.paused = false;
    if (destination === 'exploration') game.current.exploration.paused = false;
    game.current.scene = destination; setScene(destination); setPanel(null); publish();
    arena.current?.focus({ preventScroll: true });
  };
  const changeAttributes = (attributes) => {
    if (scene === 'creator') setDraft((current) => ({ ...current, attributes }));
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SAVE_KEY);
      const restored = decodeCampaign(saved);
      if (restored) {
        game.current = restored.state;
        if (game.current.status === 'playing') game.current.status = 'paused';
        profileRef.current = restored.profile;
        setProfile(restored.profile); setDraft(restored.profile); setHasRun(true);
        lastSaved.current = saved; publish();
      }
    } catch { setSavingAvailable(false); }
    setLoaded(true);
  }, [publish]);

  useEffect(() => {
    audio.current = createAudio();
    let renderer;
    let campRenderer;
    let cinematicRenderer;
    let firestormRenderer;
    let explorationRenderer;
    try { renderer = createRenderer(canvas.current); campRenderer = createCampRenderer(canvas.current); cinematicRenderer = createCinematicRenderer(canvas.current); firestormRenderer = createFirestormRenderer(canvas.current); explorationRenderer = createExplorationRenderer(canvas.current); }
    catch { renderer?.destroy(); campRenderer?.destroy(); cinematicRenderer?.destroy(); firestormRenderer?.destroy(); explorationRenderer?.destroy(); setRenderError(true); return () => audio.current?.destroy(); }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    let last = 0;
    let lastPublish = 0;
    let visualTime = 0;
    let lastCinematicSave = 0;
    let lastExplorationSave = 0;
    let lastRenderedScene = null;
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.25) : 0;
      last = now;
      const state = game.current;
      const cinematicFinished = state.scene === 'cinematic' && !document.hidden && stepCinematic(state, dt);
      const explorationChanged = state.scene === 'exploration' && !document.hidden && stepExploration(state, dt);
      if (state.scene === 'battle' && state.status === 'playing') stepGame(state, dt);
      const frozen = (state.scene === 'battle' && state.status === 'paused') || (state.scene === 'cinematic' && state.cinematic.paused) || (state.scene === 'exploration' && state.exploration.paused);
      if (!frozen && !document.hidden) visualTime += dt;
      if (state.scene === 'battle' && state.status === 'won') {
        // Preserve the final contact frame before changing to the directed film.
        renderer.render({ ...state, status: 'playing' }, visualTime, reducedMotion.matches);
        firestormRenderer.captureBattleFrame(canvas.current);
        if (startFirestorm(state, { visualTime })) {
          audio.current?.stopEffects(); audio.current?.setAmbience(null);
          setScene('cinematic'); setFeedback(null); feedbackUntil.current = 0;
          persist(state, true); publish();
        }
      }
      if (state.scene === 'camp') campRenderer.render(state, visualTime, reducedMotion.matches);
      else if (state.scene === 'sanctuary') firestormRenderer.render(state, visualTime, reducedMotion.matches);
      else if (state.scene === 'exploration') {
        explorationRenderer.render(state, visualTime, reducedMotion.matches);
        const exp = state.exploration;
        const campDistance = getExplorationCampProximity(state)
          * (exp.mode === 'sleep' ? Math.max(0, 1 - exp.sleepElapsed / 2) : 1);
        audio.current?.setCampPerspective(0, campDistance);
        if (explorationChanged || now - lastExplorationSave >= 500) { persist(state); lastExplorationSave = now; }
        if (explorationChanged) publish();
      }
      else if (state.scene === 'cinematic') {
        if (state.cinematic.kind === 'firestorm') firestormRenderer.render(state, visualTime, reducedMotion.matches);
        else {
          cinematicRenderer.render(state, visualTime, reducedMotion.matches);
          const pan = Math.max(0, Math.min(1, (state.cinematic.elapsed - 8) / 4));
          const distance = 1 - Math.max(0, Math.min(.97, (state.cinematic.elapsed - 8) / 10));
          audio.current?.setCampPerspective(-pan * .85, distance);
        }
        if (now - lastCinematicSave >= 500) { persist(state); lastCinematicSave = now; }
      } else {
        if (state.scene === 'battle' && lastRenderedScene === 'cinematic') renderer.syncClock(visualTime);
        renderer.render(state, visualTime, reducedMotion.matches);
      }
      lastRenderedScene = state.scene;
      if (state.scene === 'battle') persist(state);
      const audibleScene = !document.hidden && document.hasFocus()
        && ((state.scene === 'cinematic' && !state.cinematic.paused)
          || (state.scene === 'battle' && ['playing', 'won', 'lost'].includes(state.status))
          || (state.scene === 'exploration' && !state.exploration.paused && state.exploration.mode !== 'dawn'));
      for (const event of state.events.splice(0)) {
        if (audibleScene) audio.current?.play(event.type, event.audio);
        if (event.text) { setFeedback({ text: event.text, type: event.type }); feedbackUntil.current = now + 1900; }
      }
      if (feedbackUntil.current && now > feedbackUntil.current) { setFeedback(null); feedbackUntil.current = 0; }
      if (cinematicFinished) finishCinematic();
      if (now - lastPublish > 65) { publish(); lastPublish = now; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const suspend = () => {
      audio.current?.stopEffects();
      if (game.current.status === 'playing') { togglePause(game.current); publish(); }
      if (game.current.scene === 'cinematic') { game.current.cinematic.paused = true; persist(game.current, true); publish(); }
      if (game.current.scene === 'exploration') { if (game.current.exploration.mode !== 'dawn') game.current.exploration.paused = true; persist(game.current, true); publish(); }
      last = 0;
    };
    const visibility = () => { if (document.hidden) suspend(); };
    window.addEventListener('blur', suspend);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame); renderer.destroy(); campRenderer.destroy(); cinematicRenderer.destroy(); firestormRenderer.destroy(); explorationRenderer.destroy(); audio.current?.destroy();
      window.removeEventListener('blur', suspend); document.removeEventListener('visibilitychange', visibility);
    };
  }, [publish, persist, finishCinematic]);

  useEffect(() => {
    const keydown = (event) => {
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))) return;
      if (event.code === 'Escape') {
        event.preventDefault();
        if (event.repeat) return;
        if (panel) closePanel();
        else if (scene === 'cinematic') pauseCinematic();
        else if (scene === 'exploration') { if (['travel', 'sleep'].includes(game.current.exploration.mode)) pauseExploration(); else toMenu(); }
        else if (scene === 'battle' && ['playing', 'paused'].includes(game.current.status)) pause();
        else if (scene === 'creator' || scene === 'camp' || scene === 'sanctuary') toMenu();
        return;
      }
      if (scene === 'cinematic' && !panel && !event.repeat && !event.altKey && !event.ctrlKey && !event.metaKey) {
        if (event.code === 'Space' && !event.target.closest('button, a')) { event.preventDefault(); pauseCinematic(); }
        return;
      }
      if (scene === 'camp' && !panel && !event.repeat && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const node = getStoryNode(game.current.story?.nodeId);
        const choice = node.choices?.[event.code === 'Digit1' ? 0 : event.code === 'Digit2' ? 1 : -1];
        if (choice) { event.preventDefault(); advanceDialogue(choice.id); }
        else if (!node.choices && ['Enter', 'Space'].includes(event.code) && !event.target.closest('button, a')) {
          event.preventDefault();
          if (node.end) departCamp(); else advanceDialogue();
        }
        return;
      }
      if (scene !== 'battle' || panel || game.current.status !== 'playing' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const kind = { Digit1: 'attack', Digit2: 'power', Digit3: 'rest', KeyR: 'rest' }[event.code];
      if (kind) { event.preventDefault(); action(kind); }
      else if (event.code === 'Space' && !event.target.closest('button, a')) { event.preventDefault(); action('attack'); }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [action, panel, closePanel, pause, scene, toMenu, advanceDialogue, departCamp, pauseCinematic, pauseExploration]);

  useEffect(() => { audio.current?.setEnabled(sound); }, [sound]);
  const firestormActive = view.cinematic?.kind === 'firestorm';
  const firestormBurning = firestormActive && view.cinematic.elapsed >= 9 && view.cinematic.elapsed < 25;
  const explorationCampAudible = scene === 'exploration' && !view.exploration.paused && view.exploration.mode !== 'dawn'
    && getExplorationCampProximity(view) > 0
    && (view.exploration.mode !== 'sleep' || view.exploration.sleepElapsed < 2);
  useEffect(() => {
    const sync = () => {
      if (scene === 'camp') audio.current?.setCampPerspective(0, 1);
      const ambience = scene === 'exploration' ? (explorationCampAudible ? 'camp' : null)
        : scene === 'cinematic' && firestormActive ? (!view.cinematic?.paused && firestormBurning ? 'firestorm' : null)
        : scene === 'camp' || (scene === 'cinematic' && !view.cinematic?.paused) ? 'camp'
        : scene === 'battle' && view.status === 'playing' ? 'battle' : null;
      audio.current?.setAmbience(!panel && !document.hidden && document.hasFocus() ? ambience : null);
    };
    const silence = () => audio.current?.setAmbience(null);
    sync();
    window.addEventListener('blur', silence);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      silence();
      window.removeEventListener('blur', silence);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [scene, panel, view.cinematic?.paused, view.status, firestormActive, firestormBurning, explorationCampAudible]);
  useEffect(() => {
    const element = gameColumn.current;
    let wasFullscreen = false;
    const sync = () => {
      const active = getFullscreenElement(document) === element;
      if (active || wasFullscreen) setExpanded(active);
      wasFullscreen = active;
    };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
      if (getFullscreenElement(document) === element) void leaveFullscreen(document);
    };
  }, []);
  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_GAME_MEDIA);
    const body = document.body;
    const html = document.documentElement;
    const original = { overflow: body.style.overflow, overscroll: html.style.overscrollBehavior };
    const sync = () => {
      const immersive = expanded || mobile.matches;
      body.style.overflow = immersive ? 'hidden' : original.overflow;
      html.style.overscrollBehavior = immersive ? 'none' : original.overscroll;
    };
    sync();
    mobile.addEventListener('change', sync);
    return () => {
      mobile.removeEventListener('change', sync);
      body.style.overflow = original.overflow;
      html.style.overscrollBehavior = original.overscroll;
    };
  }, [expanded]);
  useEffect(() => {
    const element = gameColumn.current;
    const viewport = window.visualViewport;
    const syncHeight = () => {
      // The visual viewport also follows the on-screen keyboard on Safari.
      const height = viewport && Math.abs(viewport.scale - 1) < .01 ? viewport.height : window.innerHeight;
      element.style.setProperty('--game-viewport-height', `${Math.round(height)}px`);
    };
    syncHeight();
    viewport?.addEventListener('resize', syncHeight);
    window.addEventListener('resize', syncHeight);
    document.addEventListener('fullscreenchange', syncHeight);
    return () => {
      viewport?.removeEventListener('resize', syncHeight);
      window.removeEventListener('resize', syncHeight);
      document.removeEventListener('fullscreenchange', syncHeight);
      element.style.removeProperty('--game-viewport-height');
    };
  }, []);
  useEffect(() => {
    if (panel) dialog.current?.focus({ preventScroll: true });
    else if (returnFocus.current) {
      if (returnFocus.current.isConnected) returnFocus.current.focus?.({ preventScroll: true });
      else arena.current?.focus({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [panel]);

  const pointerAction = (event, callback) => { callback(); if (event.detail > 0) arena.current?.focus({ preventScroll: true }); };
  const playing = scene === 'battle' && view.status === 'playing';
  const ended = scene === 'battle' && view.status === 'lost';
  const playerTurn = playing && view.turn === 'player';
  const order = getTurnOrder(view, previewAction, 5);
  const displayedProfile = scene === 'creator' ? draft : profile;
  const hero = scene === 'creator' ? deriveHero(draft.attributes) : view.hero;
  const position = getPositionInfo(view);
  const playerMovementText = view.motion?.kind === 'approach' ? 'Přibližuješ se k úderu…' : 'Vracíš se do postoje…';
  const enemyTargetLabel = view.enemyTarget === 'eira' ? 'Eira' : 'ty';
  const eiraDown = view.eira?.health === 0;
  const statusText = playerTurn ? 'Jsi na tahu. Vyber bojovou akci.'
    : view.turn === 'eira' ? (view.motion?.kind === 'retreat' ? 'Eira se vrací do postoje…' : 'Eira je na tahu…')
    : view.turn === 'enemy' ? (view.enemyIntent.damage > 0 ? `Strážce útočí ${view.enemyTarget === 'eira' ? 'na Eiru' : 'na tebe'}…` : 'Strážce nabírá dech…')
    : view.motion?.actor === 'player' ? playerMovementText : 'Tvá akce se vyhodnocuje…';
  const combatHint = eiraDown ? 'Eira je zraněná. Souboj musíš dokončit sám.' : 'Eira bojuje po tvém boku. Její tahy probíhají samy.';

  return (
    <div className={styles.page}>
      <header className={styles.header} inert={Boolean(panel)}>
        <Link href="/" className={styles.brand} aria-label="Lancers – zpět na hlavní stránku"><span className={styles.brandMark}><Swords size={19} strokeWidth={1.5} /></span><span>LANCERS <span className={styles.brandDivider}>/</span> <span className={styles.brandWorld}>PLAY</span></span></Link>
        <div className={styles.headerRight}><span className={styles.freeBadge}><span /> Bez přihlášení. Rovnou do hry.</span><Link href="/games" className={styles.backLink}><ArrowLeft size={15} /><span>Zpět na hry</span></Link></div>
      </header>
      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="game-title" inert={Boolean(panel)}>
          <div className={styles.eyebrow}><span /> MALÉ DOBRODRUŽSTVÍ OD LANCERS</div>
          <h1 id="game-title">LES<br /><span>STÍNŮ</span><span className={styles.titlePeriod}>.</span></h1>
          <div className={styles.titleRule}><span /> <Sparkles size={13} /> <span /></div>
          <p className={styles.lead}>Každý příběh<br />potřebuje hrdinu.</p>
          <p className={styles.description}>Dej mu jméno. Vyber jeho podobu.<br />U ohně na tebe někdo čeká.<br />Do města zbývá poslední den.</p>
          <div className={styles.chapter}><span>01</span><div><strong>ZA HRANICÍ SVĚTLA</strong><small>Příběh začíná u táboráku</small></div></div>
          <div className={styles.introFooter}><Sword size={14} /> Z první osoby <span>·</span> Pixelové fantasy</div>
        </section>
        <section ref={gameColumn} className={`${styles.gameColumn} ${expanded ? styles.expanded : ''}`} aria-label="Les stínů – hra">
          <div className={styles.frameTop}><span><span className={styles.liveDot} /> LES STÍNŮ</span><span>{scene === 'creator' ? 'TVORBA HRDINY' : scene === 'menu' ? 'HLAVNÍ MENU' : scene === 'camp' ? 'PRVNÍ NOC' : scene === 'cinematic' ? (firestormActive ? 'POSLEDNÍ KOUZLO' : 'NEJSME TU SAMI') : scene === 'sanctuary' ? 'OHOŘELÝ STRÁŽCE' : scene === 'exploration' ? (view.exploration.mode === 'dawn' ? 'PRVNÍ SVĚTLO' : 'PRŮZKUM OKOLÍ') : 'STARÝ HVOZD'} <span className={styles.version}>/ 18</span></span></div>
          <div ref={arena} tabIndex={-1} className={styles.arena} data-scene={scene} data-story-node={scene === 'camp' ? view.story?.nodeId : undefined} data-cinematic-kind={scene === 'cinematic' ? view.cinematic?.kind || 'camp' : undefined} data-cinematic-time={scene === 'cinematic' ? view.cinematic?.elapsed.toFixed(2) : undefined} data-cinematic-paused={scene === 'cinematic' ? view.cinematic?.paused : undefined} data-status={view.status} data-turn={view.turn} data-phase={view.phase} data-distance={scene === 'battle' ? position.distance.toFixed(2) : undefined} data-reaction={scene === 'battle' ? view.reaction?.kind : undefined} data-enemy-target={scene === 'battle' ? view.enemyTarget : undefined} data-eira-health={scene === 'battle' ? view.eira?.health : undefined} data-defender={scene === 'battle' ? view.reaction?.actor : undefined} aria-label={scene === 'battle' ? 'Tahový souboj po boku Eiry. Eira bojuje sama. Pohyb, kryt a úhyb probíhají automaticky. 1 nebo mezerník: meč. 2: těžký úder. 3 nebo R: oddech. Escape: pauza.' : scene === 'cinematic' ? (firestormActive ? 'Příběhová scénka: poslední ohnivé kouzlo. S Eirou utíkáš do bezpečí starého dubu. Mezerník nebo Escape: pauza. Scénku můžeš přeskočit tlačítkem.' : 'Příběhová scénka: vyrušení u ohně. Mezerník nebo Escape: pauza. Scénku můžeš přeskočit tlačítkem.') : scene === 'exploration' ? 'Průzkum z první osoby. Vyber místo v krajině; hrdina k němu sám dojde. Při prohlídce Enter nebo mezerník: další replika. Escape: pauza cesty nebo menu.' : scene === 'sanctuary' ? 'Ohořelý strážce. Starý dub vás ochránil před ohněm a stále stojí.' : scene === 'camp' ? 'Rozhovor u táboráku. Enter nebo mezerník: další replika. 1 nebo 2: odpověď. Escape: menu.' : scene === 'creator' ? 'Tvorba hrdiny' : 'Hlavní menu hry Les stínů'} onContextMenu={(event) => event.preventDefault()}>
            <canvas ref={canvas} width={360} height={600} className={styles.canvas} role="img" aria-label={scene === 'battle' ? 'Pixelový noční les. Před tebou stojí stínový strážce s rudýma očima. Z levého boku se do souboje zapojuje společnice Eira. V pravé ruce máš meč, v levé štít.' : scene === 'cinematic' ? (firestormActive ? 'Poražený strážce ustupuje a sesílá obrovskou ohnivou vlnu. Pohled shora sleduje hořící louku a oba hrdiny utíkající za starý dub. Strom zachytí náraz a zůstane stát.' : 'Eira zaslechne prasknutí větve, otočí se doprava a tasí meč. Tvůj pohled ji následuje do lesa, odkud přichází stínový strážce.') : scene === 'exploration' ? 'Z první osoby prozkoumáváš spálenou mýtinu, starý dub, tělo běsa a stopy u lesa. Cesta vede zpět k táboráku. V popředí jsou ruce tvého hrdiny.' : scene === 'sanctuary' ? 'Ohořelý mohutný dub nad spálenou loukou. Jeho staré znamení vás ochránilo. Hrdina a Eira jsou v bezpečí za kmenem.' : scene === 'camp' ? 'Z první osoby sedíš u plápolajícího táboráku. Naproti tobě sedí společnice Eira, tvář ozářenou ohněm. Kolem tábořiště stojí temné borovice.' : 'Pixelový noční les pod hvězdnou oblohou.'} />
            <div className={styles.vignette} style={scene === 'cinematic' ? { '--cinematic-grade': Math.max(0, Math.min(1, (view.cinematic.elapsed - 8) / 10)) } : undefined} />
            <div className={styles.gameToolbar} hidden={scene === 'creator' || scene === 'cinematic'} inert={Boolean(panel) || scene === 'creator' || scene === 'cinematic'}>
              <span className={styles.location}><Moon size={12} /> {scene === 'camp' ? 'POD STARÝMI BOROVICEMI' : scene === 'sanctuary' ? 'PO OHNIVÉ VLNĚ' : scene === 'exploration' ? (view.exploration.mode === 'dawn' ? 'SVÍTÁNÍ' : 'STARÝ HVOZD · PRŮZKUM') : 'STARÝ HVOZD'}</span>
              <div className={styles.toolbarButtons}>
                <button type="button" onClick={(event) => pointerAction(event, () => setSound(!sound))} aria-label={sound ? 'Vypnout zvuk' : 'Zapnout zvuk'} aria-pressed={sound} title={sound ? 'Vypnout zvuk' : 'Zapnout zvuk'}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
                <button type="button" onClick={(event) => pointerAction(event, toggleFullscreen)} aria-label={expanded ? 'Ukončit celou obrazovku' : 'Celá obrazovka'} aria-pressed={expanded} title={expanded ? 'Ukončit celou obrazovku' : 'Celá obrazovka'}>{expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
                {scene === 'battle' && (playing || view.status === 'paused') && <button type="button" onClick={(event) => pointerAction(event, pause)} aria-label={playing ? 'Pozastavit hru' : 'Pokračovat ve hře'} title="Pauza (Esc)">{playing ? <Pause size={16} /> : <Play size={16} />}</button>}
                {scene === 'exploration' && ['travel', 'sleep'].includes(view.exploration.mode) && <button type="button" onClick={(event) => pointerAction(event, pauseExploration)} aria-label={view.exploration.paused ? 'Pokračovat v průzkumu' : 'Pozastavit průzkum'}>{view.exploration.paused ? <Play size={16} /> : <Pause size={16} />}</button>}
              </div>
            </div>
            <div className={styles.battleLayer} hidden={scene !== 'battle'} inert={Boolean(panel) || scene !== 'battle'}>
            <div className={`${styles.enemyHud} ${ended ? styles.hudFaded : ''}`}>
              <div className={styles.enemyName}><span className={styles.enemyDiamond}>◇</span><span>STRÁŽCE HVOZDU</span><span className={styles.enemyLevel}>{view.enemyHealth} / {view.enemyMaxHealth}</span></div>
              <div className={styles.enemyHealth} role="progressbar" aria-label="Život příšery" aria-valuemin={0} aria-valuemax={view.enemyMaxHealth} aria-valuenow={view.enemyHealth}><span style={{ width: `${view.enemyHealth / view.enemyMaxHealth * 100}%` }} /></div>
              {playing || view.status === 'paused' ? <span className={`${styles.enemyIntent} ${view.enemyIntent.kind === 'heavy' ? styles.heavyIntent : ''}`} title={view.enemyIntent.description}>{view.turn === 'enemy' && view.enemyIntent.damage > 0 ? <>{view.enemyIntent.label} → <b>{enemyTargetLabel}</b></> : <>PŘÍŠTÍ AKCE: {view.enemyIntent.label}{view.enemyIntent.damage > 0 ? ` · síla ${view.enemyIntent.damage}` : ''}</>}</span> : <span className={styles.enemyCaption}>STVOŘENÍ STARÉHO LESA</span>}
            </div>
            {(playing || view.status === 'paused') && <div className={styles.turnOrder}>
              <div className={styles.turnOrderHeading}><span>POŘADÍ · {actionNames[previewAction]}</span><span>TAH {view.turnNumber}</span></div>
              <ol aria-label={`Pořadí tahů pro akci ${actionNames[previewAction]}`}>
                {order.map((actor, index) => {
                  const Icon = actorIcons[actor];
                  return <li key={index} className={`${styles[`${actor}Token`]} ${index === 0 ? styles.currentToken : ''}`} aria-label={`${index + 1}. ${actorNames[actor]}`}><Icon size={12} /><span>{actorNames[actor].toLocaleUpperCase('cs')}</span>{index < order.length - 1 && <ChevronRight className={styles.orderArrow} size={10} />}</li>;
                })}
              </ol>
              {view.eira && <div className={`${styles.allyHud} ${eiraDown ? styles.allyDown : view.turn === 'eira' ? styles.allyActive : ''}`}>
                <span><UserRound size={12} /> <b>EIRA</b><small>{eiraDown ? 'ZRANĚNÁ' : view.turn === 'eira' ? 'JE NA TAHU' : 'SPOLEČNICE'}</small></span>
                <div className={styles.allyHealth} role="progressbar" aria-label="Život Eiry" aria-valuemin={0} aria-valuemax={view.eira.maxHealth} aria-valuenow={view.eira.health}><span style={{ width: `${view.eira.health / view.eira.maxHealth * 100}%` }} /></div>
                <output aria-label="Životy Eiry">{view.eira.health}<span> / {view.eira.maxHealth}</span></output>
              </div>}
            </div>}
            {view.status === 'paused' && !panel && <div className={styles.overlay}><div className={styles.resultPanel}><Pause size={28} className={styles.resultIcon} /><p className={styles.smallCaps}>CHVÍLE KLIDU</p><h2>Les počká.</h2><p>Souboj je pozastavený.</p><button type="button" className={styles.primaryButton} onClick={() => { pause(); arena.current?.focus({ preventScroll: true }); }}><Play size={17} /> POKRAČOVAT</button><button type="button" className={styles.textButton} onClick={begin}><RotateCcw size={14} /> Začít znovu</button></div></div>}
            {ended && <div className={styles.overlay}><div className={styles.resultPanel} role="status">{view.status === 'won' ? <Sparkles size={30} className={styles.resultIcon} /> : <Sword size={30} className={styles.resultIcon} />}<p className={styles.smallCaps}>{view.status === 'won' ? 'CESTA JE VOLNÁ' : 'TMA ZVÍTĚZILA'}</p><h2>{view.status === 'won' ? 'Strážce padl.' : 'Zkus jinou taktiku.'}</h2><p>{view.status === 'won' ? (eiraDown ? 'Strážce padl. Eira je zraněná, ale přežila. Tady naše ukázka končí.' : 'Strážce už vám nestojí v cestě. S Eirou můžete pokračovat; tady naše ukázka končí.') : 'Střídej útoky s oddechem. Nebo před dalším pokusem uprav svou postavu a její šance na obranu.'}</p><div className={styles.results}><div><strong>{view.stats.turns}</strong><small>TVÝCH TAHŮ</small></div><div><strong>{view.stats.blocks}</strong><small>ZACHYCENÉ ÚDERY</small></div><div><strong>{view.health}</strong><small>ŽIVOTY</small></div></div><button type="button" className={styles.primaryButton} onClick={begin}><RotateCcw size={16} /> {view.status === 'won' ? 'HRÁT ZNOVU' : 'ZKUSIT ZNOVU'}</button><button type="button" className={styles.textButton} onClick={newGame}><UserRound size={14} /> Upravit postavu</button></div></div>}
            {renderError && <div className={styles.overlay}><div className={styles.resultPanel}><h2>Les se nenačetl.</h2><p>Tento prohlížeč nepodporuje herní plátno. Zkus aktuální Chrome, Safari nebo Firefox.</p><button type="button" className={styles.primaryButton} onClick={() => window.location.reload()}>ZKUSIT ZNOVU</button></div></div>}
            <div className={`${styles.playerHud} ${!playing ? styles.controlsResting : ''}`} inert={Boolean(panel)}>
              <div className={styles.passiveReadout} aria-label={`Automatická obrana. Šance na blok ${hero.blockChance} procent. Šance na úhyb ${hero.dodgeChance} procent.`}>
                <span>AUTOMATICKY</span>
                <span><Shield size={12} /> BLOK <b>{hero.blockChance} %</b></span>
                <span><Wind size={12} /> ÚHYB <b>{hero.dodgeChance} %</b></span>
              </div>
              {playing && <div className={`${styles.combatHint} ${playerTurn ? styles.openingHint : view.turn === 'eira' ? styles.allyHint : styles.dangerHint}`}><span className={styles.hintDiamond}>◆</span>{statusText}<small className={styles.latestEvent}>{feedback?.text || combatHint}</small></div>}
              <span className={styles.heroNameLabel}>{profile.name}{!savingAvailable && <small> · ukládání není dostupné</small>}</span>
              <div className={styles.playerBars}>
                <div className={styles.playerStat}><div><Heart size={12} /><span>ŽIVOT</span><b>{view.health}<span> / {view.maxHealth}</span></b></div><div className={styles.healthTrack} role="progressbar" aria-label="Tvůj život" aria-valuemin={0} aria-valuemax={view.maxHealth} aria-valuenow={view.health}><span style={{ width: `${view.health / view.maxHealth * 100}%` }} /></div></div>
                <div className={styles.playerStat}><div><Zap size={12} /><span>VÝDRŽ</span><b>{Math.floor(view.stamina)}<span> / {view.maxStamina}</span></b></div><div className={styles.staminaTrack} role="progressbar" aria-label="Výdrž" aria-valuemin={0} aria-valuemax={view.maxStamina} aria-valuenow={Math.floor(view.stamina)}><span style={{ width: `${view.stamina / view.maxStamina * 100}%` }} /></div></div>
              </div>
              <div className={styles.controls}>
                {actionOrder.map((kind) => {
                  const info = getActionInfo(view, kind);
                  const Icon = actionIcons[kind];
                  const effect = kind === 'rest' ? `+${hero.restRecovery} výdrže` : `až ${info.damage} poškození`;
                  const tempo = kind === 'power' ? 'pomalý' : kind === 'rest' ? 'oddech' : 'běžný';
                  return <button key={kind} type="button" className={`${styles.control} ${styles[`${kind}Control`]}`} disabled={!playerTurn || info.disabled} onClick={(event) => pointerAction(event, () => action(kind))} onMouseEnter={() => setPreviewAction(kind)} onMouseLeave={() => setPreviewAction('attack')} onFocus={() => setPreviewAction(kind)} onBlur={() => setPreviewAction('attack')} aria-label={actionNames[kind]} title={`${info.description} ${info.reason || ''}`}>
                    <span className={styles.actionTop}><Icon size={20} strokeWidth={1.5} /><span className={styles.actionCost}>{info.cost > 0 ? <><Zap size={8} />{info.cost}</> : '+ VÝDRŽ'}</span></span><span className={styles.actionText}><strong>{info.label}</strong><small>{effect}</small></span><span className={styles.srOnly}>{actionKeys[kind]} · {tempo}. {info.reason}</span>
                  </button>;
                })}
              </div>
            </div>
            </div>
            {scene === 'menu' && <div inert={Boolean(panel)}><GameMenu profile={profile} hasRun={hasRun} status={view.status} turn={view.turnNumber} resumeScene={view.resumeScene} cinematicKind={view.cinematic?.kind} explorationMode={view.exploration?.mode} loaded={loaded} savingAvailable={savingAvailable} onNewGame={newGame} onContinue={continueGame} onHelp={() => openPanel('help')} /></div>}
            {scene === 'creator' && <div className={styles.creatorHost} inert={Boolean(panel)}><CharacterCreator profile={draft} onChange={setDraft} onStart={() => launch(draft)} onBack={toMenu} onAttributes={() => openPanel('character')} savingAvailable={savingAvailable} /></div>}
            {scene === 'camp' && <div inert={Boolean(panel)}>
              <CampDialogue nodeId={view.story?.nodeId} heroName={profile.name} onAdvance={advanceDialogue} onDepart={departCamp} savingAvailable={savingAvailable} />
              {renderError && <p className={styles.campRenderNotice} role="status">Obraz tábořiště se nepodařilo načíst. V rozhovoru můžeš pokračovat.</p>}
            </div>}
            {scene === 'cinematic' && <div inert={Boolean(panel)}>
              <CinematicOverlay kind={view.cinematic?.kind} state={view} elapsed={view.cinematic.elapsed} paused={view.cinematic.paused} onPause={pauseCinematic} onSkip={finishCinematic} savingAvailable={savingAvailable} sound={sound} onToggleSound={() => setSound((current) => !current)} />
              {renderError && <p className={styles.campRenderNotice} role="status">Scénku se nepodařilo zobrazit. Tlačítkem Přeskočit můžeš pokračovat v příběhu.</p>}
            </div>}
            {scene === 'sanctuary' && <div inert={Boolean(panel)}><SanctuaryOverlay dialogueId={view.sanctuaryDialogueId} heroName={view.heroName} active={!panel} onAdvance={advanceOakDialogue} onRestart={restartOakDialogue} onExplore={() => beginExploration()} onSleep={() => beginExploration(true)} eiraDown={eiraDown} savingAvailable={savingAvailable} onReplay={replayFirestorm} onJournal={() => openPanel('log')} /></div>}
            {scene === 'exploration' && <div inert={Boolean(panel)}><ExplorationOverlay state={view} active={!panel} onTravel={exploreTravel} onInspect={exploreInspect} onAdvance={exploreAdvance} onPause={pauseExploration} onSleep={exploreSleep} onJournal={() => openPanel('log')} /></div>}
            {panel && <div className={styles.helpOverlay}>
              <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={panel === 'character' ? 'character-title' : panel === 'log' ? 'log-title' : panel === 'inventory' ? 'inventory-title' : 'help-title'} tabIndex={-1} className={panel === 'character' ? styles.characterDialog : styles.helpDialog} onKeyDown={trapFocus}>
                {panel === 'character' ? <CharacterSheet attributes={displayedProfile.attributes} onChange={changeAttributes} readOnly={scene !== 'creator'} returnLabel={scene === 'camp' ? 'ZPĚT K OHNI' : scene === 'cinematic' ? 'ZPĚT KE SCÉNCE' : scene === 'sanctuary' ? 'ZPĚT KE STROMU' : scene === 'exploration' ? 'ZPĚT K PRŮZKUMU' : 'ZPĚT DO SOUBOJE'} onClose={closePanel} /> : <>
                  <button type="button" className={styles.closeHelp} aria-label={panel === 'log' ? 'Zavřít deník' : panel === 'inventory' ? 'Zavřít předměty' : 'Zavřít návod'} onClick={closePanel}><X size={20} /></button>
                  {panel === 'inventory' ? <><p className={styles.smallCaps}>NÁLEZY Z OKOLÍ</p><h2 id="inventory-title">Předměty</h2>{view.exploration?.inventory.includes('shackle-fragment') ? <ol className={styles.combatLog}><li><Backpack size={25} /><div><strong>Úlomek železného okovu</strong><p>Ohořelý kus železa ze zápěstí popelavého běsa. Je na něm vyražená neznámá značka. Někdo ve městě by ji mohl poznat.</p><small>1 kus · nalezeno u těla běsa</small></div></li></ol> : <p className={styles.helpFootnote}>Zatím u sebe nemáš žádný nález. Zajímavé předměty můžeš objevit při prohlídce okolí.</p>}</> : panel === 'log' ? <><p className={styles.smallCaps}>CO SE STALO MEZI STROMY</p><h2 id="log-title">Deník výpravy</h2><ol className={styles.combatLog}>{view.log.length ? view.log.map((entry) => <li key={entry.id}><span>{entry.actor === 'player' ? <Sword size={15} /> : entry.actor === 'eira' ? <UserRound size={15} /> : entry.actor === 'enemy' ? <Skull size={15} /> : <Sparkles size={15} />}</span><p>{entry.text}</p></li>) : <li><p>Tvůj příběh začne prvním tahem.</p></li>}</ol></> : scene === 'camp' ? <>
                    <p className={styles.smallCaps}>PŘISEDNI K OHNI</p><h2 id="help-title">Příběh má své tempo.</h2>
                    <ol><li><Moon size={20} /><div><strong>Poslouchej a odpovídej.</strong><p>Další repliku otevřeš tlačítkem Pokračovat. Když dostaneš na výběr, klepni na svou odpověď.</p></div></li><li><Check size={20} /><div><strong>Vrať se, až budeš chtít.</strong><p>Každá přečtená replika se ukládá. Přes Menu a Pokračovat se vrátíš přesně k rozhovoru.</p></div></li><li><ArrowUpRight size={20} /><div><strong>Sleduj, co se děje.</strong><p>Na rozhovor naváže krátká scénka. Můžeš ji pozastavit nebo přeskočit; první tah souboje potom čeká na tebe.</p></div></li></ol>
                    <p className={styles.helpFootnote}>PC: Enter / mezerník další replika · 1 / 2 odpověď · Escape menu. Na mobilu stačí klepnout. Rozhovor nikam nepospíchá.</p>
                  </> : scene === 'exploration' ? <>
                    <p className={styles.smallCaps}>PO STOPÁCH OHNĚ</p><h2 id="help-title">Vyber, co tě zajímá.</h2>
                    <ol><li><Sparkles size={20} /><div><strong>Klepni na místo v krajině.</strong><p>Vyber dub, tělo běsa nebo stopy u lesa. Hrdina se sám otočí, dojde k cíli a zastaví.</p></div></li><li><Backpack size={20} /><div><strong>Prohlédni si nález.</strong><p>Při prohlídce pokračuj tlačítkem nebo klávesou Enter či mezerníkem. Okov vezmeš výslovně tlačítkem; pak ho najdeš mezi předměty. Stopy se zapisují do deníku.</p></div></li><li><Moon size={20} /><div><strong>K ohni se můžeš vrátit kdykoli.</strong><p>Eira jde při průzkumu s tebou. Tábořiště je hlouběji v lese; pěšina vás k němu sama dovede. U ohně si můžete promluvit nebo jít spát.</p></div></li></ol>
                    <p className={styles.helpFootnote}>Cesta i nálezy se ukládají. Escape pozastaví přesun; při stání otevře menu.</p>
                  </> : scene === 'sanctuary' ? <>
                    <p className={styles.smallCaps}>V BEZPEČÍ ZA STROMEM</p><h2 id="help-title">Oheň zanechal otázky.</h2>
                    <ol><li><UserRound size={20} /><div><strong>Promluv si s Eirou.</strong><p>Repliky pokračují tlačítkem Pokračovat nebo klávesou Enter či mezerníkem. Na přečtení máš tolik času, kolik potřebuješ.</p></div></li><li><Check size={20} /><div><strong>Vrať se k rozečtenému rozhovoru.</strong><p>Každá replika se ukládá. Po návratu přes Menu a Pokračovat navážeš tam, kde jsi skončil.</p></div></li><li><Sparkles size={20} /><div><strong>Prohlédni si Ohořelého strážce.</strong><p>Rozhlédnout se skryje rozhovor a odkryje výhled. Po dokončení najdeš stopu o příšeře v deníku; rozhovor můžeš přehrát znovu.</p></div></li></ol>
                    <p className={styles.helpFootnote}>Escape zavře otevřený panel nebo vrátí hru do menu.</p>
                  </> : <>
                    <p className={styles.smallCaps}>NEŽ POZVEDNEŠ MEČ</p><h2 id="help-title">Každý tah se počítá.</h2>
                    <ol><li><Sword size={20} /><div><strong>Ty vybíráš bojovou akci.</strong><p>Zvol sek, těžký úder nebo oddech. Postavy se samy pohybují a před úderem přistoupí na dosah. Jejich pohyb nic nestojí a nepřináší poziční bonusy. Během tvého rozhodování se neútočí.</p></div></li><li><Shield size={20} /><div><strong>Obrana přijde sama.</strong><p>Obratnost zvyšuje šanci na úhyb; Obrana šanci na blok. Úhyb nechá útok minout, blok sníží zásah. Obojí uvidíš v pohybu postav a nemusíš pro to nic mačkat. I strážce může uhnout nebo se krýt.</p></div></li><li><UserRound size={20} /><div><strong>Eira ti kryje záda.</strong><p>Společnice sama přistoupí, zaútočí a brání se. Má vlastní životy i tahy. Strážce může napadnout tebe nebo ji. Při nule životů je zraněná a z boje odstoupí; ty můžeš pokračovat.</p></div></li><li><Zap size={20} /><div><strong>Najdi své tempo.</strong><p>Síla zvyšuje poškození a odolnost životy i zbroj. Obratnost také zrychluje tahy. Oddech doplní výdrž a trochu životů. Pořadí nahoře ukazuje výhled pro zvolenou akci.</p></div></li></ol>
                    <p className={styles.helpFootnote}>PC: 1 / mezerník meč · 2 těžký úder · 3 / R oddech. Na mobilu klepni na tlačítko. Pohyb, blok i úhyb probíhají automaticky.</p>
                  </>}
                </>}
              </div>
            </div>}
            <span className={styles.srOnly} aria-live="polite">{playing ? `${statusText} Příští akce příšery: ${view.enemyIntent.label}. ${playerTurn ? combatHint : ''}` : ''}</span>
          </div>
          <div className={styles.frameBottom} inert={Boolean(panel)}>
            {scene === 'cinematic' ? <><button type="button" onClick={toMenu}>Menu</button><span>MEZERNÍK / ESC · PAUZA</span></> : <>
              {['battle', 'camp', 'sanctuary', 'exploration'].includes(scene) ? <>
                <button type="button" onClick={toMenu}>Menu</button>
                <button type="button" onClick={() => openPanel('character')}><UserRound size={12} /> Postava</button>
                {['battle', 'sanctuary', 'exploration'].includes(scene) && <button type="button" onClick={() => openPanel('log')}>Deník</button>}
                {scene === 'exploration' && <button type="button" onClick={() => openPanel('inventory')} aria-label="Předměty"><Backpack size={14} /><span>Předměty</span></button>}
              </> : <Link href="/games" className={styles.gameExitLink}><ArrowLeft size={13} /> Zpět na hry</Link>}
              <button type="button" onClick={() => openPanel('help')}>Jak hrát <ArrowUpRight size={13} /></button>
            </>}
          </div>
        </section>
        <aside className={styles.guide} aria-label="Postava a pravidla tahového souboje" inert={Boolean(panel)}>
          <div className={styles.guideHeading}><span>{scene === 'creator' ? 'TVŮJ HRDINA VZNIKÁ' : 'TVÁ POSTAVA'}</span><span>↘</span></div>
          <p className={styles.profileName}>{displayedProfile.name.trim() || 'Poutník'}</p>
          <div className={styles.heroStat}><span className={styles.guideIcon}><Sword size={20} strokeWidth={1.4} /></span><div><h3>Síla <b>{displayedProfile.attributes.strength}</b></h3><p>Meč {hero.attackDamage} · těžký úder {hero.powerDamage}</p></div></div>
          <div className={styles.heroStat}><span className={styles.guideIcon}><Wind size={20} strokeWidth={1.4} /></span><div><h3>Obratnost <b>{displayedProfile.attributes.speed}</b></h3><p>Úhyb {hero.dodgeChance} % · iniciativa {hero.initiative}</p></div></div>
          <div className={styles.heroStat}><span className={styles.guideIcon}><Heart size={20} strokeWidth={1.4} /></span><div><h3>Odolnost <b>{displayedProfile.attributes.vitality}</b></h3><p>{hero.maxHealth} životů · zbroj {hero.armor}</p></div></div>
          <div className={styles.heroStat}><span className={styles.guideIcon}><Shield size={20} strokeWidth={1.4} /></span><div><h3>Obrana <b>{displayedProfile.attributes.defense}</b></h3><p>Automatický blok {hero.blockChance} %</p></div></div>
          <button type="button" className={styles.editHero} onClick={scene === 'menu' ? newGame : () => openPanel('character')}><UserRound size={13} /> {scene === 'menu' ? 'VYTVOŘIT HRDINU' : scene === 'creator' ? 'ROZDĚLIT ATRIBUTY' : 'PROHLÉDNOUT ATRIBUTY'} <ArrowUpRight size={13} /></button>
          {scene === 'camp' ? <div className={styles.tacticsNote}><span>POSLEDNÍ NOC POD HVĚZDAMI.</span><p>Eira cestuje s tebou. Zítra k večeru byste měli spatřit střechy Březové brány.</p><p>Teď je čas přisednout k ohni. Rozhovor pokračuje, až se rozhodneš.</p></div> : scene === 'sanctuary' ? <div className={styles.tacticsNote}><span>OHEŇ POMINUL. STROM ZŮSTAL.</span><p>Mohutný dub vás ukryl před posledním kouzlem strážce. Je ohořelý, ale nezlomený.</p><p>Jeho znamení i místo zůstávají v deníku vaší výpravy.</p></div> : scene === 'exploration' ? <div className={styles.tacticsNote}><span>CO PO SOBĚ ZANECHAL OHEŇ.</span><p>Vyber místo v krajině. Hrdina k němu sám dojde; stopy můžeš prohlédnout v libovolném pořadí.</p><p>Eira jde s tebou. K táboráku vás dovede delší pěšina mezi borovicemi. U ohně můžete probrat nálezy a ukončit noc spánkem.</p></div> : scene === 'cinematic' ? <div className={styles.tacticsNote}><span>{firestormActive ? 'POSLEDNÍ KOUZLO STRÁŽCE.' : 'NĚCO SE POHNULO MEZI STROMY.'}</span><p>{firestormActive ? 'Mezi jeho drápy se rozhoří světlo. Eira zahlédne jediný možný úkryt.' : 'Eira ztichne. I oheň najednou zní příliš hlasitě.'}</p><p>{firestormActive ? 'Scénku můžeš pozastavit nebo přeskočit. Příběh pokračuje pod starým dubem.' : 'Po scénce budeš na tahu. Souboj počká na tvou první akci.'}</p></div> : <div className={styles.tacticsNote}><span>TVŮJ TAH, TVOJE TEMPO.</span><p>Vyber útok nebo oddech. Postavy se samy přibližují, obcházejí a rozestupují. Pohyb nemusíš řídit.</p><p>Eira má vlastní tahy a bojuje sama. Strážce může zaútočit na kteréhokoli z vás. Čas tě netlačí; boj čeká na tvoje rozhodnutí.</p></div>}
          <div className={styles.guideNote}><span className={styles.noteLine} /><p>Žádná instalace. Žádný účet.<br />Jen ty a to, co čeká mezi stromy.</p><span><Check size={12} /> Mobil i počítač</span></div>
        </aside>
      </main>
      <footer className={styles.footer}><span>ZE HŘIŠTĚ DO JINÉHO SVĚTA.</span><span>LANCERS PLAY <span>© 2026</span></span></footer>
    </div>
  );
}
