"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle, Moon, Sun } from 'lucide-react';

/**
 * Aktivita - Extra spánek
 * Regenerace a odpočinek týmu
 */
export default function ExtraSleepActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [dreamPhase, setDreamPhase] = useState(0);
  
  const dreams = ['🏒', '🏆', '🥅', '⭐', '🎯'];
  
  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  const handleStartSleeping = () => {
    setIsSleeping(true);
    setShowResult(false);
    setSleepProgress(0);
    setDreamPhase(0);
    
    // Simulace spánku
    const interval = setInterval(() => {
      setSleepProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSleeping(false);
          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
    
    // Změna snů
    const dreamInterval = setInterval(() => {
      setDreamPhase(prev => {
        if (sleepProgress >= 100) {
          clearInterval(dreamInterval);
          return prev;
        }
        return (prev + 1) % dreams.length;
      });
    }, 800);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* Animované pozadí - hvězdy */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Měsíc */}
        {isSleeping && (
          <div className="absolute top-10 right-10 text-8xl animate-pulse opacity-50">
            🌙
          </div>
        )}
      </div>
      
      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4
        transform transition-all duration-500 border border-indigo-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">😴</span>
            Extra spánek
          </h2>
          <div className="w-20" />
        </div>
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className={`text-6xl mb-4 inline-block transition-all ${
                isSleeping ? 'animate-pulse' : ''
              }`}>
                {isSleeping ? '😴' : '🛏️'}
              </div>
              <p className="text-white text-lg mb-2">
                Dopřej týmu kvalitní odpočinek
              </p>
              <p className="text-indigo-300 text-sm">
                Regenerace je klíčová pro výkon
              </p>
            </div>
            
            {/* Progress spánku */}
            {isSleeping && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-indigo-300">
                  <span>Spánek v průběhu...</span>
                  <span>{sleepProgress}%</span>
                </div>
                <div className="w-full bg-indigo-900/50 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${sleepProgress}%` }}
                  />
                </div>
                
                {/* Sny */}
                <div className="text-center">
                  <p className="text-indigo-300 text-sm mb-2">Hráči sní o...</p>
                  <div className="text-4xl animate-pulse transition-all duration-500">
                    {dreams[dreamPhase]}
                  </div>
                </div>
                
                {/* Z-z-z animace */}
                <div className="text-center text-2xl text-indigo-400">
                  {'Z'.repeat(Math.min(Math.floor(sleepProgress / 25) + 1, 4))}
                  {sleepProgress < 100 && <span className="animate-pulse">...</span>}
                </div>
              </div>
            )}
            
            {/* Tlačítko start */}
            {!isSleeping && sleepProgress === 0 && (
              <button
                onClick={handleStartSleeping}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3"
              >
                <Moon size={24} />
                <span>Jít spát</span>
              </button>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-8">
              <Sun className="text-yellow-400 mx-auto mb-4 animate-bounce" size={80} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Dobré ráno!
              </h3>
              <p className="text-green-400 text-lg">
                Tým je odpočatý a připravený
              </p>
            </div>
            
            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-yellow-400 font-bold mb-3">Získané benefity:</h4>
              <div className="flex justify-between text-white">
                <span>Regenerace</span>
                <span className="text-green-400 font-bold">+3 💪</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Morálka týmu</span>
                <span className="text-green-400 font-bold">+2 😊</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Energie</span>
                <span className="text-green-400 font-bold">+100% ⚡</span>
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
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}