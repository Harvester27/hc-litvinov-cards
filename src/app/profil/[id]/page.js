'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MatchDetail from '@/components/MatchDetail';
import { getPlayerById } from '@/data/playerData';
import { getPlayerStats, getPlayerMatches } from '@/data/playerStats';
import { 
  ArrowLeft, User, Trophy, Target, Shield, Calendar, 
  MapPin, Award, TrendingUp, Clock, ChevronRight,
  Star, Zap, Activity, Hash, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchDetail, setShowMatchDetail] = useState(false);

  useEffect(() => {
    if (params.id) {
      const playerData = getPlayerById(params.id);
      if (playerData) {
        setPlayer(playerData);
        setStats(getPlayerStats(params.id));
        setAllMatches(getPlayerMatches(params.id)); // Získat všechny zápasy
      } else {
        // Hráč nenalezen
        router.push('/soupisky');
      }
    }
  }, [params.id, router]);

  if (!player) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl">Načítání...</div>
      </div>
    );
  }

  const getPositionColor = (position) => {
    if (position === 'Brankář') return 'from-blue-600 to-blue-800';
    if (position === 'Obránce') return 'from-green-600 to-green-800';
    return 'from-red-600 to-red-800';
  };

  const getPositionIcon = (position) => {
    if (position === 'Brankář') return <Shield size={24} />;
    if (position === 'Obránce') return <Shield size={24} />;
    return <Target size={24} />;
  };

  // Funkce pro získání statistik hráče v konkrétním zápase
  const getPlayerMatchStats = (match) => {
    let goals = 0;
    let assists = 0;
    let penaltyMinutes = 0;
    
    // Počítat góly a asistence
    if (match.goals) {
      match.goals.forEach(goal => {
        if (goal.scorer === player.name) {
          goals++;
        }
        // Kontrola asistencí (může být v různých formátech)
        if (goal.assists) {
          const assistText = goal.assists.toString();
          if (assistText.includes(player.name)) {
            assists++;
          }
        }
      });
    }
    
    // Počítat trestné minuty
    if (match.penalties) {
      match.penalties.forEach(penalty => {
        if (penalty.player === player.name) {
          const minutes = parseInt(penalty.duration) || 2;
          penaltyMinutes += minutes;
        }
      });
    }
    
    return {
      goals,
      assists,
      points: goals + assists,
      penaltyMinutes
    };
  };

  // Funkce pro určení výsledku zápasu pro tým hráče
  const getMatchResult = (match) => {
    // Zjistit, za který tým hráč hrál
    const isHomeTeam = 
      match.homeLineup?.goalie === player.name ||
      [
        ...(match.homeLineup?.line1 || []),
        ...(match.homeLineup?.line2 || []),
        ...(match.homeLineup?.line3 || [])
      ].includes(player.name);
    
    // Rozdělit skóre
    const scoreParts = match.score.replace(' sn', '').replace(' pp', '').split(':');
    const homeScore = parseInt(scoreParts[0]);
    const awayScore = parseInt(scoreParts[1]);
    
    // Určit výsledek
    if (isHomeTeam) {
      return homeScore > awayScore ? 'win' : homeScore < awayScore ? 'loss' : 'tie';
    } else {
      return awayScore > homeScore ? 'win' : awayScore < homeScore ? 'loss' : 'tie';
    }
  };

  // Počítadla výher a proher
  const winLossRecord = allMatches.reduce((acc, match) => {
    const result = getMatchResult(match);
    if (result === 'win') acc.wins++;
    else if (result === 'loss') acc.losses++;
    else acc.ties++;
    return acc;
  }, { wins: 0, losses: 0, ties: 0 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Match Detail Modal */}
      <MatchDetail 
        match={selectedMatch} 
        isOpen={showMatchDetail} 
        onClose={() => {
          setShowMatchDetail(false);
          setSelectedMatch(null);
        }} 
      />
      
      {/* Header */}
      <div className="pt-32 pb-8 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <Link href="/soupisky" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 font-bold">
            <ArrowLeft size={20} />
            <span>Zpět na soupisku</span>
          </Link>
          
          {/* Player Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8 p-8">
              {/* Player Info */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-32 h-32 bg-gradient-to-br ${getPositionColor(player.position)} rounded-full flex items-center justify-center shadow-2xl mb-4`}>
                    <span className="text-white text-5xl font-black">#{player.number}</span>
                  </div>
                  <h1 className="text-3xl font-black text-black mb-2">{player.name}</h1>
                  <div className="flex items-center gap-2 text-red-600 mb-4">
                    {getPositionIcon(player.position)}
                    <span className="text-xl font-bold">{player.position}</span>
                  </div>
                  <div className="text-4xl mb-4">{player.nationality}</div>
                  
                  {/* Win/Loss Record */}
                  <div className="flex gap-2 mb-4">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                      {winLossRecord.wins} V
                    </div>
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold">
                      {winLossRecord.losses} P
                    </div>
                    {winLossRecord.ties > 0 && (
                      <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-bold">
                        {winLossRecord.ties} R
                      </div>
                    )}
                  </div>
                  
                  {/* Basic Info */}
                  <div className="w-full space-y-2 text-left bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Věk:</span>
                      <span className="text-black font-bold">{player.age} let</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Výška:</span>
                      <span className="text-black font-bold">{player.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Váha:</span>
                      <span className="text-black font-bold">{player.weight} kg</span>
                    </div>
                    {player.birthDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Narození:</span>
                        <span className="text-black font-bold">{player.birthDate}</span>
                      </div>
                    )}
                    {player.birthPlace && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rodiště:</span>
                        <span className="text-black font-bold">{player.birthPlace}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">V týmu od:</span>
                      <span className="text-black font-bold">{player.joinedTeam}</span>
                    </div>
                    {player.shoots && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Střílí:</span>
                        <span className="text-black font-bold">{player.shoots === 'L' ? 'Levá' : 'Pravá'}</span>
                      </div>
                    )}
                    {player.catchingHand && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lapačka:</span>
                        <span className="text-black font-bold">{player.catchingHand === 'L' ? 'Levá' : 'Pravá'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="md:col-span-2">
                {/* Season Stats */}
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-3">
                    <Trophy className="text-red-600" />
                    Statistiky sezóny 2024/2025
                  </h2>
                  
                  {player.category === 'goalies' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-red-600">{stats?.gamesPlayed || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Zápasů</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-green-600">{stats?.wins || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Výher</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-red-600">{stats?.losses || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Proher</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-blue-600">{stats?.savePercentage || '0.0%'}</div>
                        <div className="text-gray-600 text-sm font-semibold">Úspěšnost</div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-black">{stats?.saves || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Zákroků</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-orange-600">{stats?.goalsAgainst || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Obdržených gólů</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-red-600">{stats?.gamesPlayed || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Zápasů</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-green-600">{stats?.goals || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Gólů</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-blue-600">{stats?.assists || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Asistencí</div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-300 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-yellow-600">{stats?.points || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Bodů</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-red-600">{stats?.penalties || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Trestů</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-orange-600">{stats?.penaltyMinutes || 0}</div>
                        <div className="text-gray-600 text-sm font-semibold">Trestných minut</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {player.description && (
                  <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-600 mb-6">
                    <p className="text-gray-800">{player.description}</p>
                  </div>
                )}
                
                {/* All Matches */}
                <div>
                  <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-3">
                    <Activity className="text-red-600" />
                    Všechny zápasy v sezóně
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {allMatches.length}
                    </span>
                  </h2>
                  
                  {allMatches.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {allMatches.map((match, index) => {
                        const matchStats = getPlayerMatchStats(match);
                        const result = getMatchResult(match);
                        const bgColor = result === 'win' ? 'from-green-50 to-green-100 border-green-300' : 
                                       result === 'loss' ? 'from-red-50 to-red-100 border-red-300' : 
                                       'from-gray-50 to-gray-100 border-gray-300';
                        const iconColor = result === 'win' ? 'text-green-600' : 
                                         result === 'loss' ? 'text-red-600' : 
                                         'text-gray-600';
                        
                        return (
                          <div 
                            key={match.id}
                            className={`bg-gradient-to-r ${bgColor} border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group`}
                            onClick={() => {
                              setSelectedMatch(match);
                              setShowMatchDetail(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={iconColor}>
                                  {result === 'win' ? <CheckCircle size={24} /> : 
                                   result === 'loss' ? <XCircle size={24} /> : 
                                   <Activity size={24} />}
                                </div>
                                <div className="text-gray-500 font-bold">
                                  #{allMatches.length - index}
                                </div>
                                <div>
                                  <div className="text-black font-bold group-hover:text-red-600 transition-colors">
                                    {match.homeTeam} vs {match.awayTeam}
                                  </div>
                                  <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                    <Calendar size={14} />
                                    {match.date}
                                    {match.location && (
                                      <>
                                        <span>•</span>
                                        <MapPin size={14} />
                                        {match.location}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                {/* Statistiky hráče */}
                                {player.category !== 'goalies' && (
                                  <div className="flex gap-3">
                                    <div className="text-center">
                                      <div className="text-xs font-semibold text-gray-500">G</div>
                                      <div className="text-xl font-black text-green-600">{matchStats.goals}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs font-semibold text-gray-500">A</div>
                                      <div className="text-xl font-black text-blue-600">{matchStats.assists}</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xs font-semibold text-gray-500">B</div>
                                      <div className="text-xl font-black text-yellow-600">{matchStats.points}</div>
                                    </div>
                                    {matchStats.penaltyMinutes > 0 && (
                                      <div className="text-center">
                                        <div className="text-xs font-semibold text-gray-500">TM</div>
                                        <div className="text-xl font-black text-red-600">{matchStats.penaltyMinutes}</div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Pro brankáře můžeme zobrazit jiné statistiky */}
                                {player.category === 'goalies' && match.saves && (
                                  <div className="flex gap-3">
                                    <div className="text-center">
                                      <div className="text-xs font-semibold text-gray-500">Zákroky</div>
                                      <div className="text-xl font-black text-blue-600">
                                        {match.saves.home || match.saves.away || '-'}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Skóre */}
                                <div className="text-right">
                                  <div className="text-2xl font-black text-black">{match.score}</div>
                                  <div className="text-gray-600 text-sm font-semibold">{match.category}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                      <p className="text-gray-600">Zatím žádné zápasy v této sezóně</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky KHLA Sportega Liga</p>
          </div>
        </div>
      </footer>
    </div>
  );
}