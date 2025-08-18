"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  User, TrendingUp, X, Zap, Target, Shield, Coins,
  Brain, Trophy, Sparkles, ChevronRight, Lock, Check,
  Star, Flame, Diamond, Gem, Crown
} from 'lucide-react';

/**
 * Herní profil manažera - CONSTELLATION DESIGN
 * Skill tree jako hvězdná mapa
 */

// Definice všech dovedností s novým layoutem
const SKILLS = {
  // CENTRÁLNÍ SKILL
  motivator: {
    id: 'motivator',
    name: 'Motivátor',
    icon: '🎯',
    description: 'Zvyšuje morálku týmu',
    maxLevel: 3,
    effects: ['+5% morálka', '+10% morálka', '+15% morálka', '+20% morálka'],
    costPerLevel: [1, 2, 3],
    angle: 0,
    distance: 0,
    size: 'large',
    category: 'core',
    connections: ['ekonom', 'scout', 'taktik', 'psycholog', 'kondicak', 'trener']
  },
  
  // VNITŘNÍ KRUH - Základní skills
  ekonom: {
    id: 'ekonom',
    name: 'Ekonom',
    icon: '💰',
    description: 'Slevy na vylepšení karet',
    maxLevel: 3,
    effects: ['-5% ceny', '-10% ceny', '-15% ceny', '-20% ceny'],
    costPerLevel: [1, 2, 3],
    angle: 0,
    distance: 120,
    size: 'medium',
    category: 'basic',
    connections: ['motivator', 'sponzor']
  },
  scout: {
    id: 'scout',
    name: 'Scout',
    icon: '🔍',
    description: 'Lepší karty v balíčcích',
    maxLevel: 3,
    effects: ['+5% šance', '+10% šance', '+15% šance', '+20% šance'],
    costPerLevel: [1, 2, 3],
    angle: 120,
    distance: 120,
    size: 'medium',
    category: 'basic',
    connections: ['motivator', 'stastnaRuka']
  },
  taktik: {
    id: 'taktik',
    name: 'Taktik',
    icon: '📋',
    description: 'Odemkne nové formace',
    maxLevel: 1,
    effects: ['Nové formace dostupné'],
    costPerLevel: [2],
    angle: 240,
    distance: 120,
    size: 'medium',
    category: 'basic',
    connections: ['motivator']
  },
  
  // STŘEDNÍ KRUH - Support skills
  psycholog: {
    id: 'psycholog',
    name: 'Psycholog',
    icon: '🧠',
    description: 'Hráči méně ztrácí morálku',
    maxLevel: 1,
    effects: ['-50% ztráta morálky'],
    costPerLevel: [2],
    angle: 60,
    distance: 180,
    size: 'small',
    category: 'support',
    connections: ['motivator', 'veteran']
  },
  kondicak: {
    id: 'kondicak',
    name: 'Kondičák',
    icon: '🏃',
    description: 'Bonusy k fyzickým aktivitám',
    maxLevel: 1,
    effects: ['+25% efekt aktivit'],
    costPerLevel: [2],
    angle: 180,
    distance: 180,
    size: 'small',
    category: 'support',
    connections: ['motivator', 'trener']
  },
  trener: {
    id: 'trener',
    name: 'Trenér',
    icon: '💪',
    description: 'Rychlejší regenerace hráčů',
    maxLevel: 1,
    effects: ['+30% regenerace'],
    costPerLevel: [2],
    angle: 300,
    distance: 180,
    size: 'small',
    category: 'support',
    connections: ['motivator', 'kondicak']
  },
  
  // VNĚJŠÍ KRUH - Legendary perks
  stastnaRuka: {
    id: 'stastnaRuka',
    name: 'Šťastná ruka',
    icon: '🍀',
    description: '10% šance na extra kartu v balíčku',
    maxLevel: 1,
    effects: ['+10% na bonus kartu'],
    costPerLevel: [3],
    angle: 90,
    distance: 250,
    size: 'medium',
    category: 'legendary',
    special: true,
    connections: ['scout']
  },
  veteran: {
    id: 'veteran',
    name: 'Veterán',
    icon: '⭐',
    description: 'XP bonus +20%',
    maxLevel: 1,
    effects: ['+20% XP ze všech zdrojů'],
    costPerLevel: [3],
    angle: 30,
    distance: 250,
    size: 'medium',
    category: 'legendary',
    special: true,
    connections: ['psycholog']
  },
  sponzor: {
    id: 'sponzor',
    name: 'Sponzor',
    icon: '🤝',
    description: 'Denní bonus 100 kreditů',
    maxLevel: 1,
    effects: ['+100 kreditů denně'],
    costPerLevel: [4],
    angle: 330,
    distance: 250,
    size: 'medium',
    category: 'legendary',
    special: true,
    connections: ['ekonom']
  },
  legenda: {
    id: 'legenda',
    name: 'Legenda klubu',
    icon: '🏆',
    description: 'Prestiž bonusy',
    maxLevel: 1,
    effects: ['Dvojnásobné odměny z achievementů'],
    costPerLevel: [5],
    angle: 210,
    distance: 260,
    size: 'large',
    category: 'legendary',
    special: true,
    connections: []
  }
};

