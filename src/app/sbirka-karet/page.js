'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/firebaseProfile';
import { getUserCards } from '@/lib/firebaseQuiz';
import { 
  Package, Lock, Star, Search, Filter, 
  ChevronRight, Loader, Shield, Target, Heart,
  Sparkles, Trophy, Zap, Folder, ArrowLeft, Users,
  Award, TrendingUp, Flame, Crown, Diamond
} from 'lucide-react';
import Image from 'next/image';

export default function CollectionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [collectedCards, setCollectedCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Načíst profil a karty
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/games/cards');
      return;
    }
    
    if (user) {
      loadProfileAndCards();
    }
  }, [user, authLoading, router]);
  
  const loadProfileAndCards = async () => {
    try {
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
      
      // Načíst sebrané karty z Firebase
      const cards = await getUserCards(user.uid);
      setCollectedCards(cards);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Definice týmů
  const teams = [
    {
      id: 'lancers',
      name: 'HC Litvínov Lancers',
      logo: '/images/loga/lancers-logo.png',
      description: 'KHLA Sportega Liga',
      totalCards: 23, // 20 regular + 3 special
      collectedCards: collectedCards.filter(c => 
        c.includes('lancers') || c.includes('straubing')
      ).length,
      primaryColor: 'from-red-600 to-red-700',
      secondaryColor: 'from-black to-gray-900'
    },
    {
      id: 'gurmani',
      name: 'Gurmáni',
      logo: '/images/loga/Gurmani.png',
      description: 'Partnerský tým',
      totalCards: 15,
      collectedCards: collectedCards.filter(c => c.includes('gurmani')).length,
      primaryColor: 'from-orange-600 to-orange-700',
      secondaryColor: 'from-gray-800 to-gray-900'
    }
  ];
  
  // Data hráčů pro různé týmy
  const getPlayerCards = (teamId) => {
    if (teamId === 'lancers') {
      return [
        // Speciální karty z kvízu - UPRAVENÝ DESIGN
        { 
          id: 'turecek-straubing-2025', 
          name: 'Tomáš Tureček', 
          number: 'S1', 
          position: 'Útočník', 
          rarity: 'legendary',
          category: 'special', 
          edition: 'Straubing 2025',
          team: 'HC Litvínov',
          stats: { shooting: 92, skating: 88, physical: 85 },
          description: 'Hvězda týmu ze Straubingu 2025'
        },
        { 
          id: 'kores-straubing-2025', 
          name: 'Michal Koreš', 
          number: 'S2', 
          position: 'Útočník', 
          rarity: 'legendary',
          category: 'special', 
          edition: 'Straubing 2025',
          team: 'HC Litvínov',
          stats: { shooting: 90, skating: 91, physical: 87 },
          description: 'Rychlý útočník ze Straubingu 2025'
        },
        { 
          id: 'hanus-straubing-2025', 
          name: 'Jan Hanuš', 
          number: 'S3', 
          position: 'Útočník', 
          rarity: 'legendary',
          category: 'special', 
          edition: 'Straubing 2025',
          team: 'HC Litvínov',
          stats: { shooting: 89, skating: 86, physical: 90 },
          description: 'Silový hráč ze Straubingu 2025'
        },
        
        // Brankáři
        { id: 'novakova', name: 'Michaela Nováková', number: 30, position: 'Brankář', rarity: 'epic', category: 'goalies', stats: { reflexes: 88, positioning: 85, glove: 87 } },
        { id: 'svoboda', name: 'Tomáš Svoboda', number: 1, position: 'Brankář', rarity: 'rare', category: 'goalies', stats: { reflexes: 82, positioning: 80, glove: 81 } },
        
        // Obránci
        { id: 'simek', name: 'Roman Šimek', number: 27, position: 'Obránce', rarity: 'epic', category: 'defenders', stats: { defense: 87, shooting: 75, physical: 88 } },
        { id: 'dvorak', name: 'Pavel Dvořák', number: 5, position: 'Obránce', rarity: 'rare', category: 'defenders', stats: { defense: 83, shooting: 72, physical: 85 } },
        { id: 'novotny', name: 'Jan Novotný', number: 7, position: 'Obránce', rarity: 'common', category: 'defenders', stats: { defense: 78, shooting: 68, physical: 80 } },
        { id: 'prochazka', name: 'Martin Procházka', number: 8, position: 'Obránce', rarity: 'common', category: 'defenders', stats: { defense: 76, shooting: 70, physical: 79 } },
        { id: 'krejci', name: 'Lukáš Krejčí', number: 22, position: 'Obránce', rarity: 'rare', category: 'defenders', stats: { defense: 82, shooting: 74, physical: 83 } },
        { id: 'marek', name: 'Jiří Marek', number: 12, position: 'Obránce', rarity: 'common', category: 'defenders', stats: { defense: 77, shooting: 69, physical: 78 } },
        
        // Útočníci
        { id: 'materna', name: 'Vašek Materna', number: 91, position: 'Útočník', rarity: 'epic', category: 'forwards', stats: { shooting: 89, skating: 87, physical: 82 } },
        { id: 'horak', name: 'David Horák', number: 11, position: 'Útočník', rarity: 'rare', category: 'forwards', stats: { shooting: 84, skating: 85, physical: 78 } },
        { id: 'jelinek', name: 'Petr Jelínek', number: 18, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 78, skating: 80, physical: 76 } },
        { id: 'urban', name: 'Tomáš Urban', number: 21, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 77, skating: 79, physical: 75 } },
        { id: 'fiala', name: 'Jakub Fiala', number: 24, position: 'Útočník', rarity: 'rare', category: 'forwards', stats: { shooting: 83, skating: 86, physical: 77 } },
        { id: 'stejskal', name: 'Pavel Stejskal', number: 15, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 76, skating: 78, physical: 74 } },
        { id: 'vanek', name: 'Ondřej Vaněk', number: 9, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 75, skating: 81, physical: 73 } },
        { id: 'kadlec', name: 'Michal Kadlec', number: 23, position: 'Útočník', rarity: 'rare', category: 'forwards', stats: { shooting: 82, skating: 83, physical: 79 } },
        { id: 'benes', name: 'Filip Beneš', number: 14, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 74, skating: 77, physical: 72 } },
        { id: 'pospichal', name: 'Adam Pospíchal', number: 13, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 73, skating: 76, physical: 71 } },
        { id: 'kovar', name: 'Martin Kovář', number: 88, position: 'Útočník', rarity: 'rare', category: 'forwards', stats: { shooting: 85, skating: 84, physical: 80 } },
        { id: 'dolezal', name: 'Jan Doležal', number: 17, position: 'Útočník', rarity: 'common', category: 'forwards', stats: { shooting: 72, skating: 75, physical: 70 } }
      ];
    } else if (teamId === 'gurmani') {
      // Placeholder data pro Gurmány
      return [
        { id: 'gurman1', name: '???', number: 1, position: 'Brankář', rarity: 'epic', category: 'goalies' },
        { id: 'gurman2', name: '???', number: 2, position: 'Obránce', rarity: 'rare', category: 'defenders' },
        { id: 'gurman3', name: '???', number: 3, position: 'Útočník', rarity: 'common', category: 'forwards' },
      ];
    }
    return [];
  };
  
  // Kategorie pro filtrování
  const categories = [
    { id: 'all', label: 'Všechny karty', icon: Package },
    { id: 'special', label: 'Speciální', icon: Diamond },
    { id: 'goalies', label: 'Brankáři', icon: Shield },
    { id: 'defenders', label: 'Obránci', icon: Heart },
    { id: 'forwards', label: 'Útočníci', icon: Target }
  ];
  
  // Filtrování karet
  const playerCards = selectedTeam ? getPlayerCards(selectedTeam.id) : [];
  const filteredCards = playerCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.number.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Získat barvu podle rarity - NOVÉ BARVY
  const getRarityGradient = (rarity) => {
    switch(rarity) {
      case 'legendary': 
        return {
          bg: 'from-purple-600 via-pink-600 to-purple-600',
          border: 'from-purple-400 to-pink-400',
          glow: 'shadow-purple-500/50',
          stars: 5,
          label: 'LEGENDÁRNÍ'
        };
      case 'epic': 
        return {
          bg: 'from-yellow-500 via-amber-500 to-yellow-500',
          border: 'from-yellow-400 to-amber-400',
          glow: 'shadow-yellow-500/50',
          stars: 4,
          label: 'EPICKÁ'
        };
      case 'rare': 
        return {
          bg: 'from-blue-500 via-cyan-500 to-blue-500',
          border: 'from-blue-400 to-cyan-400',
          glow: 'shadow-blue-500/50',
          stars: 3,
          label: 'VZÁCNÁ'
        };
      case 'common': 
        return {
          bg: 'from-gray-500 via-gray-600 to-gray-500',
          border: 'from-gray-400 to-gray-500',
          glow: 'shadow-gray-500/50',
          stars: 2,
          label: 'BĚŽNÁ'
        };
      default: 
        return {
          bg: 'from-gray-600 to-gray-800',
          border: 'from-gray-500 to-gray-700',
          glow: 'shadow-gray-500/50',
          stars: 1,
          label: 'ZÁKLADNÍ'
        };
    }
  };
  
  // Získat barvu pozice
  const getPositionIcon = (position) => {
    if (position === 'Brankář') return <Shield size={16} />;
    if (position === 'Obránce') return <Heart size={16} />;
    return <Target size={16} />;
  };
  
  // Statistiky sbírky
  const collectionStats = {
    total: playerCards.length,
    collected: playerCards.filter(c => collectedCards.includes(c.id)).length,
    percentage: playerCards.length > 0 ? Math.round((playerCards.filter(c => collectedCards.includes(c.id)).length / playerCards.length) * 100) : 0,
    special: { 
      total: playerCards.filter(c => c.category === 'special').length,
      collected: playerCards.filter(c => c.category === 'special' && collectedCards.includes(c.id)).length 
    },
    goalies: { 
      total: playerCards.filter(c => c.category === 'goalies').length,
      collected: playerCards.filter(c => c.category === 'goalies' && collectedCards.includes(c.id)).length 
    },
    defenders: { 
      total: playerCards.filter(c => c.category === 'defenders').length,
      collected: playerCards.filter(c => c.category === 'defenders' && collectedCards.includes(c.id)).length 
    },
    forwards: { 
      total: playerCards.filter(c => c.category === 'forwards').length,
      collected: playerCards.filter(c => c.category === 'forwards' && collectedCards.includes(c.id)).length 
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }
  
  if (!user || !profile) {
    return null;
  }
  
  // VÝBĚR TÝMU
  if (!selectedTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Navigation />
        
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-6 shadow-2xl">
                <Folder className="text-white" size={40} />
              </div>
              <h1 className="text-5xl font-black text-white mb-4">
                Sbírka karet
              </h1>
              <p className="text-xl text-gray-400">
                Vyberte tým pro zobrazení sbírky
              </p>
            </div>
            
            {/* Týmy jako složky */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => {
                // Update collected count for display
                const actualCollected = team.id === 'lancers' 
                  ? collectedCards.filter(c => c.includes('lancers') || c.includes('straubing')).length
                  : collectedCards.filter(c => c.includes(team.id)).length;
                
                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="group relative bg-gray-800/50 backdrop-blur rounded-3xl border border-gray-700 hover:border-red-500 transition-all hover:scale-105 overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${team.primaryColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative p-8">
                      {/* Logo týmu */}
                      <div className="w-32 h-32 mx-auto mb-6 relative group-hover:scale-110 transition-transform">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          width={128}
                          height={128}
                          className="object-contain filter drop-shadow-2xl"
                        />
                        {/* Special badge pro Lancers pokud má speciální karty */}
                        {team.id === 'lancers' && collectedCards.some(c => c.includes('straubing')) && (
                          <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-2 animate-pulse">
                            <Award size={20} />
                          </div>
                        )}
                      </div>
                      
                      {/* Název týmu */}
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-400 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {team.description}
                      </p>
                      
                      {/* Statistiky */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Sbírka</span>
                          <span className="text-white font-bold">
                            {actualCollected} / {team.totalCards}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${team.primaryColor} transition-all`}
                            style={{ width: `${(actualCollected / team.totalCards) * 100}%` }}
                          />
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-2xl font-black text-white">
                            {Math.round((actualCollected / team.totalCards) * 100)}%
                          </span>
                          <span className="text-gray-400 text-sm ml-2">dokončeno</span>
                        </div>
                      </div>
                      
                      {/* Ikona šipky */}
                      <div className="absolute top-4 right-4 bg-gray-900/50 rounded-full p-2 group-hover:bg-red-600/20 transition-all">
                        <ChevronRight className="text-gray-400 group-hover:text-white" size={24} />
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {/* Placeholder pro další týmy */}
              <div className="relative bg-gray-800/30 backdrop-blur rounded-3xl border border-gray-700 border-dashed">
                <div className="p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-900/50 rounded-full flex items-center justify-center">
                    <Sparkles className="text-gray-600" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-500 mb-2">
                    Další týmy
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Brzy přidáme více týmů
                  </p>
                </div>
              </div>
            </div>
            
            {/* Celkové statistiky */}
            <div className="mt-12 bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-yellow-500" size={24} />
                <h3 className="text-xl font-bold text-white">Celkové statistiky</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-white">{collectedCards.length}</div>
                  <div className="text-gray-400 text-sm">Celkem karet</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-yellow-500">2</div>
                  <div className="text-gray-400 text-sm">Týmů ve sbírce</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-500">
                    {collectedCards.filter(c => c.includes('straubing')).length}
                  </div>
                  <div className="text-gray-400 text-sm">Speciálních karet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // ZOBRAZENÍ KARET VYBRANÉHO TÝMU - MODERNIZOVANÝ DESIGN
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header s tlačítkem zpět */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedTeam(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>Zpět na výběr týmu</span>
            </button>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 relative">
                <Image
                  src={selectedTeam.logo}
                  alt={selectedTeam.name}
                  width={80}
                  height={80}
                  className="object-contain filter drop-shadow-xl"
                />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  {selectedTeam.name}
                </h1>
                <p className="text-gray-400">
                  {selectedTeam.description} • {playerCards.length} karet
                </p>
              </div>
            </div>
          </div>
          
          {/* Statistiky sbírky */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Trophy className="text-yellow-500" size={24} />
                <span className="text-2xl font-black text-white">
                  {collectionStats.percentage}%
                </span>
              </div>
              <div className="text-gray-400 text-sm">Dokončeno</div>
              <div className="text-white font-bold">
                {collectionStats.collected} / {collectionStats.total} karet
              </div>
              <div className="mt-3 bg-gray-900 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${selectedTeam.primaryColor} transition-all`}
                  style={{ width: `${collectionStats.percentage}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Diamond className="text-purple-500" size={24} />
                <span className="text-2xl font-black text-white">
                  {collectionStats.special.collected}/{collectionStats.special.total}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Speciální</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Shield className="text-blue-500" size={24} />
                <span className="text-2xl font-black text-white">
                  {collectionStats.goalies.collected}/{collectionStats.goalies.total}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Brankáři</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Heart className="text-green-500" size={24} />
                <span className="text-2xl font-black text-white">
                  {collectionStats.defenders.collected}/{collectionStats.defenders.total}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Obránci</div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <Target className="text-red-500" size={24} />
                <span className="text-2xl font-black text-white">
                  {collectionStats.forwards.collected}/{collectionStats.forwards.total}
                </span>
              </div>
              <div className="text-gray-400 text-sm">Útočníci</div>
            </div>
          </div>
          
          {/* Filtry a vyhledávání */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Vyhledávání */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Hledat hráče nebo číslo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              {/* Kategorie */}
              <div className="flex gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        selectedCategory === cat.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden md:inline">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* MODERNIZOVANÉ KARTY HRÁČŮ */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => {
              const isCollected = collectedCards.includes(card.id);
              const rarityStyle = getRarityGradient(card.rarity);
              
              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative transition-all duration-300 ${
                    isCollected 
                      ? 'transform hover:scale-105 hover:-translate-y-2' 
                      : 'opacity-50 grayscale'
                  }`}
                >
                  {/* Card Container */}
                  <div className={`
                    relative bg-gray-900 rounded-2xl overflow-hidden
                    ${isCollected ? `shadow-2xl ${rarityStyle.glow}` : 'shadow-lg'}
                  `}>
                    
                    {/* Rarity Border Gradient */}
                    {isCollected && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${rarityStyle.bg} opacity-100`} />
                    )}
                    
                    {/* Card Inner Content */}
                    <div className={`relative ${isCollected ? 'm-[2px]' : 'm-0'} bg-gray-900 rounded-2xl overflow-hidden`}>
                      
                      {/* Header with Edition Badge */}
                      <div className={`relative h-8 bg-gradient-to-r ${isCollected ? rarityStyle.bg : 'from-gray-700 to-gray-800'}`}>
                        {card.edition && isCollected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-white/90 tracking-wider">
                              {card.edition}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Player Image Section */}
                      <div className="relative h-40 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
                          }} />
                        </div>
                        
                        {/* Team Logo Watermark */}
                        {isCollected && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Image
                              src={selectedTeam.logo}
                              alt={selectedTeam.name}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          </div>
                        )}
                        
                        {/* Player Number */}
                        <div className="absolute top-2 left-2">
                          <span className={`text-3xl font-black ${isCollected ? 'text-white/90' : 'text-gray-600'}`}>
                            #{card.number}
                          </span>
                        </div>
                        
                        {/* Position Badge */}
                        <div className="absolute top-2 right-2">
                          <div className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                            isCollected 
                              ? 'bg-black/50 backdrop-blur text-white' 
                              : 'bg-gray-800 text-gray-500'
                          }`}>
                            {getPositionIcon(card.position)}
                            <span className="text-xs font-bold">{card.position}</span>
                          </div>
                        </div>
                        
                        {/* Player Avatar/Silhouette */}
                        {isCollected ? (
                          <div className="relative z-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center ring-4 ring-white/20">
                              <span className="text-white text-2xl font-black">
                                {card.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Lock className="text-gray-700 relative z-10" size={48} />
                        )}
                      </div>
                      
                      {/* Player Info Section */}
                      <div className="p-4 bg-gradient-to-b from-gray-900 to-black">
                        {/* Name */}
                        <h3 className={`font-black text-center mb-2 ${
                          isCollected ? 'text-white' : 'text-gray-600'
                        }`}>
                          {isCollected ? card.name : '???'}
                        </h3>
                        
                        {/* Rarity Label */}
                        <div className="text-center mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            isCollected 
                              ? `bg-gradient-to-r ${rarityStyle.bg} text-white`
                              : 'bg-gray-800 text-gray-600'
                          }`}>
                            {isCollected ? rarityStyle.label : 'LOCKED'}
                          </span>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex items-center justify-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={
                                isCollected && i < rarityStyle.stars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-700'
                              }
                            />
                          ))}
                        </div>
                        
                        {/* Stats (if collected and hovering) */}
                        {isCollected && card.stats && hoveredCard === card.id && (
                          <div className="space-y-1 animate-fadeIn">
                            {Object.entries(card.stats).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 capitalize">{key}</span>
                                <div className="flex items-center gap-1">
                                  <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-red-600 to-red-500"
                                      style={{ width: `${value}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-white font-bold w-6 text-right">{value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom Border */}
                      <div className={`h-1 bg-gradient-to-r ${isCollected ? rarityStyle.bg : 'from-gray-700 to-gray-800'}`} />
                    </div>
                  </div>
                  
                  {/* Collection Number */}
                  {isCollected && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-bold border border-gray-700">
                        {playerCards.findIndex(c => c.id === card.id) + 1}/{playerCards.length}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Empty state */}
          {filteredCards.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800 rounded-full mb-4">
                <Search className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Žádné karty nenalezeny
              </h3>
              <p className="text-gray-400">
                Zkuste změnit filtry nebo vyhledávací kritéria
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}