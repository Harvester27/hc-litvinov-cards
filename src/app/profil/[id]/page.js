'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MatchDetail from '@/components/MatchDetail';
import PlayerProfileMedia from '@/components/PlayerProfileMedia';
import SeasonCompetitionFilters from '@/components/SeasonCompetitionFilters';
import { getPlayerById } from '@/data/playerData';
import {
  getLatestSeasonWithMatches,
  matchCompetitionFilters,
  matchSeasons
} from '@/data/matchFilters';
import {
  getPlayerStats,
  getPlayerMatches,
  includesPlayerName,
  isPlayerName,
  lineupIncludesPlayer
} from '@/data/playerStats';
import { 
  ArrowLeft, Trophy, Target, Shield, Calendar,
  MapPin, Activity, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

const getMatchTimestamp = (match) => {
  const [day = 1, month = 1, year = 1900] = String(match.date || '')
    .split('.')
    .map((value) => parseInt(value, 10));
  const [hour = 0, minute = 0] = String(match.time || '00:00')
    .split(':')
    .map((value) => parseInt(value, 10));

  return new Date(year, month - 1, day, hour, minute).getTime();
};

const areSkaterStatsComplete = (match) =>
  (match.skaterStatsComplete ?? match.statsComplete) !== false;

const areGoalieStatsComplete = (match) =>
  (match.goalieStatsComplete ?? match.statsComplete) !== false;

const isShootoutGoal = (goal) =>
  goal?.shootout === true || /^sn$/i.test(String(goal?.time || '').trim());

const isLancersHomeMatch = (match) => /lancers/i.test(String(match.homeTeam || ''));

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(matchSeasons[0].id);
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchDetail, setShowMatchDetail] = useState(false);

  useEffect(() => {
    if (params.id) {
      const playerData = getPlayerById(params.id);
      if (playerData) {
        const playerMatches = getPlayerMatches(params.id);
        setPlayer(playerData);
        setAllMatches(playerMatches);
        setSelectedSeason(getLatestSeasonWithMatches(playerMatches));
        setSelectedCompetition('all');
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

  const selectedSeasonInfo =
    matchSeasons.find((season) => season.id === selectedSeason) || matchSeasons[0];
  const selectedCompetitionInfo =
    matchCompetitionFilters.find((competition) => competition.id === selectedCompetition) ||
    matchCompetitionFilters[0];
  const seasonMatches = allMatches.filter(
    (match) => match.status === 'completed' && match.season === selectedSeason
  );
  const competitionCounts = Object.fromEntries(
    matchCompetitionFilters.map((competition) => [
      competition.id,
      competition.id === 'all'
        ? seasonMatches.length
        : seasonMatches.filter((match) => match.competition === competition.id).length
    ])
  );
  const filteredMatches = seasonMatches
    .filter(
      (match) => selectedCompetition === 'all' || match.competition === selectedCompetition
    )
    .sort((a, b) => getMatchTimestamp(b) - getMatchTimestamp(a));
  const stats = getPlayerStats(player.id, filteredMatches);
  const incompleteStatsCount = filteredMatches.filter((match) => {
    if (player.category !== 'goalies') return !areSkaterStatsComplete(match);

    const playedInGoal =
      isPlayerName(match.homeLineup?.goalie, player) ||
      isPlayerName(match.awayLineup?.goalie, player);
    return playedInGoal && (!areGoalieStatsComplete(match) || !match.saves);
  }).length;
  const goalieDetailStatsIncomplete = player.category === 'goalies' && incompleteStatsCount > 0;

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
    if (areSkaterStatsComplete(match) && match.goals) {
      match.goals.forEach(goal => {
        if (isShootoutGoal(goal)) return;

        if (isPlayerName(goal.scorer, player)) {
          goals++;
        }
        // Kontrola asistencí (může být v různých formátech)
        if (includesPlayerName(goal.assists, player)) {
          assists++;
        }
      });
    }
    
    // Počítat trestné minuty
    if (areSkaterStatsComplete(match) && match.penalties) {
      match.penalties.forEach(penalty => {
        if (isPlayerName(penalty.player, player)) {
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
    // Zápasové statistiky na klubovém webu jsou vždy z pohledu Lancers.
    const isHomeTeam = /lancers/i.test(String(match.homeTeam || ''))
      ? true
      : /lancers/i.test(String(match.awayTeam || ''))
        ? false
        : lineupIncludesPlayer(match.homeLineup, player);
    
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
  const winLossRecord = filteredMatches.reduce((acc, match) => {
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
                  {player.profileMedia?.length > 0 ? (
                    <div className="mb-6 w-full">
                      <PlayerProfileMedia
                        playerName={player.name}
                        playerNumber={player.number}
                        media={player.profileMedia}
                      />
                    </div>
                  ) : (
                    <div className={`w-32 h-32 bg-gradient-to-br ${getPositionColor(player.position)} rounded-full flex items-center justify-center shadow-2xl mb-4`}>
                      <span className="text-white text-5xl font-black">#{player.number ?? '—'}</span>
                    </div>
                  )}
                  <h1 className="text-3xl font-black text-black mb-2">{player.name}</h1>
                  <div className="flex items-center gap-2 text-red-600 mb-4">
                    {getPositionIcon(player.position)}
                    <span className="text-xl font-bold">{player.position}</span>
                  </div>
                  <div className="text-4xl mb-4">{player.nationality}</div>

                  {/* Win/Loss Record */}
                  <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                    Bilance výběru
                  </div>
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
                      <span className="text-black font-bold">{player.age ? `${player.age} let` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Výška:</span>
                      <span className="text-black font-bold">{player.height ? `${player.height} cm` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Váha:</span>
                      <span className="text-black font-bold">{player.weight ? `${player.weight} kg` : '—'}</span>
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
                    {player.joinedTeam && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">V týmu od:</span>
                        <span className="text-black font-bold">{player.joinedTeam}</span>
                      </div>
                    )}
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
                <SeasonCompetitionFilters
                  playerId={player.id}
                  playerName={player.name}
                  seasons={matchSeasons}
                  competitions={matchCompetitionFilters}
                  selectedSeason={selectedSeason}
                  selectedCompetition={selectedCompetition}
                  competitionCounts={competitionCounts}
                  onSeasonChange={(season) => {
                    setSelectedSeason(season);
                    setSelectedCompetition('all');
                  }}
                  onCompetitionChange={setSelectedCompetition}
                />

                {/* Season Stats */}
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-black mb-1 flex flex-wrap items-center gap-3">
                    <Trophy className="text-red-600" />
                    Statistiky {selectedSeasonInfo.fullLabel}
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                      {selectedCompetitionInfo.fullLabel}
                    </span>
                  </h2>
                  <p className="mb-4 text-sm text-gray-500">
                    Individuální údaje ze zápasů ve vybraném období a soutěži.
                  </p>

                  {player.category !== 'goalies' && incompleteStatsCount > 0 && (
                    <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                      <p>
                        {incompleteStatsCount === 1
                          ? 'U jednoho zápasu zatím nejsou doplněné individuální statistiky.'
                          : `U ${incompleteStatsCount} zápasů zatím nejsou doplněné individuální statistiky.`}{' '}
                        Výsledek a sestavu najdeš v seznamu níže.
                      </p>
                    </div>
                  )}

                  {player.category === 'goalies' && incompleteStatsCount > 0 && (
                    <div className="mb-4 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                      <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                      <p>
                        U {incompleteStatsCount === 1 ? 'jednoho zápasu chybí' : `${incompleteStatsCount} zápasů chybí`}{' '}
                        brankářské údaje. Zákroky, obdržené góly a úspěšnost proto nezobrazujeme jako úplné.
                      </p>
                    </div>
                  )}

                  {filteredMatches.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                      <Activity className="mx-auto mb-2 text-gray-400" size={28} aria-hidden="true" />
                      <p className="font-bold text-gray-700">Pro tento výběr nejsou žádné statistiky.</p>
                    </div>
                  ) : player.category === 'goalies' ? (
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
                        <div className="text-3xl font-black text-blue-600">
                          {goalieDetailStatsIncomplete ? '—' : stats?.savePercentage || '0.0%'}
                        </div>
                        <div className="text-gray-600 text-sm font-semibold">Úspěšnost</div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-black">
                          {goalieDetailStatsIncomplete ? '—' : stats?.saves || 0}
                        </div>
                        <div className="text-gray-600 text-sm font-semibold">Zákroků</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-black text-orange-600">
                          {goalieDetailStatsIncomplete ? '—' : stats?.goalsAgainst || 0}
                        </div>
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
                  <div className="mb-4">
                    <h2 className="flex flex-wrap items-center gap-3 text-2xl font-black text-black">
                      <Activity className="text-red-600" />
                      Výsledky hráče
                      <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                        {filteredMatches.length}
                      </span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Sezóna {selectedSeasonInfo.fullLabel} • {selectedCompetitionInfo.fullLabel}
                    </p>
                  </div>

                  {filteredMatches.length > 0 ? (
                    <div className="-m-1 max-h-[500px] space-y-3 overflow-y-auto p-1 pr-2">
                      {filteredMatches.map((match, index) => {
                        const matchStats = getPlayerMatchStats(match);
                        const result = getMatchResult(match);
                        const isHomeTeam = isLancersHomeMatch(match);
                        const goalieSaves = match.saves?.[isHomeTeam ? 'home' : 'away'];
                        const statsMissing = player.category === 'goalies'
                          ? !areGoalieStatsComplete(match) || !match.saves
                          : !areSkaterStatsComplete(match);
                        const bgColor = result === 'win' ? 'from-green-50 to-green-100 border-green-300' : 
                                       result === 'loss' ? 'from-red-50 to-red-100 border-red-300' : 
                                       'from-gray-50 to-gray-100 border-gray-300';
                        const iconColor = result === 'win' ? 'text-green-600' : 
                                         result === 'loss' ? 'text-red-600' : 
                                         'text-gray-600';
                        
                        return (
                          <button
                            type="button"
                            key={match.id}
                            className={`group w-full rounded-xl border bg-gradient-to-r p-4 text-left transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 ${bgColor}`}
                            onClick={() => {
                              setSelectedMatch(match);
                              setShowMatchDetail(true);
                            }}
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                                <div className={`${iconColor} mt-0.5 shrink-0 sm:mt-0`} aria-hidden="true">
                                  {result === 'win' ? <CheckCircle size={24} /> : 
                                   result === 'loss' ? <XCircle size={24} /> : 
                                   <Activity size={24} />}
                                </div>
                                <div className="shrink-0 font-bold text-gray-500">
                                  #{filteredMatches.length - index}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-black transition-colors group-hover:text-red-600">
                                    {match.homeTeam} vs {match.awayTeam}
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                                    <Calendar size={14} aria-hidden="true" />
                                    {match.date}
                                    {match.time && <span>• {match.time}</span>}
                                    {match.location && (
                                      <>
                                        <span>•</span>
                                        <MapPin size={14} aria-hidden="true" />
                                        {match.location}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-6">
                                {/* Statistiky hráče */}
                                {statsMissing ? (
                                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                                    Statistiky nedoplněny
                                  </div>
                                ) : player.category !== 'goalies' ? (
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
                                ) : goalieSaves !== undefined ? (
                                  <div className="text-center">
                                    <div className="text-xs font-semibold text-gray-500">Zákroky</div>
                                    <div className="text-xl font-black text-blue-600">{goalieSaves}</div>
                                  </div>
                                ) : (
                                  <div className="rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-xs font-bold text-gray-600">
                                    Zákroky neuvedeny
                                  </div>
                                )}
                                
                                {/* Skóre */}
                                <div className="shrink-0 text-right">
                                  <div className="text-2xl font-black text-black">{match.score}</div>
                                  <div className="text-sm font-semibold text-gray-600">{match.category}</div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                      <Calendar className="mx-auto mb-3 text-gray-400" size={30} aria-hidden="true" />
                      <p className="font-bold text-gray-800">
                        {seasonMatches.length === 0
                          ? `${player.name} nemá v sezóně ${selectedSeasonInfo.fullLabel} evidovaný zápas.`
                          : `${player.name} nemá v sezóně ${selectedSeasonInfo.fullLabel} evidovaný zápas v kategorii „${selectedCompetitionInfo.fullLabel}“.`}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Jakmile zápas doplníme do databáze, objeví se zde automaticky.
                      </p>
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
