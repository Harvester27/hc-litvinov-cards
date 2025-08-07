'use client';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function GameHomeScreen({ user }) {
  const [coins, setCoins] = useState(1000);
  const [cards, setCards] = useState(3);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleOpenPack = () => {
    if (coins >= 100) {
      setCoins(coins - 100);
      setCards(cards + 3);
      alert('🎉 Získal jsi 3 nové karty!');
    } else {
      alert('⚠️ Nemáš dostatek coinů!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏒</div>
            <div>
              <h1 className="text-xl font-bold">HC Litvínov Cards</h1>
              <p className="text-blue-300 text-sm">
                Vítej, {user.displayName || user.email}!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <span className="font-semibold">💰 {coins}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-full text-red-300"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">📊 Tvoje Statistiky</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{cards}</div>
              <div className="text-blue-300">Počet karet</div>
            </div>
            <div className="bg-yellow-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">{coins}</div>
              <div className="text-yellow-300">Coiny</div>
            </div>
            <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">1</div>
              <div className="text-purple-300">Level</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={handleOpenPack}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-xl font-bold mb-2">Otevři Balíček</h3>
              <p className="text-green-200 text-sm">Získej 3 nové kartičky!</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">💰 100 coinů</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">🎴</div>
              <h3 className="text-xl font-bold mb-2">Moje Kolekce</h3>
              <p className="text-blue-200 text-sm">Prohlédni si své karty</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">{cards} karet</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">🔄</div>
              <h3 className="text-xl font-bold mb-2">Vyměň Karty</h3>
              <p className="text-purple-200 text-sm">Obchoduj s hráči</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">Brzy!</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-6 hover:from-yellow-500 hover:to-orange-500 transition-all transform hover:scale-105 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Turnaje</h3>
              <p className="text-yellow-200 text-sm">Soutěž s ostatními!</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">Brzy!</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-pink-600 to-red-600 rounded-3xl p-6 hover:from-pink-500 hover:to-red-500 transition-all transform hover:scale-105 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Přátelé</h3>
              <p className="text-pink-200 text-sm">Najdi kamarády</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">Brzy!</span>
              </div>
            </div>
          </button>

          <button className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-6 hover:from-gray-500 hover:to-gray-600 transition-all transform hover:scale-105 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Nastavení</h3>
              <p className="text-gray-200 text-sm">Uprav profil</p>
              <div className="mt-4 bg-white/20 rounded-full px-3 py-1 inline-block">
                <span className="text-sm">Brzy!</span>
              </div>
            </div>
          </button>
        </div>

        {/* Daily tasks */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">📅 Denní Úkoly</h2>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <span>Otevři 3 balíčky</span>
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300">
                💰 50
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <span>Vyměň 2 kartičky</span>
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300">
                💰 75
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
              <span>Přihlas se 5 dní v řadě</span>
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300">
                💰 200
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}