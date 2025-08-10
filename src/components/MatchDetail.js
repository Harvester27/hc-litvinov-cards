'use client';

import React from 'react';
import { X } from 'lucide-react';
import { getPlayerByName } from '@/data/playerData';
import Link from 'next/link';

export default function MatchDetail({ match, isOpen, onClose }) {
  if (!isOpen || !match) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Detail zápasu</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X size={28} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Header info */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">
              {match.date} {match.time} • {match.location}
            </div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full inline-block font-bold mb-4">
              {match.category}
            </div>
            <div className="text-4xl font-black mb-2">
              {match.homeTeam} - {match.awayTeam}
            </div>
            <div className="text-5xl font-black text-red-600 mb-1">
              {match.score}
            </div>
            <div className="text-xl text-gray-600">{match.periods}</div>
          </div>

          {/* Saves */}
          {match.saves && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="text-center font-bold text-gray-700 mb-2">Zásahy brankářů</div>
              <div className="flex justify-center gap-8 text-2xl font-black">
                <span>{match.saves.home}</span>
                <span className="text-gray-400">:</span>
                <span>{match.saves.away}</span>
              </div>
            </div>
          )}

          {/* Lineups */}
          {match.homeLineup && match.awayLineup && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3">Sestava {match.homeTeam}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Brankář:</span>{' '}
                    {renderPlayerName(match.homeLineup.goalie)}
                  </div>
                  {match.homeLineup.line1 && (
                    <div>
                      <span className="text-gray-500">1. řada:</span>{' '}
                      {match.homeLineup.line1.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.homeLineup.line2 && (
                    <div>
                      <span className="text-gray-500">2. řada:</span>{' '}
                      {match.homeLineup.line2.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.homeLineup.line3 && (
                    <div>
                      <span className="text-gray-500">3. řada:</span>{' '}
                      {match.homeLineup.line3.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <h3 className="font-bold text-lg mb-3">Sestava {match.awayTeam}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Brankář:</span>{' '}
                    {renderPlayerName(match.awayLineup.goalie)}
                  </div>
                  {match.awayLineup.line1 && (
                    <div>
                      <span className="text-gray-500">1. řada:</span>{' '}
                      {match.awayLineup.line1.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.awayLineup.line2 && (
                    <div>
                      <span className="text-gray-500">2. řada:</span>{' '}
                      {match.awayLineup.line2.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.awayLineup.line3 && (
                    <div>
                      <span className="text-gray-500">3. řada:</span>{' '}
                      {match.awayLineup.line3.map((player, index) => (
                        <span key={index}>
                          {index > 0 && ', '}
                          {renderPlayerName(player)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Goals */}
          {match.goals && match.goals.length > 0 && (
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-lg mb-3">Góly</h3>
              <div className="space-y-2">
                {match.goals.map((goal, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded ${
                      goal.team === 'away' ? 'bg-red-100' : 'bg-white'
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
                        <div key={index} className="text-sm bg-white p-2 rounded">
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
                        <div key={index} className="text-sm bg-red-50 p-2 rounded">
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
              <p className="text-gray-700">{match.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}