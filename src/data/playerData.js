// Databáze všech hráčů HC Litvínov Lancers
export const playerData = [
  // Brankáři
  { 
    id: 'novakova-michaela',
    name: 'Michaela Nováková', 
    number: 30, 
    position: 'Brankář', 
    age: 26, 
    height: 175, 
    weight: 70, 
    nationality: '🇨🇿', 
    category: 'goalies',
    photo: null,
    joinedTeam: '2023',
    birthDate: '15.3.1999',
    birthPlace: 'Praha',
    catchingHand: 'L',
    description: 'Talentovaná brankářka, která přišla z ženské extraligy. První žena v historii KHLA. Klíčová hráčka ve vyřazovací části Českého poháru.'
  },
  { 
    id: 'nistor-vlastimil',
    name: 'Vlastimil Nistor', 
    number: 1, 
    position: 'Brankář', 
    age: 32, 
    height: 185, 
    weight: 87, 
    nationality: '🇨🇿', 
    category: 'goalies',
    photo: '/images/players/roster/nistor-vlastimil.webp',
    joinedTeam: '2020',
    birthDate: '8.11.1993',
    birthPlace: 'Litvínov',
    catchingHand: 'L',
    description: 'Zkušený brankář, dvojka za Michaelou Novákovou. Chytal výhru nad Warriors 3:1, přestřelku 7:6 s Netopýři, prohru 4:7 s Kocoury na Kladně a výhru 4:2 nad Viper Ústí.'
  },
  { 
    id: 'seidler-jakub',
    name: 'Jakub Seidler', 
    number: 35, 
    position: 'Brankář', 
    age: 28, 
    height: 189, 
    weight: 92, 
    nationality: '🇨🇿', 
    category: 'goalies',
    joinedTeam: '2022',
    birthDate: '22.5.1997',
    birthPlace: 'Most',
    catchingHand: 'R',
    description: 'Třetí brankář týmu. Talentovaný gólman s perspektivou. Reprezentoval Lancers na mezinárodním turnaji ve Straubingu 2025.'
  },
  { 
    id: 'moravek-jiri',
    name: 'Jiří Morávek', 
    number: 31, 
    position: 'Brankář', 
    age: 29, 
    height: 183, 
    weight: 85, 
    nationality: '🇨🇿', 
    category: 'goalies',
    joinedTeam: '2021',
    birthDate: '10.9.1996',
    birthPlace: 'Teplice',
    catchingHand: 'L',
    description: 'Čtvrtý brankář týmu. Spolehlivý náhradník.'
  },
  
  // Obránci
  { 
    id: 'simek-roman',
    name: 'Roman Šimek', 
    number: 27, 
    position: 'Obránce', 
    age: 32, 
    height: 183, 
    weight: 86, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2019',
    birthDate: '1.2.1993',
    birthPlace: 'Litvínov',
    shoots: 'R',
    description: 'Kapitán týmu, zkušený obránce s výbornou rozehrávkou a střelou. Zaznamenal 2+2 ve výhře 10:3 nad Sharks Ústí.'
  },
  { 
    id: 'stepanovsky-oliver',
    name: 'Oliver Štěpanovský', 
    number: 5, 
    position: 'Obránce', 
    age: 35, 
    height: 188, 
    weight: 94, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2018',
    shoots: 'L',
    description: 'Nejzkušenější obránce týmu. Tvrdý defenzivní specialista. Účastník turnaje ve Straubingu 2025.'
  },
  {
    id: 'stepanovsky-oldrich',
    name: 'Oldřich Štěpanovský',
    number: null,
    position: 'Obránce',
    age: null,
    height: null,
    weight: null,
    nationality: '🇨🇿',
    category: 'defenders',
    description: 'Obránce Litvínov Lancers. Nastoupil v přátelském utkání proti Berlín All Stars 28. srpna 2026.'
  },
  { 
    id: 'coufal-lubos',
    name: 'Luboš Coufal', 
    number: 14, 
    position: 'Obránce', 
    age: 31, 
    height: 185, 
    weight: 89, 
    nationality: '🇨🇿', 
    category: 'defenders',
    photo: '/images/players/roster/coufal-lubos.webp',
    profileMedia: [
      {
        src: '/images/players/profiles/coufal-lubos/01-pohar-v-dresu.webp',
        alt: 'Luboš Coufal v dresu klečí s mistrovským pohárem.',
        caption: 'S mistrovským pohárem v dresu Litvínov Lancers',
        featured: true
      },
      {
        src: '/images/players/profiles/coufal-lubos/02-pohar-na-lede.webp',
        alt: 'Luboš Coufal v dresu s pohárem na ledě.',
        caption: 'S pohárem přímo na ledě',
        featured: true
      },
      {
        src: '/images/players/profiles/coufal-lubos/03-vlajka-a-pohar.webp',
        alt: 'Luboš Coufal s českou vlajkou a pohárem na stadionu.',
        caption: 'S českou vlajkou a pohárem na stadionu',
        featured: true
      },
      {
        src: '/images/players/profiles/coufal-lubos/04-mistrovsky-pohar-v-satne.webp',
        alt: 'Luboš Coufal s mistrovským pohárem v šatně.',
        caption: 'S mistrovským pohárem v šatně',
        featured: true
      },
      {
        src: '/images/players/profiles/coufal-lubos/05-souboj-se-souperi.webp',
        alt: 'Luboš Coufal v souboji se dvěma protihráči.',
        caption: 'V souboji se dvěma protihráči'
      },
      {
        src: '/images/players/profiles/coufal-lubos/06-souboj-o-puk.webp',
        alt: 'Luboš Coufal bojuje o puk s protihráčem.',
        caption: 'Souboj o puk'
      },
      {
        src: '/images/players/profiles/coufal-lubos/07-pronasledovani-soupere.webp',
        alt: 'Luboš Coufal pronásleduje soupeře s pukem.',
        caption: 'Návrat do obrany'
      },
      {
        src: '/images/players/profiles/coufal-lubos/08-oslava-na-lede.webp',
        alt: 'Luboš Coufal slaví na ledě se zdviženými pažemi.',
        caption: 'Radost na ledě'
      },
      {
        src: '/images/players/profiles/coufal-lubos/09-radost-u-mantinely.webp',
        alt: 'Hráči Litvínov Lancers slaví společně u mantinelu.',
        caption: 'Společná radost u mantinelu'
      },
      {
        src: '/images/players/profiles/coufal-lubos/10-pohar-se-spoluhracem.webp',
        alt: 'Luboš Coufal se spoluhráčem drží mistrovský pohár na ledě.',
        caption: 'Mistrovský pohár se spoluhráčem'
      },
      {
        src: '/images/players/profiles/coufal-lubos/11-profilova-grafika.webp',
        alt: 'Profilová grafika Luboše Coufala v dresu Litvínov Lancers s číslem 33.',
        caption: 'Profilová grafika Litvínov Lancers'
      },
      {
        src: '/images/players/profiles/coufal-lubos/12-strela-na-branku.webp',
        alt: 'Luboš Coufal střílí na branku během utkání.',
        caption: 'Střela na branku'
      }
    ],
    joinedTeam: '2020',
    shoots: 'R',
    description: 'Zkušený obránce s výbornou přihrávkou. Zaznamenal 2 asistence ve výhře 10:3 nad Gurmány. Výjimečně hrál v útoku proti Viper Ústí. Účastník turnaje ve Straubingu 2025.'
  },
  { 
    id: 'turecek-tomas',
    name: 'Tomáš Tureček', 
    number: 22, 
    position: 'Obránce', 
    age: 28, 
    height: 182, 
    weight: 84, 
    nationality: '🇨🇿', 
    category: 'defenders',
    photo: '/images/players/roster/turecek-tomas.webp',
    joinedTeam: '2021',
    shoots: 'L',
    description: 'Univerzální obránce, který dokáže v nouzi zaskočit i v brance. Chytal ve dvou zápasech základní skupiny ČP - proti Gurmánům (výhra 10:3) a Ducks Klášterec (prohra 3:6). Účastník turnaje ve Straubingu 2025.'
  },
  { 
    id: 'belinger-jindrich',
    name: 'Jindřich Belinger', 
    number: 3, 
    position: 'Obránce', 
    age: 34, 
    height: 190, 
    weight: 95, 
    nationality: '🇨🇿', 
    category: 'defenders',
    photo: '/images/players/roster/belinger-jindrich.webp',
    joinedTeam: '2019',
    shoots: 'R',
    description: 'Starší z bratrů Belingerů, defenzivní specialista. Zaznamenal 2 asistence proti Sharks (10:3), gól + asistence proti Kocourům (4:7) a asistenci proti Viper (4:2).'
  },
  { 
    id: 'belinger-jiri',
    name: 'Jiří Belinger', 
    number: 77, 
    position: 'Obránce', 
    age: 30, 
    height: 186, 
    weight: 88, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2020',
    shoots: 'L',
    description: 'Mladší z bratrů Belingerů. Rychlý obránce s dobrou rozehrávkou. Hrál ve druhé formaci s bratrem proti Viper Ústí.'
  },
  { 
    id: 'hanus-jan',
    name: 'Jan Hanuš', 
    number: 8, 
    position: 'Obránce', 
    age: 27, 
    height: 184, 
    weight: 87, 
    nationality: '🇨🇿', 
    category: 'defenders',
    photo: '/images/players/roster/hanus-jan.webp',
    joinedTeam: '2022',
    shoots: 'R',
    description: 'Ofenzivní obránce s výbornou střelou. Ve výhře 10:3 nad Gurmány měl 1+2, proti Sharks fantastické 2+2! Někdy až moc emotivní - nesportovní chování proti Kocourům. Žije v Německu a účastnil se turnaje ve Straubingu 2025.'
  },
  { 
    id: 'schubada-pavel-st',
    name: 'Pavel Schubada St.', 
    number: 44, 
    position: 'Obránce', 
    age: 45, 
    height: 183, 
    weight: 90, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2015',
    shoots: 'L',
    description: 'Veterán týmu, otec tří synů hrajících v útoku. Legenda klubu. Ve výhře 10:3 nad Gurmány vstřelil gól - celá rodina Schubadů skórovala! Pravidelně hraje se syny.'
  },
  { 
    id: 'kores-michal',
    name: 'Michal Koreš', 
    number: 6, 
    position: 'Obránce', 
    age: 29, 
    height: 187, 
    weight: 91, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2021',
    shoots: 'R',
    description: 'Fyzicky silný obránce. Specialista na osobní souboje. Hrdina semifinále turnaje ve Straubingu 2025 - rozhodl nájezdy proti Bayern Rangers.'
  },
  { 
    id: 'kocurek-ondrej',
    legacyIds: ['kocourek-ondrej'],
    name: 'Ondřej Kocurek',
    aliases: ['Ondřej Kocourek'],
    number: 23, 
    position: 'Obránce', 
    age: 26, 
    height: 181, 
    weight: 83, 
    nationality: '🇨🇿', 
    category: 'defenders',
    joinedTeam: '2023',
    shoots: 'L',
    description: 'Nejmladší obránce v týmu. Rychlý bruslař s potenciálem.'
  },
  // Útočníci
  {
    id: 'tureckova-jana',
    name: 'Jana Turečková',
    aliases: ['Turečková'],
    number: 88,
    position: 'Útočník',
    age: null,
    height: null,
    weight: null,
    nationality: '🇨🇿',
    category: 'forwards',
    photo: null,
    description: 'Útočnice Litvínov Lancers, která nastoupila v Českém poháru v sezónách 2024/25 a 2025/26.'
  },
  { 
    id: 'materna-vasek',
    name: 'Vašek Materna', 
    number: 91, 
    position: 'Útočník', 
    age: 27, 
    height: 180, 
    weight: 82, 
    nationality: '🇨🇿', 
    category: 'forwards',
    photo: '/images/players/roster/materna-vasek.webp',
    joinedTeam: '2021',
    shoots: 'L',
    description: 'Nejlepší střelec týmu, rychlý a technický útočník. Vstřelil jediný gól ve finále ČP. Zaznamenal 2+3 v přestřelce 7:6 s Netopýři. Asistence na gól Belingera proti Kocourům.'
  },
  {
    id: 'matejovic',
    name: 'Václav Matějovič',
    aliases: ['Matějovič'],
    number: 98,
    position: 'Útočník',
    age: 28,
    height: 185,
    weight: 88,
    nationality: '🇨🇿',
    category: 'forwards',
    joinedTeam: '2006',
    shoots: 'R',
    description: 'Zkušený útočník s výbornou střelou. Hvězda semifinále ČP (2 góly) a autor hattricku v přestřelce 7:6 s Netopýři.'
  },
  {
    id: 'vapenik-jan',
    name: 'Jan Vápeník',
    aliases: ['Vápeník'],
    number: null,
    position: 'Útočník',
    age: null,
    height: null,
    weight: null,
    nationality: '🇨🇿',
    category: 'forwards',
    description: 'Útočník Litvínov Lancers. Nastoupil v přátelském utkání proti Berlín All Stars 28. srpna 2026.'
  },
  { 
    id: 'svarc-stanislav',
    name: 'Stanislav Švarc', 
    number: 46, 
    position: 'Útočník', 
    age: 38, 
    height: 183, 
    weight: 84, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2017',
    shoots: 'R',
    description: 'Zkušený centr, univerzální hráč. Produktivní střelec - 3 góly v ČP, 2 góly proti Netopýřům (7:6), 2 góly proti Sharks (10:3). Schopen hrát ve všech formacích.'
  },
  { 
    id: 'schubada-jan',
    name: 'Jan Schubada', 
    number: 25, 
    position: 'Útočník', 
    age: 24, 
    height: 179, 
    weight: 78, 
    nationality: '🇨🇿', 
    category: 'forwards',
    photo: '/images/players/roster/schubada-jan.webp',
    joinedTeam: '2019',
    shoots: 'L',
    description: 'Nejstarší ze synů Pavla Schubady St. Součást historického zápasu, kdy celá rodina skórovala proti Gurmánům. Vstřelil 2 góly proti Sharks Ústí. Pravidelně hraje s otcem a bratrem.'
  },
  { 
    id: 'schubada-pavel-ml',
    name: 'Pavel Schubada ml.', 
    number: 18, 
    position: 'Útočník', 
    age: 22, 
    height: 175, 
    weight: 76, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2021',
    shoots: 'R',
    description: 'Prostřední ze synů Pavla Schubady St. Vstřelil hattrick proti Gurmánům (10:3), gól + asistence proti Sharks (10:3) a 2 góly proti Viper Ústí (4:2).'
  },
  { 
    id: 'schubada-adam',
    name: 'Adam Schubada', 
    number: 11, 
    position: 'Útočník', 
    age: 20, 
    height: 178, 
    weight: 75, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2023',
    shoots: 'L',
    description: 'Nejmladší ze synů Pavla Schubady St., velký talent. Součást hokejové dynastie Schubadů.'
  },
  { 
    id: 'novak-pavel',
    name: 'Pavel Novák', 
    number: 9, 
    position: 'Útočník', 
    age: 30, 
    height: 182, 
    weight: 85, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2020',
    shoots: 'R',
    description: 'Produktivní útočník. Vstřelil 2 góly v kanonádě 10:3 nad Gurmány, 2 góly ve čtvrtfinále ČP a gól proti Kocourům (4:7).'
  },
  { 
    id: 'kuritka-ales',
    name: 'Aleš Kuřitka', 
    number: 24, 
    position: 'Útočník', 
    age: 33, 
    height: 179, 
    weight: 80, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2019',
    shoots: 'L',
    description: 'Pracovitý útočník třetí formace. Výborný na oslabení.'
  },
  { 
    id: 'materna-vaclav',
    name: 'Václav Materna', 
    number: 17, 
    position: 'Útočník', 
    age: 29, 
    height: 181, 
    weight: 83, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2020',
    shoots: 'R',
    description: 'Bratr Vaška Materny, silový útočník. Společně tvoří nebezpečnou bratrskou dvojici.'
  },
  { 
    id: 'salanda-jiri',
    name: 'Jiří Šalanda', 
    number: 71, 
    position: 'Útočník', 
    age: 31, 
    height: 177, 
    weight: 79, 
    nationality: '🇨🇿', 
    category: 'forwards',
    photo: '/images/players/roster/salanda-jiri.webp',
    joinedTeam: '2018',
    shoots: 'L',
    description: 'Rychlý a technický útočník. Vstřelil 2 góly ve výhře 10:3 nad Gurmány, gól proti Ducks. Asistence na první gól proti Viper Ústí. Účastník turnaje ve Straubingu 2025.'
  },
  { 
    id: 'hruby-ondrej',
    name: 'Ondřej Hrubý', 
    number: 88, 
    position: 'Útočník', 
    age: 26, 
    height: 184, 
    weight: 86, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2022',
    shoots: 'R',
    description: 'Silový útočník čtvrté formace. Bojovník do oslabení.'
  },
  { 
    id: 'toman-gustav',
    name: 'Gustav Toman', 
    number: 10, 
    position: 'Útočník', 
    age: 35, 
    height: 180, 
    weight: 82, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2017',
    shoots: 'L',
    description: 'Zkušený veterán s výbornou přehrou. Zaznamenal 2 asistence na góly Pavla Nováka ve čtvrtfinále ČP. Vstřelil první gól proti Viper Ústí (4:2).'
  },
  { 
    id: 'svarc-jan',
    name: 'Jan Švarc', 
    number: 13, 
    position: 'Útočník', 
    age: 25, 
    height: 178, 
    weight: 77, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2022',
    shoots: 'R',
    description: 'Syn Stanislava Švarce, rychlé křídlo. Pravidelně hraje v první formaci s otcem.'
  },
  { 
    id: 'cerny-ladislav',
    name: 'Ladislav Černý', 
    number: 7, 
    position: 'Útočník', 
    age: 32, 
    height: 182, 
    weight: 84, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2019',
    shoots: 'L',
    description: 'Univerzální útočník, může hrát všechny pozice v útoku. Bojovník, někdy až moc - 2 vyloučení v přestřelce s Netopýři.'
  },
  { 
    id: 'dlugopolsky-marian',
    name: 'Marian Dlugopolský', 
    number: 69, 
    position: 'Útočník', 
    age: 28, 
    height: 185, 
    weight: 88, 
    nationality: '🇸🇰', 
    category: 'forwards',
    photo: '/images/players/roster/dlugopolsky-marian.webp',
    joinedTeam: '2021',
    shoots: 'R',
    description: 'Slovenský útočník s výbornou střelou. Vstřelil důležitý gól na 9:3 proti Sharks Ústí. Univerzální hráč schopný hrát ve všech formacích.'
  },
  { 
    id: 'matuska-jiri',
    name: 'Jiří Matuška', 
    number: 21, 
    position: 'Útočník', 
    age: 34, 
    height: 180, 
    weight: 81, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2018',
    shoots: 'L',
    description: 'Starší z bratrů Matuškových. Zkušený útočník s dobrou střelou. Účastník turnaje ve Straubingu 2025.'
  },
  { 
    id: 'matuska-lukas',
    name: 'Lukáš Matuška', 
    number: 16, 
    position: 'Útočník', 
    age: 23, 
    height: 176, 
    weight: 75, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2023',
    shoots: 'R',
    description: 'Mladší z bratrů Matuškových, technický hráč. Vstřelil svůj první gól sezóny v prohře 4:7 s Kocoury na Kladně. Účastník turnaje ve Straubingu 2025.'
  },
  { 
    id: 'benes-roman',
    name: 'Roman Beneš', 
    number: 15, 
    position: 'Útočník', 
    age: 30, 
    height: 183, 
    weight: 85, 
    nationality: '🇨🇿', 
    category: 'forwards',
    joinedTeam: '2020',
    shoots: 'L',
    description: 'Spolehlivý útočník třetí formace. Důležitý článek týmu při oslabení.'
  },
  
  // Hostující hráči (guest players)
  { 
    id: 'kacenak-dan',
    name: 'Dan Kačeňák', 
    number: 88, 
    position: 'Útočník', 
    age: 29, 
    height: 182, 
    weight: 85, 
    nationality: '🇨🇿', 
    category: 'guests',
    team: 'Gurmáni',
    joinedTeam: '2025 (host)',
    shoots: 'L',
    description: 'Hostující hráč z týmu Gurmáni. Pomohl Lancers na mezinárodním turnaji ve Straubingu 2025, kde tým obsadil 6. místo. Výborný technický hráč s přehledem.'
  },
  { 
    id: 'zmeskal-lukas',
    name: 'Lukáš Zmeškal', 
    number: 19, 
    position: 'Útočník', 
    age: 27, 
    height: 178, 
    weight: 80, 
    nationality: '🇨🇿', 
    category: 'guests',
    team: 'Gurmáni',
    joinedTeam: '2025 (host)',
    shoots: 'R',
    description: 'Hostující hráč z týmu Gurmáni. Společně s Danem Kačeňákem reprezentoval Lancers na turnaji ve Straubingu 2025. Rychlý bruslař s výbornou střelou.'
  },
  { 
    id: 'josef-kamarad',
    name: 'Josef "Pepa"', 
    number: 12, 
    position: 'Útočník', 
    age: 26, 
    height: 180, 
    weight: 82, 
    nationality: '🇨🇿', 
    category: 'guests',
    team: 'Nezávislý',
    joinedTeam: '2025 (host)',
    shoots: 'L',
    description: 'Kamarád Jakuba Seidlera, který pomohl týmu na turnaji ve Straubingu 2025. Technický hráč s dobrým zakončením.'
  }
];

