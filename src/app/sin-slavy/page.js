'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Award, Star, Trophy, Crown, ArrowLeft, Medal, Users } from 'lucide-react';
import Link from 'next/link';

export default function SinSlavyPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const hallOfFamers = [
    {
      id: 1,
      name: 'Viktor Hübl',
      number: 24,
      position: 'Útočník',
      years: '1998-2015',
      inducted: 2016,
      category: 'player',
      achievements: [
        '3x Mistr ligy',
        '5x Nejlepší střelec',
        '1250 odehraných zápasů',
        '458 gólů, 612 asistencí'
      ],
      description: 'Nejproduktivnější hráč v historii klubu a legenda českého hokeje.',
      image: '🏒'
    },
    {
      id: 2,
      name: 'František Lukeš',
      number: 10,
      position: 'Obránce',
      years: '1991-2008',
      inducted: 2010,
      category: 'player',
      achievements: [
        '2x Mistr ligy',
        'Kapitán týmu 10 let',
        '980 odehraných zápasů',
        'Reprezentant ČR'
      ],
      description: 'Dlouholetý kapitán a symbol klubu v jeho moderní éře.',
      image: '🛡️'
    },
    {
      id: 3,
      name: 'Vladimír Růžička',
      position: 'Trenér',
      years: '1995-2000, 2008-2012',
      inducted: 2013,
      category: 'coach',
      achievements: [
        '3x Mistr ligy jako trenér',
        'Trenér roku 1998, 2010',
        'Zavedení moderního stylu hry',
        'Vychoval desítky reprezentantů'
      ],
      description: 'Nejúspěšnější trenér v historii klubu.',
      image: '📋'
    },
    {
      id: 4,
      name: 'Jiří Šlégr',
      number: 3,
      position: 'Obránce',
      years: '1995-2010',
      inducted: 2012,
      category: 'player',
      achievements: [
        'Mistr světa 2005',
        '2x Mistr ligy',
        'Nejlepší obránce ligy 3x',
        '890 zápasů za klub'
      ],
      description: 'Defenzivní pilíř týmu a mistr světa.',
      image: '🥇'
    },
    {
      id: 5,
      name: 'Jan Srdínko',
      position: 'Funkcionář',
      years: '1985-2015',
      inducted: 2018,
      category: 'builder',
      achievements: [
        'Prezident klubu 20 let',
        'Vybudoval novou arénu',
        'Založil mládežnickou akademii',
        'Přivedl klub do moderní éry'
      ],
      description: 'Vizionář, který klub dovedl k největším úspěchům.',
      image: '🏛️'
    },
    {
      id: 6,
      name: 'David Výborný',
      number: 18,
      position: 'Útočník',
      years: '2001-2015',
      inducted: 2020,
      category: 'player',
      achievements: [
        '2x Mistr ligy',
        'MVP play-off 2010',
        'Reprezentant ČR',
        '789 zápasů, 678 bodů'
      ],
      description: 'Kreativní centrum a duše týmu po celou dekádu.',
      image: '⭐'
    }
  ];

  const categories = [
    { id: 'all', label: 'Všichni členové', icon: <Users size={18} /> },
    { id: 'player', label: 'Hráči', icon: <Medal size={18} /> },
    { id: 'coach', label: 'Trenéři', icon: <Trophy size={18} /> },
    { id: 'builder', label: 'Funkcionáři', icon: <Crown size={18} /> }
  ];

  const filteredMembers = selectedCategory === 'all'
    ? hallOfFamers
    : hallOfFamers.filter(m => m.category === selectedCategory);

  const getCategoryColor = (category) => {
    if (category === 'player') return 'from-blue-600 to-cyan-600';
    if (category === 'coach') return 'from-green-600 to-emerald-600';
    return 'from-purple-600 to-pink-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/10 to-slate-900">
      <Navigation />
      
      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na hlavní stránku</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <Award className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Síň slávy</h1>
              <p className="text-gray-300 mt-1">Legendy HC Litvínov Lancers</p>
            </div>
          </div>

          {/* Filtry */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hall of Famers */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {filteredMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur rounded-3xl p-8 border border-amber-600/30 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex items-start gap-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryColor(member.category)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{member.image}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {member.name}
                        {member.number && <span className="text-amber-400 ml-2">#{member.number}</span>}
                      </h3>
                      <p className="text-gray-400">{member.position}</p>
                      <p className="text-amber-400 text-sm mt-1">{member.years}</p>
                    </div>
                    <div className="bg-amber-600/20 px-3 py-1 rounded-full">
                      <span className="text-amber-400 font-bold text-sm">Uveden {member.inducted}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{member.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                      <Star size={16} />
                      Úspěchy
                    </h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {member.achievements.map((achievement, index) => (
                        <li key={index} className="bg-black/30 rounded-lg px-3 py-2 text-sm text-gray-300">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-16 bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="text-amber-500" />
            O Síni slávy
          </h2>
          <p className="text-gray-300 mb-4">
            Síň slávy HC Litvínov Lancers byla založena v roce 2010 k uctění památky největších osobností 
            v historii klubu. Do síně slávy jsou každoročně uváděni hráči, trenéři a funkcionáři, 
            kteří významně přispěli k úspěchům a rozvoji klubu.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{hallOfFamers.filter(m => m.category === 'player').length}</div>
              <div className="text-gray-400">Hráčů</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{hallOfFamers.filter(m => m.category === 'coach').length}</div>
              <div className="text-gray-400">Trenérů</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{hallOfFamers.filter(m => m.category === 'builder').length}</div>
              <div className="text-gray-400">Funkcionářů</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky</p>
          </div>
        </div>
      </footer>
    </div>
  );
}