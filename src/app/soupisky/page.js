'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Users, Shield, Target, Heart, Star, Award, ArrowLeft, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { playerData } from '@/data/playerData';
import { getPlayerStats } from '@/data/playerStats';

export default function SoupiskyPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Všichni hráči', icon: <Users size={18} /> },
    { id: 'goalies', label: 'Brankáři', icon: <Shield size={18} /> },
    { id: 'defenders', label: 'Obránci', icon: <Heart size={18} /> },
    { id: 'forwards', label: 'Útočníci', icon: <Target size={18} /> }
  ];

  const filteredPlayers = selectedCategory === 'all' 
    ? playerData 
    : playerData.filter(p => p.category === selectedCategory);

  const getPositionColor = (position) => {
    if (position === 'Brankář') return 'from-blue-600 to-cyan-600';
    if (position === 'Obránce') return 'from-green-600 to-emerald-600';
    return 'from-red-600 to-orange-600';
  };

  const getPlayerRating = (player) => {
    const stats = getPlayerStats(player.id);
    if (!stats || stats.gamesPlayed === 0) return 3;
    
    // Jednoduchý výpočet hodnocení na základě statistik
    if (player.category === 'goalies') {
      const savePerc = parseFloat(stats.savePercentage) || 0;
      if (savePerc > 90) return 5;
      if (savePerc > 85) return 4;
      return 3;
    } else {
      const ppg = stats.points / stats.gamesPlayed;
      if (ppg > 1) return 5;
      if (ppg > 0.5) return 4;
      return 3;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/10 to-slate-900">
      <Navigation />
      
      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na hlavní stránku</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Soupiska týmu</h1>
              <p className="text-gray-300 mt-1">Sezóna 2024/2025 • KHLA Sportega Liga</p>
            </div>
          </div>

          {/* Filtry */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-full text-sm">
                  {cat.id === 'all' ? playerData.length : playerData.filter(p => p.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hráči */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => {
            const stats = getPlayerStats(player.id);
            const rating = getPlayerRating(player);
            
            return (
              <div 
                key={player.id}
                className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getPositionColor(player.position)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-white text-2xl font-bold">#{player.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-gray-400">{player.position}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{player.nationality}</span>
                </div>
                
                {/* Quick Stats */}
                {stats && stats.gamesPlayed > 0 && (
                  <div className="mb-3 p-2 bg-amber-600/10 rounded-lg">
                    <div className="text-xs text-amber-400 font-semibold">
                      {player.category === 'goalies' 
                        ? `${stats.gamesPlayed} zápasů • ${stats.savePercentage} úspěšnost`
                        : `${stats.goals}G ${stats.assists}A • ${stats.points} bodů`
                      }
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Věk</div>
                    <div className="text-white font-bold">{player.age}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Výška</div>
                    <div className="text-white font-bold">{player.height}cm</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="text-gray-400 text-xs">Váha</div>
                    <div className="text-white font-bold">{player.weight}kg</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="text-amber-400" 
                        size={16} 
                        fill={i < rating ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                  <Link 
                    href={`/profil/${player.id}`}
                    className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Zobrazit profil
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiky týmu */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-3xl p-8 backdrop-blur border border-amber-500/30">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="text-amber-400" size={32} />
            Statistiky soupisky
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-4xl font-bold text-amber-400">{playerData.filter(p => p.category === 'goalies').length}</div>
              <div className="text-gray-300 mt-1">Brankáři</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-4xl font-bold text-amber-400">{playerData.filter(p => p.category === 'defenders').length}</div>
              <div className="text-gray-300 mt-1">Obránci</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-4xl font-bold text-amber-400">{playerData.filter(p => p.category === 'forwards').length}</div>
              <div className="text-gray-300 mt-1">Útočníci</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-4xl font-bold text-amber-400">{playerData.length}</div>
              <div className="text-gray-300 mt-1">Celkem hráčů</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky KHLA Sportega Liga</p>
          </div>
        </div>
      </footer>
    </div>
  );
}