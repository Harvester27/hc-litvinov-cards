import { FIRESTORM_LANDMARK } from './firestorm.mjs';

export const EXPLORATION_TRAVEL_DURATION = 3;
export const EXPLORATION_CAMP_TRAVEL_DURATION = 12;
export const EXPLORATION_SLEEP_DURATION = 4.5;
export const EXPLORATION_LOCATIONS = Object.freeze(['clearing', 'oak', 'creature', 'tracks', 'camp']);
export const SHACKLE_ITEM = 'shackle-fragment';

export const EXPLORATION_NOTES = Object.freeze({
  oak: 'Ve starém dubu je prastará runa. Kůra je chladná a tráva u kořenů přežila ohnivou vlnu.',
  shackle: 'Získán úlomek okovu s neznámou značkou. Popelavý běs byl zřejmě spoutaný.',
  tracks: 'Od lesa vedou stopy běsa a vedle nich otisky lidských bot. Tvor sem možná nepřišel sám.',
  dawn: 'Noc skončila. Za svítání odpočíváte u tábořiště; tajemství spálených hvozdů zůstává otevřené.',
});

const dialogue = [
  { id: 'oak-rune', location: 'oak', speaker: 'hero', text: 'Pod sazemi je vyrytá stará runa. Kůra je na dotek chladná… jako by se jí ten oheň vůbec netýkal.', next: 'oak-grass' },
  { id: 'oak-grass', location: 'oak', speaker: 'hero', text: 'A tráva u kořenů je pořád zelená. Neochránil jen sebe. Ten žár zastavil i před námi.', finding: 'oak' },
  { id: 'creature-shackle', location: 'creature', speaker: 'hero', text: 'Na zápěstí běsa zůstal rozlomený železný okov. Tohle si zvíře samo nenasadí.', next: 'creature-take' },
  { id: 'creature-take', location: 'creature', speaker: 'hero', text: 'Na úlomku je vyražená značka, kterou neznám. Vezmu ho s sebou. Třeba ji někdo ve městě pozná.', finding: 'shackle', actionLabel: 'Vzít úlomek okovu' },
  { id: 'creature-empty', location: 'creature', speaker: 'hero', text: 'Běs už se nehýbe. Úlomek jeho okovu mám u sebe; neznámá značka zatím zůstává jedinou odpovědí.' },
  { id: 'tracks-beast', location: 'tracks', speaker: 'hero', text: 'Tudy běs přišel. Mezi hlubokými otisky drápů jsou ale ještě jiné stopy… lidské boty.', next: 'tracks-boots' },
  { id: 'tracks-boots', location: 'tracks', speaker: 'hero', text: 'Vedou stejným směrem od lesa. Možná toho tvora někdo přivedl. Za tmy je dál sledovat nebudu.', finding: 'tracks' },
  { id: 'camp-report', location: 'camp', speaker: 'hero', text: '', next: 'camp-answer' },
  { id: 'camp-answer', location: 'camp', speaker: 'eira', text: '' },
];
const nodes = Object.freeze(Object.fromEntries(dialogue.map(node => [node.id, Object.freeze(node)])));
const isLocation = value => EXPLORATION_LOCATIONS.includes(value);
const finite = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

export function getExplorationTravelDuration(from, to) {
  if (!isLocation(from) || !isLocation(to) || from === to) return 0;
  return from === 'camp' || to === 'camp' ? EXPLORATION_CAMP_TRAVEL_DURATION : EXPLORATION_TRAVEL_DURATION;
}

export function createExploration() {
  return { location: 'clearing', mode: 'idle', paused: false, companionAtCamp: false, travel: null, inspectionId: null,
    sleepElapsed: 0, findings: { oak: false, shackle: false, tracks: false }, inventory: [] };
}

/** A small checkpoint, not a second copy of the battle or arbitrary dialogue.
 * Cross-field checks prevent a loaded inspection from granting a remote item.
 * Version 9 used three-second camp paths and a permanent camp companion flag;
 * validate that old shape before translating its route progress and location. */
