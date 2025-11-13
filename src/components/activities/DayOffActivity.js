"use client";

import React, { useState, useEffect } from "react";
import { Coffee, ChevronLeft, CheckCircle } from 'lucide-react';

/**
 * Aktivita - Volno
 * Jednoduše posune den dál, dává týmu odpočinek
 */
export default function DayOffActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDayOffTaken, setIsDayOffTaken] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const handleTakeDayOff = () => {
    setIsDayOffTaken(true);
    // Po 2 sekundách automaticky dokončit
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-800 via-slate-700 to-gray-900">
      {/* Animované pozadí - plovoucí elementy */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-5xl animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {i % 4 === 0 ? '☕' : i % 4 === 1 ? '🌙' : i % 4 === 2 ? '😴' : '🛋️'}
          </div>
        ))}
      </div>

      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4
        transform transition-all duration-500 border border-gray-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">☕</span>
            Den volna
          </h2>
          <div className="w-20" />
        </div>

        {/* Obsah */}
        {!isDayOffTaken ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Coffee className="text-gray-400 mx-auto mb-4 animate-pulse" size={80} />
              <h3 className="text-white text-2xl font-bold mb-3">
                Den volna pro tým
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                Dopřej týmu odpočinek a regeneraci
              </p>
              <p className="text-gray-400 text-sm">
                Hráči si odpočinou a den se automaticky posune dál
              </p>
            </div>

            {/* Benefity */}
            <div className="bg-black/30 rounded-xl p-6 space-y-3">
              <h4 className="text-gray-300 font-bold mb-3">Co den volna přináší:</h4>
              <div className="flex justify-between text-white">
                <span>Regenerace týmu</span>
                <span className="text-green-400 font-bold">+1 💪</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Morálka</span>
                <span className="text-green-400 font-bold">+1 😊</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Posun na další den</span>
                <span className="text-blue-400 font-bold">✓</span>
              </div>
            </div>

            <button
              onClick={handleTakeDayOff}
              className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold text-lg rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-xl"
            >
              Vzít si volno
            </button>
          </div>
        ) : (
          /* Den volna probíhá */
          <div className="text-center space-y-6">
            <div className="py-8">
              <div className="text-8xl mb-4 animate-bounce">
                😴
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Tým si odpočívá...
              </h3>
              <p className="text-gray-300 text-lg">
                Regenerace probíhá
              </p>
            </div>

            <div className="flex justify-center gap-2 text-5xl">
              <span className="animate-pulse" style={{ animationDelay: '0s' }}>💤</span>
              <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>💤</span>
              <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>💤</span>
            </div>

            <div className="bg-black/30 rounded-xl p-4">
              <CheckCircle className="text-green-400 mx-auto mb-2" size={48} />
              <p className="text-green-400 font-bold">
                Automaticky pokračuji na další den...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CSS animace */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-40px) rotate(20deg);
            opacity: 0.4;
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
