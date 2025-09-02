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
  BarChart3, Percent, Sparkles, AlertCircle
} from 'lucide-react';

export default function Zapas7Page() {
  // Data zápasu
  const matchData = {
    id: 7,
    tournamentId: 'hobby-cup-litvinov-2025',
    date: '30.8.2025', 
    time: '15:00', 
    team1: 'Alpha Team A', 
    team2: 'Berlin All Stars', 
    score: '2:5',
    score1: 2,
    score2: 5, 
    day: 'Sobota',
    round: 'Semifinále',
    logo1: '/images/loga/AlphaA.png',
    logo2: '/images/loga/Berlin.png',
    country1: 'DE',
    country2: 'DE',
    venue: 'Zimní stadion Litvínov',
    referee: 'TBA',
    attendance: 'TBA',
    periods: ['1:3', '1:2'], // Jen 2 třetiny
    overtime: false,
    shootout: false,
    notes: 'Překvapení turnaje - Berlin All Stars postupuje do finále!',
    duration: '2x20 minut'
  };

  const [activeTab, setActiveTab] = useState('prehled');

  // Soupisky týmů
  const rosters = {
    team1: {
      name: 'Alpha Team A',
      goalies: [
        { number: '', name: 'Alexandra Hesse', position: 'Brankář' }
      ],
      defenders: [
        { number: '', name: 'Alexander Hermann', position: 'Obránce' },
        { number: '', name: 'Dennis Hermann', position: 'Obránce', goals: 1, assists: 0, penalties: 6 }, // 3x2 minuty!
        { number: '', name: 'Maurice Giese', position: 'Obránce' },
        { number: '', name: 'Nikita Helm', position: 'Obránce', goals: 1, assists: 1 },
        { number: '', name: 'Mark Wassermann', position: 'Obránce', penalties: 2 }
      ],
      forwards: [
        { number: '', name: 'Alexander Plinger', position: 'Útočník', assists: 1 },
        { number: '', name: 'Andrey Schapovalov', position: 'Útočník' },
        { number: '', name: 'Dennis Schuller', position: 'Útočník' },
        { number: '', name: 'Sergey Schnarr', position: 'Útočník' },
        { number: '', name: 'Nikita Kulpin', position: 'Útočník' },
        { number: '', name: 'Igor Nalyotov', position: 'Útočník', penalties: 2 }
      ]
    },
    team2: {
      name: 'Berlin All Stars',
      goalies: [
        { number: '', name: 'Daniel Herzog', position: 'Brankář' }
      ],
      defenders: [
        { number: '', name: 'Guido Martin', position: 'Obránce' },
        { number: '', name: 'Leon Wäser', position: 'Obránce', goals: 1, assists: 0 },
        { number: '', name: 'Marco Rensch', position: 'Obránce', assists: 1 },
        { number: '', name: 'Tim Bartsch', position: 'Obránce', goals: 1, assists: 1 }
      ],
      forwards: [
        { number: '', name: 'Matthias Blaschzik', position: 'Útočník', assists: 1 },
        { number: '', name: 'Frank Blaschzik', position: 'Útočník' },
        { number: '', name: 'Ricardo Pietsch', position: 'Útočník' },
        { number: '', name: 'Felix Schliemann', position: 'Útočník', goals: 1, assists: 0 },
        { number: '', name: 'Daniel Pietsch', position: 'Útočník', goals: 1, assists: 0 },
        { number: '', name: 'Jan Fritche', position: 'Útočník' },
        { number: '', name: 'Peter Angrik', position: 'Útočník', goals: 1, assists: 0 },
        { number: '', name: 'Daety Ertel', position: 'Útočník', penalties: 2 }
      ]
    }
  };

  // Průběh gólů a trestů
  const gameEvents = [
    { time: '6:00', period: 1, type: 'goal', team: 'team2', scorer: 'Leon Wäser', assists: ['Matthias Blaschzik'], score: '0:1' },
    { time: '10:00', period: 1, type: 'penalty', team: 'team1', player: 'Dennis Hermann', reason: 'Nedovolené bránění', duration: 2 },
    { time: '13:00', period: 1, type: 'goal', team: 'team2', scorer: 'Peter Angrik', assists: [], score: '0:2' },
    { time: '17:00', period: 1, type: 'goal', team: 'team1', scorer: 'Nikita Helm', assists: ['Alexander Plinger'], score: '1:2' },
    { time: '19:00', period: 1, type: 'goal', team: 'team2', scorer: 'Felix Schliemann', assists: ['Marco Rensch'], score: '1:3' },
    { time: '23:00', period: 2, type: 'goal', team: 'team2', scorer: 'Daniel Pietsch', assists: ['Tim Bartsch'], score: '1:4' },
    { time: '28:00', period: 2, type: 'penalty', team: 'team1', player: 'Mark Wassermann', reason: 'Napadení', duration: 2 },
    { time: '29:00', period: 2, type: 'goal', team: 'team1', scorer: 'Dennis Hermann', assists: ['Nikita Helm'], score: '2:4' },
    { time: '33:00', period: 2, type: 'penalty', team: 'team1', player: 'Igor Nalyotov', reason: 'Hrubost', duration: 2 },
    { time: '35:00', period: 2, type: 'penalty', team: 'team1', player: 'Dennis Hermann', reason: 'Hrubost', duration: 2 },
    { time: '35:00', period: 2, type: 'penalty', team: 'team2', player: 'Daety Ertel', reason: 'Hrubost', duration: 2 },
    { time: '37:00', period: 2, type: 'goal', team: 'team2', scorer: 'Tim Bartsch', assists: [], score: '2:5' },
    { time: '40:00', period: 2, type: 'penalty', team: 'team1', player: 'Dennis Hermann', reason: 'Krosček', duration: 2 }
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
    return null;
  };

  // Určit vítěze
  const winner = matchData.score1 > matchData.score2 ? 'team1' : 'team2';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
      <Navigation />
      
      {/* Hero sekce */}
      <div className="relative mt-28 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-pulse"></div>
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
            <span className="text-white font-bold">Semifinále 1</span>
          </div>

          {/* Hlavní info o zápasu */}
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Vrchní část s informacemi */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-400 font-bold uppercase tracking-wider mb-1">
                    SEMIFINÁLE #1
                  </div>
                  <h1 className="text-3xl font-black text-white">
                    Překvapení turnaje!
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

            {/* Upozornění na překvapení */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-sm font-black text-blue-400 uppercase">Senzace semifinále!</div>
                  <div className="text-xs text-gray-400">Berlin All Stars dominoval favorizovanému Alpha Team A</div>
                </div>
              </div>
            </div>

            {/* Skóre */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
              
              <div className="relative backdrop-blur-sm p-8">
                <div className="flex items-center justify-between">
                  {/* Tým 1 - Alpha Team A */}
                  <div className={`flex-1 text-center transition-all ${winner === 'team1' ? 'scale-100' : 'scale-95 opacity-70'}`}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl"></div>
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
                      <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        {matchData.team1}
                      </h2>
                    </div>
                  </div>

                  {/* Výsledek */}
                  <div className="px-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-2xl"></div>
                      <div className="relative">
                        <div className="text-7xl font-black text-white flex items-center">
                          <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            {matchData.score1}
                          </span>
                          <span className="text-gray-600 mx-4">:</span>
                          <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            {matchData.score2}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tým 2 - Berlin All Stars */}
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
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30 backdrop-blur">
                          <Trophy className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-black text-green-400 uppercase tracking-wider">Postup do finále!</span>
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
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full border border-blue-500/30">
                        <Star className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-blue-400 font-bold">
                          Berlin All Stars rozhodl zápas v první třetině (3:1)
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
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-20 blur-xl"></div>
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
                      ? 'bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 hover:border-red-400/50' 
                      : 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 hover:border-blue-400/50'
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
                          <Image src={matchData.logo1} alt="Alpha A" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Berlin" width={32} height={32} className="object-contain" />
                        )}
                        <div className="flex-1">
                          <span className={`font-black ${
                            event.team === 'team1' 
                              ? 'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'
                          }`}>
                            GÓL! {event.scorer}
                          </span>
                          {event.assists.length > 0 && (
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
                          <Image src={matchData.logo1} alt="Alpha A" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Berlin" width={32} height={32} className="object-contain" />
                        )}
                        <div className="flex-1">
                          <span className={`font-black ${
                            event.team === 'team1'
                              ? 'bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent'
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

            {/* Statistika trestů */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <div className="text-sm font-black text-red-400 uppercase">Nedisciplinovanost Alpha Team A</div>
                  <div className="text-xs text-gray-400">10 trestných minut (5 vyloučení) vs. 2 trestné minuty Berlin</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'soupisky' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alpha Team A */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-red-900/20 via-black/60 to-red-900/20 border border-red-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-red-600 to-red-700">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Image src={matchData.logo1} alt={rosters.team1.name} width={40} height={40} className="object-contain" />
                  {rosters.team1.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-black text-red-400 mb-4 uppercase tracking-wider">Brankáři</h4>
                  {rosters.team1.goalies.map((player, i) => (
                    <div key={i} className="group flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-semibold">{player.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-black text-red-400 mb-4 uppercase tracking-wider">Obránci</h4>
                  {rosters.team1.defenders.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-red-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">{player.name}</span>
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
                            {player.penalties === 6 ? '3x2TM' : `${player.penalties}TM`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-red-400 mb-4 uppercase tracking-wider">Útočníci</h4>
                  {rosters.team1.forwards.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-red-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">{player.name}</span>
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
              </div>
            </div>

            {/* Berlin All Stars */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/20 via-black/60 to-blue-900/20 border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <Image src={matchData.logo2} alt={rosters.team2.name} width={40} height={40} className="object-contain" />
                  {rosters.team2.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Brankáři</h4>
                  {rosters.team2.goalies.map((player, i) => (
                    <div key={i} className="group flex items-center gap-3 p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-semibold">{player.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Obránci</h4>
                  {rosters.team2.defenders.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">{player.name}</span>
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
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-blue-400 mb-4 uppercase tracking-wider">Útočníci</h4>
                  {rosters.team2.forwards.map((player, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 hover:bg-blue-500/10 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">{player.name}</span>
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
                            {player.penalties}TM
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
                  <div className="absolute top-0 right-0 text-8xl font-black text-yellow-500/10">5</div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">⚡</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Berlin All Stars</div>
                        <div className="text-blue-400 text-sm font-semibold">5 různých střelců!</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent">5</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">gólů</div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-300">1</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">Nikita Helm</div>
                        <div className="text-red-400 text-sm">Alpha Team A</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">1</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">gól</div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-300">1</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">Dennis Hermann</div>
                        <div className="text-red-400 text-sm">Alpha Team A</div>
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

            {/* Disciplína */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-black/60 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                Disciplína týmů
              </h3>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">😇</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Berlin All Stars</div>
                        <div className="text-blue-400 text-sm font-semibold">Disciplinovaný výkon</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-400">2</div>
                      <div className="text-xs text-gray-400 font-bold">trestné minuty</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🔥</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Alpha Team A</div>
                        <div className="text-red-400 text-sm font-semibold">Nedisciplinovanost!</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-red-400">10</div>
                      <div className="text-xs text-gray-400 font-bold">trestných minut</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div className="text-xs text-yellow-400">
                      <span className="font-bold">Dennis Hermann (Alpha A):</span> 3 vyloučení v jednom zápase!
                    </div>
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
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all font-black shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
            <span>Zpět na přehled turnaje</span>
          </Link>
        </div>
      </div>
    </div>
  );
}