// Constellation Node komponenta
const ConstellationNode = ({ skill, level, canUpgrade, onUpgrade, isConnected, centerX, centerY, onHover, onSelect }) => {
  const [showPulse, setShowPulse] = useState(false);
  
  const isMaxed = level >= skill.maxLevel;
  const isUnlocked = level > 0;
  
  // Vypočítat pozici
  const angleRad = (skill.angle * Math.PI) / 180;
  const x = centerX + Math.cos(angleRad) * skill.distance;
  const y = centerY + Math.sin(angleRad) * skill.distance;
  
  // Velikosti podle typu
  const sizes = {
    large: 80,
    medium: 65,
    small: 50
  };
  const size = sizes[skill.size] || 65;
  
  // Barvy podle stavu
  const getColor = () => {
    if (isMaxed) return '#FFD700'; // Zlatá
    if (isUnlocked) return '#10B981'; // Zelená
    if (canUpgrade) return '#3B82F6'; // Modrá
    return '#4B5563'; // Šedá
  };
  
  const handleClick = () => {
    if (canUpgrade) {
      onUpgrade(skill.id);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }
    onSelect(skill);
  };
  
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow efekt */}
      {(isUnlocked || canUpgrade) && (
        <circle
          r={size/2 + 10}
          fill="none"
          stroke={getColor()}
          strokeWidth="1"
          opacity="0.3"
          className={isUnlocked ? "animate-pulse" : ""}
        />
      )}
      
      {/* Hlavní kruh */}
      <circle
        r={size/2}
        fill={`url(#gradient-${skill.id})`}
        stroke={getColor()}
        strokeWidth={isUnlocked ? 3 : 2}
        filter={isUnlocked ? "url(#glow)" : ""}
        className="transition-all duration-300 hover:scale-110"
      />
      
      {/* Vnitřní kruh pro speciální skills */}
      {skill.special && (
        <circle
          r={size/2 - 10}
          fill="none"
          stroke={getColor()}
          strokeWidth="1"
          strokeDasharray="5 5"
          className="animate-spin-slow"
        />
      )}
      
      {/* Icon */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size/2.5}
        className="select-none pointer-events-none"
      >
        {skill.icon}
      </text>
      
      {/* Level indikátory */}
      {skill.maxLevel > 1 && (
        <g transform={`translate(0, ${size/2 + 10})`}>
          {[...Array(skill.maxLevel)].map((_, i) => (
            <circle
              key={i}
              cx={(i - skill.maxLevel/2 + 0.5) * 12}
              cy={0}
              r={3}
              fill={i < level ? getColor() : '#1F2937'}
            />
          ))}
        </g>
      )}
      
      {/* Cost badge */}
      {canUpgrade && !isMaxed && (
        <g transform={`translate(${size/2 - 5}, ${-size/2 + 5})`}>
          <circle r={12} fill="#3B82F6" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill="white"
            fontWeight="bold"
          >
            {skill.costPerLevel[level]}
          </text>
        </g>
      )}
      
      {/* Special effect */}
      {skill.special && isUnlocked && (
        <>
          <Sparkles 
            x={-size/2 + 5} 
            y={-size/2 + 5} 
            size={12} 
            color="#FFD700"
            className="animate-pulse"
          />
        </>
      )}
      
      {/* Pulse effect on upgrade */}
      {showPulse && (
        <circle
          r={size/2}
          fill="none"
          stroke="white"
          strokeWidth="4"
          opacity="1"
          className="animate-pulse-out"
        />
      )}
      
      {/* Název skillu */}
      <text
        y={size/2 + 25}
        textAnchor="middle"
        fontSize="12"
        fill={isUnlocked ? 'white' : '#9CA3AF'}
        fontWeight={isUnlocked ? 'bold' : 'normal'}
        className="select-none pointer-events-none"
      >
        {skill.name}
      </text>
    </g>
  );
};

