"use client";

import React, { useState, useEffect } from "react";
import { Waves, ChevronLeft, CheckCircle, Users } from 'lucide-react';

/**
 * Aktivita - Jít plavat (verze pro 2 hráče)
 * Zlepšuje kondici a regeneraci týmu
 */
export default function SwimmingActivityPlayer2({ 
  onComplete, 
  onBack, 
  withPlayer = null // Info o spoluhráči
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [partnerComment, setPartnerComment] = useState('');
  
  const partnerComments = [
    "Skvělý tempo! 💪",
    "Ještě pár bazénů!",
    "Makáme spolu dobře!",
    "Tohle nám pomůže v zápase!",
    "Super trénink!"
  ];
  
  useEffect(() => {
    // Spustit animaci po načtení
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  const handleStartSwimming = () => {
    setProgress(0);
    setShowResult(false);
    setPartnerComment('');
    
    // Simulace plavání - progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowResult(true), 500);
          return 100;
        }
        
        // Partner komentáře během plavání
        if (prev === 30 || prev === 60 || prev === 80) {
          setPartnerComment(partnerComments[Math.floor(Math.random() * partnerComments.length)]);
          setTimeout(() => setPartnerComment(''), 2000);
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
          <div className="w-20" />
        </div>
        
        {/* Info o partnerovi */}
        {withPlayer && (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 mb-6 border border-green-500/30">
            <div className="flex items-center justify-center gap-2 text-green-300">
              <Users size={20} />
              <span className="font-bold">Plaveš společně s {withPlayer.name}!</span>
            </div>
          </div>
        )}
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="flex justify-center gap-4">
                <Waves className="text-blue-400 animate-pulse" size={60} />
                {withPlayer && (
                  <Waves className="text-cyan-400 animate-pulse" size={60} style={{ animationDelay: '0.5s' }} />
                )}
              </div>
              <p className="text-white text-lg mb-2 mt-4">
                {withPlayer 
                  ? "Společné plavání zlepší kondici ještě víc!"
                  : "Vezmi tým na bazén pro zlepšení kondice"}
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
                
                {/* Komentář partnera */}
                {partnerComment && withPlayer && (
                  <div className="text-center mt-4 p-2 bg-black/30 rounded-lg">
                    <p className="text-cyan-300 text-sm">
                      <span className="font-bold">{withPlayer.name}:</span> {partnerComment}
                    </p>
                  </div>
                )}
                
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
                Začít plavat {withPlayer ? "společně" : ""}
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
                {withPlayer 
                  ? `Ty a ${withPlayer.name} jste skvěle zaplavali!`
                  : "Tým si skvěle zaplaval"}
              </p>
            </div>
            
            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-yellow-400 font-bold mb-3">
                Získané benefity {withPlayer && "(bonus za společnou aktivitu!)"}:
              </h4>
              <div className="flex justify-between text-white">
                <span>Kondice týmu</span>
                <span className="text-green-400 font-bold">
                  +{withPlayer ? 3 : 2} 🔥
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span>Regenerace</span>
                <span className="text-green-400 font-bold">
                  +{withPlayer ? 2 : 1} 💪
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span>Morálka</span>
                <span className="text-green-400 font-bold">
                  +{withPlayer ? 2 : 1} 😊
                </span>
              </div>
              {withPlayer && (
                <div className="flex justify-between text-white border-t border-gray-600 pt-2 mt-2">
                  <span>Vztah s {withPlayer.name}</span>
                  <span className="text-pink-400 font-bold">+1 ❤️</span>
                </div>
              )}
            </div>
            
            {/* Komentář partnera po dokončení */}
            {withPlayer && (
              <div className="bg-blue-500/20 rounded-lg p-3">
                <p className="text-cyan-300 text-sm italic">
                  &quot;{withPlayer.name}: Díky za pozvání! Bylo to super!&quot;
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