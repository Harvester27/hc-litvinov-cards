'use client';

import React, { useState, useEffect } from 'react';
import { 
  Grid3x3, User, ChevronLeft, ChevronRight, 
  TrendingUp, Award, BookOpen, BarChart3, Coins,
  X
} from 'lucide-react';
import { 
  CARD_ATTRIBUTES, 
  calculateOverall, 
  getUpgradeCost,
  getCardById 
} from '@/data/lancersDynasty/obycejneKartyLancers';

// Komponenta pro jednu kartu ve sbírce
const CollectionCard = ({ cardData, userCardData, onUpgrade, credits, onClick }) => {
  const cardInfo = getCardById(cardData.id);
  const overall = calculateOverall(userCardData.attributes || {});

  return (
    <div 
      className="relative w-56 h-80 mx-auto cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onClick(cardData)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0">
        {/* Přední strana - klasická karta */}
        <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl border-4 border-gray-400 shadow-2xl overflow-hidden">
          {/* Header s pozicí a overall */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2">
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-xs font-bold uppercase">{cardInfo.position}</span>
              <div className="flex items-center gap-1">
                <span className="text-white text-lg font-black">{overall}</span>
                <div className="text-xs text-gray-300">OVR</div>
              </div>
            </div>
          </div>

          {/* Obrázek hráče */}
          <div className="relative h-48 bg-gradient-to-b from-gray-600 to-gray-500 flex items-center justify-center">
            <img 
              src={cardInfo.imageUrl}
              alt={cardInfo.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 items-center justify-center hidden">
              <User className="text-gray-400" size={60} />
            </div>
            
            {/* Číslo dresu */}
            <div className="absolute top-2 right-2 bg-red-600/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white text-sm font-bold">#{cardInfo.number}</span>
            </div>
          </div>

          {/* Jméno hráče a typ karty s logem */}
          <div className="flex-1 flex flex-col justify-center items-center py-4 px-3 bg-gradient-to-b from-gray-700 to-gray-800">
            <h3 className="text-white font-bold text-center text-base mb-3">
              {cardInfo.name}
            </h3>
            
            {/* Logo a typ karty */}
            <div className="flex items-center gap-2">
              <img 
                src="/images/loga/lancers-logo.png"
                alt="HC Litvínov"
                className="h-6 w-6 object-contain"
              />
              <div className="text-gray-400 text-sm font-medium">
                Obyčejná karta
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal komponenta pro zvětšenou kartu
const CardModal = ({ cardData, isOpen, onClose, onNext, onPrev, credits, onUpgrade }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState('attributes');
  
  const cardInfo = getCardById(cardData?.id);
  const overall = cardData ? calculateOverall(cardData.attributes || {}) : 1;

  useEffect(() => {
    // Reset při změně karty
    setIsFlipped(false);
    setActiveTab('attributes');
  }, [cardData?.id]);

  useEffect(() => {
    // ESC pro zavření
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Šipky pro navigaci
    const handleArrows = (e) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('keydown', handleArrows);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleArrows);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !cardData || !cardInfo) return null;

  const handleRightClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  const handleUpgradeAttribute = (attrKey) => {
    const currentLevel = cardData.attributes[attrKey];
    if (currentLevel >= 10) return;
    
    const cost = getUpgradeCost(currentLevel);
    if (credits < cost) {
      alert('Nedostatek kreditů!');
      return;
    }

    onUpgrade(cardData.id, attrKey, cost);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Navigační šipky */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Zavírací křížek */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-8 right-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
      >
        <X className="text-white" size={20} />
      </button>

      {/* Zvětšená karta */}
      <div 
        className="relative w-80 h-[450px]"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={handleRightClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className={`absolute inset-0 transition-all duration-700 ${
            isFlipped ? '' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Přední strana */}
          <div 
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl border-4 border-gray-400 shadow-2xl overflow-hidden">
              {/* Header s pozicí a overall */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm font-bold uppercase">{cardInfo.position}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white text-2xl font-black">{overall}</span>
                    <div className="text-sm text-gray-300">OVR</div>
                  </div>
                </div>
              </div>

              {/* Obrázek hráče */}
              <div className="relative h-64 bg-gradient-to-b from-gray-600 to-gray-500 flex items-center justify-center">
                <img 
                  src={cardInfo.imageUrl}
                  alt={cardInfo.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 items-center justify-center hidden">
                  <User className="text-gray-400" size={80} />
                </div>
                
                {/* Číslo dresu */}
                <div className="absolute top-3 right-3 bg-red-600/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">#{cardInfo.number}</span>
                </div>
              </div>

              {/* Jméno hráče */}
              <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 bg-gradient-to-b from-gray-700 to-gray-800">
                <h3 className="text-white font-bold text-center text-xl mb-4">
                  {cardInfo.name}
                </h3>
                
                {/* Logo a typ karty */}
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/loga/lancers-logo.png"
                    alt="HC Litvínov"
                    className="h-8 w-8 object-contain"
                  />
                  <div className="text-gray-400 text-base font-medium">
                    Obyčejná karta
                  </div>
                </div>
              </div>

              {/* Hint pro otočení */}
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white/60 text-xs">Pravý klik pro detaily</span>
              </div>
            </div>
          </div>

          {/* Zadní strana */}
          <div 
            className="absolute inset-0"
            style={{ 
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-4 border-gray-600 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">{cardInfo.name}</span>
                  <span className="text-white/90 text-sm">OVR: {overall}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('attributes')}
                  className={`flex-1 px-3 py-2 text-sm font-bold transition-colors ${
                    activeTab === 'attributes' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={16} className="inline mr-1" />
                  Atributy
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-3 py-2 text-sm font-bold transition-colors ${
                    activeTab === 'history' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={16} className="inline mr-1" />
                  Historie
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 px-3 py-2 text-sm font-bold transition-colors ${
                    activeTab === 'stats' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BarChart3 size={16} className="inline mr-1" />
                  Statistiky
                </button>
              </div>

              {/* Content */}
              <div className="p-4 h-[300px] overflow-y-auto">
                {activeTab === 'attributes' && (
                  <div className="space-y-3">
                    {CARD_ATTRIBUTES.map((attr) => {
                      const level = cardData.attributes?.[attr.key] || 1;
                      const cost = getUpgradeCost(level);
                      const canAfford = credits >= cost;
                      const isMaxLevel = level >= 10;

                      return (
                        <div key={attr.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xl">{attr.icon}</span>
                            <span className="text-gray-300 text-sm">{attr.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2.5 h-5 rounded-sm ${
                                    i < level ? 'bg-yellow-400' : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                            {!isMaxLevel && (
                              <button
                                onClick={() => handleUpgradeAttribute(attr.key)}
                                disabled={!canAfford}
                                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                  canAfford 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <Coins size={12} className="inline mr-1" />
                                {cost}
                              </button>
                            )}
                            {isMaxLevel && (
                              <span className="text-yellow-400 text-xs font-bold">MAX</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="text-gray-300 text-sm space-y-3">
                    <p>{cardInfo.history}</p>
                    <div className="mt-4">
                      <h4 className="text-white font-bold mb-2">Úspěchy:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {cardInfo.achievements.map((achievement, i) => (
                          <li key={i} className="text-gray-400">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-gray-400">Výška</div>
                      <div className="text-white font-bold text-lg">{cardInfo.height} cm</div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-gray-400">Váha</div>
                      <div className="text-white font-bold text-lg">{cardInfo.weight} kg</div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-gray-400">Hůl</div>
                      <div className="text-white font-bold text-lg">{cardInfo.shoots}</div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-gray-400">Ročník</div>
                      <div className="text-white font-bold text-lg">{cardInfo.birthYear}</div>
                    </div>
                    <div className="col-span-2 bg-gray-800 rounded p-3">
                      <div className="text-gray-400">Získáno</div>
                      <div className="text-white font-bold">
                        {cardData.acquiredAt || 'Dnes'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hint pro otočení zpět */}
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white/60 text-xs">Pravý klik zpět</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigační hinty */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white/60 text-sm">
          ← → pro navigaci • ESC pro zavření • Pravý klik pro otočení
        </span>
      </div>
    </div>
  );
};

// Hlavní komponenta sbírky
export default function LancersDynastyCollection({ 
  collection, 
  onBack, 
  credits, 
  onUpgradeCard 
}) {
  const [filter, setFilter] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const filteredCollection = filter === 'all' 
    ? collection 
    : collection.filter(card => {
        const cardInfo = getCardById(card.id);
        if (filter === 'attack') return cardInfo.position === 'Útočník';
        if (filter === 'defense') return cardInfo.position === 'Obránce';
        if (filter === 'goalie') return cardInfo.position === 'Brankář';
        return true;
      });

  // Spočítat unikátní karty
  const uniqueCards = [...new Set(collection.map(c => c.id))];
  const duplicates = collection.length - uniqueCards.length;

  // Aktualizovat selectedCard když se změní collection (po vylepšení)
  useEffect(() => {
    if (selectedCard) {
      // Najít aktualizovanou verzi karty v kolekci
      const updatedCard = collection.find((card, idx) => {
        // Najít kartu podle ID a původního indexu
        return card.id === selectedCard.id && collection.indexOf(card) === selectedIndex;
      });
      
      if (!updatedCard && collection.length > 0) {
        // Pokud karta neexistuje, použij kartu na stejném indexu
        const cardAtIndex = filteredCollection[selectedIndex];
        if (cardAtIndex) {
          setSelectedCard(cardAtIndex);
        }
      } else if (updatedCard) {
        // Aktualizovat vybranou kartu
        setSelectedCard(updatedCard);
      }
    }
  }, [collection]); // Sledovat pouze změny v collection

  const handleCardClick = (card) => {
    const index = filteredCollection.findIndex((c, idx) => 
      c.id === card.id && idx === filteredCollection.indexOf(card)
    );
    setSelectedIndex(index);
    setSelectedCard(card);
  };

  const handleNext = () => {
    if (filteredCollection.length > 0) {
      const nextIndex = (selectedIndex + 1) % filteredCollection.length;
      setSelectedIndex(nextIndex);
      setSelectedCard(filteredCollection[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (filteredCollection.length > 0) {
      const prevIndex = selectedIndex === 0 ? filteredCollection.length - 1 : selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedCard(filteredCollection[prevIndex]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-black text-white">Moje sbírka</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all"
          >
            Zpět na balíčky
          </button>
        </div>

        {/* Stats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-black text-yellow-400">{collection.length}</div>
              <div className="text-gray-400 text-sm">Celkem karet</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400">{uniqueCards.length}</div>
              <div className="text-gray-400 text-sm">Unikátních</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">{duplicates}</div>
              <div className="text-gray-400 text-sm">Duplikátů</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'all' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Všichni ({collection.length})
          </button>
          <button
            onClick={() => setFilter('attack')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'attack' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Útočníci
          </button>
          <button
            onClick={() => setFilter('defense')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'defense' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Obránci
          </button>
          <button
            onClick={() => setFilter('goalie')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'goalie' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Brankáři
          </button>
        </div>

        {/* Cards Grid */}
        {filteredCollection.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCollection.map((card, index) => (
              <div key={`${card.id}-${index}`}>
                <CollectionCard 
                  cardData={card}
                  userCardData={card}
                  credits={credits}
                  onUpgrade={onUpgradeCard}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid3x3 className="text-gray-600 mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Sbírka je prázdná</h3>
            <p className="text-gray-500">Otevři balíčky a začni sbírat karty!</p>
          </div>
        )}
      </div>

      {/* Card Modal */}
      <CardModal
        cardData={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        credits={credits}
        onUpgrade={onUpgradeCard}
      />

    </div>
  );
}