// Animated Connection Line
const AnimatedConnection = ({ from, to, isActive, skills }) => {
  const fromSkill = skills[from];
  const toSkill = skills[to];
  
  if (!fromSkill || !toSkill) return null;
  
  const centerX = 450;
  const centerY = 300;
  
  const fromAngleRad = (fromSkill.angle * Math.PI) / 180;
  const toAngleRad = (toSkill.angle * Math.PI) / 180;
  
  const x1 = centerX + Math.cos(fromAngleRad) * fromSkill.distance;
  const y1 = centerY + Math.sin(fromAngleRad) * fromSkill.distance;
  const x2 = centerX + Math.cos(toAngleRad) * toSkill.distance;
  const y2 = centerY + Math.sin(toAngleRad) * toSkill.distance;
  
  // Kontrolní body pro křivku
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const controlX = midX + (centerX - midX) * 0.3;
  const controlY = midY + (centerY - midY) * 0.3;
  
  const path = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  
  return (
    <g>
      {/* Základní čára */}
      <path
        d={path}
        fill="none"
        stroke={isActive ? "#60A5FA" : "#374151"}
        strokeWidth={isActive ? "2" : "1"}
        opacity={isActive ? "0.8" : "0.3"}
        strokeLinecap="round"
      />
      
      {/* Animovaná energie po čáře */}
      {isActive && (
        <>
          {/* Světelný efekt */}
          <path
            d={path}
            fill="none"
            stroke="url(#flow-gradient)"
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
            className="animate-pulse"
          />
          
          {/* Putující částice */}
          <circle r="3" fill="#60A5FA">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={path}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </animateMotion>
          </circle>
          
          <circle r="3" fill="#A78BFA">
            <animateMotion
              dur="3s"
              begin="1s"
              repeatCount="indefinite"
              path={path}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </animateMotion>
          </circle>
        </>
      )}
    </g>
  );
};

