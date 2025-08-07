import React, { useState } from 'react';
import { 
  Package, X, Sparkles, Star, Trophy, Zap, 
  Crown, Gem, ShoppingCart, ArrowLeft, Coins
} from 'lucide-react';

// Konfigurace balíčků
const PACK_TYPES = [
  {
    id: 'starter',
    name: 'Startovní balíček',
    cards: 5,
    price: 100,
    color: 'from-blue-400 to-blue-600',
    icon: '⭐',
    description: 'Základní balíček pro začátečníky',
    guaranteed: 'Garantovaná 1x modrá karta'
  },
  {
    id: 'silver',
    name: 'Stříbrný balíček',
    cards: 7,
    price: 180,
    color: 'from-gray-400 to-gray-600',
    icon: '🥈',
    description: 'Lepší šance na vzácné karty',
    guaranteed: 'Garantovaná 1x stříbrná karta'
  },
  {
    id: 'gold',
    name: 'Zlatý balíček',
    cards: 8,
    price: 250,
    color: 'from-yellow-400 to-yellow-600',
    icon: '🥇',
    description: 'Premium balíček s bonusem',
    guaranteed: 'Garantovaná 1x zlatá karta'
  },
  {
    id: 'legendary',
    name: 'Legendární balíček',
    cards: 10,
    price: 400,
    color: 'from-purple-400 to-pink-600',
    icon: '💎',
    description: 'Nejvzácnější karty týmu',
    guaranteed: 'Garantované 2x speciální karty'
  }
];

// Příklady hráčů HC Litvínov
const PLAYERS = [
  { name: 'David Kaše', position: 'Útočník', rating: 95, rarity: 'legendary' },
  { name: 'Petr Koblasa', position: 'Útočník', rating: 88, rarity: 'gold' },
  { name: 'Ondřej Kaše', position: 'Útočník', rating: 92, rarity: 'legendary' },
  { name: 'Matěj Pekr', position: 'Obránce', rating: 85, rarity: 'silver' },
  { name: 'Nicolas Hlava', position: 'Útočník', rating: 87, rarity: 'gold' },
  { name: 'Mário Bližňák', position: 'Obránce', rating: 83, rarity: 'silver' },
  { name: 'Šimon Zajíček', position: 'Brankář', rating: 90, rarity: 'gold' },
  { name: 'Filip Helt', position: 'Útočník', rating: 82, rarity: 'common' },
  { name: 'Marek Baránek', position: 'Obránce', rating: 81, rarity: 'common' },
  { name: 'Michal Gut', position: 'Útočník', rating: 86, rarity: 'silver' }
];

// Komponenta pro jednotlivou kartu
function CardReveal({ player, index, isRevealed }) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-400 to-yellow-600',
    legendary: 'from-purple-400 to-pink-600'
  };

  const rarityGlow = {
    common: '',
    silver: 'shadow-lg shadow-gray-400/50',
    gold: 'shadow-xl shadow-yellow-400/50',
    legendary: 'shadow-2xl shadow-purple-400/50 animate-pulse'
  };

  return (
    <div
      className={`
        relative w-40 h-56 transition-all duration-700 transform preserve-3d
        ${isRevealed ? 'rotate-y-180' : ''}
        hover:scale-105 cursor-pointer
      `}
      style={{
        transformStyle: 'preserve-3d',
        animation: isRevealed ? `flipIn ${0.5 + index * 0.1}s ease-out` : 'none',
        animationDelay: `${index * 0.1}s`
      }}
    >
      {/* Zadní strana karty */}
      <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-blue-800 to-red-600 flex items-center justify-center border-4 border-white shadow-xl">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🏒</div>
          <div className="font-bold text-sm">HC LITVÍNOV</div>
          <div className="text-xs mt-1">2024/25</div>
        </div>
      </div>

      {/* Přední strana karty */}
      <div 
        className={`
          absolute inset-0 backface-hidden rotate-y-180 rounded-xl
          bg-gradient-to-br ${rarityColors[player.rarity]}
          flex flex-col items-center justify-center border-4 border-white
          ${rarityGlow[player.rarity]}
        `}
      >
        {/* Efekt pro legendární karty */}
        {player.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        )}

        <div className="relative z-10 text-center text-white p-4">
          <div className="text-5xl mb-2">
            {player.rarity === 'legendary' ? '👑' : player.rarity === 'gold' ? '⭐' : '🏒'}
          </div>
          <div className="font-bold text-lg">{player.name}</div>
          <div className="text-sm opacity-90">{player.position}</div>
          <div className="mt-3 bg-white/20 rounded-full px-3 py-1">
            <span className="text-2xl font-bold">{player.rating}</span>
          </div>
          <div className="text-xs mt-2 uppercase tracking-wider">
            {player.rarity}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hlavní komponenta Pack Shop
