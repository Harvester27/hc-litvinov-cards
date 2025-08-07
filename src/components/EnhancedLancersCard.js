// 🎴 VYLEPŠENÁ LANCERS KARTA - S otáčením a detaily
import React, { useState } from 'react';
import { 
  Star, Shield, Trophy, Zap, Target, Heart, Brain, 
  Activity, Eye, X, ChevronRight, Award, Users
} from 'lucide-react';
import Image from 'next/image';

// Import dat hráče (v reálné aplikaci)
// import RomanSimekData from '@/data/players/roman-simek';

// Pro demo - data přímo zde
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
    plusMinus: '+18'
  }
};

// Komponenta pro zobrazení atributu
function AttributeBar({ name, value, icon: Icon }) {
  const getColor = (val) => {
    if (val >= 85) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (val >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (val >= 65) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-24 text-xs text-amber-300 font-semibold flex items-center gap-1">
        {Icon && <Icon size={12} />}
        {name}
      </div>
      <div className="flex-1 bg-black/30 rounded-full h-3 relative overflow-hidden">
        <div 
          className={`h-full ${getColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="w-8 text-right text-white font-bold text-xs">{value}</div>
    </div>
  );
}

// Hlavní komponenta karty s otáčením
export function EnhancedLancersCard({ player = RomanSimekData, canFlip = true, onClick }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRightClick = (e) => {
    e.preventDefault();
    if (canFlip) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div 
      className="relative w-56 h-80 cursor-pointer preserve-3d transition-transform duration-700"
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
          <div className="relative z-10 bg-black/30 backdrop-blur p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-lg">{player.name}</h3>
                <p className="text-amber-300 text-sm">{player.position}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-3 py-1">
                <span className="text-white font-bold text-xl">#{player.number}</span>
              </div>
            </div>
          </div>
          
          {/* Fotka hráče - větší */}
          <div className="relative h-40 mx-3 rounded-lg overflow-hidden bg-gradient-to-b from-black/20 to-black/50">
            {!imageError && player.images?.front ? (
              <Image
                src={player.images.front}
                alt={player.name}
                fill
                className="object-cover object-top"
                sizes="224px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="text-white/30" size={60} />
              </div>
            )}
          </div>
          
          {/* Stats sekce */}
          <div className="p-3 mt-2">
            {/* Sezónní statistiky */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
              <div className="bg-black/30 rounded-lg p-2">
                <div className="text-amber-300 text-xs">Z</div>
                <div className="text-white font-bold">{player.seasonStats?.games || 42}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="text-amber-300 text-xs">G</div>
                <div className="text-white font-bold">{player.seasonStats?.goals || 8}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="text-amber-300 text-xs">A</div>
                <div className="text-white font-bold">{player.seasonStats?.assists || 24}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <div className="text-amber-300 text-xs">+/-</div>
                <div className="text-white font-bold text-sm">{player.seasonStats?.plusMinus || '+18'}</div>
              </div>
            </div>
            
            {/* Loga a overall - větší */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="bg-white/80 rounded-lg p-2 flex items-center justify-center h-14">
                <Image 
                  src={player.images?.leagueLogo || '/images/players/KHLA.png'}
                  alt="KHLA"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              <div className="bg-black/40 backdrop-blur rounded-lg p-2 flex flex-col items-center justify-center h-14">
                <div className="text-white font-bold text-2xl">{player.overall}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="text-amber-400" 
                      size={10} 
                      fill={i < Math.floor(player.overall / 20) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-2 flex items-center justify-center h-14">
                <Image 
                  src={player.images?.teamLogo || '/images/players/lancers-logo.png'}
                  alt="Lancers"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          
          {canFlip && (
            <div className="absolute bottom-2 right-2 text-white/50 text-xs">
              Pravý klik pro otočení
            </div>
          )}
        </div>
      </div>

      {/* ZADNÍ STRANA - Atributy */}
      <div 
        className="absolute inset-0 backface-hidden"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-amber-900 via-orange-700 to-amber-900 rounded-xl shadow-2xl border-2 border-amber-400/50 overflow-hidden p-3">
          {/* Pattern na pozadí */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
            }}></div>
          </div>
          
          {/* Header */}
          <div className="relative z-10 bg-black/40 rounded-lg p-2 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="text-amber-400" size={20} />
                <span className="text-white font-bold">{player.name}</span>
              </div>
              <span className="text-amber-300 text-sm">#{player.number}</span>
            </div>
          </div>
          
          {/* Atributy */}
          <div className="relative z-10 space-y-3">
            {/* Útočné */}
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1">
                <Target size={12} /> ÚTOČNÉ
              </div>
              <AttributeBar name="Střela" value={player.attributes.strela} />
              <AttributeBar name="Přihrávka" value={player.attributes.prihravka} />
              <AttributeBar name="Kličky" value={player.attributes.klicky} />
            </div>
            
            {/* Pohyb */}
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1">
                <Zap size={12} /> POHYB
              </div>
              <AttributeBar name="Rychlost" value={player.attributes.rychlost} />
              <AttributeBar name="Zrychlení" value={player.attributes.zrychleni} />
              <AttributeBar name="Hbitost" value={player.attributes.hbitost} />
            </div>
            
            {/* Obranné */}
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1">
                <Shield size={12} /> OBRANNÉ
              </div>
              <AttributeBar name="Blokování" value={player.attributes.blokovani} />
              <AttributeBar name="Bránění" value={player.attributes.braneni} />
              <AttributeBar name="Síla" value={player.attributes.sila} />
            </div>
            
            {/* Mentální */}
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-amber-400 text-xs font-bold mb-2 flex items-center gap-1">
                <Brain size={12} /> MENTÁLNÍ
              </div>
              <AttributeBar name="Předvídavost" value={player.attributes.predvidavost} />
              <AttributeBar name="Disciplína" value={player.attributes.disciplina} />
              <AttributeBar name="Vydrž" value={player.attributes.vydrz} />
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 text-white/50 text-xs">
            Pravý klik pro otočení zpět
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
      `}</style>
    </div>
  );
}

// Modal pro zvětšenou kartu
export function CardModal({ player, isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const handleRightClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 z-10"
        >
          <X className="text-white" size={24} />
        </button>
        
        <div className="transform scale-150">
          <div 
            className="relative w-56 h-80 preserve-3d transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            onContextMenu={handleRightClick}
          >
            {/* Stejná karta ale větší */}
            <EnhancedLancersCard player={player} canFlip={false} />
          </div>
        </div>
        
        <div className="text-center mt-8 text-white/70 text-sm">
          Pravý klik myši pro otočení karty
        </div>
      </div>
    </div>
  );
}

// Demo komponenta
export default function LancersCardDemo() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Lancers Bronze Edition - Klikni na kartu pro zvětšení
        </h1>
        
        <div className="flex justify-center">
          <EnhancedLancersCard 
            player={RomanSimekData}
            canFlip={true}
            onClick={(player) => setSelectedCard(player)}
          />
        </div>
        
        <CardModal 
          player={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
        
        <div className="text-center mt-8 text-amber-300">
          <p>👆 Klikni na kartu pro zvětšení</p>
          <p>👉 Pravý klik myši pro otočení karty</p>
        </div>
      </div>
    </div>
  );
}