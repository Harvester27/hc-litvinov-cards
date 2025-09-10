'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { getLeaderboardData, getTopPlayers, getPlayerRank } from '@/lib/firebaseLeaderboard';
import { 
  Trophy, Medal, Award, Crown, Star, TrendingUp,
  CreditCard, Package, Brain, Target, Users, 
  Loader, ChevronRight, User, Sparkles, Zap,
  ArrowUp, ArrowDown, Minus, Filter, Search
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRank, setUserRank] = useState(null);
  
  // Kategorie žebříčků
  const categories = [
    { id: 'overall', name: 'Celkové', icon: Trophy, color: 'from-yellow-500 to-amber-600' },
    { id: 'credits', name: 'Kredity', icon: CreditCard, color: 'from-green-500 to-emerald-600' },
    { id: 'cards', name: 'Karty', icon: Package, color: 'from-purple-500 to-indigo-600' },
    { id: 'quizzes', name: 'Kvízy', icon: Brain, color: 'from-blue-500 to-cyan-600' },
    { id: 'level', name: 'Level', icon: Star, color: 'from-red-500 to-pink-600' }
  ];
  
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  useEffect(() => {
    if (user && players.length > 0) {
      const rank = getPlayerRank(players, user.uid, selectedCategory);
      setUserRank(rank);
    }
  }, [user, players, selectedCategory]);
  
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardData();
      setPlayers(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Získat top hráče podle vybrané kategorie
  const getDisplayPlayers = () => {
    let filtered = players;
    
    // Filtrovat podle vyhledávání
    if (searchTerm) {
      filtered = players.filter(p => 
        p.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return getTopPlayers(filtered, selectedCategory, 100);
  };
  
  // Získat ikonu pro pozici
  const getRankIcon = (position) => {
    switch(position) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{position}</span>;
    }
  };
  
  // Získat barvu pozadí pro pozici
  const getRankBg = (position) => {
    switch(position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400';
      default:
        return 'bg-white border-gray-200';
    }
  };
  
  // Formátovat číslo
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString('cs-CZ');
  };
  
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }
  
  const displayPlayers = getDisplayPlayers();
  const currentCategory = categories.find(c => c.id === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${currentCategory.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                <Trophy className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Žebříček hráčů
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Nejlepší hráči HC Litvínov Lancers
                </p>
              </div>
            </div>
            
            {/* Statistika uživatele */}
            {user && userRank && (
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="text-red-600" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-600">Vaše pozice</p>
                      <p className="text-2xl font-bold text-gray-900">
                        #{userRank} ze {players.length} hráčů
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const element = document.getElementById(`player-${user.uid}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                  >
                    Zobrazit moji pozici
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Kategorie */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-6 py-3 rounded-xl font-bold transition-all transform
                      ${selectedCategory === category.id 
                        ? `bg-gradient-to-r ${category.color} text-white scale-105 shadow-lg` 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={20} />
                      <span>{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Vyhledávání */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Hledat hráče..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          {/* Žebříček */}
          <div className="space-y-3">
            {displayPlayers.map((player, index) => {
              const position = index + 1;
              const isCurrentUser = user && player.userId === user.uid;
              
              return (
                <div
                  key={player.userId}
                  id={`player-${player.userId}`}
                  className={`
                    ${getRankBg(position)} 
                    rounded-2xl p-4 shadow-lg border-2 transition-all
                    ${isCurrentUser ? 'ring-4 ring-red-500 ring-opacity-50' : ''}
                    hover:transform hover:scale-[1.02]
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* Levá strana - pozice a hráč */}
                    <div className="flex items-center gap-4">
                      {/* Pozice */}
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(position)}
                      </div>
                      
                      {/* Avatar a jméno */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold overflow-hidden">
                          {player.avatarUrl ? (
                            <img 
                              src={player.avatarUrl} 
                              alt={player.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            player.displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {player.displayName}
                            {isCurrentUser && (
                              <span className="ml-2 text-sm text-red-600">(Vy)</span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" />
                              Level {player.level}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{formatNumber(player.xp)} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pravá strana - statistiky */}
                    <div className="flex items-center gap-6">
                      {/* Kredity */}
                      <div className={`text-center ${selectedCategory === 'credits' ? 'scale-110' : ''}`}>
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-green-600" />
                          <span className={`font-bold ${selectedCategory === 'credits' ? 'text-xl text-green-600' : 'text-gray-900'}`}>
                            {formatNumber(player.credits)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">kreditů</p>
                      </div>
                      
                      {/* Karty */}
                      <div className={`text-center ${selectedCategory === 'cards' ? 'scale-110' : ''}`}>
                        <div className="flex items-center gap-2">
                          <Package size={18} className="text-purple-600" />
                          <span className={`font-bold ${selectedCategory === 'cards' ? 'text-xl text-purple-600' : 'text-gray-900'}`}>
                            {player.totalCards}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">karet</p>
                      </div>
                      
                      {/* Kvízy */}
                      <div className={`text-center ${selectedCategory === 'quizzes' ? 'scale-110' : ''}`}>
                        <div className="flex items-center gap-2">
                          <Brain size={18} className="text-blue-600" />
                          <span className={`font-bold ${selectedCategory === 'quizzes' ? 'text-xl text-blue-600' : 'text-gray-900'}`}>
                            {player.totalQuizzes}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">kvízů</p>
                      </div>
                      
                      {/* Celkové skóre */}
                      {selectedCategory === 'overall' && (
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-600" />
                            <span className="font-bold text-xl text-yellow-600">
                              {formatNumber(player.totalScore)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">bodů</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Prázdný stav */}
          {displayPlayers.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                <Users className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Žádní hráči nenalezeni
              </h3>
              <p className="text-gray-600">
                Zkuste změnit vyhledávací kritéria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}