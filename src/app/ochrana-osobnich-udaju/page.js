import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import styles from './page.module.css';

const CONTACT_EMAIL = 'sanarycogames@outlook.cz';

export const metadata = {
  title: 'Ochrana osobních údajů | HC Litvínov Lancers',
  description: 'Jak web HC Litvínov Lancers používá údaje návštěvníků, hráčů a uživatelských účtů.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Zpět na web</Link>
        <span className={styles.eyebrow}>LANCERS / SOUKROMÍ</span>
        <h1>Ochrana osobních údajů.</h1>
        <p className={styles.lead}>
          Údaje používáme k provozu webu, přihlášení a her. Tady najdeš, co se ukládá,
          komu se údaje předávají a jak požádat o přístup, opravu nebo výmaz.
        </p>

        <div className={styles.identity}>
          <div>
            <strong>Oldřich Štěpanovský</strong>
            <span>Správce osobních údajů · projekt Sanaryco Games / HC Litvínov Lancers</span>
          </div>
          <div>
            <span>Kontakt pro dotazy a žádosti</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>

        <section className={styles.section} aria-labelledby="data-heading">
          <h2 id="data-heading">Jaké údaje používáme</h2>
          <ul>
            <li><strong>Účet:</strong> e-mail, identifikátor účtu, zobrazované jméno, způsob přihlášení a údaje potřebné pro ověření a zabezpečení účtu. Heslo spravuje Firebase Authentication.</li>
            <li><strong>Lancers Card:</strong> jméno hráče a týmu, počáteční herní finance a datum vytvoření profilu.</li>
            <li><strong>Tipovačka (administrátorský náhled):</strong> vybrané tipy k zápasu a čas posledního uložení, přiřazené k identifikátoru účtu.</li>
            <li><strong>Komentáře:</strong> text komentáře, zobrazované jméno, identifikátor účtu a čas vložení nebo úpravy. Komentář a jméno jsou viditelné ostatním.</li>
            <li><strong>Klubový obsah:</strong> ve veřejných soupiskách, článcích a výsledcích mohou být jména, fotografie, sportovní statistiky a u některých hráčů také datum a místo narození, výška, váha nebo další údaje sportovního profilu.</li>
            <li><strong>Technický provoz:</strong> poskytovatelé přihlášení a hostingu zpracovávají například IP adresu, údaje o prohlížeči a bezpečnostní záznamy. Prohlížeč může uchovávat přihlášení a uložený postup hry Les stínů.</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="purpose-heading">
          <h2 id="purpose-heading">Proč údaje používáme</h2>
          <p>Účet, herní profil a uložené tipy vedeme, abychom ti mohli poskytnout přihlášení a hry, o které sis řekl(a). Stejně tak zveřejníme komentář, který se rozhodneš vložit do diskuse. Právním základem pro tyto funkce je poskytování služby podle čl. 6 odst. 1 písm. b) GDPR.</p>
          <p>Bezpečnost účtů, ochranu před zneužitím a moderaci komentářů opíráme o oprávněný zájem na bezpečném provozu webu podle čl. 6 odst. 1 písm. f) GDPR. Veřejné soupisky a klubové zprávy slouží k informování o sportovní činnosti týmu. Zveřejnění přiměřených sportovních údajů posuzujeme podle oprávněného zájmu na informování o klubu a podle práv dotčených hráčů. U fotografií a podrobnějších údajů záleží na rozsahu zveřejnění; pokud oprávněný zájem nestačí, je nutný souhlas dotčeného hráče.</p>
          <p>E-mail je potřebný pro vytvoření účtu. Komentování a vytvoření herního profilu jsou dobrovolné. Údaje nepoužíváme k automatickému rozhodování s právními nebo podobně závažnými účinky.</p>
        </section>

        <section className={styles.section} aria-labelledby="services-heading">
          <h2 id="services-heading">Kdo nám zajišťuje provoz</h2>
          <ul>
            <li><strong>Google Firebase</strong> zajišťuje přihlášení a databázi. Při volbě přihlášení přes Google se použije také tvůj Google účet. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Informace Firebase o ochraně údajů</a>.</li>
            <li><strong>Vercel</strong> hostuje web a při jeho návštěvě zpracovává technické údaje o požadavku. <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">Informace Vercelu o ochraně údajů</a>.</li>
            <li><strong>Instagram</strong> se použije jen tehdy, když na úvodní stránce klikneš na načtení videa nebo přejdeš na Instagram. Pak se na přenos údajů vztahují i jeho pravidla.</li>
          </ul>
          <p>Firebase Authentication podle Googlu zpracovává údaje ve Spojených státech. Google uvádí pro přenosy z EHP certifikaci v <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">rámci EU–US Data Privacy Framework</a>. Další údaje u poskytovatelů mohou být zpracovávány i mimo Evropský hospodářský prostor; podrobnosti o jejich ochraně uvádějí jejich zásady výše.</p>
        </section>

        <section className={styles.section} aria-labelledby="retention-heading">
          <h2 id="retention-heading">Jak dlouho údaje zůstávají</h2>
          <p>Údaje účtu, herní profil a uložené tipy uchováváme po dobu existence účtu. Komentáře uchováváme po dobu fungování diskuse a účtu autora. Po ověřené žádosti o smazání odstraníme účet a údaje, které už nepotřebujeme nebo je nemusíme uchovat z právního důvodu. Veřejný klubový obsah uchováváme po dobu, kdy je relevantní pro informace o týmu a jeho sportovní historii; požadavky na opravu či odstranění posuzujeme jednotlivě.</p>
          <p>Tlačítko pro smazání jednotlivého komentáře jej nyní skryje na webu, ale jeho obsah zůstane v databázi. O úplné odstranění komentářů můžeš požádat e-mailem. Technické záznamy a zálohy se mažou podle cyklů jednotlivých poskytovatelů; Google popisuje svůj postup v <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">dokumentaci Firebase</a>.</p>
        </section>

        <section className={styles.section} aria-labelledby="rights-heading">
          <h2 id="rights-heading">Tvoje práva a kontakt</h2>
          <p>Na <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> můžeš požádat o přístup ke svým údajům, jejich opravu, kopii, přenositelnost, omezení zpracování nebo výmaz. U zpracování založeného na oprávněném zájmu můžeš vznést námitku; udělený souhlas můžeš odvolat. Žádost nejprve ověříme, aby údaje nedostal někdo jiný.</p>
          <p>Na stránce <Link href="/profil">Můj účet</Link> můžeš změnit zobrazované jméno, připravit změnu e-mailu a otevřít žádost o kopii údajů nebo smazání účtu. Otevření e-mailového programu samo žádost neodešle; odeslání potvrzuješ ty. Účet a navázaná data se po žádosti nemažou automaticky, vyřizujeme je po ověření.</p>
          <p>Pokud nejsi s vyřízením spokojen(a), můžeš podat stížnost u <a href="https://uoou.gov.cz/" target="_blank" rel="noopener noreferrer">Úřadu pro ochranu osobních údajů</a>.</p>
        </section>

        <p className={styles.updated}>Naposledy aktualizováno 24. září 2026.</p>
      </main>
    </div>
  );
}
