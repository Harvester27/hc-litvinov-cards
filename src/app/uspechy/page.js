'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/firebaseProfile';
import { 
  Trophy, Lock, Star, Zap, Target, Medal, 
  Award, Crown, Loader, ChevronLeft, ChevronRight,
  Sparkles, Shield, Swords, Heart, Coins,
  X  // <-- PŘIDEJ TOTO
} from 'lucide-react'

export default function AchievementsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [treeOffset, setTreeOffset] = useState({ x: 0, y: 0 });
  
  // Načíst profil
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
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
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Definice skill tree - zatím prázdné uzly
  const skillTreeNodes = [
    // Střed - start
    { id: 'start', x: 400, y: 400, icon: Shield, color: 'red', unlocked: true, tier: 0 },
    
    // První větev - nahoru (Sbírání karet)
    { id: 'node1', x: 400, y: 300, icon: null, color: 'gray', unlocked: false, tier: 1, parent: 'start' },
    { id: 'node2', x: 400, y: 200, icon: null, color: 'gray', unlocked: false, tier: 2, parent: 'node1' },
    { id: 'node3', x: 350, y: 100, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node2' },
    { id: 'node4', x: 450, y: 100, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node2' },
    
    // Druhá větev - vpravo (Herní úspěchy)
    { id: 'node5', x: 500, y: 400, icon: null, color: 'gray', unlocked: false, tier: 1, parent: 'start' },
    { id: 'node6', x: 600, y: 400, icon: null, color: 'gray', unlocked: false, tier: 2, parent: 'node5' },
    { id: 'node7', x: 700, y: 350, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node6' },
    { id: 'node8', x: 700, y: 450, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node6' },
    
    // Třetí větev - vlevo (Sociální)
    { id: 'node9', x: 300, y: 400, icon: null, color: 'gray', unlocked: false, tier: 1, parent: 'start' },
    { id: 'node10', x: 200, y: 400, icon: null, color: 'gray', unlocked: false, tier: 2, parent: 'node9' },
    { id: 'node11', x: 100, y: 350, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node10' },
    { id: 'node12', x: 100, y: 450, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node10' },
    
    // Čtvrtá větev - dolů (Ekonomika)
    { id: 'node13', x: 400, y: 500, icon: null, color: 'gray', unlocked: false, tier: 1, parent: 'start' },
    { id: 'node14', x: 400, y: 600, icon: null, color: 'gray', unlocked: false, tier: 2, parent: 'node13' },
    { id: 'node15', x: 350, y: 700, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node14' },
    { id: 'node16', x: 450, y: 700, icon: null, color: 'gray', unlocked: false, tier: 3, parent: 'node14' },
    
    // Bonusové uzly - rohy
    { id: 'bonus1', x: 550, y: 250, icon: null, color: 'gray', unlocked: false, tier: 4, parent: 'node6' },
    { id: 'bonus2', x: 250, y: 250, icon: null, color: 'gray', unlocked: false, tier: 4, parent: 'node10' },
    { id: 'bonus3', x: 550, y: 550, icon: null, color: 'gray', unlocked: false, tier: 4, parent: 'node6' },
    { id: 'bonus4', x: 250, y: 550, icon: null, color: 'gray', unlocked: false, tier: 4, parent: 'node10' },
    
    // Master node - nejvyšší úroveň
    { id: 'master', x: 400, y: 50, icon: Crown, color: 'gold', unlocked: false, tier: 5, parent: 'node3' },
  ];
  
  // Vykreslení spojnic mezi uzly
  const renderConnections = () => {
    return skillTreeNodes.map(node => {
      if (!node.parent) return null;
      
      const parentNode = skillTreeNodes.find(n => n.id === node.parent);
      if (!parentNode) return null;
      
      const isActive = node.unlocked && parentNode.unlocked;
      
      return (
        <line
          key={`connection-${node.id}`}
          x1={parentNode.x}
          y1={parentNode.y}
          x2={node.x}
          y2={node.y}
          stroke={isActive ? '#dc2626' : '#9ca3af'}
          strokeWidth={isActive ? 3 : 2}
          strokeDasharray={isActive ? '0' : '5,5'}
          opacity={isActive ? 1 : 0.3}
        />
      );
    });
  };
  
  // Vykreslení uzlů
  const renderNodes = () => {
    return skillTreeNodes.map(node => {
      const Icon = node.icon;
      const isLocked = !node.unlocked;
      
      return (
        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
          {/* Glow efekt pro odemčené */}
          {node.unlocked && (
            <circle
              r="35"
              fill="url(#glow)"
              opacity="0.3"
              className="animate-pulse"
            />
          )}
          
          {/* Hlavní kruh uzlu */}
          <circle
            r="30"
            fill={isLocked ? '#374151' : node.color === 'gold' ? '#fbbf24' : '#dc2626'}
            stroke={isLocked ? '#6b7280' : '#ffffff'}
            strokeWidth="3"
            className={`cursor-pointer transition-all ${
              isLocked ? 'hover:fill-gray-600' : 'hover:scale-110'
            }`}
            onClick={() => setSelectedNode(node)}
          />
          
          {/* Ikona nebo zámek */}
          {isLocked ? (
            <Lock 
              size={20} 
              className="text-gray-500"
              style={{ transform: 'translate(-10px, -10px)' }}
            />
          ) : Icon ? (
            <Icon 
              size={24} 
              className="text-white"
              style={{ transform: 'translate(-12px, -12px)' }}
            />
          ) : (
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-white text-2xl font-bold select-none"
            >
              ?
            </text>
          )}
          
          {/* Tier badge */}
          {node.tier > 0 && (
            <circle
              cx="20"
              cy="-20"
              r="12"
              fill="#1f2937"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
          {node.tier > 0 && (
            <text
              x="20"
              y="-20"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-white text-xs font-bold select-none"
            >
              {node.tier}
            </text>
          )}
        </g>
      );
    });
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mb-6 shadow-2xl">
              <Trophy className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              Strom úspěchů
            </h1>
            <p className="text-xl text-gray-400">
              Odemykejte nové schopnosti a sbírejte odměny
            </p>
            
            {/* Stats bar */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl px-6 py-3 border border-gray-700">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  <span className="text-gray-400">Odemčeno:</span>
                  <span className="text-white font-bold">1 / 22</span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl px-6 py-3 border border-gray-700">
                <div className="flex items-center gap-2">
                  <Zap className="text-purple-500" size={20} />
                  <span className="text-gray-400">Body talentu:</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-2xl px-6 py-3 border border-gray-700">
                <div className="flex items-center gap-2">
                  <Medal className="text-orange-500" size={20} />
                  <span className="text-gray-400">Úroveň stromu:</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skill Tree Container */}
          <div className="relative bg-gray-900/50 backdrop-blur rounded-3xl border border-gray-700 overflow-hidden" style={{ height: '800px' }}>
            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => setTreeOffset(prev => ({ ...prev, x: prev.x - 100 }))}
                className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setTreeOffset(prev => ({ ...prev, x: prev.x + 100 }))}
                className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setTreeOffset({ x: 0, y: 0 })}
                className="px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-all text-sm"
              >
                Vycentrovat
              </button>
            </div>
            
            {/* Legend */}
            <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur rounded-lg p-4">
              <h3 className="text-white font-bold mb-2 text-sm">Legenda</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="text-gray-400">Odemčeno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-400">Zamčeno</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-400">Master</span>
                </div>
              </div>
            </div>
            
            {/* SVG Skill Tree */}
            <svg
              width="100%"
              height="100%"
              viewBox={`${-200 + treeOffset.x} ${-100 + treeOffset.y} 1000 1000`}
              className="absolute inset-0"
            >
              {/* Gradient definitions */}
              <defs>
                <radialGradient id="glow">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Grid background */}
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="50" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="0" x2="50" y2="0" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <rect width="2000" height="2000" fill="url(#grid)" />
              
              {/* Connections */}
              {renderConnections()}
              
              {/* Nodes */}
              {renderNodes()}
            </svg>
            
            {/* Selected Node Info */}
            {selectedNode && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/95 backdrop-blur rounded-2xl p-6 max-w-md border border-gray-700 animate-slideInUp">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {selectedNode.id === 'start' ? 'Začátek cesty' : 
                       selectedNode.id === 'master' ? 'Master úspěch' : 
                       'Neznámý úspěch'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Tier {selectedNode.tier} • {selectedNode.unlocked ? 'Odemčeno' : 'Zamčeno'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <p className="text-gray-300 mb-4">
                  {selectedNode.id === 'start' ? 
                    'Toto je začátek vaší cesty. Odtud se vydáte vstříc novým výzvám!' :
                    'Tento úspěch ještě není dostupný. Brzy přidáme více obsahu!'}
                </p>
                
                {!selectedNode.unlocked && (
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-yellow-500 text-sm flex items-center gap-2">
                      <Lock size={16} />
                      Požadavky pro odemčení budou přidány brzy
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Info box */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">Jak to funguje?</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">1. Plňte úkoly</h4>
                <p className="text-gray-400">
                  Získávejte body talentu plněním herních úkolů a výzev.
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">2. Odemykejte uzly</h4>
                <p className="text-gray-400">
                  Použijte body k odemčení nových úspěchů a schopností.
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-bold text-white mb-2">3. Sbírejte odměny</h4>
                <p className="text-gray-400">
                  Každý odemčený uzel přináší jedinečné odměny a bonusy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}