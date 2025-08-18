"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import Mobil from "./Mobil";
import ManagerProfile from "./ManagerProfile";
import { Trophy, Coins, Shield, Zap } from 'lucide-react';
import { updateManagerSkill, loadManagerSkills } from '@/lib/firebaseManagerSkills';
import { scheduleFriendlyMatch, loadFriendlyMatches } from '@/lib/firebaseFriendlyMatches'; // NOVÉ
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/firebaseProfile';

/**
 * Manažér týmu Lancers - hlavní komponenta hry
 * NOVÉ: Podpora přátelských zápasů
 * OPRAVENO: Předání onTeamReadyForMatch do Calendar
 */
export default function TeamManager({ 
  myCollection = [], 
  credits = 12000, 
  getCardById = () => null,
  calculateOverall = () => 1
}) {
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introPhase, setIntroPhase] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  // State pro aktuální herní den
  const [currentGameDay, setCurrentGameDay] = useState(new Date(2024, 5, 1));
  const [gameCredits, setGameCredits] = useState(credits);
  
  // State pro vybrané hráče do WhatsApp skupiny
  const [selectedTeamPlayers, setSelectedTeamPlayers] = useState([]);
  
  // NOVÉ - State pro přátelské zápasy
  const [friendlyMatches, setFriendlyMatches] = useState([]);
  const [shouldShowMatchInvite, setShouldShowMatchInvite] = useState(false);
  const [matchInviteTriggered, setMatchInviteTriggered] = useState(false);
  
  // NOVÉ - State pro Manager Profile
  const [isManagerProfileOpen, setIsManagerProfileOpen] = useState(false);
  const [managerSkills, setManagerSkills] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  
  // Načíst profil a dovednosti při mountu
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);
  
  const loadUserData = async () => {
    try {
      // Načíst profil uživatele
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      setGameCredits(profile.credits || 12000);
      
      // Načíst manažerské dovednosti
      const skills = await loadManagerSkills(user.uid);
      setManagerSkills(skills);
      
      // NOVÉ - Načíst přátelské zápasy
      const matches = await loadFriendlyMatches(user.uid);
      setFriendlyMatches(matches);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  // NOVÉ - Handler pro dokončení výběru týmu s 12+ hráči
  const handleTeamReadyForMatch = () => {
    console.log('Tým má dostatek hráčů pro přátelský zápas!');
    
    // Nastavit trigger pro zobrazení pozvánky pouze jednou
    if (!matchInviteTriggered) {
      setShouldShowMatchInvite(true);
      setMatchInviteTriggered(true);
    }
  };
  
  // NOVÉ - Handler pro domluvení zápasu
  const handleMatchScheduled = async (matchDetails) => {
    console.log('Přátelský zápas domluven:', matchDetails);
    
    if (!user) return;
    
    try {
      // Uložit do Firebase
      const newMatch = await scheduleFriendlyMatch(user.uid, matchDetails);
      
      if (newMatch) {
        // Přidat do lokálního state
        setFriendlyMatches(prev => [...prev, newMatch]);
        console.log('Zápas úspěšně uložen');
      }
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };
  
  // NOVÉ - Handler pro upgrade dovedností
  const handleSkillUpgrade = async (skillId, newLevel) => {
    if (!user) return;
    
    // Aktualizovat lokální state
    setManagerSkills(prev => ({
      ...prev,
      [skillId]: newLevel
    }));
    
    // Uložit do Firebase
    await updateManagerSkill(user.uid, skillId, newLevel);
    
    console.log(`Skill ${skillId} upgraded to level ${newLevel}`);
  };
  
  // NOVÉ - Získat bonusy z dovedností
  const getSkillBonuses = () => {
    const bonuses = {
      moraleBonus: 0,
      discountRate: 0,
      cardChanceBonus: 0,
      xpMultiplier: 1,
      dailyCredits: 0,
      regenerationBonus: 0,
      activityBonus: 0,
      moraleLossReduction: 0
    };
    
    // Motivátor - bonus k morálce
    if (managerSkills.motivator) {
      bonuses.moraleBonus = managerSkills.motivator * 5;
    }
    
    // Ekonom - sleva na vylepšení
    if (managerSkills.ekonom) {
      bonuses.discountRate = managerSkills.ekonom * 5;
    }
    
    // Scout - lepší karty
    if (managerSkills.scout) {
      bonuses.cardChanceBonus = managerSkills.scout * 5;
    }
    
    // Veterán - XP bonus
    if (managerSkills.veteran) {
      bonuses.xpMultiplier = 1.2;
    }
    
    // Sponzor - denní kredity
    if (managerSkills.sponzor) {
      bonuses.dailyCredits = 100;
    }
    
    // Trenér - regenerace
    if (managerSkills.trener) {
      bonuses.regenerationBonus = 30;
    }
    
    // Kondičák - bonus k aktivitám
    if (managerSkills.kondicak) {
      bonuses.activityBonus = 25;
    }
    
    // Psycholog - méně ztráty morálky
    if (managerSkills.psycholog) {
      bonuses.moraleLossReduction = 50;
    }
    
    return bonuses;
  };
  
  const bonuses = getSkillBonuses();
  
  // Handler pro změnu dne
  const handleDayChange = (newDay) => {
    setCurrentGameDay(newDay);
    console.log('Nový herní den:', newDay.toLocaleDateString('cs-CZ'));
    
    // NOVÉ - Aplikovat denní bonus kredity pokud má Sponzor
    if (bonuses.dailyCredits > 0) {
      setGameCredits(prev => prev + bonuses.dailyCredits);
      console.log(`Denní bonus +${bonuses.dailyCredits} kreditů z dovednosti Sponzor!`);
    }
  };
  
  // Handler pro výběr týmu
  const handleTeamSelected = (players) => {
    console.log('TeamManager - handleTeamSelected voláno s:', players);
    
    if (!players || players.length === 0) {
      console.log('Žádní hráči k přidání');
      return;
    }
    
    // Kontrola jestli už nejsou stejní hráči
    const currentIds = selectedTeamPlayers.map(p => p.id).join(',');
    const newIds = players.map(p => p.id).join(',');
    
    if (currentIds === newIds) {
      console.log('Stejní hráči už jsou vybráni, ignoruji');
      return;
    }
    
    setSelectedTeamPlayers(players);
  };
  
  // Animace intro
  useEffect(() => {
    if (showIntro) {
      const phases = [
        { text: "Rok 2024", delay: 0, typeSpeed: 100 },
        { text: "1. června", delay: 2000, typeSpeed: 80 },
        { text: "Začíná nová éra...", delay: 4000, typeSpeed: 60 },
        { text: "LANCERS", delay: 6500, typeSpeed: 150, isTitle: true }
      ];
      
      phases.forEach((phase, index) => {
        setTimeout(() => {
          setIntroPhase(index);
          setTypewriterText("");
          
          // Typewriter efekt
          const text = phase.text;
          let charIndex = 0;
          
          const typeInterval = setInterval(() => {
            if (charIndex <= text.length) {
              setTypewriterText(text.slice(0, charIndex));
              charIndex++;
            } else {
              clearInterval(typeInterval);
              if (index === phases.length - 1) {
                setTimeout(() => {
                  setShowIntro(false);
                  setGameStarted(true);
                }, 1500);
              }
            }
          }, phase.typeSpeed);
        }, phase.delay);
      });
      
      // Blikající kurzor
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorInterval);
    }
  }, [showIntro]);
  
  // Handler pro start hry
  const handleStartGame = () => {
    setShowIntro(true);
  };
  
  // Úvodní obrazovka
  if (!gameStarted && !showIntro) {
    return (
      <div className="w-full h-[900px] rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Animované pozadí - hokejové prvky */}
        <div className="absolute inset-0">
          {/* Animované čáry jako led */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={`line-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent w-full animate-pulse"
                style={{
                  top: `${20 * (i + 1)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
          
          {/* Plovoucí kruhy */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-float"
                style={{
                  width: `${Math.random() * 80 + 30}px`,
                  height: `${Math.random() * 80 + 30}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Logo a tlačítko */}
        <div className="relative z-10 text-center">
          <div className="mb-8 relative">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 animate-gradient tracking-tight">
              LANCERS
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 animate-pulse" />
          </div>
          
          <p className="text-xl text-blue-200 mb-2 animate-slideUp">
            Hokejový manažer
          </p>
          
          <p className="text-sm text-blue-300 mb-8 animate-slideUp animation-delay-200">
            Sezóna 2024/2025
          </p>
          
          <button
            onClick={handleStartGame}
            className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl overflow-hidden animate-slideUp animation-delay-400"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-2xl animate-bounce">🏒</span>
              <span>Začít hrát manažera týmu Lancers</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
        
        {/* CSS animace */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
          }
          
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          .animate-float {
            animation: float linear infinite;
          }
          
          .animate-slideUp {
            animation: slideUp 0.8s ease-out forwards;
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
            opacity: 0;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }
  
  // Intro animace
  if (showIntro) {
    return (
      <div className="w-full h-[900px] rounded-2xl bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animované pozadí */}
        <div className="absolute inset-0">
          {/* Matrixový efekt v pozadí */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-blue-500 font-mono text-xs animate-matrix"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`
                }}
              >
                {Array.from({length: 30}, () => Math.random() > 0.5 ? '1' : '0').join('')}
              </div>
            ))}
          </div>
          
          {/* Světelné paprsky */}
          {introPhase >= 2 && (
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[2000px] h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-spin-slow origin-left"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Hlavní text */}
        <div className="relative z-10 text-center">
          <h1 
            className={`
              font-bold transition-all duration-1000
              ${introPhase === 0 ? 'text-4xl text-blue-400' : ''}
              ${introPhase === 1 ? 'text-5xl text-white' : ''}
              ${introPhase === 2 ? 'text-4xl text-purple-400' : ''}
              ${introPhase === 3 ? 'text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 animate-pulse' : ''}
            `}
            style={{
              textShadow: introPhase === 3 ? '0 0 40px rgba(59, 130, 246, 0.5)' : 'none',
              letterSpacing: introPhase === 3 ? '0.1em' : '0'
            }}
          >
            {typewriterText}
            {showCursor && <span className="opacity-50">|</span>}
          </h1>
          
          {/* Podtext pro finální fázi */}
          {introPhase === 3 && typewriterText === "LANCERS" && (
            <p className="mt-4 text-xl text-blue-300 animate-fadeIn">
              Připravte se na novou sezónu
            </p>
          )}
        </div>
        
        {/* CSS animace */}
        <style jsx>{`
          @keyframes matrix {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
            to {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-matrix {
            animation: matrix linear infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }
  
  // Hlavní herní obrazovka s kalendářem
  return (
    <div className="w-full h-[900px] rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      {/* Kalendář komponenta s denními aktivitami - OPRAVENO: přidán onTeamReadyForMatch */}
      <Calendar 
        initialDate={new Date(2024, 5, 1)} 
        onDayChange={handleDayChange}
        myCollection={myCollection}
        credits={gameCredits}
        onTeamSelected={handleTeamSelected}
        friendlyMatches={friendlyMatches}
        onTeamReadyForMatch={handleTeamReadyForMatch} // OPRAVENO - předání callback
      />
      
      {/* NOVÉ - Manager Profile Widget/Modal */}
      <ManagerProfile
        profile={{
          displayName: userProfile?.displayName || "Manažer",
          level: userProfile?.level || 1,
          avatar: userProfile?.avatar || null,
          managerSkills: managerSkills
        }}
        isOpen={isManagerProfileOpen}
        onClose={() => setIsManagerProfileOpen(!isManagerProfileOpen)}
        onSkillUpgrade={handleSkillUpgrade}
      />
      
      {/* NOVÉ - Zobrazení aktivních bonusů */}
      {Object.values(bonuses).some(v => v > 0 && v !== 1) && (
        <div className="absolute top-[210px] left-4 bg-green-600/20 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <div className="text-green-400 text-xs font-bold mb-2 flex items-center gap-1">
            <Shield size={14} />
            Aktivní bonusy
          </div>
          <div className="space-y-1">
            {bonuses.moraleBonus > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>🎯</span>
                <span>Morálka +{bonuses.moraleBonus}%</span>
              </div>
            )}
            {bonuses.discountRate > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>💰</span>
                <span>Slevy -{bonuses.discountRate}%</span>
              </div>
            )}
            {bonuses.cardChanceBonus > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>🔍</span>
                <span>Lepší karty +{bonuses.cardChanceBonus}%</span>
              </div>
            )}
            {bonuses.xpMultiplier > 1 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>⭐</span>
                <span>XP bonus +{Math.round((bonuses.xpMultiplier - 1) * 100)}%</span>
              </div>
            )}
            {bonuses.dailyCredits > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>🤝</span>
                <span>+{bonuses.dailyCredits} kreditů/den</span>
              </div>
            )}
            {bonuses.regenerationBonus > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>💪</span>
                <span>Regenerace +{bonuses.regenerationBonus}%</span>
              </div>
            )}
            {bonuses.activityBonus > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>🏃</span>
                <span>Aktivity +{bonuses.activityBonus}%</span>
              </div>
            )}
            {bonuses.moraleLossReduction > 0 && (
              <div className="text-white text-xs flex items-center gap-2">
                <span>🧠</span>
                <span>Ztráta morálky -{bonuses.moraleLossReduction}%</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* NOVÉ - Zobrazení přátelských zápasů */}
      {friendlyMatches.length > 0 && (
        <div className="absolute top-[210px] right-4 bg-red-600/20 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <div className="text-yellow-400 text-xs font-bold mb-2 flex items-center gap-1">
            <Trophy size={14} />
            Přátelské zápasy ({friendlyMatches.length})
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {friendlyMatches.slice(0, 3).map((match, idx) => (
              <div key={idx} className="text-white text-xs bg-black/30 rounded p-1">
                <div className="font-bold">vs {match.opponent}</div>
                <div className="text-gray-300">{match.date} • {match.time}</div>
              </div>
            ))}
            {friendlyMatches.length > 3 && (
              <div className="text-gray-400 text-xs text-center">
                +{friendlyMatches.length - 3} dalších
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Hlavní obsah */}
      <div className="p-8 h-[calc(100%-200px)] overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fadeIn">
            <div className="mb-6">
              <span className="text-6xl animate-bounce inline-block">🏒</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Vítejte v týmu Lancers!
            </h2>
            
            {/* Zobrazení aktuálního herního dne */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-4 inline-block">
              <p className="text-lg text-green-400 font-bold mb-1">
                📅 Herní den: {currentGameDay.toLocaleDateString('cs-CZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-blue-300">
                Den {Math.floor((currentGameDay - new Date(2024, 5, 1)) / (1000 * 60 * 60 * 24)) + 1} sezóny
              </p>
              <div className="flex items-center gap-2 mt-2 justify-center">
                <Coins className="text-yellow-400" size={16} />
                <span className="text-yellow-400 font-bold">Kredity: {gameCredits.toLocaleString('cs-CZ')}</span>
              </div>
              {/* NOVÉ - Zobrazení levelu a skill pointů */}
              {userProfile && (
                <div className="flex items-center gap-2 mt-1 justify-center">
                  <Zap className="text-purple-400" size={16} />
                  <span className="text-purple-400 font-bold">
                    Level {userProfile.level}
                    {Object.keys(managerSkills).length === 0 && userProfile.level > 1 && (
                      <span className="ml-1 text-yellow-400 animate-pulse">
                        ({userProfile.level} bodů k rozdělení!)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-xl text-blue-300 mb-2">Začíná sezóna 2024/2025</p>
            <p className="text-sm text-yellow-400 animate-pulse">
              💡 Klikněte na aktuální den v kalendáři pro zobrazení denních aktivit!
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Musíte dokončit všech 5 aktivit, než budete moci přejít na další den
            </p>
            
            {/* NOVÉ - Tip pro skill tree */}
            {userProfile && userProfile.level > 1 && Object.keys(managerSkills).length === 0 && (
              <div className="mt-4 p-3 bg-purple-600/20 rounded-lg inline-block">
                <p className="text-purple-400 text-sm">
                  🎯 Máte skill pointy! Klikněte na profil manažera vlevo nahoře.
                </p>
              </div>
            )}
            
            {/* Info o vybraném týmu */}
            {selectedTeamPlayers.length > 0 && (
              <div className="mt-4 p-3 bg-green-600/20 rounded-lg inline-block">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <span>✅ Tým vybrán: {selectedTeamPlayers.length} hráčů</span>
                  <span className="animate-pulse">- můžeš používat mobil! 📱</span>
                </p>
                {selectedTeamPlayers.length >= 12 && !matchInviteTriggered && (
                  <p className="text-yellow-400 text-xs mt-1 animate-pulse">
                    🏒 Brzy ti přijde nabídka na přátelský zápas!
                  </p>
                )}
              </div>
            )}
            
            {/* Testovací tlačítko pro rychlý test notifikací */}
            {selectedTeamPlayers.length === 0 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    const testPlayers = [
                      { 
                        id: 'adamschubadaobyc', 
                        uniqueId: 'adam-test-1', 
                        name: 'Adam Schubada', 
                        position: 'Útočník' 
                      },
                      { 
                        id: 'vlastanistorobyc', 
                        uniqueId: 'vlastimil-test-1', 
                        name: 'Vlastimil Nistor', 
                        position: 'Brankář' 
                      },
                      { 
                        id: 'pavelnovakobyc', 
                        uniqueId: 'pavel-test-1', 
                        name: 'Pavel Novák', 
                        position: 'Obránce' 
                      },
                      { 
                        id: 'test4', 
                        uniqueId: 'test-4', 
                        name: 'Test Hráč 4', 
                        position: 'Útočník' 
                      },
                      { 
                        id: 'test5', 
                        uniqueId: 'test-5', 
                        name: 'Test Hráč 5', 
                        position: 'Obránce' 
                      },
                      { 
                        id: 'test6', 
                        uniqueId: 'test-6', 
                        name: 'Test Hráč 6', 
                        position: 'Útočník' 
                      },
                      { 
                        id: 'test7', 
                        uniqueId: 'test-7', 
                        name: 'Test Hráč 7', 
                        position: 'Obránce' 
                      },
                      { 
                        id: 'test8', 
                        uniqueId: 'test-8', 
                        name: 'Test Hráč 8', 
                        position: 'Útočník' 
                      },
                      { 
                        id: 'test9', 
                        uniqueId: 'test-9', 
                        name: 'Test Hráč 9', 
                        position: 'Obránce' 
                      },
                      { 
                        id: 'test10', 
                        uniqueId: 'test-10', 
                        name: 'Test Hráč 10', 
                        position: 'Útočník' 
                      },
                      { 
                        id: 'test11', 
                        uniqueId: 'test-11', 
                        name: 'Test Hráč 11', 
                        position: 'Obránce' 
                      },
                      { 
                        id: 'test12', 
                        uniqueId: 'test-12', 
                        name: 'Test Hráč 12', 
                        position: 'Útočník' 
                      }
                    ];
                    console.log('Test: volám handleTeamSelected s 12 hráči:', testPlayers);
                    handleTeamSelected(testPlayers);
                    handleTeamReadyForMatch(); // NOVÉ - trigger pro přátelský zápas
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  🧪 Test: Simulovat výběr týmu (12 hráčů) + přátelský zápas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobil s WhatsApp skupinou - zobrazí se až po výběru týmu */}
      {selectedTeamPlayers.length > 0 && (
        <Mobil 
          teamPlayers={selectedTeamPlayers}
          myCollection={myCollection}
          currentDate={currentGameDay}
          shouldShowMatchInvite={shouldShowMatchInvite} // NOVÉ - trigger pro přátelský zápas
          onMatchScheduled={handleMatchScheduled} // NOVÉ - callback pro domluvení zápasu
        />
      )}
      
      {/* CSS animace */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        /* Responsivní úpravy pro mobil */
        @media (max-width: 1400px) {
          .fixed.right-8 {
            right: -320px;
            transition: right 0.3s ease;
          }
          .fixed.right-8:hover {
            right: 8px;
          }
        }
      `}</style>
    </div>
  );
}