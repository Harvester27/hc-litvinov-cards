# Přidání zápasu na web

Krátký postup pro další zápasy Lancers. Zdrojem výsledků, detailu a hráčských statistik je `src/data/matchData.js`; stránky je z něj většinou načítají automaticky.

## 1. Zapiš nebo aktualizuj zápas

- Najdi odpovídající pole v `src/data/matchData.js` (např. `khlaMatches2026_27` nebo `czechCupMatches2026_27`). Novému zápasu dej unikátní `id`, datum `d.m.rrrr`, čas `HH:mm`, `season`, `category`, `competition` (`khla`, `czech-cup`, `friendly`) a `stage`. Při výsledku **uprav existující plánovaný záznam se stejným ID**, nevytvářej druhý zápas.
- Před utkáním nastav `status: 'scheduled'`, `opponent` a případně `opponentLogo`. **Sestavy zatím nevyplňuj**: současné `getPlayerStats()` by nominovaným hráčům v soupisce předčasně přičetlo start.
- Po utkání nastav `status: 'completed'` a doplň skutečné `homeTeam`, `awayTeam`, `score` ve formátu **domácí:hosté**, `periods`, sestavy, `goals`, `penalties`, `sourceUrl` a krátké `summary`. Neznámý údaj raději vynech, než jej odhadovat.
- Každý gól má `time`, `team: 'home' | 'away'`, přesné jméno `scorer`, `assists` a průběžné `score` opět domácí:hosté. Nájezd označ `shootout: true` nebo jej ulož samostatně do `shootouts`; do gólů a asistencí hráčů se nezapočítá.

Jako vzor slouží zápas `czech-cup-glacier-wolves-2026-09-26` v `matchData.js`.

## 2. Zkontroluj statistiky

- `src/data/playerStats.js` počítá starty ze **skutečné sestavy Lancers** (`homeLineup`/`awayLineup`), góly z `goals[].scorer`, asistence z `goals[].assists`, tresty z `penalties` a brankářské výhry ze skóre. Jména Lancers musí odpovídat `src/data/playerData.js` (nebo tam zapsaným aliasům); hráče neduplikuj kvůli jiné přezdívce.
- Pokud máš úplný zápis střelců a asistencí, nastav `skaterStatsComplete: true`. Je-li neúplný, nastav `false`; body se pak z tohoto zápasu nepočítají. Pokud nejsou doložené zákroky, nastav `goalieStatsComplete: false` a nevymýšlej `saves` ani úspěšnost. Známý start a výhra brankáře se přesto započítají.
- Sečti góly v událostech, skóre a třetinách; ověř strany domácí/hosté a body jednotlivých hráčů. Tabulka `src/data/khlaStandings.js` se z výsledku nepřepočítává: aktualizuj ji jen podle doložené soutěžní tabulky.

## 3. Zobrazení a kontrola

- Úvodní stránka bere poslední odehrané a nejbližší plánované zápasy přes `getRecentMatches()` a `getUpcomingMatches()`; `/vysledky` ukazuje jen `completed`. Plánovaný zápas zůstane „příští“, dokud nepřepneš jeho `status` — datum samo nestačí. Když pro další sezonu přidáš nové zápasy, uprav i `src/data/matchFilters.js` a aktuálně napevno uvedenou sezonu v `src/app/page.js`.
- Pro nové logo zkontroluj soubor v `public/images/loga/`, `opponentLogo`, mapování v `src/components/matchDetailData.js` a `src/app/vysledky/page.js`. U jiné soutěže než KHLA zkontroluj také popisek příštího zápasu na úvodní stránce.
- Portréty Lancers nastavuje `photo` v `src/data/playerData.js`; fotky soupeřů páruje `src/data/opponentPlayers.js` podle týmu a plného jména. Soubory ukládej do `public/images/players/` a u převzatých fotografií poznamenej zdroj. Bez dostupné fotky nech zástupnou siluetu.
- Článek je volitelný: vytvoř `src/data/articles/article-*.js` a přidej jej do `src/data/articleData.js`. Výsledek a statistiky fungují i bez článku.
- Spusť `npm test` a `npm run build`. V prohlížeči ověř úvod, `/vysledky`, detail utkání, soupisku a součty statistik. Tipovačka má vlastní postup v `docs/tipovacka-vyhodnoceni.md`.
- Před nasazením zkontroluj větev, `git status` a aktuální `origin/main`. Pokud pracovní složka obsahuje další rozpracované změny, odděl aktualizaci zápasu do čistého worktree.
