"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ChevronLeft, Users, Star } from 'lucide-react';
import PreMatchScreen from './match/PreMatchScreen';
import MatchSimulation from './match/MatchSimulation';

/**
 * Aktivita - Zahrát si přáteláček
 * Fáze 1: Výběr soupeře
 * Fáze 2: Předzápasová obrazovka (výběr 11 hráčů)
 * Fáze 3: Zápasová simulace
 */
export default function FriendlyMatchActivity({ onComplete, onBack, myCollection = [], credits = 0 }) {
  const [phase, setPhase] = useState(1); // 1 = výběr soupeře, 2 = předzápas, 3 = zápas
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Definice 4 týmů
  const opponents = [
    {
      id: 1,
      name: "Krasobruslaři Chomutov",
      city: "Chomutov",
      logo: "⛸️",
      color: "from-cyan-500 to-blue-600",
      difficulty: "Střední",
      teamOverall: 68,
      description: "Technický tým s dobrým bruslením"
    },
    {
      id: 2,
      name: "Fotbalisti Chomutov",
      city: "Chomutov",
      logo: "⚽",
      color: "from-green-500 to-emerald-600",
      difficulty: "Snadný",
      teamOverall: 62,
      description: "Fotbalisti na ledě - slabší tým"
    },
    {
      id: 3,
      name: "Dřevorubci Louny",
      city: "Louny",
      logo: "🪓",
      color: "from-orange-500 to-red-600",
      difficulty: "Těžký",
      teamOverall: 74,
      description: "Fyzický a agresivní styl hry"
    },
    {
      id: 4,
      name: "Trolové Jirkov",
      city: "Jirkov",
      logo: "👹",
      color: "from-purple-500 to-pink-600",
      difficulty: "Velmi těžký",
      teamOverall: 78,
      description: "Nejsilnější soupeř s výbornou obranou"
    }
  ];

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
    // Po výběru soupeře jdeme na předzápasovou obrazovku
    setTimeout(() => {
      setPhase(2);
    }, 500);
  };

  const handleTeamSelected = (players) => {
    setSelectedPlayers(players);
    // Po výběru sestavy jdeme na zápas
    setTimeout(() => {
      setPhase(3);
    }, 500);
  };

  const handleMatchEnd = (matchResult) => {
    // Po skončení zápasu dokončíme aktivitu
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  // Fáze 2: Předzápasová obrazovka
  if (phase === 2) {
    return (
      <PreMatchScreen
        opponent={selectedOpponent}
        myCollection={myCollection}
        credits={credits}
        onTeamSelected={handleTeamSelected}
        onBack={() => setPhase(1)}
        onGoToPacks={onBack} // Pro přechod na nákup balíčků
      />
    );
  }

  // Fáze 3: Zápasová simulace
  if (phase === 3) {
    return (
      <MatchSimulation
        opponent={selectedOpponent}
        myPlayers={selectedPlayers}
        onMatchEnd={handleMatchEnd}
      />
    );
  }

  // Fáze 1: Výběr soupeře
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Animované pozadí */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-float-hockey"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            🏒
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
            <span className="text-4xl">🏒</span>
            Přátelský zápas
          </h2>
          <div className="w-20" />
        </div>

        {/* Úvodní text */}
        <div className="text-center py-6 mb-6">
          <Trophy className="text-yellow-400 mx-auto mb-4 animate-pulse" size={64} />
          <h3 className="text-3xl font-bold text-white mb-3">
            Vyber si soupeře
          </h3>
          <p className="text-purple-300 text-lg">
            Vyber si tým, proti kterému chceš hrát přátelský zápas
          </p>
        </div>

        {/* Seznam soupeřů */}
        <div className="grid md:grid-cols-2 gap-4">
          {opponents.map((opponent) => (
            <div
              key={opponent.id}
              onClick={() => handleSelectOpponent(opponent)}
              className={`
                bg-gradient-to-br ${opponent.color} rounded-xl p-6 cursor-pointer
                transition-all transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-xl
                ${selectedOpponent?.id === opponent.id ? 'ring-4 ring-yellow-400' : ''}
              `}
            >
              {/* Logo a název */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{opponent.logo}</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-1">
                    {opponent.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {opponent.city}
                  </p>
                </div>
              </div>

              {/* Popis */}
              <p className="text-white/90 text-sm mb-4">
                {opponent.description}
              </p>

              {/* Statistiky */}
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                <div>
                  <p className="text-white/70 text-xs mb-1">Obtížnost</p>
                  <p className={`font-bold ${
                    opponent.difficulty === 'Snadný' ? 'text-green-400' :
                    opponent.difficulty === 'Střední' ? 'text-yellow-400' :
                    opponent.difficulty === 'Těžký' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {opponent.difficulty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">Síla týmu</p>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={16} fill="currentColor" />
                    <span className="text-white font-bold text-lg">
                      {opponent.teamOverall}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hint */}
              <div className="mt-3 text-center">
                <p className="text-white/60 text-xs">
                  Klikni pro výběr →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animace */}
      <style jsx>{`
        @keyframes float-hockey {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px) rotate(360deg);
            opacity: 0.5;
          }
        }

        .animate-float-hockey {
          animation: float-hockey ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
