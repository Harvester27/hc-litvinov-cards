'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthScreen from '@/components/AuthScreen';
import GameHomeScreen from '@/components/GameHomeScreen';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🏒</span>
          </div>
          <h2 className="text-2xl font-bold">HC Litvínov Cards</h2>
          <p className="text-blue-200 mt-2">Načítám...</p>
        </div>
      </div>
    );
  }

  // Pokud není přihlášený, zobraz auth screen
  if (!user) {
    return <AuthScreen />;
  }

  // Pokud je přihlášený, zobraz herní obrazovku
  return <GameHomeScreen user={user} />;
}