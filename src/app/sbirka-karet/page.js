'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/firebaseProfile';
import { 
  Package, Lock, Star, Search, Filter, 
  ChevronRight, Loader, Shield, Target, Heart,
  Sparkles, Trophy, Zap, Folder, ArrowLeft, Users
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
  const [collectedCards, setCollectedCards] = useState([]); // Zatím prázdné - později z Firebase
  
  // Načíst profil
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/games/cards');
      return;
    }
    
    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);
  
  const loadProfile = async () => {
    try {
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
      // TODO: Načíst sebrané karty z Firebase
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
      totalCards: 20,
      collectedCards: 0,
      primaryColor: 'from-red-600 to-red-700',
      secondaryColor: 'from-black to-gray-900'
    },
    {
      id: 'gurmani',
      name: 'Gurmáni',
      logo: '/images/loga/Gurmani.png',
      description: 'Partnerský tým',
      totalCards: 15,
      collectedCards: 0,
      primaryColor: 'from-orange-600 to-orange-700',
      secondaryColor: 'from-gray-800 to-gray-900'
    }
  ];
  
  // Data hráčů pro různé týmy
  const getPlayerCards = (teamId) => {
    if (teamId === 'lancers') {
      return [
        // Brankáři
        { id: 'novakova', name: 'Michaela Nováková', number: 30, position: 'Brankář', rarity: 'gold', category: 'goalies' },
        { id: 'svoboda', name: 'Tomáš Svoboda', number: 1, position: 'Brankář', rarity: 'silver', category: 'goalies' },
        
        // Obránci
        { id: 'simek', name: 'Roman Šimek', number: 27, position: 'Obránce', rarity: 'gold', category: 'defenders' },
        { id: 'dvorak', name: 'Pavel Dvořák', number: 5, position: 'Obránce', rarity: 'silver', category: 'defenders' },
        { id: 'novotny', name: 'Jan Novotný', number: 7, position: 'Obránce', rarity: 'bronze', category: 'defenders' },
        { id: 'prochazka', name: 'Martin Procházka', number: 8, position: 'Obránce', rarity: 'bronze', category: 'defenders' },
        { id: 'krejci', name: 'Lukáš Krejčí', number: 22, position: 'Obránce', rarity: 'silver', category: 'defenders' },
        { id: 'marek', name: 'Jiří Marek', number: 12, position: 'Obránce', rarity: 'bronze', category: 'defenders' },
        
        // Útočníci
        { id: 'materna', name: 'Vašek Materna', number: 91, position: 'Útočník', rarity: 'gold', category: 'forwards' },
        { id: 'horak', name: 'David Horák', number: 11, position: 'Útočník', rarity: 'silver', category: 'forwards' },
        { id: 'jelinek', name: 'Petr Jelínek', number: 18, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'urban', name: 'Tomáš Urban', number: 21, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'fiala', name: 'Jakub Fiala', number: 24, position: 'Útočník', rarity: 'silver', category: 'forwards' },
        { id: 'stejskal', name: 'Pavel Stejskal', number: 15, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'vanek', name: 'Ondřej Vaněk', number: 9, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'kadlec', name: 'Michal Kadlec', number: 23, position: 'Útočník', rarity: 'silver', category: 'forwards' },
        { id: 'benes', name: 'Filip Beneš', number: 14, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'pospichal', name: 'Adam Pospíchal', number: 13, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        { id: 'kovar', name: 'Martin Kovář', number: 88, position: 'Útočník', rarity: 'silver', category: 'forwards' },
        { id: 'dolezal', name: 'Jan Doležal', number: 17, position: 'Útočník', rarity: 'bronze', category: 'forwards' }
      ];
    } else if (teamId === 'gurmani') {
      // Placeholder data pro Gurmány
      return [
        { id: 'gurman1', name: '???', number: 1, position: 'Brankář', rarity: 'gold', category: 'goalies' },
        { id: 'gurman2', name: '???', number: 2, position: 'Obránce', rarity: 'silver', category: 'defenders' },
        { id: 'gurman3', name: '???', number: 3, position: 'Útočník', rarity: 'bronze', category: 'forwards' },
        // ... více hráčů
      ];
    }
    return [];
  };
  
  // Kategorie pro filtrování
  const categories = [
    { id: 'all', label: 'Všechny karty', icon: Package },
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
  
  // Získat barvu podle rarity
  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-600 to-orange-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };
  
  // Získat barvu pozice
  const getPositionColor = (position) => {
    if (position === 'Brankář') return 'bg-blue-600';
    if (position === 'Obránce') return 'bg-green-600';
    return 'bg-red-600';
  };
  
  // Statistiky sbírky
  const collectionStats = {
    total: playerCards.length,
    collected: collectedCards.length,
    percentage: playerCards.length > 0 ? Math.round((collectedCards.length / playerCards.length) * 100) : 0,
    goalies: { 
      total: playerCards.filter(c => c.category === 'goalies').length,
      collected: collectedCards.filter(c => playerCards.find(p => p.id === c)?.category === 'goalies').length 
    },
    defenders: { 
      total: playerCards.filter(c => c.category === 'defenders').length,
      collected: collectedCards.filter(c => playerCards.find(p => p.id === c)?.category === 'defenders').length 
    },
    forwards: { 
      total: playerCards.filter(c => c.category === 'forwards').length,
      collected: collectedCards.filter(c => playerCards.find(p => p.id === c)?.category === 'forwards').length 
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
              {teams.map((team) => (
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
                          {team.collectedCards} / {team.totalCards}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${team.primaryColor} transition-all`}
                          style={{ width: `${(team.collectedCards / team.totalCards) * 100}%` }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-2xl font-black text-white">
                          {Math.round((team.collectedCards / team.totalCards) * 100)}%
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
              ))}
              
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
                  <div className="text-3xl font-black text-white">0</div>
                  <div className="text-gray-400 text-sm">Celkem karet</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-yellow-500">2</div>
                  <div className="text-gray-400 text-sm">Týmů ve sbírce</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-green-500">0%</div>
                  <div className="text-gray-400 text-sm">Kompletní sbírka</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // ZOBRAZENÍ KARET VYBRANÉHO TÝMU
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
          <div className="grid md:grid-cols-4 gap-4 mb-8">
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
          
          {/* Karty hráčů */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCards.map((card) => {
              const isCollected = collectedCards.includes(card.id);
              
              return (
                <div
                  key={card.id}
                  className={`relative bg-gray-800/50 backdrop-blur rounded-2xl border border-gray-700 overflow-hidden transition-all ${
                    isCollected ? 'hover:scale-105' : 'opacity-75 grayscale'
                  }`}
                >
                  {/* Rarity gradient */}
                  <div className={`h-2 bg-gradient-to-r ${getRarityColor(card.rarity)}`} />
                  
                  {/* Card content */}
                  <div className="p-4">
                    {/* Číslo a pozice */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl font-black text-white">
                        #{card.number}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getPositionColor(card.position)}`}>
                        {card.position}
                      </span>
                    </div>
                    
                    {/* Avatar placeholder nebo otazník */}
                    <div className="relative w-full h-32 bg-gray-900 rounded-xl mb-3 flex items-center justify-center">
                      {isCollected ? (
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {card.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-600 text-6xl font-black">?</div>
                      )}
                      
                      {/* Lock overlay pro nezískané */}
                      {!isCollected && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <Lock className="text-gray-500" size={32} />
                        </div>
                      )}
                    </div>
                    
                    {/* Jméno hráče */}
                    <div className="text-center">
                      <h3 className={`font-bold ${isCollected ? 'text-white' : 'text-gray-500'}`}>
                        {isCollected ? card.name : '???'}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {card.rarity === 'gold' && (
                          <>
                            <Star className="text-yellow-500" size={12} fill="currentColor" />
                            <Star className="text-yellow-500" size={12} fill="currentColor" />
                            <Star className="text-yellow-500" size={12} fill="currentColor" />
                          </>
                        )}
                        {card.rarity === 'silver' && (
                          <>
                            <Star className="text-gray-400" size={12} fill="currentColor" />
                            <Star className="text-gray-400" size={12} fill="currentColor" />
                          </>
                        )}
                        {card.rarity === 'bronze' && (
                          <Star className="text-orange-600" size={12} fill="currentColor" />
                        )}
                      </div>
                    </div>
                  </div>
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