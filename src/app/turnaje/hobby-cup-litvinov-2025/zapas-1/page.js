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
  AlertTriangle, Goal
} from 'lucide-react';

export default function Zapas1Page() {
  // Data zápasu - lokálně v komponentě
  const matchData = {
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
    periods: ['3:4', '2:3'], // Jen 2 třetiny
    overtime: false,
    shootout: false,
    notes: 'Úvodní zápas turnaje - hrály se pouze 2 třetiny po 20 minutách',
    duration: '2x20 minut'
  };
  const [activeTab, setActiveTab] = useState('prehled'); // prehled, soupisky, statistiky

  // Soupisky týmů
  const rosters = {
    team1: {
      name: 'HC Litvínov Lancers',
      goalies: [
        { number: '', name: 'Jiří Morávek', position: 'Brankář' }
      ],
      defenders: [
        { number: '', name: 'Jiří Belinger', position: 'Obránce' },
        { number: '', name: 'Jindřich Belinger', position: 'Obránce' },
        { number: '', name: 'Ondřej Kocourek', position: 'Obránce', goals: 1, assists: 0, penalties: 2 },
        { number: '', name: 'Jiří Šalanda', position: 'Obránce' }
      ],
      forwards: [
        { number: '', name: 'Gustav Toman', position: 'Útočník', goals: 1, assists: 0 },
        { number: '', name: 'Václav Matějovič', position: 'Útočník', goals: 1, assists: 2 },
        { number: '', name: 'Jan Švarc', position: 'Útočník' },
        { number: '', name: 'Stanislav Švarc', position: 'Útočník' },
        { number: '', name: 'Ladislav Černý', position: 'Útočník', goals: 0, assists: 1 },
        { number: '', name: 'Václav Materna', position: 'Útočník', goals: 2, assists: 2 }
      ]
    },
    team2: {
      name: 'Alpha Team B',
      goalies: [
        { number: '', name: 'Lars Bethke', position: 'Brankář' }
      ],
      defenders: [
        { number: '', name: 'Leonid Hansen', position: 'Obránce', goals: 1, assists: 0 },
        { number: '', name: 'Alexander Zhiliaev', position: 'Obránce' },
        { number: '', name: 'Sergey Wotschel', position: 'Obránce' },
        { number: '', name: 'Artur Lishchynsky', position: 'Obránce', goals: 0, assists: 1 },
        { number: '', name: 'Leon Patz', position: 'Obránce' }
      ],
      forwards: [
        { number: '', name: 'Vladimir Visner', position: 'Útočník' },
        { number: '', name: 'Sergey Antipov', position: 'Útočník' },
        { number: '', name: 'Sergey Terechov', position: 'Útočník', goals: 0, assists: 1 },
        { number: '', name: 'Ivan Patayala', position: 'Útočník', goals: 3, assists: 1 },
        { number: '', name: 'Peter Eisele', position: 'Útočník', goals: 1, assists: 1 },
        { number: '', name: 'Andrey Esser', position: 'Útočník' },
        { number: '', name: 'Igor Nalyotov', position: 'Útočník', goals: 2, assists: 0, penalties: 2 },
        { number: '', name: 'Sergey Schnarr', position: 'Útočník', goals: 0, assists: 1 }
      ]
    }
  };

  // Průběh gólů
  const gameEvents = [
    { time: '1:00', period: 1, type: 'goal', team: 'team2', scorer: 'Ivan Patayala', assists: ['Sergey Terechov'], score: '0:1' },
    { time: '5:00', period: 1, type: 'penalty', team: 'team2', player: 'Igor Nalyotov', reason: 'Podražení', duration: 2 },
    { time: '6:00', period: 1, type: 'goal', team: 'team1', scorer: 'Václav Materna', assists: ['Ladislav Černý'], score: '1:1' },
    { time: '7:00', period: 1, type: 'goal', team: 'team2', scorer: 'Ivan Patayala', assists: [], score: '1:2' },
    { time: '10:00', period: 1, type: 'goal', team: 'team2', scorer: 'Ivan Patayala', assists: [], score: '1:3' },
    { time: '14:00', period: 1, type: 'goal', team: 'team2', scorer: 'Igor Nalyotov', assists: ['Sergey Schnarr'], score: '1:4' },
    { time: '18:00', period: 1, type: 'goal', team: 'team1', scorer: 'Gustav Toman', assists: ['Václav Matějovič'], score: '2:4' },
    { time: '20:00', period: 1, type: 'goal', team: 'team1', scorer: 'Václav Matějovič', assists: ['Václav Materna'], score: '3:4' },
    { time: '23:00', period: 2, type: 'goal', team: 'team2', scorer: 'Igor Nalyotov', assists: ['Peter Eisele'], score: '3:5' },
    { time: '26:00', period: 2, type: 'goal', team: 'team2', scorer: 'Peter Eisele', assists: ['Artur Lishchynsky'], score: '3:6' },
    { time: '30:00', period: 2, type: 'goal', team: 'team2', scorer: 'Leonid Hansen', assists: ['Ivan Patayala'], score: '3:7' },
    { time: '32:00', period: 2, type: 'goal', team: 'team1', scorer: 'Václav Materna', assists: ['Václav Matějovič'], score: '4:7' },
    { time: '35:00', period: 2, type: 'goal', team: 'team1', scorer: 'Ondřej Kocourek', assists: ['Václav Materna'], score: '5:7' },
    { time: '36:00', period: 2, type: 'penalty', team: 'team1', player: 'Ondřej Kocourek', reason: 'Podražení', duration: 2 }
  ];

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
  const winner = matchData.score1 > matchData.score2 ? 'team1' : 'team2';

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
            <Link href="/turnaje/hobby-cup-litvinov-2025" className="hover:text-white transition-colors">
              Hobby Hockey Litvínov 2025
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Úvodní zápas</span>
          </div>

          {/* Hlavní info o zápasu */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Swords className="w-8 h-8 text-blue-500" />
                <div>
                  <h1 className="text-3xl font-black text-white">
                    {matchData.round}
                  </h1>
                  <div className="text-lg text-gray-400">
                    Úvodní zápas turnaje
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">{matchData.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{matchData.time}</span>
                </div>
              </div>
            </div>

            {/* Skóre */}
            <div className="bg-gradient-to-r from-red-600/10 to-blue-600/10 rounded-xl p-8 border border-white/10">
              <div className="flex items-center justify-between">
                {/* Tým 1 - Litvínov */}
                <div className={`flex-1 text-center ${winner === 'team1' ? '' : 'opacity-60'}`}>
                  <div className="flex flex-col items-center gap-3">
                    {matchData.logo1 && (
                      <Image 
                        src={matchData.logo1} 
                        alt={matchData.team1}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                    <Flag country={matchData.country1} />
                    <h2 className="text-2xl font-bold text-red-500">
                      {matchData.team1}
                    </h2>
                  </div>
                </div>

                {/* Výsledek */}
                <div className="px-8">
                  <div className="text-6xl font-black text-white">
                    {matchData.score1}
                    <span className="text-gray-500 mx-3">:</span>
                    {matchData.score2}
                  </div>
                </div>

                {/* Tým 2 - Alpha Team B */}
                <div className={`flex-1 text-center ${winner === 'team2' ? '' : 'opacity-60'}`}>
                  <div className="flex flex-col items-center gap-3">
                    {matchData.logo2 && (
                      <Image 
                        src={matchData.logo2} 
                        alt={matchData.team2}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    )}
                    <Flag country={matchData.country2} />
                    <h2 className="text-2xl font-bold text-white">
                      {matchData.team2}
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
              {matchData.periods && matchData.periods.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="text-center text-sm text-yellow-400 mb-2">
                    ⚠️ Zápas se hrál pouze na 2 třetiny po 20 minutách
                  </div>
                  <div className="flex items-center justify-center gap-8">
                    {matchData.periods.map((period, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-400 mb-1">{index + 1}. třetina</div>
                        <div className="text-xl font-bold text-white">{period}</div>
                      </div>
                    ))}
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
                    <div className="font-semibold text-white">{matchData.venue}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-xs text-gray-400">Hrací čas</div>
                    <div className="font-semibold text-white">{matchData.duration}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-xs text-gray-400">Diváků</div>
                    <div className="font-semibold text-white">{matchData.attendance}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigace mezi sekcemi */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prehled')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'prehled'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Průběh zápasu</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('soupisky')}
            className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'soupisky'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Soupisky</span>
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
      </div>

      {/* Obsah podle záložky */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'prehled' && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Goal className="w-6 h-6 text-yellow-500" />
              Průběh zápasu
            </h3>
            
            <div className="space-y-3">
              {gameEvents.map((event, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 rounded-lg ${
                  event.type === 'goal' 
                    ? event.team === 'team1' 
                      ? 'bg-red-500/10 border border-red-500/30' 
                      : 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                  <div className="text-sm font-bold text-gray-400 w-16">
                    {event.time}
                  </div>
                  <div className="text-xs text-gray-500 w-20">
                    {event.period}. třetina
                  </div>
                  
                  {event.type === 'goal' ? (
                    <>
                      <Goal className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <span className={`font-bold ${
                          event.team === 'team1' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                          GÓL! {event.scorer}
                        </span>
                        {event.assists.length > 0 && (
                          <span className="text-gray-400 ml-2">
                            (as. {event.assists.join(', ')})
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-black text-white">
                        {event.score}
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <span className={`font-bold ${
                          event.team === 'team1' ? 'text-red-400' : 'text-blue-400'
                        }`}>
                          TREST: {event.player}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {event.duration} min - {event.reason}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'soupisky' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Litvínov */}
            <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-red-600 to-red-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Image src={matchData.logo1} alt={rosters.team1.name} width={32} height={32} className="object-contain" />
                  {rosters.team1.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">BRANKÁŘI</h4>
                  {rosters.team1.goalies.map((player, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{player.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">OBRÁNCI</h4>
                  {rosters.team1.defenders.map((player, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && <span className="text-green-400 text-sm">{player.goals}G</span>}
                        {player.assists > 0 && <span className="text-blue-400 text-sm">{player.assists}A</span>}
                        {player.penalties > 0 && <span className="text-yellow-400 text-sm">{player.penalties}TM</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-3">ÚTOČNÍCI</h4>
                  {rosters.team1.forwards.map((player, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && <span className="text-green-400 text-sm">{player.goals}G</span>}
                        {player.assists > 0 && <span className="text-blue-400 text-sm">{player.assists}A</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alpha Team B */}
            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Image src={matchData.logo2} alt={rosters.team2.name} width={32} height={32} className="object-contain" />
                  {rosters.team2.name}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">BRANKÁŘI</h4>
                  {rosters.team2.goalies.map((player, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{player.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">OBRÁNCI</h4>
                  {rosters.team2.defenders.map((player, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && <span className="text-green-400 text-sm">{player.goals}G</span>}
                        {player.assists > 0 && <span className="text-blue-400 text-sm">{player.assists}A</span>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-3">ÚTOČNÍCI</h4>
                  {rosters.team2.forwards.map((player, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-white">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.goals > 0 && <span className="text-green-400 text-sm">{player.goals}G</span>}
                        {player.assists > 0 && <span className="text-blue-400 text-sm">{player.assists}A</span>}
                        {player.penalties > 0 && <span className="text-yellow-400 text-sm">{player.penalties}TM</span>}
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
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Nejlepší střelci zápasu
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-yellow-500">1.</span>
                    <div>
                      <div className="text-white font-bold">Ivan Patayala</div>
                      <div className="text-gray-400 text-sm">Alpha Team B</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-yellow-500">3</div>
                    <div className="text-xs text-gray-400">góly</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">2.</span>
                    <div>
                      <div className="text-white font-bold">Václav Materna</div>
                      <div className="text-gray-400 text-sm">HC Litvínov Lancers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">2</div>
                    <div className="text-xs text-gray-400">góly</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">2.</span>
                    <div>
                      <div className="text-white font-bold">Igor Nalyotov</div>
                      <div className="text-gray-400 text-sm">Alpha Team B</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">2</div>
                    <div className="text-xs text-gray-400">góly</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nejproduktivnější hráči */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-500" />
                Nejproduktivnější hráči
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-blue-500">1.</span>
                    <div>
                      <div className="text-white font-bold">Václav Materna</div>
                      <div className="text-gray-400 text-sm">HC Litvínov Lancers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-500">4</div>
                    <div className="text-xs text-gray-400">2G + 2A</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">1.</span>
                    <div>
                      <div className="text-white font-bold">Ivan Patayala</div>
                      <div className="text-gray-400 text-sm">Alpha Team B</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">4</div>
                    <div className="text-xs text-gray-400">3G + 1A</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-400">3.</span>
                    <div>
                      <div className="text-white font-bold">Václav Matějovič</div>
                      <div className="text-gray-400 text-sm">HC Litvínov Lancers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">3</div>
                    <div className="text-xs text-gray-400">1G + 2A</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tlačítko zpět */}
        <div className="mt-8 text-center">
          <Link 
            href="/turnaje/hobby-cup-litvinov-2025"
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