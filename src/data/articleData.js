// Databáze článků HC Litvínov Lancers
export const articles = [
  {
    id: 'hh-cup-litvinov-2025',
    title: 'HH Cup Litvínov 2025: Dramatické boje o medaile',
    slug: 'hh-cup-litvinov-2025',
    excerpt: 'Domácí turnaj přinesl spoustu dramatických zápasů! Proti třem berlínským týmům jsme bojovali o medaile až do posledního nájezdu.',
    category: 'Turnaje',
    author: {
      name: 'Tým HC Lancers',
      id: 'hc-lancers'
    },
    date: '1. září 2025',
    publishedAt: new Date('2025-09-01T10:00:00'),
    image: '🏆',
    featuredImage: null,
    featured: true,
    views: 0,
    likes: 0,
    content: `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 mb-6">
          <p class="text-xl font-bold text-gray-800 mb-2">
            🏒 HH Cup Litvínov 2025
          </p>
          <p class="text-gray-600">
            <strong>Kdy:</strong> 29.-31. srpna 2025<br/>
            <strong>Kde:</strong> Zimní stadion Litvínov 🏟️<br/>
            <strong>Umístění:</strong> <span class="text-2xl font-bold text-gray-700">4. místo</span>
          </p>
        </div>
        
        <p>
          Na konci srpna jsme ve dnech <strong>29.-31. srpna</strong> hostili domácí turnaj, kterého se účastnily <strong>4 týmy</strong>. Tři týmy přijely z Berlína - <strong>Alpha Team A</strong>, <strong>Alpha Team B</strong> a <strong>Berlin All Stars</strong> - a samozřejmě domácí <strong>HC Litvínov Lancers</strong>. Čekal nás víkend plný hokeje a dramatických momentů!
        </p>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🎯 Pátek 29.8. - Zahájení turnaje</h3>
        
        <p>
          Turnaj jsme zahajovali večerním zápasem proti <strong>Alpha Team B</strong>, kde dostal první příležitost brankář <strong>Jiří Morávek</strong>, který s námi začal chodit na tréninkové ledy už v sezóně 2024/2025.
        </p>

        <div class="bg-white rounded-lg p-4 border border-gray-200 my-4">
          <h5 class="font-bold text-gray-900 mb-3">📋 Sestava na první zápas</h5>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <p class="font-semibold text-red-600 mb-2">🥅 Brankář:</p>
              <ul class="text-sm space-y-1">
                <li>• <strong>Jiří Morávek</strong> (debut na turnaji!)</li>
              </ul>
            </div>
            <div>
              <p class="font-semibold text-red-600 mb-2">🛡️ Obránci:</p>
              <ul class="text-sm space-y-1">
                <li>• <a href="/profil/belinger-jindrich" class="text-amber-400 hover:text-amber-300 underline">Jindřich Belinger</a></li>
                <li>• <a href="/profil/belinger-jiri" class="text-amber-400 hover:text-amber-300 underline">Jiří Belinger</a></li>
                <li>• <a href="/profil/kocourek-ondrej" class="text-amber-400 hover:text-amber-300 underline">Ondřej Kocourek</a></li>
                <li>• <a href="/profil/salanda-jiri" class="text-amber-400 hover:text-amber-300 underline">Jiří Šalanda</a> <span class="text-xs text-blue-600">(překvapivě na obraně!)</span></li>
              </ul>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-3">
            Trochu překvapivě na obraně nastoupil <strong>Jiří Šalanda</strong>, který normálně hraje v útoku, ale pro nedostatek obránců byl vybrán na obranu. 😊
          </p>
        </div>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-1" class="text-blue-600 hover:text-blue-800 underline">
                  1. zápas: Lancers vs Alpha Team B - <span class="text-red-600">5:7</span>
                </a>
              </p>
              <p class="text-sm text-gray-600 mt-1">Zápas jsme začali obdrženým zbytečným gólem a celkově jsme půl zápasu nehráli to, co bychom měli. Začali jsme hrát až v druhé půlce, ale to už bylo pozdě. V kabině převládal názor, že jsme si zápas prohráli hned na začátku.</p>
            </div>
          </div>
        </div>

        <p>Paralelně s naším zápasem se odehrál druhý páteční zápas:</p>

        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
          <p class="font-semibold">
            <a href="/turnaje/hobby-cup-litvinov-2025/zapas-2" class="text-blue-600 hover:text-blue-800 underline">
              Alpha Team A vs Berlin All Stars - <span class="text-gray-600">2:0</span>
            </a>
          </p>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">⚔️ Sobota 30.8. - Boje ve skupině</h3>

        <p>
          Druhý den pokračoval turnaj dalšími zápasy ve skupině, ale museli jsme se obejít bez <strong>Vaška Materny</strong>, který musel na šichtu. Výborně ho ale kvalitativně nahradil <strong>Michal Klečka</strong>, i když byl umístěn na obranu.
        </p>

        <div class="bg-blue-50 rounded-lg p-4 my-6">
          <h4 class="font-semibold text-blue-900 mb-3">🔄 Změny v sestavě:</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <span class="text-red-600">➖</span>
              <strong>Václav Materna</strong> (pracovní povinnosti)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600">➕</span>
              <strong>Michal Klečka</strong> (obránce)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-green-600">➕</span>
              <strong>Tomáš Kodrle</strong> (brankář - zapůjčen od North Blades)
            </li>
          </ul>
          <p class="text-xs text-blue-600 mt-3 italic">
            Tomáše nám dohodili North Blades, takže jim patří díky, že díky nim pro nás neskončil turnaj blamáží a pomohli nám do brány sehnat brankáře v době, kdy naši brankáři jsou zranění nebo v práci!
          </p>
        </div>

        <div class="bg-green-50 border-l-4 border-green-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-3" class="text-blue-600 hover:text-blue-800 underline">
                  2. zápas: Lancers vs Alpha Team A - <span class="text-green-600">5:1</span> ✅
                </a>
              </p>
              <p class="text-sm text-gray-600 mt-1">V zápase řádil <strong>Václav Matějovič</strong>, který si připsal 4 góly! Také výborný výkon ukázal další debutant v naší bráně <strong>Tomáš Kodrle</strong>.</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
          <h5 class="font-bold text-yellow-900 mb-2">⭐ Hvězda zápasu</h5>
          <div class="flex items-center gap-4">
            <div class="text-4xl">🎯</div>
            <div>
              <p class="font-bold text-lg">Václav Matějovič</p>
              <p class="text-yellow-800">4 góly v jednom zápase!</p>
            </div>
          </div>
        </div>

        <p>Další skupinové zápasy v sobotu:</p>

        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
          <p class="font-semibold">
            <a href="/turnaje/hobby-cup-litvinov-2025/zapas-4" class="text-blue-600 hover:text-blue-800 underline">
              Berlin All Stars vs Alpha Team B - <span class="text-gray-600">2:3</span>
            </a>
          </p>
        </div>

        <p>
          V posledním zápase skupiny nás čekal tým <strong>Berlin All Stars</strong>, který v turnaji měl jen porážky.
        </p>

        <div class="bg-green-50 border-l-4 border-green-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-5" class="text-blue-600 hover:text-blue-800 underline">
                  3. zápas: Berlin All Stars vs Lancers - <span class="text-green-600">4:5 po prodloužení</span> 🎯
                </a>
              </p>
              <p class="text-sm text-gray-600 mt-1">Zápas byl pěkně dramatický! Po celý zápas nevedl žádný tým o více než 1 gól. V závěru za stavu 4:4 jsme ubránili po dvou našich vyloučeních. Zápas došel do prodloužení, které jsme zvládli lépe a za vítězství jsme brali 2 body!</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
          <p class="font-semibold">
            <a href="/turnaje/hobby-cup-litvinov-2025/zapas-6" class="text-blue-600 hover:text-blue-800 underline">
              Alpha Team A vs Alpha Team B - <span class="text-gray-600">6:5</span>
            </a>
          </p>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🏆 Semifinále</h3>

        <p>
          Na závěr sobotního dne následovalo semifinále. První semifinále mezi Alpha Team A a Berlin All Stars skončilo překvapivým vítězstvím Berlin All Stars 2:5. My jsme vyfasovali tým z našeho prvního zápasu - <strong>Alpha Team B</strong>.
        </p>

        <div class="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
          <p class="font-semibold">
            <a href="/turnaje/hobby-cup-litvinov-2025/zapas-7" class="text-blue-600 hover:text-blue-800 underline">
              Semifinále 1: Alpha Team A vs Berlin All Stars - <span class="text-gray-600">2:5</span>
            </a>
          </p>
        </div>

        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-8" class="text-blue-600 hover:text-blue-800 underline">
                  Semifinále 2: Alpha Team B vs Lancers - <span class="text-red-600">4:3</span>
                </a>
              </p>
              <p class="text-sm text-gray-600 mt-1">Zápas byl opět velmi vyrovnaný, ale i přes velmi bojovný výkon jsme nedokázali uspět. Prohra v semifinále neznamenala vyřazení z turnaje, ale hodila nás to do zápasu o třetí místo.</p>
            </div>
          </div>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🥉 Neděle 31.8. - Boj o bronz</h3>

        <p>
          Zápas o třetí místo proti týmu <strong>Alpha Team A</strong> se odehrál v neděli už od <strong>9:00 hodin</strong>.
        </p>

        <div class="bg-amber-50 border-l-4 border-amber-600 p-4 my-4">
          <div>
            <p class="font-semibold mb-2">
              <a href="/turnaje/hobby-cup-litvinov-2025/zapas-9" class="text-blue-600 hover:text-blue-800 underline">
                Zápas o 3. místo: Lancers vs Alpha Team A - <span class="text-red-600">4:5 po nájezdech</span>
              </a>
            </p>
            <div class="space-y-2 text-sm text-gray-700">
              <p>📊 <strong>Průběh zápasu:</strong></p>
              <ul class="ml-4 space-y-1">
                <li>• Vstřelili jsme první gól ✅</li>
                <li>• Soupeř odskočil na 3:1 ⚠️</li>
                <li>• Dokázali jsme srovnat na 4:4! 💪</li>
                <li>• Došlo na nájezdy 🎯</li>
              </ul>
              <p class="mt-3 font-semibold">🎯 <strong>Nájezdy:</strong></p>
              <ul class="ml-4 space-y-1">
                <li>• Po třech nájezdech: 2:2</li>
                <li>• Náhlá smrt: soupeř proměnil, my ne 😔</li>
              </ul>
            </div>
          </div>
        </div>

        <p>Finále turnaje:</p>

        <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
          <p class="font-semibold">
            <a href="/turnaje/hobby-cup-litvinov-2025/zapas-10" class="text-blue-600 hover:text-blue-800 underline">
              Finále: Berlin All Stars vs Alpha Team B - <span class="text-yellow-600">1:2</span> 🏆
            </a>
          </p>
          <p class="text-sm text-gray-600 mt-1">Alpha Team B se stal vítězem turnaje!</p>
        </div>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">📊 Konečné pořadí turnaje</h3>

        <div class="bg-white rounded-lg shadow-lg p-4 my-6">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-300">
                <th class="text-left p-2 font-bold text-gray-800">Pořadí</th>
                <th class="text-left p-2 font-bold text-gray-800">Tým</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200">
                <td class="p-2">🥇 1. místo</td>
                <td class="p-2 font-semibold">Alpha Team B 🇩🇪</td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="p-2">🥈 2. místo</td>
                <td class="p-2 font-semibold">Berlin All Stars 🇩🇪</td>
              </tr>
              <tr class="border-b border-gray-200">
                <td class="p-2">🥉 3. místo</td>
                <td class="p-2 font-semibold">Alpha Team A 🇩🇪</td>
              </tr>
              <tr class="bg-red-50">
                <td class="p-2 font-bold text-red-600">4. místo</td>
                <td class="p-2 font-bold">HC Litvínov Lancers 🇨🇿</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">💪 Shrnutí turnaje</h3>

        <p>
          Samozřejmě došlo ke zklamání z konečného 4. místa, ale turnaj se hrál v <strong>přátelském duchu</strong>, který přinesl mnoho vyrovnaných zápasů. I přes tento neúspěch jsme si turnaj užili a hlavně jsme poznali nové týmy a navázali nové kontakty!
        </p>

        <div class="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 mt-6">
          <h4 class="text-lg font-bold mb-3">📊 Naše výsledky na turnaji:</h4>
          <ul class="space-y-2">
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Alpha Team B (pátek)</span>
              <span class="font-bold">5:7 ❌</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Alpha Team A (sobota)</span>
              <span class="font-bold">5:1 ✅</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Berlin All Stars (sobota)</span>
              <span class="font-bold">5:4 po prodloužení ✅</span>
            </li>
            <li class="flex justify-between items-center py-1 border-b border-white/20">
              <span>Alpha Team B (semifinále)</span>
              <span class="font-bold">3:4 ❌</span>
            </li>
            <li class="flex justify-between items-center py-1">
              <span>Alpha Team A (o 3. místo)</span>
              <span class="font-bold">4:5 po nájezdech ❌</span>
            </li>
          </ul>
          <div class="mt-4 pt-4 border-t border-white/30 text-center">
            <p class="text-2xl font-bold">Konečné umístění: 4. místo</p>
            <p class="text-sm mt-1 opacity-90">3 výhry, 3 prohry</p>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-4 my-6">
          <p class="font-semibold text-blue-900 mb-2">🤝 Co dál?</p>
          <p class="text-blue-800 text-sm">
            Díky novým kontaktům z turnaje odehrajeme <strong>13. září od 16:00</strong> v Litvínově přátelský zápas s týmem <strong>Berlin All Stars</strong>! Přijďte nás podpořit! 🏒
          </p>
        </div>

        <div class="text-center mt-8">
          <a href="/turnaje/hobby-cup-litvinov-2025" class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold">
            Zobrazit kompletní statistiky turnaje
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>

        <p class="text-center text-gray-600 italic mt-6">
          Děkujeme všem hráčům za bojovnost a North Blades za zapůjčení brankáře! 💪❤️
        </p>
      </div>
    `,
    allowComments: true,
    tags: ['turnaj', 'Litvínov', 'HH Cup', 'Berlín', 'domácí turnaj', 'Alpha Team', 'Berlin All Stars']
  },
  {
    id: 'dva-turnaje-litvinov-ostrov-2025',
    title: 'Víkend nabitý turnaji!',
    slug: 'dva-turnaje-litvinov-ostrov-2025',
    excerpt: 'Čeká nás náročný víkend! Rozdělíme síly na dva fronty - turnaj v Litvínově proti německým týmům a výjezd do Ostrova nad Ohří proti českým soupeřům.',
    category: 'Turnaje',
    author: {
      name: 'Tým HC Lancers',
      id: 'hc-lancers'
    },
    date: '27. srpna 2025',
    publishedAt: new Date('2025-08-27T10:00:00'),
    image: '🏆',
    featuredImage: null,
    featured: true,
    views: 0,
    likes: 0,
    content: `
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 mb-6">
          <p class="text-xl font-bold text-gray-800 mb-2">
            🗓️ Turnajový dvojmaraton 29.-31. srpna 2025
          </p>
          <p class="text-gray-600">
            <strong>🏠 Domácí turnaj:</strong> Litvínov (pátek - neděle)<br/>
            <strong>🚗 Výjezd:</strong> Ostrov nad Ohří (sobota)<br/>
            <strong>📊 Celkem zápasů:</strong> 11 zápasů! 5 v Litvínově a 6 v Ostrově nad Ohří
          </p>
        </div>
        
        <p>
          Čeká nás opravdu <strong>náročný víkend plný hokeje</strong>! Rozdělíme síly na dva fronty - zatímco jedna část týmu bude bojovat na domácím turnaji v Litvínově proti týmům z Německa, včetně <strong>Berlína</strong>, druhá půlka kádru vyrazí reprezentovat klub do <strong>Ostrova nad Ohří</strong>, kde na nás čekají české týmy s kterými jsme nikdy v historii nehráli jako Slavia Karlovy Vary, Dynamo Klatovy, Osli Příbram či Kocouři Hrušice.
        </p>

        <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">🏟️ Domácí turnaj v Litvínově</h3>
        
        <p>
          Od pátečního večera do nedělního dopoledne hostíme na našem ledě <strong>mezinárodní turnaj</strong> s účastí tří německých týmů. Jedním z nich bude tým z <strong>Berlína</strong>, což slibuje zajímavé mezinárodní konfrontace. Turnaj bude probíhat systémem každý s každým, následovat budou semifinále a zápasy o umístění.
        </p>

        <div class="bg-blue-50 rounded-lg p-4 my-6">
          <h4 class="font-semibold text-blue-900 mb-3">📅 Rozpis zápasů v Litvínově:</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <span class="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">PÁ</span>
              <strong>29.8. 20:00</strong> - První zápas turnaje
            </li>
            <li class="flex items-center gap-2">
              <span class="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">SO</span>
              <strong>30.8. 8:00</strong> - Ranní zápas
            </li>
            <li class="flex items-center gap-2">
              <span class="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">SO</span>
              <strong>30.8. 10:00</strong> - Druhý sobotní zápas
            </li>
            <li class="flex items-center gap-2">
              <span class="bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-bold">SO</span>
              <strong>30.8. 15:00-16:00</strong> - Semifinále
            </li>
            <li class="flex items-center gap-2">
              <span class="bg-amber-600 text-white px-2 py-0.5 rounded text-xs font-bold">NE</span>
              <strong>31.8. 8:00-10:00</strong> - Zápasy o umístění
            </li>
          </ul>
        </div>

        <h4 class="text-xl font-bold text-gray-900 mt-6 mb-3">📋 Sestava pro Litvínov</h4>
        
        <p class="mb-4">
          Pro oba turnaje máme vyrovnanou sestavu, takže bude zajímavé sledovat, kterému týmu se povede lepší umístění :)
        </p>

        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <h5 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              🥅 Brankáři
            </h5>
            <ul class="space-y-1 text-sm">
              <li>• <strong>Tomáš Kodrle</strong> (brankář SO-NE)</li>
              <li>• <strong>Jiří Morávek</strong> (páteční zápas)</li>
            </ul>
            <p class="text-xs text-blue-600 mt-2 italic">Děkujeme týmu North Blades za pomoc s půjčením brankáře Tomáše Kodrle!</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <h5 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              🛡️ Obránci
            </h5>
            <ul class="space-y-1 text-sm">
              <li>• <a href="/profil/kocourek-ondrej" class="text-amber-400 hover:text-amber-300 underline">Ondřej Kocourek</a></li>
              <li>• <a href="/profil/belinger-jindrich" class="text-amber-400 hover:text-amber-300 underline">Jindřich Belinger</a></li>
              <li>• <a href="/profil/belinger-jiri" class="text-amber-400 hover:text-amber-300 underline">Jiří Belinger</a></li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h5 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            ⚡ Útočníci
          </h5>
          <div class="grid md:grid-cols-2 gap-3">
            <ul class="space-y-1 text-sm">
              <li>• <a href="/profil/svarc-stanislav" class="text-amber-400 hover:text-amber-300 underline">Stanislav Švarc</a></li>
              <li>• <a href="/profil/svarc-jan" class="text-amber-400 hover:text-amber-300 underline">Jan Švarc</a></li>
              <li>• <a href="/profil/toman-gustav" class="text-amber-400 hover:text-amber-300 underline">Gustav Toman</a></li>
              <li>• <strong>Václav Matějovič</strong></li>
            </ul>
            <ul class="space-y-1 text-sm">
              <li>• <a href="/profil/cerny-ladislav" class="text-amber-400 hover:text-amber-300 underline">Ladislav Černý</a></li>
              <li>• <a href="/profil/materna-vaclav" class="text-amber-400 hover:text-amber-300 underline">Václav Materna</a> (pátek)</li>
              <li>• <a href="/profil/salanda-jiri" class="text-amber-400 hover:text-amber-300 underline">Jiří Šalanda</a></li>
              <li>• <a href="/profil/schubada-jan" class="text-amber-400 hover:text-amber-300 underline">Jan Schubada</a> (neděle)</li>
            </ul>
          </div>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-6">
          <p class="font-semibold text-yellow-900 mb-2">📢 Hledáme posily!</p>
          <p class="text-yellow-800 text-sm">
            Pro některé <strong>sobotní zápasy</strong> ještě hledáme hráče na doplnění sestavy. Pokud máte zájem přidat se k nám, ozvěte se!
          </p>
        </div>

        <div class="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-6 my-8">
          <h3 class="text-2xl font-bold mb-4">🏔️ Turnaj v Ostrově nad Ohří</h3>
          
          <p class="mb-4">
            Paralelně s domácím turnajem vyšleme <strong>výběr hráčů</strong> na turnaj do Ostrova nad Ohří. Je to pro nás <strong>premiéra na tomto turnaji</strong>, takže jsme zvědaví, na jakou úroveň českých týmů narazíme.
          </p>

          <div class="bg-white/10 backdrop-blur rounded-lg p-4">
            <p class="font-semibold mb-2">📍 Turnaj Ostrov nad Ohří</p>
            <p class="text-sm">
              <strong>Datum:</strong> Sobota 30. srpna 2025<br/>
              <strong>Místo:</strong> Zimní stadion Ostrov nad Ohří<br/>
              <strong>Soupeři:</strong> České týmy (Slavia Karlovy Vary, Dynamo Klatovy, Osli Příbram, Kocouři Hrušice a další)
            </p>
          </div>
        </div>

        <h4 class="text-xl font-bold text-gray-900 mt-6 mb-3">🚌 Výprava do Ostrova</h4>
        
        <p class="mb-4">
          Do Ostrova vyrazí sestava složená z hráčů, takto:
        </p>

        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="bg-amber-50 rounded-lg p-4 border border-amber-300">
            <h5 class="font-bold text-amber-900 mb-2">🥅 Brankář</h5>
            <p class="text-sm">• <strong>Michal Florian</strong></p>
          </div>

          <div class="bg-amber-50 rounded-lg p-4 border border-amber-300">
            <h5 class="font-bold text-amber-900 mb-2">🛡️ Obránci</h5>
            <ul class="text-sm space-y-1">
              <li>• Roman Šimek</li>
              <li>• Luboš Coufal</li>
              <li>• Jan Hanuš</li>
              <li>• Tomáš Tureček</li>
            </ul>
          </div>

          <div class="bg-amber-50 rounded-lg p-4 border border-amber-300">
            <h5 class="font-bold text-amber-900 mb-2">⚡ Útočníci</h5>
            <ul class="text-sm space-y-1">
              <li>• <strong>Petr Štěpanovský</strong></li>
              <li>• Aleš Kuřitka</li>
              <li>• Oliver Štěpanovský</li>
              <li>• <strong>Michal Najman</strong></li>
              <li>• Jan Schubada</li>
              <li>• Marian Dlugopolský</li>
            </ul>
          </div>
        </div>

        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-6">
          <p class="font-semibold text-red-900 mb-2">⚠️ Náročná logistika</p>
          <p class="text-red-800 text-sm">
            Do Ostrova to máme z Litvínova 70km ale trochu zajímavosti se najde v tom, že Honza Schubada projevil zájem hrát po tak náročném turnaji hrát ještě v neděli, pokud se to povede může mít z jednoho víkendu dvě medaile.
          </p>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">💪 Těšíme se na výzvu!</h3>
        
        <p>
          Bude to <strong>opravdová zkouška sil</strong> - hrát paralelně dva turnaje vyžaduje široký kádr a dobrou organizaci. Věříme ale, že si s tím poradíme a na obou turnajích zanecháme dobrý dojem!
        </p>

        <p class="mt-4">
          <strong>Držte nám palce!</strong> Průběžné informace z obou turnajů budeme přinášet na našich sociálních sítích a samozřejmě i zde na webu.
        </p>

        <div class="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 mt-8 text-center">
          <p class="text-2xl font-black mb-2">POJĎME NA TO, LANCERS!</p>
          <p class="text-sm opacity-90">Sledujte nás celý víkend • 29.-31. srpna 2025</p>
        </div>
      </div>
    `,
    allowComments: true,
    tags: ['turnaj', 'Litvínov', 'Ostrov nad Ohří', 'mezinárodní hokej', 'Německo', 'Berlín', 'víkend', 'dvojmaraton']
  },
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
          Tým se o turnaji dozvěděl cca měsíc předem, protože se to manažer týmu dozvěděl až když zahlédnul už rozlosování turnaje. 😅 Hráče to oslovilo, ale ne v dostatečném počtu. Když ale generální manažer viděl, jak se hráči těší, tak se musel snažit! 
        </p>
        
        <p>
          Naštěstí nebylo těžké najít hráče, aby nás doplnili. Stačila jedna zpráva přes WhatsApp Danu Kačeňákovi a ten s radostí dorazil hned i se Zmeškalem! Tímto jsme byli kompletní:
        </p>
        
        <div class="bg-gray-100 rounded-lg p-4 my-4">
          <p class="font-semibold text-gray-800 mb-2">🏒 Naše sestava na turnaj:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• <strong>9 hráčů z Lancers</strong> (Tomáš Tureček, Jiří Šalanda, Luboš Coufal, Oliver Štěpanovský, Jiří a Lukáš Matuškovi, Michal Koreš, Jan Hanuš a brankář Kuba Seidler)</li>
            <li>• Dan Kačeňák a Lukáš Zmeškal (Gurmáni)</li>
            <li>• Pepa (Kuby kamarád)</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🚗 Páteční příjezd</h3>
        
        <p>
          Do Straubingu jsme vyrazili všichni už v pátek, protože jsme se chtěli dobře vyspat a vlastně poznat trochu město. Jako první do Straubingu na hotel dorazilo auto s Turym, Šalim, Coufim a Ondrou. Pak následovali Dan se Zmeškalem, bratři Matuškovi atd.
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
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">1. zápas: Lancers vs Bayern Rangers - <span class="text-red-600">0:3</span></p>
              <p class="text-sm text-gray-600 mt-1">Bohužel přišla hned v prvním zápase prohra. Po zápase převládal názor, že jsme na ně měli, ale hold nepoštěstilo se.</p>
            </div>
            <img src="/images/loga/BayernRangers.png" alt="Bayern Rangers" class="w-16 h-16 object-contain opacity-50" />
          </div>
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
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">2. zápas: Lancers vs Cologne Ravens - <span class="text-green-600">2:1</span> ✅</p>
              <p class="text-sm text-gray-600 mt-1">Důležitá výhra! Otočili jsme nepříznivý stav.</p>
            </div>
            <img src="/images/loga/cologne-ravens.png" alt="Cologne Ravens" class="w-16 h-16 object-contain opacity-50" />
          </div>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/fotkazezapasu2.jpg" alt="Zápas proti Cologne Ravens" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Vítězný zápas proti Cologne Ravens</p>
        </div>
        
        <p>
          Po tomto vítězství jsme zavítali na návštěvu k Honzovi Hanušovi, který hraje za Lancers, ale bydlí v Německu nedaleko Straubingu. Dorazili i Dan s Lukášem a Olča (manželka Honzy) nám navařila výborné jídlo, takže jsme si strašně moc pochutnali! 🍽️
        </p>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/dobrotyuhanusu.jpg" alt="Oběd u Hanušů" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Výborný oběd u Hanušů - děkujeme Olčo! 🍽️</p>
        </div>
        
        <p>
          Pak jsme se zase vrátili na stadion, kde nás ve skupině B čekal tým <strong>RSC Pilnach</strong>. Už jsme věděli, že i kdybychom vyhráli, tak to na vítězství v turnaji už nebude, protože do semifinále postupovali 4 nejlepší týmy z 12 a nám vycházelo nejlépe 5. místo.
        </p>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">3. zápas: Lancers vs RSC Pilnach - <span class="text-red-600">1:4</span></p>
              <p class="text-sm text-gray-600 mt-1">Nejlepší tým naší skupiny. Za stavu 2:1 jsme měli dvě velké šance na vyrovnání, ale pak nás zlomili.</p>
            </div>
            <img src="/images/loga/RSCPilnach.png" alt="RSC Pilnach" class="w-16 h-16 object-contain opacity-50" />
          </div>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/fotkazezapasu4.jpg" alt="Boj o puk" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Tvrdý boj o každý puk</p>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">📊 Konečná tabulka skupiny B</h3>
        
        <div class="bg-white rounded-lg shadow-lg p-4 my-6 overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-300">
                <th class="text-left p-2 font-bold text-gray-800">Pořadí</th>
                <th class="text-left p-2 font-bold text-gray-800">Tým</th>
                <th class="text-center p-2 font-bold text-gray-800">Z</th>
                <th class="text-center p-2 font-bold text-gray-800">Skóre</th>
                <th class="text-center p-2 font-bold text-gray-800">+/-</th>
                <th class="text-center p-2 font-bold text-gray-800">Body</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded font-bold text-sm">1.</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-3">
                    <img src="/images/loga/RSCPilnach.png" alt="RSC Pilnach" class="w-8 h-8 object-contain" />
                    <span class="font-semibold">RSC Pilnach</span>
                  </div>
                </td>
                <td class="text-center p-2">3</td>
                <td class="text-center p-2 font-semibold">9:2</td>
                <td class="text-center p-2 text-green-600 font-bold">+7</td>
                <td class="text-center p-2 font-bold text-lg">6</td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-2 py-1 rounded font-bold text-sm">2.</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-3">
                    <img src="/images/loga/BayernRangers.png" alt="Bayern Rangers" class="w-8 h-8 object-contain" />
                    <span class="font-semibold">Bayern Rangers</span>
                  </div>
                </td>
                <td class="text-center p-2">3</td>
                <td class="text-center p-2 font-semibold">8:2</td>
                <td class="text-center p-2 text-green-600 font-bold">+6</td>
                <td class="text-center p-2 font-bold text-lg">4</td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50 bg-red-50">
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-2 py-1 rounded font-bold text-sm">3.</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-3">
                    <img src="/images/loga/lancers-logo.png" alt="Litvínov Lancers" class="w-8 h-8 object-contain" />
                    <span class="font-semibold">Litvínov Lancers</span>
                    <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded">NÁŠ TÝM</span>
                  </div>
                </td>
                <td class="text-center p-2">3</td>
                <td class="text-center p-2 font-semibold">3:8</td>
                <td class="text-center p-2 text-red-600 font-bold">-5</td>
                <td class="text-center p-2 font-bold text-lg">2</td>
              </tr>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="bg-gray-600 text-white px-2 py-1 rounded font-bold text-sm">4.</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-3">
                    <img src="/images/loga/cologne-ravens.png" alt="Cologne Ravens" class="w-8 h-8 object-contain" />
                    <span class="font-semibold">Cologne Ravens</span>
                  </div>
                </td>
                <td class="text-center p-2">3</td>
                <td class="text-center p-2 font-semibold">1:9</td>
                <td class="text-center p-2 text-red-600 font-bold">-8</td>
                <td class="text-center p-2 font-bold text-lg">0</td>
              </tr>
            </tbody>
          </table>
          <div class="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
            <p><strong>Vysvětlivky:</strong> Z = Zápasy, +/- = Rozdíl branek, Body = Počet bodů (2 za výhru)</p>
            <p class="mt-1 text-xs">Ze skupiny postupovali první dva týmy do semifinále o 1.-4. místo.</p>
          </div>
        </div>
        
        <p>
          Po zápase jsme šli zase na náměstí dát si pivo a jídlo a brzy spát, protože nás v neděli čekalo semifinále o 5. až 8. místo na turnaji.
        </p>
        
        <h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">🥇 Nedělní boje o umístění</h3>
        
        <p>
          Díky jediné výhře a dobrému skóre jsme si mohli trochu pospat. Semifinále a odveta s <strong>Bayern Rangers</strong> byla naplánována na 9:30. Že jsme dostali znovu Bayern Rangers bylo pro nás dobré - byl to soupeř, kterého jsme už znali, a hlavně i když jsme s nimi prohráli první zápas 3:0, tak jsme cítili, že jsme lepším týmem.
        </p>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">Semifinále: Lancers vs Bayern Rangers - <span class="text-green-600">Výhra po nájezdech!</span> 🎯</p>
              <p class="text-sm text-gray-600 mt-1">Zápas byl velmi vyrovnaný a tak došlo na nájezdy. Po třech nájezdech na každé straně to bylo 1:1 a tak došlo na náhlou smrt. Soupeř při svém nájezdu neproměnil, ale náš <strong>Michal Koreš</strong> už jo!</p>
            </div>
            <img src="/images/loga/BayernRangers.png" alt="Bayern Rangers" class="w-16 h-16 object-contain opacity-50" />
          </div>
        </div>

        <div class="rounded-lg overflow-hidden shadow-md my-6">
          <img src="/images/Straubing/spolecnasbayernranges.jpg" alt="Společná fotka s Bayern Rangers" class="w-full h-auto" />
          <p class="text-xs text-gray-500 text-center p-2 bg-gray-50">Společná fotka s Bayern Rangers po dramatickém zápase 🤝</p>
        </div>
        
        <p>
          Po zápase jsme nikam extra nešli, maximálně nakoupit nějaké jídlo, a tak jsme sledovali vyřazovací zápasy ostatních týmů, které nám určily posledního soupeře na turnaji - <strong>Bruno der Bär</strong>.
        </p>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-4 my-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">O 5. místo: Lancers vs Bruno der Bär - <span class="text-red-600">2:6</span></p>
              <p class="text-sm text-gray-600 mt-1">Bohužel největší prohra na turnaji, ale nám to radost nezkazilo!</p>
            </div>
            <img src="/images/loga/Bruno.png" alt="Bruno der Bär" class="w-16 h-16 object-contain opacity-50" />
          </div>
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