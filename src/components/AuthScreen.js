'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import styles from './AuthScreen.module.css';

const googleLoginEnabled = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED !== 'false';

function getErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Zkontroluj prosím e-mailovou adresu.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail nebo heslo není správné.';
    case 'auth/email-already-in-use':
      return 'Tento e-mail už má účet. Zkus se přihlásit nebo obnovit heslo.';
    case 'auth/weak-password':
      return 'Zvol silnější heslo, alespoň 8 znaků.';
    case 'auth/too-many-requests':
      return 'Příliš mnoho pokusů. Zkus to prosím za chvíli.';
    case 'auth/network-request-failed':
      return 'Nepodařilo se připojit. Zkontroluj internet a zkus to znovu.';
    case 'auth/popup-blocked':
      return 'Prohlížeč zablokoval okno Googlu. Povol vyskakovací okna a zkus to znovu.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Přihlášení přes Google nebylo dokončeno.';
    case 'auth/account-exists-with-different-credential':
      return 'Pro tento e-mail už existuje jiný způsob přihlášení.';
    case 'auth/unauthorized-domain':
      return 'Přihlášení přes Google na této adrese zatím není povolené.';
    case 'auth/operation-not-allowed':
      return 'Tento způsob přihlášení zatím není dostupný.';
    case 'auth/user-disabled':
      return 'Tento účet je zablokovaný.';
    default:
      return 'Něco se nepovedlo. Zkus to prosím znovu.';
  }
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
    setPassword('');
    setConfirmation('');
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    const address = email.trim();
    setError('');
    setNotice('');

    if (mode === 'register') {
      if (password.length < 8) {
        setError('Heslo musí mít alespoň 8 znaků.');
        return;
      }
      if (password !== confirmation) {
        setError('Hesla se neshodují.');
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === 'register') {
        const { user } = await createUserWithEmailAndPassword(auth, address, password);
        let verificationError = null;
        try {
          await sendEmailVerification(user);
        } catch (mailError) {
          verificationError = mailError;
        } finally {
          // A new password account may not use the site until its address is verified.
          await signOut(auth);
        }
        setPassword('');
        setConfirmation('');
        setMode('login');
        if (verificationError) {
          setError('Účet vznikl, ale ověřovací e-mail se nepodařilo odeslat. Zkus se přihlásit a požádat o nový odkaz.');
        } else {
          setNotice('Účet je vytvořený. Otevři e-mail, potvrď adresu a potom se přihlas. Zkontroluj i spam.');
        }
        return;
      }

      const { user } = await signInWithEmailAndPassword(auth, address, password);
      try {
        await reload(user);
      } catch (refreshError) {
        await signOut(auth);
        throw refreshError;
      }

      if (!user.emailVerified) {
        let resendFailed = false;
        try {
          await sendEmailVerification(user);
        } catch {
          resendFailed = true;
        } finally {
          await signOut(auth);
        }
        setPassword('');
        setNotice(resendFailed
          ? 'E-mail ještě není potvrzený. Zkontroluj původní ověřovací zprávu a spam; další zprávu se teď nepodařilo odeslat.'
          : 'E-mail ještě není potvrzený. Poslali jsme nový ověřovací odkaz. Po potvrzení se přihlas znovu.');
        return;
      }

      // Refresh the token so Firestore rules see email_verified immediately.
      await user.getIdToken(true);
      setNotice('Přihlášení proběhlo úspěšně.');
      onLoginSuccess?.(user);
    } catch (authError) {
      setError(getErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMode('login');
      setNotice('Pokud pro tento e-mail existuje účet, přijde ti odkaz pro nastavení nového hesla. Zkontroluj i spam.');
    } catch (resetError) {
      if (resetError?.code === 'auth/user-not-found') {
        setMode('login');
        setNotice('Pokud pro tento e-mail existuje účet, přijde ti odkaz pro nastavení nového hesla. Zkontroluj i spam.');
      } else {
        setError(getErrorMessage(resetError));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      if (!user.emailVerified) {
        await signOut(auth);
        setError('Google zatím nepotvrdil tvou e-mailovou adresu. Zkus jiný účet.');
        return;
      }
      setNotice('Přihlášení proběhlo úspěšně.');
      onLoginSuccess?.(user);
    } catch (googleError) {
      setError(getErrorMessage(googleError));
    } finally {
      setBusy(false);
    }
  }

  const isReset = mode === 'reset';
  const isRegister = mode === 'register';

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.intro} aria-labelledby="auth-intro-title">
          <span className={styles.eyebrow}>LANCERS / ÚČET</span>
          <h1 id="auth-intro-title">Jeden účet.<br /><em>Celý svět Lancers.</em></h1>
          <p>Přihlas se na web a připrav se na novou online hru Lancers Card.</p>
          <div className={styles.introRule} />
          <div className={styles.introDetail}><ShieldCheck size={18} aria-hidden="true" /><span>Tvůj účet je propojený s ověřenou e-mailovou adresou.</span></div>
          <Link href="/" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Zpět na web</Link>
        </section>

        <section className={styles.panel} aria-labelledby="auth-form-title">
          <div className={styles.panelTop}><LockKeyhole size={18} aria-hidden="true" /><span>ČLENSKÁ ZÓNA</span></div>
          <h2 id="auth-form-title">{isReset ? 'Obnova hesla' : isRegister ? 'Vytvořit účet' : 'Vítej zpět'}</h2>
          <p className={styles.panelLead}>
            {isReset
              ? 'Pošleme ti odkaz pro nastavení nového hesla.'
              : isRegister
                ? 'Založ si nový účet pro web i budoucí Lancers Card.'
                : 'Přihlas se a pokračuj tam, kde jsi skončil.'}
          </p>

          {!isReset && (
            <div className={styles.modeSwitch} aria-label="Způsob přístupu">
              <button type="button" aria-pressed={!isRegister} disabled={busy} onClick={() => changeMode('login')} className={!isRegister ? styles.modeActive : ''}>Přihlášení</button>
              <button type="button" aria-pressed={isRegister} disabled={busy} onClick={() => changeMode('register')} className={isRegister ? styles.modeActive : ''}>Registrace</button>
            </div>
          )}

          {notice && <div className={styles.notice} role="status">{notice}</div>}
          {error && <div className={styles.error} role="alert">{error}</div>}

          <form onSubmit={isReset ? handlePasswordReset : handleEmailSubmit} className={styles.form}>
            <label htmlFor="auth-email">E-mail</label>
            <div className={styles.inputWrap}>
              <Mail size={18} aria-hidden="true" />
              <input id="auth-email" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tvuj@email.cz" disabled={busy} />
            </div>

            {!isReset && (
              <>
                <label htmlFor="auth-password">Heslo</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input id="auth-password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'Alespoň 8 znaků' : 'Tvoje heslo'} disabled={busy} />
                </div>
              </>
            )}

            {isRegister && (
              <>
                <label htmlFor="auth-confirmation">Heslo znovu</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input id="auth-confirmation" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Potvrď heslo" disabled={busy} />
                </div>
              </>
            )}

            {!isReset && !isRegister && <button type="button" className={styles.textButton} disabled={busy} onClick={() => changeMode('reset')}>Zapomněl jsem heslo</button>}

            <button type="submit" className={styles.primaryButton} disabled={busy}>
              <span>{busy ? 'Chvíli strpení…' : isReset ? 'Poslat odkaz' : isRegister ? 'Vytvořit účet' : 'Přihlásit se'}</span>
              {!busy && <ArrowRight size={18} aria-hidden="true" />}
            </button>
          </form>

          {isReset ? (
            <button type="button" className={styles.resetBack} disabled={busy} onClick={() => changeMode('login')}><ArrowLeft size={15} aria-hidden="true" /> Zpět na přihlášení</button>
          ) : (
            <>
              {googleLoginEnabled && (
                <>
                  <div className={styles.divider}><span>nebo</span></div>
                  <button type="button" className={styles.googleButton} disabled={busy} onClick={handleGoogleSignIn}><GoogleMark /> Pokračovat přes Google</button>
                </>
              )}
              <p className={styles.footnote}>Staré účty už neplatí. Založ si prosím nový účet.</p>
            </>
          )}
          <p className={styles.privacyFootnote}>
            Informace o použití údajů najdeš v <Link href="/ochrana-osobnich-udaju">zásadách ochrany osobních údajů</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
