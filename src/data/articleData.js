// Databáze článků HC Litvínov Lancers
export const articles = [
  {
    id: 'straubing-2025-hokejovy-vikend',
    title: 'Straubing 2025: Hokejový víkend plný zážitků',
    slug: 'straubing-2025-hokejovy-vikend',
    excerpt: 'Výjezd na mezinárodní hokejový turnaj do německého Straubingu se vydařil na jedničku. Skvělá atmosféra, kvalitní soupeři a nezapomenutelné zážitky!',
    category: 'Turnaje',
    author: {
      name: 'Tým HC Lancers',
      id: 'hc-lancers'
    },
    date: '18. srpna 2025',
    publishedAt: new Date('2025-08-18T14:30:00'),
    image: '🇩🇪',
    featuredImage: '/images/Straubing/uvodnifotka.jpg',
    featured: true,
    views: 0,
    likes: 0,
    content: `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 mb-6">
          <p class="text-xl font-bold text-gray-800 mb-2">
            🏒 Mezinárodní turnaj ve Straubingu
          </p>
          <p class="text-gray-600">
            <strong>Kdy:</strong> 12.-13. července 2025<br/>
            <strong>Kde:</strong> Straubing, Německo 🇩🇪<br/>
            <strong>Umístění:</strong> 6. místo z 12 týmů 🏅
          </p>
        </div>
        
        <p>
          Tým se o turnaji dozvěděl cca měsíc předem, protože se to manažer týmu dozvěděl až když zahlédnul už rozlosování turnaje. 😅 Hráče to oslovilo, ale ne v dostačujícím počtu. Když ale generální manažer viděl, jak se hráči těší, tak se musel snažit! 
        </p>
        
        <p>
          Naštěstí nebylo těžké najít hráče, aby nás doplnili. Stačila jedna zpráva přes WhatsApp Danu Kačeňákovi a ten s radostí dorazil hned i se Zmeškalem! Tímto jsme byli kompletní:
        </p>
        
        <div class="bg-gray-100 rounded-lg p-4 my-4">
          <p class="font-semibold text-gray-800 mb-2">🏒 Naše sestava na turnaj:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• <strong>8 hráčů z Lancers</strong> (Tomáš Tureček, Jiří Šalanda, Luboš Coufal, Oliver Štěpanovský, Jiří a Lukáš Matuškovi, Michal Koreš, Jan Hanuš)</li>
            <li>• Dan Kačeňák a Lukáš Zmeškal (Gurmáni)</li>
            <li>• Pepa (Kuby kamarád)</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🚗 Páteční příjezd</h3>
        
        <p>
          Do Straubingu jsme vyráželi všichni už v pátek, protože jsme se chtěli dobře vyspat a vlastně poznat trochu město. Jako první do Straubingu na hotel dorazilo auto s Turym, Šalim, Coufim a Ondrou. Pak následovali Dan se Zmeškalem, bratři Matuškovi atd.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/namesti.jpg" alt="Ubytování v hotelu" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Náš hotel ve Straubingu</p>
          </div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/objevovanimesta.jpg" alt="Objevování města" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Objevování města</p>
          </div>
        </div>
        
        <p>
          U ubytování jsme se trochu zapotili, protože majitel neuměl anglicky a my zase divnou řecko-němčinou, ale nakonec jsme to zvládli a dostali jako bonus pokoj navíc! 🎉 Po ubytování jsme vyrazili hned na náměstí, kde jsme si dali jídlo.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/Ubytovani.jpg" alt="Náměstí ve Straubingu" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Krásné historické náměstí</p>
          </div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/jimepatek.jpg" alt="Páteční večeře" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Páteční večeře na náměstí</p>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">⚔️ Sobotní boje</h3>
        
        <p>
          První zápas turnaje nám začínal už v <strong>8:40</strong>, takže jsme si dali budíka na 7 ráno a v 8:00 jsme byli všichni už na stadionu. Čekal nás soupeř, na který jsme se moc těšili - <strong>Bayern Rangers</strong>! Soupeř složený z amerických vojáků, kteří slouží v Německu. 🇺🇸
        </p>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/rozvickapredzapasem.jpg" alt="Rozvička před zápasem" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Ranní rozvička před prvním zápasem</p>
        </div>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <p class="font-semibold">1. zápas: Lancers vs Bayern Rangers - <span class="text-red-600">0:3</span></p>
          <p class="text-sm text-gray-600 mt-1">Bohužel přišla hned v prvním zápase prohra. Po zápase převládal názor, že jsme na ně měli, ale hold nepoštěstilo se.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/fotkazezapasu.jpg" alt="Zápas na turnaji" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Bojujeme na ledě</p>
          </div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/fotkazezapasu1.jpg" alt="Akce před brankou" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Akce před brankou soupeře</p>
          </div>
        </div>
        
        <p>
          Další zápas byl proti <strong>Cologne Ravens</strong>. Mělo jít o hratelnějšího soupeře, ale dlouho se nám nedařilo jim dát gól a naopak jsme obdrželi první gól. My jsme ale pak zabojovali a otočili zápas!
        </p>
        
        <div class="bg-green-50 border-l-4 border-green-600 p-4 my-4">
          <p class="font-semibold">2. zápas: Lancers vs Cologne Ravens - <span class="text-green-600">2:1</span> ✅</p>
          <p class="text-sm text-gray-600 mt-1">Důležitá výhra! Otočili jsme nepříznivý stav.</p>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/fotkazezapasu2.jpg" alt="Zápas proti Cologne Ravens" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Vítězný zápas proti Cologne Ravens</p>
        </div>
        
        <p>
          Po tomto vítězství jsme zavítali na návštěvu k Honzovi Hanušovi, který hraje za Lancers, ale bydlí v Německu nedaleko Straubingu. Dorazili i Dan s Lukášem a Olča (manželka Honzy) nám navařila výborné jídlo, takže jsme si strašně moc pochutnali! 🍽️
        </p>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/dobrotyuhanusus.jpg" alt="Oběd u Hanušů" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Výborný oběd u Hanušů - děkujeme Olčo! 🍽️</p>
        </div>
        
        <p>
          Pak jsme se zase vrátili na stadion, kde nás ve skupině B čekal tým <strong>RSC Pilnach</strong>. Už jsme věděli, že i když bychom vyhráli, tak to na vítězství v turnaji už nebude, protože do semifinále postupovali 4 nejlepší týmy z 12 a nám vycházelo nejlépe 5. místo.
        </p>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <p class="font-semibold">3. zápas: Lancers vs RSC Pilnach - <span class="text-red-600">1:4</span></p>
          <p class="text-sm text-gray-600 mt-1">Nejlepší tým naší skupiny. Za stavu 2:1 jsme měli dvě velké šance na vyrovnání, ale pak nás zlomili.</p>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/fotkazezapasu4.jpg" alt="Boj o puk" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Tvrdý boj o každý puk</p>
        </div>
        
        <p>
          Po zápase jsme šli zase na náměstí dát si pivo a jídlo a brzo spát, protože nás v neděli čekalo semifinále o 5. až 8. místo na turnaji.
        </p>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🥇 Nedělní boje o umístění</h3>
        
        <p>
          Díky jediné výhře a dobrému skóre jsme si mohli trochu pospat. Semifinále a odveta s <strong>Bayern Rangers</strong> byla naplánována na 9:30. Že jsme dostali znovu Bayern Rangers bylo pro nás dobré - byl to soupeř, kterého jsme už znali, a hlavně i když jsme s nimi prohráli první zápas 3:0, tak jsme cítili, že jsme lepším týmem.
        </p>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
          <p class="font-semibold">Semifinále: Lancers vs Bayern Rangers - <span class="text-green-600">Výhra po nájezdech!</span> 🎯</p>
          <p class="text-sm text-gray-600 mt-1">Zápas byl velmi vyrovnaný a tak došlo na nájezdy. Po třech nájezdech na každé straně to bylo 1:1 a tak došlo na náhlou smrt. Soupeř při svém nájezdu neproměnil, ale náš <strong>Michal Koreš</strong> už jo!</p>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/spolecnasbayernranges.jpg" alt="Společná fotka s Bayern Rangers" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Společná fotka s Bayern Rangers po dramatickém zápase 🤝</p>
        </div>
        
        <p>
          Po zápase jsme nikam extra nešli, maximálně nakoupit nějaké jídlo, a tak jsme sledovali vyřazovací zápasy ostatních týmů, které nám určily posledního soupeře na turnaji - <strong>Bruno der Bär</strong>.
        </p>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <p class="font-semibold">O 5. místo: Lancers vs Bruno der Bär - <span class="text-red-600">2:6</span></p>
          <p class="text-sm text-gray-600 mt-1">Bohužel největší prohra na turnaji, ale nám to radost nezkazilo!</p>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/fotkazkaliny.jpg" alt="Dan a jeho selfie s týmem" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Po posledním zápase - i přes prohru stále s úsměvem! 😊</p>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🏅 Závěr turnaje</h3>
        
        <p class="text-lg">
          <strong>Turnaj to byl pro nás perfektní!</strong> Skvělé zážitky, přijatelné výsledky. Pro nás pěkné <span class="text-2xl font-bold text-red-600">6. místo</span> z 12 týmů. Počkali jsme na vyhlášení a pak hurá domů! 🚗💨
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/navyhlaseni1.jpg" alt="Vyhlášení výsledků" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Vyhlášení</p>
          </div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/navyhlaseni2.jpg" alt="Náš tým na vyhlášení" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">6. místo!</p>
          </div>
          <div class="rounded-lg overflow-hidden shadow-md">
            <img src="/images/Straubing/navyhlaseni3.jpg" alt="Společná fotka" class="w-full h-auto" />
            <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Spokojený tým</p>
          </div>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🎥 Video z turnaje</h3>
        
        <div class="rounded-lg overflow-hidden shadow-lg my-6">
          <video controls class="w-full h-auto">
            <source src="/images/Straubing/zabavamezizapasy.mp4" type="video/mp4">
            Váš prohlížeč nepodporuje video tag.
          </video>
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Zábava mezi zápasy - jak se bavit na turnaji! 🎉</p>
        </div>
        
        <div class="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 mt-6">
          <h4 class="text-lg font-bold mb-3">📊 Naše výsledky na turnaji:</h4>
          <ul class="space-y-2">
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Bayern Rangers</span>
              <span class="font-bold">0:3 ❌</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Cologne Ravens</span>
              <span class="font-bold">2:1 ✅</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>RSC Pilnach</span>
              <span class="font-bold">1:4 ❌</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Bayern Rangers (nájezdy)</span>
              <span class="font-bold">Výhra ✅</span>
            </li>
            <li class="flex justify-between items-center py-1">
              <span>Bruno der Bär</span>
              <span class="font-bold">2:6 ❌</span>
            </li>
          </ul>
          <div class="mt-4 pt-4 border-t border-white/30 text-center">
            <p class="text-2xl font-bold">Konečné umístění: 6. místo 🏅</p>
            <p class="text-sm mt-1 opacity-90">z 12 týmů</p>
          </div>
        </div>
        
        <p class="text-center text-gray-600 italic mt-6">
          Děkujeme všem hráčům za skvělou reprezentaci klubu! 🏒❤️
        </p>
      </div>
    `,
    allowComments: true,
    tags: ['výjezd', 'Německo', 'Straubing', 'turnaj', 'Bayern Rangers', 'mezinárodní hokej']
  }
];

// Funkce pro získání článku podle ID
export const getArticleById = (id) => {
  return articles.find(article => article.id === id);
};

// Funkce pro získání článku podle slug
export const getArticleBySlug = (slug) => {
  return articles.find(article => article.slug === slug);
};

// Funkce pro získání všech článků
export const getAllArticles = () => {
  return articles.sort((a, b) => b.publishedAt - a.publishedAt);
};

// Funkce pro získání doporučených článků
export const getFeaturedArticles = () => {
  return articles.filter(article => article.featured);
};

// Funkce pro získání článků podle kategorie
export const getArticlesByCategory = (category) => {
  return articles.filter(article => article.category === category);
};