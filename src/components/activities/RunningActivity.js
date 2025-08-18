"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle, Zap } from 'lucide-react';

/**
 * Aktivita - Jít běhat
 * Zvyšuje rychlost a vytrvalost hráčů
 */
export default function RunningActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const maxDistance = 10; // 10 km
  
  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  const handleStartRunning = () => {
    setIsRunning(true);
    setShowResult(false);
    setDistance(0);
    
    // Simulace běhu
    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev >= maxDistance) {
          clearInterval(interval);
          setIsRunning(false);
          setTimeout(() => setShowResult(true), 500);
          return maxDistance;
        }
        return prev + 0.5;
      });
    }, 200);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-green-900">
      {/* Animované pozadí - běžecká dráha */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-white/20 animate-track"
              style={{
                top: `${i * 5}%`,
                left: '-100%',
                width: '200%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4
        transform transition-all duration-500 border border-green-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">🏃‍♂️</span>
            Běhání
          </h2>
          <div className="w-20" />
        </div>
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className={`text-6xl mb-4 inline-block ${isRunning ? 'animate-bounce' : ''}`}>
                🏃‍♂️
              </div>
              <p className="text-white text-lg mb-2">
                Ranní běh pro zlepšení kondice týmu
              </p>
              <p className="text-green-300 text-sm">
                Cíl: uběhnout {maxDistance} km
              </p>
            </div>
            
            {/* Progress */}
            {distance > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-green-300">
                  <span>Uběhnuto</span>
                  <span>{distance.toFixed(1)} / {maxDistance} km</span>
                </div>
                <div className="w-full bg-green-900/50 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-300 rounded-full relative"
                    style={{ width: `${(distance / maxDistance) * 100}%` }}
                  >
                    {/* Běžící ikona na konci progress baru */}
                    {isRunning && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                        <span className="text-xs animate-pulse">🏃</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Motivační hlášky */}
                <div className="text-center text-white text-sm">
                  {distance < 3 && "Dobrý začátek! 💪"}
                  {distance >= 3 && distance < 6 && "Pokračuj, jde ti to skvěle! 🔥"}
                  {distance >= 6 && distance < 9 && "Už jen kousek! Nezastavuj! ⚡"}
                  {distance >= 9 && distance < 10 && "Finální sprint! 🚀"}
                </div>
              </div>
            )}
            
            {/* Tlačítko start */}
            {!isRunning && distance === 0 && (
              <button
                onClick={handleStartRunning}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-xl"
              >
                Začít běhat
              </button>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-8">
              <CheckCircle className="text-green-400 mx-auto mb-4 animate-bounce" size={80} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Běh dokončen!
              </h3>
              <p className="text-green-400 text-lg">
                Tým uběhl {maxDistance} km! 🏆
              </p>
            </div>
            
            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-yellow-400 font-bold mb-3">Získané benefity:</h4>
              <div className="flex justify-between text-white">
                <span>Rychlost</span>
                <span className="text-green-400 font-bold">+2 ⚡</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Vytrvalost</span>
                <span className="text-green-400 font-bold">+2 🔋</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Kondice</span>
                <span className="text-green-400 font-bold">+1 💪</span>
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
        @keyframes track {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        
        .animate-track {
          animation: track linear infinite;
        }
      `}</style>
    </div>
  );
}