export function normalizeExploration(value, version = 10) {
  const legacy = version === 9;
  if (!value || !isLocation(value.location) || !['idle', 'travel', 'inspect', 'sleep', 'dawn'].includes(value.mode)
    || typeof value.paused !== 'boolean' || typeof value.companionAtCamp !== 'boolean'
    || (value.location === 'camp' && !value.companionAtCamp)
    || (!legacy && value.companionAtCamp !== (value.location === 'camp'))
    || !finite(value.sleepElapsed, 0, EXPLORATION_SLEEP_DURATION)
    || !value.findings || ['oak', 'shackle', 'tracks'].some(key => typeof value.findings[key] !== 'boolean')
    || !Array.isArray(value.inventory) || value.inventory.length !== Number(value.findings.shackle)
    || (value.findings.shackle && value.inventory[0] !== SHACKLE_ITEM)) return null;
  let travel = null;
  if (value.mode === 'travel') {
    const route = value.travel;
    const duration = getExplorationTravelDuration(route?.from, route?.to);
    const savedDuration = legacy ? EXPLORATION_TRAVEL_DURATION : duration;
    if (!route || !isLocation(route.from) || !isLocation(route.to) || route.from === route.to
      || route.from !== value.location || route.duration !== savedDuration
      || !finite(route.elapsed, 0, savedDuration) || typeof route.sleepOnArrival !== 'boolean'
      || (route.sleepOnArrival && route.to !== 'camp')) return null;
    travel = { from: route.from, to: route.to, elapsed: legacy && duration !== savedDuration ? route.elapsed / savedDuration * duration : route.elapsed, duration,
      sleepOnArrival: route.sleepOnArrival };
  } else if (value.travel !== null) return null;
  if (value.mode === 'inspect') {
    const node = typeof value.inspectionId === 'string' && Object.hasOwn(nodes, value.inspectionId) ? nodes[value.inspectionId] : null;
    if (!node || node.location !== value.location
      || (['creature-shackle', 'creature-take'].includes(node.id) && value.findings.shackle)
      || (node.id === 'creature-empty' && !value.findings.shackle)) return null;
  } else if (value.inspectionId !== null) return null;
  if (['sleep', 'dawn'].includes(value.mode)) {
    if (value.location !== 'camp' || (value.mode === 'dawn' && value.sleepElapsed !== EXPLORATION_SLEEP_DURATION)) return null;
  } else if (value.sleepElapsed !== 0) return null;
  return { location: value.location, mode: value.mode, paused: value.paused, companionAtCamp: value.location === 'camp', travel,
    inspectionId: value.inspectionId, sleepElapsed: value.sleepElapsed,
    findings: { oak: value.findings.oak, shackle: value.findings.shackle, tracks: value.findings.tracks },
    inventory: value.findings.shackle ? [SHACKLE_ITEM] : [] };
}

function finishedNightBattle(state) {
  return state?.status === 'won' && state.enemyHealth === 0 && state.health > 0
    && state.discoveredLandmark === FIRESTORM_LANDMARK && state.sanctuaryDialogueId === 'complete';
}

function activeExploration(state) {
  return state?.scene === 'exploration' && finishedNightBattle(state) && normalizeExploration(state.exploration) !== null;
}

function beginTravel(exploration, target, sleepOnArrival = false) {
  exploration.mode = 'travel';
  exploration.travel = { from: exploration.location, to: target, elapsed: 0,
    duration: getExplorationTravelDuration(exploration.location, target), sleepOnArrival };
}

export function enterExploration(state, options = {}) {
  if (state?.scene !== 'sanctuary' || !finishedNightBattle(state)) return false;
  if (state.exploration != null && !normalizeExploration(state.exploration)) return false;
  const exploration = state.exploration ?? createExploration();
  if (options?.sleep === true && exploration.mode !== 'idle') return false;
  state.exploration = exploration;
  state.scene = state.resumeScene = 'exploration';
  state.events = [];
  if (options?.sleep === true) {
    exploration.paused = false;
    if (exploration.location === 'camp') exploration.mode = 'sleep';
    else beginTravel(exploration, 'camp', true);
  }
  return true;
}

export function travelTo(state, target) {
  if (!activeExploration(state) || state.exploration.paused || state.exploration.mode !== 'idle'
    || !isLocation(target) || state.exploration.location === target) return false;
  beginTravel(state.exploration, target);
  return true;
}

export function inspectLocation(state) {
  if (!activeExploration(state) || state.exploration.paused || state.exploration.mode !== 'idle') return false;
  const exploration = state.exploration;
  const inspectionId = { oak: 'oak-rune', creature: exploration.findings.shackle ? 'creature-empty' : 'creature-shackle',
    tracks: 'tracks-beast', camp: 'camp-report' }[exploration.location];
  if (!inspectionId) return false;
  exploration.mode = 'inspect'; exploration.inspectionId = inspectionId;
  return true;
}

