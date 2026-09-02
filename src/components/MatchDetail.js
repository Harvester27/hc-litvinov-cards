'use client';

import React from 'react';
import { X } from 'lucide-react';
import { getPlayerByName } from '@/data/playerData';
import Link from 'next/link';

const isLancersTeam = (teamName) => /lancers/i.test(String(teamName || ''));

const isShootoutGoal = (goal) =>
  goal?.shootout === true || /^sn$/i.test(String(goal?.time || '').trim());

const normalizeShootoutEntries = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.attempts)) return value.attempts;
  if (value && typeof value === 'object') return [value];
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
};

const getShootoutResult = (attempt) => {
  if (!attempt || typeof attempt !== 'object') return '';
  const converted = attempt.scored ?? attempt.converted ?? attempt.result;
  if (converted === true) return 'Proměněno';
  if (converted === false) return 'Neproměněno';

  if (attempt.result !== undefined && attempt.result !== null) {
    return String(attempt.result);
  }
  return '';
};

export default function MatchDetail({ match, isOpen, onClose }) {
  if (!isOpen || !match) return null;

  const lancersSide = isLancersTeam(match.homeTeam)
    ? 'home'
    : isLancersTeam(match.awayTeam)
      ? 'away'
      : null;
  const isLancersSide = (side) => side === lancersSide;
  const goals = Array.isArray(match.goals)
    ? match.goals.filter((goal) => !isShootoutGoal(goal))
    : [];
  const pluralShootouts = normalizeShootoutEntries(match.shootouts);
  const singularShootouts = normalizeShootoutEntries(match.shootout);
  const explicitShootouts = pluralShootouts.length > 0 ? pluralShootouts : singularShootouts;
  const legacyShootouts = Array.isArray(match.goals)
    ? match.goals.filter(isShootoutGoal)
    : [];
  const shootouts = explicitShootouts.length > 0 ? explicitShootouts : legacyShootouts;

  const renderPlayerName = (name) => {
    const player = getPlayerByName(name);
    if (player) {
      return (
        <Link 
          href={`/profil/${player.id}`}
          className="text-blue-600 hover:text-blue-800 font-semibold underline"
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </Link>
      );
    }
    return <span className="font-semibold">{name}</span>;
  };

  const renderPlayerList = (players = []) =>
    players.map((player, index) => (
      <span key={`${player}-${index}`}>
        {index > 0 && ', '}
        {renderPlayerName(player)}
      </span>
    ));

  const LineupCard = ({ team, lineup, highlighted = false }) => {
    const groups = [
      { label: 'Obránci', players: lineup.defenders },
      { label: 'Útočníci', players: lineup.forwards },
      { label: '1. řada', players: lineup.line1 },
      { label: '2. řada', players: lineup.line2 },
      { label: '3. řada', players: lineup.line3 }
    ].filter((group) => group.players?.length);

    return (
      <div className={highlighted ? 'bg-red-50 rounded-xl p-4 border-2 border-red-200' : 'bg-gray-50 rounded-xl p-4'}>
        <h3 className={`font-bold text-lg mb-3 ${highlighted ? 'text-red-700' : ''}`}>
          Sestava {team}
        </h3>
        <div className="space-y-2 text-sm">
          {lineup.goalie && (
            <div>
              <span className="text-gray-500">Brankář:</span>{' '}
              {renderPlayerName(lineup.goalie)}
            </div>
          )}
          {groups.map((group) => (
            <div key={group.label}>
              <span className="text-gray-500">{group.label}:</span>{' '}
              {renderPlayerList(group.players)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Detail zápasu</h2>
            <button type="button" aria-label="Zavřít detail zápasu" onClick={onClose} className="text-white hover:text-gray-200">
              <X size={28} />
            </button>
          </div>
        </div>
        
        <div className="p-6 text-gray-900">
          {/* Header info */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">
              {match.date} {match.time} • {match.location}
            </div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full inline-block font-bold mb-4">
              {match.category}
            </div>
            <div className="text-4xl font-black mb-2">
              <span className={isLancersSide('home') ? 'text-red-600' : ''}>{match.homeTeam}</span>
              {' - '}
              <span className={isLancersSide('away') ? 'text-red-600' : ''}>{match.awayTeam}</span>
            </div>
            <div className="text-5xl font-black text-red-600 mb-1">
              {match.score}
            </div>
            {match.periods && <div className="text-xl text-gray-600">{match.periods}</div>}
            {match.format && (
              <div className="mt-3 inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                {match.format}
              </div>
            )}
          </div>

          {/* Saves */}
          {match.saves && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="text-center font-bold text-gray-700 mb-2">Zásahy brankářů</div>
              <div className="flex justify-center gap-8 text-2xl font-black">
                <span className={isLancersSide('home') ? 'text-red-600' : ''}>{match.saves.home}</span>
                <span className="text-gray-400">:</span>
                <span className={isLancersSide('away') ? 'text-red-600' : ''}>{match.saves.away}</span>
              </div>
            </div>
          )}

          {/* Lineups */}
          {(match.homeLineup || match.awayLineup) && (
            <div className={`grid gap-6 mb-6 ${match.homeLineup && match.awayLineup ? 'md:grid-cols-2' : ''}`}>
              {match.homeLineup && (
                <LineupCard
                  team={match.homeTeam}
                  lineup={match.homeLineup}
                  highlighted={isLancersSide('home')}
                />
              )}
              {match.awayLineup && (
                <LineupCard
                  team={match.awayTeam}
                  lineup={match.awayLineup}
                  highlighted={isLancersSide('away')}
                />
              )}
            </div>
          )}

          {/* Goals */}
          {goals.length > 0 && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg mb-3">Góly</h3>
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded ${
                      isLancersSide(goal.team) ? 'bg-red-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{goal.time}</span>
                      <span className="font-semibold">{goal.scorer}</span>
                      <span className="text-sm text-gray-600">{goal.assists}</span>
                    </div>
                    <span className="font-black text-lg">{goal.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shootouts */}
          {shootouts.length > 0 && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg mb-3">Samostatné nájezdy</h3>
              <div className="space-y-2">
                {shootouts.map((attempt, index) => {
                  const entry = typeof attempt === 'object' && attempt !== null ? attempt : null;
                  const teamSide = entry?.team;
                  const playerName = entry?.player || entry?.scorer;
                  const result = getShootoutResult(entry);
                  const converted = entry?.scored ?? entry?.converted ?? entry?.result;
                  const teamName = teamSide === 'home'
                    ? match.homeTeam
                    : teamSide === 'away'
                      ? match.awayTeam
                      : '';

                  return (
                    <div
                      key={`${playerName || String(attempt)}-${index}`}
                      className={`flex flex-col gap-2 rounded p-2 sm:flex-row sm:items-center sm:justify-between ${
                        isLancersSide(teamSide) ? 'bg-red-100' : 'bg-white'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {entry?.time && <span className="text-sm text-gray-500">{entry.time}</span>}
                        {teamName && <span className="text-sm text-gray-500">{teamName}</span>}
                        {playerName
                          ? renderPlayerName(playerName)
                          : typeof attempt === 'string'
                            ? <span className="font-semibold">{attempt}</span>
                            : null}
                      </div>
                      <div className="flex items-center gap-2">
                        {entry?.score && <span className="font-black text-lg">{entry.score}</span>}
                        {result && (
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            converted === true
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {result}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Penalties */}
          {match.penalties && match.penalties.length > 0 && (
            <div className="bg-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-3">Vyloučení</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">{match.homeTeam}</h4>
                  <div className="space-y-1">
                    {match.penalties
                      .filter(p => p.team === 'home')
                      .map((penalty, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded ${isLancersSide('home') ? 'bg-red-50' : 'bg-white'}`}
                        >
                          <span className="text-gray-500">{penalty.time}</span> {penalty.player} -{' '}
                          {penalty.reason} - {penalty.duration}
                        </div>
                      ))}
                    {match.penalties.filter(p => p.team === 'home').length === 0 && (
                      <div className="text-sm text-gray-400 p-2">Žádná vyloučení</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">{match.awayTeam}</h4>
                  <div className="space-y-1">
                    {match.penalties
                      .filter(p => p.team === 'away')
                      .map((penalty, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded ${isLancersSide('away') ? 'bg-red-50' : 'bg-white'}`}
                        >
                          <span className="text-gray-500">{penalty.time}</span> {penalty.player} -{' '}
                          {penalty.reason} - {penalty.duration}
                        </div>
                      ))}
                    {match.penalties.filter(p => p.team === 'away').length === 0 && (
                      <div className="text-sm text-gray-400 p-2">Žádná vyloučení</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Match summary */}
          {match.summary && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-lg mb-2">Shrnutí zápasu</h3>
              <p className="text-gray-700 leading-relaxed">{match.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
