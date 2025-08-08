'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Award, Flag, Shield, Target, Trophy, Zap, Users, Sparkles, Star } from 'lucide-react';

export default function CareerMode({ user, playerStats, onBack, onUpdateStats }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('HC Litvínov');
  const [logItems, setLogItems] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const displayName = useMemo(() => (user?.displayName || user?.email?.split('@')[0] || 'Hráč'), [user]);

  const addLog = (type, message) => {
    setLogItems((prev) => [{ id: Date.now() + Math.random(), type, message }, ...prev].slice(0, 20));
  };

  const safeUpdateStats = (mutator) => {
    if (!onUpdateStats || !playerStats) return;
    const updated = mutator(playerStats);
    onUpdateStats(updated);
  };

  const handleTraining = () => {
    const xpGain = Math.floor(50 + Math.random() * 120);
    const coinGain = Math.floor(20 + Math.random() * 80);
    addLog('train', `Intenzivní trénink +${xpGain} XP, +${coinGain} coinů`);
    safeUpdateStats((stats) => ({
      ...stats,
      experience: (stats.experience || 0) + xpGain,
      coinsBalance: (stats.coinsBalance || 0) + coinGain,
    }));
  };

  const simulateMatch = async () => {
    if (!selectedRole) {
      addLog('warn', 'Vyber si nejdřív roli kariéry.');
      return;
    }
    setIsSimulating(true);
    setLogItems([]);

    const randEvent = () => {
      const pool = [
        'Šance po rychlém kontru!',
        'Tvrdý zákrok u mantinelu.',
        'Výborný zákrok brankáře!',
        'Tlak v útočném pásmu.',
        'Střela těsně mimo.',
        'Přesilová hra 5 na 4.',
        'GÓL! Stadion bouří!',
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let period = 1; period <= 3; period += 1) {
      addLog('info', `${period}. třetina startuje`);
      for (let i = 0; i < 4; i += 1) {
        const e = randEvent();
        addLog(e.includes('GÓL') ? 'goal' : 'info', e);
        await wait(120);
      }
    }

    const didWin = Math.random() < 0.55;
    const xpGain = didWin ? 180 : 90;
    const coinGain = didWin ? 200 : 90;
    addLog('result', didWin ? 'Výhra! Skvělý výkon týmu!' : 'Těsná prohra, příště to vyjde.');
    addLog('reward', `Odměna: +${xpGain} XP, +${coinGain} coinů`);
    safeUpdateStats((stats) => ({
      ...stats,
      experience: (stats.experience || 0) + xpGain,
      coinsBalance: (stats.coinsBalance || 0) + coinGain,
    }));
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="bg-blue-600/20 hover:bg-blue-600/30 p-2 rounded-full transition-all">
              <ArrowLeft className="text-blue-300" size={22} />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Flag className="text-amber-400" size={22} />Kariéra</h1>
              <p className="text-blue-300 text-sm">{displayName} • {selectedTeam}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 px-3 py-1 rounded-full flex items-center gap-1"><span className="text-yellow-400 text-sm">💰</span><span className="font-semibold">{playerStats?.coinsBalance ?? 0}</span></div>
            <div className="bg-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1"><Sparkles className="text-purple-300" size={16} /><span className="font-semibold">{playerStats?.experience ?? 0} XP</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-blue-400" />Vyber roli</h2>
            <div className="grid grid-cols-3 gap-3">
              {[{ id: 'hrac', label: 'Hráč', icon: <Target size={18} /> }, { id: 'trener', label: 'Trenér', icon: <Shield size={18} /> }, { id: 'manager', label: 'Manažer', icon: <Trophy size={18} /> }].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`rounded-2xl p-4 border transition-all ${selectedRole === r.id ? 'border-amber-400 bg-amber-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="text-center">
                    <div className="mx-auto mb-2 text-amber-300 flex items-center justify-center">{r.icon}</div>
                    <div className="font-semibold">{r.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Flag className="text-amber-400" />Tým</h2>
            <div className="grid grid-cols-2 gap-3">
              {['HC Litvínov', 'Lancers'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTeam(t)}
                  className={`rounded-2xl p-4 border transition-all ${selectedTeam === t ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="text-center font-semibold">{t}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-blue-200">Výběr týmu ovlivní barvy a atmosféru kariéry.</div>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-3xl p-6 border border-amber-500/30">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Award className="text-amber-300" />Sezónní cíle</h2>
            <ul className="space-y-2 text-amber-100">
              <li className="flex items-center gap-2"><Star size={14} className="text-amber-300" /> Vyhraj 3 zápasy</li>
              <li className="flex items-center gap-2"><Star size={14} className="text-amber-300" /> Získej 500 XP</li>
              <li className="flex items-center gap-2"><Star size={14} className="text-amber-300" /> Utrať 100 coinů v tréninku</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={handleTraining} className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/10 via-transparent to-emerald-300/10 animate-shimmer" />
            <div className="relative text-center">
              <Zap className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Trénink</h3>
              <p className="text-emerald-200 text-sm">Zvyš své XP a vydělej pár coinů</p>
            </div>
          </button>

          <button onClick={simulateMatch} disabled={isSimulating} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group disabled:opacity-60 disabled:cursor-not-allowed">
            <div className="relative text-center">
              <Trophy className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-xl font-bold mb-2">Zahájit zápas</h3>
              <p className="text-blue-200 text-sm">Rychlá simulace s odměnami</p>
            </div>
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="text-blue-300" />Události kariéry</h2>
          {logItems.length === 0 ? (
            <div className="text-gray-300">Začni trénovat nebo spusť zápas a sleduj průběh zde.</div>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto pr-1">
              {logItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm">
                  <span>
                    {item.type === 'goal' && '🥅'}
                    {item.type === 'train' && '💪'}
                    {item.type === 'result' && '🏆'}
                    {item.type === 'reward' && '🎁'}
                    {item.type === 'warn' && '⚠️'}
                    {item.type === 'info' && '📣'}
                  </span>
                  <span className="text-gray-100">{item.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 3s infinite; }
      `}</style>
    </div>
  );
}
