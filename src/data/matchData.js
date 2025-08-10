// Databáze všech zápasů HC Litvínov Lancers
export const matchData = [
    {
        id: 'finale-cp-2025',
        title: 'Finále Českého poháru - těsná prohra',
        date: '27.4.2025',
        time: '18:30',
        location: 'Beroun',
        category: 'Finále ČP',
        image: '🏆',
        excerpt: 'Dramatické finále Českého poháru. Litvínov bojoval až do konce, jediný gól vstřelil Materna.',
        homeTeam: 'Netopýři',
        awayTeam: 'Litvínov Lancers',
        score: '2:1',
        periods: '(1:0 1:0 0:1)',
        saves: { home: 13, away: 7 },
        homeLineup: {
          goalie: 'Milan',
          line1: ['Bean', 'Vláďa', 'MCJ', 'Pajda', 'Roman.V'],
          line2: ['Honza B.', 'Bradley', 'Lukáš', 'Dj.Crow', 'Pavel'],
          line3: ['Papuánec', 'Jarda', 'HoKe']
        },
        awayLineup: {
          goalie: 'Michaela Nováková',
          line1: ['Stanislav Švarc', 'Jan Švarc', 'Vašek Materna', 'Jindřich Belinger', 'Roman Šimek'],
          line2: ['Luboš Coufal', 'Jiří Šalanda', 'Jan Schubada', 'Matějovič', 'Tomáš Tureček'],
          line3: ['Marian Dlugopolský', 'Gustav Toman']
        },
        goals: [
          { time: '04:22', team: 'home', scorer: 'Bradley', assists: '(Pajda)', score: '1:0' },
          { time: '10:15', team: 'home', scorer: 'Honza B.', assists: '(Roman.V, Pajda)', score: '2:0' },
          { time: '26:06', team: 'away', scorer: 'Vašek Materna', assists: '(Roman Šimek, Matějovič)', score: '2:1' }
        ],
        penalties: [
          { time: '03:44', team: 'home', player: 'Lukáš', reason: 'hákování', duration: '2 min' },
          { time: '07:28', team: 'away', player: 'Luboš Coufal', reason: 'držení', duration: '2 min' },
          { time: '12:04', team: 'away', player: 'Stanislav Švarc', reason: 'držení', duration: '2 min' },
          { time: '14:53', team: 'home', player: 'Lukáš', reason: 'nedovolené bránění', duration: '2 min' },
          { time: '15:02', team: 'away', player: 'Jindřich Belinger', reason: 'podražení', duration: '2 min' },
          { time: '25:33', team: 'home', player: 'Vláďa', reason: 'hra loktem', duration: '2 min' }
        ],
        summary: 'Litvínov Lancers předvedli bojovný výkon ve finále Českého poháru. I přes prohru 0:2 po dvou třetinách se nevzdali a Vašek Materna snížil na konečných 2:1. Brankářka Michaela Nováková předvedla několik skvělých zákroků, ale na více to nestačilo.'
      },
  
    {
        id: 'semifinale-cp-2025',
        title: 'Postup do finále Českého poháru!',
        date: '27.4.2025',
        time: '15:00',
        location: 'Beroun',
        category: 'Semifinále ČP',
        image: '🏆',
        excerpt: 'Lancers si vybojovali postup do finále! Matějovič vstřelil dva góly, Nováková předvedla 13 zákroků.',
        homeTeam: 'Kocouři Beroun',
        awayTeam: 'Litvínov Lancers',
        score: '1:3',
        periods: '(0:2 1:1 0:0)',
        saves: { home: 4, away: 13 },
        homeLineup: {
          goalie: 'Rybíz Ružanský',
          line1: ['Kolmann', 'Martin', 'Tláskal', 'Kastner', 'Ihýk'],
          line2: ['Tobi', 'Olšiak', 'Lucky', 'Ďuri', 'Resl'],
          line3: ['Jirka', 'Šabaka', 'Rus', 'Ejsy', 'Paolo']
        },
        awayLineup: {
          goalie: 'Michaela Nováková',
          line1: ['Stanislav Švarc', 'Jan Švarc', 'Vašek Materna', 'Matějovič', 'Roman Šimek'],
          line2: ['Jan Schubada', 'Jiří Šalanda', 'Luboš Coufal', 'Tomáš Tureček', 'Jindřich Belinger'],
          line3: ['Marian Dlugopolský', 'Gustav Toman']
        },
        goals: [
          { time: '00:34', team: 'away', scorer: 'Matějovič', assists: '', score: '0:1' },
          { time: '05:22', team: 'away', scorer: 'Stanislav Švarc', assists: '(Luboš Coufal)', score: '0:2' },
          { time: '13:56', team: 'away', scorer: 'Matějovič', assists: '', score: '0:3' },
          { time: '18:13', team: 'home', scorer: 'Olšiak', assists: '', score: '1:3' }
        ],
        penalties: [
          { time: '07:34', team: 'home', player: 'Ejsy', reason: 'hákování', duration: '2 min' },
          { time: '12:44', team: 'home', player: 'Lucky', reason: 'hákování', duration: '2 min' },
          { time: '12:50', team: 'home', player: 'Kastner', reason: 'zdržování hry', duration: '2 min' }
        ],
        summary: 'Fantastický výkon Lancers v semifinále Českého poháru! Matějovič byl hvězdou zápasu se dvěma góly, oba vstřelil bez asistence. Michaela Nováková v brance předvedla skvělý výkon s 13 zákroky. Tým ukázal skvělou disciplínu - žádné vyloučení. První třetina byla klíčová, Lancers vedli 2:0 a kontrolovali hru až do konce.'
      },
  
    {
        id: 'ctvrtfinale-cp-2025',
        title: 'Jasná výhra ve čtvrtfinále Českého poháru',
        date: '27.4.2025',
        time: '09:10',
        location: 'Beroun',
        category: 'Čtvrtfinále ČP',
        image: '🏆',
        excerpt: 'Lancers jasně postoupili do semifinále! Pavel Novák a Stanislav Švarc vstřelili po dvou gólech.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Gurmáni Žatec',
        score: '4:1',
        periods: '(1:0 3:0 0:1)',
        homeLineup: {
          goalie: 'Michaela Nováková',
          line1: ['Stanislav Švarc', 'Jan Švarc', 'Vašek Materna', 'Tomáš Tureček', 'Matějovič'],
          line2: ['Luboš Coufal', 'Jiří Šalanda', 'Jan Schubada', 'Roman Šimek', 'Jindřich Belinger'],
          line3: ['Marian Dlugopolský', 'Gustav Toman', 'Pavel Novák']
        },
        awayLineup: {
          goalie: 'Malý',
          line1: ['Oberreiter', 'Broum', 'Vostřel', 'Nový', 'Zmeškal'],
          line2: ['Čatai', 'Hanzlík', 'Kačenák', 'Kořán', 'Chot V.'],
          line3: ['Chot D.']
        },
        goals: [
          { time: '03:23', team: 'home', scorer: 'Stanislav Švarc', assists: '(Jindřich Belinger)', score: '1:0' },
          { time: '10:48', team: 'home', scorer: 'Pavel Novák', assists: '(Gustav Toman)', score: '2:0' },
          { time: '14:03', team: 'home', scorer: 'Pavel Novák', assists: '(Gustav Toman)', score: '3:0' },
          { time: '15:33', team: 'home', scorer: 'Stanislav Švarc', assists: '', score: '4:0' },
          { time: '20:52', team: 'away', scorer: 'Chot V.', assists: '', score: '4:1' }
        ],
        penalties: [
          { time: '02:06', team: 'away', player: 'Kořán', reason: 'mnoho hráčů na ledě', duration: '2 min' },
          { time: '28:49', team: 'away', player: 'Kořán', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Dominantní výkon Lancers ve čtvrtfinále! Pavel Novák vstřelil dva góly během čtyř minut ve druhé třetině, oba s asistencí Gustava Tomana. Stanislav Švarc přidal také dva góly. Tým předvedl excelentní disciplínu bez jediného vyloučení. Michaela Nováková udržela čisté konto až do 21. minuty.'
      },
  
    {
        id: 'liga-viper-2025-03',
        title: 'Dominance Lancers v Ústí nad Labem!',
        date: '29.3.2025',
        time: '19:15',
        location: 'Ústí nad Labem',
        category: 'Skupina ČP',
        image: '🐍',
        excerpt: 'Výhra 6:2! Druhá třetina 4:0 rozhodla. Dvojice Schubada st. a Černý po dvou gólech.',
        homeTeam: 'Viper Ústí',
        awayTeam: 'Litvínov Lancers',
        score: '2:6',
        periods: '(0:0 0:4 2:2)',
        saves: { home: 40, away: 44 },
        homeLineup: {
          goalie: 'Homolka',
          line1: ['Jikra', 'Hrůša', 'Čejka', 'Brůha', 'Kadleček'],
          line2: ['Roman', 'Hanzlíček', 'Bulín', 'Trnka', 'Slavík'],
          line3: ['John', 'Mušák', 'Nady', 'Dudley', 'P.Petr']
        },
        awayLineup: {
          goalie: 'Tomáš Tureček',  // Obránce opět v brance!
          line1: ['Jan Schubada', 'Pavel Schubada ml.', 'Adam Schubada', 'Pavel Schubada St.', 'Jan Hanuš'],
          line2: ['Stanislav Švarc', 'Gustav Toman', 'Ladislav Černý', 'Luboš Coufal', 'Jiří Šalanda']
        },
        goals: [
          { time: '17:39', team: 'away', scorer: 'Pavel Schubada St.', assists: '(Pavel Schubada ml.)', score: '0:1' },
          { time: '22:42', team: 'away', scorer: 'Jan Hanuš', assists: '(Jiří Šalanda)', score: '0:2' },
          { time: '27:57', team: 'away', scorer: 'Ladislav Černý', assists: '(Gustav Toman)', score: '0:3' },
          { time: '29:40', team: 'away', scorer: 'Pavel Schubada St.', assists: '(Pavel Schubada ml., Ladislav Černý)', score: '0:4' },
          { time: '31:04', team: 'away', scorer: 'Jan Schubada', assists: '(Pavel Schubada ml., Jan Hanuš)', score: '0:5' },
          { time: '34:39', team: 'home', scorer: 'John', assists: '(Trnka)', score: '1:5' },
          { time: '36:37', team: 'away', scorer: 'Ladislav Černý', assists: '(Stanislav Švarc)', score: '1:6' },
          { time: '44:03', team: 'home', scorer: 'Jikra', assists: '(Štefánik)', score: '2:6' }
        ],
        penalties: [
          { time: '06:38', team: 'home', player: 'Mušák', reason: 'sekání', duration: '2 min' },
          { time: '39:26', team: 'home', player: 'Jikra', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Další skvělý výkon rodiny Schubadů! Pavel st. vstřelil 2 góly, Pavel ml. zaznamenal 3 asistence. Ladislav Černý také přidal 2 góly. Lancers ovládli druhou třetinu, kdy vstřelili 4 góly a neinkasovali. Tomáš Tureček opět musel chytat místo brankáře a předvedl 44 zákroků!'
      },
  
    {
        id: 'liga-netopyri-2025-03',
        title: 'Výhra v Černošicích v přestřelce!',
        date: '22.3.2025',
        time: '21:15',
        location: 'Černošice',
        category: 'Skupina ČP',
        image: '🦇',
        excerpt: 'Těsná výhra 5:4! Materna vstřelil 2 góly, Turečková debutovala gólem.',
        homeTeam: 'Netopýři',
        awayTeam: 'Litvínov Lancers',
        score: '4:5',
        periods: '(1:2 2:1 1:2)',
        homeLineup: {
          goalie: 'Honza P.',
          line1: ['Honza B.', 'Ondra', 'MCJ', 'Bradley', 'Vláďa'],
          line2: ['Papuánec', 'Steve', 'HoKe', 'Pavel', 'Vašek'],
          line3: ['Bean']
        },
        awayLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Stanislav Švarc', 'Jiří Šalanda', 'Vašek Materna', 'Matějovič', 'Jindřich Belinger'],
          line2: ['Marian Dlugopolský', 'Gustav Toman', 'Turečková', 'Luboš Coufal', 'Tomáš Tureček']
        },
        goals: [
          { time: '01:11', team: 'away', scorer: 'Turečková', assists: '(Matějovič)', score: '0:1' },
          { time: '09:24', team: 'home', scorer: 'Vláďa', assists: '(Ondra, Bean)', score: '1:1' },
          { time: '10:09', team: 'away', scorer: 'Vašek Materna', assists: '(Jiří Šalanda)', score: '1:2' },
          { time: '21:16', team: 'away', scorer: 'Jindřich Belinger', assists: '', score: '1:3' },
          { time: '21:45', team: 'home', scorer: 'Vašek', assists: '(Vláďa, Honza B.)', score: '2:3' },
          { time: '22:25', team: 'home', scorer: 'Ondra', assists: '(MCJ, Vláďa)', score: '3:3' },
          { time: '34:02', team: 'away', scorer: 'Matějovič', assists: '(Stanislav Švarc)', score: '3:4' },
          { time: '38:08', team: 'away', scorer: 'Vašek Materna', assists: '(Tomáš Tureček)', score: '3:5' },
          { time: '40:35', team: 'home', scorer: 'Honza B.', assists: '(Vašek)', score: '4:5' }
        ],
        penalties: [
          { time: '20:41', team: 'away', player: 'Gustav Toman', reason: 'hákování', duration: '2 min' }
        ],
        summary: 'Napínavý zápas v Černošicích! Turečková (jediná žena v zápase?) vstřelila svůj první gól hned v první minutě. Vašek Materna byl hvězdou s 2 góly. Netopýři dokázali vyrovnat na 3:3, ale Lancers v poslední třetině rozhodli dvěma góly. Dramatický závěr!'
      },
  
    {
        id: 'liga-gurmani-2025-01',
        title: 'Dominance rodiny Schubadů v Chomutově!',
        date: '26.1.2025',
        time: '17:00',
        location: 'Chomutov',
        category: 'Skupina ČP',
        image: '🎯',
        excerpt: 'Výhra 6:2! Pavel ml. hattrick, celá rodina Schubadů opět na ledě.',
        homeTeam: 'Gurmáni Žatec',
        awayTeam: 'Litvínov Lancers',
        score: '2:6',
        periods: '(2:2 0:2 0:2)',
        homeLineup: {
          goalie: 'Beran',
          line1: ['Brunclík', 'Broum', 'Vostřel', 'Pokorný', 'Provazník'],
          line2: ['Oberreiter', 'Hanzlík', 'Kačenák', 'Chot V.', 'Kořán'],
          line3: ['Kuvík', 'Čatai']
        },
        awayLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Jan Schubada', 'Adam Schubada', 'Pavel Schubada ml.', 'Pavel Schubada St.', 'Jan Hanuš'],
          line2: ['Gustav Toman', 'Marian Dlugopolský', 'Pavel Novák', 'Luboš Coufal', 'Jindřich Belinger']
        },
        goals: [
          { time: '02:55', team: 'home', scorer: 'Broum', assists: '(Vostřel)', score: '1:0' },
          { time: '10:09', team: 'away', scorer: 'Pavel Schubada ml.', assists: '(Jan Hanuš)', score: '1:1' },
          { time: '14:40', team: 'away', scorer: 'Pavel Schubada ml.', assists: '(Jindřich Belinger)', score: '1:2' },
          { time: '14:57', team: 'home', scorer: 'Brunclík', assists: '(Pokorný)', score: '2:2' },
          { time: '17:57', team: 'away', scorer: 'Jan Schubada', assists: '(Jindřich Belinger)', score: '2:3' },
          { time: '23:32', team: 'away', scorer: 'Pavel Schubada ml.', assists: '(Jindřich Belinger, Jan Schubada)', score: '2:4' },
          { time: '35:31', team: 'away', scorer: 'Jan Schubada', assists: '(Adam Schubada)', score: '2:5' },
          { time: '37:25', team: 'away', scorer: 'Jan Hanuš', assists: '(Jan Schubada)', score: '2:6' }
        ],
        penalties: [
          { time: '09:45', team: 'home', player: 'Chot V.', reason: 'podražení', duration: '2 min' },
          { time: '11:49', team: 'home', player: 'Pokorný', reason: 'hrubost', duration: '2 min' },
          { time: '11:49', team: 'away', player: 'Jan Schubada', reason: 'hrubost', duration: '2 min' },
          { time: '20:36', team: 'home', player: 'Oberreiter', reason: 'podražení', duration: '2 min' },
          { time: '40:28', team: 'away', player: 'Luboš Coufal', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Historický zápas rodiny Schubadů! Kompletní rodina (otec Pavel St. a tři synové - Jan, Adam a Pavel ml.) nastoupila v první formaci. Pavel ml. vstřelil hattrick, Jan přidal 2 góly a 2 asistence. Jindřich Belinger zaznamenal 3 asistence. Lancers ovládli druhou a třetí třetinu, kdy neinkasovali ani gól a vstřelili 4 branky.'
      },
  
    {
        id: 'liga-sharks-2025-01',
        title: 'Kanonáda proti Sharks! Historická výhra 13:4',
        date: '19.1.2025',
        time: '15:00',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🦈',
        excerpt: 'Neuvěřitelná demolice 13:4! Pavel ml. vstřelil 4 góly, Jan Schubada 3 góly.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Sharks Ústí',
        score: '13:4',
        periods: '(5:1 4:0 4:3)',
        homeLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Jiří Šalanda', 'Pavel Schubada ml.', 'Jan Schubada', 'Jan Hanuš', 'Pavel Schubada St.'],
          line2: ['Marian Dlugopolský', 'Pavel Novák', 'Jindřich Belinger', 'Jiří Belinger', 'Luboš Coufal']
        },
        awayLineup: {
          goalie: 'Machutka',
          line1: ['Judl', 'Vacek', 'Kočí', 'Chot', 'Krajník'],
          line2: ['Linhart', 'Šanda', 'Kroupa', 'Brenner', 'Brenner'],
          line3: ['Rilke', 'Schuster', 'Zeman', 'Svoboda', 'Novák']
        },
        goals: [
          { time: '03:37', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Jan Hanuš)', score: '1:0' },
          { time: '07:29', team: 'home', scorer: 'Pavel Schubada St.', assists: '(Jindřich Belinger)', score: '2:0' },
          { time: '08:53', team: 'away', scorer: 'Krajník', assists: '(Šanda)', score: '2:1' },
          { time: '09:47', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Pavel Schubada St.)', score: '3:1' },
          { time: '13:14', team: 'home', scorer: 'Jiří Šalanda', assists: '(Jan Hanuš)', score: '4:1' },
          { time: '13:50', team: 'home', scorer: 'Jan Schubada', assists: '(Pavel Schubada ml.)', score: '5:1' },
          { time: '17:10', team: 'home', scorer: 'Pavel Novák', assists: '', score: '6:1' },
          { time: '20:10', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Jan Hanuš)', score: '7:1' },
          { time: '23:26', team: 'home', scorer: 'Jan Schubada', assists: '(Jiří Šalanda)', score: '8:1' },
          { time: '26:06', team: 'home', scorer: 'Pavel Novák', assists: '(Marian Dlugopolský)', score: '9:1' },
          { time: '32:52', team: 'home', scorer: 'Jiří Šalanda', assists: '(Jan Schubada)', score: '10:1' },
          { time: '35:25', team: 'home', scorer: 'Jindřich Belinger', assists: '', score: '11:1' },
          { time: '35:30', team: 'away', scorer: 'Kroupa', assists: '', score: '11:2' },
          { time: '37:01', team: 'home', scorer: 'Pavel Schubada St.', assists: '', score: '12:2' },
          { time: '38:57', team: 'away', scorer: 'Kroupa', assists: '', score: '12:3' },
          { time: '39:34', team: 'away', scorer: 'Kočí', assists: '(Šanda)', score: '12:4' },
          { time: '44:25', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Jan Schubada)', score: '13:4' }
        ],
        penalties: [
          { time: '08:20', team: 'home', player: 'Pavel Novák', reason: 'podražení', duration: '2 min' },
          { time: '08:49', team: 'home', player: 'Jindřich Belinger', reason: 'krosček', duration: '2 min' },
          { time: '23:56', team: 'away', player: 'Linhart', reason: 'hákování', duration: '2 min' },
          { time: '29:04', team: 'home', player: 'Jiří Belinger', reason: 'mnoho hráčů na ledě', duration: '2 min' },
          { time: '35:53', team: 'home', player: 'Luboš Coufal', reason: 'zdržování hry', duration: '2 min' }
        ],
        summary: 'Historická výhra Lancers! Pavel Schubada ml. vstřelil neuvěřitelné 4 góly, Jan Schubada přidal hattrick. Rodina Schubadů opět dominovala - otec Pavel st. vstřelil 2 góly. Dvojice Pavel Novák a Jiří Šalanda také vstřelili po 2 gólech. Druhá třetina byla drtivá 4:0. Nejvyšší výhra sezóny!'
      },
  
    {
        id: 'liga-ducks-2025-01',
        title: 'Přestřelka v Kadani - Matějovič hattrick nestačil',
        date: '18.1.2025',
        time: '12:00',
        location: 'Kadaň',
        category: 'Skupina ČP',
        image: '🦆',
        excerpt: 'Divoká přestřelka skončila prohrou 5:7. Matějovič vstřelil hattrick, Uhlajz za Ducks také.',
        homeTeam: 'Ducks Klášterec',
        awayTeam: 'Litvínov Lancers',
        score: '7:5',
        periods: '(2:2 2:2 3:1)',
        homeLineup: {
          goalie: 'Pody',
          line1: ['Domes', 'Trnkič', 'Charvi', 'Tommy', 'Skipper'],
          line2: ['Moučka', 'Uhlajz', 'Komár', 'Vébéčko', 'Veslo']
        },
        awayLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Jindřich Belinger', 'Jiří Šalanda', 'Marian Dlugopolský', 'Tomáš Tureček', 'Jan Hanuš'],
          line2: ['Pavel Novák', 'Matějovič', 'Gustav Toman', 'Luboš Coufal', 'Jiří Belinger'],
          line3: ['Lukáš Matuška']
        },
        goals: [
          { time: '04:23', team: 'home', scorer: 'Charvi', assists: '(Trnkič, Domes)', score: '1:0' },
          { time: '08:19', team: 'away', scorer: 'Matějovič', assists: '(Lukáš Matuška)', score: '1:1' },
          { time: '11:00', team: 'away', scorer: 'Luboš Coufal', assists: '', score: '1:2' },
          { time: '13:50', team: 'home', scorer: 'Uhlajz', assists: '', score: '2:2' },
          { time: '17:03', team: 'away', scorer: 'Matějovič', assists: '(Luboš Coufal)', score: '2:3' },
          { time: '22:17', team: 'away', scorer: 'Matějovič', assists: '', score: '2:4' },
          { time: '27:25', team: 'home', scorer: 'Komár', assists: '(Uhlajz)', score: '3:4' },
          { time: '29:06', team: 'home', scorer: 'Uhlajz', assists: '(Tommy)', score: '4:4' },
          { time: '31:07', team: 'away', scorer: 'Pavel Novák', assists: '(Matějovič, Jan Hanuš)', score: '4:5' },
          { time: '34:06', team: 'home', scorer: 'Moučka', assists: '(Skipper)', score: '5:5' },
          { time: '34:56', team: 'home', scorer: 'Trnkič', assists: '(Domes, Tommy)', score: '6:5' },
          { time: '41:18', team: 'home', scorer: 'Uhlajz', assists: '', score: '7:5' }
        ],
        penalties: [
          { time: '16:20', team: 'away', player: 'Lukáš Matuška', reason: 'krosček', duration: '2 min' },
          { time: '23:32', team: 'home', player: 'Komár', reason: 'vrážení na hrazení', duration: '2 min' },
          { time: '38:55', team: 'home', player: 'Uhlajz', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Neuvěřitelná přestřelka v Kadani! Matějovič vstřelil hattrick pro Lancers, ale nestačilo to. Uhlajz z Ducks také zaznamenal hattrick. Hra byla vyrovnaná až do třetí třetiny, kdy Ducks přidali dva góly během minuty (34:06 a 34:56) a otočili skóre z 4:5 na 6:5. Lancers vedli ještě v 31. minutě 5:4, ale závěr patřil domácím. Luboš Coufal zaznamenal gól a asistenci.'
      },
  
    {
        id: 'liga-kocouri-2025-01',
        title: 'Výhra po samostatných nájezdech!',
        date: '11.1.2025',
        time: '12:00',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🐱',
        excerpt: 'Dramatická výhra 4:3 po nájezdech! Pavel ml. vstřelil 2 góly včetně rozhodujícího.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Kocouři Beroun',
        score: '4:3 sn',
        periods: '(1:0 1:3 1:0)',
        homeLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Pavel Schubada ml.', 'Jan Schubada', 'Jindřich Belinger', 'Pavel Schubada St.', 'Tomáš Tureček'],
          line2: ['Stanislav Švarc', 'Gustav Toman', 'Ladislav Černý', 'Luboš Coufal', 'Jiří Belinger']
        },
        awayLineup: {
          goalie: 'Rybíz',
          line1: ['Kareš', 'Martin', 'Lucky', 'Ejsy', 'Paolo'],
          line2: ['Sofy', 'Šabaka', 'Rus', 'Ihýk', 'Žíro']
        },
        goals: [
          { time: '09:00', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Jindřich Belinger)', score: '1:0' },
          { time: '18:00', team: 'away', scorer: 'Kareš', assists: '(Martin)', score: '1:1' },
          { time: '21:00', team: 'away', scorer: 'Sofy', assists: '(Rus)', score: '1:2' },
          { time: '24:00', team: 'away', scorer: 'Ihýk', assists: '(Lucky)', score: '1:3' },
          { time: '28:00', team: 'home', scorer: 'Pavel Schubada ml.', assists: '', score: '2:3' },
          { time: '42:00', team: 'home', scorer: 'Jan Schubada', assists: '(Pavel Schubada ml.)', score: '3:3' },
          { time: 'SN', team: 'home', scorer: 'Pavel Schubada ml.', assists: '', score: '4:3' }
        ],
        penalties: [
          { time: '04:00', team: 'home', player: 'Luboš Coufal', reason: 'zdržování hry', duration: '2 min' },
          { time: '07:00', team: 'away', player: 'Paolo', reason: 'podražení', duration: '2 min' },
          { time: '14:00', team: 'away', player: 'Paolo', reason: 'podražení', duration: '2 min' },
          { time: '16:00', team: 'away', player: 'Martin', reason: 'mnoho hráčů na ledě', duration: '2 min' },
          { time: '19:00', team: 'home', player: 'Jindřich Belinger', reason: 'hákování', duration: '2 min' },
          { time: '23:00', team: 'home', player: 'Gustav Toman', reason: 'sekání', duration: '2 min' },
          { time: '30:00', team: 'away', player: 'Sofy', reason: 'podražení', duration: '2 min' },
          { time: '41:00', team: 'away', player: 'Rus', reason: 'nedovolené bránění', duration: '2 min' }
        ],
        summary: 'Dramatický zápas rozhodnutý až v samostatných nájezdech! Kocouři otočili z 0:1 na 3:1 ve druhé třetině, ale Lancers dokázali vyrovnat. Pavel Schubada ml. byl hrdinou - vstřelil 2 góly v základní hrací době a rozhodující nájezd. Jan Schubada vyrovnal na 3:3 ve třetí třetině. Hodně vyloučení na obou stranách (8 celkem).'
      },
  
    {
        id: 'liga-netopyri-2024',
        title: 'Divoká přestřelka s Netopýři!',
        date: '14.12.2024',
        time: '13:45',
        location: 'Litvínov',
        category: 'Skupina ČP',
        image: '🦇',
        excerpt: 'Neuvěřitelná přestřelka 7:6! Matějovič hattrick, Materna 2+3, dramatický závěr.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Netopýři',
        score: '7:6',
        periods: '(3:2 2:1 2:3)',
        homeLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Matějovič', 'Vašek Materna', 'Stanislav Švarc', 'Jindřich Belinger', 'Jiří Belinger'],
          line2: ['Ladislav Černý', 'Jiří Šalanda', 'Gustav Toman', 'Jan Hanuš', 'Luboš Coufal']
        },
        awayLineup: {
          goalie: 'Milan',
          line1: ['Bean', 'Cube', 'Papuánec', 'Pajda', 'Vláďa'],
          line2: ['HoKe', 'Honza B.', 'HoKe ml.', 'Filip', 'Dj.Crow'],
          line3: ['Jarda', 'Lukáš']
        },
        goals: [
          { time: '01:00', team: 'home', scorer: 'Vašek Materna', assists: '(Matějovič)', score: '1:0' },
          { time: '05:30', team: 'home', scorer: 'Matějovič', assists: '', score: '2:0' },
          { time: '06:00', team: 'home', scorer: 'Vašek Materna', assists: '(Stanislav Švarc)', score: '3:0' },
          { time: '09:00', team: 'away', scorer: 'Vláďa', assists: '(Pajda)', score: '3:1' },
          { time: '13:00', team: 'away', scorer: 'HoKe', assists: '(Vláďa)', score: '3:2' },
          { time: '24:00', team: 'home', scorer: 'Stanislav Švarc', assists: '(Vašek Materna)', score: '4:2' },
          { time: '27:00', team: 'away', scorer: 'Honza B.', assists: '(Vláďa)', score: '4:3' },
          { time: '30:00', team: 'home', scorer: 'Matějovič', assists: '(Vašek Materna)', score: '5:3' },
          { time: '40:00', team: 'home', scorer: 'Stanislav Švarc', assists: '(Vašek Materna)', score: '6:3' },
          { time: '42:00', team: 'home', scorer: 'Matějovič', assists: '(Vašek Materna)', score: '7:3' },
          { time: '43:40', team: 'away', scorer: 'Cube', assists: '(Vláďa)', score: '7:4' },
          { time: '44:07', team: 'away', scorer: 'Pajda', assists: '(Vláďa, Cube)', score: '7:5' },
          { time: '45:00', team: 'away', scorer: 'Lukáš', assists: '(Pajda)', score: '7:6' }
        ],
        penalties: [
          { time: '11:00', team: 'home', player: 'Ladislav Černý', reason: 'podražení', duration: '2 min' },
          { time: '13:30', team: 'away', player: 'Milan', reason: 'držení', duration: '2 min' },
          { time: '17:00', team: 'home', player: 'Ladislav Černý', reason: 'bránění ve hře', duration: '2 min' },
          { time: '39:00', team: 'away', player: 'HoKe', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Neuvěřitelná přestřelka! Matějovič vstřelil hattrick, Vašek Materna přidal 2 góly a 3 asistence. Lancers vedli 7:3, ale Netopýři v závěru stihli snížit na konečných 7:6. Bratři Belingerové společně v první formaci, celkem padlo 13 gólů!'
      },
  
    {
        id: 'liga-kocouri-2024',
        title: 'Debakl na Kladně',
        date: '9.11.2024',
        time: '19:00',
        location: 'Kladno',
        category: 'Skupina ČP',
        image: '🐱',
        excerpt: 'Katastrofální první třetina 0:5 rozhodla. Lancers prohráli 4:7 na Kladně.',
        homeTeam: 'Kocouři Beroun',
        awayTeam: 'Litvínov Lancers',
        score: '7:4',
        periods: '(5:0 0:1 2:3)',
        homeLineup: {
          goalie: 'Kobík',
          line1: ['Tláskal', 'Martin', 'Lucky', 'Ihýk', 'Ejsy'],
          line2: ['Ďuri', 'Šabaka', 'Kolmann', 'Kastner', 'Resl']
        },
        awayLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Stanislav Švarc', 'Vašek Materna', 'Marian Dlugopolský', 'Jindřich Belinger', 'Jan Hanuš'],
          line2: ['Lukáš Matuška', 'Pavel Novák', 'Jiří Šalanda', 'Tomáš Tureček', 'Luboš Coufal']
        },
        goals: [
          { time: '02:02', team: 'home', scorer: 'Kolmann', assists: '(Šabaka)', score: '1:0' },
          { time: '09:52', team: 'home', scorer: 'Ihýk', assists: '', score: '2:0' },
          { time: '10:00', team: 'home', scorer: 'Tláskal', assists: '(Lucky)', score: '3:0' },
          { time: '10:38', team: 'home', scorer: 'Martin', assists: '(Lucky)', score: '4:0' },
          { time: '13:49', team: 'home', scorer: 'Martin', assists: '(Resl)', score: '5:0' },
          { time: '19:47', team: 'away', scorer: 'Lukáš Matuška', assists: '(Jindřich Belinger)', score: '5:1' },
          { time: '33:44', team: 'away', scorer: 'Jindřich Belinger', assists: '(Vašek Materna)', score: '5:2' },
          { time: '35:38', team: 'home', scorer: 'Ejsy', assists: '(Ihýk)', score: '6:2' },
          { time: '41:31', team: 'away', scorer: 'Pavel Novák', assists: '(Jan Hanuš)', score: '6:3' },
          { time: '44:16', team: 'away', scorer: 'Jan Hanuš', assists: '(Stanislav Švarc)', score: '6:4' },
          { time: '44:47', team: 'home', scorer: 'Tláskal', assists: '', score: '7:4' }
        ],
        penalties: [
          { time: '02:02', team: 'away', player: 'Jan Hanuš', reason: 'nesportovní chování', duration: '2 min' },
          { time: '13:30', team: 'home', player: 'Kolmann', reason: 'sekání', duration: '2 min' },
          { time: '26:16', team: 'home', player: 'Resl', reason: 'sekání', duration: '2 min' }
        ],
        summary: 'Katastrofální první třetina 0:5! Zápas se hrál na neutrální půdě na Kladně. Lancers se ve třetí třetině pokusili o comeback (3 góly), ale bylo pozdě. Lukáš Matuška vstřelil svůj první gól v sezóně. Vlastimil Nistor inkasoval 7 gólů.'
      },
  
    {
        id: 'liga-sharks-2024',
        title: 'Demolice Sharks Ústí!',
        date: '27.10.2024',
        time: '11:30',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🦈',
        excerpt: 'Drtivá výhra 10:3! První třetina 6:1, Šimek a Hanuš po 2+2, Tureček opět v brance.',
        homeTeam: 'Sharks Ústí',
        awayTeam: 'Litvínov Lancers',
        score: '3:10',
        periods: '(1:6 2:2 0:2)',
        homeLineup: {
          goalie: 'Hendrych Machutka',
          line1: ['Sosna', 'Šanda', 'Novák', 'Brenner', 'Brenner'],
          line2: ['Judl', 'Kočí', 'Rilke', 'Krajník', 'Chot'],
          line3: ['Frič', 'Svoboda', 'Kroupa']
        },
        awayLineup: {
          goalie: 'Tomáš Tureček',
          line1: ['Pavel Schubada ml.', 'Jan Schubada', 'Pavel Novák', 'Jan Hanuš', 'Roman Šimek'],
          line2: ['Jiří Šalanda', 'Stanislav Švarc', 'Marian Dlugopolský', 'Jindřich Belinger', 'Jiří Belinger']
        },
        goals: [
          { time: '07:51', team: 'away', scorer: 'Pavel Schubada ml.', assists: '(Jan Schubada, Jindřich Belinger)', score: '0:1' },
          { time: '09:45', team: 'away', scorer: 'Roman Šimek', assists: '(Pavel Schubada ml.)', score: '0:2' },
          { time: '10:02', team: 'home', scorer: 'Frič', assists: '(Kroupa)', score: '1:2' },
          { time: '11:03', team: 'away', scorer: 'Stanislav Švarc', assists: '(Roman Šimek)', score: '1:3' },
          { time: '11:27', team: 'away', scorer: 'Jan Hanuš', assists: '(Jan Schubada, Jiří Belinger)', score: '1:4' },
          { time: '11:35', team: 'away', scorer: 'Jan Schubada', assists: '', score: '1:5' },
          { time: '14:03', team: 'away', scorer: 'Stanislav Švarc', assists: '(Jiří Šalanda, Pavel Novák)', score: '1:6' },
          { time: '18:52', team: 'home', scorer: 'Brenner', assists: '(Šanda)', score: '2:6' },
          { time: '21:54', team: 'away', scorer: 'Jan Schubada', assists: '', score: '2:7' },
          { time: '23:20', team: 'home', scorer: 'Kroupa', assists: '', score: '3:7' },
          { time: '25:38', team: 'away', scorer: 'Roman Šimek', assists: '(Jan Hanuš)', score: '3:8' },
          { time: '39:30', team: 'away', scorer: 'Marian Dlugopolský', assists: '(Roman Šimek, Jan Hanuš)', score: '3:9' },
          { time: '41:11', team: 'away', scorer: 'Jan Hanuš', assists: '(Jindřich Belinger)', score: '3:10' }
        ],
        penalties: [],
        summary: 'Totální dominance Lancers! První třetina 6:1 byla klíčová. Roman Šimek (2+2) a Jan Hanuš (2+2) byli hvězdami zápasu - oba obránci! Jan Schubada vstřelil 2 góly, Stanislav Švarc také 2. Tomáš Tureček v brance potřetí v sezóně. Čistá hra bez vyloučení.'
      },
  
    {
        id: 'liga-viper-2024',
        title: 'Výhra nad Viper Ústí',
        date: '6.10.2024',
        time: '14:30',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🐍',
        excerpt: 'Rozhodla druhá třetina 4:0. Pavel Schubada ml. vstřelil 2 góly.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Viper Ústí',
        score: '4:2',
        periods: '(0:0 4:0 0:2)',
        homeLineup: {
          goalie: 'Vlastimil Nistor',
          line1: ['Luboš Coufal', 'Jan Schubada', 'Pavel Schubada ml.', 'Jan Hanuš', 'Pavel Schubada St.'],
          line2: ['Jiří Šalanda', 'Stanislav Švarc', 'Jindřich Belinger', 'Jiří Belinger'],
          line3: ['Marian Dlugopolský', 'Gustav Toman', 'Tomáš Tureček']
        },
        awayLineup: {
          goalie: 'Roudný',
          line1: ['Machart', 'Hrůša', 'Roman', 'Dudley', 'P.Petr'],
          line2: ['Rychtář', 'Čejka', 'Kreby', 'Slavík', 'Nady'],
          line3: ['Kočí', 'Trnka']
        },
        goals: [
          { time: '17:28', team: 'home', scorer: 'Gustav Toman', assists: '(Jiří Šalanda)', score: '1:0' },
          { time: '17:36', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Jindřich Belinger)', score: '2:0' },
          { time: '21:15', team: 'home', scorer: 'Jan Hanuš', assists: '', score: '3:0' },
          { time: '24:51', team: 'home', scorer: 'Pavel Schubada ml.', assists: '', score: '4:0' },
          { time: '34:32', team: 'away', scorer: 'Rychtář', assists: '(Nady)', score: '4:1' },
          { time: '43:54', team: 'away', scorer: 'Rychtář', assists: '', score: '4:2' }
        ],
        penalties: [
          { time: '14:02', team: 'away', player: 'Trnka', reason: 'podražení', duration: '2 min' },
          { time: '29:02', team: 'away', player: 'Nady', reason: 'hákování', duration: '2 min' },
          { time: '42:45', team: 'home', player: 'Jindřich Belinger', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Po bezgólové první třetině Lancers rozhodli ve druhé - 4 góly! Pavel Schubada ml. vstřelil 2 góly, rodina Schubadů opět v akci (otec v obraně, dva synové v útoku). Gustav Toman otevřel skóre, Jan Hanuš přidal třetí gól. Viper snížili až ve třetí třetině.'
      },
  
    {
        id: 'skupina-cp-ducks-2024',
        title: 'Prohra v základní skupině Českého poháru',
        date: '29.9.2024',
        time: '16:45',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🦆',
        excerpt: 'Těžká prohra s Ducks Klášterec. Třetí třetina rozhodla, soupeř vstřelil 4 góly.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Ducks Klášterec',
        score: '3:6',
        periods: '(1:1 2:1 0:4)',
        homeLineup: {
          goalie: 'Tomáš Tureček',
          line1: ['Pavel Novák', 'Jan Schubada', 'Gustav Toman', 'Luboš Coufal', 'Roman Šimek'],
          line2: ['Jiří Šalanda', 'Stanislav Švarc', 'Marian Dlugopolský', 'Jan Hanuš', 'Jindřich Belinger'],
          line3: ['Jiří Belinger']
        },
        awayLineup: {
          goalie: 'Pody',
          line1: ['Domes', 'Trnkič', 'Gruss', 'Tommy', 'Skipper'],
          line2: ['Měďák', 'Prochy D.', 'Prochy P.', 'Vébéčko', 'Veslo'],
          line3: ['Charvi', 'Roubič', 'Komár']
        },
        goals: [
          { time: '06:10', team: 'home', scorer: 'Jiří Šalanda', assists: '', score: '1:0' },
          { time: '09:47', team: 'away', scorer: 'Trnkič', assists: '(Skipper)', score: '1:1' },
          { time: '18:06', team: 'away', scorer: 'Domes', assists: '(Trnkič)', score: '1:2' },
          { time: '19:11', team: 'home', scorer: 'Jindřich Belinger', assists: '(Jan Schubada)', score: '2:2' },
          { time: '19:54', team: 'home', scorer: 'Pavel Novák', assists: '(Stanislav Švarc)', score: '3:2' },
          { time: '35:10', team: 'away', scorer: 'Tommy', assists: '(Trnkič)', score: '3:3' },
          { time: '35:56', team: 'away', scorer: 'Prochy D.', assists: '', score: '3:4' },
          { time: '37:28', team: 'away', scorer: 'Domes', assists: '(Gruss)', score: '3:5' },
          { time: '39:09', team: 'away', scorer: 'Komár', assists: '(Roubič)', score: '3:6' }
        ],
        penalties: [
          { time: '34:55', team: 'home', player: 'Pavel Novák', reason: 'podražení', duration: '2 min' },
          { time: '41:56', team: 'away', player: 'Měďák', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Lancers vedli 3:2 po druhé třetině, ale katastrofální poslední třetina znamenala prohru. Ducks vstřelili 4 góly během 4 minut! Tomáš Tureček musel zaskočit v brance za chybějící brankáře. Jiří Šalanda otevřel skóre, Pavel Novák a Jindřich Belinger také skórovali.'
      },
  
    {
        id: 'skupina-cp-gurmani-2024',
        title: 'Kanonáda proti Gurmánům Žatec!',
        date: '22.9.2024',
        time: '15:30',
        location: 'Bílina',
        category: 'Skupina ČP',
        image: '🎯',
        excerpt: 'Drtivá výhra 10:3! Rodina Schubadů předvedla show - otec i synové skórovali.',
        homeTeam: 'Litvínov Lancers',
        awayTeam: 'Gurmáni Žatec',
        score: '10:3',
        periods: '(4:0 1:1 5:2)',
        homeLineup: {
          goalie: 'Tomáš Tureček',
          line1: ['Jan Schubada', 'Adam Schubada', 'Pavel Schubada ml.', 'Jan Hanuš', 'Pavel Schubada St.'],
          line2: ['Pavel Novák', 'Stanislav Švarc', 'Marian Dlugopolský', 'Luboš Coufal', 'Jindřich Belinger'],
          line3: ['Jiří Šalanda', 'Vašek Materna']
        },
        awayLineup: {
          goalie: 'Kodrle',
          line1: ['Broum', 'Vostřel', 'Brunclík', 'Nový', 'Kačenák'],
          line2: ['Vápeník', 'Chot V.', 'Hanzlík', 'Provazník', 'Horáček'],
          line3: ['Kořán', 'Chot D.', 'Zmeškal', 'Čatai']
        },
        goals: [
          { time: '01:44', team: 'home', scorer: 'Pavel Novák', assists: '(Marian Dlugopolský)', score: '1:0' },
          { time: '09:08', team: 'home', scorer: 'Pavel Schubada ml.', assists: '', score: '2:0' },
          { time: '11:09', team: 'home', scorer: 'Jiří Šalanda', assists: '(Luboš Coufal)', score: '3:0' },
          { time: '14:36', team: 'home', scorer: 'Jiří Šalanda', assists: '(Pavel Novák)', score: '4:0' },
          { time: '27:44', team: 'away', scorer: 'Vostřel', assists: '', score: '4:1' },
          { time: '28:42', team: 'home', scorer: 'Pavel Schubada ml.', assists: '(Luboš Coufal)', score: '5:1' },
          { time: '30:00', team: 'home', scorer: 'Pavel Schubada St.', assists: '(Jan Hanuš)', score: '6:1' },
          { time: '35:05', team: 'home', scorer: 'Jan Schubada', assists: '(Pavel Novák)', score: '7:1' },
          { time: '35:51', team: 'away', scorer: 'Hanzlík', assists: '(Zmeškal)', score: '7:2' },
          { time: '40:34', team: 'home', scorer: 'Pavel Schubada ml.', assists: '', score: '8:2' },
          { time: '41:11', team: 'home', scorer: 'Jan Hanuš', assists: '(Jan Schubada)', score: '9:2' },
          { time: '43:05', team: 'away', scorer: 'Hanzlík', assists: '(Vostřel)', score: '9:3' },
          { time: '43:11', team: 'home', scorer: 'Pavel Novák', assists: '(Jan Hanuš)', score: '10:3' }
        ],
        penalties: [
          { time: '09:37', team: 'away', player: 'Vostřel', reason: 'podražení', duration: '2 min' },
          { time: '41:05', team: 'away', player: 'Vostřel', reason: 'podražení', duration: '2 min' }
        ],
        summary: 'Historický zápas rodiny Schubadů! Pavel st. (obránce), Jan, Adam a Pavel ml. (útočníci) všichni skórovali. Pavel ml. dal hattrick! Pavel Novák a Jiří Šalanda přidali po dvou gólech. Tomáš Tureček opět musel chytat místo obránce. Lancers dominovali od začátku - vedli 4:0 po první třetině.'
      }
  ];
    
    // Funkce pro získání zápasu podle ID
    export const getMatchById = (id) => {
      return matchData.find(match => match.id === id);
    };
    
    // Funkce pro získání posledních N zápasů
    export const getRecentMatches = (count = 5) => {
      return matchData.slice(0, count);
    };
    
    // Funkce pro získání zápasů podle kategorie
    export const getMatchesByCategory = (category) => {
      return matchData.filter(match => match.category === category);
    };