// components/GameHomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  User, LogOut, Flame, Trophy, Package, Shuffle, Settings, 
  Star, Award, Users, Target, Clock, Plus, Sparkles 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function GameHomeScreen({ user }) {
  const [playerStats, setPlayerStats] = useState({
    cardsOwned: 0,
    cardsNeeded: 150,
    coinsBalance: 500,
    level: 1,
    experience: 0
  });

  const [dailyTasks] = useState([
    { id: 1, name: "Otevři 3 balíčky", progress: 0, max: 3, reward: 50 },
    { id: 2, name: "Vyměň 2 kartičky", progress: 0, max: 2, reward: 75 },
    { id: 3, name: "Přihlas se 5 dní v řadě", progress: 1, max: 5, reward: 200 }
  ]);

  // Načtení hráčských dat při načtení komponenty
  useEffect(() => {
    // Zde bys načítal data z Firestore
    // loadPlayerData(user.uid);
    
    // Pro demo, simulujeme načtení dat
    const savedStats = localStorage.getItem(`playerStats_${user.uid}`);
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    } else {
      // Nový hráč - nastav základní statistiky
      const newPlayerStats = {
        cardsOwned: 3, // Startovní karty
        cardsNeeded: 147,
        coinsBalance: 1000, // Startovní coiny
        level: 1,
        experience: 0
      };
      setPlayerStats(newPlayerStats);
      localStorage.setItem(`playerStats_${user.uid}`, JSON.stringify(newPlayerStats));
    }
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleOpenPack = () => {
    if (playerStats.coinsBalance >= 100) {
      // Simulace otevření balíčku
      const newStats = {
        ...playerStats,
        coinsBalance: playerStats.coinsBalance - 100,
        cardsOwned: playerStats.cardsOwned + 3,
        cardsNeeded: Math.max(0, playerStats.cardsNeeded - 3),
        experience: playerStats.experience + 50
      };
      
      // Kontrola level up
      if (newStats.experience >= newStats.level * 1000) {
        newStats.level += 1;
        newStats.experience = newStats.experience - (newStats.level - 1) * 1000;
      }
      
      setPlayerStats(newStats);
      localStorage.setItem(`playerStats_${user.uid}`, JSON.stringify(newStats));
      
      alert(`🎉 Získal jsi 3 nové karty! Nyní máš ${newStats.cardsOwned} karet.`);
    } else {
      alert('⚠️ Nemáš dostatek coinů! Potřebuješ 100 coinů.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
              <Flame className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">HC Litvínov Cards</h1>
              <p className="text-blue-300 text-sm">Vítej zpět, {user.displayName || user.email.split('@')[0]}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-yellow-400 text-sm">💰</span>
              <span className="font-semibold">{playerStats.coinsBalance}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-full text-red-300 hover:text-red-200 transition-all flex items-center gap-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Odhlásit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Statistiky hráče */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="text-blue-400" size={28} />
            Tvůj Profil
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
              <Package className="text-blue-400 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold">{playerStats.cardsOwned}</div>
              <div className="text-blue-300 text-sm">Karet vlastníš</div>
            </div>
            
            <div className="bg-red-500/20 rounded-2xl p-4 text-center">
              <Target className="text-red-400 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold">{playerStats.cardsNeeded}</div>
              <div className="text-red-300 text-sm">Karet chybí</div>
            </div>
            
            <div className="bg-yellow-500/20 rounded-2xl p-4 text-center">
              <Award className="text-yellow-400 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold">LVL {playerStats.level}</div>
              <div className="text-yellow-300 text-sm">Úroveň</div>
            </div>
            
            <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
              <Sparkles className="text-purple-400 mx-auto mb-2" size={32} />
              <div className="text-2xl font-bold">{playerStats.experience}</div>
              <div className="text-purple-300 text-sm">XP bodů</div>
            </div>
          </div>

          {/* Progress bar pro level */}
          <div className="mt-4 bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(playerStats.experience / (playerStats.level * 1000)) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            {playerStats.experience} / {playerStats.level * 1000} XP do dalšího levelu
          </div>
        </div>

        {/* Hlavní herní akce */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={handleOpenPack}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <div className="text-center">
              <Plus className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Otevři Balíček</h3>
              <p className="text-green-200 text-sm">Získej 3 nové kartičky!</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">💰 100 coinů</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <Package className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Moje Kolekce</h3>
              <p className="text-blue-200 text-sm">Prohlédni si své karty</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">{playerStats.cardsOwned} karet</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <Shuffle className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Vyměň Karty</h3>
              <p className="text-purple-200 text-sm">Obchoduj s hráči</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">🔄 Výměny</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-6 hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <Trophy className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Turnaje</h3>
              <p className="text-yellow-200 text-sm">Soutěž s ostatními!</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">🏆 Soutěže</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-pink-600 to-red-600 rounded-3xl p-6 hover:from-pink-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <Users className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Přátelé</h3>
              <p className="text-pink-200 text-sm">Najdi kamarády</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">👥 Sociální</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-6 hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
            <div className="text-center">
              <Settings className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Nastavení</h3>
              <p className="text-gray-200 text-sm">Uprav profil</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">⚙️ Možnosti</span>
              </div>
            </div>
          </button>
        </div>

        {/* Denní úkoly */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-green-400" size={28} />
            Denní Úkoly
          </h2>
          
          <div className="space-y-4">
            {dailyTasks.map(task => (
              <div key={task.id} className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="bg-gray-700 rounded-full h-2 flex-1 max-w-32">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(task.progress / task.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-300">{task.progress}/{task.max}</span>
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-full px-3 py-1 ml-4">
                  <span className="text-yellow-400 font-semibold">💰 {task.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Novinky */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={24} />
            Novinky
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold">Vítej v HC Litvínov Cards!</p>
                <p className="text-sm text-gray-300">Začni svou sběratelskou cestu otevřením prvního balíčku.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-semibold">Denní odměny čekají!</p>
                <p className="text-sm text-gray-300">Plň úkoly a získávej extra coiny a XP body.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameHomeScreen;