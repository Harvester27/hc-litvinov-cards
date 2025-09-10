'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  getCompletedQuizzes, 
  claimQuizReward,
  getQuizDetails,
  getUserCards
} from '@/lib/firebaseQuiz';
import { getUserProfile } from '@/lib/firebaseProfile';
import { syncToLeaderboard } from '@/lib/firebaseLeaderboardSync'; // PŘIDÁNO
import { 
  Gift, Trophy, Star, Check, Loader, ArrowLeft,
  Calendar, Coins, Package, Lock, Sparkles,
  ChevronRight, AlertCircle, Zap, Award,
  Clock, X
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

export default function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [cardRevealing, setCardRevealing] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Načíst data při mountu
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/games/cards');
      return;
    }
    
    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);
  
  const loadData = async () => {
    try {
      setRefreshing(true);
      // Načíst profil
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
      
      // Načíst dokončené kvízy
      const quizzes = await getCompletedQuizzes(user.uid);
      setCompletedQuizzes(quizzes);
      
      // Načíst karty uživatele
      const cards = await getUserCards(user.uid);
      setUserCards(cards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fire confetti animation
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };
  
  // Vybrat kartu a vyzvednout odměnu
  const handleCardSelection = async (card) => {
    if (claiming || selectedCard) return;
    
    
    // Znovu načíst nejnovější data před výběrem karty
    await loadData();
    // Dodatečná kontrola - zkontrolovat, zda už není odměna vyzvednuta
    const currentQuiz = completedQuizzes.find(q => q.id === selectedQuiz.id);
    if (currentQuiz?.rewardClaimed) {
      console.warn("Reward already claimed for this quiz");
      alert("Tato odměna již byla vyzvednuta!"); 
      setSelectedQuiz(null);
      return;
    }
    
    setSelectedCard(card);
    setCardRevealing(true);
    
    // Spustit animaci odhalení karty
    setTimeout(async () => {
      setClaiming(true);
      
      try {
        const result = await claimQuizReward(user.uid, selectedQuiz.id, card.id);
        
        if (result.success) {
          setClaimSuccess(true);
          fireConfetti();
          
          // Aktualizovat lokální stav
          setCompletedQuizzes(prev => prev.map(q => 
            q.id === selectedQuiz.id 
              ? { ...q, rewardClaimed: true, selectedCard: card.id }
              : q
          ));
          
          setUserCards(prev => [...prev, card.id]);
          
          // PŘIDÁNO: Synchronizovat s žebříčkem
          const updatedProfile = await getUserProfile(user.uid);
          const updatedCards = await getUserCards(user.uid);
          
          await syncToLeaderboard(user.uid, {
            displayName: updatedProfile.displayName,
            avatarUrl: updatedProfile.avatarUrl || updatedProfile.avatar,
            level: updatedProfile.level,
            xp: updatedProfile.xp,
            credits: updatedProfile.credits,
            collectedCards: updatedCards,
            completedQuizzes: completedQuizzes.length
          });
          
          // Znovu načíst data z Firebase pro jistotu
          setTimeout(() => {
            loadData();
          }, 500);
        }
      } catch (error) {
        console.error('Error claiming reward:', error);
      } finally {
        setClaiming(false);
      }
    }, 2000);
  };
  
  // Funkce pro zavření modalu po úspěšném vyzvednutí
  const closeModalAfterSuccess = () => {
    setSelectedQuiz(null);
    setSelectedCard(null);
    setCardRevealing(false);
    setClaimSuccess(false);
    setClaiming(false);
  };
  
  // Formátovat datum
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }
  
  if (!user || !profile) {
    return null;
  }
  
  // Rozdělit kvízy na vyzvednuto/nevyzvednuto
  const pendingRewards = completedQuizzes.filter(q => !q.rewardClaimed);
  const claimedRewards = completedQuizzes.filter(q => q.rewardClaimed);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/profil')}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>Zpět na profil</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Gift className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">
                  Odměny za kvízy
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Vyberte si své odměny za dokončené kvízy
                </p>
              </div>
            </div>
          </div>
          
          {/* Statistiky */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="text-yellow-500" size={24} />
                <span className="text-2xl font-black text-gray-900">
                  {completedQuizzes.length}
                </span>
              </div>
              <div className="text-gray-600">Dokončené kvízy</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Gift className="text-red-600" size={24} />
                <span className="text-2xl font-black text-gray-900">
                  {pendingRewards.length}
                </span>
              </div>
              <div className="text-gray-600">Čekající odměny</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Coins className="text-green-600" size={24} />
                <span className="text-2xl font-black text-gray-900">
                  {completedQuizzes.length * 1000}
                </span>
              </div>
              <div className="text-gray-600">Získané kredity</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Zap className="text-purple-600" size={24} />
                <span className="text-2xl font-black text-gray-900">
                  {completedQuizzes.length * 150}
                </span>
              </div>
              <div className="text-gray-600">Získané XP</div>
            </div>
          </div>
          
          {/* Nevyzvednuté odměny */}
          {pendingRewards.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                Nevyzvednuté odměny
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRewards.map((quiz) => {
                  const quizDetails = getQuizDetails(quiz.id);
                  
                  return (
                    <div 
                      key={quiz.id}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl border-2 border-yellow-400 relative overflow-hidden"
                    >
                      {/* Animovaný background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse" />
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <Gift className="text-white" size={24} />
                          </div>
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                            NOVÁ!
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                          {quizDetails?.articleTitle || 'Kvíz'}
                        </h3>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar size={14} />
                            Dokončeno: {formatDate(quiz.completedAt)}
                          </div>
                        </div>
                        
                        <div className="bg-white/80 rounded-xl p-3 mb-4">
                          <div className="text-sm text-gray-700 font-semibold mb-2">
                            Odměny k vyzvednutí:
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="text-green-600" size={14} />
                              <span>1000 kreditů (již připsáno)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Check className="text-green-600" size={14} />
                              <span>150 XP (již připsáno)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="text-yellow-500" size={14} />
                              <span className="font-bold">Speciální karta</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={async () => { await loadData(); setSelectedQuiz(quiz); }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Package size={20} />
                          Vybrat kartu
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Vyzvednute odměny */}
          {claimedRewards.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="text-green-600" />
                Vyzvednuté odměny
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedRewards.map((quiz) => {
                  const quizDetails = getQuizDetails(quiz.id);
                  const cardDetails = quizDetails?.rewards.cards.find(c => c.id === quiz.selectedCard);
                  
                  return (
                    <div 
                      key={quiz.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <Check className="text-white" size={24} />
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          VYZVEDNUTO
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {quizDetails?.articleTitle || 'Kvíz'}
                      </h3>
                      
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} />
                          Dokončeno: {formatDate(quiz.completedAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          Vyzvednuto: {formatDate(quiz.claimedAt)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-sm text-gray-700 font-semibold mb-2">
                          Získané odměny:
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Coins className="text-green-600" size={14} />
                            <span>1000 kreditů</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="text-purple-600" size={14} />
                            <span>150 XP</span>
                          </div>
                          {cardDetails && (
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="text-yellow-500" size={14} />
                              <span className="font-bold">{cardDetails.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Prázdný stav */}
          {completedQuizzes.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
                <Gift className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Zatím žádné dokončené kvízy
              </h3>
              <p className="text-gray-600 mb-8">
                Dokončete kvízy v článcích a získejte odměny!
              </p>
              <button
                onClick={() => router.push('/clanky')}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all inline-flex items-center gap-2"
              >
                <ChevronRight size={20} />
                Přejít na články
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal pro výběr karty */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Vyberte si speciální kartu
              </h2>
              {!claiming && !claimSuccess && (
                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    setSelectedCard(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6">
              {!claimSuccess ? (
                <>
                  <p className="text-gray-600 mb-6 text-center">
                    Vyberte jednu ze tří speciálních karet edice Straubing 2025:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {getQuizDetails(selectedQuiz.id)?.rewards.cards.map((card) => (
                      <div key={card.id} className="relative">
                        <button
                          onClick={() => handleCardSelection(card)}
                          disabled={selectedCard !== null || claiming}
                          className={`
                            relative w-full aspect-[2/3] rounded-xl overflow-hidden transition-all
                            ${selectedCard === card ? 'scale-110 z-10' : ''}
                            ${selectedCard && selectedCard !== card ? 'opacity-50 scale-95' : ''}
                            ${!selectedCard ? 'hover:scale-105 cursor-pointer' : ''}
                          `}
                        >
                          {/* Karta - zadní strana nebo odhalení */}
                          {!selectedCard || selectedCard !== card ? (
                            // Zadní strana karty
                            <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center p-4">
                              <Gift className="text-white mb-3" size={48} />
                              <div className="text-white font-bold text-lg text-center">
                                Mystery Card
                              </div>
                              <div className="text-white/80 text-sm mt-2">
                                Klikněte pro výběr
                              </div>
                            </div>
                          ) : (
                            // Odhalená karta
                            <div className="w-full h-full">
                              {cardRevealing && card.videoPath && (
                                <video
                                  src={card.videoPath}
                                  autoPlay
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                  onEnded={() => setCardRevealing(false)}
                                />
                              )}
                              {!cardRevealing && (
                                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex flex-col items-center justify-center p-4">
                                  <Star className="text-white mb-3 animate-pulse" size={48} />
                                  <div className="text-white font-bold text-lg text-center">
                                    {card.name}
                                  </div>
                                  <div className="text-yellow-300 text-sm mt-1">
                                    {card.edition}
                                  </div>
                                  <div className="flex items-center gap-1 mt-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        size={16} 
                                        className="text-yellow-300 fill-yellow-300"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                        
                        {/* Název karty pod ní */}
                        <div className="text-center mt-2">
                          <p className="font-semibold text-gray-900">
                            {selectedCard === card ? card.name : '???'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedCard && claiming && (
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Loader className="animate-spin" size={20} />
                        <span>Ukládám odměnu...</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Success state
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4 animate-bounce">
                    <Check className="text-green-600" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Odměna vyzvednuta!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Karta {selectedCard?.name} byla přidána do vaší sbírky.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/sbirka-karet')}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Package size={20} />
                      Zobrazit sbírku
                    </button>
                    
                    <button
                      onClick={closeModalAfterSuccess}
                      className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all inline-flex items-center justify-center gap-2"
                    >
                      Pokračovat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}