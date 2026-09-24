export const STORY_START = 'arrival';

const nodes = {
  arrival: {
    speaker: 'eira',
    text: 'Ještě chvíli u ohně a půjdeme spát. Zítra k večeru bychom měli dorazit do Březové brány.',
    next: 'shortcut',
  },
  shortcut: {
    speaker: 'hero',
    text: 'Pokud tentokrát vynecháme tvoji zkratku přes kopce.',
    next: 'view',
  },
  view: {
    speaker: 'eira',
    text: 'Byly jen dva. A z toho druhého byl krásný výhled, uznej.',
    next: 'supper',
  },
  supper: {
    speaker: 'eira',
    text: 'Dnes máme poslední chleba a sýr. Ve městě si to vynahradíme. Co vezmeme jako první?',
    choices: [
      { id: 'meal', label: 'Něco pořádného k jídlu.', next: 'meal' },
      { id: 'bed', label: 'Pokoj. A suché boty.', next: 'bed' },
    ],
  },
  meal: {
    speaker: 'hero',
    text: 'Velkou misku něčeho teplého. A chleba, kterým se nedá zatlouct stanový kolík.',
    next: 'meal_reply',
  },
  meal_reply: {
    speaker: 'eira',
    text: 'Tenhle chleba má jen pevné zásady. Ale platí. Najdeme hostinec, ze kterého bude vonět cibule a máslo.',
    next: 'company',
  },
  bed: {
    speaker: 'hero',
    text: 'Postel, ze které nebudu ráno vybírat jehličí. A suché boty. V tomhle pořadí.',
    next: 'bed_reply',
  },
  bed_reply: {
    speaker: 'eira',
    text: 'Domluveno. Pokoj vezmeme nahoře, dál od výčepu. Na tvoje chrápání jsem si zvykla, na celý hostinec ještě ne.',
    next: 'company',
  },
  company: {
    speaker: 'hero',
    text: 'Hlavně že je to už jen den cesty. Díky za večeři, Eiro. I za ten výhled.',
    end: true,
  },
};

export const STORY_NODES = Object.freeze(Object.fromEntries(
  Object.entries(nodes).map(([id, node]) => [id, Object.freeze({
    ...node,
    ...(node.choices ? { choices: Object.freeze(node.choices.map((choice) => Object.freeze(choice))) } : {}),
  })]),
));

export function isStoryNode(id) {
  return typeof id === 'string' && Object.hasOwn(STORY_NODES, id);
}

export function getStoryNode(id) {
  return STORY_NODES[isStoryNode(id) ? id : STORY_START];
}

export function advanceStoryNode(id, choiceId) {
  if (!isStoryNode(id)) return null;
  const node = STORY_NODES[id];
  if (node.end) return null;
  if (node.choices) return node.choices.find((choice) => choice.id === choiceId)?.next ?? null;
  if (choiceId !== undefined && choiceId !== null) return null;
  return node.next ?? null;
}
