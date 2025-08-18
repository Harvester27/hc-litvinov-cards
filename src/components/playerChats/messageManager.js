// playerChats/messageManager.js
// Správa zpráv pro jednotlivé hráče v WhatsApp skupině

const playerMessages = {
    // Útočníci
    'adamschubadaobyc': [
      'Už se těším na první zápas! 💪',
      'Dneska to bylo super na tréninku',
      'Musíme makat jako tým! 🏒',
      'Kdo jde po tréninku na pivo? 😄',
      'Ta nová taktika je super!',
      'Díky za dnešek, kluci!',
      'Zítra dáme všechno!'
    ],
    'janschubadaobyc': [
      'Brácha říkal, že budeme hrát první lajnu 😎',
      'Musíme víc střílet na bránu',
      'Super trénink dneska!',
      'Těším se na páteční zápas',
      'Dáme to! 💪',
      'Kdo má puky na trénink?',
      'Nezapomeňte na rozcvičku!'
    ],
    'pavelnovakobyc': [
      'Jako kapitán říkám - makáme dál! 💪',
      'Věřím našemu týmu!',
      'Zítra porada v 18:00',
      'Musíme zlepšit přesilovky',
      'Super práce dneska, kluci!',
      'Držme se taktiky!',
      'Jedeme na 110%!'
    ],
    'maternaobyc': [
      'Ta přihrávka byla perfektní! 👌',
      'Musíme víc kombinovat',
      'Díky za asistenci!',
      'Přesilovky budou naše síla',
      'Kdo chce potrénovat přihrávky?',
      'Super hra, týme!',
      'Makáme dál!'
    ],
    'gustavtomanobyc': [
      'Dneska jsem dal 5 gólů na tréninku! 🎯',
      'Musím zlepšit střelbu z první',
      'Ta obrana byla tvrdá',
      'Díky za přihrávky, kluci!',
      'Příště to tam padne!',
      'Super zápas nás čeká',
      'Jedeme na vítězství!'
    ],
    'mariandlugopolskyobyc': [
      'Před brankou je můj revír! 💪',
      'Dorážky jsou moje parketa',
      'Musíme víc do brány',
      'Ta clona byla super!',
      'Díky za spolupráci',
      'Makáme jako tým!',
      'Zítra to rozjedeme!'
    ],
    'petrpetrovobyc': [
      'Moje bruslení je dneska top! ⚡',
      'Ta rychlost je můj trumf',
      'Musím zlepšit zakončení',
      'Super tempo, kluci!',
      'Díky za důvěru',
      'Jedeme naplno!',
      'Rychlost rozhoduje!'
    ],
    
    // Obránci
    'ostepanovskyobyc': [
      'Obrana musí stát! 🛡️',
      'Žádný puk neprojde!',
      'Ta střela byla přes 150 km/h 💥',
      'Musíme líp blokovat',
      'Díky brankáři za zákrok!',
      'Držíme zadek!',
      'Defenziva je základ!'
    ],
    'jindrabelingerobyc': [
      'Přesilovky jsou naše! 🎯',
      'Ta rozehrávka byla super',
      'Musíme podporovat útok',
      'Brácha hraje dobře!',
      'Díky za krytí',
      'Makáme dozadu i dopředu!',
      'Jedeme na maximum!'
    ],
    'jiribelingerobyc': [
      'Blokuju všechno! 🧱',
      'Brácha má pravdu, musíme víc dozadu',
      'Ta střela bolela, ale stálo to za to',
      'Železná obrana!',
      'Díky za podporu',
      'Nedáme jim nic!',
      'Tvrdá obrana vítězí!'
    ],
    'janhanusobyc': [
      'Jako kapitán obrany - držíme linii! 📏',
      'Musíme lépe komunikovat',
      'Ta rozehrávka byla klíčová',
      'Super práce v obraně!',
      'Pozor na jejich útočníky',
      'Držíme formaci!',
      'Obrana je nejlepší útok!'
    ],
    'luboscoufalobyc': [
      'Oslabení zvládneme! 💪',
      'Blokuju všechny střely',
      'Musíme víc do těla',
      'Ta statistika +/- je super',
      'Díky za pomoc',
      'Makáme v oslabení!',
      'Tvrdost je má síla!'
    ],
    'tomasturecekobyc': [
      'Má výška je výhoda! 📏',
      'Ta střela letěla jak raketa 🚀',
      'Přesilovky rozhodnou',
      'Super přehled na ledě',
      'Díky za prostor',
      'Jedeme naplno!',
      'Výška rozhoduje!'
    ],
    
    // Brankáři
    'vlastanistorobyc': [
      'Dneska chytám všechno! 🥅',
      'Reflexy na maximum!',
      'Díky obráncům za bloky',
      'Musíme držet nulu',
      'Ta střela byla těsně vedle',
      'Koncentrace je klíč!',
      'Nedostanou ani gól!'
    ],
    'michaelanovakovaobyc': [
      'Holky taky umí chytat! 💪👩',
      'Ta technika je důležitá',
      'Musím zlepšit výhozy',
      'Díky za podporu, kluci!',
      'Držím nám záda!',
      'Soustředění na 100%',
      'Jedeme na čisté konto!'
    ],
    'ondrahrubyobyc': [
      'Mentální síla rozhoduje! 🧠',
      '93% úspěšnost zákroků! 📊',
      'Musím držet koncentraci',
      'Ta střela byla nebezpečná',
      'Díky za defenzivu',
      'Čisté konto je cíl!',
      '5 nul za sezónu!'
    ]
  };
  
  // Obecné zprávy pro hráče bez specifických zpráv
  const genericMessages = {
    'Útočník': [
      'Dáme góly! ⚔️',
      'Útok je nejlepší obrana',
      'Musíme víc střílet',
      'Super přihrávka!',
      'Jedeme na branku!',
      'Góly rozhodují!',
      'Makáme dopředu!'
    ],
    'Obránce': [
      'Držíme obranu! 🛡️',
      'Žádný neprojde!',
      'Blokujeme všechno',
      'Obrana je základ',
      'Tvrdost rozhoduje',
      'Držíme linii!',
      'Defenziva vítězí!'
    ],
    'Brankář': [
      'Chytám všechno! 🥅',
      'Brána je můj hrad',
      'Koncentrace na max',
      'Reflexy rozhodují',
      'Nula vzadu!',
      'Nedostanou gól!',
      'Držím tým!'
    ]
  };
  
  /**
   * Získat zprávy pro konkrétního hráče
   * @param {Object} player - Objekt hráče s id, name a position
   * @returns {Array} Pole zpráv pro daného hráče
   */
  export function getPlayerMessages(player) {
    if (!player) return [];
    
    // Zkusit najít specifické zprávy pro hráče
    if (player.id && playerMessages[player.id]) {
      return playerMessages[player.id];
    }
    
    // Použít obecné zprávy podle pozice
    if (player.position && genericMessages[player.position]) {
      return genericMessages[player.position];
    }
    
    // Fallback zprávy
    return [
      'Ahoj týme! 👋',
      'Jsem připraven!',
      'Těším se na hru!',
      'Makáme společně!',
      'Super tým!',
      'Jedeme na vítězství!',
      'Díky za důvěru!'
    ];
  }
  
  /**
   * Získat úvodní zprávu pro hráče při připojení do skupiny
   * @param {Object} player - Objekt hráče
   * @returns {String} Úvodní zpráva
   */
  export function getPlayerJoinMessage(player) {
    if (!player) return 'Ahoj všichni! 👋';
    
    const joinMessages = {
      'Útočník': `Ahoj týme! ${player.name} tady, připraven dávat góly! ⚔️`,
      'Obránce': `Zdravím! ${player.name} tady, držím obranu! 🛡️`,
      'Brankář': `Čau kluci! ${player.name} v bráně, nedostanou ani gól! 🥅`
    };
    
    return joinMessages[player.position] || `Ahoj! ${player.name} se hlásí do týmu! 🏒`;
  }
  
  /**
   * Získat reakci hráče na určitou událost
   * @param {Object} player - Objekt hráče
   * @param {String} event - Typ události (goal, save, win, loss, ...)
   * @returns {String} Reakce hráče
   */
  export function getPlayerReaction(player, event) {
    const reactions = {
      goal: {
        'Útočník': ['Góóól! 🎯', 'To sedlo! 💪', 'Paráda!', 'Konečně!'],
        'Obránce': ['Super gól!', 'Pěkná střela!', 'Tak to je bomba!'],
        'Brankář': ['Hezký gól!', 'To byla pecka!', 'Super střela!']
      },
      save: {
        'Útočník': ['Dobrý zákrok!', 'Super chyceno!', 'Díky brankáři!'],
        'Obránce': ['Výborně!', 'Zachránil jsi nás!', 'Super reflex!'],
        'Brankář': ['Mám to! 💪', 'Žádný problém!', 'To bylo blízko!']
      },
      win: {
        'Útočník': ['Výhra! 🏆', 'Super zápas!', 'Tak to byla jízda!'],
        'Obránce': ['Udrželi jsme to!', 'Super obrana!', 'Výhra týmu!'],
        'Brankář': ['Čisté konto! ✨', 'Super zápas, kluci!', 'Výhra!']
      },
      loss: {
        'Útočník': ['Příště to dáme!', 'Musíme víc makat', 'Nevzdáváme se!'],
        'Obránce': ['Poučíme se z toho', 'Příště líp', 'Hlavy hore!'],
        'Brankář': ['Omlouvám se, kluci', 'Příště chytím víc', 'Makáme dál!']
      }
    };
    
    if (reactions[event] && reactions[event][player.position]) {
      const messages = reactions[event][player.position];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    return 'Jedeme dál! 💪';
  }
  
  export default {
    getPlayerMessages,
    getPlayerJoinMessage,
    getPlayerReaction
  };