export function getExplorationDialogue(state) {
  const exploration = state?.exploration;
  if (exploration?.mode !== 'inspect' || !normalizeExploration(exploration)) return null;
  const node = nodes[exploration.inspectionId];
  let text = node.text;
  const { oak, shackle, tracks } = exploration.findings;
  if (node.id === 'camp-report') {
    text = shackle && tracks ? 'Běs měl na ruce okov. Vzal jsem úlomek se zvláštní značkou. A v lese jsou vedle jeho stop i lidské boty.'
      : shackle ? 'Našel jsem na běsovi okov s neznámou značkou. Mám kousek u sebe. Někdo ho musel držet v zajetí.'
        : tracks ? 'Vedle stop běsa jsou i lidské otisky. Možná sem nepřišel sám.'
          : oak ? 'Ten dub je chladný a tráva kolem něj přežila. Ve kmeni je stará runa. Nebyla to obyčejná náhoda.'
            : 'Oheň ještě nezhasl. Zůstaneme tu do rána. Po tom všem si potřebujeme odpočinout.';
  } else if (node.id === 'camp-answer') {
    const clue = shackle && tracks ? 'Takže měl okovy a někdo ho doprovázel… Ve městě se na tu značku zeptáme.'
      : shackle ? 'Tu značku si zapamatujme. Jestli běsa někdo spoutal, měl k tomu důvod.'
        : tracks ? 'Za tmy tam nepůjdeme. Jestli toho tvora někdo vedl, raději se nejdřív připravíme.'
          : oak ? 'Možná tu ten strom stojí právě proto, aby něco chránil. Dnes ochránil nás.'
            : 'Souhlasím. Otázky počkají do rána. Dnes už toho bylo dost.';
    text = state.eira?.health === 0 ? `${clue} Jsem zraněná, ale s tvou oporou cestu zvládnu. Teď si spolu chvíli odpočiňme u ohně.` : clue;
  }
  return { id: node.id, speaker: node.speaker, text, next: node.next ?? null, end: !node.next,
    actionLabel: node.actionLabel ?? (node.next ? 'Pokračovat' : 'Zavřít') };
}

function journal(state, text) {
  if (!Array.isArray(state.log)) state.log = [];
  if (state.log.some(entry => entry?.text === text)) return;
  state.logId = (Number.isInteger(state.logId) ? state.logId : 0) + 1;
  state.log.push({ id: state.logId, actor: 'system', text });
  if (state.log.length > 8) state.log.splice(0, state.log.length - 8);
}

export function advanceInspection(state) {
  if (!activeExploration(state) || state.exploration.paused || state.exploration.mode !== 'inspect') return false;
  const exploration = state.exploration, node = nodes[exploration.inspectionId];
  if (node.next) exploration.inspectionId = node.next;
  else {
    if (node.finding && !exploration.findings[node.finding]) {
      exploration.findings[node.finding] = true;
      if (node.finding === 'shackle') exploration.inventory.push(SHACKLE_ITEM);
      journal(state, EXPLORATION_NOTES[node.finding]);
    }
    exploration.inspectionId = null; exploration.mode = 'idle';
  }
  return true;
}

export function sleepAtCamp(state) {
  if (!activeExploration(state) || state.exploration.paused || state.exploration.mode !== 'idle'
    || state.exploration.location !== 'camp') return false;
  state.exploration.mode = 'sleep'; state.exploration.sleepElapsed = 0;
  return true;
}

export function toggleExplorationPause(state) {
  if (!activeExploration(state) || state.exploration.mode === 'dawn') return false;
  state.exploration.paused = !state.exploration.paused;
  return true;
}

/** Timed paths and sleep have one destination. Excess frame time cannot skip
 * straight through arrival and the following sleep or advance a dialogue. */
export function stepExploration(state, delta) {
  if (!activeExploration(state) || state.exploration.paused || !Number.isFinite(delta) || delta <= 0) return false;
  const exploration = state.exploration, dt = Math.min(delta, .25);
  if (exploration.mode === 'travel') {
    const travel = exploration.travel;
    const previous = travel.elapsed;
    travel.elapsed = Math.min(travel.duration, travel.elapsed + dt);
    if (!Array.isArray(state.events)) state.events = [];
    for (let step = 0; (45 + step * 65) / 100 < travel.duration; step++) {
      const time = (45 + step * 65) / 100;
      if (previous < time && travel.elapsed >= time) state.events.push({ type: 'run_step', audio: { gain: .35 } });
    }
    if (travel.elapsed < travel.duration - 1e-8) return false;
    exploration.location = travel.to; exploration.travel = null;
    exploration.companionAtCamp = exploration.location === 'camp';
    exploration.mode = travel.sleepOnArrival ? 'sleep' : 'idle';
    state.events.push({ type: 'cloth_rustle', audio: { gain: .25 } });
    return true;
  }
  if (exploration.mode === 'sleep') {
    exploration.sleepElapsed = Math.min(EXPLORATION_SLEEP_DURATION, exploration.sleepElapsed + dt);
    if (exploration.sleepElapsed < EXPLORATION_SLEEP_DURATION - 1e-8) return false;
    exploration.sleepElapsed = EXPLORATION_SLEEP_DURATION;
    exploration.mode = 'dawn'; exploration.paused = false;
    journal(state, EXPLORATION_NOTES.dawn);
    return true;
  }
  return false;
}
