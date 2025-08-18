'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, addCredits, addXP } from '@/lib/firebaseProfile';
import { 
  Heart, Shield, Zap, Swords, Sparkles, 
  ArrowLeft, Volume2, VolumeX, TrendingUp,
  Award, Coins, AlertCircle, ChevronRight,
  Flame, Target, ShieldCheck
} from 'lucide-react';

export default function ToughAnimalsBattle() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Game states
  const [profile, setProfile] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, ready, battle, victory, defeat
  const [turn, setTurn] = useState('player'); // player, enemy, animating
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
  
  // Battle states
  const [playerAnimal, setPlayerAnimal] = useState({
    id: 1,
    name: 'Lev',
    emoji: '🦁',
    hp: 100,
    maxHp: 100,
    energy: 100,
    maxEnergy: 100,
    defense: 0,
    combo: 0
  });
  
  const [enemyAnimal, setEnemyAnimal] = useState({
    id: 2,
    name: 'Medvěd',
    emoji: '🐻',
    hp: 100,
    maxHp: 100,
    energy: 100,
    maxEnergy: 100,
    defense: 0,
    combo: 0
  });
  
  // Animation states
  const [playerAnimation, setPlayerAnimation] = useState('');
  const [enemyAnimation, setEnemyAnimation] = useState('');
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  
  // Attacks configuration
  const attacks = [
    {
      id: 'basic',
      name: 'Základní útok',
      icon: <Swords size={20} />,
      damage: [15, 25],
      accuracy: 100,
      energyCost: 0,
      description: 'Spolehlivý útok s jistým zásahem',
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'power',
      name: 'Silný útok',
      icon: <Flame size={20} />,
      damage: [30, 45],
      accuracy: 70,
      energyCost: 30,
      description: 'Devastující útok s rizikem minutí',
      color: 'from-red-600 to-orange-600'
    },
    {
      id: 'defend',
      name: 'Obrana',
      icon: <ShieldCheck size={20} />,
      damage: [0, 0],
      accuracy: 100,
      energyCost: 20,
      description: 'Zvýší obranu o 50% na příští tah',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'special',
      name: 'Speciální útok',
      icon: <Sparkles size={20} />,
      damage: [20, 30],
      accuracy: 85,
      energyCost: 50,
      description: 'Unikátní útok s bonusovými efekty',
      color: 'from-purple-600 to-pink-600'
    }
  ];
  
  // Load profile on mount
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);
  
  const loadProfile = async () => {
    try {
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
      setGameState('ready');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  // Add floating damage text
  const addFloatingText = (text, type, isPlayer) => {
    const id = Date.now() + Math.random();
    const newText = { id, text, type, isPlayer };
    setFloatingTexts(prev => [...prev, newText]);
    
    // Remove after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };
  
  // Add to battle log
  const addBattleLog = (message, type = 'info') => {
    setBattleLog(prev => [...prev, { message, type, timestamp: Date.now() }].slice(-5));
  };
  
  // Calculate damage with variance
  const calculateDamage = (attack, attacker, defender) => {
    const [minDamage, maxDamage] = attack.damage;
    let damage = Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    
    // Apply defense
    if (defender.defense > 0) {
      damage = Math.floor(damage * (1 - defender.defense / 100));
    }
    
    // Critical hit chance (10%)
    const isCritical = Math.random() < 0.1;
    if (isCritical) {
      damage *= 2;
    }
    
    // Combo bonus
    if (attacker.combo > 0) {
      damage = Math.floor(damage * (1 + attacker.combo * 0.1));
    }
    
    return { damage, isCritical };
  };
  
  // Player attack
  const executePlayerAttack = async (attack) => {
    if (turn !== 'player' || playerAnimal.energy < attack.energyCost) return;
    
    setTurn('animating');
    setSelectedAction(null);
    
    // Check accuracy
    const hit = Math.random() * 100 < attack.accuracy;
    
    if (attack.id === 'defend') {
      // Defense action
      setPlayerAnimation('defend');
      setPlayerAnimal(prev => ({ ...prev, defense: 50, energy: prev.energy - attack.energyCost }));
      addFloatingText('+50% Obrana', 'defense', true);
      addBattleLog(`${playerAnimal.name} se brání!`, 'defense');
      
      setTimeout(() => {
        setPlayerAnimation('');
        enemyTurn();
      }, 1000);
      
    } else if (hit) {
      // Attack hits
      setPlayerAnimation('attack');
      const { damage, isCritical } = calculateDamage(attack, playerAnimal, enemyAnimal);
      
      setTimeout(() => {
        setEnemyAnimation('hit');
        setEnemyAnimal(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
        
        // Update player state
        setPlayerAnimal(prev => ({
          ...prev,
          energy: prev.energy - attack.energyCost,
          combo: prev.combo + 1
        }));
        
        // Visual feedback
        addFloatingText(
          isCritical ? `KRIT! -${damage}` : `-${damage}`,
          isCritical ? 'critical' : 'damage',
          false
        );
        
        addBattleLog(
          `${playerAnimal.name} použil ${attack.name} za ${damage} poškození${isCritical ? ' (Kritický zásah!)' : ''}`,
          'player'
        );
        
        setTimeout(() => {
          setPlayerAnimation('');
          setEnemyAnimation('');
          
          // Check victory
          if (enemyAnimal.hp - damage <= 0) {
            handleVictory();
          } else {
            enemyTurn();
          }
        }, 1000);
      }, 500);
      
    } else {
      // Attack misses
      setPlayerAnimation('attack');
      
      setTimeout(() => {
        addFloatingText('Minutí!', 'miss', false);
        addBattleLog(`${playerAnimal.name} minul!`, 'miss');
        setPlayerAnimal(prev => ({
          ...prev,
          energy: prev.energy - attack.energyCost,
          combo: 0
        }));
        
        setTimeout(() => {
          setPlayerAnimation('');
          enemyTurn();
        }, 1000);
      }, 500);
    }
  };
  
  // Enemy AI turn
  const enemyTurn = () => {
    setTurn('enemy');
    
    // Reset player defense
    setPlayerAnimal(prev => ({ ...prev, defense: 0 }));
    
    setTimeout(() => {
      // Simple AI logic
      let chosenAttack;
      
      if (enemyAnimal.hp < 30 && enemyAnimal.energy >= 20) {
        // Low HP - defend
        chosenAttack = attacks[2];
      } else if (enemyAnimal.energy >= 50 && Math.random() < 0.3) {
        // Sometimes use special
        chosenAttack = attacks[3];
      } else if (enemyAnimal.energy >= 30 && playerAnimal.hp < 40) {
        // Finish with power attack
        chosenAttack = attacks[1];
      } else {
        // Default to basic
        chosenAttack = attacks[0];
      }
      
      executeEnemyAttack(chosenAttack);
    }, 1500);
  };
  
  // Enemy attack execution
  const executeEnemyAttack = async (attack) => {
    const hit = Math.random() * 100 < attack.accuracy;
    
    if (attack.id === 'defend') {
      setEnemyAnimation('defend');
      setEnemyAnimal(prev => ({ ...prev, defense: 50, energy: prev.energy - attack.energyCost }));
      addFloatingText('+50% Obrana', 'defense', false);
      addBattleLog(`${enemyAnimal.name} se brání!`, 'enemy');
      
      setTimeout(() => {
        setEnemyAnimation('');
        setTurn('player');
        // Reset enemy defense next turn
        setEnemyAnimal(prev => ({ ...prev, defense: 0 }));
      }, 1000);
      
    } else if (hit) {
      setEnemyAnimation('attack');
      const { damage, isCritical } = calculateDamage(attack, enemyAnimal, playerAnimal);
      
      setTimeout(() => {
        setPlayerAnimation('hit');
        setPlayerAnimal(prev => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
        setEnemyAnimal(prev => ({
          ...prev,
          energy: prev.energy - attack.energyCost,
          combo: prev.combo + 1
        }));
        
        addFloatingText(
          isCritical ? `KRIT! -${damage}` : `-${damage}`,
          isCritical ? 'critical' : 'damage',
          true
        );
        
        addBattleLog(
          `${enemyAnimal.name} použil ${attack.name} za ${damage} poškození${isCritical ? ' (Kritický zásah!)' : ''}`,
          'enemy'
        );
        
        setTimeout(() => {
          setPlayerAnimation('');
          setEnemyAnimation('');
          
          if (playerAnimal.hp - damage <= 0) {
            handleDefeat();
          } else {
            setTurn('player');
          }
        }, 1000);
      }, 500);
      
    } else {
      setEnemyAnimation('attack');
      
      setTimeout(() => {
        addFloatingText('Minutí!', 'miss', true);
        addBattleLog(`${enemyAnimal.name} minul!`, 'miss');
        setEnemyAnimal(prev => ({
          ...prev,
          energy: prev.energy - attack.energyCost,
          combo: 0
        }));
        
        setTimeout(() => {
          setEnemyAnimation('');
          setTurn('player');
        }, 1000);
      }, 500);
    }
  };
  
  // Handle victory
  const handleVictory = async () => {
    setGameState('victory');
    const creditsWon = Math.floor(Math.random() * 400) + 100;
    const xpWon = Math.floor(Math.random() * 50) + 50;
    
    try {
      await addCredits(user.uid, creditsWon);
      await addXP(user.uid, xpWon);
      
      addBattleLog(`🏆 Vítězství! Získáváš ${creditsWon} kreditů a ${xpWon} XP!`, 'victory');
    } catch (error) {
      console.error('Error adding rewards:', error);
    }
  };
  
  // Handle defeat
  const handleDefeat = () => {
    setGameState('defeat');
    addBattleLog('💀 Porážka! Zkus to znovu!', 'defeat');
  };
  
  // Regenerate energy each turn
  useEffect(() => {
    if (turn === 'player') {
      setPlayerAnimal(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + 10)
      }));
      setEnemyAnimal(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + 10)
      }));
    }
  }, [turn]);
  
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <span className="text-6xl">⚔️</span>
          </div>
          <p className="text-green-400 font-bold">Připravuji arénu...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black overflow-hidden">
      {/* Battle Arena Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 text-8xl animate-float">🌿</div>
        <div className="absolute bottom-20 right-20 text-8xl animate-float" style={{ animationDelay: '2s' }}>🌴</div>
      </div>
      
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/60 backdrop-blur-lg border-b border-green-500/30 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push('/games/tough-animals')}
              className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-all"
            >
              <ArrowLeft className="text-green-400" size={24} />
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
                BATTLE ARENA
              </h1>
            </div>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-all"
            >
              {soundEnabled ? (
                <Volume2 className="text-green-400" size={24} />
              ) : (
                <VolumeX className="text-gray-400" size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Battle Field */}
        <div className="flex-1 flex flex-col justify-between p-4 max-w-7xl mx-auto w-full">
          
          {/* Animals Display */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Player Animal */}
            <div className="relative">
              <div className="bg-black/40 backdrop-blur rounded-2xl p-4 border border-green-500/30">
                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{playerAnimal.name}</span>
                    <span className="text-green-400 text-sm">{playerAnimal.hp}/{playerAnimal.maxHp} HP</span>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                      style={{ width: `${(playerAnimal.hp / playerAnimal.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Energy Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-yellow-400 text-sm flex items-center gap-1">
                      <Zap size={14} /> Energie
                    </span>
                    <span className="text-yellow-400 text-sm">{playerAnimal.energy}/{playerAnimal.maxEnergy}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${(playerAnimal.energy / playerAnimal.maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Animal Display */}
                <div className={`
                  text-center py-8 relative
                  ${playerAnimation === 'attack' ? 'animate-pulse scale-110' : ''}
                  ${playerAnimation === 'hit' ? 'animate-shake' : ''}
                  ${playerAnimation === 'defend' ? 'animate-pulse' : ''}
                  transition-all duration-300
                `}>
                  <div className="text-8xl mb-2">{playerAnimal.emoji}</div>
                  
                  {/* Status Effects */}
                  <div className="flex items-center justify-center gap-2">
                    {playerAnimal.defense > 0 && (
                      <div className="px-2 py-1 bg-blue-600/50 rounded-full text-xs text-white flex items-center gap-1">
                        <Shield size={12} /> +{playerAnimal.defense}%
                      </div>
                    )}
                    {playerAnimal.combo > 0 && (
                      <div className="px-2 py-1 bg-orange-600/50 rounded-full text-xs text-white flex items-center gap-1">
                        <Flame size={12} /> x{playerAnimal.combo}
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Damage Texts */}
                  {floatingTexts.filter(t => t.isPlayer).map(text => (
                    <div
                      key={text.id}
                      className={`
                        absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none
                        animate-float-up font-bold text-2xl
                        ${text.type === 'damage' ? 'text-red-500' : ''}
                        ${text.type === 'critical' ? 'text-yellow-400' : ''}
                        ${text.type === 'defense' ? 'text-blue-400' : ''}
                        ${text.type === 'miss' ? 'text-gray-400' : ''}
                      `}
                    >
                      {text.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Enemy Animal */}
            <div className="relative">
              <div className="bg-black/40 backdrop-blur rounded-2xl p-4 border border-red-500/30">
                {/* HP Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{enemyAnimal.name}</span>
                    <span className="text-red-400 text-sm">{enemyAnimal.hp}/{enemyAnimal.maxHp} HP</span>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                      style={{ width: `${(enemyAnimal.hp / enemyAnimal.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Energy Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-yellow-400 text-sm flex items-center gap-1">
                      <Zap size={14} /> Energie
                    </span>
                    <span className="text-yellow-400 text-sm">{enemyAnimal.energy}/{enemyAnimal.maxEnergy}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${(enemyAnimal.energy / enemyAnimal.maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Animal Display */}
                <div className={`
                  text-center py-8 relative
                  ${enemyAnimation === 'attack' ? 'animate-pulse scale-110' : ''}
                  ${enemyAnimation === 'hit' ? 'animate-shake' : ''}
                  ${enemyAnimation === 'defend' ? 'animate-pulse' : ''}
                  transition-all duration-300
                `}>
                  <div className="text-8xl mb-2">{enemyAnimal.emoji}</div>
                  
                  {/* Status Effects */}
                  <div className="flex items-center justify-center gap-2">
                    {enemyAnimal.defense > 0 && (
                      <div className="px-2 py-1 bg-blue-600/50 rounded-full text-xs text-white flex items-center gap-1">
                        <Shield size={12} /> +{enemyAnimal.defense}%
                      </div>
                    )}
                    {enemyAnimal.combo > 0 && (
                      <div className="px-2 py-1 bg-orange-600/50 rounded-full text-xs text-white flex items-center gap-1">
                        <Flame size={12} /> x{enemyAnimal.combo}
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Damage Texts */}
                  {floatingTexts.filter(t => !t.isPlayer).map(text => (
                    <div
                      key={text.id}
                      className={`
                        absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none
                        animate-float-up font-bold text-2xl
                        ${text.type === 'damage' ? 'text-red-500' : ''}
                        ${text.type === 'critical' ? 'text-yellow-400' : ''}
                        ${text.type === 'defense' ? 'text-blue-400' : ''}
                        ${text.type === 'miss' ? 'text-gray-400' : ''}
                      `}
                    >
                      {text.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Battle Log */}
          <div className="bg-black/40 backdrop-blur rounded-2xl p-4 mb-4 border border-green-500/30 h-32 overflow-y-auto">
            <div className="space-y-1">
              {battleLog.map((log, index) => (
                <div 
                  key={log.timestamp}
                  className={`
                    text-sm animate-fadeIn
                    ${log.type === 'player' ? 'text-green-400' : ''}
                    ${log.type === 'enemy' ? 'text-red-400' : ''}
                    ${log.type === 'defense' ? 'text-blue-400' : ''}
                    ${log.type === 'miss' ? 'text-gray-400' : ''}
                    ${log.type === 'victory' ? 'text-yellow-400 font-bold' : ''}
                    ${log.type === 'defeat' ? 'text-red-500 font-bold' : ''}
                    ${log.type === 'info' ? 'text-gray-300' : ''}
                  `}
                >
                  {log.message}
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          {gameState === 'ready' && (
            <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-green-500/30">
              {turn === 'player' ? (
                <>
                  <div className="text-center mb-4">
                    <p className="text-green-400 font-bold text-lg">Tvůj tah!</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {attacks.map(attack => (
                      <button
                        key={attack.id}
                        onClick={() => executePlayerAttack(attack)}
                        disabled={playerAnimal.energy < attack.energyCost}
                        className={`
                          relative p-4 rounded-xl transition-all transform hover:scale-105
                          ${playerAnimal.energy < attack.energyCost 
                            ? 'bg-gray-800 opacity-50 cursor-not-allowed' 
                            : `bg-gradient-to-br ${attack.color} hover:shadow-lg hover:shadow-green-500/30`
                          }
                        `}
                      >
                        <div className="text-white mb-2">{attack.icon}</div>
                        <div className="text-white font-bold text-sm mb-1">{attack.name}</div>
                        <div className="text-xs text-white/80">
                          {attack.damage[0] > 0 && `${attack.damage[0]}-${attack.damage[1]} DMG`}
                          {attack.energyCost > 0 && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Zap size={10} />
                              <span>{attack.energyCost}</span>
                            </div>
                          )}
                        </div>
                        {attack.accuracy < 100 && (
                          <div className="absolute top-1 right-1 text-xs text-white/60">
                            {attack.accuracy}%
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : turn === 'enemy' ? (
                <div className="text-center py-4">
                  <p className="text-red-400 font-bold text-lg mb-2">Soupeř přemýšlí...</p>
                  <div className="animate-pulse text-4xl">🤔</div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin text-4xl">⚔️</div>
                </div>
              )}
            </div>
          )}
          
          {/* Victory Screen */}
          {gameState === 'victory' && (
            <div className="bg-black/80 backdrop-blur rounded-2xl p-8 border border-yellow-500/50 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-4">
                VÍTĚZSTVÍ!
              </h2>
              <p className="text-white mb-6">Skvělý boj! Tvoje zvíře vyhrálo!</p>
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">+{Math.floor(Math.random() * 400) + 100}</div>
                  <div className="text-sm text-green-300 flex items-center gap-1">
                    <Coins size={14} /> Kredity
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">+{Math.floor(Math.random() * 50) + 50}</div>
                  <div className="text-sm text-yellow-300 flex items-center gap-1">
                    <Star size={14} /> XP
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all"
                >
                  Hrát znovu
                </button>
                <button
                  onClick={() => router.push('/games/tough-animals')}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
                >
                  Zpět do menu
                </button>
              </div>
            </div>
          )}
          
          {/* Defeat Screen */}
          {gameState === 'defeat' && (
            <div className="bg-black/80 backdrop-blur rounded-2xl p-8 border border-red-500/50 text-center">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-4xl font-black text-red-500 mb-4">
                PORÁŽKA
              </h2>
              <p className="text-white mb-6">Soupeř byl silnější. Zkus to znovu!</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Zkusit znovu
                </button>
                <button
                  onClick={() => router.push('/games/tough-animals')}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
                >
                  Zpět do menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}