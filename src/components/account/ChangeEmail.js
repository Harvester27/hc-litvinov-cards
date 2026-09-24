'use client';

import { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  reload,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { Check, LoaderCircle, Mail } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import styles from './ChangeEmail.module.css';

function errorMessage(error, method) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Zadej platnou e-mailovou adresu.';
    case 'auth/email-already-in-use':
      return 'Tato e-mailová adresa už patří jinému účtu.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return method === 'google'
        ? 'Ověření přes Google se nezdařilo. Zkus to znovu.'
        : 'Heslo není správné. Zkus to znovu.';
    case 'auth/requires-recent-login':
      return 'Ověření přihlášení vypršelo. Zkus změnu znovu.';
    case 'auth/user-mismatch':
    case 'auth/no-current-user':
      return 'Přihlášený účet se změnil. Obnov stránku a zkus to znovu.';
    case 'auth/popup-blocked':
      return 'Prohlížeč zablokoval okno Googlu. Povol vyskakovací okna a zkus to znovu.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Ověření přes Google nebylo dokončeno.';
    case 'auth/too-many-requests':
      return 'Příliš mnoho pokusů. Zkus to později.';
    case 'auth/network-request-failed':
      return 'Nepodařilo se spojit se serverem. Zkontroluj připojení.';
    case 'auth/operation-not-allowed':
      return 'Změna e-mailu není pro tento účet dostupná. Napiš nám na sanarycogames@outlook.cz.';
    default:
      return 'Změnu e-mailu se nepodařilo připravit. Zkus to znovu.';
  }
}