// Background Stars
const BackgroundStars = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      x: Math.random() * 900,
      y: Math.random() * 600,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2
    }));
  }, []);
  
  return (
    <g>
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="white"
          opacity={star.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
            dur={`${star.duration}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
};

export default function ManagerProfile({ 
  profile, 
  isOpen, 
  onClose,
  onSkillUpgrade 
}) {
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [skillLevels, setSkillLevels] = useState({});
  const [availablePoints, setAvailablePoints] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const svgRef = useRef(null);
  
  // Inicializace
  useEffect(() => {
    if (profile) {
      const savedSkills = profile.managerSkills || {};
      const initialSkills = {};
      
      Object.keys(SKILLS).forEach(skillId => {
        initialSkills[skillId] = savedSkills[skillId] || 0;
      });
      
      setSkillLevels(initialSkills);
      
      const usedPoints = Object.entries(initialSkills).reduce((sum, [skillId, level]) => {
        const skill = SKILLS[skillId];
        if (skill && level > 0) {
          return sum + skill.costPerLevel.slice(0, level).reduce((a, b) => a + b, 0);
        }
        return sum;
      }, 0);
      
      const totalPoints = profile.level || 1;
      setAvailablePoints(Math.max(0, totalPoints - usedPoints));
    }
  }, [profile]);
  
  const handleSkillUpgrade = (skillId) => {
    const skill = SKILLS[skillId];
    const currentLevel = skillLevels[skillId] || 0;
    const cost = skill.costPerLevel[currentLevel];
    
    if (availablePoints >= cost && currentLevel < skill.maxLevel) {
      setSkillLevels(prev => ({
        ...prev,
        [skillId]: currentLevel + 1
      }));
      setAvailablePoints(prev => prev - cost);
      
      if (onSkillUpgrade) {
        onSkillUpgrade(skillId, currentLevel + 1);
      }
    }
  };
  
  // TESTOVACÍ FUNKCE
  const handleAddTestPoints = () => {
    setAvailablePoints(prev => prev + 10);
  };
  
  const handleResetSkills = () => {
    // Vypočítat všechny použité body
    const totalUsedPoints = Object.entries(skillLevels).reduce((sum, [skillId, level]) => {
      const skill = SKILLS[skillId];
      if (skill && level > 0) {
        return sum + skill.costPerLevel.slice(0, level).reduce((a, b) => a + b, 0);
      }
      return sum;
    }, 0);
    
    // Reset všech skills
    setSkillLevels({});
    
    // Vrátit všechny body
    setAvailablePoints(prev => prev + totalUsedPoints);
    
    // Reset v Firebase (pokud je potřeba)
    if (onSkillUpgrade) {
      Object.keys(SKILLS).forEach(skillId => {
        onSkillUpgrade(skillId, 0);
      });
    }
  };
  
  const getConnections = () => {
    const connections = [];
    Object.values(SKILLS).forEach(skill => {
      if (skill.connections) {
        skill.connections.forEach(targetId => {
          // Přidat pouze unikátní spojení
          const connectionId = [skill.id, targetId].sort().join('-');
          if (!connections.find(c => c.id === connectionId)) {
            const isActive = skillLevels[skill.id] > 0 && skillLevels[targetId] > 0;
            const isVisible = skillLevels[skill.id] > 0 || skillLevels[targetId] > 0;
            
            if (isVisible) {
              connections.push({
                id: connectionId,
                from: skill.id,
                to: targetId,
                isActive
              });
            }
          }
        });
      }
    });
    return connections;
  };
  
  // Widget
  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        onMouseEnter={() => setIsWidgetHovered(true)}
        onMouseLeave={() => setIsWidgetHovered(false)}
        className="fixed top-4 left-4 z-[9998] group"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          
          {/* Main button */}
          <div className="relative px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 group-hover:border-purple-400/50 transition-all">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                </div>
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-gray-900">{profile?.level || 1}</span>
                </div>
              </div>
              
              {/* Text */}
              <div>
                <div className="text-xs text-gray-400">Skill Tree</div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  Manažer
                  {availablePoints > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-[10px] rounded-full text-gray-900 animate-pulse">
                      +{availablePoints}
                    </span>
                  )}
                </div>
              </div>
              
              <ChevronRight size={16} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </button>
    );
  }
  
  // Main constellation view
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-blue-900/50" />
      </div>
      
      {/* Main container */}
      <div className="relative bg-gray-900/90 rounded-3xl w-[95%] max-w-7xl h-[90vh] overflow-hidden border border-purple-500/20 backdrop-blur-xl">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Constellation of Skills
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-gray-400">{profile?.displayName || 'Manažer'}</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-yellow-500 font-bold">Level {profile?.level || 1}</span>
                  </div>
                  {availablePoints > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full animate-pulse">
                      <Star size={14} className="text-green-500" />
                      <span className="text-green-500 font-bold">{availablePoints} bodů k rozdělení</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* TEST BUTTONS */}
              <div className="flex gap-2 mr-4 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <span className="text-purple-400 text-xs font-bold mr-2">DEV:</span>
                <button
                  onClick={handleAddTestPoints}
                  className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold rounded transition-all"
                  title="Přidat 10 testovacích bodů"
                >
                  +10 bodů
                </button>
                <button
                  onClick={handleResetSkills}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded transition-all"
                  title="Resetovat všechny skills"
                >
                  Reset
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:rotate-90"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* SVG Constellation */}
        <div className="absolute inset-0 flex items-center justify-center pt-20">
          <svg
            ref={svgRef}
            width="900"
            height="600"
            viewBox="0 0 900 600"
            className="max-w-full max-h-full"
          >
            {/* Definitions */}
            <defs>
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Flow gradient */}
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0">
                  <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#A78BFA" stopOpacity="1">
                  <animate attributeName="stop-opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0">
                  <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              {/* Skill gradients */}
              {Object.values(SKILLS).map(skill => (
                <radialGradient key={`gradient-${skill.id}`} id={`gradient-${skill.id}`}>
                  <stop offset="0%" stopColor={
                    skillLevels[skill.id] >= skill.maxLevel ? '#FFD700' :
                    skillLevels[skill.id] > 0 ? '#10B981' :
                    availablePoints >= (skill.costPerLevel[skillLevels[skill.id] || 0] || 0) ? '#3B82F6' :
                    '#1F2937'
                  } stopOpacity="0.9" />
                  <stop offset="100%" stopColor={
                    skillLevels[skill.id] >= skill.maxLevel ? '#FFA500' :
                    skillLevels[skill.id] > 0 ? '#059669' :
                    availablePoints >= (skill.costPerLevel[skillLevels[skill.id] || 0] || 0) ? '#1E40AF' :
                    '#111827'
                  } stopOpacity="0.9" />
                </radialGradient>
              ))}
            </defs>
            
            {/* Background stars */}
            <BackgroundStars />
            
            {/* Connections */}
            <g className="connections">
              {getConnections().map(conn => (
                <AnimatedConnection
                  key={conn.id}
                  from={conn.from}
                  to={conn.to}
                  isActive={conn.isActive}
                  skills={SKILLS}
                />
              ))}
            </g>
            
            {/* Skill nodes */}
            <g className="nodes">
              {Object.values(SKILLS).map(skill => (
                <ConstellationNode
                  key={skill.id}
                  skill={skill}
                  level={skillLevels[skill.id] || 0}
                  canUpgrade={
                    skillLevels[skill.id] < skill.maxLevel &&
                    availablePoints >= skill.costPerLevel[skillLevels[skill.id] || 0]
                  }
                  onUpgrade={handleSkillUpgrade}
                  onHover={setHoveredSkill}
                  onSelect={setSelectedSkill}
                  isConnected={getConnections().some(
                    conn => (conn.from === skill.id || conn.to === skill.id) && conn.isActive
                  )}
                  centerX={450}
                  centerY={300}
                />
              ))}
            </g>
          </svg>
        </div>
        
        {/* Skill Detail Panel - vlevo dole */}
        {(hoveredSkill || selectedSkill) && (
          <div className="absolute bottom-6 left-6 z-10 animate-fade-in">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 max-w-sm">
              {(() => {
                const skill = hoveredSkill || selectedSkill;
                const level = skillLevels[skill.id] || 0;
                const isMaxed = level >= skill.maxLevel;
                const canUpgrade = level < skill.maxLevel && availablePoints >= skill.costPerLevel[level];
                
                return (
                  <>
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="text-3xl">{skill.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {skill.name}
                          {skill.special && <Diamond size={16} className="text-purple-400" />}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {skill.category === 'core' && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Core</span>
                          )}
                          {skill.category === 'legendary' && (
                            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">Legendary</span>
                          )}
                          {isMaxed && (
                            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">MAX</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4">{skill.description}</p>
                    
                    {/* Level Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Úroveň</span>
                        <span className="text-xs text-white font-bold">{level}/{skill.maxLevel}</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(skill.maxLevel)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-2 rounded-full transition-all ${
                              i < level 
                                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Effects */}
                    <div className="space-y-2 mb-4">
                      {level > 0 && (
                        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="text-xs text-green-400 font-bold mb-1">Aktuální efekt:</div>
                          <div className="text-sm text-white">{skill.effects[level - 1]}</div>
                        </div>
                      )}
                      
                      {!isMaxed && (
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="text-xs text-blue-400 font-bold mb-1">Další úroveň:</div>
                          <div className="text-sm text-white">{skill.effects[level]}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Upgrade Button */}
                    {!isMaxed && (
                      <button
                        onClick={() => handleSkillUpgrade(skill.id)}
                        disabled={!canUpgrade}
                        className={`w-full py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                          canUpgrade
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canUpgrade ? (
                          <>
                            <Zap size={16} />
                            Vylepšit za {skill.costPerLevel[level]} bodů
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            Potřeba {skill.costPerLevel[level]} bodů
                          </>
                        )}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 flex justify-center">
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10">
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <span className="text-gray-400">Zamčené</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-blue-400">Dostupné</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-400">Odemčené</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-yellow-400">Master</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-purple-400" />
                <span className="text-purple-400">Legendární</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-out {
          0% { r: 40; opacity: 1; }
          100% { r: 80; opacity: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-out {
          animation: pulse-out 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}