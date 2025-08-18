"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle, Users, User, Plus, X, Trophy } from 'lucide-react';
import { getCardById, calculateOverall } from '@/data/lancersDynasty/obycejneKartyLancers';

/**
 * Aktivita - Vybrat tým
 * Sestavení základní sestavy z dostupných karet
 * NOVÉ: Trigger pro přátelský zápas při 12+ hráčích
 */
export default function TeamSelectionActivity({ 
  onComplete, 
  onBack, 
  myCollection = [],
  onTeamSelected = () => {},
  onTeamReadyForMatch = () => {} // NOVÉ - callback když je tým připraven na zápas
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [filter, setFilter] = useState('all');
  const [bestCards, setBestCards] = useState([]);
  
  const maxPlayers = 20; // ZMĚNĚNO - umožnit vybrat více hráčů pro náhradníky
  const minPlayersForMatch = 12; // NOVÉ - minimum pro přátelský zápas
  
  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  // Při změně kolekce vytvořit seznam nejlepších karet každého hráče
  useEffect(() => {
    if (myCollection.length === 0) {
      setBestCards([]);
      return;
    }
    
    // Grupovat karty podle ID hráče
    const cardsByPlayer = {};
    
    myCollection.forEach(userCard => {
      const cardInfo = getCardById(userCard.id);
      if (!cardInfo) return;
      
      const overall = calculateOverall(userCard.attributes || {});
      
      // Pokud tento hráč ještě není v seznamu nebo má tato karta lepší overall
      if (!cardsByPlayer[userCard.id] || cardsByPlayer[userCard.id].overall < overall) {
        cardsByPlayer[userCard.id] = {
          ...cardInfo,  // Všechny informace o kartě (jméno, pozice, fotka...)
          ...userCard,  // Uživatelská data (atributy, ID...)
          overall: overall,
          uniqueId: `${userCard.id}-best`,
          displayName: cardInfo.name,
          displayPosition: cardInfo.position,
          imageUrl: cardInfo.imageUrl
        };
      }
    });
    
    // Převést na pole a seřadit podle overallu
    const sortedCards = Object.values(cardsByPlayer).sort((a, b) => b.overall - a.overall);
    setBestCards(sortedCards);
  }, [myCollection]);
  
  // Filtrované karty podle pozice
  const getFilteredCards = () => {
    if (filter === 'all') return bestCards;
    if (filter === 'attack') return bestCards.filter(card => card.displayPosition === 'Útočník');
    if (filter === 'defense') return bestCards.filter(card => card.displayPosition === 'Obránce');
    if (filter === 'goalie') return bestCards.filter(card => card.displayPosition === 'Brankář');
    return bestCards;
  };
  
  const handleSelectPlayer = (card) => {
    const uniqueId = card.uniqueId;
    
    if (selectedPlayers.find(p => p.uniqueId === uniqueId)) {
      // Odebrat hráče
      setSelectedPlayers(prev => prev.filter(p => p.uniqueId !== uniqueId));
    } else if (selectedPlayers.length < maxPlayers) {
      // Přidat hráče s všemi informacemi (můžeme až 20 hráčů)
      const playerWithFullInfo = {
        ...card,
        id: card.id,
        uniqueId: uniqueId,
        name: card.displayName,
        position: card.displayPosition,
        overall: card.overall
      };
      
      console.log('Vybírám hráče:', playerWithFullInfo);
      setSelectedPlayers(prev => [...prev, playerWithFullInfo]);
    } else {
      // Dosažen maximální počet
      alert(`Můžeš vybrat maximálně ${maxPlayers} hráčů!`);
    }
  };
  
  const handleConfirmSelection = () => {
    if (selectedPlayers.length > 0) {
      // Ujistit se že každý hráč má unikátní ID pro WhatsApp
      const uniquePlayers = selectedPlayers.map((player, idx) => ({
        ...player,
        uniqueId: `${player.id}-selected-${idx}-${Date.now()}`
      }));
      
      console.log('Předávám tým:', uniquePlayers);
      onTeamSelected(uniquePlayers);
      
      // NOVÉ - Pokud je 12+ hráčů, spustit trigger pro přátelský zápas
      if (uniquePlayers.length >= minPlayersForMatch) {
        console.log('Tým má dostatek hráčů pro přátelský zápas!');
        setTimeout(() => {
          onTeamReadyForMatch();
        }, 1500); // Malé zpoždění pro plynulost
      }
      
      setShowResult(true);
    }
  };
  
  const handleCompleteActivity = () => {
    onComplete();
  };
  
  const getPositionColor = (position) => {
    if (position === 'Útočník') return 'from-red-500 to-red-600';
    if (position === 'Obránce') return 'from-blue-500 to-blue-600';
    if (position === 'Brankář') return 'from-green-500 to-green-600';
    return 'from-gray-500 to-gray-600';
  };
  
  const getPositionIcon = (position) => {
    if (position === 'Útočník') return '⚔️';
    if (position === 'Obránce') return '🛡️';
    if (position === 'Brankář') return '🥅';
    return '🏒';
  };
  
  const filteredCards = getFilteredCards();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-800 to-red-900">
      {/* Animované pozadí */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] border-4 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[300px] bg-white/20" />
        </div>
      </div>
      
      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden
        transform transition-all duration-500 border border-red-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-red-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-red-400" size={32} />
            Výběr týmu
          </h2>
          <div className="flex flex-col items-end">
            <div className="px-3 py-1 bg-red-600/30 rounded-full">
              <span className="text-white text-sm font-bold">
                {selectedPlayers.length}/{maxPlayers} hráčů
              </span>
            </div>
            {/* NOVÉ - Indikátor pro přátelský zápas */}
            {selectedPlayers.length >= minPlayersForMatch && (
              <div className="mt-1 px-2 py-0.5 bg-green-600/30 rounded-full animate-pulse">
                <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <Trophy size={12} />
                  Připraven na zápas!
                </span>
              </div>
            )}
            {selectedPlayers.length < minPlayersForMatch && (
              <div className="mt-1 text-yellow-400 text-xs">
                Potřebuješ min. 12 hráčů pro přátelák
              </div>
            )}
          </div>
        </div>
        
        {/* NOVÉ - Info panel pro přátelský zápas */}
        {selectedPlayers.length > 0 && selectedPlayers.length < minPlayersForMatch && (
          <div className="mb-4 p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <Trophy size={16} />
              Vyber ještě {minPlayersForMatch - selectedPlayers.length} hráč{minPlayersForMatch - selectedPlayers.length === 1 ? 'e' : minPlayersForMatch - selectedPlayers.length < 5 ? 'e' : 'ů'} pro možnost přátelského zápasu!
            </p>
          </div>
        )}
        
        {selectedPlayers.length >= minPlayersForMatch && (
          <div className="mb-4 p-3 bg-green-600/20 rounded-lg border border-green-500/30 animate-pulse">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <Trophy size={16} />
              Skvělé! Máš dostatek hráčů pro přátelský zápas! 🏒
            </p>
          </div>
        )}
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            {/* Filtry */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black/30 text-gray-400 hover:bg-black/50'
                }`}
              >
                Všichni ({bestCards.length})
              </button>
              <button
                onClick={() => setFilter('attack')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'attack' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black/30 text-gray-400 hover:bg-black/50'
                }`}
              >
                Útočníci
              </button>
              <button
                onClick={() => setFilter('defense')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'defense' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black/30 text-gray-400 hover:bg-black/50'
                }`}
              >
                Obránci
              </button>
              <button
                onClick={() => setFilter('goalie')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'goalie' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-black/30 text-gray-400 hover:bg-black/50'
                }`}
              >
                Brankáři
              </button>
            </div>
            
            {/* Vybraní hráči */}
            {selectedPlayers.length > 0 && (
              <div className="bg-black/30 rounded-xl p-4 border border-red-500/30">
                <h3 className="text-white font-bold mb-3">Vybraná sestava:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlayers.map(player => (
                    <div 
                      key={player.uniqueId}
                      className="bg-red-600/30 rounded-lg px-3 py-1 flex items-center gap-2"
                    >
                      <span className="text-white text-sm">{player.name}</span>
                      <button
                        onClick={() => {
                          setSelectedPlayers(prev => prev.filter(p => p.uniqueId !== player.uniqueId));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seznam hráčů */}
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto pr-2">
                {filteredCards.map((card) => {
                  const isSelected = selectedPlayers.find(p => p.uniqueId === card.uniqueId);
                  
                  return (
                    <button
                      key={card.uniqueId}
                      onClick={() => handleSelectPlayer(card)}
                      disabled={!isSelected && selectedPlayers.length >= maxPlayers}
                      className={`
                        relative rounded-xl overflow-hidden transition-all transform
                        ${isSelected 
                          ? 'scale-105 ring-2 ring-green-400' 
                          : 'hover:scale-102'
                        }
                        ${!isSelected && selectedPlayers.length >= maxPlayers 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer'
                        }
                      `}
                    >
                      {/* Karta ve stylu sbírky */}
                      <div className="w-full h-64 bg-gradient-to-br from-gray-500 to-gray-700 border-2 border-gray-400">
                        {/* Header s pozicí a overall */}
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1">
                          <div className="flex justify-between items-center">
                            <span className="text-white/90 text-xs font-bold uppercase">
                              {card.displayPosition}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-white text-lg font-black">{card.overall}</span>
                              <div className="text-xs text-gray-300">OVR</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Obrázek hráče */}
                        <div className="relative h-32 bg-gradient-to-b from-gray-600 to-gray-500 flex items-center justify-center">
                          {card.imageUrl ? (
                            <img 
                              src={card.imageUrl}
                              alt={card.displayName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="absolute inset-0 items-center justify-center hidden">
                            <User className="text-gray-400" size={40} />
                          </div>
                          
                          {/* Číslo dresu */}
                          {card.number && (
                            <div className="absolute top-1 right-1 bg-red-600/80 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">#{card.number}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Jméno hráče */}
                        <div className="flex-1 flex flex-col justify-center items-center py-2 px-2 bg-gradient-to-b from-gray-700 to-gray-800">
                          <h3 className="text-white font-bold text-center text-sm">
                            {card.displayName}
                          </h3>
                          
                          {/* Logo a typ karty */}
                          <div className="flex items-center gap-1 mt-1">
                            <img 
                              src="/images/loga/lancers-logo.png"
                              alt="HC Litvínov"
                              className="h-4 w-4 object-contain"
                            />
                            <div className="text-gray-400 text-xs">
                              Obyčejná
                            </div>
                          </div>
                        </div>
                        
                        {/* Checkmark pro vybrané */}
                        {isSelected && (
                          <div className="absolute top-2 left-2">
                            <CheckCircle className="text-green-400 drop-shadow-lg" size={24} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-white text-lg mb-2">
                  Nemáš žádné karty ve sbírce
                </p>
                <p className="text-gray-400 text-sm">
                  Nejdřív si otevři nějaké balíčky karet!
                </p>
              </div>
            )}
            
            {/* Tlačítko potvrzení */}
            <button
              onClick={handleConfirmSelection}
              disabled={selectedPlayers.length === 0}
              className={`
                w-full py-4 font-bold text-lg rounded-xl transition-all transform shadow-xl
                ${selectedPlayers.length > 0
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {selectedPlayers.length > 0 
                ? `Potvrdit výběr (${selectedPlayers.length} hráčů)${selectedPlayers.length >= minPlayersForMatch ? ' - Přátelák možný! 🏒' : ''}`
                : 'Vyber alespoň jednoho hráče'
              }
            </button>
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-8">
              <CheckCircle className="text-green-400 mx-auto mb-4 animate-bounce" size={80} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Sestava připravena!
              </h3>
              <p className="text-green-400 text-lg">
                Vybral jsi {selectedPlayers.length} hráčů
              </p>
              
              {/* NOVÉ - Notifikace o přátelském zápase */}
              {selectedPlayers.length >= minPlayersForMatch && (
                <div className="mt-4 p-3 bg-green-600/20 rounded-lg inline-block animate-pulse">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <Trophy size={16} />
                    Máš dostatek hráčů! Brzy ti přijde nabídka na přátelský zápas!
                  </p>
                </div>
              )}
            </div>
            
            {/* Shrnutí sestavy */}
            <div className="bg-black/30 rounded-xl p-4 space-y-3">
              <h4 className="text-yellow-400 font-bold mb-3">Tvoje sestava:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedPlayers.map(player => (
                  <div 
                    key={player.uniqueId}
                    className="bg-gray-800/50 rounded-lg p-2 flex items-center gap-2"
                  >
                    <span className="text-2xl">{getPositionIcon(player.position)}</span>
                    <div className="text-left">
                      <div className="text-white text-sm font-bold">{player.name}</div>
                      <div className="text-gray-400 text-xs">{player.position} • OVR {player.overall}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Celkové statistiky */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="flex justify-between text-white">
                  <span>Průměrný overall:</span>
                  <span className="text-yellow-400 font-bold">
                    {Math.round(selectedPlayers.reduce((sum, p) => sum + (p.overall || 1), 0) / selectedPlayers.length)}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCompleteActivity}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Dokončit aktivitu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}