/** Sends Firebase's verified-email-change link after reauthenticating the current user. */
export default function ChangeEmail({ user, disabled = false }) {
  const uid = user?.uid;
  const hasPassword = Boolean(user?.providerData?.some((provider) => provider.providerId === 'password'));
  const hasGoogle = Boolean(user?.providerData?.some((provider) => provider.providerId === 'google.com'));
  const [stateUid, setStateUid] = useState(uid);
  const [method, setMethod] = useState(() => hasPassword ? 'password' : 'google');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const requestNumber = useRef(0);
  const activeRequest = useRef(null);
  const busyKind = busy?.uid === uid ? busy.kind : '';

  useEffect(() => {
    // Invalidate any operation started by the previous account or provider.
    requestNumber.current += 1;
    activeRequest.current = null;
    setStateUid(uid);
    setMethod(hasPassword ? 'password' : 'google');
    setNewEmail('');
    setPassword('');
    setPendingEmail('');
    setBusy(null);
    setNotice(null);
    return () => {
      requestNumber.current += 1;
      activeRequest.current = null;
    };
  }, [uid, hasPassword]);

  const submit = async (event) => {
    event.preventDefault();
    if (!user || busyKind || activeRequest.current || disabled || auth.currentUser?.uid !== user.uid) return;

    const email = newEmail.trim();
    if (!email || email.toLowerCase() === user.email?.toLowerCase()) {
      setNotice({ type: 'error', text: 'Zadej jiný e-mail než ten současný.' });
      return;
    }
    if (method === 'password' && !password) {
      setNotice({ type: 'error', text: 'Pro potvrzení změny zadej současné heslo.' });
      return;
    }

    const subject = user;
    const requestId = ++requestNumber.current;
    activeRequest.current = requestId;
    const isCurrent = () => requestNumber.current === requestId && auth.currentUser?.uid === subject.uid;
    setBusy({ uid: subject.uid, id: requestId, kind: 'submit' });
    setNotice(null);
    try {
      if (method === 'password' && hasPassword) {
        const credential = EmailAuthProvider.credential(subject.email, password);
        await reauthenticateWithCredential(subject, credential);
      } else if (method === 'google' && hasGoogle) {
        await reauthenticateWithPopup(subject, googleProvider);
      } else {
        setNotice({ type: 'error', text: errorMessage({ code: 'auth/operation-not-allowed' }, method) });
        return;
      }

      if (!isCurrent()) return;

      await verifyBeforeUpdateEmail(subject, email);
      if (!isCurrent()) return;
      setPassword('');
      setPendingEmail(email);
      setNotice({
        type: 'success',
        text: 'Potvrzovací odkaz jsme odeslali.',
      });
    } catch (error) {
      if (isCurrent()) {
        setNotice({ type: 'error', text: errorMessage(error, method) });
      }
    } finally {
      if (activeRequest.current === requestId) activeRequest.current = null;
      setBusy((current) => current?.uid === subject.uid && current?.id === requestId ? null : current);
    }
  };

  const checkConfirmation = async () => {
    if (!user || !pendingEmail || busyKind || activeRequest.current || disabled || auth.currentUser?.uid !== user.uid) return;
    const subject = user;
    const requestId = ++requestNumber.current;
    activeRequest.current = requestId;
    const isCurrent = () => requestNumber.current === requestId && auth.currentUser?.uid === subject.uid;
    setBusy({ uid: subject.uid, id: requestId, kind: 'check' });
    setNotice(null);
    try {
      await reload(subject);
      if (!isCurrent()) return;
      if (subject.email?.toLowerCase() === pendingEmail.toLowerCase()) {
        window.location.reload();
        return;
      }
      setNotice({ type: 'error', text: 'Nová adresa zatím není potvrzená. Otevři odkaz v e-mailu a zkus kontrolu znovu.' });
    } catch (error) {
      if (isCurrent()) {
        setNotice({ type: 'error', text: errorMessage(error, method) });
      }
    } finally {
      if (activeRequest.current === requestId) activeRequest.current = null;
      setBusy((current) => current?.uid === subject.uid && current?.id === requestId ? null : current);
    }
  };

  // Hide values and notices from the previous account until its state is cleared.
  if (stateUid !== uid) return null;

  return (
    <section className={styles.panel} aria-labelledby="change-email-heading">
      <div className={styles.icon}><Mail size={19} aria-hidden="true" /></div>
      <span className={styles.eyebrow}>PŘIHLAŠOVÁNÍ</span>
      <h2 id="change-email-heading">Změna e-mailu</h2>
      <p>Současná adresa: <strong>{user?.email || 'Není uvedena'}</strong></p>
      <p>Novou adresu nejprve ověříme odkazem. Do potvrzení zůstane aktivní ta současná.</p>

      {hasPassword || hasGoogle ? (
        <form onSubmit={submit} className={styles.form}>
          <label htmlFor="new-account-email">Nový e-mail</label>
          <input
            id="new-account-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            disabled={Boolean(busyKind) || disabled}
          />

          {hasPassword && hasGoogle && (
            <fieldset className={styles.methods} disabled={Boolean(busyKind) || disabled}>
              <legend>Potvrdit totožnost</legend>
              <label><input type="radio" name="email-reauth-method" value="password" checked={method === 'password'} onChange={() => setMethod('password')} /> Heslem</label>
              <label><input type="radio" name="email-reauth-method" value="google" checked={method === 'google'} onChange={() => { setPassword(''); setMethod('google'); }} /> Google účtem</label>
            </fieldset>
          )}

          {method === 'password' && hasPassword && (
            <>
              <label htmlFor="email-change-password">Současné heslo</label>
              <input
                id="email-change-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={Boolean(busyKind) || disabled}
              />
            </>
          )}

          {hasGoogle && !hasPassword && (
            <p className={styles.hint}>Přihlášení přes Google zůstane navázané na tvůj Google účet.</p>
          )}

          <button type="submit" className={styles.button} disabled={Boolean(busyKind) || disabled || !newEmail.trim()}>
            {busyKind === 'submit' && <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />}
            {method === 'google' ? 'Ověřit přes Google a poslat odkaz' : 'Ověřit heslo a poslat odkaz'}
          </button>
        </form>
      ) : (
        <p className={styles.hint}>U tohoto způsobu přihlášení nelze e-mail změnit přímo tady.</p>
      )}

      {pendingEmail && (
        <div className={styles.pending}>
          <strong>Čeká na potvrzení: {pendingEmail}</strong>
          <p>Otevři odkaz v nové e-mailové schránce. Potom se vrať na tento profil a zkontroluj potvrzení.</p>
          <button type="button" className={styles.checkButton} onClick={checkConfirmation} disabled={Boolean(busyKind) || disabled}>
            {busyKind === 'check' && <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />}
            Zkontrolovat potvrzení
          </button>
        </div>
      )}

      {notice && (
        <p className={notice.type === 'success' ? styles.success : styles.error} role={notice.type === 'error' ? 'alert' : 'status'}>
          {notice.type === 'success' && <Check size={16} aria-hidden="true" />}
          {notice.text}
        </p>
      )}
    </section>
  );
}
