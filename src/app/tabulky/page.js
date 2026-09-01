'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { 
  Trophy, TrendingUp, TrendingDown, ArrowLeft, Minus,
  Shield, Crosshair, Zap, Star, ChevronRight, BarChart3,
  Crown, Info, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { khlaSeasonOptions, khlaStandingsBySeason } from '@/data/khlaStandings';

// Team logos mapping - zkopírováno z vysledky/page.js
const teamLogos = {
  // Litvínov Lancers varianty
  'HC Litvínov Lancers': '/images/loga/lancers-logo.png',
  'Litvínov Lancers': '/images/loga/lancers-logo.png',
  'Lancers': '/images/loga/lancers-logo.png',
  'HC Lancers': '/images/loga/lancers-logo.png',
  
  // Týmy z Českého poháru
  'Netopýři': '/images/loga/Netopyri.png',
  'Netopýři Černošice': '/images/loga/Netopyri.png',
  'Kocouři Beroun': '/images/loga/Kocouri.png',
  'Gurmáni Žatec': '/images/loga/Gurmani.png',
  'Ducks Klášterec': '/images/loga/Ducks.png',
  'Ducks Kláštěrec': '/images/loga/Ducks.png',
  'Viper Ústí': '/images/loga/Viper.png',
  'Viper Ústí nad Labem': '/images/loga/Viper.png',
  'Sharks Ústí': '/images/loga/Sharks.png',
  
  // KHLA Liga týmy
  'HC Krokodýl': '/images/loga/HCKrokodyl.png',
  'HC Kopyta': '/images/loga/HCKopyta.png',
  'HC Žíhadla': '/images/loga/HCZihadla.png',
  'HC Žihadla': '/images/loga/HCZihadla.png',
  'HC Band Of Brothers': '/images/loga/HCBandofBrothers.png',
  'HC North Blades': '/images/loga/HCNorthBlades.png',
  'HC F.R.I.E.N.D.S.': '/images/loga/HCFriends.png',
  'HC Warriors': '/images/loga/HCWarriors.png',
  'HC Wariors': '/images/loga/HCWarriors.png',
  
  'default': '/images/loga/KHLA.png'
};

// Helper function pro získání loga týmu
const getTeamLogo = (teamName) => {
  if (!teamName) return teamLogos.default;
  
  // Try exact match first
  if (teamLogos[teamName]) {
    return teamLogos[teamName];
  }
  
  // Try partial match - check if any key is contained in teamName or vice versa
  for (const [key, value] of Object.entries(teamLogos)) {
    // Skip default
    if (key === 'default') continue;
    
    // Check both directions for partial match
    const keyLower = key.toLowerCase();
    const teamLower = teamName.toLowerCase();
    
    if (teamLower.includes(keyLower) || keyLower.includes(teamLower)) {
      return value;
    }
    
    // Special cases for teams with different naming
    if (teamLower.includes('lancers')) {
      return '/images/loga/lancers-logo.png';
    }
    if (teamLower.includes('netopýři') || teamLower.includes('netopyri')) {
      return '/images/loga/Netopyri.png';
    }
    if (teamLower.includes('kocouři') || teamLower.includes('kocouri')) {
      return '/images/loga/Kocouri.png';
    }
    if (teamLower.includes('gurmán') || teamLower.includes('gurman')) {
      return '/images/loga/Gurmani.png';
    }
    if (teamLower.includes('ducks')) {
      return '/images/loga/Ducks.png';
    }
    if (teamLower.includes('viper')) {
      return '/images/loga/Viper.png';
    }
    if (teamLower.includes('sharks')) {
      return '/images/loga/Sharks.png';
    }
  }
  
  return teamLogos.default;
};

