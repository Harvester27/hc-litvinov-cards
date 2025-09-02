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

export default function Zapas9Page() {
  // Data zápasu
  const matchData = {
    id: 9,
    tournamentId: 'hobby-cup-litvinov-2025',
    date: '31.8.2025', 
    time: '09:00', 
    team1: 'HC Litvínov Lancers', 
    team2: 'Alpha Team A', 
    score: '4:5 sn',
    score1: 4,
    score2: 5, 
    day: 'Neděle',
    round: 'O 3. místo',
    logo1: '/images/loga/lancers-logo.png',
    logo2: '/images/loga/AlphaA.png',
    country1: 'CZ',
    country2: 'DE',
    venue: 'Zimní stadion Litvínov',
    referee: 'TBA',
    attendance: 'TBA',
    periods: ['1:3', '3:1'], // Jen 2 třetiny
    overtime: false,
    shootout: true,
    notes: 'Dramatický zápas rozhodnutý až v nájezdech!',
    duration: '2x20 minut + nájezdy'
  };

  const [activeTab, setActiveTab] = useState('prehled');

  // Soupisky týmů
  const rosters = {
    team1: {
      name: 'HC Litvínov Lancers',
      goalies: [
        { number: '1', name: 'Tomáš Kodrle', position: 'Brankář' }
      ],
      defenders: [
        { number: '22', name: 'Jindřich Belinger', position: 'Obránce' },
        { number: '11', name: 'Jiří Belinger', position: 'Obránce' },
        { number: '54', name: 'Ondřej Kocourek', position: 'Obránce', goals: 1, assists: 1, penalties: 2 },
        { number: '3', name: 'Jiří Šalanda', position: 'Obránce', penalties: 2 }
      ],
      forwards: [
        { number: '67', name: 'Gustav Toman', position: 'Útočník' },
        { number: '98', name: 'Václav Matějovič', position: 'Útočník', goals: 2, assists: 0, penalties: 2 },
        { number: '95', name: 'Jan Švarc', position: 'Útočník' },
        { number: '94', name: 'Stanislav Švarc', position: 'Útočník', penalties: 2 },
        { number: '93', name: 'Ladislav Černý', position: 'Útočník' },
        { number: '91', name: 'Michal Klečka', position: 'Útočník', goals: 1, assists: 1 },
        { number: '88', name: 'Jan Schubada', position: 'Útočník', penalties: 2 },
        { number: '21', name: 'Oldřich Štěpanovský', position: 'Útočník' }
      ]
    },
    team2: {
      name: 'Alpha Team A',
      goalies: [
        { number: '29', name: 'Alexandra Hesse', position: 'Brankář' }
      ],
      defenders: [
        { number: '9', name: 'Alexander Hermann', position: 'Obránce' },
        { number: '67', name: 'Dennis Hermann', position: 'Obránce' },
        { number: '74', name: 'Maurice Giese', position: 'Obránce', goals: 1, assists: 0, penalties: 2 },
        { number: '78', name: 'Nikita Helm', position: 'Obránce', goals: 2, assists: 0, penalties: 4 }, // 2x2 minuty
        { number: '89', name: 'Mark Wassermann', position: 'Obránce', penalties: 2 }
      ],
      forwards: [
        { number: '47', name: 'Alexander Plinger', position: 'Útočník', goals: 2, assists: 0 },
        { number: '77', name: 'Andrey Schapovalov', position: 'Útočník', penalties: 2 },
        { number: '55', name: 'Dennis Schuller', position: 'Útočník' },
        { number: '91', name: 'Sergey Schnarr', position: 'Útočník' },
        { number: '71', name: 'Nikita Kulpin', position: 'Útočník' },
        { number: '90', name: 'Igor Nalyotov', position: 'Útočník' }
      ]
    }
  };

  // Průběh gólů a trestů
  const gameEvents = [
    { time: '3:00', period: 1, type: 'penalty', team: 'team2', player: 'Nikita Helm', reason: 'Zdržování', duration: 2 },
    { time: '5:00', period: 1, type: 'goal', team: 'team1', scorer: 'Václav Matějovič', assists: ['Ondřej Kocourek'], score: '1:0' },
    { time: '8:00', period: 1, type: 'penalty', team: 'team1', player: 'Jiří Šalanda', reason: 'Příliš mnoho hráčů na ledě', duration: 2 },
    { time: '10:00', period: 1, type: 'goal', team: 'team2', scorer: 'Maurice Giese', assists: [], score: '1:1' },
    { time: '15:00', period: 1, type: 'penalty', team: 'team1', player: 'Jan Schubada', reason: 'Vražení na hrazení', duration: 2 },
    { time: '16:00', period: 1, type: 'goal', team: 'team2', scorer: 'Nikita Helm', assists: [], score: '1:2' },
    { time: '19:00', period: 1, type: 'goal', team: 'team2', scorer: 'Nikita Helm', assists: [], score: '1:3' },
    { time: '25:00', period: 2, type: 'penalty', team: 'team2', player: 'Mark Wassermann', reason: 'Hrubost', duration: 2 },
    { time: '25:00', period: 2, type: 'penalty', team: 'team2', player: 'Maurice Giese', reason: 'Hrubost', duration: 2 },
    { time: '25:00', period: 2, type: 'penalty', team: 'team1', player: 'Václav Matějovič', reason: 'Hrubost', duration: 2 },
    { time: '25:00', period: 2, type: 'penalty', team: 'team1', player: 'Stanislav Švarc', reason: 'Hrubost', duration: 2 },
    { time: '28:00', period: 2, type: 'goal', team: 'team1', scorer: 'Václav Matějovič', assists: [], score: '2:3' },
    { time: '30:00', period: 2, type: 'penalty', team: 'team1', player: 'Ondřej Kocourek', reason: 'Podražení', duration: 2 },
    { time: '31:00', period: 2, type: 'goal', team: 'team1', scorer: 'Michal Klečka', assists: [], score: '3:3' },
    { time: '34:00', period: 2, type: 'penalty', team: 'team2', player: 'Nikita Helm', reason: 'Zdržování', duration: 2 },
    { time: '36:00', period: 2, type: 'goal', team: 'team2', scorer: 'Alexander Plinger', assists: [], score: '3:4' },
    { time: '36:00', period: 2, type: 'penalty', team: 'team2', player: 'Andrey Schapovalov', reason: 'Podražení', duration: 2 },
    { time: '38:00', period: 2, type: 'goal', team: 'team1', scorer: 'Ondřej Kocourek', assists: ['Michal Klečka'], score: '4:4' },
    { time: '40:00', period: 2, type: 'goal', team: 'team2', scorer: 'Alexander Plinger', assists: [], score: '4:5', shootout: true }
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
  const winner = 'team2'; // Alpha Team A vyhrál po nájezdech

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
            <span className="text-white font-bold">O 3. místo</span>
          </div>

          {/* Hlavní info o zápasu */}
          <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Vrchní část s informacemi */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-400 font-bold uppercase tracking-wider mb-1">
                    ZÁPAS O 3. MÍSTO
                  </div>
                  <h1 className="text-3xl font-black text-white">
                    Bronzová medaile!
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

            {/* Upozornění na nájezdy */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="text-sm font-black text-orange-400 uppercase">Drama až do konce!</div>
                  <div className="text-xs text-gray-400">Zápas rozhodnutý až v nájezdech - Alpha Team A získává bronz</div>
                </div>
              </div>
            </div>

            {/* Skóre */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
              
              <div className="relative backdrop-blur-sm p-8">
                <div className="flex items-center justify-between">
                  {/* Tým 1 - Litvínov */}
                  <div className={`flex-1 text-center transition-all ${winner === 'team1' ? 'scale-100' : 'scale-95 opacity-70'}`}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl"></div>
                        {matchData.logo1 && (
                          <Image 
                            src={matchData.logo1} 
                            alt={matchData.team1}
                            width={240}
                            height={240}
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
                        <div className="text-center mt-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30">
                            <Target className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-orange-400 font-bold uppercase">Po nájezdech</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tým 2 - Alpha Team A */}
                  <div className={`flex-1 text-center transition-all ${winner === 'team2' ? 'scale-100' : 'scale-95 opacity-70'}`}>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl"></div>
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
                      <h2 className="text-3xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        {matchData.team2}
                      </h2>
                      {winner === 'team2' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30 backdrop-blur">
                          <Medal className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-black text-orange-500 uppercase tracking-wider">3. místo!</span>
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
                        Základní hrací doba: 2x20 minut
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
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-lg opacity-60 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur rounded-xl p-4 border border-orange-500/30">
                          <div className="text-xs text-orange-400 mb-2 text-center font-bold uppercase tracking-wider">
                            Nájezdy
                          </div>
                          <div className="text-2xl font-black text-orange-400 text-center">
                            0:1
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full border border-red-500/30">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-red-400 font-bold">
                          Litvínov končí na 4. místě
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
              {gameEvents.filter(event => !event.shootout).map((event, index) => (
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
                          <Image src={matchData.logo1} alt="Litvínov" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Alpha A" width={32} height={32} className="object-contain" />
                        )}
                        <div className="flex-1">
                          <span className={`font-black ${
                            event.team === 'team1' 
                              ? 'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent'
                              : 'bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'
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
                          <Image src={matchData.logo1} alt="Litvínov" width={32} height={32} className="object-contain" />
                        ) : (
                          <Image src={matchData.logo2} alt="Alpha A" width={32} height={32} className="object-contain" />
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

            {/* Nájezdy */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="text-sm font-black text-orange-400 uppercase">Rozhodující nájezdy!</div>
                  <div className="text-xs text-gray-400">Alpha Team A rozhodl v nájezdech a získává bronzovou medaili</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-orange-400 font-bold">
                    Alexander Plinger rozhodl v nájezdech!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'soupisky' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Litvínov */}
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
                      <span className="text-white font-semibold">
                        {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                        {player.name}
                      </span>
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
                            {player.penalties}TM
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
                            {player.penalties}TM
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alpha Team A */}
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
                      <span className="text-white font-semibold">
                        {player.number && <span className="text-gray-400 mr-2">#{player.number}</span>}
                        {player.name}
                      </span>
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
                  {rosters.team2.forwards.map((player, i) => (
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
                  <div className="absolute top-0 right-0 text-8xl font-black text-yellow-500/10">1</div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">1</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-lg">Nikita Helm</div>
                        <div className="text-yellow-400 text-sm font-semibold">Alpha Team A</div>
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
                        <span className="text-xl font-black text-gray-300">1</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">Alexander Plinger</div>
                        <div className="text-blue-400 text-sm">Alpha Team A</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">2</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">+ nájezd</div>
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
                        <div className="text-white font-bold">Václav Matějovič</div>
                        <div className="text-red-400 text-sm">HC Litvínov Lancers</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">2</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">góly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hrdina zápasu */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/20 via-black/60 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Hrdina zápasu
              </h3>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 p-6">
                <div className="absolute top-0 right-0">
                  <Medal className="w-32 h-32 text-orange-500/10" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-black text-white">#47</span>
                    </div>
                    <div>
                      <div className="text-white font-black text-2xl">Alexander Plinger</div>
                      <div className="text-blue-400 font-semibold">Alpha Team A</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-white">2</div>
                      <div className="text-xs text-gray-400 uppercase">Góly</div>
                    </div>
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-orange-400">1</div>
                      <div className="text-xs text-gray-400 uppercase">Nájezd</div>
                    </div>
                    <div className="text-center bg-black/30 rounded-lg p-3">
                      <div className="text-2xl font-black text-orange-600">🥉</div>
                      <div className="text-xs text-gray-400 uppercase">Bronz</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30">
                      <Medal className="w-5 h-5 text-orange-400" />
                      <span className="text-sm text-orange-400 font-bold">
                        Rozhodl o bronzové medaili v nájezdech!
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