// Funkce pro získání hráče podle ID
export const getPlayerById = (id) => {
  return playerData.find(player => player.id === id || player.legacyIds?.includes(id));
};

// Funkce pro získání hráče podle jména
export const getPlayerByName = (name) => {
  return playerData.find(player => player.name === name || player.aliases?.includes(name));
};

// Funkce pro získání hráčů podle kategorie
export const getPlayersByCategory = (category) => {
  return playerData.filter(player => player.category === category);
};

// Funkce pro získání všech hráčů
export const getAllPlayers = () => {
  return playerData;
};

// Funkce pro získání hráčů zmíněných v článku
export const getPlayersInArticle = (articleContent) => {
  const mentionedPlayers = [];
  const surnameCounts = playerData.reduce((counts, player) => {
    const surname = player.name.split(' ').pop().toLowerCase();
    counts.set(surname, (counts.get(surname) || 0) + 1);
    return counts;
  }, new Map());
  
  playerData.forEach(player => {
    // Hledáme různé varianty jména hráče v textu
    const surname = player.name.split(' ').pop();
    const names = [
      player.name,
      ...(player.aliases || []),
      player.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    ];

    if (surnameCounts.get(surname.toLowerCase()) === 1) {
      names.push(surname);
    }
    
    for (const name of names) {
      if (articleContent.includes(name)) {
        mentionedPlayers.push(player);
        break;
      }
    }
  });
  
  return mentionedPlayers;
};
