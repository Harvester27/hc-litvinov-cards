'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, ArrowLeft, Clock,
  Shield, Star, Award, Timer, Users, Swords,
  ChevronRight, Hash, TrendingUp, Medal, CheckCircle,
  Target, Zap, Activity, Eye, Info, Flag, User,
  AlertTriangle, Goal, Flame, TrendingDown,
  BarChart3, Percent, Sparkles, Crown
} from 'lucide-react';

export default function Zapas10Page() {
  // Data zápasu - FINÁLE
  const matchData = {
    id: 10,
    tournamentId: 'hobby-cup-litvinov-2025',
    date: '31.8.2025', 
    time: '10:00', 
    team1: 'Berlin All Stars', 
    team2: 'Alpha Team B', 
    score: '1:2',
    score1: 1,
    score2: 2, 
    day: 'Neděle',
    round: 'FINÁLE',
    logo1: '/images/loga/Berlin.png',
    logo2: '/images/loga/AlphaB.png',
    country1: 'DE',
    country2: 'DE',
    venue: 'Zimní stadion Litvínov',
    referee: 'TBA',
    attendance: 'TBA',
    periods: ['0:0', '1:2'], // Jen 2 třetiny
    overtime: false,
    shootout: false,
    notes: 'FINÁLE TURNAJE - Alpha Team B se stává šampionem!',
    duration: '2x20 minut'
  };

  const [activeTab, setActiveTab] = useState('prehled');

  // Soupisky týmů
  const rosters = {
    team1: {
      name: 'Berlin All Stars',
      goalies: [
        { number: '1', name: 'Daniel Herzog', position: 'Brankář' }
      ],
      defenders: [
        { number: '2', name: 'Guido Martin', position: 'Obránce', penalties: 4 }, // 2x2 minuty
        { number: '7', name: 'Leon Wäser', position: 'Obránce', penalties: 2 },
        { number: '15', name: 'Marco Rensch', position: 'Obránce' },
        { number: '13', name: 'Tim Bartsch', position: 'Obránce', goals: 1, assists: 0, penalties: 2 }
      ],
      forwards: [
        { number: '10', name: 'Matthias Blaschzik', position: 'Útočník', penalties: 2 },
        { number: '11', name: 'Frank Blaschzik', position: 'Útočník' },
        { number: '12', name: 'David Weiss', position: 'Útočník', penalties: 2 },
        { number: '', name: 'Ricardo Pietsch', position: 'Útočník' },
        { number: '6', name: 'Felix Schliemann', position: 'Útočník' },
        { number: '14', name: 'Daniel Pietsch', position: 'Útočník' },
        { number: '4', name: 'Jan Fritche', position: 'Útočník' },
        { number: '9', name: 'Peter Angrik', position: 'Útočník', penalties: 4 }, // 2x2 minuty
        { number: '3', name: 'Daety Ertel', position: 'Útočník' }
      ]
    },
    team2: {
      name: 'Alpha Team B',
      goalies: [
        { number: '20', name: 'Lars Bethke', position: 'Brankář', penalties: 2 }
      ],
      defenders: [
        { number: '13', name: 'Leonid Hansen', position: 'Obránce', penalties: 2 },
        { number: '48', name: 'Alexander Zhiliaev', position: 'Obránce' },
        { number: '17', name: 'Sergey Wotschel', position: 'Obránce' },
        { number: '16', name: 'Artur Lishchynsky', position: 'Obránce' },
        { number: '22', name: 'Leon Patz', position: 'Obránce', assists: 1 }
      ],
      forwards: [
        { number: '19', name: 'Vladimir Visner', position: 'Útočník', penalties: 6 }, // 3x2 minuty
        { number: '5', name: 'Sergey Antipov', position: 'Útočník' },
        { number: '56', name: 'Sergey Terechov', position: 'Útočník' },
        { number: '24', name: 'Ivan Patayala', position: 'Útočník', goals: 2, assists: 0 },
        { number: '44', name: 'Peter Eisele', position: 'Útočník' },
        { number: '28', name: 'Andrey Esser', position: 'Útočník' }
      ]
    }
  };

  // Průběh gólů a trestů
  const gameEvents = [
    { time: '5:00', period: 1, type: 'penalty', team: 'team2', player: 'Vladimir Visner', reason: 'Podražení', duration: 2 },
    { time: '6:00', period: 1, type: 'penalty', team: 'team1', player: 'Peter Angrik', reason: 'Hákování', duration: 2 },
    { time: '14:00', period: 1, type: 'penalty', team: 'team1', player: 'Tim Bartsch', reason: 'Vražení na hrazení', duration: 2 },
    { time: '16:00', period: 1, type: 'penalty', team: 'team2', player: 'Lars Bethke', reason: 'Hrubost', duration: 2 },
    { time: '17:00', period: 1, type: 'penalty', team: 'team1', player: 'David Weiss', reason: 'Podražení', duration: 2 },
    { time: '19:00', period: 1, type: 'penalty', team: 'team2', player: 'Leonid Hansen', reason: 'Hákování', duration: 2 },
    { time: '21:00', period: 2, type: 'goal', team: 'team1', scorer: 'Tim Bartsch', assists: [], score: '1:0' },
    { time: '26:00', period: 2, type: 'penalty', team: 'team2', player: 'Vladimir Visner', reason: 'Příliš mnoho hráčů na ledě', duration: 2 },
    { time: '28:00', period: 2, type: 'penalty', team: 'team1', player: 'Guido Martin', reason: 'Sekání', duration: 2 },
    { time: '30:00', period: 2, type: 'goal', team: 'team2', scorer: 'Ivan Patayala', assists: ['Leon Patz'], score: '1:1' },
    { time: '32:00', period: 2, type: 'penalty', team: 'team1', player: 'Guido Martin', reason: 'Podražení', duration: 2 },
    { time: '32:00', period: 2, type: 'penalty', team: 'team1', player: 'Leon Wäser', reason: 'Hrubost', duration: 2 },
    { time: '33:00', period: 2, type: 'penalty', team: 'team1', player: 'Matthias Blaschzik', reason: 'Držení', duration: 2 },
    { time: '39:00', period: 2, type: 'goal', team: 'team2', scorer: 'Ivan Patayala', assists: [], score: '1:2' },
    { time: '40:00', period: 2, type: 'penalty', team: 'team2', player: 'Vladimir Visner', reason: 'Hrubost', duration: 2 },
    { time: '40:00', period: 2, type: 'penalty', team: 'team1', player: 'Peter Angrik', reason: 'Hrubost', duration: 2 }
  ];

  // Komponenta pro vlajku
  const Flag = ({ country, size = 'normal' }) => {
    const dimensions = size === 'large' ? 'w-16 h-10' : 'w-10 h-6';
    if (country === 'DE') {
      return (
        <div className={`${dimensions} flex overflow-hidden rounded-sm shadow-lg border border-gray-600`}>
          <div className="w-1/3 bg-black"></div>
          <div className="w-1/3 bg-red-600"></div>
          <div className="w-1/3 bg-yellow-400"></div>
        </div>
      );
    }
    if (country === 'CZ') {
      return (
        <div className={`relative ${dimensions} overflow-hidden rounded-sm shadow-lg border border-gray-600`}>
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[32px] border-l-blue-600 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent"></div>
        </div>
      );
    }
    return null;
  };

  // Určit vítěze
  const winner = matchData.score1 > matchData.score2 ? 'team1' : 'team2';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
      <Navigation />
      
      {/* Hero sekce */}
      <div className="relative mt-28 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-gold-600/20 to-yellow-600/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Navigační drobečky */}
          <div className="flex items-center gap-2 text-gray-400 mb-6">
            <Link href="/turnaje" className="hover:text-white transition-colors">
              Turnaje
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/turnaje/hobby-cup-litvinov-2025" className="hover:text-white transition-colors">
              Hobby Hockey Litvínov 2025
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-bold">FINÁLE</span>
          </div>

          {/* Hlavní info o zápasu */}
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Vrchní část s informacemi */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-yellow-400 font-bold uppercase tracking-wider mb-1">
                    FINÁLE TURNAJE
                  </div>
                  <h1 className="text-3xl font-black text-white">
                    Boj o zlaté medaile!
                  </h1>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{matchData.date}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur ml-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">{matchData.time}</span>
                </div>
              </div>
            </div>

            {/* Upozornění na finále */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-gold-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
                <div>
                  <div className="text-sm font-black text-yellow-400 uppercase">Rozhodující zápas turnaje!</div>
                  <div className="text-xs text-gray-400">Alpha Team B se stává šampionem Hobby Hockey Litvínov 2025</div>
                </div>
              </div>
            </div>

            {/* Skóre */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
              
              <div className="relative backdrop-blur-sm p-8">
                <div className="flex items-center justify-between">
                  {/* Tým 1 - Berlin All Stars */}
                  <div className={`flex-1 text-center transition-all ${winner === 'team1' ? 'scale-100' : 'scale-95 opacity-70'}`}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
                        {matchData.logo1 && (
                          <Image 
                            src={matchData.logo1} 
                            alt={matchData.team1}
                            width={120}
                            height={120}
                            className="relative object-contain drop-shadow-2xl"
                          />
                        )}
                      </div>
                      <Flag country={matchData.country1} size="large" />
                      <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {matchData.team1}
                      </h2>
                      {winner === 'team1' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30 backdrop-blur">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm font-black text-yellow-400 uppercase tracking-wider">Šampion!</span>
                        </div>
                      )}
                      {winner !== 'team1' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500/20 to-gray-500/20 rounded-full border border-gray-500/30 backdrop-blur">
                          <Medal className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-black text-gray-400 uppercase tracking-wider">2. místo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Výsledek */}
                  <div className="px-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-2xl"></div>
                      <div className="relative text-7xl font-black text-white flex items-center">
                        <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                          {matchData.score1}
                        </span>
                        <span className="text-gray-600 mx-4">:</span>
                        <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                          {matchData.score2}
                        </span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400 font-bold uppercase">Finále</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tým 2 - Alpha Team B */}
                  <div className={`flex-1 text-center transition-all ${winner === 'team2' ? 'scale-100' : 'scale-95 opacity-70'}`}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
                        {matchData.logo2 && (
                          <Image 
                            src={matchData.logo2} 
                            alt={matchData.team2}
                            width={120}
                            height={120}
                            className="relative object-contain drop-shadow-2xl"
                          />
                        )}
                      </div>
                      <Flag country={matchData.country2} size="large" />
                      <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {matchData.team2}
                      </h2>
                      {winner === 'team2' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30 backdrop-blur animate-pulse">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm font-black text-yellow-400 uppercase tracking-wider">ŠAMPION! 🏆</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skóre po třetinách */}
                {matchData.periods && matchData.periods.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-bold">
                        Zápas se hrál pouze na 2 třetiny po 20 minutách
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                      {matchData.periods.map((period, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          <div className="relative bg-black/60 backdrop-blur rounded-xl p-4 border border-white/10">
                            <div className="text-xs text-gray-400 mb-2 text-center font-bold uppercase tracking-wider">
                              {index + 1}. třetina
                            </div>
                            <div className="text-2xl font-black text-white text-center">
                              {period}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-bold">
                          Ivan Patayala - 2 góly ve finále!
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informace o zápasu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur rounded-xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Místo konání</div>
                    <div className="font-bold text-white">{matchData.venue}</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur rounded-xl p-5 border border-green-500/20 hover:border-green-400/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-green-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-green-400 font-bold uppercase tracking-wider">Hrací čas</div>
                    <div className="font-bold text-white">{matchData.duration}</div>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur rounded-xl p-5 border border-yellow-500/20 hover:border-yellow-400/40 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 to-yellow-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Diváků</div>
                    <div className="font-bold text-white">{matchData.attendance}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigace mezi sekcemi */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 mb-8 overflow-x-auto">
          {[
            { id: 'prehled', label: 'Průběh zápasu', icon: Activity },
            { id: 'soupisky', label: 'Soupisky', icon: Users },
            { id: 'statistiky', label: 'Statistiky hráčů', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap overflow-hidden ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-20 blur-xl"></div>
              )}
              <div className="relative flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Obsah podle záložky */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'prehled' && (
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
              Průběh zápasu
            </h3>
            
            <div className="space-y-3">
              {gameEvents.map((event, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-xl transition-all ${
                  event.type === 'goal' 
                    ? event.team === 'team1' 
                      ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 hover:border-blue-400/50' 
                      : 'bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 hover:border-green-400/50'
                    : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 hover:border-yellow-400/50'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center gap-4 p-5">
                    <div className="text-sm font-black text-gray-400 w-16">
                      {event.time}
                    </div>
                    <div className="px-3 py-1 bg-black/30 rounded-full">
                      <span className="text-xs text-gray-300 font-bold">{event.period}. třetina</span>
                    </div>
                    
                    {event.type === 'goal' ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                          <Goal className="w-5 h-5 text-white" />
                        </div>
                        {event.team === 'team1' ? (
                          <Image src={matchData.logo1} alt="Berlin" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Alpha B" width={32} height={32} className="object-contain" />
                        )}
                        <div className="flex-1">
                          <span className={`font-black ${
                            event.team === 'team1' 
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent'
                          }`}>
                            GÓL! {event.scorer}
                          </span>
                          {event.assists && event.assists.length > 0 && (
                            <span className="text-gray-400 ml-2">
                              (as. {event.assists.join(', ')})
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-black bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                          {event.score}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-red-600 flex items-center justify-center shadow-lg">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        {event.team === 'team1' ? (
                          <Image src={matchData.logo1} alt="Berlin" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Alpha B" width={32} height={32} className="object-contain" />
                        )}
                        <div className="flex-1">
                          <span className={`font-black ${
                            event.team === 'team1'
                              ? 'bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'
                          }`}>
                            TREST: {event.player}
                          </span>
                          <span className="text-gray-400 ml-2">
                            {event.duration} min • {event.reason}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Závěrečné shrnutí */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-gold-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
                <div>
                  <div className="text-sm font-black text-yellow-400 uppercase">Alpha Team B je šampionem!</div>
                  <div className="text-xs text-gray-400">Ivan Patayala s 2 góly rozhodl finále turnaje</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30">
                  <Medal className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-bold">
                    Gratulujeme vítězi Hobby Hockey Litvínov 2025!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'soupisky' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Berlin All Stars */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/20 via-black/60 to-blue-900/20 border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Image src={matchData.logo1} alt={rosters.team1.name} width={40} height={40} className="object-contain" />
                  {rosters.team1.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Brankáři</h4>
                  {rosters.team1.goalies.map((player, i) => (
                    <div key={i} className="group flex items-center gap-3 p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-semibold">
                        {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Obránci</h4>
                  {rosters.team1.defenders.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && (
                          <span className="px-2 py-1 bg-green-500/20 rounded-lg text-green-400 text-xs font-bold">
                            {player.goals}G
                          </span>
                        )}
                        {player.assists > 0 && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-400 text-xs font-bold">
                            {player.assists}A
                          </span>
                        )}
                        {player.penalties > 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold">
                            {player.penalties === 4 ? '2x2TM' : `${player.penalties}TM`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Útočníci</h4>
                  {rosters.team1.forwards.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && (
                          <span className="px-2 py-1 bg-green-500/20 rounded-lg text-green-400 text-xs font-bold">
                            {player.goals}G
                          </span>
                        )}
                        {player.assists > 0 && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-400 text-xs font-bold">
                            {player.assists}A
                          </span>
                        )}
                        {player.penalties > 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold">
                            {player.penalties === 4 ? '2x2TM' : `${player.penalties}TM`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alpha Team B - ŠAMPION */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/20 via-black/60 to-gold-900/20 border border-yellow-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-yellow-600 to-yellow-700">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Image src={matchData.logo2} alt={rosters.team2.name} width={40} height={40} className="object-contain" />
                  {rosters.team2.name}
                  <Trophy className="w-6 h-6 text-yellow-400 animate-pulse" />
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-black text-yellow-400 mb-4 uppercase tracking-wider">Brankáři</h4>
                  {rosters.team2.goalies.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-yellow-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.penalties > 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold">
                            {player.penalties}TM
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-black text-yellow-400 mb-4 uppercase tracking-wider">Obránci</h4>
                  {rosters.team2.defenders.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-yellow-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.assists > 0 && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-400 text-xs font-bold">
                            {player.assists}A
                          </span>
                        )}
                        {player.penalties > 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold">
                            {player.penalties}TM
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-yellow-400 mb-4 uppercase tracking-wider">Útočníci</h4>
                  {rosters.team2.forwards.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-yellow-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-600 to-yellow-600 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">
                          {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                          {player.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && (
                          <span className="px-2 py-1 bg-green-500/20 rounded-lg text-green-400 text-xs font-bold">
                            {player.goals}G ⚡
                          </span>
                        )}
                        {player.assists > 0 && (
                          <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-400 text-xs font-bold">
                            {player.assists}A
                          </span>
                        )}
                        {player.penalties > 0 && (
                          <span className="px-2 py-1 bg-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold">
                            {player.penalties === 6 ? '3x2TM' : `${player.penalties}TM`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistiky' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nejlepší střelci zápasu */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/20 via-black/60 to-orange-900/20 border border-yellow-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                Nejlepší střelci zápasu
              </h3>
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4">
                  <div className="absolute top-0 right-0 text-8xl font-black text-yellow-500/10">1</div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">1</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Ivan Patayala</div>
                        <div className="text-yellow-400 text-sm font-semibold">Alpha Team B</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-b from-yellow-400 to-orange-500 bg-clip-text text-transparent">2</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">góly</div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-300">2</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">Tim Bartsch</div>
                        <div className="text-blue-400 text-sm">Berlin All Stars</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">1</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">gól</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hrdina finále */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-black/60 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Hrdina finále
              </h3>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-6">
                <div className="absolute top-0 right-0">
                  <Trophy className="w-32 h-32 text-yellow-500/10" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-3xl font-black text-white">#24</span>
                    </div>
                    <div>
                      <div className="text-white font-black text-2xl">Ivan Patayala</div>
                      <div className="text-yellow-400 font-semibold">Alpha Team B</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-white">2</div>
                      <div className="text-xs text-gray-400 uppercase">Góly</div>
                    </div>
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-yellow-400">⚡</div>
                      <div className="text-xs text-gray-400 uppercase">Rozhodl</div>
                    </div>
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-yellow-600">🏆</div>
                      <div className="text-xs text-gray-400 uppercase">Šampion</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-gold-500/20 rounded-full border border-yellow-500/30">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-yellow-400 font-bold">
                        MVP finále - rozhodl o titulu!
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tlačítko zpět */}
        <div className="mt-12 text-center">
          <Link 
            href="/turnaje/hobby-cup-litvinov-2025"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-2xl hover:from-yellow-700 hover:to-orange-700 transition-all font-black shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
            <span>Zpět na přehled turnaje</span>
          </Link>
        </div>
      </div>
    </div>
  );
}