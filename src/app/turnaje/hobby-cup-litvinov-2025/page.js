'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, Users, ArrowLeft,
  Shield, Star, Award, Clock, Target, Swords,
  ChevronRight, Hash, TrendingUp, TrendingDown,
  Minus, Goal, AlertCircle, Medal, CheckCircle
} from 'lucide-react';

export default function HobbyCupDetailPage() {
  const [activeTab, setActiveTab] = useState('tabulka'); // tabulka, vysledky, statistiky

  // Finální tabulka turnaje - základní skupina
  const teams = [
    {
      position: 1,
      name: 'Alpha Team A',
      flag: '🇩🇪',
      logo: '/images/loga/AlphaA.png',
      played: 3,
      wins: 2,
      draws: 0,
      losses: 1,
      goalsFor: 9,
      goalsAgainst: 10,
      points: 6,
      form: ['V', 'V', 'P'],
      trend: 'stable'
    },
    {
      position: 2,
      name: 'Alpha Team B',
      flag: '🇩🇪',
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
      flag: '🇨🇿',
      logo: '/images/loga/lancers-logo.png',
      played: 3,
      wins: 1,
      draws: 2,
      losses: 0,
      goalsFor: 15,
      goalsAgainst: 12,
      points: 5,
      form: ['R', 'R', 'V'],
      trend: 'stable'
    },
    {
      position: 4,
      name: 'Berlin All Stars',
      flag: '🇩🇪',
      logo: '/images/loga/Berlin.png',
      played: 3,
      wins: 0,
      draws: 1,
      losses: 2,
      goalsFor: 6,
      goalsAgainst: 10,
      points: 1,
      form: ['P', 'R', 'P'],
      trend: 'stable'
    }
  ];

  // Výsledky všech zápasů
  const results = [
    // Pátek 29.8.2025
    { date: '29.8.2025', time: '20:30', team1: 'Litvínov', team2: 'Alpha Team B', score: '5:7', day: 'Pátek' },
    { date: '29.8.2025', time: '21:30', team1: 'Alpha Team A', team2: 'Berlin All Stars', score: '2:0', day: 'Pátek' },
    
    // Sobota 30.8.2025
    { date: '30.8.2025', time: '08:00', team1: 'Litvínov', team2: 'Alpha Team A', score: '1:5', day: 'Sobota' },
    { date: '30.8.2025', time: '09:00', team1: 'Berlin All Stars', team2: 'Alpha Team B', score: '2:3', day: 'Sobota' },
    { date: '30.8.2025', time: '10:00', team1: 'Berlin All Stars', team2: 'Litvínov', score: '4:5', day: 'Sobota', note: 'po prodloužení' },
    { date: '30.8.2025', time: '14:00', team1: 'Alpha Team A', team2: 'Alpha Team B', score: '6:5', day: 'Sobota' },
    
    // Neděle 31.8.2025 - Playoff
    { date: '31.8.2025', time: '15:00', team1: 'Alpha Team A', team2: 'Berlin All Stars', score: '2:5', day: 'Neděle', type: 'Semifinále 1' },
    { date: '31.8.2025', time: '16:00', team1: 'Alpha Team B', team2: 'Litvínov', score: '4:3', day: 'Neděle', type: 'Semifinále 2' },
    { date: '31.8.2025', time: '09:00', team1: 'Litvínov', team2: 'Alpha Team A', score: '4:5 sn', day: 'Neděle', type: 'O 3. místo' },
    { date: '31.8.2025', time: '10:00', team1: 'Berlin All Stars', team2: 'Alpha Team B', score: '1:2', day: 'Neděle', type: 'Finále' },
  ];

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
                <div className="text-yellow-400/60 text-sm">🇩🇪 Německo</div>
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
                Konečná tabulka
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
                      } ${index === 0 ? 'bg-yellow-500/10' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Medal className="w-5 h-5 text-yellow-500" />}
                          {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                          {index === 2 && <Medal className="w-5 h-5 text-orange-600" />}
                          <span className={`font-bold ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {team.position}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {team.logo && (
                            <Image 
                              src={team.logo} 
                              alt={team.name}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          )}
                          <span className="text-2xl">{team.flag}</span>
                          <span className={`font-bold ${
                            team.name.includes('Litvínov') ? 'text-red-500' : 
                            index === 0 ? 'text-yellow-500' : 'text-white'
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
                          {team.form.map((result, i) => (
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
                          ))}
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
                  <span className="text-gray-400">V - Výhry (3 body)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">R - Remízy v prodloužení (2 body)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">P - Prohry (0 bodů)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">B - Body</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vysledky' && (
          <div className="space-y-8">
            {/* Pátek */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <h3 className="text-xl font-bold text-white">Pátek 29.8.2025</h3>
              </div>
              <div className="p-4 space-y-3">
                {results.filter(r => r.day === 'Pátek').map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm w-16">{match.time}</span>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <span className={`text-right flex-1 font-semibold ${
                        match.team1 === 'Litvínov' ? 'text-red-500' : 'text-white'
                      }`}>{match.team1}</span>
                      <span className="text-xl font-black text-yellow-500 w-16 text-center">{match.score}</span>
                      <span className={`text-left flex-1 font-semibold ${
                        match.team2 === 'Litvínov' ? 'text-red-500' : 'text-white'
                      }`}>{match.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sobota */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-green-600 to-green-700">
                <h3 className="text-xl font-bold text-white">Sobota 30.8.2025</h3>
              </div>
              <div className="p-4 space-y-3">
                {results.filter(r => r.day === 'Sobota').map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm w-16">{match.time}</span>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <span className={`text-right flex-1 font-semibold ${
                        match.team1 === 'Litvínov' || match.team1 === 'Team Berlin' && match.team2 === 'Litvínov' ? 'text-red-500' : 'text-white'
                      }`}>{match.team1}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-yellow-500">{match.score}</span>
                        {match.note && <span className="text-[10px] text-gray-400">{match.note}</span>}
                      </div>
                      <span className={`text-left flex-1 font-semibold ${
                        match.team2 === 'Litvínov' ? 'text-red-500' : 'text-white'
                      }`}>{match.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neděle - Playoff */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600">
                <h3 className="text-xl font-bold text-white">Neděle 31.8.2025 - Playoff</h3>
              </div>
              <div className="p-4 space-y-3">
                {results.filter(r => r.day === 'Neděle').map((match, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 bg-white/5 rounded-lg ${
                    match.type === 'Finále' ? 'border-2 border-yellow-500/50' : ''
                  }`}>
                    <span className="text-gray-400 text-sm w-16">{match.time}</span>
                    <div className="flex-1">
                      <div className="text-center mb-1">
                        <span className={`font-bold text-sm ${
                          match.type === 'Finále' ? 'text-yellow-500' : 
                          match.type === 'O 3. místo' ? 'text-orange-500' : 'text-blue-400'
                        }`}>{match.type}</span>
                      </div>
                      {match.score && (
                        <div className="flex items-center justify-center gap-4">
                          <span className={`text-right flex-1 font-semibold ${
                            match.team1 === 'Litvínov' ? 'text-red-500' : 'text-white'
                          }`}>{match.team1}</span>
                          <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-yellow-500">{match.score}</span>
                            {match.score.includes('sn') && <span className="text-[10px] text-gray-400">po nájezdech</span>}
                          </div>
                          <span className={`text-left flex-1 font-semibold ${
                            match.team2 === 'Litvínov' ? 'text-red-500' : 'text-white'
                          }`}>{match.team2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistiky' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center py-16">
              <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Individuální statistiky</h3>
              <p className="text-gray-400">
                Nejlepší střelci, nahrávači a brankáři budou doplněni.
              </p>
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
                <span className="text-2xl">🇩🇪</span>
              </div>
              <div className="text-xl font-bold text-white">Alpha Team B</div>
              <div className="text-gray-400 text-sm">Vítěz finále</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-gray-400/50">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8 text-gray-400" />
                <span className="text-3xl font-black text-gray-400">2.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/Berlin.png" alt="Berlin All Stars" width={32} height={32} className="object-contain" />
                <span className="text-2xl">🇩🇪</span>
              </div>
              <div className="text-xl font-bold text-white">Berlin All Stars</div>
              <div className="text-gray-400 text-sm">Finalista</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-orange-600/50">
              <div className="flex items-center gap-3 mb-2">
                <Medal className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-black text-orange-600">3.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/AlphaA.png" alt="Alpha Team A" width={32} height={32} className="object-contain" />
                <span className="text-2xl">🇩🇪</span>
              </div>
              <div className="text-xl font-bold text-white">Alpha Team A</div>
              <div className="text-gray-400 text-sm">Výhra po nájezdech</div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-gray-600" />
                <span className="text-3xl font-black text-gray-600">4.</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/loga/lancers-logo.png" alt="HC Litvínov Lancers" width={32} height={32} className="object-contain" />
                <span className="text-2xl">🇨🇿</span>
              </div>
              <div className="text-xl font-bold text-red-500">HC Litvínov Lancers</div>
              <div className="text-gray-400 text-sm">4. místo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}