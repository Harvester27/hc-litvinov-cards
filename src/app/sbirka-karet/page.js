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
        // Speciální karty z kvízu - S OBRÁZKY
        { 
          id: 'turecek-straubing-2025', 
          name: 'Tomáš Tureček', 
          number: 'S1', 
          position: 'Útočník', 
          category: 'special', 
          edition: 'Straubing 2025',
          cardImage: '/CardGames/Straubing/TomasTurecekStraubing2025.svg',
          isSpecial: true
        },
        { 
          id: 'kores-straubing-2025', 
          name: 'Michal Koreš', 
          number: 'S2', 
          position: 'Útočník', 
          category: 'special', 
          edition: 'Straubing 2025',
          cardImage: '/CardGames/Straubing/MichalKoresStraubing2025.svg',
          isSpecial: true
        },
        { 
          id: 'hanus-straubing-2025', 
          name: 'Jan Hanuš', 
          number: 'S3', 
          position: 'Útočník', 
          category: 'special', 
          edition: 'Straubing 2025',
          cardImage: '/CardGames/Straubing/JanHanusStraubing2025.svg',
          isSpecial: true
        },
        
        // Brankáři
        { id: 'novakova', name: 'Michaela Nováková', number: 30, position: 'Brankář', category: 'goalies' },
        { id: 'svoboda', name: 'Tomáš Svoboda', number: 1, position: 'Brankář', category: 'goalies' },
        
        // Obránci
        { id: 'simek', name: 'Roman Šimek', number: 27, position: 'Obránce', category: 'defenders' },
        { id: 'dvorak', name: 'Pavel Dvořák', number: 5, position: 'Obránce', category: 'defenders' },
        { id: 'novotny', name: 'Jan Novotný', number: 7, position: 'Obránce', category: 'defenders' },
        { id: 'prochazka', name: 'Martin Procházka', number: 8, position: 'Obránce', category: 'defenders' },
        { id: 'krejci', name: 'Lukáš Krejčí', number: 22, position: 'Obránce', category: 'defenders' },
        { id: 'marek', name: 'Jiří Marek', number: 12, position: 'Obránce', category: 'defenders' },
        
        // Útočníci
        { id: 'materna', name: 'Vašek Materna', number: 91, position: 'Útočník', category: 'forwards' },
        { id: 'horak', name: 'David Horák', number: 11, position: 'Útočník', category: 'forwards' },
        { id: 'jelinek', name: 'Petr Jelínek', number: 18, position: 'Útočník', category: 'forwards' },
        { id: 'urban', name: 'Tomáš Urban', number: 21, position: 'Útočník', category: 'forwards' },
        { id: 'fiala', name: 'Jakub Fiala', number: 24, position: 'Útočník', category: 'forwards' },
        { id: 'stejskal', name: 'Pavel Stejskal', number: 15, position: 'Útočník', category: 'forwards' },
        { id: 'vanek', name: 'Ondřej Vaněk', number: 9, position: 'Útočník', category: 'forwards' },
        { id: 'kadlec', name: 'Michal Kadlec', number: 23, position: 'Útočník', category: 'forwards' },
        { id: 'benes', name: 'Filip Beneš', number: 14, position: 'Útočník', category: 'forwards' },
        { id: 'pospichal', name: 'Adam Pospíchal', number: 13, position: 'Útočník', category: 'forwards' },
        { id: 'kovar', name: 'Martin Kovář', number: 88, position: 'Útočník', category: 'forwards' },
        { id: 'dolezal', name: 'Jan Doležal', number: 17, position: 'Útočník', category: 'forwards' }
      ];
    } else if (teamId === 'gurmani') {
      // Placeholder data pro Gurmány
      return [
        { id: 'gurman1', name: '???', number: 1, position: 'Brankář', category: 'goalies' },
        { id: 'gurman2', name: '???', number: 2, position: 'Obránce', category: 'defenders' },
        { id: 'gurman3', name: '???', number: 3, position: 'Útočník', category: 'forwards' },
      ];
    }
    return [];
  };
  
  // Kategorie pro filtrování
  const categories = [
    { id: 'all', label: 'Všechny karty', icon: Package },
    { id: 'special', label: 'Speciální edice', icon: Diamond },
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
  
  // Získat barvu pozice
  const getPositionColor = (position) => {
    if (position === 'Brankář') return 'bg-blue-600';
    if (position === 'Obránce') return 'bg-green-600';
    return 'bg-red-600';
  };
  
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
  
  // ZOBRAZENÍ KARET VYBRANÉHO TÝMU - S ORIGINÁLNÍMI OBRÁZKY
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
              <div className="text-gray-400 text-sm">Speciální edice</div>
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
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
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
          
          {/* KARTY HRÁČŮ - ČISTÉ A MODERNÍ */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map((card) => {
              const isCollected = collectedCards.includes(card.id);
              
              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative transition-all duration-300 ${
                    isCollected 
                      ? 'transform hover:scale-105 hover:-translate-y-2' 
                      : 'opacity-60'
                  }`}
                >
                  {/* SPECIÁLNÍ KARTY S OBRÁZKEM */}
                  {card.isSpecial ? (
                    <div className={`
                      relative bg-gray-900 rounded-xl overflow-hidden
                      ${isCollected ? 'shadow-2xl shadow-purple-500/30' : 'shadow-lg'}
                    `}>
                      {/* Purple gradient border for special cards */}
                      {isCollected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600" />
                      )}
                      
                      <div className={`relative ${isCollected ? 'm-[2px]' : 'm-0'} bg-gray-900 rounded-xl overflow-hidden`}>
                        {/* Edition Badge */}
                        <div className="absolute top-2 left-2 z-10 bg-purple-600/90 backdrop-blur px-3 py-1 rounded-full">
                          <span className="text-xs font-black text-white tracking-wider">
                            {card.edition}
                          </span>
                        </div>
                        
                        {/* Card Image Container */}
                        <div className="relative aspect-[3/4] bg-gradient-to-b from-gray-800 to-gray-900">
                          {isCollected ? (
                            <Image
                              src={card.cardImage}
                              alt={card.name}
                              fill
                              className="object-contain p-4"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Lock className="text-gray-700" size={48} />
                            </div>
                          )}
                        </div>
                        
                        {/* Card Info */}
                        <div className="p-3 bg-black">
                          <div className="text-center">
                            <h3 className={`font-bold text-sm ${isCollected ? 'text-white' : 'text-gray-600'}`}>
                              {isCollected ? card.name : '???'}
                            </h3>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  className={isCollected ? 'text-purple-400 fill-purple-400' : 'text-gray-700'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // BĚŽNÉ KARTY BEZ OBRÁZKU
                    <div className={`
                      relative bg-gray-900 rounded-xl overflow-hidden
                      ${isCollected ? 'shadow-xl' : 'shadow-lg'}
                    `}>
                      {/* Standard border */}
                      {isCollected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-700" />
                      )}
                      
                      <div className={`relative ${isCollected ? 'm-[1px]' : 'm-0'} bg-gray-900 rounded-xl overflow-hidden`}>
                        {/* Header */}
                        <div className="h-8 bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-between px-3">
                          <span className="text-white font-bold text-sm">#{card.number}</span>
                          <div className="flex items-center gap-1">
                            {getPositionIcon(card.position)}
                            <span className="text-white text-xs">{card.position}</span>
                          </div>
                        </div>
                        
                        {/* Player Avatar Section */}
                        <div className="aspect-square bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center relative">
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <Image
                              src={selectedTeam.logo}
                              alt={selectedTeam.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {isCollected ? (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center ring-4 ring-white/10">
                              <span className="text-white text-2xl font-black">
                                {card.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          ) : (
                            <Lock className="text-gray-700" size={48} />
                          )}
                        </div>
                        
                        {/* Card Info */}
                        <div className="p-3 bg-black">
                          <h3 className={`font-bold text-center text-sm ${isCollected ? 'text-white' : 'text-gray-600'}`}>
                            {isCollected ? card.name : '???'}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
    </div>
  );
}