'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';
import GameHomeScreen from '@/components/GameHomeScreen';
import LoadingScreen from '@/components/LoadingScreen';
import CareerMode from '@/components/CareerMode';

export default function CardsGamePage() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // home | career
  const [playerStats, setPlayerStats] = useState({
    cardsOwned: 3,
    cardsNeeded: 147,
    coinsBalance: 1000,
    level: 1,
    experience: 0
  });

  useEffect(() => {
    if (!user) return;
    const savedStats = localStorage.getItem(`playerStats_${user.uid}`);
    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch {
        localStorage.removeItem(`playerStats_${user.uid}`);
      }
    }
  }, [user]);

  const updatePlayerStats = (newStats) => {
    setPlayerStats(newStats);
    if (user) {
      localStorage.setItem(`playerStats_${user.uid}`, JSON.stringify(newStats));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (currentView === 'career') {
    return (
      <CareerMode 
        user={user}
        playerStats={playerStats}
        onBack={() => setCurrentView('home')}
        onUpdateStats={updatePlayerStats}
      />
    );
  }

  return (
    <div className="relative">
      <GameHomeScreen user={user} />
      <button
        onClick={() => setCurrentView('career')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-3 rounded-full font-semibold shadow-xl transition-all hover:scale-105 z-30"
        title="Kariéra"
      >
        🎯 Kariéra
      </button>
    </div>
  );
}
