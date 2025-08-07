// 🏪 CARD SHOP - Kompletní obchod s opravenými kartami
import React, { useState } from 'react';
import { 
  Package, Star, Sparkles, Zap, Crown, Shield, 
  ArrowLeft, Coins, ShoppingCart, Flame, Diamond,
  Trophy, Gem, X, Award, Users, Target, Brain,
  ChevronLeft, ChevronRight, BarChart3, Activity
} from 'lucide-react';
import Image from 'next/image';

// ============================================
// DATA HRÁČŮ
// ============================================
const RomanSimekData = {
  name: 'Roman Šimek',
  number: '27',
  position: 'Obránce',
  team: 'HC Lancers',
  overall: 82,
  images: {
    front: '/images/players/Roman_Simek_Bronze.png',
    teamLogo: '/images/players/lancers-logo.png',
    leagueLogo: '/images/players/KHLA.png'
  },
  attributes: {
    strela: 72,
    prihravka: 78,
    klicky: 65,
    vhazovani: 58,
    napadeniHoli: 75,
    rychlost: 74,
    zrychleni: 71,
    hbitost: 76,
    stabilita: 83,
    blokovani: 88,
    braneni: 85,
    presnost: 79,
    sila: 84,
    predvidavost: 81,
    mentalita: 77,
    disciplina: 80,
    vydrz: 82,
  },
  seasonStats: {
    games: 42,
    goals: 8,
    assists: 24,
    points: 32,
    plusMinus: '+18',
    pim: 36,
    hits: 145,
    blockedShots: 89,
    timeOnIce: '22:45',
    faceoffWins: '48.2%',
    shootingPercent: '9.8%',
    powerplayGoals: 2,
    shorthandedGoals: 0,
    gameWinningGoals: 3,
    overtimeGoals: 1
  }
};

