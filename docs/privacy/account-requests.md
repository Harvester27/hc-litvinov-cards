# Vyřizování žádostí o osobní údaje

Kontaktní adresa zveřejněná na webu: `sanarycogames@outlook.cz`. Tlačítka v účtu otevřou e-mailový program návštěvníka. Žádost vznikne teprve tehdy, když uživatel zprávu odešle; web nyní nemaže účty automaticky.

## Žádost o smazání účtu

1. Ověřit vlastnictví účtu odpovědí na e-mail uložený ve Firebase Authentication. Nespoléhat jen na odesílací adresu zprávy nebo ID účtu uvedené v těle.
2. Zaznamenat datum žádosti a potvrdit její přijetí. Vyřídit ji bez zbytečného odkladu, zpravidla do jednoho měsíce. Pokud část údajů musí zůstat z právního důvodu, vysvětlit co a proč.
3. V projektu Firebase `lancers-web-cards-2026` vyhledat ověřené UID. Před odstraněním Auth účtu odstranit odpovídající dokumenty `lancersCardsPlayers/{uid}`, `tipovackaPreview/{uid}` a `tipovackaStandings/{uid}` a všechny dokumenty v `comments`, kde `userId == uid`, včetně skrytých komentářů (`isDeleted == true`).
4. Ověřit i případný dokument `leaderboard/{uid}`, podstrom `users/{uid}` včetně **všech podkolekcí** a soubory ve Firebase Storage přiřazené k UID. Smazání rodičovského dokumentu Firestore samo podkolekce nesmaže.
5. Pokud se v projektu vyskytují starší data, zkontrolovat další kolekce a odkazy na UID (například `likedBy` u cizích komentářů) a odstranit/anonymizovat je. Rozsah ověřit přímo v projektu, ne pouze podle aktuálního rozhraní.
6. Teprve potom odstranit uživatele ve Firebase Authentication. Ověřit, že účet ani navázaná data již nejsou dostupná. Potvrdit dokončení žadateli; neslibovat okamžité odstranění záloh poskytovatelů.

## Žádost o kopii údajů nebo opravu

Po stejném ověření identity poskytnout export skutečně uložených údajů z Firebase Authentication, Firestore a případných dalších úložišť projektu. Nevydávat jen profil Lancers Card, pokud má účet i komentáře či starší data. Opravy veřejných údajů hráčů a článků řešit podle konkrétního záznamu.

Zdroje: [Evropská komise – žádosti jednotlivců](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/dealing-requests-individuals_en), [Firestore – podkolekce](https://firebase.google.com/docs/firestore/data-model), [Firebase – odstranění uživatelských dat](https://firebase.google.com/docs/extensions/official/delete-user-data).
