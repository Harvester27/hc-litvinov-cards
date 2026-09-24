import { FIRESTORM_LANDMARK } from './firestorm.mjs';

export const SANCTUARY_DIALOGUE_START = 'relief';
export const SANCTUARY_DIALOGUE_COMPLETE = 'complete';
export const SANCTUARY_LORE_NOTE = 'Eira poznala popelavého běsa ze spálených hvozdů za severními horami. Jeho přítomnost zde je záhadou.';

const dialogue = [
  { id: 'relief', speaker: 'eira', text: 'To bylo štěstí… Nevěřila jsem, že nás ten strom ochrání. Takový žár by jiný strom proměnil v popel. Tenhle ale nějakým zázrakem vydržel.' },
  { id: 'question', speaker: 'hero', text: 'Co to bylo za příšeru? A od kdy umí zvířata chrlit oheň?' },
  { id: 'creature', speaker: 'eira', text: 'Myslím, že to byl popelavý běs. Pokřivený strážce lesa, v jehož těle doutná oheň z dávné pohromy. Když je zahnaný do kouta, vypustí ho ven.' },
  { id: 'here', speaker: 'hero', text: 'A co dělal tady?' },
  { id: 'mystery', speaker: 'eira', text: 'Tihle tvorové prý nikdy neopouštějí spálené hvozdy za severními horami. Tady neměl co dělat. Něco se tam muselo změnit… nebo ho sem něco přilákalo.' },
];
const nodes = Object.freeze(Object.fromEntries(dialogue.map((node, index) => [node.id, Object.freeze({
  ...node, next: dialogue[index + 1]?.id ?? SANCTUARY_DIALOGUE_COMPLETE, end: index === dialogue.length - 1,
})])));

export function getSanctuaryDialogue(id) {
  return typeof id === 'string' && Object.hasOwn(nodes, id) ? nodes[id] : null;
}

export function isSanctuaryDialogueId(id) {
  return id === SANCTUARY_DIALOGUE_COMPLETE || getSanctuaryDialogue(id) !== null;
}

function canTalk(state) {
  return state?.scene === 'sanctuary' && state.status === 'won' && state.enemyHealth === 0
    && state.health > 0 && state.discoveredLandmark === FIRESTORM_LANDMARK;
}

/** Conversation advances only after an explicit player choice. No combat
 * resource, pose, random outcome or cinematic clock is changed here. */
export function advanceSanctuaryDialogue(state) {
  if (!canTalk(state)) return false;
  const node = getSanctuaryDialogue(state.sanctuaryDialogueId);
  if (!node) return false;
  state.sanctuaryDialogueId = node.next;
  if (node.end) {
    if (!Array.isArray(state.log)) state.log = [];
    if (!state.log.some(entry => entry?.text === SANCTUARY_LORE_NOTE)) {
      state.logId = (Number.isInteger(state.logId) ? state.logId : 0) + 1;
      state.log.push({ id: state.logId, actor: 'eira', text: SANCTUARY_LORE_NOTE });
      if (state.log.length > 8) state.log.splice(0, state.log.length - 8);
    }
  }
  return true;
}

export function restartSanctuaryDialogue(state) {
  if (!canTalk(state) || !isSanctuaryDialogueId(state.sanctuaryDialogueId)
    || state.sanctuaryDialogueId === SANCTUARY_DIALOGUE_START) return false;
  state.sanctuaryDialogueId = SANCTUARY_DIALOGUE_START;
  return true;
}
