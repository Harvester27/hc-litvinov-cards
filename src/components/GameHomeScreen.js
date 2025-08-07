// 🎮 AKTUALIZOVANÝ GAME HOME SCREEN - S integrovaným obchodem balíčků
'use client';
import React, { useState, useEffect } from 'react';
import { 
  User, LogOut, Flame, Trophy, Package, Shuffle, Settings, 
  Star, Award, Users, Target, Clock, Plus, Sparkles,
  ShoppingCart, Coins // Přidány nové ikony
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import PackShop from './PackShop'; // Import nové komponenty

function GameHomeScreen({ user }) {
  // State pro otevření obchodu
  const [showPackShop, setShowPackShop] = useState(false);
  
  // Lokální state pro statistiky
  const [playerStats, setPlayerStats] = useState({
    cardsOwned: 0,
    cardsNeeded: 150,
    coinsBalance: 500,
    level: 1,
    experience: 0,
    totalCardsCollected: [] // Nové - seznam všech získaných karet
  });

  // Denní úkoly
  const [dailyTasks] = useState([
    { id: 1, name: "Kup 3 balíčky", progress: 0, max: 3, reward: 50 },
    { id: 2, name: "Vyměň 2 kartičky", progress: 0, max: 2, reward: 75 },
    { id: 3, name: "Přihlas se 5 dní v řadě", progress: 1, max: 5, reward: 200 }
  ]);

  // Načtení dat při mountu
  useEffect(() => {
    const savedStats = localStorage.getItem(`playerStats_${user.uid}`);
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    } else {
      // Nový hráč - výchozí hodnoty
      const newPlayerStats = {
        cardsOwned: 3,
        cardsNeeded: 147,
        coinsBalance: 1000,
        level: 1,
        experience: 0,
        totalCardsCollected: []
      };
      setPlayerStats(newPlayerStats);
      localStorage.setItem(`playerStats_${user.uid}`, JSON.stringify(newPlayerStats));
    }
  }, [user.uid]);

  // Logout funkce
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handler pro nákup balíčku
  const handlePackPurchase = (price, cards) => {
    const newStats = {
      ...playerStats,
      coinsBalance: playerStats.coinsBalance - price,
      cardsOwned: playerStats.cardsOwned + cards.length,
      cardsNeeded: Math.max(0, playerStats.cardsNeeded - cards.length),
      experience: playerStats.experience + (cards.length * 10),
      totalCardsCollected: [...playerStats.totalCardsCollected, ...cards]
    };
    
    // Level up check
    if (newStats.experience >= newStats.level * 1000) {
      newStats.level += 1;
      newStats.experience = newStats.experience - (newStats.level - 1) * 1000;
      
      // Bonus za level up
      newStats.coinsBalance += 500;
      alert(`🎉 Level Up! Dosáhl jsi levelu ${newStats.level}! Bonus: 500 coinů!`);
    }
    
    setPlayerStats(newStats);
    localStorage.setItem(`playerStats_${user.uid}`, JSON.stringify(newStats));
  };

  // Získat barvu podle levelu
  const getLevelColor = () => {
    if (playerStats.level < 10) return 'from-blue-500 to-blue-600';
    if (playerStats.level < 20) return 'from-purple-500 to-purple-600';
    if (playerStats.level < 30) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-orange-600';
  };

  return (
    <>
      {/* Hlavní dashboard */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 p-6">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HC Litvínov Cards</h1>
                <p className="text-blue-200 text-sm">Sbírej kartičky svého oblíbeného týmu!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right text-white">
                <p className="text-sm opacity-80">Přihlášen jako</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-white p-3 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Statistiky hráče */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-xs text-blue-200">Sbírka</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerStats.cardsOwned}</p>
            <p className="text-sm text-blue-200">Kartiček získáno</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-red-400" />
              <span className="text-xs text-blue-200">Zbývá</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerStats.cardsNeeded}</p>
            <p className="text-sm text-blue-200">Kartiček do kompletní sbírky</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-xs text-blue-200">Měna</span>
            </div>
            <p className="text-2xl font-bold text-white">{playerStats.coinsBalance}</p>
            <p className="text-sm text-blue-200">Coinů k dispozici</p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-purple-400" />
              <span className="text-xs text-blue-200">Úroveň</span>
            </div>
            <p className="text-2xl font-bold text-white">Level {playerStats.level}</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className={`bg-gradient-to-r ${getLevelColor()} h-2 rounded-full transition-all`}
                style={{ width: `${(playerStats.experience / (playerStats.level * 1000)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hlavní akce - AKTUALIZOVÁNO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Koupit balíček - NOVÉ */}
          <button
            onClick={() => setShowPackShop(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl p-6 text-white shadow-xl transform transition hover:scale-105"
          >
            <ShoppingCart className="w-12 h-12 mb-3 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Koupit balíček</h3>
            <p className="text-green-100 text-sm">Otevři obchod s balíčky karet</p>
            <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">4 druhy balíčků!</span>
            </div>
          </button>

          {/* Vyměnit kartičky */}
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-6 text-white shadow-xl transform transition hover:scale-105 opacity-75 cursor-not-allowed">
            <Shuffle className="w-12 h-12 mb-3 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Vyměnit kartičky</h3>
            <p className="text-purple-100 text-sm">Vyměň duplikáty s ostatními hráči</p>
            <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
              <span className="text-sm">Brzy dostupné</span>
            </div>
          </button>

          {/* Kolekce */}
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-6 text-white shadow-xl transform transition hover:scale-105 opacity-75 cursor-not-allowed">
            <Users className="w-12 h-12 mb-3 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Moje kolekce</h3>
            <p className="text-blue-100 text-sm">Prohlédni si své kartičky</p>
            <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
              <span className="text-sm">Brzy dostupné</span>
            </div>
          </button>
        </div>

        {/* Denní úkoly */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            Denní úkoly
          </h2>
          <div className="space-y-3">
            {dailyTasks.map(task => (
              <div key={task.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium">{task.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${(task.progress / task.max) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-blue-200">{task.progress}/{task.max}</span>
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl px-3 py-2 ml-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{task.reward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pack Shop Modal */}
      {showPackShop && (
        <PackShop
          coinsBalance={playerStats.coinsBalance}
          onClose={() => setShowPackShop(false)}
          onPurchase={handlePackPurchase}
        />
      )}
    </>
  );
}

export default GameHomeScreen;