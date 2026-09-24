# Web HC Litvínov Lancers

## Účty a Firebase

Web používá nový Firebase projekt `lancers-web-cards-2026` (tarif Blaze). Starý projekt `hc-litvinov` a jeho účty zůstaly nedotčené; nové účty vznikají od nuly. Konfigurace webové aplikace je v `src/lib/firebase.js`.

- Přihlášení pro celý web používá Firebase Authentication s e-mailem a heslem. Po registraci je nutné potvrdit e-mail.
- Účet a reset hesla jsou na `/profil` a `/auth`. Stav přihlášení zprostředkovává `src/hooks/useAuth.js`.
- Google přihlášení je zapnuté. Veřejný kontaktní e-mail v Google OAuth je `stepanovsky21@outlook.cz`; při potřebě lze tlačítko skrýt proměnnou `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=false` při sestavení.
- Pravidla databáze jsou ve `firestore.rules`, indexy komentářů ve `firestore.indexes.json`. Nasazují se do **nového** projektu příkazem `firebase deploy --only firestore --project lancers-web-cards-2026`.
- Staré klientské stránky sbírky, odměn a herních žebříčků jsou přesměrované v `next.config.ts`. Nová Lancers Card zatím nemá hotovou online ekonomiku ani zápasy; jejich zápisy jsou pravidly Firestore zablokované do doby, než vznikne serverová logika.

## Lokální spuštění

```bash
npm install
npm run dev
```

Web se otevře na [http://localhost:3000](http://localhost:3000). Před nasazením spusť `npm run build`. Veřejná konfigurace Firebase není tajný klíč; přístup k datům řídí pravidla Firestore.
