'use client';

import { useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/** Only verified identities are accepted by the website. */
export function useAuth() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      auth,
      (firebaseUser) => {
        setState({
          user: firebaseUser?.emailVerified ? firebaseUser : null,
          loading: false,
        });
      },
      () => setState({ user: null, loading: false }),
    );

    return unsubscribe;
  }, []);

  return state;
}
