'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Calendar, Trophy, Users, Star, ChevronUp, List, Images, Eye, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DetailHistoriePage() {
  const [activeSection, setActiveSection] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll na sekci podle hash v URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(id);
        }
      }, 100);
    }

    // Scroll listener pro tlačítko nahoru
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const detailedHistory = [
    {
      id: '2006',
      year: '2006',
      title: 'Založení AHC Litvínov',
      stage: 1,
      icon: '🏛️',
      detailText: `Rok 2006 se zapsal do historie litvínovského amaterského hokeje zlatým písmem. Dva spolužáci, Jiří Koláček a Oldřich Štěpanovský, se rozhodli založit vlastní hokejový tým - AHC Litvínov.
      Tehdy u nás začínal i Václav Falco Matějovič jako jeden z mála, který za klub hraje i po 19 letech v sezóně 2025/2026

      Začátky byly skromné, ale plné nadšení. První zápasy se hrály proti týmu White Stars, kde dominoval jejich nejlepší útočník Vašek Materna. Nikdo tehdy netušil, že o 15 let později bude Vašek oblékat dres Lancers.

      První sezóna byla především o učení se a budování základů. Tým neměl vlastní dresy, hrálo se bez rozhodčích, ale radost ze hry byla obrovská. Každý zápas byl svátkem a každý gól se slavil jako vítězství ve Stanley Cupu.`,
      images: [
        { src: '/images/historie/2006.jpg', caption: 'Hrálo se bez rozhodčích' },
        { src: '/images/historie/2006dva.jpg', caption: 'Každý jiný dres' },
        { src: '/images/historie/2006tri.jpg', caption: 'Chyběla i celá výstroj' }
      ],
      achievements: ['Založení týmu', 'První zápasy', 'Vytvoření základní sestavy']
    },
    {
      id: '2007',
      year: '2007',
      title: 'Rozvoj týmu',
      stage: 1,
      icon: '📈',
      detailText: `Druhý rok existence přinesl významný pokrok. Tým začal hrát první zápasy s oficiálními rozhodčími, což dodalo hrám na vážnosti a profesionalitě.

      Rozšířil se okruh soupeřů a AHC Litvínov už nehrál jen s jedním týmem s White Stars ale začal hledat týmy jako HC Janov atd. 
    
      První přáteláček s mezinárodním zápase. Do Litvínova za námi zavítal EHC Dresden Devils nebo HC Lány :) 

      Počet hráčů se postupně zvyšoval a tým získával na stabilitě. Vznikla první pravidla týmu a začala se budovat týmová kultura, která trvá dodnes.`,
      images: [
        { src: '/images/historie/rozvoj1.jpg', caption: 'První týmová fotka' },
        { src: '/images/historie/rozvoj2.jpg', caption: 'Klasický zápas s White Stars' },
        { src: '/images/historie/rozvoj3.jpg', caption: 'zápas v Kadani s Podbořany' },
        { src: '/images/historie/rozvoj4.jpg', caption: 'Přáteláček s EHV Dresden Devils' }
      ],
      achievements: ['První zápasy s rozhodčím', 'Účast na prvních turnajích', 'Rozšíření kádru']
    },
    {
      id: '2008',
      year: '2008',
      title: 'První mezinárodní zkušenosti',
      stage: 1,
      icon: '🌍',
      detailText: `Rok 2008 znamenal překročení hranic domácího stadionu. Památný zápas v Bílině proti HC Lokomotiva se stal prvním výjezdem týmu mimo Litvínov.

      Mezinárodní turnaj kde jsme byli jediný český tým i když se hrálo v Litvínově. Památný zápas v semifinále, kde jsme otočili zápas z 1:4 na 6:4. Ve finále nás čekal tým EHV Dresden Devils

      Vznikly první týmové tradice a rituály před zápasy. Tým začal být vnímán jako seriózní soupeř v regionu.`,
      images: [
        { src: '/images/historie/20081.jpg', caption: 'Daniel Pauš' },
        { src: '/images/historie/20082.jpg', caption: 'Oslavy s fanoušky' },
        { src: '/images/historie/20083.jpg', caption: 'První pokřik' },
        { src: '/images/historie/20084.jpg', caption: 'S EHV Dresden ve finále' }
      ],
      achievements: ['První výjezd mimo Litvínov', 'Mezinárodní zkušenosti', 'Budování týmových tradic']
    },
    {
      id: '2009',
      year: '2009',
      title: 'Vrchol první éry',
      stage: 1,
      icon: '⭐',
      detailText: `Rok 2009 byl rokem velkých ambicí. Tým získal první sponzory, ledy plně hrazený sponzory, hokejky zadarmo.

      Vstup do SportClub ligy byl velkým krokem vpřed. Tým si stanovil jasný cíl - vyhrát ligu. Sezóna byla plná dramatických zápasů a tým bojoval o nejvyšší příčky.

      Vznikla silná fanouškovská základna a zápasy začaly navštěvovat desítky diváků. Funny historka ze zápasu v Bilině byla ta, že na stadion přijela policie s cílem utišit naše faoušky :D :D `,
      images: [
        { src: '/images/historie/vrchol1.jpg', caption: 'Tým se sponzory' },
        { src: '/images/historie/vrchol2.jpg', caption: 'První zápas SportClub ligy' },
        { src: '/images/historie/vrchol3.jpg', caption: 'Zakladatel Jirka Koláček jako trenér' }
      ],
      achievements: ['První sponzoři', 'Vstup do SportClub ligy', 'Budování fanouškovské základny']
    },
    {
      id: '2010',
      year: '2010',
      title: 'Těžké období',
      stage: 1,
      icon: '💪',
      detailText: `Rok 2010 byl nejtěžší v historii týmu. Vyloučení z prvního místa SportClub ligy bylo tvrdou ranou. Následná ztráta hlavního sponzora znamenala existenční problémy.

      Tým však ukázal svůj charakter. Hráči se složili na náklady a pokračovali v hraní. Tato zkouška týmovou soudržnost ještě posílila.

      Tým pokračoval s přáteláčky s White Stars a hledal nové příležitosti.`,
      achievements: ['Překonání krize', 'Posílení týmové soudržnosti', 'Pokračování bez sponzora']
    },
    {
      id: '2011',
      year: '2011',
      title: 'Výhra na Sláča Cupu',
      stage: 1,
      icon: '🏆',
      detailText: `Po těžkém roce 2010 přišla sladká odměna. Vítězství na tradičním Sláča Cupu bylo prvním velkým turnajovým úspěchem v historii klubu.

      Tato trofej dodala týmu sebevědomí a ukázala, že tvrdá práce se vyplácí. Bylo to potvrzení, že tým patří mezi špičku regionálního hokeje.`,
      images: [
        { src: '/images/historie/slaca2.png', caption: 'Vítězná trofej Sláča Cupu' }
      ],
      achievements: ['První velká trofej', 'Finálové vítězství', 'Potvrzení kvality týmu']
    },
    {
      id: '2013',
      year: '2013',
      title: 'Zrození Litvínov Lancers',
      stage: 2,
      icon: '⚔️',
      detailText: `Rok 2013 znamenal začátek nové éry. Tým se přejmenoval na Litvínov Lancers a získal ikonické logo, které nakreslil Petr Štěpanovský, bratr spoluzakladatele Oldřicha.

      Vstup do prestižní PAHL ligy byl obrovským krokem vpřed. Liga měla profesionální úroveň s kvalitními týmy, rozhodčími a organizací.

      Nová identita přinesla novou energii. Tým získal nové dresy v černé a bíle barvě, které se staly symbolem Lancers.`,
      images: [
        { src: '/images/historie/zrozeni2.jpg', caption: 'První zápas Litvínova Lancers' },
        { src: '/images/historie/zrozeni3.jpg', caption: 'Ještě s dresy AHC Litvínova' },
        { src: '/images/historie/zrozeni4.jpg', caption: 'Tým Litvínov Lancers' }
      ],
      achievements: ['Přejmenování na Lancers', 'Vytvoření loga', 'Vstup do PAHL ligy']
    },
    {
      id: '2013-2016',
      year: '2013-2016',
      title: 'Éra PAHL ligy',
      stage: 2,
      icon: '🎯',
      detailText: `Tři sezóny v PAHL lize byly nejkvalitnějším obdobím v historii klubu. Liga měla vysokou úroveň s bývalými hráči Extraligy a tak každý zápas byl bojem.

      Nejblíže postupu do play-off byl tým v sezóně 2015/16. Rozhodující zápas s Pazdrojem Teplice skončil porážkou 0:2, ale tým ukázal, že může konkurovat nejlepším.

      PAHL liga přinesla cenné zkušenosti a mnoho přátelství s hráči jiných týmů. Úroveň hokeje se výrazně zvedla.`,
      images: [
        { src: '/images/historie/pahl1.jpg', caption: 'Tým v sezóně 2015/16' },
        { src: '/images/historie/pahl2.jpg', caption: 'Boj o play-off' },
        { src: '/images/historie/pahl3.jpg', caption: 'Zápas v PAHL' },
        { src: '/images/historie/pahl4.jpg', caption: 'Tradiční soupeř Klimatizace Chomutov' }
      ],
      achievements: ['3 sezóny v PAHL', 'Boj o play-off', 'Zvýšení herní úrovně']
    },
    {
      id: '2013-tv',
      year: '2013',
      title: 'V hledáčku televize',
      stage: 2,
      icon: '📺',
      detailText: `Mediální pozornost byla překvapením. Česká televize ale také Nova TV zavítali na zápasy Litvínova Lancers

      Obě televize odvysílali sestřih ze zápasů v hlavní vysílací čas ve sportovních novinách. Funny scénku na TV nova měl Ondra Hrubý. 

      Pro tým to byla obrovská pocta a motivace. Ukázalo to, že i amatérský hokej může být zajímavý pro širokou veřejnost.`,
      images: [
        { src: '/images/historie/tv1.jpg', caption: 'Rozhovor pro ČT' },
        { src: '/images/historie/tv2.jpg', caption: 'Rozhovor pro TV Nova' },
        { src: '/images/historie/tv3.jpg', caption: 'Naši dva brankáři v TV' },
        { src: '/images/historie/tv4.jpg', caption: 'Záběry ze zápasu' }
      ],
      achievements: ['Televizní reportáž', 'Mediální pozornost', 'Propagace amatérského hokeje']
    },
    {
      id: '2013-germany',
      year: '2013',
      title: 'Památný zápas ve Freiburgu s tučnákama a fanshop',
      stage: 2,
      icon: '🇩🇪',
      detailText: `Zápas ve Freiberurgu s Tučnáky byl pro nás velmi příjemný. Hraje za ně náš kamarád a jediný náš mezinárodní spoluhráč Svem Sommer :)

      Ve stejném roce byl spuštěn oficiální fanshop. Fanoušci si mohli koupit plakát, hrnek, minidres a také plyšového medvídka :) 

      Byl vytvořen první oficiální plakát týmu, který se stal sběratelským kouskem.`,
      images: [
        { src: '/images/historie/pratelacek1.jpg', caption: 'Zápas v Německu s Tučnáky' },
        { src: '/images/historie/pratelacek2.jpg', caption: 'Nálada byla perfektní' },
        { src: '/images/historie/fanshop1.jpg', caption: 'První produkty fanshopu' },
        { src: '/images/historie/fanshop2.jpg', caption: 'Oficiální plakát' }
      ],
      achievements: ['První zápas v zahraničí', 'Spuštění fanshopu', 'První oficiální plakát']
    },
    {
      id: '2014',
      year: '2014',
      title: 'První Winter Classic',
      stage: 2,
      icon: '❄️',
      detailText: `Winter Classic pod širým nebem byl splněným snem. Zápas na venkovním kluzišti v mrazivém počasí (-13) měl neopakovatelnou atmosféru.

      Hráli jsme v Povrlech kde nás hostili A tým Povrl, který se postaral o povedenou propagandu, protože
      návštěvnost byla nad 100 diváků! Horký čaj a svařák pomáhaly zahřát promrzlé fanoušky.

      Winter Classic jsme zopakovali o 7 let později a znovu s domácím týmem HC Dynamo Povrli :)`,
      images: [
        { src: '/images/historie/winter1.jpg', caption: 'Hráči museli mít kukly a svetry v -13' }
      ],
      achievements: ['První Winter Classic', 'Rekordní návštěva', 'Založení tradice']
    },
    {
      id: '2015',
      year: '2015',
      title: 'Turnaj v Belgii',
      stage: 2,
      icon: '🌍',
      detailText: `Mezinárodní turnaj v Belgii byl největší zahraniční akcí v historii klubu. Čtyřdenní výjezd, 12 týmů z 5 zemí, nezapomenutelné zážitky.

      Šesté místo bylo úspěchem. Tým porazil několik belgických a holandských týmů a získal respekt na mezinárodní scéně.

      Kromě hokeje tým navštívil Brusel, ochutnal belgické pivo a waffle. Výjezd stmelil partu a ukázal, že Lancers mohou konkurovat i v Evropě.`,
      images: [
        { src: '/images/historie/belgie1.jpg', caption: 'Tým v Belgii' },
        { src: '/images/historie/belgie2.jpg', caption: 'Před stadionem' },
        { src: '/images/historie/belgie3.jpg', caption: 'Zápas turnaje' },
        { src: '/images/historie/belgie4.jpg', caption: 'Skvělá nálada na hotelu' }
      ],
      achievements: ['6. místo z 12 týmů', 'Mezinárodní zkušenosti', 'Výhry nad zahraničními týmy']
    },
    {
      id: '2016',
      year: '2016',
      title: 'Triumf na Sindy Cupu',
      stage: 2,
      icon: '🥇',
      detailText: `Vítězství na mezinárodním turnaji Sindy Cup bylo potvrzením rostoucí kvality týmu. Ikdyž vlastně tady jsme se nesešli.
      Odehráli jsme zápasy jen v sedmi lidech plus super brankář dominik. 
      V týmu jsme měli dvě ženy, které němci nešetřili u mantinelů.
      Vzniklo spoustu konfliktů na hřišti, mnoho vyloučeních.
      Ve finále jsme  dostali EHV Dresden Devils, který jsme poprvé v historii porazili i když to bylo na střely asi 2 ku 50ti :D

      Cesta turnajem byla velmi zapeklitá, každý zápas bylobrovský boj ale odměnabyla více než sladká

      Trofej z Sindy Cupu je dodnes vystavena v klubovně a připomíná jeden z největších úspěchů v historii Lancers.`,
      images: [
        { src: '/images/historie/SindyCup.jpg', caption: 'Skvělá nálada v kabině' },
        { src: '/images/historie/SindyCup1.jpg', caption: 'Spoleřná po vítězné veřeři' },
        { src: '/images/historie/SindyCup2.jpg', caption: 'Společná, vítězná fotka' },
        { src: '/images/historie/SindyCup3.jpg', caption: 'Oslavy vítězství' }
      ],
      achievements: ['Vítězství na turnaji', 'Všechny výhry', 'Finálové vítězství 0:1']
    },
    {
      id: '2016-2017',
      year: '2016-2017',
      title: 'Návrat do SportClubligy',
      stage: 2,
      icon: '🔄',
      detailText: `Po třech sezónách v PAHL lize se tým vrátil do SportClubligy. Vedení Sportclub ligy bylo velmi přátelské, protože nás vzali do soutěže i když byla už rozjetá.
      Za to jim moc děkujeme. Že nás nenechali bez soutěže. Měla začít sezóna v PAHL ale ta se rozhodla zaniknout.

      Sportclubliga za ty roky taky zkvalitnila, takže to byla dobrá náhrada za PAHL.

      I přes sportovní výsledky zůstala parta pohromadě a připravovala se na další výzvy.`,
      achievements: ['Návrat do známé soutěže', 'Generační obměna', 'Zachování týmového ducha']
    },
    {
      id: '2018-2019',
      year: '2018-2019',
      title: 'Zajímavé zápasy a Batman Cup',
      stage: 2,
      icon: '🏒',
      detailText: `Období plné zajímavých akcí. Zápas proti ženskému týmu Lovosice byl unikátní zkušeností. Dámy ukázaly, že umí hrát tvrdý hokej.

      Výjezd do Karlových Varů přinesl zápas na krásném stadionu. Fotbalový zápas v létě ukázal všestrannost týmu.

      Vítězství na Batman Cupu bylo třešničkou na dortu. Turnaj v Gotham City měl skvělou atmosféru.`,
      images: [
        { src: '/images/historie/batmancup.jpg', caption: 'Vítězové Batman Cupu' },
        { src: '/images/historie/2019Lovosice.jpg', caption: 'Zápas s Lovosice ženy' },
        { src: '/images/historie/2018Vary.jpg', caption: 'Výjezd Karlovy Vary' },
        { src: '/images/historie/20181.jpg', caption: 'Letní fotbal' }
      ],
      achievements: ['Výhra Batman Cup', 'Zápas proti ženám', 'Fotbalové dovednosti']
    },
    {
      id: '2021',
      year: '2021',
      title: 'Nový začátek a návrat Vaška Materny',
      stage: 3,
      icon: '🔥',
      detailText: `Po covidové pauze přišlo znovuvybudování týmu. Mnoho hráčů skončilo, ale jádro zůstalo a přišli noví nadšenci.

      Největší senzací byl příchod Vaška Materny! Bývalý nejlepší hráč White Stars, proti kterému Lancers hrávali v začátcích, se stal součástí týmu.

      "Od rivala k parťákovi" - Vaškův příchod byl symbolický. Ukázal, že hokej spojuje a staré rivalry se mění v přátelství.`,
      achievements: ['Znovuvybudování týmu', 'Příchod Vaška Materny', 'Nová energie']
    },
    {
      id: '2022-2023',
      year: '2022-2023',
      title: 'Český pohár - první ročník',
      stage: 3,
      icon: '🏅',
      detailText: `Vstup do nové celostátní soutěže Český pohár byl velkým krokem. Soutěž měla za cíl propojit amatérské týmy z celé České republiky.

      Tým se do Play Off dostal přes remízu v posledním zápase s Novým Bydžovem, který to měl na stadion v Litvínově až 180km
      V tomto zápase měla debut v týmu Michaela Nováková, která se blýskla skvělým výkonem. 

      První ročník byl učením. Tým v Play Off nestačil na Netopýry Černočice a ani na Lopaty Praha a obsadil 4. místo

      Český pohár přinesl pravidelné zápasy a motivaci trénovat. Kvalita týmu začala opět stoupat.`,
      images: [
        { src: '/images/historie/2022.jpg', caption: 'Radost byla i za 4 místo' },
        { src: '/images/historie/20221.jpg', caption: 'Tým v sezóně 2022/23' },
        { src: '/images/historie/20222.jpg', caption: 'zápas s Netopýry' },
        { src: '/images/historie/20223.jpg', caption: 'Naši fanoušci' }
      ],
      achievements: ['Vstup do Českého poháru', '4. místo', 'Celostátní konkurence']
    },
    {
      id: '2023-2024',
      year: '2023-2024',
      title: 'Stabilizace a růst',
      stage: 3,
      icon: '📊',
      detailText: `Druhý ročník Českého poháru potvrdil, že Lancers patří ke špičce. Opět 4. místo, ale s lepšími výkony a větší zkušeností.

      Tým se stabilizoval, vznikla skvělá parta. Tréninky byly pravidelné a účast vysoká.

      Začala příprava na vlastní turnaj - Lancers Cup. Tým chtěl vrátit hokejové komunitě to, co od ní dostal.`,
      images: [
        { src: '/images/historie/2023.jpg', caption: 'Focení na plakát' },
        { src: '/images/historie/20231.jpg', caption: 'S Dračicemi Bílina' },
        { src: '/images/historie/20232.jpg', caption: 'S Viper Ústí nad Labem' }
      ],
      achievements: ['Opět 4. místo ČP', 'Stabilní kádr', 'Příprava vlastního turnaje']
    },
    {
      id: '2024-viral',
      year: 'Únor 2024',
      title: '🔥 VIRÁLNÍ SENZACE - Celosvětová sláva! 🔥',
      stage: 3,
      icon: '📱',
      special: true, // Speciální událost
      link: 'https://www.instagram.com/reel/C23YfD1Ium-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      detailText: `HISTORICKÝ OKAMŽIK PRO LANCERS! 

      V únoru 2024 se stal neuvěřitelný fenomén - náš Instagram reel se stal VIRÁLNÍM po celém světě! 

      📊 NEUVĚŘITELNÁ ČÍSLA:
      • 777 000 zhlédnutí jen na našem profilu @hclitvinovlancers
      • Přes 10 MILIONŮ celkových zhlédnutí včetně všech sdílení!
      • Sdíleno po celém světě - od USA přes Evropu až po Asii
      • Tisíce nových followerů z celého světa
      
      Video zachytilo jedinečný moment našeho hokeje a okouzlilo fanoušky po celé planetě. Komentáře přicházely v desítkách jazyků, lidé obdivovali atmosféru, náš tým a lásku k hokeji.
      
      Tento virální úspěch ukázal, že amatérský hokej může zaujmout miliony lidí po celém světě. Lancers se na jeden okamžik stali nejslavnějším amatérským týmem planety!
      
      "Z malého Litvínova do celého světa" - tento moment dokázal, že láska k hokeji nezná hranice a že i malý tým může dosáhnout velkých věcí.`,
      images: [
        { src: '/images/historie/viral1.jpg', caption: 'Screenshot virálního reelu' },
        { src: '/images/historie/viral2.jpg', caption: 'Statistiky sledovanosti' },
        { src: '/images/historie/viral3.jpg', caption: 'Komentáře z celého světa' }
      ],
      achievements: ['777k zhlédnutí na profilu', '10+ milionů celkem', 'Celosvětové sdílení']
    },
    {
      id: '2024-lancers',
      year: '2024',
      title: 'První Lancers Cup',
      stage: 3,
      icon: '🏆',
      detailText: `Uspořádání vlastního turnaje byl sen, který se stal skutečností. Lancers Cup přilákal 6 kvalitních týmů.

      Organizace byla perfektní - profesionální rozhodčí, časomíra, občerstvení, ceny. Turnaj měl skvělou atmosféru a pozitivní ohlasy.

      Turnaje se účastnili ZŠT louny, Kafáč Bílina, Gurmáni Žatec, Predator Nymburk, Litvínov Kancers a GinTonic(tým složeny z žen)`,
      images: [
        { src: '/images/historie/LancersCup.jpg', caption: 'Kafáč Bílina 2 místo' },
        { src: '/images/historie/LancersCup1.jpg', caption: 'ZŠT Louny 1.místo' },
        { src: '/images/historie/LancersCup2.jpg', caption: 'Gurmáni Žatec 3 místo' }
      ],
      achievements: ['Uspořádání vlastního turnaje', '6 týmů', 'Skvělá atmosféra']
    },
    {
      id: '2024-khla',
      year: '2024',
      title: 'Historický vstup do KHLA',
      stage: 3,
      icon: '🎉',
      detailText: `Přijetí do prestižní KHLA ligy bylo historickým milníkem. Lancers se stali 8. týmem této exkluzivní soutěže.

      KHLA liga představuje nejvyšší úroveň amatérského hokeje v regionu. Kvalita soupeřů, organizace a prestiž jsou na špičkové úrovni.

      Být součástí KHLA je pocta a závazek zároveň. Tým musí reprezentovat a držet vysokou úroveň.`,
      images: [
        { src: '/images/historie/khla.jpg', caption: 'Jiří Šalanda v akci' },
        { src: '/images/historie/khla1.jpg', caption: 'Jindra Belinger v akci' },
        { src: '/images/historie/khla2.jpg', caption: 'Střídařka Lancers' },
        { src: '/images/historie/khla3.jpg', caption: 'S BoB' }
      ],
      achievements: ['Přijetí do KHLA', '8. tým ligy', 'Nejvyšší úroveň']
    },
    {
      id: '2024-2025',
      year: '2024-2025',
      title: 'Úspěšná debutová sezóna',
      stage: 3,
      icon: '🥈',
      detailText: `Debutová sezóna v KHLA překonala všechna očekávání. Páté místo bylo fantastickým výsledkem pro nováčka.

      V Českém poháru tým dosáhl historického úspěchu - 2. místo! Finále bylo dramatické a stříbrné medaile mají cenu zlata.

      Sezóna ukázala, že Lancers patří mezi elitu českého amatérského hokeje. Tvrdá práce posledních let přinesla ovoce.`,
      images: [
        { src: '/images/historie/2025.jpg', caption: 'Stříbro z Českého poháru' },
        { src: '/images/historie/20251.jpg', caption: 'Finále ČP' },
        { src: '/images/historie/20252.jpg', caption: 'Zápas na Kladně' },
        { src: '/images/historie/20253.jpg', caption: 'Spokojený Luboš' }
      ],
      achievements: ['5. místo KHLA', '2. místo Český pohár', 'Historický úspěch']
    },
    {
      id: '2025-straubing',
      year: 'Léto 2025',
      title: 'Mezinárodní turnaj Straubing',
      stage: 3,
      icon: '🌍',
      detailText: `Letní turnaj ve Straubingu byl návratem na mezinárodní scénu. Německý turnaj přilákal týmy z celé Evropy a dokonce z USA.

      Památné bylo semifinále o 5.-8. místo proti americkému týmu Bayern Rangers. Zápas skončil nerozhodně a Lancers vyhráli až na nájezdy!

      Konečné 6. místo bylo úspěchem. Porazit americký tým bylo historické a ukázalo, že Lancers mohou konkurovat komukoli.`,
      images: [
        { src: '/images/historie/Straubing.jpg', caption: 'Lancers s Bayern Rangers' },
        { src: '/images/historie/Straubing1.jpg', caption: 'Lancers na vyhlášení' },
        { src: '/images/historie/Straubing2.jpg', caption: 'Tady jsme si pochutnali' },
        { src: '/images/historie/Straubing3.jpg', caption: 'Na náměstí ve Straubingu' }
      ],
      achievements: ['6. místo', 'Výhra nad USA týmem', 'Mezinárodní úspěch']
    },
    {
      id: '2025-new',
      year: '2025',
      title: 'Nová éra a budoucnost',
      stage: 3,
      icon: '🚀',
      detailText: `Rok 2025 přináší novou éru. Tým má stabilní základnu, pokračuje v KHLA a Českém poháru s nejvyššími ambicemi.

      Změna loga symbolizuje evoluci týmu. Nové dresy v moderním designu ukazují, že Lancers jdou s dobou.

      Budoucnost vypadá světle. Tým má skvělou partu, podporu fanoušků a chuť dosáhnout dalších úspěchů. Historie se píše každým zápasem.`,
      achievements: ['Nové logo', 'Nové dresy', 'Vysoké ambice']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-amber-900/20 to-slate-800">
      <Navigation />
      
      {/* Zoom overlay pro fotky */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <Image 
            src={zoomedImage.src} 
            alt={zoomedImage.caption}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded">
            {zoomedImage.caption}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/historie" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na časovou osu</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <Eye className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Detailní historie</h1>
              <p className="text-gray-200 mt-1">Podrobný příběh každé sezóny</p>
            </div>
          </div>

          {/* Navigace mezi stránkami */}
          <div className="flex gap-4 mb-8">
            <Link href="/historie" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <List size={20} />
              Časová osa
            </Link>
            <Link href="/historie/page2" className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700">
              <Eye size={20} />
              Detailní historie
            </Link>
            <Link href="/historie/page3" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <Images size={20} />
              Galerie
            </Link>
          </div>
        </div>
      </div>

      {/* Detailní historie */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {detailedHistory.map((item, index) => (
          <div 
            key={index} 
            id={item.id}
            className={`mb-16 scroll-mt-32 ${activeSection === item.id ? 'ring-2 ring-amber-500 rounded-2xl' : ''}`}
          >
            <div className={`p-8 rounded-2xl ${
              item.special ? 'bg-gradient-to-r from-pink-900/60 via-purple-900/60 to-blue-900/60 border-2 border-pink-500 shadow-2xl shadow-pink-500/30 animate-pulse' :
              item.stage === 1 ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50' :
              item.stage === 2 ? 'bg-gradient-to-br from-amber-900/40 to-orange-800/40 border border-amber-500/50' :
              'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border border-green-500/50'
            } shadow-xl`}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-3xl font-bold ${item.special ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400' : 'text-white'}`}>{item.title}</h2>
                    <span className="text-amber-400 font-bold text-xl">{item.year}</span>
                    {item.special && <span className="text-3xl animate-bounce">🎬</span>}
                  </div>
                </div>
              </div>

              {/* Link na virální video */}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                  <span className="text-xl">🎥</span>
                  <span>ZOBRAZIT VIRÁLNÍ REEL</span>
                  <span className="text-xl">👀</span>
                </a>
              )}

              {/* Text */}
              <div className="text-gray-100 leading-relaxed mb-6 whitespace-pre-line">
                {item.detailText}
              </div>

              {/* Achievements */}
              {item.achievements && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <Trophy size={20} />
                    Klíčové momenty
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {item.achievements.map((achievement, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3 flex items-center gap-2">
                        <Star className="text-amber-500" size={16} />
                        <span className="text-white">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              {item.images && (
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <Images size={20} />
                    Fotogalerie
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {item.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="relative group cursor-pointer"
                        onClick={() => setZoomedImage(img)}
                      >
                        <Image 
                          src={img.src} 
                          alt={img.caption}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                        </div>
                        <p className="text-sm text-gray-300 mt-2">{img.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors z-40"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-black/70 backdrop-blur border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky</p>
            <p className="text-sm mt-2">Hrdě hrajeme od roku 2006</p>
          </div>
        </div>
      </footer>
    </div>
  );
}