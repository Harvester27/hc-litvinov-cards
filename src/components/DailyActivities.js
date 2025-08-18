"use client";

import React, { useState } from "react";
import { 
  X, Waves, Trophy, BriefcaseBusiness, Hotel, Users,
  ChevronRight, CheckCircle2
} from 'lucide-react';

// Import jednotlivých aktivit
import SwimmingActivity from './activities/SwimmingActivity';
import RunningActivity from './activities/RunningActivity';
import JobPostingActivity from './activities/JobPostingActivity';
import ExtraSleepActivity from './activities/ExtraSleepActivity';
import TeamSelectionActivity from './activities/TeamSelectionActivity';

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
  
  // Definice všech dostupných aktivit
  const activities = [
    {
      id: 'swimming',
      name: 'Jít plavat',
      description: 'Zlepší kondici a regeneraci týmu',
      icon: '🏊‍♂️',
      iconComponent: Waves,
      color: 'from-blue-500 to-cyan-600',
      benefits: '+2 kondice, +1 regenerace',
      component: SwimmingActivity
    },
    {
      id: 'running',
      name: 'Jít běhat',
      description: 'Zvýší rychlost a vytrvalost hráčů',
      icon: '🏃‍♂️',
      iconComponent: null,
      color: 'from-green-500 to-emerald-600',
      benefits: '+2 rychlost, +1 vytrvalost',
      component: RunningActivity
    },
    {
      id: 'jobposting',
      name: 'Napsat inzerát',
      description: 'Hledání nových talentů na internetu',
      icon: '💼',
      iconComponent: BriefcaseBusiness,
      color: 'from-purple-500 to-indigo-600',
      benefits: 'Možnost získat nové hráče',
      component: JobPostingActivity
    },
    {
      id: 'extrasleep',
      name: 'Extra spánek',
      description: 'Důležitý odpočinek pro regeneraci',
      icon: '😴',
      iconComponent: Hotel,
      color: 'from-gray-600 to-gray-700',
      benefits: '+3 regenerace, +1 morálka',
      component: ExtraSleepActivity
    },
    {
      id: 'teamselection',
      name: 'Vybrat tým',
      description: 'Sestavit základní sestavu z karet',
      icon: '⚽',
      iconComponent: Users,
      color: 'from-red-500 to-orange-600',
      benefits: 'Optimalizace sestavy',
      component: TeamSelectionActivity
    }
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
                  Dokončeno: {completedActivities.length}/5
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < completedActivities.length 
                          ? 'bg-green-400' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
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
          
          {/* Info pokud jsou všechny dokončené */}
          {completedActivities.length >= 5 && (
            <div className="mt-6 p-4 bg-green-600/20 border border-green-500/30 rounded-xl text-center">
              <Trophy className="text-green-400 mx-auto mb-2" size={32} />
              <p className="text-green-400 font-bold">
                Výborně! Všechny denní aktivity jsou dokončené.
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