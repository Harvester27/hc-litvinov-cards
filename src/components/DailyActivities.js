"use client";

import React, { useState } from "react";
import {
  X, ChevronRight, CheckCircle2, Coffee
} from 'lucide-react';

// Import jednotlivých aktivit
import DayOffActivity from './activities/DayOffActivity';
import FriendlyMatchActivity from './activities/FriendlyMatchActivity';

/**
 * Modal komponenta pro výběr denních aktivit
 * UPRAVENO: Přidána podpora pro přátelské zápasy
 */
export default function DailyActivities({ 
  isOpen, 
  onClose, 
  currentDate,
  completedActivities = [],
  onActivityComplete,
  myCollection = [],
  credits = 0,
  onTeamSelected = () => {},
  onTeamReadyForMatch = () => {} // NOVÉ - callback pro přátelský zápas
}) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  if (!isOpen) return null;
  
  // Získat den v týdnu (0 = neděle, 6 = sobota)
  const dayOfWeek = currentDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Neděle nebo sobota

  // Definice dostupných aktivit (podle dne v týdnu)
  const activities = [
    {
      id: 'dayoff',
      name: 'Volno',
      description: 'Den volna pro regeneraci týmu',
      icon: '☕',
      iconComponent: Coffee,
      color: 'from-gray-600 to-gray-700',
      benefits: 'Posun na další den',
      component: DayOffActivity
    },
    // Přáteláček je dostupný pouze o víkendu
    ...(isWeekend ? [{
      id: 'friendlymatch',
      name: 'Zahrát přáteláček',
      description: 'Přátelský zápas (dostupné jen o víkendu)',
      icon: '🏒',
      iconComponent: null,
      color: 'from-blue-600 to-purple-600',
      benefits: 'Zápas s možností výhry',
      component: FriendlyMatchActivity
    }] : [])
  ];
  
  // Handler pro výběr aktivity
  const handleActivityClick = (activity) => {
    if (completedActivities.includes(activity.id)) {
      return; // Už je dokončená
    }
    console.log('Vybrána aktivita:', activity.id);
    setSelectedActivity(activity);
  };
  
  // Handler pro dokončení aktivity
  const handleActivityFinish = () => {
    if (selectedActivity) {
      onActivityComplete(selectedActivity.id);
      setSelectedActivity(null);
      
      // Pokud byla dokončena aktivita výběru týmu, zavolat callback
      if (selectedActivity.id === 'teamselection') {
        // Data už byla předána přes onTeamSelected v TeamSelectionActivity
        console.log('Aktivita výběru týmu dokončena');
      }
    }
  };
  
  // Pokud je vybraná aktivita, zobraz ji
  if (selectedActivity) {
    const ActivityComponent = selectedActivity.component;
    
    // Speciální props pro TeamSelectionActivity
    if (selectedActivity.id === 'teamselection') {
      console.log('Renderuji TeamSelectionActivity s onTeamSelected callback');
      return (
        <ActivityComponent
          onComplete={handleActivityFinish}
          onBack={() => setSelectedActivity(null)}
          myCollection={myCollection}
          credits={credits}
          onTeamSelected={(players) => {
            console.log('DailyActivities - onTeamSelected voláno s:', players);
            onTeamSelected(players);
          }}
          onTeamReadyForMatch={onTeamReadyForMatch} // NOVÉ - předat callback pro přátelský zápas
        />
      );
    }
    
    return (
      <ActivityComponent
        onComplete={handleActivityFinish}
        onBack={() => setSelectedActivity(null)}
        myCollection={myCollection}
        credits={credits}
      />
    );
  }
  
  // Jinak zobraz seznam aktivit
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">
                Denní aktivity
              </h2>
              <p className="text-gray-400">
                {currentDate.toLocaleDateString('cs-CZ', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-yellow-400">
                  Dokončeno: {completedActivities.length}/1
                </span>
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      completedActivities.length > 0
                        ? 'bg-green-400'
                        : 'bg-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>
        
        {/* Seznam aktivit */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => {
              const isCompleted = completedActivities.includes(activity.id);
              const IconComponent = activity.iconComponent;
              
              return (
                <div
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className={`
                    relative rounded-xl p-6 border transition-all duration-300 cursor-pointer
                    ${isCompleted 
                      ? 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed' 
                      : `bg-gradient-to-br ${activity.color} hover:scale-105 hover:shadow-xl border-white/20`
                    }
                  `}
                >
                  {/* Fajfka pro dokončené */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="text-green-400" size={24} />
                    </div>
                  )}
                  
                  {/* Ikona */}
                  <div className="text-4xl mb-3">
                    {activity.icon}
                  </div>
                  
                  {/* Název */}
                  <h3 className={`text-xl font-bold mb-2 ${
                    isCompleted ? 'text-gray-400' : 'text-white'
                  }`}>
                    {activity.name}
                  </h3>
                  
                  {/* Popis */}
                  <p className={`text-sm mb-3 ${
                    isCompleted ? 'text-gray-500' : 'text-white/80'
                  }`}>
                    {activity.description}
                  </p>
                  
                  {/* Benefity */}
                  <div className={`
                    text-xs font-bold px-3 py-1 rounded-full inline-block
                    ${isCompleted ? 'bg-gray-700 text-gray-500' : 'bg-black/30 text-yellow-300'}
                  `}>
                    {isCompleted ? 'DOKONČENO' : activity.benefits}
                  </div>
                  
                  {/* Šipka pro nedokončené */}
                  {!isCompleted && (
                    <div className="absolute bottom-3 right-3">
                      <ChevronRight className="text-white/50" size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Info pokud je aktivita dokončená */}
          {completedActivities.length >= 1 && (
            <div className="mt-6 p-4 bg-green-600/20 border border-green-500/30 rounded-xl text-center">
              <CheckCircle2 className="text-green-400 mx-auto mb-2" size={32} />
              <p className="text-green-400 font-bold">
                Výborně! Dnešní aktivita je dokončená.
              </p>
              <p className="text-green-300 text-sm mt-1">
                Můžeš přejít na další den v kalendáři.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}