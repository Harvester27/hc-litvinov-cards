'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import CareerMode from '@/components/CareerMode';

export default function KarieraPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const saved = localStorage.getItem(playerStats_);
        if (saved) {
          setStats(JSON.parse(saved));
        } else {
          const initStats = { cardsOwned: 3, cardsNeeded: 147, coinsBalance: 2500, level: 1, experience: 0 };
          setStats(initStats);
          localStorage.setItem(playerStats_, JSON.stringify(initStats));
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateStats = (newStats) => {
    setStats(newStats);
    if (user) {
      localStorage.setItem(playerStats_, JSON.stringify(newStats));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center text-white">
        Načítám...
      </div>
    );
  }

  return (
    <CareerMode
      user={user}
      playerStats={stats || { cardsOwned: 0, cardsNeeded: 0, coinsBalance: 0, level: 1, experience: 0 }}
      onBack={() => { if (typeof window !== 'undefined') window.location.href = '/'; }}
      onUpdateStats={handleUpdateStats}
    />
  );
}
