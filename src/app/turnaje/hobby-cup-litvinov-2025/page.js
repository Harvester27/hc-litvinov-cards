'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, Users, ArrowLeft,
  Shield, Star, Award, Clock, Target, Swords,
  ChevronRight, Hash, TrendingUp, TrendingDown,
  Minus, Goal, AlertCircle, Medal
} from 'lucide-react';

export default function HobbyCupDetailPage() {
  const [activeTab, setActiveTab] = useState('tabulka'); // tabulka, rozpis, statistiky

  // Data týmů pro tabulku
  const teams = [
    {
      position: 1,
      name: 'HC Litvínov Lancers',
      flag: '🇨🇿',
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
      trend: 'stable'
    },
    {
      position: 2,
      name: 'Berlín All Stars',
      flag: '🇩🇪',
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
      trend: 'stable'
    },
    {
      position: 3,
      name: 'Alpha Team Berlín A',
      flag: '🇩🇪',
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
      trend: 'stable'
    },
    {
      position: 4,
      name: 'Alpha Team Berlín B',
      flag: '🇩🇪',
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
      trend: 'stable'
    }
  ];

  // Připravená struktura pro rozpis zápasů
  const schedule = [
    // Sem přidáme rozpis zápasů
  ];

  // Připravená struktura pro statistiky
  const statistics = {
    topScorers: [],
    topAssists: [],
    topGoalies: []
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
                      HOBBY CUP LITVÍNOV 2025
                    </h1>
                    <p className="text-gray-400 text-lg mt-1">
                      Mezinárodní turnaj amatérských hokejových týmů
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">15. - 17. března 2025</span>
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
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Putovní pohár</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
                <div className="text-white font-black text-xl">HLAVNÍ CENA</div>
                <div className="text-yellow-400 text-sm">Putovní pohár</div>
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
              <span>Tabulka</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rozpis')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'rozpis'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Rozpis zápasů</span>
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
              <span>Statistiky</span>
            </div>
          </button>
        </div>

        {/* Obsah podle aktivní záložky */}
        {activeTab === 'tabulka' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-700">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                Tabulka skupiny
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-bold">#</th>
                    <th className="text-left p-4 text-gray-400 font-bold">Tým</th>
                    <th className="text-center p-4 text-gray-400 font-bold">Z</th>
                    <th className="text-center p-4 text-gray-400 font-bold">V</th>
                    <th className="text-center p-4 text-gray-400 font-bold">R</th>
                    <th className="text-center p-4 text-gray-400 font-bold">P</th>
                    <th className="text-center p-4 text-gray-400 font-bold">VG</th>
                    <th className="text-center p-4 text-gray-400 font-bold">OG</th>
                    <th className="text-center p-4 text-gray-400 font-bold">+/-</th>
                    <th className="text-center p-4 text-gray-400 font-bold">B</th>
                    <th className="text-center p-4 text-gray-400 font-bold hidden lg:table-cell">Forma</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr 
                      key={team.name}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        team.name.includes('Litvínov') ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-bold">{team.position}</span>
                          {team.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {team.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                          {team.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{team.flag}</span>
                          <span className={`font-bold ${
                            team.name.includes('Litvínov') ? 'text-red-500' : 'text-white'
                          }`}>
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center p-4 text-gray-300">{team.played}</td>
                      <td className="text-center p-4 text-green-400 font-semibold">{team.wins}</td>
                      <td className="text-center p-4 text-yellow-400 font-semibold">{team.draws}</td>
                      <td className="text-center p-4 text-red-400 font-semibold">{team.losses}</td>
                      <td className="text-center p-4 text-gray-300">{team.goalsFor}</td>
                      <td className="text-center p-4 text-gray-300">{team.goalsAgainst}</td>
                      <td className="text-center p-4">
                        <span className={`font-semibold ${
                          team.goalsFor - team.goalsAgainst > 0 ? 'text-green-400' :
                          team.goalsFor - team.goalsAgainst < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {team.goalsFor - team.goalsAgainst > 0 && '+'}
                          {team.goalsFor - team.goalsAgainst}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className="text-xl font-black text-white">{team.points}</span>
                      </td>
                      <td className="text-center p-4 hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {team.form.length > 0 ? (
                            team.form.map((result, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  result === 'V' ? 'bg-green-500 text-white' :
                                  result === 'R' ? 'bg-yellow-500 text-black' :
                                  'bg-red-500 text-white'
                                }`}
                              >
                                {result}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legenda */}
            <div className="p-6 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Z - Zápasy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">V - Výhry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">R - Remízy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">P - Prohry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">VG - Vstřelené góly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">OG - Obdržené góly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">B - Body</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rozpis' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Rozpis bude zveřejněn brzy</h3>
              <p className="text-gray-400">
                Detailní rozpis zápasů bude k dispozici po uzavření registrací týmů.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'statistiky' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center py-16">
              <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Statistiky budou dostupné po zahájení turnaje</h3>
              <p className="text-gray-400">
                Nejlepší střelci, nahrávači a brankáři budou zobrazeni zde.
              </p>
            </div>
          </div>
        )}

        {/* Informace o turnaji */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Formát turnaje
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Každý s každým - základní skupina</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Dva nejlepší týmy postoupí do finále</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Třetí a čtvrtý tým sehrají zápas o 3. místo</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Hrací doba: 3x20 minut čistého času</span>
              </li>
            </ul>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" />
              Ceny pro vítěze
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold">1.</span>
                <span>Putovní pohár + zlaté medaile + diplomy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">2.</span>
                <span>Stříbrné medaile + diplomy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">3.</span>
                <span>Bronzové medaile + diplomy</span>
              </li>
              <li className="flex items-start gap-2">
                <Trophy className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <span>Individuální ocenění pro nejlepší hráče</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}