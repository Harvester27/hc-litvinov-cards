"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ChevronLeft, CheckCircle, Users, Calendar, MapPin } from 'lucide-react';

/**
 * Aktivita - Zahrát si přáteláček
 * Zlepšuje soudržnost týmu a přináší kredity
 */
export default function FriendlyMatchActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [matchInProgress, setMatchInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Seznam možných soupeřů
  const opponents = [
    {
      id: 1,
      name: "HC Verva Litvínov B",
      difficulty: "Snadný",
      color: "text-green-400",
      reward: 500,
      icon: "🟢"
    },
    {
      id: 2,
      name: "SK Kadaň",
      difficulty: "Střední",
      color: "text-yellow-400",
      reward: 1000,
      icon: "🟡"
    },
    {
      id: 3,
      name: "HC Chomutov",
      difficulty: "Těžký",
      color: "text-red-400",
      reward: 2000,
      icon: "🔴"
    }
  ];

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
  };

  const handleStartMatch = () => {
    setMatchInProgress(true);
    setProgress(0);
    setShowResult(false);

    // Simulace zápasu - progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Náhodný výsledek (80% šance na výhru pro lehčí soupeře)
          const winChance = selectedOpponent.id === 1 ? 0.8 : selectedOpponent.id === 2 ? 0.6 : 0.4;
          const won = Math.random() < winChance;
          const ourGoals = won ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2) + 1;
          const theirGoals = won ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3;

          setMatchResult({
            won,
            ourGoals,
            theirGoals,
            credits: won ? selectedOpponent.reward : Math.floor(selectedOpponent.reward * 0.3)
          });

          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-blue-900">
      {/* Animované pozadí - hokejové motivy */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            🏒
          </div>
        ))}
      </div>

      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-3xl w-full mx-4
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
            <span className="text-4xl">🏒</span>
            Přátelský zápas
          </h2>
          <div className="w-20" />
        </div>

        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            {!selectedOpponent ? (
              /* Výběr soupeře */
              <div className="space-y-4">
                <div className="text-center py-4">
                  <Trophy className="text-purple-400 mx-auto mb-4 animate-pulse" size={60} />
                  <p className="text-white text-lg mb-2">
                    Vyber si soupeře pro přátelský zápas
                  </p>
                  <p className="text-purple-300 text-sm">
                    Obtížnější soupeři přinášejí větší odměny
                  </p>
                </div>

                <div className="grid gap-3">
                  {opponents.map((opponent) => (
                    <div
                      key={opponent.id}
                      onClick={() => handleSelectOpponent(opponent)}
                      className="bg-black/30 hover:bg-black/50 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105 border border-white/10 hover:border-white/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{opponent.icon}</span>
                          <div>
                            <h3 className="text-white font-bold">{opponent.name}</h3>
                            <p className={`text-sm ${opponent.color}`}>
                              {opponent.difficulty}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold text-lg">
                            {opponent.reward} 💰
                          </p>
                          <p className="text-gray-400 text-xs">při výhře</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !matchInProgress ? (
              /* Potvrzení výběru */
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">{selectedOpponent.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedOpponent.name}
                  </h3>
                  <p className={`text-lg ${selectedOpponent.color} mb-4`}>
                    Obtížnost: {selectedOpponent.difficulty}
                  </p>

                  <div className="bg-black/30 rounded-xl p-4 inline-block">
                    <p className="text-gray-300 text-sm mb-1">Odměna za výhru:</p>
                    <p className="text-yellow-400 font-bold text-2xl">
                      {selectedOpponent.reward} kreditů 💰
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedOpponent(null)}
                    className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
                  >
                    Změnit soupeře
                  </button>
                  <button
                    onClick={handleStartMatch}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Začít zápas! 🏒
                  </button>
                </div>
              </div>
            ) : (
              /* Progress zápasu */
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-6xl mb-4 animate-bounce">🏒</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Zápas probíhá...
                  </h3>
                  <p className="text-purple-300">
                    HC Lancers vs {selectedOpponent.name}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Průběh zápasu</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-200 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-center mt-4">
                    <div className="inline-flex gap-2 text-3xl">
                      {progress > 20 && '🏒'}
                      {progress > 40 && '⚡'}
                      {progress > 60 && '🎯'}
                      {progress > 80 && '🔥'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-6">
              <div className="text-7xl mb-4 animate-bounce">
                {matchResult.won ? '🏆' : '😔'}
              </div>
              <h3 className={`text-3xl font-bold mb-2 ${matchResult.won ? 'text-green-400' : 'text-orange-400'}`}>
                {matchResult.won ? 'Výhra!' : 'Prohra'}
              </h3>
              <div className="text-5xl font-black text-white mb-4">
                {matchResult.ourGoals} : {matchResult.theirGoals}
              </div>
              <p className="text-gray-300">
                HC Lancers vs {selectedOpponent.name}
              </p>
            </div>

            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-4 space-y-3">
              <h4 className="text-yellow-400 font-bold mb-3">
                {matchResult.won ? 'Získané odměny:' : 'Odměna za účast:'}
              </h4>
              <div className="flex justify-between text-white text-lg">
                <span>Kredity</span>
                <span className="text-yellow-400 font-bold">
                  +{matchResult.credits} 💰
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span>Soudržnost týmu</span>
                <span className="text-green-400 font-bold">+2 🤝</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Zkušenosti</span>
                <span className="text-blue-400 font-bold">+3 ⭐</span>
              </div>
              {matchResult.won && (
                <div className="flex justify-between text-white">
                  <span>Morálka</span>
                  <span className="text-green-400 font-bold">+2 😊</span>
                </div>
              )}
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
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
