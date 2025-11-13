"use client";

import React, { useState, useEffect } from "react";
import { Target, ChevronLeft, CheckCircle, Star, Zap, Clock, Award } from 'lucide-react';

/**
 * Aktivita - Sezónní výzvy
 * Speciální týdenní a měsíční výzvy s velkými odměnami
 */
export default function SeasonalChallengesActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeInProgress, setChallengeInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Definice sezónních výzev
  const challenges = [
    {
      id: 1,
      name: "Hattrick mistr",
      description: "Dej 3 góly v jednom zápase",
      difficulty: "Střední",
      timeLimit: "Týdenní",
      icon: "🎯",
      color: "from-blue-500 to-cyan-600",
      reward: {
        credits: 1200,
        specialCard: false,
        bonus: "Speciální odznak"
      },
      successChance: 0.65
    },
    {
      id: 2,
      name: "Sériový vítěz",
      description: "Vyhraj 3 zápasy v řadě",
      difficulty: "Těžký",
      timeLimit: "Týdenní",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      reward: {
        credits: 1800,
        specialCard: true,
        bonus: "Zlatá karta"
      },
      successChance: 0.5
    },
    {
      id: 3,
      name: "Nula vzadu",
      description: "Udrž čisté konto ve 2 zápasech",
      difficulty: "Střední",
      timeLimit: "Týdenní",
      icon: "🛡️",
      color: "from-green-500 to-emerald-600",
      reward: {
        credits: 1000,
        specialCard: false,
        bonus: "+5 obrana týmu"
      },
      successChance: 0.7
    },
    {
      id: 4,
      name: "Měsíční šampion",
      description: "Získej 50 bodů během měsíce",
      difficulty: "Velmi těžký",
      timeLimit: "Měsíční",
      icon: "👑",
      color: "from-purple-500 to-pink-600",
      reward: {
        credits: 3500,
        specialCard: true,
        bonus: "Legendární karta + Trofej"
      },
      successChance: 0.4
    },
    {
      id: 5,
      name: "Rychlé góly",
      description: "Dej gól v prvních 5 minutách 3x",
      difficulty: "Těžký",
      timeLimit: "Týdenní",
      icon: "⚡",
      color: "from-yellow-500 to-orange-600",
      reward: {
        credits: 1500,
        specialCard: false,
        bonus: "+3 rychlost týmu"
      },
      successChance: 0.55
    },
    {
      id: 6,
      name: "Dokonalý týden",
      description: "Vyhraj všechny zápasy týdne (min. 5)",
      difficulty: "Velmi těžký",
      timeLimit: "Týdenní",
      icon: "💎",
      color: "from-cyan-500 to-blue-600",
      reward: {
        credits: 2500,
        specialCard: true,
        bonus: "Diamantová karta"
      },
      successChance: 0.35
    }
  ];

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleStartChallenge = () => {
    setChallengeInProgress(true);
    setProgress(0);
    setShowResult(false);

    // Simulace výzvy - progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);

          // Určit úspěch podle šance
          const success = Math.random() < selectedChallenge.successChance;
          setChallengeCompleted(success);

          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        return prev + 3;
      });
    }, 180);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Snadný': return 'text-green-400 bg-green-500/20';
      case 'Střední': return 'text-yellow-400 bg-yellow-500/20';
      case 'Těžký': return 'text-orange-400 bg-orange-500/20';
      case 'Velmi těžký': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTimeLimitColor = (timeLimit) => {
    return timeLimit === 'Měsíční' ? 'text-purple-400' : 'text-blue-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
      {/* Animované pozadí - hvězdy a cíle */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '🎯' : '💫'}
          </div>
        ))}
      </div>

      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto
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
            <span className="text-4xl">🎯</span>
            Sezónní výzvy
          </h2>
          <div className="w-20" />
        </div>

        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            {!selectedChallenge ? (
              /* Výběr výzvy */
              <div className="space-y-4">
                <div className="text-center py-4">
                  <Target className="text-purple-400 mx-auto mb-4 animate-pulse" size={60} />
                  <p className="text-white text-xl mb-2">
                    Vyber si sezónní výzvu
                  </p>
                  <p className="text-purple-300 text-sm">
                    Splň výzvu a získej exkluzivní odměny!
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      onClick={() => handleSelectChallenge(challenge)}
                      className={`bg-gradient-to-br ${challenge.color} rounded-xl p-5 cursor-pointer transition-all transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-xl`}
                    >
                      {/* Ikona a název */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-5xl">{challenge.icon}</span>
                          <div>
                            <h3 className="text-white font-bold text-lg">
                              {challenge.name}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Detaily */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <span className={`px-3 py-1 bg-black/30 rounded-full text-xs font-bold ${getTimeLimitColor(challenge.timeLimit)}`}>
                          <Clock size={12} className="inline mr-1" />
                          {challenge.timeLimit}
                        </span>
                      </div>

                      {/* Odměna */}
                      <div className="bg-black/30 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80 text-sm">Kredity:</span>
                          <span className="text-yellow-400 font-bold">
                            +{challenge.reward.credits} 💰
                          </span>
                        </div>
                        {challenge.reward.specialCard && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/80 text-sm">Speciální karta:</span>
                            <span className="text-purple-400 font-bold text-sm">✓</span>
                          </div>
                        )}
                        <div className="text-cyan-400 text-xs mt-2">
                          🎁 {challenge.reward.bonus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !challengeInProgress ? (
              /* Potvrzení výběru */
              <div className="space-y-6">
                <div className={`bg-gradient-to-br ${selectedChallenge.color} rounded-2xl p-8 text-center`}>
                  <div className="text-8xl mb-4">{selectedChallenge.icon}</div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {selectedChallenge.name}
                  </h3>
                  <p className="text-white/90 text-lg mb-4">
                    {selectedChallenge.description}
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full font-bold ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                      {selectedChallenge.difficulty}
                    </span>
                    <span className={`px-4 py-2 bg-black/30 rounded-full font-bold ${getTimeLimitColor(selectedChallenge.timeLimit)}`}>
                      <Clock size={16} className="inline mr-1" />
                      {selectedChallenge.timeLimit}
                    </span>
                  </div>
                </div>

                {/* Detailní odměny */}
                <div className="bg-black/30 border border-yellow-400/30 rounded-xl p-6">
                  <h4 className="text-yellow-400 font-bold text-xl mb-4 flex items-center gap-2">
                    <Award size={24} />
                    Odměny za splnění:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-white">Kredity</span>
                      <span className="text-yellow-400 font-bold">
                        +{selectedChallenge.reward.credits} 💰
                      </span>
                    </div>
                    {selectedChallenge.reward.specialCard && (
                      <div className="flex justify-between items-center">
                        <span className="text-white">Speciální karta</span>
                        <span className="text-purple-400 font-bold">
                          ✓ Zaručena
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-white">Bonus</span>
                      <span className="text-cyan-400 font-bold">
                        {selectedChallenge.reward.bonus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">XP</span>
                      <span className="text-blue-400 font-bold">
                        +{selectedChallenge.difficulty === 'Velmi těžký' ? 100 : selectedChallenge.difficulty === 'Těžký' ? 75 : 50} ⭐
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
                  >
                    Změnit výzvu
                  </button>
                  <button
                    onClick={handleStartChallenge}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Přijmout výzvu! 🎯
                  </button>
                </div>
              </div>
            ) : (
              /* Progress výzvy */
              <div className="space-y-6">
                <div className={`bg-gradient-to-br ${selectedChallenge.color} rounded-2xl p-8 text-center`}>
                  <div className="text-7xl mb-4 animate-bounce">
                    {selectedChallenge.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Výzva probíhá...
                  </h3>
                  <p className="text-white/90 text-lg">
                    {selectedChallenge.name}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-purple-300">
                    <span>Postup</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-6 overflow-hidden border border-purple-400/30">
                    <div
                      className={`h-full bg-gradient-to-r ${selectedChallenge.color} transition-all duration-200 rounded-full relative overflow-hidden`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                  </div>

                  <div className="text-center mt-6 space-y-2">
                    <div className="text-5xl">
                      {progress > 25 && '💪'}
                      {progress > 50 && '🔥'}
                      {progress > 75 && '⚡'}
                      {progress > 90 && '✨'}
                    </div>
                    <p className="text-white/60 text-sm">
                      {progress < 30 ? 'Začínáme...' :
                       progress < 60 ? 'Dobrá práce!' :
                       progress < 90 ? 'Skoro tam!' :
                       'Poslední úsilí!'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className={`bg-gradient-to-br ${selectedChallenge.color} rounded-2xl p-8`}>
              <div className="text-9xl mb-4 animate-bounce">
                {challengeCompleted ? '🏆' : '💪'}
              </div>
              <h3 className={`text-4xl font-bold mb-3 ${
                challengeCompleted ? 'text-yellow-400' : 'text-orange-400'
              }`}>
                {challengeCompleted ? 'Výzva splněna!' : 'Téměř úspěch!'}
              </h3>
              <p className="text-white text-xl">
                {selectedChallenge.name}
              </p>
            </div>

            {/* Odměny */}
            <div className={`border rounded-xl p-6 space-y-3 ${
              challengeCompleted
                ? 'bg-yellow-500/10 border-yellow-400/30'
                : 'bg-orange-500/10 border-orange-400/30'
            }`}>
              <h4 className={`font-bold text-xl mb-4 ${
                challengeCompleted ? 'text-yellow-400' : 'text-orange-400'
              }`}>
                {challengeCompleted ? '🎉 Získané odměny:' : '💪 Odměna za pokus:'}
              </h4>

              <div className="flex justify-between text-white text-lg">
                <span>Kredity</span>
                <span className="text-yellow-400 font-bold">
                  +{challengeCompleted ? selectedChallenge.reward.credits : Math.floor(selectedChallenge.reward.credits * 0.2)} 💰
                </span>
              </div>

              {challengeCompleted && selectedChallenge.reward.specialCard && (
                <div className="flex justify-between text-white">
                  <span>Speciální karta</span>
                  <span className="text-purple-400 font-bold">✓ Odemčena!</span>
                </div>
              )}

              {challengeCompleted && (
                <div className="flex justify-between text-white">
                  <span>Bonus</span>
                  <span className="text-cyan-400 font-bold">
                    {selectedChallenge.reward.bonus}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-white">
                <span>XP</span>
                <span className="text-blue-400 font-bold">
                  +{challengeCompleted
                    ? (selectedChallenge.difficulty === 'Velmi těžký' ? 100 :
                       selectedChallenge.difficulty === 'Těžký' ? 75 : 50)
                    : 20
                  } ⭐
                </span>
              </div>

              <div className="flex justify-between text-white">
                <span>Soudržnost týmu</span>
                <span className="text-green-400 font-bold">
                  +{challengeCompleted ? 3 : 1} 🤝
                </span>
              </div>
            </div>

            {!challengeCompleted && (
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                  💡 Nevadí! Zkus to znovu příště. Každý pokus tě posílá!
                </p>
              </div>
            )}

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
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
