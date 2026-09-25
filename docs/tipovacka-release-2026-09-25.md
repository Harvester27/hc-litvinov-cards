# Tipovačka – protokol veřejného spuštění 25. září 2026

Kolo: Litvínov Lancers × HC Glacier Wolves, `glacier-wolves-2026-09-26`.
Uzávěrka: 26. září 2026 v 19:15 Europe/Prague (`2026-09-26T17:15:00Z`).
Cílová adresa: <https://www.litvinov-lancers.cz/games/tipovacka>.

Veřejné spuštění dokončeno 25. září 2026 v 17:13 pražského času. Testovací výsledky a opravy proběhly výhradně v emulátorech; produkční zápas zůstal bez výsledku.

## Dokončené automatické kontroly

| Kontrola | Příkaz | Výsledek |
| --- | --- | --- |
| Jednotkové a dosavadní regresní testy | `npm test` | **PASS 36/36**, bez přeskočených testů |
| Pravidla a serverové API v emulátorech | `npm run test:emulators` | **PASS 21/21**: 14 pravidlových testů, 6 API scénářů a jejich nadřazený test |
| Audit produkčních závislostí | `npm audit --omit=dev` | **0 high, 0 critical, 8 moderate** |

Jednotkové testy zahrnují 17 scénářů bodování, 7 scénářů publikace a bezpečné konfigurace serveru a 12 existujících regresních kontrol obsahu webu. Nová pravidla anulování jsou pokrytá pro nulovou i jedinou účast, více účastníků a zachování původního bodování.

Emulátorové kontroly používají dva hráče a administrátora. Ověřují vlastní a cizí tikety, ověřený účet a jméno, uzávěrku, neplatná data, soukromí rozpisů a historie, sdílenou tabulku, zákaz klientských změn bodů a výsledků i veřejný přepínač karty. Serverové scénáře ověřují administrátorskou autorizaci, blokování neplatného tiketu, náhled konečného výsledku, odmítnutí zastaralého náhledu, jediné atomické připsání bodů a opravu s rozdílem bodů a historií. Původní formát administrátorského tiketu zůstává podporovaný.

### Jak se testuje přesná uzávěrka

Firestore Emulator neumožňuje nastavit `request.time`. Test proto nejprve ověří, že produkční konstanta `1790442900000` přesně odpovídá `TIPOVACKA_ROUND.startsAt`. Ve třech izolovaných demo projektech potom změní **pouze výraz uzávěrky v testované kopii pravidel** na `request.time + 1 sekunda`, `request.time` a `request.time − 1 sekunda`. Tím deterministicky ověří povolení před uzávěrkou a zákaz přesně při ní i po ní. Ostatní pravidla včetně serverového času zápisu zůstávají stejná. Produkční soubor obsahuje původní pevnou uzávěrku.

Emulátory používají výhradně lokální adresy `127.0.0.1:8080` (Firestore) a `127.0.0.1:9099` (Auth) a demo projekty; testovací serverový čas je omezen na neprodukční konfiguraci s oběma lokálními emulátory.

### Závislosti

Bezpečné aktualizace odstranily hlášené produkční problémy high/critical. Next.js zůstal na 15.5.25 a Firebase Admin SDK na 13.10.0; cílený override aktualizuje PostCSS na 8.5.28. Osm zbývajících produkčních položek moderate souvisí s tranzitivními závislostmi Firebase Admin SDK. Jejich úplná automatická oprava vyžaduje samostatně ověřený hlavní upgrade SDK. Uvedené počty platí pro produkční závislosti, nikoli pro vývojové nástroje.

## Dokončené produkční spuštění

| Položka | Stav / doklad |
| --- | --- |
| Skutečné UI se dvěma hráči a administrátorem, mobil a počítač | **PASS 9/9** (`npm run test:browser`), Chromium, viewporty 390×844 a 1440×1000; screenshoty vizuálně ověřeny, bez chyb prohlížeče |
| Finální produkční build | **PASS** (`npm run build`), zachovány dosavadní neblokující lint warnings jinde na webu |
| Nasazení a ověření pravidel Firebase | **PASS**, ruleset `44ef55ee-a445-4ee1-b0fd-7abcce688bb2`, 25. 9. 2026 15:07:50 UTC; stažený obsah shodný s otestovaným souborem |
| Nasazení webu na produkční doménu | **PASS**, Vercel `dpl_7u97jU4mg1YviZwGWWjkLwLggcqa`, stav Ready, alias `www.litvinov-lancers.cz` |
| Kontrola zachování původního administrátorského tiketu | **PASS**, původní tiket načten v živém rozhraní; serverové `updateTime` zůstává `2026-09-25T13:36:45.126977Z`, tedy před začátkem této úlohy, a je shodné s `createTime` (žádná aktualizace dokumentu) |
| Odstranění dočasného lokálního souboru s Firebase klíčem | **PASS**, konkrétní dočasný JSON odstraněn a ověřena jeho nepřítomnost; produkční tajná proměnná zachována |
| Zveřejnění karty pomocí `publicFeatures/tipovacka.visible` jako poslední krok | **PASS**, `true` nastaveno až po živých kontrolách, `2026-09-25T15:13:07.984712Z`; karta se objevila i nepřihlášenému návštěvníkovi |
| Kontrola živé hry a odkaz na nasazení / commit | **PASS**, commit `9712d55` na `origin/main`, přihlašovací vstup, vlastní admin tiket a administrace; anonymní GET tickets i POST preview/publish vrací 401 |

## Omezení a navazující práce

- Jedna atomická publikace podporuje nejvýše **200 tiketů**. Vyšší počet vyhodnocení bezpečně zablokuje; žádný hráč se tiše nepřeskočí. Navýšení kapacity vyžaduje samostatnou úpravu a ověření.
- Správa dalších zápasových kol zůstává navazující etapou. Současná kolekce tiketů náleží pouze tomuto kolu.
- Administrátor musí potvrdit, že zadává konečný výsledek. Samotná uzávěrka nezaručuje konec zápasu.
- Nepotřebné expirované serverové náhledy se zatím neodstraňují automaticky; historie publikovaných revizí musí zůstat zachována.

Postup publikace a opravy: [Vyhodnocení Tipovačky](tipovacka-vyhodnoceni.md).
