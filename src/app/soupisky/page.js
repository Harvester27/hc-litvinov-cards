'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { Users, Shield, Target, Heart, Star, Award, ArrowLeft, ChevronRight } from 'lucide-react';
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
            const [firstName, ...surnameParts] = player.name.split(' ');
            const surname = surnameParts.join(' ') || firstName;
            const nationalityCode = player.nationality === '🇸🇰' ? 'SK' : 'CZ';
            const statsLabel = stats && stats.gamesPlayed > 0
              ? player.category === 'goalies'
                ? stats.savePercentage
                  ? `${stats.gamesPlayed} zápasů • ${stats.savePercentage} úspěšnost`
                  : `${stats.gamesPlayed} zápasů`
                : `${stats.goals}G ${stats.assists}A • ${stats.points} bodů`
              : 'Statistiky zatím nejsou k dispozici';
            
            return (
              <article
                key={player.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-amber-950/30"
              >
                <div className="relative h-[330px] overflow-hidden bg-[radial-gradient(circle_at_78%_48%,rgba(225,29,72,0.28),transparent_58%),linear-gradient(145deg,#1b2432_0%,#111827_55%,#3b0710_100%)]">
                  <div className="absolute -right-16 top-24 h-56 w-80 rotate-[-10deg] rounded-[50%] bg-red-600/10 blur-2xl" />
                  <div className="absolute inset-x-0 bottom-24 h-px -rotate-6 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

                  {player.photo ? (
                    <Image
                      src={player.photo}
                      alt={`Portrét hráče ${player.name}`}
                      width={800}
                      height={800}
                      sizes="(min-width: 1024px) 390px, (min-width: 768px) 48vw, 100vw"
                      className="absolute bottom-0 left-1/2 h-[96%] w-[96%] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_14px_16px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div
                      className="absolute inset-x-0 bottom-0 flex h-[88%] items-end justify-center text-black/60 drop-shadow-[0_14px_18px_rgba(0,0,0,0.55)]"
                      aria-label={`Fotografie hráče ${player.name} bude doplněna`}
                    >
                      <svg viewBox="0 0 320 320" className="h-full w-auto" aria-hidden="true">
                        <circle cx="160" cy="92" r="66" fill="currentColor" opacity="0.78" />
                        <path d="M38 320c4-78 49-126 122-126s118 48 122 126H38Z" fill="currentColor" opacity="0.88" />
                        <path d="M104 185c16 20 34 30 56 30s40-10 56-30l20 17c-20 31-45 47-76 47s-56-16-76-47l20-17Z" fill="#111827" opacity="0.8" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />

                  <div className={`absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${getPositionColor(player.position)} border border-white/20 shadow-xl transition-transform duration-300 group-hover:scale-105`}>
                    <span className="text-xl font-black text-white">#{player.number ?? '—'}</span>
                  </div>
                  <div className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-black text-white backdrop-blur">
                    {nationalityCode}
                  </div>

                  <div className="absolute inset-x-0 bottom-5 px-6">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-gray-300">
                      {surnameParts.length ? firstName : ''}
                    </p>
                    <h3 className="mt-1 break-words text-[1.7rem] font-black uppercase leading-none tracking-tight text-white transition-colors group-hover:text-amber-400 sm:text-3xl">
                      {surname}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-emerald-300">
                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${getPositionColor(player.position)}`} />
                    {player.position}
                  </div>

                  <div className="mb-4 flex min-h-12 items-center rounded-xl border border-amber-400/10 bg-amber-500/10 px-4 py-3">
                    <p className={`text-sm font-bold ${stats && stats.gamesPlayed > 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                      {statsLabel}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                      <div className="text-xs text-gray-400">Věk</div>
                      <div className="mt-1 text-lg font-black text-white">{player.age ?? '—'}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                      <div className="text-xs text-gray-400">Výška</div>
                      <div className="mt-1 text-lg font-black text-white">{player.height ? `${player.height} cm` : '—'}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                      <div className="text-xs text-gray-400">Váha</div>
                      <div className="mt-1 text-lg font-black text-white">{player.weight ? `${player.weight} kg` : '—'}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
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
                      className="flex items-center gap-1 text-sm font-bold text-amber-400 transition-all hover:gap-2 hover:text-amber-300"
                    >
                      Zobrazit profil
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
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
