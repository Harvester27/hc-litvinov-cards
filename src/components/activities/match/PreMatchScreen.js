"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Users, Star, AlertCircle, X, Check, ShoppingCart } from 'lucide-react';
import { getCardById, calculateOverall } from '@/data/lancersDynasty/obycejneKartyLancers';

/**
 * Předzápasová obrazovka
 * - Výběr 11 hráčů (1 brankář, 2 LW, 2 C, 2 RW, 2 LD, 2 RD)
 * - Zobrazení sestav obou týmů
 * - Tlačítko "Spustit zápas"
 */
export default function PreMatchScreen({
  opponent,
  myCollection = [],
  credits = 0,
  onTeamSelected,
  onBack,
  onGoToPacks
}) {
  const [selectedPlayers, setSelectedPlayers] = useState({
    goalie: null,      // 1 brankář
    lw: [],            // 2 levá křídla
    center: [],        // 2 centři
    rw: [],            // 2 pravá křídla
    ld: [],            // 2 levý obránce
    rd: []             // 2 pravý obránce
  });

  const [currentPosition, setCurrentPosition] = useState(null); // Pro výběrový modal
  const [showLineup, setShowLineup] = useState(false); // Zobrazit sestavy
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  // Mapování pozic z databáze na herní pozice
  const positionMapping = {
    'Útočník': ['lw', 'center', 'rw'], // Útočníky můžeme použít na křídla i centr
    'Obránce': ['ld', 'rd'],           // Obránci na levou/pravou
    'Brankář': ['goalie']              // Brankáři jen na branku
  };

  // Získat hráče podle pozice
  const getPlayersForPosition = (position) => {
    return myCollection.filter(card => {
      const cardInfo = getCardById(card.id);
      if (!cardInfo) return false;

      const cardPosition = cardInfo.position;
      const allowedPositions = positionMapping[cardPosition] || [];
      return allowedPositions.includes(position);
    });
  };

  // Kontrola jestli je hráč už vybraný
  const isPlayerSelected = (card) => {
    if (selectedPlayers.goalie?.uniqueId === card.uniqueId) return true;
    for (const pos of ['lw', 'center', 'rw', 'ld', 'rd']) {
      if (selectedPlayers[pos].some(p => p.uniqueId === card.uniqueId)) return true;
    }
    return false;
  };

  // Vybrat hráče na pozici
  const selectPlayer = (position, card) => {
    if (position === 'goalie') {
      setSelectedPlayers(prev => ({ ...prev, goalie: card }));
    } else {
      setSelectedPlayers(prev => {
        const maxCount = 2;
        const current = prev[position] || [];

        // Pokud už je vybraný, odebrat
        if (current.some(p => p.uniqueId === card.uniqueId)) {
          return {
            ...prev,
            [position]: current.filter(p => p.uniqueId !== card.uniqueId)
          };
        }

        // Jinak přidat (max 2)
        if (current.length < maxCount) {
          return {
            ...prev,
            [position]: [...current, card]
          };
        }

        return prev;
      });
    }
  };

  // Kontrola jestli je sestava kompletní
  const isLineupComplete = () => {
    return selectedPlayers.goalie &&
           selectedPlayers.lw.length === 2 &&
           selectedPlayers.center.length === 2 &&
           selectedPlayers.rw.length === 2 &&
           selectedPlayers.ld.length === 2 &&
           selectedPlayers.rd.length === 2;
  };

  // Spočítat overall týmu
  const calculateTeamOverall = () => {
    const allPlayers = [
      selectedPlayers.goalie,
      ...selectedPlayers.lw,
      ...selectedPlayers.center,
      ...selectedPlayers.rw,
      ...selectedPlayers.ld,
      ...selectedPlayers.rd
    ].filter(Boolean);

    if (allPlayers.length === 0) return 0;

    const totalOverall = allPlayers.reduce((sum, player) => {
      return sum + calculateOverall(player.attributes || {});
    }, 0);

    return Math.round(totalOverall / allPlayers.length);
  };

  // Spustit zápas
  const handleStartMatch = () => {
    if (!isLineupComplete()) {
      alert('Musíš vybrat kompletní sestavu (11 hráčů)!');
      return;
    }

    // Předat vybrané hráče
    const lineup = {
      goalie: selectedPlayers.goalie,
      forwards: [...selectedPlayers.lw, ...selectedPlayers.center, ...selectedPlayers.rw],
      defense: [...selectedPlayers.ld, ...selectedPlayers.rd],
      teamOverall: calculateTeamOverall()
    };

    onTeamSelected(lineup);
  };

  // Pokud ukazujeme sestavy
  if (showLineup) {
    const myTeamOverall = calculateTeamOverall();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className={`
          relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto
          transform transition-all duration-500 border border-blue-400/30
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowLineup(false)}
              className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Zpět k výběru</span>
            </button>
            <h2 className="text-3xl font-black text-white">
              Předz\u00e1pasov\u00e1 sestava
            </h2>
            <div className="w-40" />
          </div>

          {/* Sestavy */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Náš tým */}
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">
                  HC Lancers
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <Star className="text-yellow-400" size={20} fill="currentColor" />
                  <span className="text-yellow-400 font-bold text-xl">
                    {myTeamOverall}
                  </span>
                </div>
              </div>

              {/* Brankář */}
              <div className="mb-4">
                <h4 className="text-blue-300 font-bold text-sm mb-2">BRANKÁŘ</h4>
                {selectedPlayers.goalie && (
                  <PlayerCard card={selectedPlayers.goalie} />
                )}
              </div>

              {/* Útočníci */}
              <div className="mb-4">
                <h4 className="text-blue-300 font-bold text-sm mb-2">ÚTOČNÍCI</h4>
                <div className="space-y-1">
                  {[...selectedPlayers.lw, ...selectedPlayers.center, ...selectedPlayers.rw].map((player, idx) => (
                    <PlayerCard key={idx} card={player} small />
                  ))}
                </div>
              </div>

              {/* Obránci */}
              <div>
                <h4 className="text-blue-300 font-bold text-sm mb-2">OBRÁNCI</h4>
                <div className="space-y-1">
                  {[...selectedPlayers.ld, ...selectedPlayers.rd].map((player, idx) => (
                    <PlayerCard key={idx} card={player} small />
                  ))}
                </div>
              </div>
            </div>

            {/* Soupeřův tým */}
            <div className="bg-red-600/20 border border-red-400/30 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{opponent.logo}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {opponent.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <Star className="text-yellow-400" size={20} fill="currentColor" />
                  <span className="text-yellow-400 font-bold text-xl">
                    {opponent.teamOverall}
                  </span>
                </div>
              </div>

              <div className="text-center text-white/60 py-8">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>Sestava soupeře je připravena</p>
              </div>
            </div>
          </div>

          {/* Tlačítko spustit zápas */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartMatch}
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
            >
              🏒 Spustit zápas!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hlavní obrazovka výběru hráčů
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto
        transform transition-all duration-500 border border-indigo-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white">
            Vyber sestavu (11 hráčů)
          </h2>
          <button
            onClick={onGoToPacks}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            <ShoppingCart size={16} />
            <span>Koupit balíčky</span>
          </button>
        </div>

        {/* Info o soupeři */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{opponent.logo}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl">{opponent.name}</h3>
              <p className="text-white/70">Síla týmu: {opponent.teamOverall}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Vybraných hráčů:</p>
              <p className="text-white font-bold text-2xl">
                {(selectedPlayers.goalie ? 1 : 0) +
                 selectedPlayers.lw.length +
                 selectedPlayers.center.length +
                 selectedPlayers.rw.length +
                 selectedPlayers.ld.length +
                 selectedPlayers.rd.length} / 11
              </p>
            </div>
          </div>
        </div>

        {/* Pozice k výběru */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <PositionSlot
            label="Brankář"
            icon="🥅"
            position="goalie"
            selected={selectedPlayers.goalie}
            count={selectedPlayers.goalie ? 1 : 0}
            max={1}
            onClick={() => setCurrentPosition('goalie')}
          />
          <PositionSlot
            label="Levá křídla"
            icon="⬅️"
            position="lw"
            selected={selectedPlayers.lw}
            count={selectedPlayers.lw.length}
            max={2}
            onClick={() => setCurrentPosition('lw')}
          />
          <PositionSlot
            label="Centři"
            icon="🎯"
            position="center"
            selected={selectedPlayers.center}
            count={selectedPlayers.center.length}
            max={2}
            onClick={() => setCurrentPosition('center')}
          />
          <PositionSlot
            label="Pravá křídla"
            icon="➡️"
            position="rw"
            selected={selectedPlayers.rw}
            count={selectedPlayers.rw.length}
            max={2}
            onClick={() => setCurrentPosition('rw')}
          />
          <PositionSlot
            label="Levý obránci"
            icon="🛡️"
            position="ld"
            selected={selectedPlayers.ld}
            count={selectedPlayers.ld.length}
            max={2}
            onClick={() => setCurrentPosition('ld')}
          />
          <PositionSlot
            label="Pravý obránci"
            icon="🛡️"
            position="rd"
            selected={selectedPlayers.rd}
            count={selectedPlayers.rd.length}
            max={2}
            onClick={() => setCurrentPosition('rd')}
          />
        </div>

        {/* Tlačítko zobrazit sestavy */}
        {isLineupComplete() && (
          <div className="text-center">
            <button
              onClick={() => setShowLineup(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Zobrazit sestavy a pokračovat →
            </button>
          </div>
        )}

        {/* Modal pro výběr hráče */}
        {currentPosition && (
          <PlayerSelectionModal
            position={currentPosition}
            players={getPlayersForPosition(currentPosition)}
            selectedPlayers={selectedPlayers}
            onSelect={(card) => {
              selectPlayer(currentPosition, card);
            }}
            onClose={() => setCurrentPosition(null)}
            isPlayerSelected={isPlayerSelected}
          />
        )}
      </div>
    </div>
  );
}

// Komponenta pro slot pozice
function PositionSlot({ label, icon, position, selected, count, max, onClick }) {
  const isComplete = count === max;

  return (
    <div
      onClick={onClick}
      className={`
        bg-black/30 border-2 rounded-xl p-4 cursor-pointer transition-all transform hover:scale-105
        ${isComplete ? 'border-green-400' : 'border-gray-600 hover:border-white/40'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        {isComplete && <Check className="text-green-400" size={24} />}
      </div>
      <h3 className="text-white font-bold mb-1">{label}</h3>
      <p className={`text-sm font-bold ${
        isComplete ? 'text-green-400' : 'text-yellow-400'
      }`}>
        {count}/{max} vybraných
      </p>
    </div>
  );
}

// Modal pro výběr hráče
function PlayerSelectionModal({ position, players, selectedPlayers, onSelect, onClose, isPlayerSelected }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              Vyber hráče
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Seznam hráčů */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
          {players.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="text-yellow-400 mx-auto mb-4" size={48} />
              <p className="text-white text-lg">Nemáš žádné hráče na tuto pozici</p>
              <p className="text-gray-400 text-sm mt-2">Zkus koupit balíčky</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {players.map((card, idx) => {
                const cardInfo = getCardById(card.id);
                const overall = calculateOverall(card.attributes || {});
                const selected = isPlayerSelected(card);

                return (
                  <div
                    key={`${card.uniqueId || card.id}-${idx}`}
                    onClick={() => onSelect(card)}
                    className={`
                      bg-black/30 rounded-lg p-4 cursor-pointer transition-all transform hover:scale-105 border-2
                      ${selected ? 'border-green-400 bg-green-500/20' : 'border-gray-600 hover:border-white/40'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🏒</div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{cardInfo?.name || 'Neznámý hráč'}</h4>
                        <p className="text-gray-400 text-sm">{cardInfo?.position}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="text-yellow-400" size={14} fill="currentColor" />
                          <span className="text-white font-bold">{overall}</span>
                        </div>
                        {selected && (
                          <Check className="text-green-400" size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponenta pro kartu hráče v sestavě
function PlayerCard({ card, small = false }) {
  const cardInfo = getCardById(card.id);
  const overall = calculateOverall(card.attributes || {});

  return (
    <div className={`bg-black/30 rounded-lg ${small ? 'p-2' : 'p-3'} border border-white/10`}>
      <div className="flex items-center gap-2">
        <div className={small ? 'text-xl' : 'text-2xl'}>🏒</div>
        <div className="flex-1">
          <h5 className={`text-white font-bold ${small ? 'text-sm' : ''}`}>
            {cardInfo?.name || 'Neznámý hráč'}
          </h5>
          {!small && (
            <p className="text-gray-400 text-xs">{cardInfo?.position}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Star className="text-yellow-400" size={small ? 12 : 14} fill="currentColor" />
          <span className={`text-white font-bold ${small ? 'text-sm' : ''}`}>{overall}</span>
        </div>
      </div>
    </div>
  );
}