export default function PackShop({ coinsBalance = 1000, onClose, onPurchase }) {
  const [selectedPack, setSelectedPack] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [cardsRevealed, setCardsRevealed] = useState(false);

  // Generování náhodných karet
  const generateRandomCards = (count, packType) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      // Pro legendární balíček garantujeme lepší karty
      let availablePlayers = [...PLAYERS];
      if (packType === 'legendary' && i < 2) {
        availablePlayers = PLAYERS.filter(p => p.rarity === 'legendary' || p.rarity === 'gold');
      } else if (packType === 'gold' && i === 0) {
        availablePlayers = PLAYERS.filter(p => p.rarity === 'gold' || p.rarity === 'silver');
      } else if (packType === 'silver' && i === 0) {
        availablePlayers = PLAYERS.filter(p => p.rarity === 'silver');
      }
      
      const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      cards.push({ ...randomPlayer, id: `${randomPlayer.name}-${i}-${Date.now()}` });
    }
    return cards;
  };

  // Otevření balíčku
  const handleOpenPack = (pack) => {
    if (coinsBalance < pack.price) {
      alert(`Nemáš dostatek coinů! Potřebuješ ${pack.price} coinů.`);
      return;
    }

    setSelectedPack(pack);
    setIsOpening(true);
    
    // Generuj karty
    const cards = generateRandomCards(pack.cards, pack.id);
    setRevealedCards(cards);

    // Animace otevírání
    setTimeout(() => {
      setCardsRevealed(true);
    }, 1500);

    // Zavolej callback pro odečtení coinů
    if (onPurchase) {
      onPurchase(pack.price, cards);
    }
  };

  // Zavření a reset
  const handleCloseReveal = () => {
    setSelectedPack(null);
    setIsOpening(false);
    setRevealedCards([]);
    setCardsRevealed(false);
  };

  // Pokud otevíráme balíček, zobraz animaci
  if (isOpening && selectedPack) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 z-50 overflow-auto">
        <div className="min-h-screen p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {selectedPack.icon} Otevíráš {selectedPack.name}!
            </h2>
            {cardsRevealed && (
              <button
                onClick={handleCloseReveal}
                className="bg-white/20 backdrop-blur hover:bg-white/30 text-white p-3 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Animace balíčku před otevřením */}
          {!cardsRevealed && (
            <div className="flex items-center justify-center h-96">
              <div className={`
                relative w-48 h-64 bg-gradient-to-br ${selectedPack.color}
                rounded-2xl shadow-2xl animate-bounce
                flex items-center justify-center
              `}>
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                <div className="text-white text-center z-10">
                  <div className="text-6xl mb-2">{selectedPack.icon}</div>
                  <div className="text-xl font-bold">Otevírám...</div>
                </div>
              </div>
            </div>
          )}

          {/* Zobrazení karet */}
          {cardsRevealed && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎉 Získal jsi {revealedCards.length} karet!
                </h3>
                <p className="text-blue-200">Klikni na karty pro otočení</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {revealedCards.map((card, index) => (
                  <CardReveal
                    key={card.id}
                    player={card}
                    index={index}
                    isRevealed={cardsRevealed}
                  />
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={handleCloseReveal}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transform transition hover:scale-105"
                >
                  Pokračovat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hlavní obchod
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 z-50 overflow-auto">
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Obchod s balíčky
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{coinsBalance}</span>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur hover:bg-white/30 text-white p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Balíčky */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACK_TYPES.map((pack) => (
            <div
              key={pack.id}
              className="bg-white/10 backdrop-blur rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all transform hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${pack.color} rounded-xl p-8 mb-4 text-center`}>
                <div className="text-6xl mb-2">{pack.icon}</div>
                <Package className="w-12 h-12 text-white/80 mx-auto" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
              <p className="text-blue-200 text-sm mb-3">{pack.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm">Počet karet:</span>
                  <span className="font-bold">{pack.cards}</span>
                </div>
                <div className="text-xs text-green-400">
                  ✨ {pack.guaranteed}
                </div>
              </div>
              
              <button
                onClick={() => handleOpenPack(pack)}
                disabled={coinsBalance < pack.price}
                className={`
                  w-full py-3 rounded-xl font-bold text-white transition-all
                  ${coinsBalance >= pack.price 
                    ? `bg-gradient-to-r ${pack.color} hover:shadow-lg transform hover:scale-105` 
                    : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-5 h-5" />
                  <span>{pack.price} coinů</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Speciální nabídka */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border-2 border-white/30">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Denní nabídka!
              </h3>
              <p className="text-white/80 mt-1">
                Kup 3 zlaté balíčky a získej 1 legendární zdarma!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">-25%</div>
              <div className="text-white/80 text-sm">Zbývá 12:34:56</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS animace (přidej do globals.css)
const styles = `
@keyframes flipIn {
  from {
    transform: rotateY(0deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotateY(180deg) scale(1);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;