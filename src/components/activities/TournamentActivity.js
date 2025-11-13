"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ChevronLeft, CheckCircle, Star, Award, Crown } from 'lucide-react';

/**
 * Aktivita - Zahrát si turnaj
 * Série zápasů s postupně rostoucí obtížností a velkými odměnami
 */
export default function TournamentActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [matchInProgress, setMatchInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tournamentResults, setTournamentResults] = useState([]);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [tournamentActive, setTournamentActive] = useState(false);

  // Definice turnajových kol
  const rounds = [
    { name: "Osmifinále", opponent: "HC Kadaň", difficulty: "Snadný", icon: "🥉", reward: 300 },
    { name: "Čtvrtfinále", opponent: "HC Chomutov", difficulty: "Střední", icon: "🥈", reward: 500 },
    { name: "Semifinále", opponent: "HC Energie", difficulty: "Těžký", icon: "🥇", reward: 800 },
    { name: "FINÁLE", opponent: "HC Sparta Praha", difficulty: "Velmi těžký", icon: "👑", reward: 1500 }
  ];

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const handleStartTournament = () => {
    setTournamentActive(true);
    setCurrentRound(0);
    setTournamentResults([]);
    startRound(0);
  };

  const startRound = (roundIndex) => {
    setMatchInProgress(true);
    setProgress(0);

    // Simulace zápasu
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);

          // Výpočet šance na výhru (klesá s postupem turnaje)
          const winChance = 0.85 - (roundIndex * 0.15);
          const won = Math.random() < winChance;
          const ourGoals = won ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1;
          const theirGoals = won ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;

          const result = {
            round: rounds[roundIndex],
            won,
            ourGoals,
            theirGoals
          };

          setTournamentResults(prev => [...prev, result]);
          setMatchInProgress(false);

          // Pokud prohráli nebo je to poslední kolo, ukázat výsledek
          if (!won || roundIndex === rounds.length - 1) {
            setTimeout(() => setShowFinalResult(true), 1000);
          } else {
            // Pokračovat dalším kolem
            setTimeout(() => {
              setCurrentRound(roundIndex + 1);
              startRound(roundIndex + 1);
            }, 2000);
          }

          return 100;
        }
        return prev + 4;
      });
    }, 150);
  };

  const getTotalReward = () => {
    let credits = 0;
    tournamentResults.forEach(result => {
      if (result.won) {
        credits += result.round.reward;
      }
    });
    return credits;
  };

  const didWinTournament = () => {
    return tournamentResults.length === rounds.length &&
           tournamentResults.every(r => r.won);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900">
      {/* Animované pozadí - trofeje */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-5xl animate-float-trophy"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            🏆
          </div>
        ))}
      </div>

      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto
        transform transition-all duration-500 border border-purple-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            Turnaj
          </h2>
          <div className="w-20" />
        </div>

        {/* Obsah */}
        {!showFinalResult ? (
          <div className="space-y-6">
            {!tournamentActive ? (
              /* Úvodní obrazovka */
              <div className="space-y-6">
                <div className="text-center py-6">
                  <Trophy className="text-yellow-400 mx-auto mb-4 animate-pulse" size={80} />
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Hokejový turnaj
                  </h3>
                  <p className="text-purple-300 text-lg mb-6">
                    Čtyři kola, postupně těžší soupeři, velké odměny!
                  </p>

                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 inline-block mb-6">
                    <p className="text-yellow-400 font-bold text-2xl mb-1">
                      Celková odměna až 3 100 kreditů! 💰
                    </p>
                    <p className="text-yellow-300 text-sm">
                      + bonusové odměny za vítězství v turnaji
                    </p>
                  </div>
                </div>

                {/* Seznam kol */}
                <div className="space-y-3">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <Star className="text-yellow-400" size={20} />
                    Turnajová cesta:
                  </h4>
                  {rounds.map((round, index) => (
                    <div
                      key={index}
                      className="bg-black/30 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{round.icon}</span>
                          <div>
                            <h5 className="text-white font-bold">{round.name}</h5>
                            <p className="text-gray-400 text-sm">vs {round.opponent}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold">
                            +{round.reward} 💰
                          </p>
                          <p className={`text-xs ${
                            round.difficulty === 'Velmi těžký' ? 'text-red-400' :
                            round.difficulty === 'Těžký' ? 'text-orange-400' :
                            round.difficulty === 'Střední' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {round.difficulty}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStartTournament}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl"
                >
                  Zahájit turnaj! 🏆
                </button>
              </div>
            ) : matchInProgress ? (
              /* Probíhající zápas */
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-7xl mb-4 animate-bounce">
                    {rounds[currentRound].icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {rounds[currentRound].name}
                  </h3>
                  <p className="text-purple-300 text-lg mb-4">
                    HC Lancers vs {rounds[currentRound].opponent}
                  </p>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    rounds[currentRound].difficulty === 'Velmi těžký' ? 'bg-red-500/20 text-red-400' :
                    rounds[currentRound].difficulty === 'Těžký' ? 'bg-orange-500/20 text-orange-400' :
                    rounds[currentRound].difficulty === 'Střední' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {rounds[currentRound].difficulty}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Průběh zápasu</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 transition-all duration-200 rounded-full animate-gradient"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-center mt-4 text-4xl">
                    {progress > 25 && '🏒'}
                    {progress > 50 && '⚡'}
                    {progress > 75 && '🔥'}
                  </div>
                </div>

                {/* Aktuální stav turnaje */}
                {tournamentResults.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4">
                    <h4 className="text-white font-bold mb-2">Dosavadní výsledky:</h4>
                    <div className="space-y-1">
                      {tournamentResults.map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">
                            {result.round.name}: {result.ourGoals}:{result.theirGoals}
                          </span>
                          <span className={result.won ? 'text-green-400' : 'text-red-400'}>
                            {result.won ? '✓ Výhra' : '✗ Prohra'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mezi koly */
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">
                  {tournamentResults[currentRound - 1]?.won ? '✓' : '✗'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  tournamentResults[currentRound - 1]?.won ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tournamentResults[currentRound - 1]?.won ? 'Postup!' : 'Konec turnaje'}
                </h3>
                <p className="text-gray-300">Připravuji další kolo...</p>
              </div>
            )}
          </div>
        ) : (
          /* Finální výsledek */
          <div className="text-center space-y-6">
            <div className="py-6">
              <div className="text-8xl mb-4 animate-bounce">
                {didWinTournament() ? '👑' : tournamentResults.length >= 3 ? '🥉' : tournamentResults.length >= 2 ? '🥈' : '😔'}
              </div>
              <h3 className={`text-4xl font-bold mb-3 ${
                didWinTournament() ? 'text-yellow-400' : 'text-purple-400'
              }`}>
                {didWinTournament() ? 'Vítěz turnaje!' : `Vyřazeni v ${rounds[currentRound]?.name || 'prvním kole'}`}
              </h3>
              {didWinTournament() && (
                <p className="text-yellow-300 text-xl mb-4 animate-pulse">
                  🎉 GRATULUJEME! 🎉
                </p>
              )}
            </div>

            {/* Přehled výsledků */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-white font-bold mb-3">Výsledky zápasů:</h4>
              {tournamentResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <div className="text-left">
                    <span className="text-white font-bold">{result.round.name}</span>
                    <p className="text-gray-400 text-sm">vs {result.round.opponent}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-white font-bold text-lg">
                      {result.ourGoals}:{result.theirGoals}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                      {result.won ? '✓ Výhra' : '✗ Prohra'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Odměny */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6 space-y-3">
              <h4 className="text-yellow-400 font-bold text-xl mb-3">
                {didWinTournament() ? '🏆 Získané odměny - ŠAMPIONI! 🏆' : '💰 Získané odměny:'}
              </h4>
              <div className="flex justify-between text-white text-xl">
                <span>Kredity celkem</span>
                <span className="text-yellow-400 font-bold">
                  +{getTotalReward()} 💰
                </span>
              </div>
              {didWinTournament() && (
                <>
                  <div className="flex justify-between text-white text-lg">
                    <span>Bonus za vítězství</span>
                    <span className="text-yellow-400 font-bold">+1000 💰</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Prestižní trofej</span>
                    <span className="text-yellow-400 font-bold">🏆</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-white">
                <span>Zkušenosti týmu</span>
                <span className="text-blue-400 font-bold">+{tournamentResults.length * 2} ⭐</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Soudržnost</span>
                <span className="text-green-400 font-bold">+3 🤝</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Morálka</span>
                <span className={`font-bold ${didWinTournament() ? 'text-green-400' : 'text-yellow-400'}`}>
                  +{didWinTournament() ? '5' : '2'} 😊
                </span>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Dokončit aktivitu
            </button>
          </div>
        )}
      </div>

      {/* CSS animace */}
      <style jsx>{`
        @keyframes float-trophy {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px) rotate(180deg) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float-trophy {
          animation: float-trophy linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
