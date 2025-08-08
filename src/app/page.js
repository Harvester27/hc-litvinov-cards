'use client';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthScreen from '@/components/AuthScreen';
import GameHomeScreen from '@/components/GameHomeScreen';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="relative">
      <GameHomeScreen user={user} />
      <a
        href="/kariera"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-3 rounded-full font-semibold shadow-xl transition-all hover:scale-105"
        title="Kariéra"
      >
        🎯 Kariéra
      </a>
    </div>
  );
}
