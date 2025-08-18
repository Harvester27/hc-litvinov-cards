'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { 
  Gamepad2, Sparkles, Clock, Trophy, Users, TrendingUp, 
  ChevronRight, Rocket, Target, Shield, Zap, Swords, Heart, Dumbbell, Award, Flame 
} from 'lucide-react';

export default function GamesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-6 shadow-lg">
              <Gamepad2 className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Herní sekce
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vítejte v herní sekci HC Litvínov Lancers
            </p>
          </div>

          {/* Games Grid - NYNÍ 3 HRY! */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Lancers Dynasty Game Card */}
            <div 
              onClick={() => router.push('/games/lancers-dynasty')}
              className="group relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
                }} />
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* NEW Badge */}
                <div className="absolute top-6 right-6 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  NOVÉ
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <Trophy className="text-white" size={32} />
                </div>

                {/* Title & Description */}
                <h2 className="text-3xl font-black text-white mb-3">
                  Lancers Dynasty
                </h2>
                <p className="text-white/90 mb-6">
                  Sbírej karty hráčů, buduj svůj tým a staň se nejlepším manažerem!
                </p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Users size={16} />
                    <span>Sbírej všechny hráče</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <TrendingUp size={16} />
                    <span>Vylepšuj svůj tým</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Sparkles size={16} />
                    <span>Otevírej balíčky</span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">HRÁT ZDARMA</span>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Space Odyssey Game Card */}
            <div 
              onClick={() => router.push('/games/space-odyssey')}
              className="group relative bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Animated stars background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 40% 20%, rgba(255, 219, 98, 0.2) 0%, transparent 50%)`
                }} />
                {/* Animated stars */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* HOT Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  HOT 🔥
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <Rocket className="text-white" size={32} />
                </div>

                {/* Title & Description */}
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3">
                  Vesmírná Odysea
                </h2>
                <p className="text-white/90 mb-6">
                  Prozkoumej vesmír s lodí HC Litvínov Starfire a bojuj!
                </p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Target size={16} />
                    <span>Strategické bitvy</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Shield size={16} />
                    <span>Vylepšuj svou loď</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Sparkles size={16} />
                    <span>Epická 3D grafika</span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">HRÁT ZDARMA</span>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* NOVÁ HRA: Lancers Wrestling Game Card */}
            <div 
              onClick={() => router.push('/games/lancers-wrestling')}
              className="group relative bg-gradient-to-br from-black via-red-900 to-black rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Wrestling ring pattern background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `
                    linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.1) 50%, transparent 100%),
                    linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)
                  `
                }} />
                {/* Ring ropes effect */}
                <div className="absolute top-[25%] left-0 right-0 h-[2px] bg-white/10" />
                <div className="absolute top-[50%] left-0 right-0 h-[2px] bg-white/10" />
                <div className="absolute top-[75%] left-0 right-0 h-[2px] bg-white/10" />
                {/* Spotlight effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* FIGHT Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                  FIGHT! 🥊
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <span className="text-4xl">🤼</span>
                </div>

                {/* Title & Description */}
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-3">
                  Lancers Wrestling
                </h2>
                <p className="text-white/90 mb-6">
                  Vstup do ringu a staň se šampionem HC Litvínov Wrestling!
                </p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Dumbbell size={16} />
                    <span>Brutální zápasy</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Award size={16} />
                    <span>Turnajový mód</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Flame size={16} />
                    <span>3D Wrestling ring</span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">HRÁT ZDARMA</span>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Sparkles className="text-gray-400" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Další hry přijdou brzy!
              </h2>
              <p className="text-gray-600 mb-6">
                Pracujeme na dalších skvělých hrách pro fanoušky HC Litvínov.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Sledujte novinky</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 HC Litvínov Lancers
          </p>
        </div>
      </footer>
    </div>
  );
}