'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AuthScreen from '@/components/AuthScreen';
import styles from '@/components/AuthScreen.module.css';

function getSafeReturnPath() {
  if (typeof window === 'undefined') return '/';

  const requested = new URLSearchParams(window.location.search).get('next');
  if (!requested || !requested.startsWith('/') || requested.startsWith('//') || /[\\\u0000-\u001f]/.test(requested)) {
    return '/';
  }

  try {
    const destination = new URL(requested, window.location.origin);
    if (destination.origin !== window.location.origin || destination.pathname === '/auth') return '/';
    return destination.pathname + destination.search + destination.hash;
  } catch {
    return '/';
  }
}

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace(getSafeReturnPath());
  }, [loading, user, router]);

  return (
    <>
      <Navigation />
      {loading || user ? (
        <main className={styles.loadingPage}>
          <div className={styles.loadingMessage} role="status"><span className={styles.spinner} aria-hidden="true" /> Načítám účet…</div>
        </main>
      ) : (
        <AuthScreen onLoginSuccess={() => router.replace(getSafeReturnPath())} />
      )}
    </>
  );
}
