'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase';
import styles from './page.module.css';

const PLAYER_COLLECTION = 'lancersCardsPlayers';
const LOGIN_URL = '/auth?next=%2Fgames%2Fcards';

function cleanName(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function GameHeader({ profile }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Link href="/games" className={styles.backLink} aria-label="Zpět na výběr her">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Hry</span>
        </Link>
        <span className={styles.headerDivider} aria-hidden="true" />
        <Link href="/games/cards" className={styles.brand}>LANCERS <span>CARD</span></Link>
      </div>
      {profile && (
        <div className={styles.playerInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>HRÁČ</span>
            <strong>{profile.playerName}</strong>
          </div>
          <span className={styles.infoDivider} aria-hidden="true" />
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>FINANCE</span>
            <strong>{profile.balance}</strong>
          </div>
        </div>
      )}
    </header>
  );
}

function StatusScreen({ message, retry }) {
  return (
    <div className={styles.page}>
      <GameHeader />
      <main className={styles.center}>
        <div className={styles.statusPanel} role={retry ? 'alert' : 'status'}>
          <span className={styles.smallLabel}>LANCERS CARD</span>
          <p>{message}</p>
          {retry && <button type="button" className={styles.retryButton} onClick={retry}>Zkusit znovu</button>}
        </div>
      </main>
    </div>
  );
}

export default function CardsGamePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [view, setView] = useState('loading');
  const [viewUid, setViewUid] = useState(null);
  const [profile, setProfile] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(LOGIN_URL);
      return;
    }

    let active = true;
    const loadProfile = async () => {
      setViewUid(null);
      setProfile(null);
      setPlayerName('');
      setTeamName('');
      setFormError('');
      setView('loading');
      try {
        const snapshot = await getDoc(doc(db, PLAYER_COLLECTION, user.uid));
        if (!active || auth.currentUser?.uid !== user.uid) return;
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
            playerName: data.playerName,
            teamName: data.teamName,
            balance: data.balance,
          });
          setViewUid(user.uid);
          setView('home');
        } else {
          setViewUid(user.uid);
          setView('setup');
        }
      } catch {
        if (active && auth.currentUser?.uid === user.uid) {
          setViewUid(user.uid);
          setView('error');
        }
      }
    };

    loadProfile();
    return () => { active = false; };
  }, [loading, user, router, retryCount]);

  const createProfile = async (event) => {
    event.preventDefault();
    if (!user || saving) return;

    const name = cleanName(playerName);
    const team = cleanName(teamName);
    if (name.length < 2 || name.length > 32 || team.length < 2 || team.length > 40) {
      setFormError('Jméno hráče musí mít 2–32 znaků a název týmu 2–40 znaků.');
      return;
    }

    setSaving(true);
    setFormError('');
    const playerRef = doc(db, PLAYER_COLLECTION, user.uid);
    try {
      await setDoc(playerRef, {
        playerName: name,
        teamName: team,
        balance: 0,
        createdAt: serverTimestamp(),
      });
      if (auth.currentUser?.uid !== user.uid) return;
      setProfile({ playerName: name, teamName: team, balance: 0 });
      setView('home');
    } catch {
      if (auth.currentUser?.uid !== user.uid) return;
      // Another open tab may have created the one-time profile first.
      try {
        const existing = await getDoc(playerRef);
        if (auth.currentUser?.uid !== user.uid) return;
        if (existing.exists()) {
          const data = existing.data();
          setProfile({ playerName: data.playerName, teamName: data.teamName, balance: data.balance });
          setView('home');
          return;
        }
      } catch {
        // Keep the form and let the player retry when the connection returns.
      }
      setFormError('Herní profil se nepodařilo uložit. Zkus to prosím znovu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || view === 'loading' || viewUid !== user.uid) {
    return <StatusScreen message="Načítám herní profil…" />;
  }

  if (view === 'error') {
    return <StatusScreen message="Herní profil se nepodařilo načíst." retry={() => setRetryCount((count) => count + 1)} />;
  }

  if (view === 'setup') {
    return (
      <div className={styles.page}>
        <GameHeader />
        <main className={styles.center}>
          <section className={styles.setupPanel} aria-labelledby="setup-title">
            <span className={styles.smallLabel}>PRVNÍ VSTUP DO HRY</span>
            <h1 id="setup-title">Jak se budeš jmenovat?</h1>
            <p className={styles.lead}>Pojmenuj sebe a svůj tým. Údaje se uloží k tvému účtu.</p>
            <form onSubmit={createProfile} className={styles.form}>
              <label htmlFor="cards-player-name">Jméno hráče</label>
              <input
                id="cards-player-name"
                type="text"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                minLength={2}
                maxLength={32}
                autoComplete="nickname"
                required
                disabled={saving}
              />
              <label htmlFor="cards-team-name">Název týmu</label>
              <input
                id="cards-team-name"
                type="text"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                minLength={2}
                maxLength={40}
                required
                disabled={saving}
              />
              {formError && <p className={styles.formError} role="alert">{formError}</p>}
              <button type="submit" className={styles.submitButton} disabled={saving}>
                {saving ? 'Ukládám…' : 'Vstoupit do hry'}
                {!saving && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <GameHeader profile={profile} />
      <main className={styles.home}>
        <span className={styles.smallLabel}>TVŮJ TÝM</span>
        <h1>{profile.teamName}</h1>
        <p>Vítej v Lancers Card, {profile.playerName}.</p>
      </main>
    </div>
  );
}
