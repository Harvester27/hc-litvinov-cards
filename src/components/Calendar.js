"use client";

import React, { useState, useEffect } from "react";
import DailyActivities from "./DailyActivities";
import { Trophy, MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react';

/**
 * Kalendář komponenta pro Lancers s denními aktivitami
 * NOVÉ: Podpora přátelských zápasů
 * OPRAVENO: Předání onTeamReadyForMatch callback
 */
export default function Calendar({ 
  initialDate = new Date(2024, 5, 1), 
  onDayChange,
  myCollection = [],
  credits = 0,
  onTeamSelected = () => {},
  friendlyMatches = [], // NOVÉ - seznam přátelských zápasů
  onTeamReadyForMatch = () => {} // NOVÉ - callback pro připravenost na zápas
}) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [gameDay, setGameDay] = useState(initialDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [showDailyActivities, setShowDailyActivities] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(null); // NOVÉ - pro zobrazení detailů zápasu
  
  // State pro sledování dokončených aktivit každého dne
  const [dailyProgress, setDailyProgress] = useState({});
  
  // Získat progress pro konkrétní den
  const getDayProgress = (date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return dailyProgress[dateKey] || { completed: 0, activities: [] };
  };
  
  // Zkontrolovat, jestli může jít na další den
  const canAdvanceToNextDay = () => {
    const progress = getDayProgress(gameDay);
    return progress.completed >= 5;
  };
  
  // Handler pro dokončení aktivity
  const handleActivityComplete = (activityType) => {
    const dateKey = `${gameDay.getFullYear()}-${gameDay.getMonth()}-${gameDay.getDate()}`;
    const currentProgress = getDayProgress(gameDay);
    
    // Přidat aktivitu pokud ještě není dokončená
    if (!currentProgress.activities.includes(activityType) && currentProgress.completed < 5) {
      setDailyProgress(prev => ({
        ...prev,
        [dateKey]: {
          completed: currentProgress.completed + 1,
          activities: [...currentProgress.activities, activityType]
        }
      }));
      
      console.log(`Aktivita dokončena: ${activityType}`);
    }
    
    setShowDailyActivities(false);
  };
  
  // Funkce pro získání názvů dnů v týdnu
  const getDaysOfWeek = () => {
    return ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  };
  
  // Funkce pro získání dnů v měsíci
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  // Získat název měsíce
  const getMonthName = (date) => {
    const months = [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
    ];
    return months[date.getMonth()];
  };
  
  // NOVÉ - Získat zápas pro konkrétní den
  const getMatchForDay = (day) => {
    if (!day || !friendlyMatches || friendlyMatches.length === 0) return null;
    
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = checkDate.toLocaleDateString('cs-CZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric'
    });
    
    return friendlyMatches.find(match => {
      // Porovnat datum ve stejném formátu
      return match.date === dateStr || 
             (match.dateObject && 
              match.dateObject.getDate() === checkDate.getDate() &&
              match.dateObject.getMonth() === checkDate.getMonth() &&
              match.dateObject.getFullYear() === checkDate.getFullYear());
    });
  };
  
  // NOVÉ - Handler pro kliknutí na zápas
  const handleMatchClick = (match) => {
    setShowMatchDetails(match);
  };
  
  // Navigace měsíců
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  
  // Přejít na další den
  const goToNextDay = () => {
    if (!canAdvanceToNextDay()) {
      alert('Musíš dokončit všech 5 denních aktivit!');
      return;
    }
    
    const nextDay = new Date(gameDay);
    nextDay.setDate(nextDay.getDate() + 1);
    setGameDay(nextDay);
    
    if (nextDay.getMonth() !== currentDate.getMonth() || nextDay.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(nextDay);
    }
    
    if (onDayChange) {
      onDayChange(nextDay);
    }
  };
  
  // Handler pro kliknutí na den v kalendáři
  const handleDayClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const match = getMatchForDay(day);
    
    // Pokud je na tento den zápas, zobrazit jeho detaily
    if (match) {
      handleMatchClick(match);
      return;
    }
    
    // Pokud klikám na aktuální herní den, otevřu aktivity
    if (clickedDate.getDate() === gameDay.getDate() && 
        clickedDate.getMonth() === gameDay.getMonth() && 
        clickedDate.getFullYear() === gameDay.getFullYear()) {
      setShowDailyActivities(true);
    }
  };
  
  // Kontrola jestli je den "herní den"
  const isGameDay = (day) => {
    return day === gameDay.getDate() && 
           currentDate.getMonth() === gameDay.getMonth() && 
           currentDate.getFullYear() === gameDay.getFullYear();
  };
  
  // Kontrola jestli je den v minulosti
  const isPastDay = (day) => {
    if (!day) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const gameDayMidnight = new Date(gameDay.getFullYear(), gameDay.getMonth(), gameDay.getDate());
    return checkDate < gameDayMidnight;
  };
  
  // Kontrola jestli je den v budoucnosti
  const isFutureDay = (day) => {
    if (!day) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const gameDayMidnight = new Date(gameDay.getFullYear(), gameDay.getMonth(), gameDay.getDate());
    return checkDate > gameDayMidnight;
  };
  
  // Komponenta pro zobrazení progress koleček
  const DayProgress = ({ day }) => {
    if (!day) return null;
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const progress = getDayProgress(dayDate);
    
    // Zobrazit kolečka pouze pro herní den
    if (isGameDay(day)) {
      return (
        <div className="flex justify-center gap-0.5 mt-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < progress.completed 
                  ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                  : 'bg-gray-600 border border-gray-500'
              }`}
            />
          ))}
        </div>
      );
    }
    
    // Pro minulé dny zobrazit fajfku pokud byly dokončeny
    if (isPastDay(day)) {
      const dayProgress = getDayProgress(dayDate);
      if (dayProgress.completed >= 5) {
        return (
          <div className="absolute bottom-1 right-1">
            <span className="text-green-400 text-xs">✔</span>
          </div>
        );
      }
    }
    
    return null;
  };
  
  return (
    <>
      {/* Modal s denními aktivitami */}
      {showDailyActivities && (
        <DailyActivities
          isOpen={showDailyActivities}
          onClose={() => setShowDailyActivities(false)}
          currentDate={gameDay}
          completedActivities={getDayProgress(gameDay).activities}
          onActivityComplete={handleActivityComplete}
          myCollection={myCollection}
          credits={credits}
          onTeamSelected={(players) => {
            console.log('Calendar - onTeamSelected voláno s:', players);
            onTeamSelected(players);
          }}
          onTeamReadyForMatch={onTeamReadyForMatch} // OPRAVENO - předání callback
        />
      )}
      
      {/* NOVÉ - Modal s detaily zápasu */}
      {showMatchDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-gradient-to-br from-red-900 to-orange-800 rounded-xl p-6 max-w-md w-full text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Přátelský zápas
              </h3>
              <button
                onClick={() => setShowMatchDetails(null)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Soupeř:</span>
                  <span className="font-bold text-lg">{showMatchDetails.opponent}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 flex items-center gap-1">
                    <CalendarIcon size={14} />
                    Datum:
                  </span>
                  <span>{showMatchDetails.date}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 flex items-center gap-1">
                    <Clock size={14} />
                    Čas:
                  </span>
                  <span>{showMatchDetails.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-1">
                    <MapPin size={14} />
                    Místo:
                  </span>
                  <span className="text-sm">{showMatchDetails.venue}</span>
                </div>
              </div>
              
              <div className="bg-green-600/30 rounded-lg p-3 text-center">
                <p className="text-green-300 text-sm">
                  Domluveno s: {showMatchDetails.invitedBy}
                </p>
              </div>
              
              {showMatchDetails.status === 'scheduled' && (
                <button
                  onClick={() => {
                    // TODO: Implementovat hraní zápasu
                    alert('Hraní zápasu bude brzy dostupné!');
                  }}
                  disabled={!isGameDay(new Date(showMatchDetails.date).getDate())}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isGameDay(new Date(showMatchDetails.date).getDate())
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGameDay(new Date(showMatchDetails.date).getDate())
                    ? '🏒 Hrát zápas'
                    : 'Zápas je naplánován na jiný den'
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Horní panel s kalendářem */}
      <div className={`bg-gradient-to-r from-black/40 via-blue-900/40 to-black/40 backdrop-blur-md border-b border-white/10 p-4 transition-all duration-500 ${isCalendarOpen ? '' : 'pb-2'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Hlavička kalendáře */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {getMonthName(currentDate)} {currentDate.getFullYear()}
                </h2>
                <div className="text-sm text-blue-300 mt-1">
                  Herní den: {gameDay.getDate()}. {getMonthName(gameDay).toLowerCase()} {gameDay.getFullYear()}
                </div>
                {/* Zobrazení denního progressu */}
                <div className="text-xs text-yellow-400 mt-1">
                  Denní aktivity: {getDayProgress(gameDay).completed}/5 dokončeno
                </div>
                {/* NOVÉ - Zobrazení počtu přátelských zápasů */}
                {friendlyMatches && friendlyMatches.length > 0 && (
                  <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <Trophy size={12} />
                    Přátelské zápasy: {friendlyMatches.length}
                  </div>
                )}
              </div>
              <div className="px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-400/30">
                <div className="text-xs text-blue-300">Sezóna</div>
                <div className="font-bold">2024/2025</div>
              </div>
            </div>
            
            {/* Navigační tlačítka */}
            <div className="flex gap-2 items-center">
              {/* Tlačítko pro další den - aktivní pouze když je 5/5 */}
              <button 
                onClick={goToNextDay}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 font-bold text-white group ${
                  canAdvanceToNextDay()
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg'
                    : 'bg-gray-600 cursor-not-allowed opacity-50'
                }`}
                title={canAdvanceToNextDay() ? "Přejít na další den" : "Nejdřív dokonči všech 5 aktivit!"}
                disabled={!canAdvanceToNextDay()}
              >
                <span className="text-sm">Další den</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">➤</span>
              </button>
              
              <div className="w-px h-10 bg-white/20 mx-2" />
              
              <button 
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg transition-all hover:scale-105 font-bold"
                title="Předchozí měsíc"
              >
                ◀
              </button>
              <button 
                onClick={toggleCalendar}
                className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-all hover:scale-105 text-sm flex items-center gap-2"
                title={isCalendarOpen ? "Zabalit kalendář" : "Rozbalit kalendář"}
              >
                <span>{isCalendarOpen ? '📅' : '📆'}</span>
                <span>Kalendář</span>
                <span className="text-xs">{isCalendarOpen ? '▲' : '▼'}</span>
              </button>
              <button 
                onClick={goToNextMonth}
                className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg transition-all hover:scale-105 font-bold"
                title="Následující měsíc"
              >
                ▶
              </button>
            </div>
          </div>
          
          {/* Kalendář - s animací */}
          <div className={`transition-all duration-500 overflow-hidden ${isCalendarOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gradient-to-br from-black/30 to-blue-900/30 rounded-xl p-4 backdrop-blur-sm border border-white/5">
              {/* Dny v týdnu */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {getDaysOfWeek().map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center text-sm font-semibold text-blue-300 p-3 bg-blue-900/30 rounded-lg"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Dny v měsíci */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const match = getMatchForDay(day);
                  const hasMatch = !!match;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`
                        h-16 flex flex-col items-center justify-center rounded-lg transition-all duration-200 relative
                        ${day === null ? '' : 'border border-white/5'}
                        ${isPastDay(day) && !hasMatch ? 'bg-gray-900/60 opacity-50' : ''}
                        ${isGameDay(day) && !hasMatch ? 'bg-gradient-to-br from-green-600 to-green-700 font-bold ring-2 ring-green-400 shadow-lg shadow-green-500/30 cursor-pointer hover:scale-110 hover:z-10' : ''}
                        ${isFutureDay(day) && !hasMatch ? 'bg-gray-800/60 opacity-40 cursor-not-allowed' : ''}
                        ${hasMatch ? 'bg-gradient-to-br from-red-600 to-orange-600 ring-2 ring-yellow-400 shadow-lg shadow-red-500/30 cursor-pointer hover:scale-110 hover:z-20 animate-pulse' : ''}
                      `}
                    >
                      {day && (
                        <>
                          {/* NOVÉ - Speciální zobrazení pro zápas */}
                          {hasMatch ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                              <Trophy className="text-yellow-400 mb-1" size={20} />
                              <span className="text-[10px] text-white font-bold text-center">
                                vs {match.opponent.split(' ')[0]}
                              </span>
                              <span className="text-[9px] text-yellow-300">
                                {match.time}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className={`text-base font-medium ${isPastDay(day) || isFutureDay(day) ? 'text-gray-500' : ''}`}>
                                {day}
                              </span>
                              
                              {/* Progress kolečka pro herní den */}
                              <DayProgress day={day} />
                              
                              {/* Indikátor herního dne */}
                              {isGameDay(day) && (
                                <div className="absolute top-1 right-1">
                                  <span className="text-xs">🎮</span>
                                </div>
                              )}
                              
                              {/* Indikátor budoucích dnů (uzamčené) */}
                              {isFutureDay(day) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-gray-600 text-xl">🔒</span>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}