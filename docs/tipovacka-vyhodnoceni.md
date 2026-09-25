# Vyhodnocení Tipovačky

## Postup správce

1. Otevři `/games/tipovacka` pod ověřeným účtem `sanarycogames@outlook.cz` a zvol **Zadat a vyhodnotit výsledek**. Hra je zatím dostupná jen tomuto účtu.
2. Po zápase zapiš skóre po prodloužení **bez vítězného nájezdu**, střelce z vypsané pětice, kanadské body vybrané trojice, tým prvního gólu a hráče, kteří nenastoupili. Prázdný seznam střelců znamená, že z vypsané pětice neskóroval nikdo.
3. Zvol **Zobrazit náhled bodů**. Zkontroluj celé skóre, údaje o hráčích i rozpis pěti otázek u každého uloženého tiketu. Tento krok nic nezveřejní ani nezmění v tabulce.
4. Po začátku zápasu lze náhled potvrdit tlačítkem **Zveřejnit vyhodnocení**. Server ověří administrátorský účet, znovu spočítá všechny tikety a porovná je s náhledem. Pokud se tiket mezitím změnil, zveřejnění odmítne a je třeba načíst nový náhled.
5. Výsledek, rozpis každého tiketu a přepočet tabulky se uloží v jedné databázové transakci. Druhé zveřejnění stejného kola je odmítnuto. Po zveřejnění se na úvodu zobrazí skutečné skóre, hráči uvidí body a důvody anulování u každé otázky.

## Časy a ochrana dat

- Příjem a změny tiketů končí 26. září 2026 v 19:15 pražského času. Uzávěrku vynucují pravidla Firestore; čas v prohlížeči slouží jen k zobrazení stavu.
- Po zveřejnění výsledek zamkne tikety. Jednorázové zveřejnění je záměrně bez tlačítka pro přepsání výsledku; případná pozdější oprava vyžaduje samostatný kontrolovaný postup, aby se body nepřičetly podruhé.
- Server na Vercelu používá tajnou proměnnou `FIREBASE_SERVICE_ACCOUNT_JSON`. Obsahuje klíč samostatného účtu `tipovacka-vercel`, který má pouze role `roles/datastore.user` a `roles/firebaseauth.viewer`. Klíč se nesmí uložit do repozitáře ani poslat do prohlížeče.
- Aktuální pravidla Firestore zpřístupňují hru, tabulku a vyhodnocení pouze ověřenému administrátorskému účtu. Před otevřením veřejné Tipovačky je nutné samostatně upravit pravidla pro ukládání tiketů a čtení vlastních výsledků.

## Uložené dokumenty

- `tipovackaPreview/{uid}`: jeden tiket pro současné kolo.
- `tipovackaRounds/{roundId}`: zveřejněný skutečný výsledek.
- `tipovackaRounds/{roundId}/evaluations/{uid}`: uzamčený tip, body po otázkách a celkový výsledek hráče.
- `tipovackaStandings/{uid}`: součet bodů a počet vyhodnocených kol.

Při exportu nebo výmazu účtu je třeba zahrnout i dokumenty vyhodnocení v podkolekcích; viz [postup žádostí o osobní údaje](privacy/account-requests.md).
