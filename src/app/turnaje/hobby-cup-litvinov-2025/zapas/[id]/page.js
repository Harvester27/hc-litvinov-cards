'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, ArrowLeft, Clock,
  Shield, Star, Award, Timer, Users, Swords,
  ChevronRight, Hash, TrendingUp, Medal, CheckCircle,
  Target, Zap, Activity, Eye, Info, Flag
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function MatchDetailPage() {
  console.log("Stránka detailu zápasu se načetla!");
  const params = useParams();
  const { id } = params;
  
  // Data všech zápasů - v budoucnu bude z databáze
  const allMatches = [
    // Pátek 29.8.2025
    { 
      id: 1,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '29.8.2025', 
      time: '20:30', 
      team1: 'HC Litvínov Lancers', 
      team2: 'Alpha Team B', 
      score: '5:7',
      score1: 5,
      score2: 7, 
      day: 'Pátek',
      round: 'Základní skupina',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaB.png',
      country1: 'CZ',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['2:3', '1:2', '2:2'],
      overtime: false,
      shootout: false,
      notes: 'Úvodní zápas turnaje'
    },
    { 
      id: 2,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '29.8.2025', 
      time: '21:30', 
      team1: 'Alpha Team A', 
      team2: 'Berlin All Stars', 
      score: '2:0',
      score1: 2,
      score2: 0, 
      day: 'Pátek',
      round: 'Základní skupina',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/Berlin.png',
      country1: 'DE',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['1:0', '0:0', '1:0'],
      overtime: false,
      shootout: false,
      notes: ''
    },
    
    // Sobota 30.8.2025 - základní skupina
    { 
      id: 3,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '08:00', 
      team1: 'HC Litvínov Lancers', 
      team2: 'Alpha Team A', 
      score: '1:5',
      score1: 1,
      score2: 5, 
      day: 'Sobota',
      round: 'Základní skupina',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaA.png',
      country1: 'CZ',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['0:2', '1:1', '0:2'],
      overtime: false,
      shootout: false,
      notes: ''
    },
    { 
      id: 4,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '09:00', 
      team1: 'Berlin All Stars', 
      team2: 'Alpha Team B', 
      score: '2:3',
      score1: 2,
      score2: 3, 
      day: 'Sobota',
      round: 'Základní skupina',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/AlphaB.png',
      country1: 'DE',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['1:1', '0:1', '1:1'],
      overtime: false,
      shootout: false,
      notes: ''
    },
    { 
      id: 5,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '10:00', 
      team1: 'Berlin All Stars', 
      team2: 'HC Litvínov Lancers', 
      score: '4:5',
      score1: 4,
      score2: 5, 
      day: 'Sobota',
      round: 'Základní skupina',
      note: 'po prodloužení',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/lancers-logo.png',
      country1: 'DE',
      country2: 'CZ',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['2:1', '1:2', '1:1', '0:1'],
      overtime: true,
      shootout: false,
      notes: 'Vítězný gól v prodloužení'
    },
    { 
      id: 6,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '14:00', 
      team1: 'Alpha Team A', 
      team2: 'Alpha Team B', 
      score: '6:5',
      score1: 6,
      score2: 5, 
      day: 'Sobota',
      round: 'Základní skupina',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/AlphaB.png',
      country1: 'DE',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['2:2', '2:1', '2:2'],
      overtime: false,
      shootout: false,
      notes: 'Derby německých týmů'
    },
    
    // Sobota 30.8.2025 - Semifinále
    { 
      id: 7,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '15:00', 
      team1: 'Alpha Team A', 
      team2: 'Berlin All Stars', 
      score: '2:5',
      score1: 2,
      score2: 5, 
      day: 'Semifinále', 
      round: 'Semifinále 1',
      type: 'Semifinále 1',
      logo1: '/images/loga/AlphaA.png',
      logo2: '/images/loga/Berlin.png',
      country1: 'DE',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['0:2', '1:1', '1:2'],
      overtime: false,
      shootout: false,
      notes: 'Berlin postupuje do finále'
    },
    { 
      id: 8,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '30.8.2025', 
      time: '16:00', 
      team1: 'Alpha Team B', 
      team2: 'HC Litvínov Lancers', 
      score: '4:3',
      score1: 4,
      score2: 3, 
      day: 'Semifinále', 
      round: 'Semifinále 2',
      type: 'Semifinále 2',
      logo1: '/images/loga/AlphaB.png',
      logo2: '/images/loga/lancers-logo.png',
      country1: 'DE',
      country2: 'CZ',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['1:1', '2:1', '1:1'],
      overtime: false,
      shootout: false,
      notes: 'Alpha B postupuje do finále'
    },
    
    // Neděle 31.8.2025 - O umístění
    { 
      id: 9,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '31.8.2025', 
      time: '09:00', 
      team1: 'HC Litvínov Lancers', 
      team2: 'Alpha Team A', 
      score: '4:5',
      score1: 4,
      score2: 5, 
      day: 'Umístění', 
      round: 'O 3. místo',
      type: 'O 3. místo',
      logo1: '/images/loga/lancers-logo.png',
      logo2: '/images/loga/AlphaA.png',
      country1: 'CZ',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['1:2', '2:1', '1:1', '0:0', 'SN: 0:1'],
      overtime: true,
      shootout: true,
      notes: 'Alpha A vítězí po samostatných nájezdech'
    },
    { 
      id: 10,
      tournamentId: 'hobby-cup-litvinov-2025',
      date: '31.8.2025', 
      time: '10:00', 
      team1: 'Berlin All Stars', 
      team2: 'Alpha Team B', 
      score: '1:2',
      score1: 1,
      score2: 2, 
      day: 'Umístění', 
      round: 'Finále',
      type: 'Finále',
      logo1: '/images/loga/Berlin.png',
      logo2: '/images/loga/AlphaB.png',
      country1: 'DE',
      country2: 'DE',
      venue: 'Zimní stadion Litvínov',
      referee: 'TBA',
      attendance: 'TBA',
      periods: ['0:1', '1:0', '0:1'],
      overtime: false,
      shootout: false,
      notes: 'Alpha Team B vítězem turnaje!'
    },
  ];

    
  // Najít konkrétní zápas - stačí podle ID, protože jsme v konkrétním turnaji
  const match = allMatches.find(m => m.id === parseInt(id));

  // Komponenta pro vlajku
  const Flag = ({ country }) => {
    if (country === 'DE') {
      return (
        <div className="w-10 h-6 flex overflow-hidden rounded-sm border border-gray-600">
          <div className="w-1/3 bg-black"></div>
          <div className="w-1/3 bg-red-600"></div>
          <div className="w-1/3 bg-yellow-400"></div>
        </div>
      );
    }
    if (country === 'CZ') {
      return (
        <div className="relative w-10 h-6 overflow-hidden rounded-sm border border-gray-600">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-blue-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent"></div>
        </div>
      );
    }
    return null;
  };

  // Určit vítěze
  const getWinner = () => {
    if (!match) return null;
    if (match.shootout) {
      // Po nájezdech oba týmy dostanou bod, ale určíme vítěze
      return match.score1 > match.score2 ? 'team1' : 'team2';
    }
    return match.score1 > match.score2 ? 'team1' : 'team2';
  };

  const winner = getWinner();

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <Navigation />
        <div className="mt-28 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <Trophy className="w-24 h-24 text-gray-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Zápas nenalezen</h1>
            <Link 
              href={`/turnaje/hobby-cup-litvinov-2025`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Zpět na turnaj</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <Navigation />
      
      {/* Hero sekce */}
      <div className="relative mt-28 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 animate-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Navigační drobečky */}
          <div className="flex items-center gap-2 text-gray-400 mb-6">
            <Link href="/turnaje" className="hover:text-white transition-colors">
              Turnaje
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/turnaje/hobby-cup-litvinov-2025`} className="hover:text-white transition-colors">
              Hobby Hockey Litvínov 2025
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Detail zápasu</span>
          </div>

          {/* Hlavní info o zápasu */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {match.type === 'Finále' && <Trophy className="w-8 h-8 text-yellow-500" />}
                {match.type === 'O 3. místo' && <Medal className="w-8 h-8 text-orange-600" />}
                {match.round?.includes('Semifinále') && <Swords className="w-8 h-8 text-purple-500" />}
                <div>
                  <h1 className="text-3xl font-black text-white">
                    {match.round || match.day}
                  </h1>
                  {match.type && (
                    <div className={`text-lg font-bold ${
                      match.type === 'Finále' ? 'text-yellow-500' : 
                      match.type === 'O 3. místo' ? 'text-orange-500' :
                      'text-purple-500'
                    }`}>
                      {match.type}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">{match.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{match.time}</span>
                </div>
              </div>
            </div>

            {/* Skóre */}
            <div className="bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-xl p-8 border border-white/10">
              <div className="flex items-center justify-between">
                {/* Tým 1 */}
                <div className={`flex-1 text-center ${winner === 'team1' ? '' : 'opacity-60'}`}>
                  <div className="flex flex-col items-center gap-3">
                    {match.logo1 && (
                      <Image 
                        src={match.logo1} 
                        alt={match.team1}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                    <Flag country={match.country1} />
                    <h2 className={`text-2xl font-bold ${
                      match.team1.includes('Litvínov') ? 'text-red-500' : 'text-white'
                    }`}>
                      {match.team1}
                    </h2>
                    {winner === 'team1' && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-green-400">VÍTĚZ</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Výsledek */}
                <div className="px-8">
                  <div className="text-6xl font-black text-white">
                    {match.score1}
                    <span className="text-gray-500 mx-3">:</span>
                    {match.score2}
                  </div>
                  {match.shootout && (
                    <div className="text-center mt-2 text-sm text-yellow-500 font-bold">
                      po nájezdech
                    </div>
                  )}
                  {match.overtime && !match.shootout && (
                    <div className="text-center mt-2 text-sm text-orange-500 font-bold">
                      po prodloužení
                    </div>
                  )}
                </div>

                {/* Tým 2 */}
                <div className={`flex-1 text-center ${winner === 'team2' ? '' : 'opacity-60'}`}>
                  <div className="flex flex-col items-center gap-3">
                    {match.logo2 && (
                      <Image 
                        src={match.logo2} 
                        alt={match.team2}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                    <Flag country={match.country2} />
                    <h2 className={`text-2xl font-bold ${
                      match.team2.includes('Litvínov') ? 'text-red-500' : 'text-white'
                    }`}>
                      {match.team2}
                    </h2>
                    {winner === 'team2' && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-green-400">VÍTĚZ</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skóre po třetinách */}
              {match.periods && match.periods.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-center gap-8">
                    {match.periods.slice(0, 3).map((period, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-400 mb-1">{index + 1}. třetina</div>
                        <div className="text-xl font-bold text-white">{period}</div>
                      </div>
                    ))}
                    {match.periods[3] && (
                      <div className="text-center">
                        <div className="text-xs text-orange-400 mb-1">Prodloužení</div>
                        <div className="text-xl font-bold text-orange-400">{match.periods[3]}</div>
                      </div>
                    )}
                    {match.periods[4] && (
                      <div className="text-center">
                        <div className="text-xs text-yellow-400 mb-1">Nájezdy</div>
                        <div className="text-xl font-bold text-yellow-400">{match.periods[4]}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Informace o zápasu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-400">Místo konání</div>
                    <div className="font-semibold text-white">{match.venue}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-xs text-gray-400">Rozhodčí</div>
                    <div className="font-semibold text-white">{match.referee}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-xs text-gray-400">Diváků</div>
                    <div className="font-semibold text-white">{match.attendance}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Poznámky */}
            {match.notes && (
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-blue-400 mb-1">Poznámka k zápasu</div>
                    <div className="text-white">{match.notes}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Budoucí sekce */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
          <Activity className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Statistiky budou brzy doplněny</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Podrobné statistiky zápasu včetně střelců branek, asistencí, trestů a dalších údajů budou doplněny v nejbližší době.
          </p>
        </div>

        {/* Tlačítko zpět */}
        <div className="mt-8 text-center">
          <Link 
            href={`/turnaje/hobby-cup-litvinov-2025`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zpět na přehled turnaje</span>
          </Link>
        </div>
      </div>
    </div>
  );
}