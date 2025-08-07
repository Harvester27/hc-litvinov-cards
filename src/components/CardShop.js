// 🏪 CARD SHOP - Obchod s balíčky kartiček HC Litvínov
import React, { useState } from 'react';
import { 
  Package, Star, Sparkles, Zap, Crown, Shield, 
  ArrowLeft, Coins, ShoppingCart, Flame, Diamond,
  Trophy, Gem, X
} from 'lucide-react';

// Definice typů balíčků
const packs = [
  {
    id: 'starter',
    name: 'Základní Balíček',
    price: 100,
    cards: 3,
    rarity: 'common',
    color: 'from-gray-400 to-gray-600',
    glowColor: 'shadow-gray-400/50',
    icon: Package,
    description: '3 běžné karty',
    guaranteed: 'Běžné karty',
    image: '📦'
  },
  {
    id: 'bronze',
    name: 'Bronzový Balíček',
    price: 250,
    cards: 5,
    rarity: 'bronze',
    color: 'from-orange-600 to-orange-800',
    glowColor: 'shadow-orange-500/50',
    icon: Shield,
    description: '5 karet, šance na vzácnou',
    guaranteed: '1x Neobvyklá zaručena',
    image: '🥉'
  },
  {
    id: 'silver',
    name: 'Stříbrný Balíček',
    price: 500,
    cards: 5,
    rarity: 'silver',
    color: 'from-slate-400 to-slate-600',
    glowColor: 'shadow-slate-400/50',
    icon: Star,
    description: '5 karet, vyšší šance na vzácné',
    guaranteed: '1x Vzácná zaručena',
    image: '🥈'
  },
  {
    id: 'gold',
    name: 'Zlatý Balíček',
    price: 1000,
    cards: 7,
    rarity: 'gold',
    color: 'from-yellow-500 to-amber-600',
    glowColor: 'shadow-yellow-500/50',
    icon: Trophy,
    description: '7 karet s vysokou šancí na vzácné',
    guaranteed: '2x Vzácná zaručena',
    image: '🥇'
  },
  {
    id: 'diamond',
    name: 'Diamantový Balíček',
    price: 2500,
    cards: 10,
    rarity: 'legendary',
    color: 'from-purple-600 via-pink-500 to-blue-500',
    glowColor: 'shadow-purple-500/50',
    icon: Diamond,
    description: '10 karet, garantovaná legenda!',
    guaranteed: '1x Legendární zaručena!',
    image: '💎'
  },
  {
    id: 'special',
    name: 'Speciální Edice',
    price: 5000,
    cards: 15,
    rarity: 'mythic',
    color: 'from-red-600 via-blue-600 to-red-600',
    glowColor: 'shadow-red-500/50',
    icon: Flame,
    description: '15 prémiových karet!',
    guaranteed: '2x Legendární + speciální karta!',
    image: '🔥'
  }
];

// Komponenta pro 3D balíček
function Pack3D({ pack, onClick, isAffordable }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        transform: isHovered ? 'rotateY(5deg) rotateX(-5deg)' : '',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glow efekt */}
      <div className={`absolute inset-0 bg-gradient-to-r ${pack.color} rounded-2xl blur-xl opacity-50 ${pack.glowColor} shadow-2xl transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-95'}`}></div>
      
      {/* Hlavní balíček */}
      <div className={`relative bg-gradient-to-br ${pack.color} rounded-2xl p-6 border-2 border-white/20 backdrop-blur-sm ${!isAffordable ? 'opacity-60' : ''}`}>
        {/* Horní část - logo týmu */}
        <div className="absolute top-3 right-3 text-4xl opacity-80">
          {pack.image}
        </div>
        
        {/* Název balíčku */}
        <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
        
        {/* Vizualizace balíčku */}
        <div className="relative w-full h-40 mb-4 flex items-center justify-center">
          <div className="relative">
            {/* Zadní karty (preview) */}
            <div className="absolute w-20 h-28 bg-gradient-to-br from-blue-900 to-red-700 rounded-lg transform rotate-12 translate-x-4 border-2 border-white/30"></div>
            <div className="absolute w-20 h-28 bg-gradient-to-br from-blue-900 to-red-700 rounded-lg transform -rotate-12 -translate-x-4 border-2 border-white/30"></div>
            
            {/* Přední balíček */}
            <div className="relative w-24 h-32 bg-gradient-to-br from-white/90 to-white/70 rounded-lg shadow-2xl border-2 border-white flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-red-600/20"></div>
              <div className="relative">
                <Flame className="text-red-600" size={32} />
                <div className="text-xs font-bold text-blue-900 text-center mt-1">HC LITVÍNOV</div>
              </div>
              {/* Lesklý efekt */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
            </div>
          </div>
        </div>
        
        {/* Info o balíčku */}
        <div className="space-y-2 text-white/90">
          <p className="text-sm">{pack.description}</p>
          <div className="flex items-center gap-1 text-yellow-300">
            <Sparkles size={16} />
            <span className="text-xs font-semibold">{pack.guaranteed}</span>
          </div>
        </div>
        
        {/* Cena */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500/20 rounded-full px-3 py-1 flex items-center gap-1">
              <span className="text-yellow-400">💰</span>
              <span className="font-bold text-white">{pack.price}</span>
            </div>
          </div>
          <button 
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              isAffordable 
                ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg hover:shadow-xl' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isAffordable}
          >
            {isAffordable ? 'Koupit' : 'Nedostatek 💰'}
          </button>
        </div>
        
        {/* Počet karet badge */}
        <div className="absolute -top-3 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          {pack.cards} karet
        </div>
      </div>
    </div>
  );
}