export default function TabulkyPage() {
  const [selectedLeague, setSelectedLeague] = useState('khla'); // khla | cup
  const [selectedKhlaSeason, setSelectedKhlaSeason] = useState('25/26');

  // Český pohár 24/25 - Skutečná data ze zápasů
  const cupTeams = [
    { 
      position: 1, 
      team: 'Ducks Kláštěrec', 
      games: 12, 
      wins: 11, 
      draws: 0, 
      losses: 1, 
      goalsFor: 100, 
      goalsAgainst: 36, 
      points: 33, 
      form: ['W', 'W', 'W', 'W', 'W'],
      trend: 'up',
      lastGames: ['6:2 Viper', '12:2 Gurmáni', '13:2 Sharks', '5:7 Kocouři', '5:4 Netopýři']
    },
    { 
      position: 2, 
      team: 'Kocouři Beroun', 
      games: 12, 
      wins: 10, 
      draws: 0, 
      losses: 2, 
      goalsFor: 92, 
      goalsAgainst: 40, 
      points: 30, 
      form: ['W', 'W', 'W', 'W', 'W'],
      trend: 'up',
      lastGames: ['7:2 Viper', '9:4 Gurmáni', '6:4 Sharks', '7:5 Ducks', '6:2 Netopýři']
    },
    { 
      position: 3, 
      team: 'Litvínov Lancers', 
      games: 12, 
      wins: 9, 
      draws: 0, 
      losses: 3, 
      goalsFor: 87, 
      goalsAgainst: 49, 
      points: 27, 
      form: ['W', 'W', 'W', 'W', 'L'],
      trend: 'stable', 
      isOurTeam: true,
      lastGames: ['6:2 Viper', '13:4 Sharks', '4:3sn Kocouři', '6:2 Gurmáni', '5:7 Ducks']
    },
    { 
      position: 4, 
      team: 'Viper Ústí', 
      games: 12, 
      wins: 5, 
      draws: 0, 
      losses: 7, 
      goalsFor: 74, 
      goalsAgainst: 52, 
      points: 15, 
      form: ['L', 'L', 'L', 'W', 'W'],
      trend: 'down',
      lastGames: ['2:6 Lancers', '2:6 Ducks', '2:7 Kocouři', '9:3 Sharks', '10:1 Gurmáni']
    },
    { 
      position: 5, 
      team: 'Netopýři', 
      games: 12, 
      wins: 5, 
      draws: 0, 
      losses: 7, 
      goalsFor: 64, 
      goalsAgainst: 51, 
      points: 15, 
      form: ['L', 'L', 'W', 'W', 'L'],
      trend: 'down',
      lastGames: ['4:5 Ducks', '4:5 Lancers', '8:2 Sharks', '5:1 Gurmáni', '2:6 Kocouři']
    },
    { 
      position: 6, 
      team: 'Gurmáni Žatec', 
      games: 12, 
      wins: 1, 
      draws: 0, 
      losses: 11, 
      goalsFor: 31, 
      goalsAgainst: 100, 
      points: 3, 
      form: ['L', 'L', 'L', 'L', 'L'],
      trend: 'down',
      lastGames: ['2:12 Ducks', '1:10 Viper', '2:6 Lancers', '1:5 Netopýři', '4:9 Kocouři']
    },
    { 
      position: 7, 
      team: 'Sharks Ústí', 
      games: 12, 
      wins: 1, 
      draws: 0, 
      losses: 11, 
      goalsFor: 33, 
      goalsAgainst: 111, 
      points: 3, 
      form: ['L', 'L', 'L', 'L', 'W'],
      trend: 'stable',
      lastGames: ['2:13 Ducks', '3:9 Viper', '4:6 Kocouři', '2:8 Netopýři', '7:1 Gurmáni']
    }
  ];

  const currentKhlaSeason = khlaStandingsBySeason[selectedKhlaSeason];
  const currentTeams = selectedLeague === 'khla' ? currentKhlaSeason.teams : cupTeams;

  const getFormColor = (result) => {
    switch(result) {
      case 'W': return 'bg-green-500 text-white';
      case 'D': return 'bg-yellow-500 text-white';
      case 'L': return 'bg-red-500 text-white';
      default: return 'bg-gray-300';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="text-green-500" size={20} />;
    if (trend === 'down') return <TrendingDown className="text-red-500" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  const getPositionBadge = (position) => {
    if (selectedLeague === 'cup') {
      // Český pohár - všichni postupují
      if (position === 1) {
        return { 
          bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', 
          text: 'text-black', 
          icon: <Crown size={16} />,
          label: 'Semifinále'
        };
      }
      // Všichni ostatní (2.-7. místo) postupují do čtvrtfinále
      return { 
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500', 
        text: 'text-white', 
        icon: <Trophy size={16} />,
        label: 'Čtvrtfinále'
      };
    }
    
    // KHLA Liga
    if (position === 1) {
      return { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-black', icon: <Crown size={16} />, label: '1. místo' };
    }
    if (position <= 4) {
      return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-white', icon: <Trophy size={16} />, label: 'Semifinále' };
    }
    return { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-white', icon: <Shield size={16} />, label: 'Play-out' };
  };

  // Nejlepší střelci - pouze pro Český pohár (skutečné statistiky)
  const topScorers = selectedLeague === 'cup' ? [
    { rank: 1, name: 'Jiří Trnka', team: 'Ducks Kláštěrec', goals: 34, assists: 16, points: 50 },
    { rank: 2, name: 'Martin Martínek', team: 'Kocouři Beroun', goals: 23, assists: 7, points: 30 },
    { rank: 3, name: 'Dominik Vlach', team: 'Ducks Kláštěrec', goals: 7, assists: 17, points: 28 },
    { rank: 4, name: 'Jan Rychtář', team: 'Viper Ústí', goals: 15, assists: 10, points: 26 },
    { rank: 5, name: 'Dušan Hruška', team: 'Viper Ústí', goals: 14, assists: 6, points: 23 },
    { rank: 6, name: 'Pavel Schubada ml.', team: 'Litvínov Lancers', goals: 15, assists: 6, points: 21 },
    { rank: 7, name: 'Marek Tláskal', team: 'Kocouři Beroun', goals: 13, assists: 7, points: 21 },
    { rank: 8, name: 'Jan Olšiak', team: 'Kocouři Beroun', goals: 13, assists: 8, points: 21 },
    { rank: 9, name: 'Vláďa Havlíček', team: 'Netopýři', goals: 10, assists: 8, points: 20 },
    { rank: 10, name: 'Jan Hanuš', team: 'Litvínov Lancers', goals: 7, assists: 8, points: 18 }
  ] : null;

  const cupLancersMatches = [
    { date: '29.3.', home: 'Viper Ústí', away: 'Litvínov Lancers', score: '2:6', result: 'W' },
    { date: '22.3.', home: 'Netopýři', away: 'Litvínov Lancers', score: '4:5', result: 'W' },
    { date: '11.1.', home: 'Litvínov Lancers', away: 'Kocouři Beroun', score: '4:3sn', result: 'W' },
    { date: '26.1.', home: 'Gurmáni Žatec', away: 'Litvínov Lancers', score: '2:6', result: 'W' },
    { date: '18.1.', home: 'Ducks Kláštěrec', away: 'Litvínov Lancers', score: '7:5', result: 'L' },
    { date: '19.1.', home: 'Litvínov Lancers', away: 'Sharks Ústí', score: '13:4', result: 'W' }
  ];

  // Poslední zápasy Lancers - různé pro každou soutěž a sezónu
  const lancersMatches = selectedLeague === 'khla'
    ? currentKhlaSeason.lancersMatches
    : cupLancersMatches;

  return (
    <div className="min-h-screen bg-white">
      {/* Použití Navigation komponenty */}
      <Navigation />

      {/* Header - s padding-top kvůli fixed navigation */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 mt-28">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-semibold">
            <ArrowLeft size={20} />
            <span>Zpět na hlavní stránku</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">Tabulky soutěží</h1>
              <p className="text-gray-600 mt-1">
                Sezóna {selectedLeague === 'khla' ? currentKhlaSeason.fullSeason : '2024/2025'}
              </p>
            </div>
          </div>

          {/* League switcher */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedLeague('khla')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-3 ${
                selectedLeague === 'khla'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500'
              }`}
            >
              <img src="/images/loga/KHLA.png" alt="KHLA" className="w-6 h-6" />
              KHLA Sportega Liga
            </button>
            <button
              onClick={() => setSelectedLeague('cup')}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-3 ${
                selectedLeague === 'cup'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500'
              }`}
            >
              <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-6 h-6" />
              Český pohár
            </button>
          </div>

          {selectedLeague === 'khla' && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-wide text-gray-500">Sezóna KHLA</span>
              {khlaSeasonOptions.map((season) => (
                <button
                  key={season.id}
                  type="button"
                  aria-pressed={selectedKhlaSeason === season.id}
                  onClick={() => setSelectedKhlaSeason(season.id)}
                  className={`px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 ${
                    selectedKhlaSeason === season.id
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500'
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Hlavní tabulka */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-900 to-black p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {selectedLeague === 'khla' ? (
                    <>
                      <img src="/images/loga/KHLA.png" alt="KHLA" className="w-7 h-7" />
                      {currentKhlaSeason.title}
                    </>
                  ) : (
                    <>
                      <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-7 h-7" />
                      Český pohár 24/25
                    </>
                  )}
                </h2>
              </div>
              
              {/* Info pro Český pohár */}
              {selectedLeague === 'cup' && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 border-b border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Info className="text-amber-600 flex-shrink-0" size={22} />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 mb-1">Systém postupu do play-off:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Crown className="text-yellow-500" size={16} />
                          <span><strong>1. místo</strong> postupuje přímo do semifinále</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Trophy className="text-green-500" size={16} />
                          <span><strong>2.-7. místo</strong> postupuje do čtvrtfinále</span>
                        </li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-2 italic">
                        Všechny týmy postupují do play-off!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Info pro KHLA */}
              {selectedLeague === 'khla' && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0" size={22} />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 mb-1">Systém play-off KHLA Sportega Liga:</p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Trophy className="text-green-500" size={16} />
                          <span><strong>1.-4. místo</strong> postupuje do semifinále</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="text-blue-500" size={16} />
                          <span><strong>5.-8. místo</strong> hraje play-out o konečné umístění</span>
                        </li>
                      </ul>
                      {currentKhlaSeason.sourceUrl && (
                        <a
                          href={currentKhlaSeason.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex mt-2 text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2"
                        >
                          {currentKhlaSeason.sourceLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left p-3 font-bold text-gray-700">#</th>
                      <th className="text-left p-3 font-bold text-gray-700">Tým</th>
                      <th className="text-center p-3 font-bold text-gray-700">Z</th>
                      <th className="text-center p-3 font-bold text-gray-700">V</th>
                      <th className="text-center p-3 font-bold text-gray-700">R</th>
                      <th className="text-center p-3 font-bold text-gray-700">P</th>
                      <th className="text-center p-3 font-bold text-gray-700">Skóre</th>
                      <th className="text-center p-3 font-bold text-gray-700">+/-</th>
                      <th className="text-center p-3 font-bold text-gray-700">Body</th>
                      <th className="text-center p-3 font-bold text-gray-700 hidden md:table-cell">Forma</th>
                      <th className="text-center p-3 font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeams.map((team) => {
                      const badge = getPositionBadge(team.position);
                      const teamLogo = getTeamLogo(team.team);
                      return (
                        <tr 
                          key={team.position}
                          className={`border-b hover:bg-gray-50 transition-all ${
                            team.isOurTeam ? 'bg-red-50 font-bold' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${badge.bg} ${badge.text} font-bold text-lg shadow-sm`}>
                              {team.position}
                              {selectedLeague === 'cup' && badge.icon && (
                                <div className="absolute -top-1.5 -right-1.5">
                                  {badge.icon}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={teamLogo} 
                                alt={team.team}
                                className={`object-contain ${
                                  selectedLeague === 'cup' 
                                    ? 'w-10 h-10' 
                                    : 'w-9 h-9'
                                }`}
                                style={{ minWidth: selectedLeague === 'cup' ? '40px' : '36px' }}
                                onError={(e) => { e.target.src = '/images/loga/KHLA.png'; }}
                              />
                              {team.code && (
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {team.code}
                                </span>
                              )}
                              <span className={team.isOurTeam ? 'text-red-600 font-bold' : 'text-gray-900'}>
                                {team.team}
                              </span>
                              {team.isOurTeam && <Star className="text-yellow-500" size={16} fill="currentColor" />}
                            </div>
                          </td>
                          <td className="text-center p-3 text-gray-700">{team.games}</td>
                          <td className="text-center p-3 text-green-600 font-semibold">{team.wins}</td>
                          <td className="text-center p-3 text-yellow-600 font-semibold">{team.draws}</td>
                          <td className="text-center p-3 text-red-600 font-semibold">{team.losses}</td>
                          <td className="text-center p-3 text-gray-700 text-sm">
                            {team.goalsFor}:{team.goalsAgainst}
                          </td>
                          <td className="text-center p-3">
                            <span className={`font-bold ${
                              team.goalsFor - team.goalsAgainst > 0 ? 'text-green-600' : 
                              team.goalsFor - team.goalsAgainst < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className={`text-xl font-bold ${team.isOurTeam ? 'text-red-600' : 'text-gray-900'}`}>
                              {team.points}
                            </span>
                          </td>
                          <td className="text-center p-3 hidden md:table-cell">
                            <div className="flex gap-1 justify-center">
                              {team.form?.length ? team.form.map((result, i) => (
                                  <div
                                    key={i}
                                    className={`w-7 h-7 rounded ${getFormColor(result)} flex items-center justify-center text-xs font-bold shadow-sm relative group`}
                                    title={team.lastGames ? team.lastGames[i] : ''}
                                  >
                                    {result}
                                    {team.lastGames && (
                                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        {team.lastGames[i]}
                                      </div>
                                    )}
                                  </div>
                                )) : (
                                  <span className="text-gray-400 font-bold">—</span>
                                )}
                            </div>
                          </td>
                          <td className="text-center p-3">
                            {getTrendIcon(team.trend)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Legenda */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-4 text-sm">
                  {selectedLeague === 'cup' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded"></div>
                        <span className="text-gray-600 font-semibold">Přímý postup do semifinále</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                        <span className="text-gray-600">Postup do čtvrtfinále</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded"></div>
                        <span className="text-gray-600 font-semibold">1. místo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                        <span className="text-gray-600">Postup do semifinále</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                        <span className="text-gray-600">Play-out (5.-8. místo)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Play-out tabulka - pouze pro KHLA */}
            {selectedLeague === 'khla' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mt-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Shield className="text-white" size={24} />
                    {currentKhlaSeason.placementTitle}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">{currentKhlaSeason.placementSubtitle}</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left p-3 font-bold text-gray-700">#</th>
                        <th className="text-left p-3 font-bold text-gray-700">Tým</th>
                        <th className="text-center p-3 font-bold text-gray-700">Z</th>
                        <th className="text-center p-3 font-bold text-gray-700">V</th>
                        <th className="text-center p-3 font-bold text-gray-700">R</th>
                        <th className="text-center p-3 font-bold text-gray-700">P</th>
                        <th className="text-center p-3 font-bold text-gray-700">Skóre</th>
                        <th className="text-center p-3 font-bold text-gray-700">+/-</th>
                        <th className="text-center p-3 font-bold text-gray-700">Body</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentKhlaSeason.placementTeams.map((team) => {
                        const goalDifference = team.goalsFor - team.goalsAgainst;
                        const teamLogo = getTeamLogo(team.team);

                        return (
                          <tr
                            key={team.code}
                            className={`border-b hover:bg-gray-50 transition-all ${team.isOurTeam ? 'bg-green-50' : ''}`}
                          >
                            <td className="p-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                                team.isOurTeam
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                              }`}>
                                {team.position}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={teamLogo}
                                  alt={team.team}
                                  className="w-9 h-9 object-contain"
                                  onError={(e) => { e.target.src = '/images/loga/KHLA.png'; }}
                                />
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{team.code}</span>
                                <span className={team.isOurTeam ? 'text-red-600 font-bold' : 'text-gray-900'}>{team.team}</span>
                                {team.isOurTeam && <Star className="text-yellow-500" size={16} fill="currentColor" />}
                              </div>
                            </td>
                            <td className="text-center p-3 text-gray-700">{team.games}</td>
                            <td className="text-center p-3 text-green-600 font-semibold">{team.wins}</td>
                            <td className="text-center p-3 text-yellow-600 font-semibold">{team.draws}</td>
                            <td className="text-center p-3 text-red-600 font-semibold">{team.losses}</td>
                            <td className="text-center p-3 text-gray-700 text-sm">{team.goalsFor}:{team.goalsAgainst}</td>
                            <td className="text-center p-3">
                              <span className={`font-bold ${
                                goalDifference > 0 ? 'text-green-600' :
                                goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {goalDifference > 0 ? '+' : ''}{goalDifference}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className={`text-xl font-bold ${team.isOurTeam ? 'text-red-600' : 'text-gray-900'}`}>
                                {team.points}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Poznámka pod play-out tabulkou */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-green-600" size={22} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{currentKhlaSeason.placementNoteTitle}</p>
                      <p className="text-xs text-gray-600 mt-1">{currentKhlaSeason.placementNoteText}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top střelci - pouze pro Český pohár */}
            {selectedLeague === 'cup' && topScorers && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
                  <h3 className="text-lg font-bold text-black flex items-center gap-3">
                    <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-7 h-7" />
                    Nejproduktivnější hráči Českého poháru
                  </h3>
                  <p className="text-xs text-yellow-900 mt-1">Top 10 střelců všech týmů</p>
                </div>
                <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                  {topScorers.map((player) => {
                    const teamLogo = getTeamLogo(player.team);
                    const isLancers = player.team.includes('Lancers');
                    return (
                      <div 
                        key={player.rank}
                        className={`p-2.5 rounded-lg flex items-center justify-between ${
                          player.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300' :
                          player.rank <= 3 ? 'bg-gray-50 border border-gray-200' :
                          isLancers ? 'bg-red-50 border border-red-200' :
                          'bg-gray-50 hover:bg-gray-100 transition-all'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black' :
                            player.rank === 2 ? 'bg-gray-400 text-white' :
                            player.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-gray-300 text-gray-700'
                          }`}>
                            {player.rank}
                          </div>
                          <img 
                            src={teamLogo} 
                            alt={player.team}
                            className="w-8 h-8 object-contain"
                            style={{ minWidth: '32px' }}
                            onError={(e) => { e.target.src = '/images/loga/KHLA.png'; }}
                          />
                          <div>
                            <div className={`font-bold text-gray-900 text-sm ${isLancers ? 'text-red-600' : ''}`}>
                              {player.name}
                            </div>
                            <div className={`text-xs ${isLancers ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                              {player.team}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{player.points}b</div>
                          <div className="text-xs text-gray-500">{player.goals}G {player.assists}A</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info box pro KHLA */}
            {selectedLeague === 'khla' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <Trophy size={22} />
                    O KHLA Sportega Lize
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="text-blue-600" size={18} />
                      Formát soutěže
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 8 týmů v základní části</li>
                      <li>• Systém každý s každým 2x</li>
                      <li>• Top 4 postupují do semifinále</li>
                      <li>• Týmy 5-8 hrají play-out</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Crosshair className="text-red-600" size={18} />
                      Cíle Lancers
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Velká výzva v kvalitní KHLA</li>
                      <li>• Neskončit poslední</li>
                      <li>• Zdokonalování dovedností</li>
                      <li className="font-bold text-green-600">• Úspěch: 5. místo po play-out! 🎉</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Zápasy Lancers */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={20} />
                  Zápasy Lancers
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {lancersMatches.map((match, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      match.result === 'W' ? 'bg-green-50 border border-green-200' : 
                      match.result === 'D' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-semibold">{match.date}</span>
                      <span className={`font-bold ${
                        match.result === 'W' ? 'text-green-600' :
                        match.result === 'D' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {match.score}
                      </span>
                    </div>
                    <div className="text-xs mt-1">
                      <span className={match.home === 'Lancers' || match.home === 'Litvínov Lancers' ? 'font-bold text-red-600' : 'text-gray-700'}>
                        {match.home}
                      </span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className={match.away === 'Lancers' || match.away === 'Litvínov Lancers' ? 'font-bold text-red-600' : 'text-gray-700'}>
                        {match.away}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" />
                Rychlé statistiky
              </h3>
              <div className="space-y-3">
                {selectedLeague === 'cup' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Nejvíce gólů:</span>
                      <span className="font-bold">{currentTeams[0].team}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Nejlepší obrana:</span>
                      <span className="font-bold">{[...currentTeams].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0].team}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Lancers pozice:</span>
                      <span className="font-bold text-yellow-400">3. místo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Postup:</span>
                      <span className="font-bold text-green-400">Čtvrtfinále ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Nejlepší střelec ČP:</span>
                      <span className="font-bold text-yellow-400">J. Trnka (50b)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Nejvíce gólů:</span>
                      <span className="font-bold">{currentKhlaSeason.quickStats.mostGoals}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Nejlepší obrana:</span>
                      <span className="font-bold">{currentKhlaSeason.quickStats.bestDefense}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Lancers pozice:</span>
                      <span className="font-bold text-yellow-400">{currentKhlaSeason.quickStats.lancersPosition}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Bilance:</span>
                      <span className="font-bold">{currentKhlaSeason.quickStats.record}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-100">Skóre:</span>
                      <span className="font-bold">{currentKhlaSeason.quickStats.score}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-3">
                {selectedLeague === 'khla' ? 'Výsledek sezóny' : 'Další zápas Lancers'}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="text-2xl font-bold text-red-500">
                  {selectedLeague === 'khla' ? currentKhlaSeason.summaryCard.headline : 'Play-off čtvrtfinále'}
                </div>
                <div className="text-gray-300">
                  {selectedLeague === 'khla' ? currentKhlaSeason.summaryCard.detail : 'Termín bude upřesněn'}
                </div>
                <div className="text-gray-400 text-sm">
                  {selectedLeague === 'khla' ? currentKhlaSeason.summaryCard.note : 'Lancers Arena'}
                </div>
              </div>
              <Link 
                href={selectedLeague === 'khla' ? '/vysledky' : '/vstupenky'}
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all transform hover:scale-105"
              >
                {selectedLeague === 'khla' ? 'Zobrazit výsledky' : 'Koupit vstupenky'}
                <ChevronRight className="inline ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Poznámky pod tabulkou */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="text-red-600" size={22} />
            Informace o soutěži
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong className="text-gray-900">Systém bodování:</strong> Výhra = 3 body, Remíza = 1 bod, Prohra = 0 bodů
            </div>
            {selectedLeague === 'cup' ? (
              <>
                <div>
                  <strong className="text-gray-900">Play-off systém:</strong> Jednokolově na jeden zápas
                </div>
                <div>
                  <strong className="text-gray-900">Postup:</strong> Všechny týmy postupují do play-off
                </div>
                <div>
                  <strong className="text-gray-900">Poznámka:</strong> Tým Lopaty Praha odstoupil ze soutěže
                </div>
                <div>
                  <strong className="text-gray-900">Formát:</strong> 1. místo přímo do semifinále, ostatní čtvrtfinále
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong className="text-gray-900">Semifinále:</strong> Postup pro 1.-4. místo
                </div>
                <div>
                  <strong className="text-gray-900">Play-out:</strong> Týmy na 5.-8. místě hrají o konečné umístění
                </div>
                <div>
                  <strong className="text-gray-900">Forma:</strong> Posledních 5 zápasů (W = výhra, D = remíza, L = prohra)
                </div>
                <div>
                  <strong className="text-gray-900">Aktualizace:</strong> Po každém odehraném kole
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <div className="font-bold">LITVÍNOV</div>
                  <div className="text-red-500 text-sm font-bold">LANCERS</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Hrdý člen KHLA ligy
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-red-500">Klub</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/historie" className="hover:text-white">Historie</Link></li>
                <li><Link href="/sin-slavy" className="hover:text-white">Síň slávy</Link></li>
                <li><Link href="/soupisky" className="hover:text-white">Soupiska</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-red-500">Pro fanoušky</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/games/cards" className="hover:text-white">HC Cards hra</Link></li>
                <li><Link href="/vstupenky" className="hover:text-white">Vstupenky</Link></li>
                <li><Link href="/fanshop" className="hover:text-white">Fan Shop</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-red-500">Sledujte nás</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span>📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © 2025 HC Litvínov Lancers • Oficiální stránky
          </div>
        </div>
      </footer>
    </div>
  );
}
