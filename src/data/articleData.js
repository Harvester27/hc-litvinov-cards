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
    featuredImage: '/images/clanky/HHLitvinov2025.jpeg',
    featured: true,
    views: 0,
    likes: 0,
    content: `
      <div class="space-y-6">
        <!-- Hero sekce s gradientem -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-gray-900 p-8 text-white shadow-2xl">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-bold">29.-31. srpna 2025</span>
              <span class="px-3 py-1 bg-yellow-500/20 backdrop-blur rounded-full text-sm font-bold">🏟️ Zimní stadion Litvínov</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black mb-4">HH Cup Litvínov 2025</h1>
            <p class="text-xl text-white/90 mb-6">Mezinárodní hokejový turnaj</p>
            
            <!-- Rychlý přehled -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div class="text-3xl font-black">4</div>
                <div class="text-sm text-white/70">týmy</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div class="text-3xl font-black">10</div>
                <div class="text-sm text-white/70">zápasů</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div class="text-3xl font-black">3</div>
                <div class="text-sm text-white/70">dny</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-xl p-4 text-center border-2 border-white/30">
                <div class="text-3xl font-black">4.</div>
                <div class="text-sm text-white/70">místo</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Účastníci turnaje -->
        <div class="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white">🏒</span>
            Účastníci turnaje
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all text-center group">
              <img src="/images/loga/lancers-logo.png" alt="HC Litvínov Lancers" class="w-28 h-28 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div class="font-bold text-red-600">HC Litvínov Lancers</div>
              <div class="text-sm text-gray-500">🇨🇿 Domácí tým</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all text-center group">
              <img src="/images/loga/AlphaA.png" alt="Alpha Team A" class="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div class="font-bold">Alpha Team A</div>
              <div class="text-sm text-gray-500">🇩🇪 Berlín</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all text-center group">
              <img src="/images/loga/AlphaB.png" alt="Alpha Team B" class="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div class="font-bold">Alpha Team B</div>
              <div class="text-sm text-gray-500">🇩🇪 Berlín</div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all text-center group">
              <img src="/images/loga/Berlin.png" alt="Berlin All Stars" class="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div class="font-bold">Berlin All Stars</div>
              <div class="text-sm text-gray-500">🇩🇪 Berlín</div>
            </div>
          </div>
        </div>

        <!-- Timeline turnaje -->
        <div class="relative">
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 to-gray-300"></div>
          
          <!-- PÁTEK -->
          <div class="relative mb-12">
            <div class="absolute left-6 w-5 h-5 bg-red-600 rounded-full border-4 border-white shadow-lg"></div>
            <div class="ml-16">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-sm font-bold text-white bg-blue-600 px-3 py-1 rounded-full">PÁTEK 29.8.</span>
                <h3 class="text-2xl font-black text-gray-900">Zahájení turnaje</h3>
              </div>
              
              <p class="text-gray-600 mb-4">
                Turnaj jsme zahajovali večerním zápasem proti <strong>Alpha Team B</strong>, kde dostal první příležitost brankář <strong>Jiří Morávek</strong>.
              </p>

              <!-- Sestava -->
              <div class="bg-gray-50 rounded-xl p-4 mb-4">
                <h5 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span class="text-red-600">📋</span> Základní sestava
                </h5>
                <div class="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span class="font-semibold text-gray-700">🥅 Brankář:</span>
                    <div class="mt-1">Jiří Morávek</div>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">🛡️ Obránci:</span>
                    <div class="mt-1">Bratři Belingerové, Kocourek, Šalanda</div>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">⚡ Útočníci:</span>
                    <div class="mt-1">Matějovič, Materna, Švarc, Toman, Černý</div>
                  </div>
                </div>
              </div>

              <!-- Výsledky pátku -->
              <div class="space-y-3">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-1" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-l-4 border-red-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/lancers-logo.png" alt="Lancers" class="w-12 h-12" />
                      <div>
                        <div class="font-bold">HC Litvínov Lancers</div>
                        <div class="text-sm text-gray-500">20:30</div>
                      </div>
                    </div>
                    <div class="text-3xl font-black text-red-600">5:7</div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">Alpha Team B</div>
                        <div class="text-sm text-gray-500">Porážka</div>
                      </div>
                      <img src="/images/loga/AlphaB.png" alt="Alpha B" class="w-8 h-8" />
                    </div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-2" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/AlphaA.png" alt="Alpha A" class="w-8 h-8" />
                      <div>
                        <div class="font-bold">Alpha Team A</div>
                        <div class="text-sm text-gray-500">21:30</div>
                      </div>
                    </div>
                    <div class="text-3xl font-black text-gray-600">2:0</div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">Berlin All Stars</div>
                      </div>
                      <img src="/images/loga/Berlin.png" alt="Berlin" class="w-8 h-8" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- SOBOTA -->
          <div class="relative mb-12">
            <div class="absolute left-6 w-5 h-5 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
            <div class="ml-16">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-sm font-bold text-white bg-green-600 px-3 py-1 rounded-full">SOBOTA 30.8.</span>
                <h3 class="text-2xl font-black text-gray-900">Skupinové boje & Semifinále</h3>
              </div>

              <!-- Změny v sestavě -->
              <div class="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-4 mb-4">
                <div class="font-semibold text-blue-900 mb-2">🔄 Změny v sestavě</div>
                <ul class="text-sm space-y-1 text-blue-800">
                  <li>➖ Václav Materna (pracovní povinnosti)</li>
                  <li>➕ Michal Klečka (obránce)</li>
                  <li>➕ Tomáš Kodrle (brankář - zapůjčen od North Blades)</li>
                </ul>
              </div>

              <!-- Hvězda dne -->
              <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 mb-4 border border-yellow-300">
                <div class="flex items-center gap-4">
                  <div class="text-5xl">⭐</div>
                  <div>
                    <div class="font-black text-xl text-gray-900">Václav Matějovič</div>
                    <div class="text-yellow-700 font-semibold">4 góly proti Alpha Team A!</div>
                  </div>
                </div>
              </div>

              <!-- Skupinové zápasy -->
              <h4 class="font-bold text-gray-700 mb-3">Základní skupina:</h4>
              <div class="space-y-3 mb-6">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-3" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-l-4 border-green-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/lancers-logo.png" alt="Lancers" class="w-12 h-12" />
                      <div>
                        <div class="font-bold">HC Litvínov Lancers</div>
                        <div class="text-sm text-gray-500">08:00</div>
                      </div>
                    </div>
                    <div class="text-3xl font-black text-green-600">5:1</div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">Alpha Team A</div>
                        <div class="text-sm text-green-600 font-semibold">✓ Výhra</div>
                      </div>
                      <img src="/images/loga/AlphaA.png" alt="Alpha A" class="w-8 h-8" />
                    </div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-4" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/Berlin.png" alt="Berlin" class="w-8 h-8" />
                      <div>
                        <div class="font-bold">Berlin All Stars</div>
                        <div class="text-sm text-gray-500">09:00</div>
                      </div>
                    </div>
                    <div class="text-3xl font-black text-gray-600">2:3</div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">Alpha Team B</div>
                      </div>
                      <img src="/images/loga/AlphaB.png" alt="Alpha B" class="w-8 h-8" />
                    </div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-5" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-l-4 border-green-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/Berlin.png" alt="Berlin" class="w-8 h-8" />
                      <div>
                        <div class="font-bold">Berlin All Stars</div>
                        <div class="text-sm text-gray-500">10:00</div>
                      </div>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="text-3xl font-black text-green-600">4:5</div>
                      <div class="text-xs text-gray-500">po prodloužení</div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">HC Litvínov Lancers</div>
                        <div class="text-sm text-green-600 font-semibold">✓ Výhra</div>
                      </div>
                      <img src="/images/loga/lancers-logo.png" alt="Lancers" class="w-12 h-12" />
                    </div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-6" class="block bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/AlphaA.png" alt="Alpha A" class="w-8 h-8" />
                      <div>
                        <div class="font-bold">Alpha Team A</div>
                        <div class="text-sm text-gray-500">14:00</div>
                      </div>
                    </div>
                    <div class="text-3xl font-black text-gray-600">6:5</div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-bold">Alpha Team B</div>
                      </div>
                      <img src="/images/loga/AlphaB.png" alt="Alpha B" class="w-8 h-8" />
                    </div>
                  </div>
                </a>
              </div>

              <!-- Semifinále -->
              <h4 class="font-bold text-gray-700 mb-3">Semifinále:</h4>
              <div class="space-y-3">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-7" class="block bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all">
                  <div class="text-center text-purple-600 font-bold text-sm mb-2">SEMIFINÁLE 1</div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/AlphaA.png" alt="Alpha A" class="w-8 h-8" />
                      <div class="font-bold">Alpha Team A</div>
                    </div>
                    <div class="text-3xl font-black text-gray-600">2:5</div>
                    <div class="flex items-center gap-4">
                      <div class="font-bold">Berlin All Stars</div>
                      <img src="/images/loga/Berlin.png" alt="Berlin" class="w-8 h-8" />
                    </div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-8" class="block bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-2 border-red-300">
                  <div class="text-center text-purple-600 font-bold text-sm mb-2">SEMIFINÁLE 2</div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/AlphaB.png" alt="Alpha B" class="w-8 h-8" />
                      <div class="font-bold">Alpha Team B</div>
                    </div>
                    <div class="text-3xl font-black text-red-600">4:3</div>
                    <div class="flex items-center gap-4">
                      <div class="font-bold">HC Litvínov Lancers</div>
                      <img src="/images/loga/lancers-logo.png" alt="Lancers" class="w-12 h-12" />
                    </div>
                  </div>
                  <div class="text-center text-red-600 text-sm mt-2">❌ Porážka - postup do zápasu o 3. místo</div>
                </a>
              </div>
            </div>
          </div>

          <!-- NEDĚLE -->
          <div class="relative">
            <div class="absolute left-6 w-5 h-5 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>
            <div class="ml-16">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-sm font-bold text-white bg-amber-600 px-3 py-1 rounded-full">NEDĚLE 31.8.</span>
                <h3 class="text-2xl font-black text-gray-900">Boje o umístění</h3>
              </div>

              <div class="space-y-3">
                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-9" class="block bg-gradient-to-r from-amber-50 to-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all border-2 border-amber-400">
                  <div class="text-center text-amber-600 font-bold text-sm mb-2">🥉 O 3. MÍSTO</div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/lancers-logo.png" alt="Lancers" class="w-12 h-12" />
                      <div class="font-bold">HC Litvínov Lancers</div>
                    </div>
                    <div class="flex flex-col items-center">
                      <div class="text-3xl font-black text-red-600">4:5</div>
                      <div class="text-xs text-gray-500">po nájezdech</div>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="font-bold">Alpha Team A</div>
                      <img src="/images/loga/AlphaA.png" alt="Alpha A" class="w-8 h-8" />
                    </div>
                  </div>
                  <div class="mt-3 bg-red-50 rounded-lg p-3 text-sm">
                    <div class="font-semibold text-red-900 mb-1">📊 Průběh zápasu:</div>
                    <div class="text-red-700">První gól ✓ → Soupeř na 3:1 → Vyrovnání 4:4 → Nájezdy 2:2 → Náhlá smrt ✗</div>
                  </div>
                </a>

                <a href="/turnaje/hobby-cup-litvinov-2025/zapas-10" class="block bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border-2 border-yellow-500">
                  <div class="text-center text-yellow-700 font-black text-sm mb-2">🏆 FINÁLE</div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img src="/images/loga/Berlin.png" alt="Berlin" class="w-8 h-8" />
                      <div class="font-bold">Berlin All Stars</div>
                    </div>
                    <div class="text-3xl font-black text-gray-700">1:2</div>
                    <div class="flex items-center gap-4">
                      <div class="font-bold">Alpha Team B</div>
                      <img src="/images/loga/AlphaB.png" alt="Alpha B" class="w-8 h-8" />
                    </div>
                  </div>
                  <div class="text-center text-yellow-700 font-semibold text-sm mt-2">🥇 Alpha Team B vítězem turnaje!</div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Konečné pořadí -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
          <h3 class="text-3xl font-black mb-8 text-center">🏆 Konečné pořadí</h3>
          
          <div class="grid md:grid-cols-4 gap-4 mb-8">
            <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div class="text-4xl mb-2">🥇</div>
              <img src="/images/loga/AlphaB.png" alt="Alpha Team B" class="w-16 h-16 mx-auto mb-2" />
              <div class="font-black text-lg">Alpha Team B</div>
              <div class="text-sm opacity-90">🇩🇪 Berlín</div>
            </div>
            
            <div class="bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div class="text-4xl mb-2">🥈</div>
              <img src="/images/loga/Berlin.png" alt="Berlin All Stars" class="w-16 h-16 mx-auto mb-2" />
              <div class="font-black text-lg">Berlin All Stars</div>
              <div class="text-sm opacity-90">🇩🇪 Berlín</div>
            </div>
            
            <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-center transform hover:scale-105 transition-all">
              <div class="text-4xl mb-2">🥉</div>
              <img src="/images/loga/AlphaA.png" alt="Alpha Team A" class="w-16 h-16 mx-auto mb-2" />
              <div class="font-black text-lg">Alpha Team A</div>
              <div class="text-sm opacity-90">🇩🇪 Berlín</div>
            </div>
            
            <div class="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-center transform hover:scale-105 transition-all border-2 border-white/30">
              <div class="text-4xl mb-2">4️⃣</div>
              <img src="/images/loga/lancers-logo.png" alt="HC Litvínov Lancers" class="w-24 h-24 mx-auto mb-2" />
              <div class="font-black text-lg">HC Litvínov Lancers</div>
              <div class="text-sm opacity-90">🇨🇿 Domácí tým</div>
            </div>
          </div>

          <!-- Naše statistiky -->
          <div class="bg-white/10 backdrop-blur rounded-xl p-6">
            <h4 class="text-xl font-bold mb-4">📊 Naše výsledky</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="font-semibold mb-2">Skupinová fáze:</div>
                <ul class="space-y-1 text-sm">
                  <li class="flex justify-between">
                    <span>vs Alpha Team B</span>
                    <span class="text-red-400">5:7 ❌</span>
                  </li>
                  <li class="flex justify-between">
                    <span>vs Alpha Team A</span>
                    <span class="text-green-400">5:1 ✅</span>
                  </li>
                  <li class="flex justify-between">
                    <span>vs Berlin All Stars</span>
                    <span class="text-green-400">5:4 OT ✅</span>
                  </li>
                </ul>
              </div>
              <div>
                <div class="font-semibold mb-2">Play-off:</div>
                <ul class="space-y-1 text-sm">
                  <li class="flex justify-between">
                    <span>Semifinále vs Alpha Team B</span>
                    <span class="text-red-400">3:4 ❌</span>
                  </li>
                  <li class="flex justify-between">
                    <span>O 3. místo vs Alpha Team A</span>
                    <span class="text-red-400">4:5 SO ❌</span>
                  </li>
                </ul>
                <div class="mt-3 pt-3 border-t border-white/20">
                  <div class="flex justify-between font-bold">
                    <span>Celková bilance:</span>
                    <span>2 výhry - 3 porážky</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Co dál? -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div class="flex items-center gap-4">
            <div class="text-5xl">🤝</div>
            <div>
              <h4 class="text-xl font-bold mb-2">Příští zápas díky novým kontaktům!</h4>
              <p>
                Díky navázaným kontaktům z turnaje odehrajeme <strong>13. září od 16:00</strong> v Litvínově 
                přátelský zápas s týmem <strong>Berlin All Stars</strong>! Přijďte nás podpořit! 🏒
              </p>
            </div>
          </div>
        </div>

        <!-- CTA tlačítko -->
        <div class="text-center">
          <a href="/turnaje/hobby-cup-litvinov-2025" class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
            <span>Zobrazit kompletní statistiky turnaje</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>

        <!-- Poděkování -->
        <div class="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 text-center border-2 border-gray-200">
          <p class="text-gray-600 text-lg">
            <span class="font-bold text-gray-900">Děkujeme</span> všem hráčům za bojovnost 
            a týmu <span class="font-bold text-blue-600">North Blades</span> za zapůjčení brankáře! 💪❤️
          </p>
        </div>
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