// ============================================
// KOMPONENTA PRO ZOBRAZENÍ ATRIBUTU
// ============================================
function AttributeBar({ name, value, compact = false }) {
  const getColor = (val) => {
    if (val >= 85) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (val >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (val >= 65) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 mb-1">
        <div className="w-16 text-[9px] text-amber-300 font-semibold truncate">
          {name}
        </div>
        <div className="flex-1 bg-black/30 rounded-full h-1.5 relative overflow-hidden">
          <div 
            className={`h-full ${getColor(value)} transition-all duration-500`}
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="w-5 text-right text-white font-bold text-[9px]">{value}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-20 text-[10px] text-amber-300 font-semibold">
        {name}
      </div>
      <div className="flex-1 bg-black/30 rounded-full h-2 relative overflow-hidden">
        <div 
          className={`h-full ${getColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-6 text-right text-white font-bold text-[10px]">{value}</div>
    </div>
  );
}

// ============================================
// VYLEPŠENÁ LANCERS KARTA S OTÁČENÍM A 2 LISTY
// ============================================
function EnhancedLancersCard({ player, canFlip = true, onClick, isInModal = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [backPage, setBackPage] = useState(1); // 1 = atributy, 2 = statistiky
  const [imageError, setImageError] = useState(false);

  const handleRightClick = (e) => {
    e.preventDefault();
    if (canFlip && player.name === 'Roman Šimek') {
      setIsFlipped(!isFlipped);
      setBackPage(1); // Reset na první stranu při otočení
    }
  };

  const handleClick = () => {
    if (onClick && !isInModal) {
      onClick(player);
    }
  };

  const switchBackPage = (e, page) => {
    e.stopPropagation();
    setBackPage(page);
  };

  // Velikost karty podle kontextu - ZMENŠENÁ pro modal
  const cardSize = isInModal ? "w-64 h-[360px]" : "w-56 h-80";
  const scale = isInModal ? "scale-100" : "scale-100";

  return (
    <div 
      className={`relative ${cardSize} cursor-pointer preserve-3d transition-transform duration-700 ${scale}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {/* PŘEDNÍ STRANA */}
      <div className="absolute inset-0 backface-hidden">
        <div className="w-full h-full bg-gradient-to-br from-amber-700 via-orange-600 to-amber-800 rounded-xl shadow-2xl border-2 border-amber-400/50 overflow-hidden">
          {/* Metalický efekt */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/20 to-transparent"></div>
          
          {/* Header s jménem a pozicí */}
          <div className="relative z-10 bg-black/30 backdrop-blur p-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-white font-bold ${isInModal ? 'text-lg' : 'text-base'}`}>{player.name}</h3>
                <p className={`text-amber-300 ${isInModal ? 'text-sm' : 'text-xs'}`}>{player.position}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-2 py-1">
                <span className={`text-white font-bold ${isInModal ? 'text-lg' : 'text-base'}`}>#{player.number}</span>
              </div>
            </div>
          </div>
          
          {/* Fotka hráče */}
          <div className={`relative ${isInModal ? 'h-44' : 'h-36'} mx-3 rounded-lg overflow-hidden bg-gradient-to-b from-black/20 to-black/50`}>
            {!imageError && player.images?.front ? (
              <Image
                src={player.images.front}
                alt={player.name}
                fill
                className="object-cover object-top"
                sizes={isInModal ? "256px" : "224px"}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="text-white/30" size={isInModal ? 60 : 50} />
              </div>
            )}
          </div>
          
          {/* Loga a overall - přesunuté ze statistik */}
          <div className="p-3 mt-2">
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className={`bg-white/80 rounded-lg p-2 flex items-center justify-center ${isInModal ? 'h-14' : 'h-12'}`}>
                <Image 
                  src={player.images?.leagueLogo || '/images/players/KHLA.png'}
                  alt="KHLA"
                  width={isInModal ? 50 : 40}
                  height={isInModal ? 50 : 40}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              <div className={`bg-black/40 backdrop-blur rounded-lg p-1 flex flex-col items-center justify-center ${isInModal ? 'h-14' : 'h-12'}`}>
                <div className={`text-white font-bold ${isInModal ? 'text-2xl' : 'text-xl'}`}>{player.overall}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="text-amber-400" 
                      size={isInModal ? 10 : 8} 
                      fill={i < Math.floor(player.overall / 20) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>
              
              <div className={`bg-white/80 rounded-lg p-2 flex items-center justify-center ${isInModal ? 'h-14' : 'h-12'}`}>
                <Image 
                  src={player.images?.teamLogo || '/images/players/lancers-logo.png'}
                  alt="Lancers"
                  width={isInModal ? 50 : 40}
                  height={isInModal ? 50 : 40}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          
          {canFlip && player.name === 'Roman Šimek' && (
            <div className={`absolute bottom-1 right-2 text-white/50 ${isInModal ? 'text-xs' : 'text-[10px]'}`}>
              Pravý klik pro info
            </div>
          )}
        </div>
      </div>

      {/* ZADNÍ STRANA - 2 listy (atributy a statistiky) */}
      <div 
        className="absolute inset-0 backface-hidden"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-amber-900 via-orange-700 to-amber-900 rounded-xl shadow-2xl border-2 border-amber-400/50 overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
            }}></div>
          </div>
          
          {/* Header s navigací mezi listy */}
          <div className="relative z-10 bg-black/40 p-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="text-amber-400" size={16} />
                <span className={`text-white font-bold ${isInModal ? 'text-base' : 'text-sm'}`}>{player.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => switchBackPage(e, 1)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    backPage === 1 
                      ? 'bg-amber-500/30 text-amber-300 font-bold' 
                      : 'bg-black/20 text-white/60 hover:bg-black/30'
                  }`}
                >
                  Atributy
                </button>
                <button 
                  onClick={(e) => switchBackPage(e, 2)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    backPage === 2 
                      ? 'bg-amber-500/30 text-amber-300 font-bold' 
                      : 'bg-black/20 text-white/60 hover:bg-black/30'
                  }`}
                >
                  Statistiky
                </button>
              </div>
            </div>
          </div>
          
          {/* Obsah podle vybraného listu */}
          <div className="relative z-10 p-2 h-[calc(100%-44px)] overflow-y-auto custom-scrollbar">
            {backPage === 1 ? (
              // LIST 1: ATRIBUTY
              <div className="space-y-2">
                {/* Útočné */}
                <div className="bg-black/30 rounded-lg p-1.5">
                  <div className={`text-amber-400 font-bold mb-1 flex items-center gap-1 text-[10px]`}>
                    <Target size={10} /> ÚTOČNÉ
                  </div>
                  <AttributeBar name="Střela" value={player.attributes.strela} compact={!isInModal} />
                  <AttributeBar name="Přihrávka" value={player.attributes.prihravka} compact={!isInModal} />
                  <AttributeBar name="Kličky" value={player.attributes.klicky} compact={!isInModal} />
                  <AttributeBar name="Vhazování" value={player.attributes.vhazovani} compact={!isInModal} />
                  <AttributeBar name="Napadání" value={player.attributes.napadeniHoli} compact={!isInModal} />
                </div>
                
                {/* Pohyb */}
                <div className="bg-black/30 rounded-lg p-1.5">
                  <div className={`text-amber-400 font-bold mb-1 flex items-center gap-1 text-[10px]`}>
                    <Zap size={10} /> POHYB
                  </div>
                  <AttributeBar name="Rychlost" value={player.attributes.rychlost} compact={!isInModal} />
                  <AttributeBar name="Zrychlení" value={player.attributes.zrychleni} compact={!isInModal} />
                  <AttributeBar name="Hbitost" value={player.attributes.hbitost} compact={!isInModal} />
                  <AttributeBar name="Stabilita" value={player.attributes.stabilita} compact={!isInModal} />
                </div>
                
                {/* Obranné */}
                <div className="bg-black/30 rounded-lg p-1.5">
                  <div className={`text-amber-400 font-bold mb-1 flex items-center gap-1 text-[10px]`}>
                    <Shield size={10} /> OBRANNÉ
                  </div>
                  <AttributeBar name="Blokování" value={player.attributes.blokovani} compact={!isInModal} />
                  <AttributeBar name="Bránění" value={player.attributes.braneni} compact={!isInModal} />
                  <AttributeBar name="Přesnost" value={player.attributes.presnost} compact={!isInModal} />
                  <AttributeBar name="Síla" value={player.attributes.sila} compact={!isInModal} />
                </div>
                
                {/* Mentální */}
                <div className="bg-black/30 rounded-lg p-1.5">
                  <div className={`text-amber-400 font-bold mb-1 flex items-center gap-1 text-[10px]`}>
                    <Brain size={10} /> MENTÁLNÍ
                  </div>
                  <AttributeBar name="Předvídavost" value={player.attributes.predvidavost} compact={!isInModal} />
                  <AttributeBar name="Mentalita" value={player.attributes.mentalita} compact={!isInModal} />
                  <AttributeBar name="Disciplína" value={player.attributes.disciplina} compact={!isInModal} />
                  <AttributeBar name="Vydrž" value={player.attributes.vydrz} compact={!isInModal} />
                </div>
              </div>
            ) : (
              // LIST 2: STATISTIKY
              <div className="space-y-2">
                {/* Základní statistiky */}
                <div className="bg-black/30 rounded-lg p-2">
                  <div className={`text-amber-400 font-bold mb-2 flex items-center gap-1 text-[11px]`}>
                    <BarChart3 size={12} /> ZÁKLADNÍ STATISTIKY
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">Zápasy</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.games || 42}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">Góly</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.goals || 8}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">Asistence</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.assists || 24}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">Body</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.points || 32}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">+/-</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.plusMinus || '+18'}</div>
                    </div>
                    <div className="bg-black/20 rounded p-1">
                      <div className="text-amber-300 text-[9px]">TM</div>
                      <div className="text-white font-bold text-sm">{player.seasonStats?.pim || 36}</div>
                    </div>
                  </div>
                </div>
                
                {/* Pokročilé statistiky */}
                <div className="bg-black/30 rounded-lg p-2">
                  <div className={`text-amber-400 font-bold mb-2 flex items-center gap-1 text-[11px]`}>
                    <Activity size={12} /> POKROČILÉ STATISTIKY
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">Hity:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.hits || 145}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">Bloky:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.blockedShots || 89}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">TOI/G:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.timeOnIce || '22:45'}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">FO%:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.faceoffWins || '48.2%'}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">Střelba%:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.shootingPercent || '9.8%'}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">PP góly:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.powerplayGoals || 2}</span>
                    </div>
                  </div>
                </div>
                
                {/* Speciální */}
                <div className="bg-black/30 rounded-lg p-2">
                  <div className={`text-amber-400 font-bold mb-2 flex items-center gap-1 text-[11px]`}>
                    <Trophy size={12} /> SPECIÁLNÍ
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">GWG:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.gameWinningGoals || 3}</span>
                    </div>
                    <div className="flex justify-between bg-black/20 rounded p-1">
                      <span className="text-amber-300 text-[9px]">OT góly:</span>
                      <span className="text-white font-bold text-[10px]">{player.seasonStats?.overtimeGoals || 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Indikátor stránky */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className={`w-6 h-1 rounded-full transition-all ${backPage === 1 ? 'bg-amber-400' : 'bg-white/20'}`}></div>
            <div className={`w-6 h-1 rounded-full transition-all ${backPage === 2 ? 'bg-amber-400' : 'bg-white/20'}`}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.7);
        }
      `}</style>
    </div>
  );
}

// ============================================
// MODAL PRO ZVĚTŠENOU KARTU - OPRAVENÝ
// ============================================
function CardModal({ player, isOpen, onClose }) {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative max-h-[90vh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 bg-white/20 hover:bg-white/30 rounded-full p-2 z-10"
        >
          <X className="text-white" size={24} />
        </button>
        
        {/* Karta se správnou velikostí pro obrazovku */}
        <div className="flex items-center justify-center">
          <EnhancedLancersCard 
            player={player} 
            canFlip={true}
            isInModal={true}
          />
        </div>
        
        {player.name === 'Roman Šimek' && (
          <div className="text-center mt-4 text-white/70 text-sm">
            Pravý klik myši pro otočení karty • Přepínej mezi Atributy a Statistikami
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// DEFINICE BALÍČKŮ
// ============================================
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
    id: 'lancers',
    name: 'Hráči Lancers',
    price: 750,
    cards: 3,
    rarity: 'lancers',
    color: 'from-amber-700 via-orange-600 to-amber-800',
    glowColor: 'shadow-amber-500/50',
    icon: Users,
    description: 'Exkluzivní Bronze Edition',
    guaranteed: 'Liga KHLA - Tým Lancers',
    image: '⚔️',
    special: true,
    badge: 'LIMITOVANÁ EDICE'
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

// ============================================
// KOMPONENTA 3D BALÍČKU
// ============================================
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
      {/* Special badge pro Lancers */}
      {pack.special && (
        <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse shadow-lg">
          {pack.badge}
        </div>
      )}
      
      {/* Glow efekt */}
      <div className={`absolute inset-0 bg-gradient-to-r ${pack.color} rounded-2xl blur-xl opacity-50 ${pack.glowColor} shadow-2xl transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-95'}`}></div>
      
      {/* Hlavní balíček */}
      <div className={`relative bg-gradient-to-br ${pack.color} rounded-2xl p-6 border-2 ${pack.id === 'lancers' ? 'border-amber-400/50' : 'border-white/20'} backdrop-blur-sm ${!isAffordable ? 'opacity-60' : ''}`}>
        {/* Horní část - logo */}
        <div className="absolute top-3 right-3 text-4xl opacity-80">
          {pack.image}
        </div>
        
        {/* Název balíčku */}
        <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
        
        {/* Vizualizace balíčku */}
        <div className="relative w-full h-40 mb-4 flex items-center justify-center">
          <div className="relative">
            {pack.id === 'lancers' ? (
              // Speciální vizualizace pro Lancers
              <>
                <div className="absolute w-20 h-28 bg-gradient-to-br from-amber-700 to-orange-600 rounded-lg transform rotate-12 translate-x-4 border-2 border-amber-400/50 shadow-xl">
                  <div className="flex items-center justify-center h-full text-white/80 font-bold">KHLA</div>
                </div>
                <div className="absolute w-20 h-28 bg-gradient-to-br from-amber-700 to-orange-600 rounded-lg transform -rotate-12 -translate-x-4 border-2 border-amber-400/50 shadow-xl">
                  <div className="flex items-center justify-center h-full text-white/80 font-bold">KHLA</div>
                </div>
                <div className="relative w-24 h-32 bg-gradient-to-br from-amber-600/90 to-orange-700/90 rounded-lg shadow-2xl border-2 border-amber-400 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20"></div>
                  <div className="relative text-center">
                    <Users className="text-white mx-auto mb-1" size={28} />
                    <div className="text-xs font-bold text-white">LANCERS</div>
                    <div className="text-[10px] text-amber-200">BRONZE ED.</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/20 to-transparent transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                </div>
              </>
            ) : (
              // Původní vizualizace
              <>
                <div className="absolute w-20 h-28 bg-gradient-to-br from-blue-900 to-red-700 rounded-lg transform rotate-12 translate-x-4 border-2 border-white/30"></div>
                <div className="absolute w-20 h-28 bg-gradient-to-br from-blue-900 to-red-700 rounded-lg transform -rotate-12 -translate-x-4 border-2 border-white/30"></div>
                <div className="relative w-24 h-32 bg-gradient-to-br from-white/90 to-white/70 rounded-lg shadow-2xl border-2 border-white flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-red-600/20"></div>
                  <div className="relative">
                    <Flame className="text-red-600" size={32} />
                    <div className="text-xs font-bold text-blue-900 text-center mt-1">HC LITVÍNOV</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                </div>
              </>
            )}
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
                ? pack.id === 'lancers' 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-green-500 hover:bg-green-400 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isAffordable}
          >
            {isAffordable ? 'Koupit' : 'Nedostatek 💰'}
          </button>
        </div>
        
        {/* Počet karet badge */}
        <div className={`absolute -top-3 left-4 ${pack.id === 'lancers' ? 'bg-amber-600' : 'bg-red-600'} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
          {pack.cards} karet
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANIMACE OTEVÍRÁNÍ BALÍČKU
// ============================================
function PackOpeningAnimation({ pack, cards, onClose }) {
  const [stage, setStage] = useState('sealed');
  const [revealedCards, setRevealedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  React.useEffect(() => {
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
      {stage === 'revealed' && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all z-50"
        >
          <X className="text-white" size={24} />
        </button>
      )}
      
      <div className="relative">
        {/* Balíček před otevřením */}
        {(stage === 'sealed' || stage === 'opening') && (
          <div className={`transform transition-all duration-1000 ${stage === 'opening' ? 'scale-110 rotate-y-180' : ''}`}>
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${pack.color} rounded-3xl blur-3xl opacity-70 animate-pulse`}></div>
              
              <div className={`relative w-48 h-64 bg-gradient-to-br ${pack.color} rounded-3xl shadow-2xl border-4 ${pack.id === 'lancers' ? 'border-amber-400/50' : 'border-white/30'} flex items-center justify-center transform ${stage === 'opening' ? 'animate-bounce' : ''}`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{pack.image}</div>
                  {pack.id === 'lancers' ? (
                    <>
                      <Users className="text-white mx-auto mb-2" size={48} />
                      <div className="text-white font-bold text-lg">LANCERS</div>
                      <div className="text-amber-300/80 text-sm mt-1">BRONZE EDITION</div>
                    </>
                  ) : (
                    <>
                      <Flame className="text-white mx-auto mb-2" size={48} />
                      <div className="text-white font-bold text-lg">HC LITVÍNOV</div>
                    </>
                  )}
                  <div className="text-white/80 text-sm mt-2">{pack.name}</div>
                </div>
                
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
              <div className={`absolute inset-0 ${pack.id === 'lancers' ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600' : 'bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500'} rounded-full blur-3xl opacity-80 animate-pulse scale-150`}></div>
              <Sparkles className="text-white relative animate-spin" size={100} />
            </div>
          </div>
        )}
        
        {/* Odhalené karty */}
        {stage === 'revealed' && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {pack.id === 'lancers' ? '⚔️ Lancers Bronze Edition! ⚔️' : `🎉 Získal jsi ${cards.length} karet! 🎉`}
            </h2>
            <div className="flex gap-6 justify-center flex-wrap max-w-6xl">
              {revealedCards.map((card, index) => (
                <div 
                  key={index}
                  className="transform transition-all duration-500 hover:scale-110"
                  style={{
                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {card.isLancers ? (
                    <EnhancedLancersCard 
                      player={card}
                      canFlip={true}
                      onClick={(player) => setSelectedCard(player)}
                    />
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button 
                onClick={onClose}
                className={`${pack.id === 'lancers' ? 'bg-gradient-to-r from-amber-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-red-600'} text-white px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg`}
              >
                Pokračovat
              </button>
            </div>
            
            {pack.id === 'lancers' && (
              <div className="text-center mt-4 text-amber-300 text-sm">
                <p>👆 Klikni na kartu pro zvětšení</p>
                <p>👉 Pravý klik na Romana Šimka pro zobrazení atributů a statistik</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal pro zvětšenou kartu */}
      <CardModal 
        player={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
      
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

// ============================================
// HLAVNÍ KOMPONENTA OBCHODU
// ============================================
export default function CardShop() {
  const [playerCoins, setPlayerCoins] = useState(3000);
  const [selectedPack, setSelectedPack] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  
  // Data hráčů Lancers
  const lancersPlayers = [
    { ...RomanSimekData, id: 1, isLancers: true },
    { 
      ...RomanSimekData, 
      name: 'Jakub Novák', 
      number: '91', 
      position: 'Útočník',
      overall: 85,
      images: {
        front: '',
        teamLogo: '/images/players/lancers-logo.png',
        leagueLogo: '/images/players/KHLA.png'
      },
      id: 2,
      isLancers: true
    },
    { 
      ...RomanSimekData,
      name: 'Tomáš Dvořák', 
      number: '30', 
      position: 'Brankář',
      overall: 88,
      images: {
        front: '',
        teamLogo: '/images/players/lancers-logo.png',
        leagueLogo: '/images/players/KHLA.png'
      },
      id: 3,
      isLancers: true
    }
  ];
  
  // Generování karet
  const generateCards = (pack) => {
    if (pack.id === 'lancers') {
      return lancersPlayers.map(player => ({
        ...player,
        isLancers: true,
        rarity: 'bronze',
        stars: Math.floor(player.overall / 20),
      }));
    }
    
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
            
            <div className="bg-yellow-500/20 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-yellow-400 text-lg">💰</span>
              <span className="font-bold text-white text-xl">{playerCoins}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Speciální nabídka pro Lancers */}
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-3xl p-6 mb-8 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Award className="text-amber-400" />
                NOVINKA: Hráči Lancers - Bronze Edition!
              </h2>
              <p className="text-amber-200">
                Roman Šimek s 18 atributy a kompletními statistikami na 2 listech!
              </p>
            </div>
            <div className="text-6xl animate-pulse">⚔️</div>
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