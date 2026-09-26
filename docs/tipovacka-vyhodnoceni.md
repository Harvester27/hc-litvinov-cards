# Vyhodnocení Tipovačky

> Historický dokument. Tipovačka byla 26. 9. 2026 odstraněna z webu a její serverové funkce vypnuty. Následující postup už není použitelný. Uložená data zůstala v neveřejném archivu pouze ke čtení správcem.

## Postup správce

1. Otevři `/games/tipovacka` pod ověřeným účtem `sanarycogames@outlook.cz` s nastaveným jménem a otevři zadání výsledku. Hru mohou hrát všichni přihlášení uživatelé s ověřeným účtem a nastaveným jménem; zadání výsledku a kontrola všech tiketů patří pouze tomuto administrátorskému účtu.
2. Po skončení zápasu zapiš konečné skóre po prodloužení **bez vítězného nájezdu**, střelce z vypsané pětice, kanadské body vybrané trojice, tým prvního gólu a hráče, kteří nenastoupili. Prázdný seznam střelců znamená, že z vypsané pětice neskóroval nikdo. Výslovně potvrď, že jde o konečný výsledek.
3. Vytvoř serverový náhled bodů. Zkontroluj celé skóre, údaje o hráčích i rozpis pěti otázek u každého uloženého tiketu. Náhled nemění tabulku ani veřejný výsledek. Jakýkoli neplatný tiket zablokuje náhled i zveřejnění na serveru; nelze jej přeskočit a zveřejnit jen ostatní hráče.
4. Po uzávěrce lze zkontrolovaný náhled potvrdit ke zveřejnění. Serverový náhled má platnost 15 minut a je vázán na správce, konkrétní výsledek, tikety a verzi vyhodnocení. Pokud se podklady mezitím změnily nebo náhled vypršel, vytvoř a zkontroluj nový náhled. Uzávěrka sama neznamená, že zápas skončil; konečnost výsledku potvrzuje správce.
5. Výsledek, rozpis každého tiketu a přepočet tabulky se uloží v jedné databázové transakci. Opakování publikace nepřipíše body znovu. Po zveřejnění se zobrazí skutečné skóre a každý hráč uvidí jen svůj tiket, body a důvody anulování u každé otázky. Společná tabulka ukazuje jména, body a počet vyhodnocených kol.

## Kontrolovaná oprava

1. Otevři administraci již zveřejněného výsledku, oprav údaje a vyplň konkrétní důvod opravy. Znovu potvrď konečný výsledek.
2. Vytvoř nový serverový náhled. U každého hráče porovnej původní a opravené body i jejich rozdíl. Oprava vychází z uzamčených tiketů zveřejněného kola, nikoli z nově zadaných tipů.
3. Potvrď opravu až po kontrole náhledu. Jedna transakce uloží novou revizi výsledku a rozpisů; do tabulky přičte pouze `nové body − původní body`. Počet odehraných kol se nezvyšuje. Zastaralý nebo již použitý náhled nelze použít k opakovanému připsání.
4. Administrátorská historie uchová předchozí a nový výsledek, důvod, čas, správce a změny bodů jednotlivých hráčů. Hráči mají přístup ke svému aktuálnímu rozpisu, nikoli k cizím tiketům nebo soukromé historii správce.

## Anulování otázek

- Pokud vybraný střelec nenastoupí, anuluje se pouze vklad na tohoto hráče. Ostatní vklady se vyhodnotí samostatně.
- Tip **Nikdo z uvedené pětice** se anuluje, pokud nenastoupí ani jeden z pěti vypsaných střelců. Jestliže alespoň jeden nastoupí, tip vyhraje, když z pětice nikdo neskóruje, a jinak prohraje. Gól jiného hráče Lancers tip neovlivní.
- Jestliže z trojice pro kanadské body nastoupí nejvýše jeden hráč, anuluje se celá otázka pro všechny tipy. Při alespoň dvou účastnících se anuluje tip na nepřítomného hráče; shoda na nejvyšším počtu bodů také anuluje otázku.
- Při výsledku 0:0 se anuluje otázka prvního gólu. Každé anulování znamená 0 bodů, tedy žádný zisk ani ztrátu příslušného vkladu.

## Časy a ochrana dat

- Příjem a změny tiketů končí 26. září 2026 v 19:15 pražského času. Uzávěrku vynucují pravidla Firestore; čas v prohlížeči slouží jen k zobrazení stavu.
- Hráč smí do uzávěrky měnit pouze svůj tiket. Po uzávěrce nebo zveřejnění jsou tikety uzamčené. Ani administrátor v klientu neupravuje cizí tiket.
- Server na Vercelu používá tajnou proměnnou `FIREBASE_SERVICE_ACCOUNT_JSON`. Obsahuje klíč samostatného účtu `tipovacka-vercel`, který má pouze role `roles/datastore.user` a `roles/firebaseauth.viewer`. Klíč se nesmí uložit do repozitáře ani poslat do prohlížeče.
- Firestore odděluje soukromé tikety a rozpisy od společné tabulky. Běžný hráč nemůže vypsat cizí tikety, číst cizí rozpis ani zapisovat body, výsledky, náhledy nebo historii oprav. Správce má přístup ke všem tiketům a rozpisům; zveřejnění a opravy provádí výhradně server po ověření účtu.
- Vypršení náhledu ukončí jeho použitelnost pro publikaci, nikoli automaticky jeho uchování v databázi. Nepotřebné expirované náhledy lze po kontrole odstranit správcovským postupem. Neodstraňovat tím historii skutečně zveřejněných revizí.
- Jedna atomická publikace podporuje nejvýše 200 tiketů. Při překročení se vyhodnocení bezpečně zastaví; navýšení kapacity vyžaduje samostatnou úpravu serveru, nikoli přeskočení nadlimitních hráčů. Správa dalších kol zůstává navazující etapou.

## Uložené dokumenty

- `tipovackaPreview/{uid}`: jeden tiket pro současné kolo.
- `tipovackaRounds/{roundId}`: zveřejněný skutečný výsledek a číslo revize.
- `tipovackaRounds/{roundId}/evaluations/{uid}`: uzamčený tip, body po otázkách a celkový výsledek hráče.
- `tipovackaStandings/{uid}`: součet bodů a počet vyhodnocených kol.
- `tipovackaAdminPreviews/{previewId}`: neveřejný serverový náhled, správce, otisk podkladů a doba platnosti.
- `tipovackaRounds/{roundId}/revisions/{revision}`: neveřejná historie zveřejnění a oprav včetně původních a nových výsledků a změn bodů hráčů.

Při exportu nebo výmazu účtu je třeba zahrnout i dokumenty vyhodnocení v podkolekcích; viz [postup žádostí o osobní údaje](privacy/account-requests.md).
