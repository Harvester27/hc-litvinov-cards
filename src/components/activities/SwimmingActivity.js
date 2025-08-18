"use client";

import React, { useState, useEffect } from "react";
import { Waves, ChevronLeft, CheckCircle } from 'lucide-react';

/**
 * Aktivita - Jít plavat
 * Zlepšuje kondici a regeneraci týmu
 */
export default function SwimmingActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    // Spustit animaci po načtení
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  const handleStartSwimming = () => {
    setProgress(0);
    setShowResult(false);
    
    // Simulace plavání - progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-900">
      {/* Animované pozadí - vlny */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-wave"
            style={{
              bottom: `${i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>
      
      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4
        transform transition-all duration-500 border border-blue-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">🏊‍♂️</span>
            Plavání
          </h2>
          <div className="w-20" /> {/* Spacer */}
        </div>
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Waves className="text-blue-400 mx-auto mb-4 animate-pulse" size={80} />
              <p className="text-white text-lg mb-2">
                Vezmi tým na bazén pro zlepšení kondice
              </p>
              <p className="text-blue-300 text-sm">
                Plavání je skvělé pro regeneraci a vytrvalost
              </p>
            </div>
            
            {/* Progress */}
            {progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-300">
                  <span>Plavání v průběhu...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Animované vlnky během plavání */}
                <div className="text-center mt-4 text-2xl">
                  {'🌊'.repeat(Math.floor(progress / 20))}
                </div>
              </div>
            )}
            
            {/* Tlačítko start */}
            {progress === 0 && (
              <button
                onClick={handleStartSwimming}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-xl"
              >
                Začít plavat
              </button>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-8">
              <CheckCircle className="text-green-400 mx-auto mb-4 animate-bounce" size={80} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Plavání dokončeno!
              </h3>
              <p className="text-green-400 text-lg">
                Tým si skvěle zaplaval
              </p>
            </div>
            
            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-yellow-400 font-bold mb-3">Získané benefity:</h4>
              <div className="flex justify-between text-white">
                <span>Kondice týmu</span>
                <span className="text-green-400 font-bold">+2 🔥</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Regenerace</span>
                <span className="text-green-400 font-bold">+1 💪</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Morálka</span>
                <span className="text-green-400 font-bold">+1 😊</span>
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
        @keyframes wave {
          0%, 100% {
            transform: translateX(-100%) translateY(0);
          }
          50% {
            transform: translateX(100%) translateY(-20px);
          }
        }
        
        .animate-wave {
          animation: wave linear infinite;
        }
      `}</style>
    </div>
  );
}