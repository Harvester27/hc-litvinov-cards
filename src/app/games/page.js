'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { 
  Gamepad2, Sparkles, Clock, Trophy, Users, TrendingUp, 
  ChevronRight, Rocket, Target, Shield, Zap, Swords, Heart, 
  Dumbbell, Award, Flame, Lock, X, Eye, EyeOff, AlertCircle, CheckCircle
} from 'lucide-react';

export default function GamesPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Správné heslo pro všechny hry
  const GAME_PASSWORD = '1234567';

  // Funkce pro otevření modalu s heslem
  const handleGameClick = (gameUrl, gameName) => {
    setSelectedGame({ url: gameUrl, name: gameName });
    setShowPasswordModal(true);
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  // Funkce pro ověření hesla
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    // Simulace kontroly (můžeš později nahradit API voláním)
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === GAME_PASSWORD) {
      // Správné heslo - přesměruj na hru
      setIsChecking(false);
      setShowPasswordModal(false);
      router.push(selectedGame.url);
    } else {
      // Špatné heslo
      setError('Nesprávné heslo. Zkuste to znovu.');
      setIsChecking(false);
      setPassword('');
    }
  };

  // Funkce pro zavření modalu
  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
    setSelectedGame(null);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-slideUp">
            
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="text-white" size={36} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Zadejte heslo pro vstup
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Pro spuštění hry <span className="font-semibold text-red-600">{selectedGame?.name}</span> je vyžadováno heslo
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="text-red-600" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Password form */}
            <form onSubmit={handlePasswordSubmit}>
              <div className="relative mb-6">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Zadejte heslo"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-lg"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  disabled={!password || isChecking}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Ověřuji...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Potvrdit</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Hint */}
            <div className="mt-6 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                💡 Heslo získáte od správce nebo na oficiálních stránkách HC Litvínov
              </p>
            </div>
          </div>
        </div>
      )}
      
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
            {/* Lock info */}
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-full text-sm">
              <Lock size={16} />
              <span>Hry jsou chráněny heslem</span>
            </div>
          </div>

          {/* Games Grid - NYNÍ 3 HRY! */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Lancers Dynasty Game Card */}
            <div 
              onClick={() => handleGameClick('/games/lancers-dynasty', 'Lancers Dynasty')}
              className="group relative bg-gradient-to-br from-red-600 to-red-800 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Lock icon overlay */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={16} />
              </div>

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
              onClick={() => handleGameClick('/games/space-odyssey', 'Vesmírná Odysea')}
              className="group relative bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Lock icon overlay */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={16} />
              </div>

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

            {/* NOVÁ HRA: Lancers Bowling Game Card */}
            <div 
              onClick={() => handleGameClick('/games/lancers-bowling', 'Lancers Bowling')}
              className="group relative bg-gradient-to-br from-amber-900 via-amber-700 to-amber-900 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Lock icon overlay */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={16} />
              </div>

              {/* Bowling lane pattern background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `
                    linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.1) 21%, rgba(255,255,255,0.1) 22%, transparent 23%,
                                          transparent 47%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.1) 52%, transparent 53%,
                                          transparent 77%, rgba(255,255,255,0.1) 78%, rgba(255,255,255,0.1) 79%, transparent 80%)
                  `
                }} />
                {/* Bowling pins pattern */}
                <div className="absolute bottom-4 right-4 opacity-20">
                  <div className="text-6xl">🎳</div>
                </div>
                {/* Ball effect */}
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-red-600/20 rounded-full blur-2xl animate-pulse" />
              </div>

              {/* Content */}
              <div className="relative p-8">
                {/* STRIKE Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                  STRIKE! 🎳
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <span className="text-4xl">🎳</span>
                </div>

                {/* Title & Description */}
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 mb-3">
                  Lancers Bowling
                </h2>
                <p className="text-white/90 mb-6">
                  Zamiř, hoď a sraz všechny kuželky v 3D bowlingu!
                </p>

                {/* Features */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Target size={16} />
                    <span>Realistická fyzika</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Trophy size={16} />
                    <span>10 framů výzvy</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Zap size={16} />
                    <span>Spin a efekty</span>
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-shake { animation: shake 0.5s ease-out; }
      `}</style>
    </div>
  );
}