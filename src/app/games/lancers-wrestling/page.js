'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WrestlingRing3D from '@/components/WrestlingRing3D';
import { 
  ArrowLeft, Trophy, Users, Flame, Award, Star, 
  Zap, Shield, Swords, Target, ChevronRight, Play,
  Volume2, VolumeX, Maximize, Settings
} from 'lucide-react';

export default function LancersWrestlingPage() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Wrestling Ring - Always visible */}
      <div className="absolute inset-0">
        <WrestlingRing3D />
      </div>

      {/* Game UI Overlay */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="bg-gradient-to-br from-black via-red-950 to-black rounded-3xl p-8 max-w-2xl w-full mx-4 border border-red-500/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full mb-4 shadow-lg">
                <span className="text-5xl">🤼</span>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-2">
                LANCERS WRESTLING
              </h1>
              <p className="text-white/80">
                Oficiální wrestling hra HC Litvínov
              </p>
            </div>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Quick Match */}
              <button 
                onClick={() => setShowMenu(false)}
                className="group bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4 hover:border-red-400 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600/30 rounded-lg flex items-center justify-center">
                    <Zap className="text-yellow-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">Rychlý zápas</h3>
                    <p className="text-white/60 text-sm">Okamžitá akce v ringu</p>
                  </div>
                </div>
              </button>

              {/* Tournament */}
              <button className="group bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-4 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-600/30 rounded-lg flex items-center justify-center">
                    <Trophy className="text-yellow-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">Turnaj</h3>
                    <p className="text-white/60 text-sm">Staň se šampionem</p>
                  </div>
                </div>
              </button>

              {/* Career Mode */}
              <button className="group bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600/30 rounded-lg flex items-center justify-center">
                    <Star className="text-purple-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">Kariéra</h3>
                    <p className="text-white/60 text-sm">Od nováčka k legendě</p>
                  </div>
                </div>
              </button>

              {/* Multiplayer */}
              <button className="group bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4 hover:border-green-400 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600/30 rounded-lg flex items-center justify-center">
                    <Users className="text-green-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold">Multiplayer</h3>
                    <p className="text-white/60 text-sm">Hraj s přáteli online</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">25+</div>
                  <div className="text-xs text-white/60">Wrestlerů</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">50+</div>
                  <div className="text-xs text-white/60">Pohybů</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">10</div>
                  <div className="text-xs text-white/60">Arén</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">3D</div>
                  <div className="text-xs text-white/60">Grafika</div>
                </div>
              </div>
            </div>

            {/* Main Play Button */}
            <button 
              onClick={() => setShowMenu(false)}
              className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold py-4 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <Play size={24} />
              <span className="text-xl">VSTOUPIT DO RINGU</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={() => router.push('/games')}
            className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Zpět</span>
          </button>

          {/* Game Title */}
          <div className="bg-black/50 backdrop-blur-sm px-6 py-2 rounded-lg">
            <h2 className="text-white font-bold flex items-center gap-2">
              <span className="text-2xl">🤼</span>
              LANCERS WRESTLING
            </h2>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Game HUD - Visible when not in menu */}
      {!showMenu && (
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              {/* Player 1 */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💪</span>
                </div>
                <div>
                  <div className="text-white font-bold">Litvínov Lancer</div>
                  <div className="bg-gray-800 rounded-full h-3 w-32 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-full w-4/5"></div>
                  </div>
                </div>
              </div>

              {/* VS */}
              <div className="bg-yellow-500 text-black font-black px-4 py-2 rounded-lg">
                VS
              </div>

              {/* Player 2 */}
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-white font-bold text-right">Rival Wrestler</div>
                  <div className="bg-gray-800 rounded-full h-3 w-32 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-400 h-full w-3/5"></div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👊</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
                ÚDER
              </button>
              <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 transition-colors">
                CHVAT
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                OBRANA
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                SPECIÁL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions - Small hint when game starts */}
      {!showMenu && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm animate-pulse">
            🖱️ Použij myš k otáčení ringu | ESC pro menu
          </div>
        </div>
      )}
    </div>
  );
}