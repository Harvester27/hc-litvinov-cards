'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { ArrowLeft, Check, KeyRound, LoaderCircle, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ChangeEmail from '@/components/account/ChangeEmail';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import styles from './page.module.css';

const LOGIN_URL = '/auth?next=%2Fprofil';
const PRIVACY_EMAIL = 'sanarycogames@outlook.cz';

function privacyMailto(subject, user) {
  const body = [
    'Dobrý den,',
    '',
    'prosím o vyřízení této žádosti týkající se mého účtu na webu Litvínov Lancers.',
    `E-mail účtu: ${user.email || 'neuveden'}`,
    `ID účtu: ${user.uid}`,
    '',
    'Prosím o potvrzení přijetí žádosti a informace o dalším postupu.',
  ].join('\n');
  return `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function authErrorMessage(error) {
  if (error?.code === 'auth/too-many-requests') {
    return 'Příliš mnoho pokusů. Zkus to prosím později.';
  }
  if (error?.code === 'auth/network-request-failed') {
    return 'Nepodařilo se spojit se serverem. Zkontroluj připojení a zkus to znovu.';
  }
  if (error?.code === 'auth/requires-recent-login') {
    return 'Pro tuto změnu je potřeba se znovu přihlásit.';
  }
  return 'Akci se nepodařilo dokončit. Zkus to prosím znovu.';
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [savedName, setSavedName] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace(LOGIN_URL);
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const currentName = user.displayName || '';
    setDisplayName(currentName);
    setSavedName(currentName);
  }, [user]);

  const saveName = async (event) => {
    event.preventDefault();
    if (!user || busy) return;

    const nextName = displayName.trim().replace(/\s+/g, ' ');
    if (nextName.length < 2 || nextName.length > 30) {
      setNotice({ type: 'error', text: 'Zobrazované jméno musí mít 2 až 30 znaků.' });
      return;
    }
    if (/[\u0000-\u001F\u007F]/.test(nextName)) {
      setNotice({ type: 'error', text: 'Zobrazované jméno obsahuje nepovolené znaky.' });
      return;
    }
    if (nextName === savedName) return;

    setBusy('name');
    setNotice(null);
    try {
      await updateProfile(user, { displayName: nextName });
      setDisplayName(nextName);
      setSavedName(nextName);
      setNotice({ type: 'success', text: 'Jméno bylo uloženo.' });
    } catch (error) {
      setNotice({ type: 'error', text: authErrorMessage(error) });
    } finally {
      setBusy('');
    }
  };

  const resetPassword = async () => {
    if (!user?.email || busy) return;
    setBusy('password');
    setNotice(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setNotice({
        type: 'success',
        text: 'Odkaz pro nastavení nového hesla jsme odeslali na tvůj e-mail.',
      });
    } catch (error) {
      setNotice({ type: 'error', text: authErrorMessage(error) });
    } finally {
      setBusy('');
    }
  };

  const logOut = async () => {
    if (busy) return;
    setBusy('logout');
    setNotice(null);
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      setNotice({ type: 'error', text: authErrorMessage(error) });
      setBusy('');
    }
  };

  const hasPassword = user?.providerData?.some((provider) => provider.providerId === 'password');
  const hasGoogle = user?.providerData?.some((provider) => provider.providerId === 'google.com');
  const initials = (savedName || user?.email || 'L').trim().slice(0, 1).toLocaleUpperCase('cs-CZ');
  const providerLabel = hasPassword && hasGoogle
    ? 'Google a e-mail'
    : hasGoogle
      ? 'Google'
      : hasPassword
        ? 'E-mail a heslo'
        : 'Lancers účet';

  return (
    <div className={styles.page}>
      <Navigation />
      <main className={styles.main}>
        {loading || !user ? (
          <div className={styles.loading} role="status">
            <LoaderCircle size={27} className={styles.spinner} aria-hidden="true" />
            <span>{loading ? 'Načítání účtu…' : 'Přesměrování k přihlášení…'}</span>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.topline}>
              <Link href="/games" className={styles.backLink}>
                <ArrowLeft size={15} aria-hidden="true" />
                Zpět na hry
              </Link>
              <span>LANCERS / ÚČET</span>
            </div>

            <div className={styles.heading}>
              <span className={styles.eyebrow}>◆ TVŮJ PROSTOR VE SVĚTĚ LANCERS</span>
              <h1>Můj účet<span>.</span></h1>
              <p>Tady spravuješ své přihlašování a jméno, pod kterým tě ostatní uvidí.</p>
            </div>

            <section className={styles.identity} aria-label="Přihlášený účet">
              <div className={styles.avatar} aria-hidden="true">{initials}</div>
              <div className={styles.identityText}>
                <span className={styles.smallLabel}>PŘIHLÁŠEN JAKO</span>
                <strong>{savedName || 'Hráč Lancers'}</strong>
                <span>{user.email || 'E-mail není dostupný'}</span>
              </div>
              <div className={styles.verified}>
                <ShieldCheck size={18} aria-hidden="true" />
                Ověřený účet
              </div>
            </section>

            {notice && (
              <p
                className={notice.type === 'success' ? styles.success : styles.error}
                role={notice.type === 'error' ? 'alert' : 'status'}
              >
                {notice.type === 'success' && <Check size={16} aria-hidden="true" />}
                {notice.text}
              </p>
            )}

            <div className={styles.grid}>
              <section className={styles.panel}>
                <div className={styles.panelIcon}><UserRound size={19} aria-hidden="true" /></div>
                <span className={styles.smallLabel}>PROFIL</span>
                <h2>Zobrazované jméno</h2>
                <p>Jméno, které se bude zobrazovat ostatním na webu a ve hře.</p>
                <form onSubmit={saveName} className={styles.form}>
                  <label htmlFor="display-name">Tvoje jméno</label>
                  <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    autoComplete="nickname"
                    minLength={2}
                    maxLength={30}
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    disabled={Boolean(busy)}
                  />
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={Boolean(busy) || displayName.trim().replace(/\s+/g, ' ') === savedName}
                  >
                    {busy === 'name' && <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />}
                    Uložit jméno
                  </button>
                </form>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelIcon}><KeyRound size={19} aria-hidden="true" /></div>
                <span className={styles.smallLabel}>ZABEZPEČENÍ</span>
                <h2>Přihlašování</h2>
                <p>Tvůj účet je propojený s ověřenou e-mailovou adresou.</p>
                <dl className={styles.details}>
                  <div><dt>E-mail</dt><dd>{user.email || 'Není uveden'}</dd></div>
                  <div><dt>Způsob přihlášení</dt><dd>{providerLabel}</dd></div>
                </dl>
                {hasPassword && user.email ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetPassword}
                    disabled={Boolean(busy)}
                  >
                    {busy === 'password' && <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />}
                    Poslat odkaz pro změnu hesla
                  </button>
                ) : (
                  <p className={styles.providerNote}>Heslo ke svému účtu spravuješ u poskytovatele přihlášení.</p>
                )}
              </section>
            </div>

            <ChangeEmail user={user} disabled={Boolean(busy)} />

            <section className={styles.privacyPanel} aria-labelledby="privacy-heading">
              <span className={styles.smallLabel}>SOUKROMÍ</span>
              <h2 id="privacy-heading">Tvoje údaje</h2>
              <p>
                V <Link href="/ochrana-osobnich-udaju">zásadách ochrany osobních údajů</Link> najdeš,
                co ukládáme a jak můžeš uplatnit svá práva.
              </p>
              <div className={styles.privacyActions}>
                <a href={privacyMailto('Žádost o kopii údajů – Litvínov Lancers', user)} className={styles.secondaryButton}>
                  Požádat o kopii údajů
                </a>
                <a href={privacyMailto('Žádost o smazání účtu a dat – Litvínov Lancers', user)} className={styles.dangerButton}>
                  Požádat o smazání účtu
                </a>
              </div>
              <p className={styles.privacyNote}>
                Tlačítka otevřou tvůj e-mailový program. Žádost odešleš až potvrzením zprávy v něm.
                Smazání neproběhne hned; po ověření účtu zahrne i navázaný herní profil a komentáře.
                Pokud se e-mailový program neotevře, napiš na <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
              </p>
            </section>

            <section className={styles.logoutPanel}>
              <div>
                <span className={styles.smallLabel}>KONEC NÁVŠTĚVY</span>
                <h2>Odhlásit se</h2>
                <p>Po odhlášení se můžeš kdykoliv vrátit se stejným účtem.</p>
              </div>
              <button type="button" className={styles.logoutButton} onClick={logOut} disabled={Boolean(busy)}>
                {busy === 'logout' ? <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" /> : <LogOut size={17} aria-hidden="true" />}
                Odhlásit se
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
