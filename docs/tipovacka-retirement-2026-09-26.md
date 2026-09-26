# Odstranění Tipovačky – 26. září 2026

Na žádost provozovatele byla odstraněna stránka hry, její karta, profilové odkazy, metadata, administrace, bodovací knihovny a všechny tři serverové endpointy. Zbylé hry a správa účtu zůstávají dostupné. Původní herní testy nahradily kontroly uzavření hry a zachování přihlašování.

## Zachování dat a vypnutí přístupu

- Produkční přepínač `publicFeatures/tipovacka.visible` je `false`; klientský přístup k přepínači je zakázán.
- Existující herní dokumenty tvoří neveřejný archiv. Číst je může pouze ověřený administrátor `sanarycogames@outlook.cz`; všichni klienti včetně administrátora mají zakázané vytváření, změny i mazání.
- Vyhrazený servisní účet `tipovacka-vercel` je vypnutý. Nepotřebná produkční proměnná `FIREBASE_SERVICE_ACCOUNT_JSON` byla odstraněna z Vercelu.
- Před změnou i po uzavření databáze byly ověřeny dva tikety a dva záznamy bodů. Počty i otisky názvů a časů vytvoření/změny dokumentů zůstaly shodné. Výsledky kol ani pracovní náhledy v produkci nebyly uložené.
- Zásady soukromí popisují neveřejný archiv ukončených her a zachovávají postup žádosti o přístup či výmaz.

## Ověření

- `npm test`: 12/12 – zbývající identita hráčů a zápasová data.
- `npm run test:rules`: 9/9 – zákaz přístupu hráčů a zápisů do archivu, čtení správcem, zachování ostatních pravidel.
- `npm run test:auth-browser`: 14/14 – registrace a opakované odeslání, profil, čtyři zbývající hry, odstraněné odkazy, HTTP 404 pro stránku a GET/POST všech tří API.
- Mobil 390 px a desktop 1440 px bez vodorovného přetečení.
- Produkční sestavení a cílený lint upravených komponent prošly. Existující lint upozornění v nesouvisejících souborech zůstala.
- Pravidla byla ověřena kompilací Firebase a zveřejněna jako ruleset `81c20844-e83e-4039-b1a0-d7766e5b45fb`. Anonymní produkční čtení všech čtyř herních kolekcí vrací 403.

Původní protokol spuštění a postup vyhodnocení jsou označené jako historické dokumenty; nejsou návodem k provozu současného webu.
