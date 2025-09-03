// Soubor: app/turnaje/hobby-cup-litvinov-2025/page.js
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, Users, ArrowLeft,
  Shield, Star, Award, Clock, Target, Swords,
  ChevronRight, Hash, TrendingUp, TrendingDown,
  Minus, Goal, AlertCircle, Medal, CheckCircle,
  X, User, Timer, Activity,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';

export default function HobbyCupDetailPage() {
  const [activeTab, setActiveTab] = useState('tabulka');
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'desc' });

  // Komponenta pro vlajku
  const Flag = ({ country }) => {
    if (country === 'DE') {
      return (
        <div className="w-8 h-5 flex overflow-hidden rounded-sm border border-gray-600">
          <div className="w-1/3 bg-black"></div>
          <div className="w-1/3 bg-red-600"></div>
          <div className="w-1/3 bg-yellow-400"></div>
        </div>
      );
    }
    if (country === 'CZ') {
      return (
        <div className="w-8 h-5 flex flex-col overflow-hidden rounded-sm border border-gray-600">
          <div className="h-1/2 bg-white"></div>
          <div className="h-1/2 bg-red-600"></div>
          <div className="absolute w-0 h-0 border-l-[16px] border-l-blue-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"></div>
        </div>
      );
    }
    return null;
  };

  // Finální tabulka turnaje - základní skupina
  const teams = [
    {
      position: 1,
      name: 'Alpha Team A',
      country: 'DE',
      logo: '/images/loga/AlphaA.png',
      played: 3,
      wins: 2,
      draws: 0,
      losses: 1,
      goalsFor: 9,
      goalsAgainst: 10,
      points: 6,
      form: ['V', 'P', 'V'],
      trend: 'stable'
    },
    {
      position: 2,
      name: 'Alpha Team B',
      country: 'DE',
      logo: '/images/loga/AlphaB.png',
      played: 3,
      wins: 2,
      draws: 0,
      losses: 1,
      goalsFor: 15,
      goalsAgainst: 13,
      points: 6,
      form: ['V', 'V', 'P'],
      trend: 'stable'
    },
    {
      position: 3,
      name: 'HC Litvínov Lancers',
      country: 'CZ',
      logo: '/images/loga/lancers-logo.png',
      played: 3,
      wins: 1,
      draws: 2,
      losses: 0,
      goalsFor: 15,
      goalsAgainst: 12,
      points: 5,
      form: ['P', 'V', 'Vsn'],
      trend: 'stable'
    },
    {
      position: 4,
      name: 'Berlin All Stars',
      country: 'DE',
      logo: '/images/loga/Berlin.png',
      played: 3,
      wins: 0,
      draws: 1,
      losses: 2,
      goalsFor: 6,
      goalsAgainst: 10,
      points: 1,
      form: ['P', 'P', 'Psn'],
      trend: 'stable'
    }
  ];

  // Výsledky všech zápasů
  const results = [
    // Pátek 29.8.2025
    { 
      id: 1,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-1',
      date: '29.8.2025', 
      time: '20:30', 
      team1: 'Litvínov', 
      team2: 'Alpha Team B', 
      score: '5:7', 
      day: 'Pátek',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaB.png'
    },
    { 
      id: 2,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-2',
      date: '29.8.2025', 
      time: '21:30', 
      team1: 'Alpha Team A', 
      team2: 'Berlin All Stars', 
      score: '2:0', 
      day: 'Pátek',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/Berlin.png'
    },
    // Sobota 30.8.2025 - základní skupina
    { 
      id: 3,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-3',
      date: '30.8.2025', 
      time: '08:00', 
      team1: 'Litvínov', 
      team2: 'Alpha Team A', 
      score: '5:1', 
      day: 'Sobota',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaA.png'
    },
    { 
      id: 4,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-4',
      date: '30.8.2025', 
      time: '09:00', 
      team1: 'Berlin All Stars', 
      team2: 'Alpha Team B', 
      score: '2:3', 
      day: 'Sobota',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/AlphaB.png'
    },
    { 
      id: 5,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-5',
      date: '30.8.2025', 
      time: '10:00', 
      team1: 'Berlin All Stars', 
      team2: 'Litvínov', 
      score: '4:5', 
      day: 'Sobota', 
      note: 'po prodloužení',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/lancers-logo.png'
    },
    { 
      id: 6,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-6',
      date: '30.8.2025', 
      time: '14:00', 
      team1: 'Alpha Team A', 
      team2: 'Alpha Team B', 
      score: '6:5', 
      day: 'Sobota',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/AlphaB.png'
    },
    // Sobota 30.8.2025 - Semifinále
    { 
      id: 7,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-7',
      date: '30.8.2025', 
      time: '15:00', 
      team1: 'Alpha Team A', 
      team2: 'Berlin All Stars', 
      score: '2:5', 
      day: 'Semifinále', 
      type: 'Semifinále 1',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/Berlin.png'
    },
    { 
      id: 8,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-8',
      date: '30.8.2025', 
      time: '16:00', 
      team1: 'Alpha Team B', 
      team2: 'Litvínov', 
      score: '4:3', 
      day: 'Semifinále', 
      type: 'Semifinále 2',
      logo1: '/images/loga/AlphaB.png',
      logo2: '/images/loga/lancers-logo.png'
    },
    // Neděle 31.8.2025 - O umístění
    { 
      id: 9,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-9',
      date: '31.8.2025', 
      time: '09:00', 
      team1: 'Litvínov', 
      team2: 'Alpha Team A', 
      score: '4:5 sn', 
      day: 'Umístění', 
      type: 'O 3. místo',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaA.png'
    },
    { 
      id: 10,
      link: '/turnaje/hobby-cup-litvinov-2025/zapas-10',
      date: '31.8.2025', 
      time: '10:00', 
      team1: 'Berlin All Stars', 
      team2: 'Alpha Team B', 
      score: '1:2', 
      day: 'Umístění', 
      type: 'Finále',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/AlphaB.png'
    },
  ];

  // Agregovaná data hráčů ze zápasů 1 a 2
  const playerStats = [
    // HC Litvínov Lancers
    { name: 'Václav Materna', team: 'HC Litvínov Lancers', country: 'CZ', goals: 2, assists: 2, points: 4, penalties: 0, games: 1 },
    { name: 'Václav Matějovič', team: 'HC Litvínov Lancers', country: 'CZ', goals: 1, assists: 2, points: 3, penalties: 0, games: 1 },
    { name: 'Gustav Toman', team: 'HC Litvínov Lancers', country: 'CZ', goals: 1, assists: 0, points: 1, penalties: 0, games: 1 },
    { name: 'Ondřej Kocourek', team: 'HC Litvínov Lancers', country: 'CZ', goals: 1, assists: 0, points: 1, penalties: 2, games: 1 },
    { name: 'Ladislav Černý', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 1, points: 1, penalties: 0, games: 1 },
    { name: 'Jiří Belinger', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Jindřich Belinger', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Jiří Šalanda', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Jan Švarc', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Stanislav Švarc', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Jiří Morávek', team: 'HC Litvínov Lancers', country: 'CZ', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    
    // Alpha Team B
    { name: 'Ivan Patayala', team: 'Alpha Team B', country: 'DE', goals: 3, assists: 1, points: 4, penalties: 0, games: 1 },
    { name: 'Igor Nalyotov', team: 'Alpha Team B', country: 'DE', goals: 2, assists: 0, points: 2, penalties: 2, games: 1 },
    { name: 'Peter Eisele', team: 'Alpha Team B', country: 'DE', goals: 1, assists: 1, points: 2, penalties: 0, games: 1 },
    { name: 'Leonid Hansen', team: 'Alpha Team B', country: 'DE', goals: 1, assists: 0, points: 1, penalties: 0, games: 1 },
    { name: 'Sergey Terechov', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 1, points: 1, penalties: 0, games: 1 },
    { name: 'Artur Lishchynsky', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 1, points: 1, penalties: 0, games: 1 },
    { name: 'Sergey Schnarr (B)', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 1, points: 1, penalties: 0, games: 1 },
    { name: 'Alexander Zhiliaev', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Sergey Wotschel', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Leon Patz', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Vladimir Visner', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Sergey Antipov', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Andrey Esser', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Lars Bethke', team: 'Alpha Team B', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    
    // Alpha Team A
    { name: 'Sergey Schnarr (A)', team: 'Alpha Team A', country: 'DE', goals: 1, assists: 0, points: 1, penalties: 0, games: 1 },
    { name: 'Nikita Helm', team: 'Alpha Team A', country: 'DE', goals: 1, assists: 0, points: 1, penalties: 0, games: 1 },
    { name: 'Alexander Plinger', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 1, points: 1, penalties: 2, games: 1 },
    { name: 'Maurice Giese', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 2, games: 1 },
    { name: 'Alexander Hermann', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Dennis Hermann', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Mark Wassermann', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Andrey Schapovalov', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Dennis Schuler', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Nikita Kulpin', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Igor Nalyotov (A)', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Alexandra Hesse', team: 'Alpha Team A', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    
    // Berlin All Stars
    { name: 'Tim Bartsch', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 2, games: 1 },
    { name: 'Daety Ertel', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 2, games: 1 },
    { name: 'Guido Martin', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Leon Wäser', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Marco Rensch', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Matthias Blaschzik', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Frank Blaschzik', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'David Weiss', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Ricardo Pietsch', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Felix Schliemann', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Daniel Pietsch', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Jan Fritche', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Peter Angrik', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
    { name: 'Daniel Herzog', team: 'Berlin All Stars', country: 'DE', goals: 0, assists: 0, points: 0, penalties: 0, games: 1 },
  ];

  // Funkce pro řazení
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Seřazená data
  const sortedPlayerStats = useMemo(() => {
    const sorted = [...playerStats].sort((a, b) => {
      if (sortConfig.key === 'name' || sortConfig.key === 'team') {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      }
      
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] - b[sortConfig.key];
      }
      return b[sortConfig.key] - a[sortConfig.key];
    });

    // Přidáme pořadí
    return sorted.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  }, [playerStats, sortConfig]);

  // Komponenta pro ikonu řazení
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="w-3 h-3 text-gray-500" />;
    }
    return sortConfig.direction === 'desc' 
      ? <ArrowDown className="w-3 h-3 text-red-500" />
      : <ArrowUp className="w-3 h-3 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <Navigation />
      
      {/* Hero sekce s informacemi o turnaji */}
      <div className="relative mt-28 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 animate-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          {/* Navigační drobečky */}
          <Link 
            href="/turnaje" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět na přehled turnajů</span>
          </Link>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-10 h-10 text-yellow-500" />
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white">
                      HOBBY HOCKEY LITVÍNOV 2025
                    </h1>
                    <p className="text-gray-400 text-lg mt-1">
                      Mezinárodní turnaj amatérských hokejových týmů
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">29. - 31. srpna 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">Zimní stadion Litvínov</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">4 týmy</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-400">Dokončeno</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
                <div className="text-white font-black text-xl">VÍTĚZ</div>
                <div className="text-yellow-400 text-lg font-bold">Alpha Team B</div>
                <Flag country="DE" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hlavní obsah */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Navigace mezi sekcemi */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tabulka')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'tabulka'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Konečná tabulka</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('vysledky')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'vysledky'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Výsledky zápasů</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('statistiky')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'statistiky'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Statistiky hráčů</span>
            </div>
          </button>
        </div>

        {/* Obsah podle aktivní záložky */}
        {activeTab === 'tabulka' && (
          // ... kód pro tabulku týmů (kvůli limitu zkráceno)
          <div>Tabulka týmů</div>
        )}

        {activeTab === 'vysledky' && (
          // ... kód pro výsledky (kvůli limitu zkráceno)
          <div>Výsledky zápasů</div>
        )}

        {activeTab === 'statistiky' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-700">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Star className="w-6 h-6" />
                Individuální statistiky hráčů
              </h2>
              <p className="text-red-200 text-sm mt-1">Data ze zápasů 1 a 2 (později budou doplněny další zápasy)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-bold">#</th>
                    <th className="text-left p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        Hráč <SortIcon column="name" />
                      </button>
                    </th>
                    <th className="text-left p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('team')}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        Tým <SortIcon column="team" />
                      </button>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('games')}
                        className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                      >
                        Z <SortIcon column="games" />
                      </button>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('goals')}
                        className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                      >
                        G <SortIcon column="goals" />
                      </button>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('assists')}
                        className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                      >
                        A <SortIcon column="assists" />
                      </button>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('points')}
                        className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                      >
                        KB <SortIcon column="points" />
                      </button>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-bold">
                      <button 
                        onClick={() => handleSort('penalties')}
                        className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                      >
                        TM <SortIcon column="penalties" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayerStats.map((player, index) => (
                    <tr 
                      key={`${player.name}-${player.team}`}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        player.team.includes('Litvínov') ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="p-4 text-gray-400">
                        {sortConfig.key === 'points' && index < 3 ? (
                          <div className="flex items-center gap-2">
                            {index === 0 && <Medal className="w-4 h-4 text-yellow-500" />}
                            {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                            {index === 2 && <Medal className="w-4 h-4 text-orange-600" />}
                            <span className={`font-bold ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-orange-600' : ''
                            }`}>
                              {player.rank}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold">{player.rank}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${
                          player.team.includes('Litvínov') ? 'text-red-500' : 'text-white'
                        }`}>
                          {player.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Flag country={player.country} />
                          <span className="text-gray-300 text-sm">{player.team}</span>
                        </div>
                      </td>
                      <td className="text-center p-4 text-gray-300">{player.games}</td>
                      <td className="text-center p-4">
                        <span className={`font-semibold ${
                          player.goals > 0 ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {player.goals}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className={`font-semibold ${
                          player.assists > 0 ? 'text-blue-400' : 'text-gray-500'
                        }`}>
                          {player.assists}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className={`font-black text-lg ${
                          player.points > 0 ? 'text-yellow-400' : 'text-gray-500'
                        }`}>
                          {player.points}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className={`font-semibold ${
                          player.penalties > 0 ? 'text-orange-400' : 'text-gray-500'
                        }`}>
                          {player.penalties}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legenda */}
            <div className="p-6 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Z - Odehrané zápasy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">G - Góly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">A - Asistence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">KB - Kanadské body (góly + asistence)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">TM - Trestné minuty</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Kliknutím na záhlaví sloupce lze seřadit tabulku podle dané hodnoty
              </div>
            </div>
          </div>
        )}

        {/* Finální umístění */}
        <div className="mt-12 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Konečné pořadí
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/40 rounded-xl p-4 border border-yellow-500/50">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8 text-yellow-500" />
                <span className="text-3xl font-black text-yellow-500">1.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/AlphaB.png" alt="Alpha Team B" width={32} height={32} className="object-contain" />
              </div>
              <div className="text-xl font-bold text-white">Alpha Team B</div>
              <div className="text-gray-400 text-sm">Vítěz finále</div>
              <Flag country="DE" />
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-gray-400/50">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8 text-gray-400" />
                <span className="text-3xl font-black text-gray-400">2.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/Berlin.png" alt="Berlin All Stars" width={32} height={32} className="object-contain" />
              </div>
              <div className="text-xl font-bold text-white">Berlin All Stars</div>
              <div className="text-gray-400 text-sm">Finalista</div>
              <Flag country="DE" />
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-orange-600/50">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-black text-orange-600">3.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/AlphaA.png" alt="Alpha Team A" width={32} height={32} className="object-contain" />
              </div>
              <div className="text-xl font-bold text-white">Alpha Team A</div>
              <div className="text-gray-400 text-sm">Výhra po nájezdech</div>
              <Flag country="DE" />
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-gray-600" />
                <span className="text-3xl font-black text-gray-600">4.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/lancers-logo.png" alt="HC Litvínov Lancers" width={32} height={32} className="object-contain" />
              </div>
              <div className="text-xl font-bold text-red-500">HC Litvínov Lancers</div>
              <div className="text-gray-400 text-sm">4. místo</div>
              <Flag country="CZ" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}