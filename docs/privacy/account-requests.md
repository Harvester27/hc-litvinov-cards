# Vyřizování žádostí o osobní údaje

Kontaktní adresa zveřejněná na webu: `sanarycogames@outlook.cz`. Tlačítka v účtu otevřou e-mailový program návštěvníka. Žádost vznikne teprve tehdy, když uživatel zprávu odešle; web nyní nemaže účty automaticky.

## Žádost o smazání účtu

1. Ověřit vlastnictví účtu odpovědí na e-mail uložený ve Firebase Authentication. Nespoléhat jen na odesílací adresu zprávy nebo ID účtu uvedené v těle.
2. Zaznamenat datum žádosti a potvrdit její přijetí. Vyřídit ji bez zbytečného odkladu, zpravidla do jednoho měsíce. Pokud část údajů musí zůstat z právního důvodu, vysvětlit co a proč.
3. V projektu Firebase `lancers-web-cards-2026` vyhledat ověřené UID. Před odstraněním Auth účtu odstranit odpovídající dokumenty `lancersCardsPlayers/{uid}`, `tipovackaPreview/{uid}`, `tipovackaStandings/{uid}` a vyhodnocení `tipovackaRounds/{roundId}/evaluations/{uid}` pro všechna kola. U každé revize `tipovackaRounds/{roundId}/revisions/{revision}` odstranit pouze položku `evaluationChanges[uid]` dotčeného hráče; při použití Admin SDK použít `FieldPath('evaluationChanges', uid)`, nikoli cestu sestavenou tečkami. Historii ostatních hráčů zachovat. Zkontrolovat `tipovackaAdminPreviews`: každý dočasný náhled, jehož pole `evaluations` obsahuje UID žadatele, lze odstranit celý; správce následně vytvoří nový náhled. Vypršení `expiresAt` samo dokument nesmaže. Zkontrolovat i všechny dokumenty v `comments`, kde `userId == uid`, včetně skrytých komentářů (`isDeleted == true`). Samotný výsledek zápasu a jeho změny bez vazby na hráčský účet mohou zůstat jako sportovní údaj.
4. Ověřit i případný dokument `leaderboard/{uid}`, podstrom `users/{uid}` včetně **všech podkolekcí** a soubory ve Firebase Storage přiřazené k UID. Smazání rodičovského dokumentu Firestore samo podkolekce nesmaže.
5. Pokud se v projektu vyskytují starší data, zkontrolovat další kolekce a odkazy na UID (například `likedBy` u cizích komentářů) a odstranit/anonymizovat je. U účtu správce zkontrolovat také `actorUid`, `actorEmail` a další údaje autora v náhledech, výsledcích a revizích; případnou potřebu zachování konkrétního údaje zdůvodnit jednotlivě. Důvod opravy je volný text, proto jej také zkontrolovat na osobní údaje žadatele. Rozsah ověřit přímo v projektu, ne pouze podle aktuálního rozhraní.
6. Teprve potom odstranit uživatele ve Firebase Authentication. Ověřit, že účet ani navázaná data již nejsou dostupná. Potvrdit dokončení žadateli; neslibovat okamžité odstranění záloh poskytovatelů.

## Žádost o kopii údajů nebo opravu

Po stejném ověření identity poskytnout export skutečně uložených údajů z Firebase Authentication, Firestore a případných dalších úložišť projektu, včetně tipů, vyhodnocení a změn bodů všech kol Tipovačky. Zahrnout vlastní záznamy hráče v administrátorských náhledech a historii revizí; ze sdílených dokumentů vyjmout údaje jiných hráčů. Nevydávat jen profil Lancers Card, pokud má účet i komentáře či starší data. Opravy veřejných údajů hráčů a článků řešit podle konkrétního záznamu. Chybu skutečného výsledku Tipovačky řešit kontrolovanou opravou výsledku s náhledem a historií, nikoli ručním připsáním celého skóre.

## Průběžná správa dat Tipovačky

Společná tabulka obsahuje zobrazované jméno, body a počet vyhodnocených kol a je přístupná ostatním přihlášeným hráčům s ověřeným účtem a nastaveným jménem. Tikety a podrobné rozpisy čte pouze vlastník a správce `sanarycogames@outlook.cz`. Administrátorské náhledy a historie oprav jsou soukromé pro správce. Při ruční kontrole nepotřebných dat lze odstraňovat expirované pracovní náhledy, ale neplést si je s historií zveřejněných oprav. Web zatím nemá automatické mazání podle pevného retenčního plánu ani automatické vyřízení žádosti o výmaz.

Zdroje: [Evropská komise – žádosti jednotlivců](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/dealing-requests-individuals_en), [Firestore – podkolekce](https://firebase.google.com/docs/firestore/data-model), [Firebase – odstranění uživatelských dat](https://firebase.google.com/docs/extensions/official/delete-user-data).