// Animace otevírání balíčku
function PackOpeningAnimation({ pack, cards, onClose }) {
  const [stage, setStage] = useState('sealed'); // sealed -> opening -> revealing -> revealed
  const [revealedCards, setRevealedCards] = useState([]);
  
  React.useEffect(() => {
    // Automatická sekvence animace
    const timer1 = setTimeout(() => setStage('opening'), 500);
    const timer2 = setTimeout(() => setStage('revealing'), 2000);
    const timer3 = setTimeout(() => {
      setStage('revealed');
      setRevealedCards(cards);
    }, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [cards]);
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center">
      {/* Zavřít button */}
      {stage === 'revealed' && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
        >
          <X className="text-white" size={24} />
        </button>
      )}
      
      <div className="relative">
        {/* Balíček před otevřením */}
        {(stage === 'sealed' || stage === 'opening') && (
          <div className={`transform transition-all duration-1000 ${stage === 'opening' ? 'scale-110 rotate-y-180' : ''}`}>
            <div className="relative">
              {/* Efekt záření */}
              <div className={`absolute inset-0 bg-gradient-to-r ${pack.color} rounded-3xl blur-3xl opacity-70 animate-pulse`}></div>
              
              {/* Balíček */}
              <div className={`relative w-48 h-64 bg-gradient-to-br ${pack.color} rounded-3xl shadow-2xl border-4 border-white/30 flex items-center justify-center transform ${stage === 'opening' ? 'animate-bounce' : ''}`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{pack.image}</div>
                  <Flame className="text-white mx-auto mb-2" size={48} />
                  <div className="text-white font-bold text-lg">HC LITVÍNOV</div>
                  <div className="text-white/80 text-sm mt-2">{pack.name}</div>
                </div>
                
                {/* Trhání obalu */}
                {stage === 'opening' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl animate-ping">💥</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Efekt při revealing */}
        {stage === 'revealing' && (
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 rounded-full blur-3xl opacity-80 animate-pulse scale-150"></div>
              <Sparkles className="text-white relative animate-spin" size={100} />
            </div>
          </div>
        )}
        
        {/* Odhalené karty */}
        {stage === 'revealed' && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              🎉 Získal jsi {cards.length} karet! 🎉
            </h2>
            <div className="flex gap-4 justify-center flex-wrap max-w-4xl">
              {revealedCards.map((card, index) => (
                <div 
                  key={index}
                  className="transform transition-all duration-500 hover:scale-110 hover:rotate-2"
                  style={{
                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`w-32 h-44 bg-gradient-to-br ${
                    card.rarity === 'legendary' ? 'from-yellow-400 to-orange-500' :
                    card.rarity === 'rare' ? 'from-purple-400 to-blue-500' :
                    'from-gray-400 to-gray-600'
                  } rounded-xl shadow-2xl border-2 border-white/50 flex flex-col items-center justify-center p-3`}>
                    <div className="text-4xl mb-2">🏒</div>
                    <div className="text-white font-bold text-sm text-center">{card.name}</div>
                    <div className="text-white/80 text-xs mt-1">{card.position}</div>
                    <div className="mt-auto">
                      <div className="flex gap-1">
                        {[...Array(card.stars || 3)].map((_, i) => (
                          <Star key={i} className="text-yellow-300" size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg"
              >
                Pokračovat
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Hlavní komponenta obchodu
export default function CardShop() {
  const [playerCoins, setPlayerCoins] = useState(2500); // Simulace coinů hráče
  const [selectedPack, setSelectedPack] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  
  // Simulace generování karet
  const generateCards = (pack) => {
    const cardNames = [
      { name: 'David Krejčí', position: 'Útočník', rarity: 'legendary', stars: 5 },
      { name: 'Ondřej Kaše', position: 'Útočník', rarity: 'rare', stars: 4 },
      { name: 'Michal Gut', position: 'Obránce', rarity: 'common', stars: 3 },
      { name: 'Petr Koblasa', position: 'Útočník', rarity: 'rare', stars: 4 },
      { name: 'David Gríger', position: 'Obránce', rarity: 'common', stars: 3 },
      { name: 'Matěj Tomek', position: 'Brankář', rarity: 'rare', stars: 4 },
      { name: 'Nicolas Hlava', position: 'Útočník', rarity: 'common', stars: 3 },
      { name: 'Šimon Zajíček', position: 'Brankář', rarity: 'legendary', stars: 5 }
    ];
    
    const cards = [];
    for (let i = 0; i < pack.cards; i++) {
      const randomCard = cardNames[Math.floor(Math.random() * cardNames.length)];
      cards.push({ ...randomCard, id: Math.random() });
    }
    
    // Zaručit legendární kartu pro premium balíčky
    if (pack.rarity === 'legendary' || pack.rarity === 'mythic') {
      cards[0] = { ...cardNames.find(c => c.rarity === 'legendary'), id: Math.random() };
    }
    
    return cards;
  };
  
  const handlePackPurchase = (pack) => {
    if (playerCoins >= pack.price) {
      setSelectedPack(pack);
      setPlayerCoins(prev => prev - pack.price);
      const cards = generateCards(pack);
      setOpenedCards(cards);
      setIsOpening(true);
    }
  };
  
  const handleCloseAnimation = () => {
    setIsOpening(false);
    setSelectedPack(null);
    setOpenedCards([]);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="bg-blue-600/20 hover:bg-blue-600/30 p-2 rounded-full transition-all">
                <ArrowLeft className="text-blue-300" size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="text-blue-400" />
                  Obchod Kartiček
                </h1>
                <p className="text-blue-300 text-sm">Vyber si balíček a rozšiř svou sbírku!</p>
              </div>
            </div>
            
            {/* Coin balance */}
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-yellow-400 text-lg">💰</span>
              <span className="font-bold text-white text-xl">{playerCoins}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Speciální nabídka banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Gem className="text-purple-400" />
                Speciální Nabídka Týdne!
              </h2>
              <p className="text-purple-200">
                Získej 20% slevu na Diamantový balíček! Pouze do neděle!
              </p>
            </div>
            <div className="text-6xl animate-pulse">💎</div>
          </div>
        </div>
        
        {/* Balíčky */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <Pack3D 
              key={pack.id}
              pack={pack}
              isAffordable={playerCoins >= pack.price}
              onClick={() => handlePackPurchase(pack)}
            />
          ))}
        </div>
        
        {/* Informace o balíčcích */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-blue-400" />
            Informace o Vzácnosti Karet
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto mb-2"></div>
              <p className="text-gray-300 text-sm">Běžné</p>
              <p className="text-gray-400 text-xs">70% šance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="text-blue-300 text-sm">Neobvyklé</p>
              <p className="text-blue-400 text-xs">20% šance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2"></div>
              <p className="text-purple-300 text-sm">Vzácné</p>
              <p className="text-purple-400 text-xs">8% šance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-2"></div>
              <p className="text-yellow-300 text-sm">Legendární</p>
              <p className="text-yellow-400 text-xs">2% šance</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animace otevírání balíčku */}
      {isOpening && selectedPack && (
        <PackOpeningAnimation 
          pack={selectedPack}
          cards={openedCards}
          onClose={handleCloseAnimation}
        />
      )}
    </div>
  );
}