"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trophy, Award, Clock, Target, Shield } from 'lucide-react';
import { getCardById, calculateOverall } from '@/data/lancersDynasty/obycejneKartyLancers';

/**
 * Zápasová simulace
 * - 3 třetiny po 15 minutách (900 sekund)
 * - Simulace podle atributů hráčů
 * - Přesilovky (2 minuty)
 * - Statistiky (střely, góly, asistence, čas na ledě)
 */
export default function MatchSimulation({ opponent, myPlayers, onMatchEnd }) {
  const [period, setPeriod] = useState(1); // Třetina (1-3)
  const [time, setTime] = useState(900); // Čas ve vteřinách (15 min = 900s)
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [shots, setShots] = useState({ home: 0, away: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    home: { goals: [], assists: [], penalties: [] },
    away: { goals: [], assists: [], penalties: [] }
  });
  const [powerPlay, setPowerPlay] = useState(null); // null | 'home' | 'away'
  const [powerPlayTime, setPowerPlayTime] = useState(0);

  const intervalRef = useRef(null);

  // Spustit zápas automaticky
  useEffect(() => {
    startGame();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Hlavní herní loop
  const startGame = () => {
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          // Konec třetiny
          clearInterval(intervalRef.current);
          handlePeriodEnd();
          return 0;
        }

        // Simulovat události každou sekundu (zrychlené 10x)
        if (prevTime % 3 === 0) {
          simulateGameEvent(prevTime);
        }

        // Snížit čas přesilovky
        if (powerPlayTime > 0) {
          setPowerPlayTime(prev => prev - 1);
          if (powerPlayTime === 1) {
            setPowerPlay(null);
          }
        }

        return prevTime - 1;
      });
    }, 100); // Aktualizace každých 100ms (10x rychleji než realtime)
  };

  // Konec třetiny
  const handlePeriodEnd = () => {
    addEvent(`Konec ${period}. třetiny`);

    if (period < 3) {
      // Další třetina
      setTimeout(() => {
        setPeriod(prev => prev + 1);
        setTime(900);
        startGame();
      }, 2000);
    } else {
      // Konec zápasu
      setGameOver(true);
      setIsPlaying(false);

      // Po 3 vteřinách zavolat callback
      setTimeout(() => {
        onMatchEnd({
          won: score.home > score.away,
          score: score,
          shots: shots,
          events: events
        });
      }, 3000);
    }
  };

  // Simulovat herní události
  const simulateGameEvent = (currentTime) => {
    const homeAttack = Math.random() < calculateAttackProbability('home');
    const awayAttack = Math.random() < calculateAttackProbability('away');

    // Náhodný faul (3% šance každou sekundu)
    if (Math.random() < 0.03 && !powerPlay) {
      handlePenalty(Math.random() < 0.5 ? 'home' : 'away');
      return;
    }

    // Domácí útok
    if (homeAttack) {
      handleShot('home', currentTime);
    }

    // Hostující útok
    if (awayAttack) {
      handleShot('away', currentTime);
    }
  };

  // Vypočítat pravděpodobnost útoku podle overallu týmu
  const calculateAttackProbability = (team) => {
    if (team === 'home') {
      const teamOverall = myPlayers.teamOverall || 70;
      const baseProbability = 0.05; // 5% základní šance
      const modifier = (teamOverall - 70) / 100; // +/- podle overallu
      const powerPlayModifier = powerPlay === 'home' ? 0.02 : (powerPlay === 'away' ? -0.02 : 0);
      return baseProbability + modifier + powerPlayModifier;
    } else {
      const teamOverall = opponent.teamOverall || 70;
      const baseProbability = 0.05;
      const modifier = (teamOverall - 70) / 100;
      const powerPlayModifier = powerPlay === 'away' ? 0.02 : (powerPlay === 'home' ? -0.02 : 0);
      return baseProbability + modifier + powerPlayModifier;
    }
  };

  // Zpracovat střelu
  const handleShot = (team, currentTime) => {
    // Přidat střelu
    setShots(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));

    // Šance na gól (15% základní, +5% v přesilovce)
    const powerPlayBonus = powerPlay === team ? 0.05 : 0;
    const goalChance = 0.15 + powerPlayBonus;

    if (Math.random() < goalChance) {
      handleGoal(team, currentTime);
    }
  };

  // Zpracovat gól
  const handleGoal = (team, currentTime) => {
    const timeFormatted = formatTime(currentTime);
    const periodText = `${period}.`;

    setScore(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));

    if (team === 'home') {
      // Náhodný střelec z našich útočníků
      const scorer = myPlayers.forwards[Math.floor(Math.random() * myPlayers.forwards.length)];
      const scorerInfo = getCardById(scorer.id);

      addEvent(`⚽ GÓL! ${scorerInfo?.name || 'Hráč'} (${timeFormatted}, ${periodText}třetina)`);

      setStats(prev => ({
        ...prev,
        home: {
          ...prev.home,
          goals: [...prev.home.goals, { player: scorerInfo?.name, time: timeFormatted }]
        }
      }));
    } else {
      addEvent(`⚽ GÓL soupeře (${timeFormatted}, ${periodText}třetina)`);

      setStats(prev => ({
        ...prev,
        away: {
          ...prev.away,
          goals: [...prev.away.goals, { time: timeFormatted }]
        }
      }));
    }

    // Pokud to byl gól v přesilovce, zrušit ji
    if (powerPlay) {
      setPowerPlay(null);
      setPowerPlayTime(0);
    }
  };

  // Zpracovat faul
  const handlePenalty = (team) => {
    const timeFormatted = formatTime(time);

    setPowerPlay(team === 'home' ? 'away' : 'home'); // Přesilovka pro druhý tým
    setPowerPlayTime(120); // 2 minuty = 120 sekund

    addEvent(`🟨 Faul týmu ${team === 'home' ? 'HC Lancers' : opponent.name} (${timeFormatted})`);
  };

  // Přidat událost do feedu
  const addEvent = (text) => {
    setEvents(prev => [{ text, time: Date.now() }, ...prev].slice(0, 10));
  };

  // Formátovat čas (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-400/30">

        {/* Header - Skóre */}
        <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Domácí (HC Lancers) */}
            <div className="text-center">
              <h3 className="text-white font-bold text-xl mb-2">HC Lancers</h3>
              <div className="text-6xl font-black text-blue-400">
                {score.home}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Střely: {shots.home}
              </div>
            </div>

            {/* Čas a třetina */}
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg mb-2">
                {period}. TŘETINA
              </div>
              <div className="text-white text-4xl font-mono font-bold mb-2">
                {formatTime(time)}
              </div>
              {powerPlay && (
                <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                  powerPlay === 'home' ? 'bg-blue-500' : 'bg-red-500'
                }`}>
                  <span className="text-white">
                    PŘESILOVKA {powerPlay === 'home' ? 'LANCERS' : opponent.name.toUpperCase()}
                  </span>
                  <div className="text-white/80 text-sm">
                    {formatTime(powerPlayTime)}
                  </div>
                </div>
              )}
              {gameOver && (
                <div className="text-green-400 font-bold text-2xl animate-pulse">
                  KONEC ZÁPASU
                </div>
              )}
            </div>

            {/* Hosté */}
            <div className="text-center">
              <div className="text-4xl mb-2">{opponent.logo}</div>
              <h3 className="text-white font-bold text-xl mb-2">{opponent.name}</h3>
              <div className="text-6xl font-black text-red-400">
                {score.away}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Střely: {shots.away}
              </div>
            </div>
          </div>
        </div>

        {/* Události zápasu */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Live feed */}
          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Target size={20} className="text-yellow-400" />
              Průběh zápasu
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">Zatím žádné události...</p>
              ) : (
                events.map((event, idx) => (
                  <div key={event.time} className="text-white text-sm bg-white/5 rounded p-2">
                    {event.text}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Statistiky */}
          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Shield size={20} className="text-blue-400" />
              Statistiky
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Góly:</span>
                <span className="text-white font-bold">
                  {score.home} - {score.away}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Střely:</span>
                <span className="text-white font-bold">
                  {shots.home} - {shots.away}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Úspěšnost střelby:</span>
                <span className="text-white font-bold">
                  {shots.home > 0 ? Math.round((score.home / shots.home) * 100) : 0}% -
                  {shots.away > 0 ? Math.round((score.away / shots.away) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Přesilovky:</span>
                <span className="text-white font-bold">
                  {stats.home.penalties.length} - {stats.away.penalties.length}
                </span>
              </div>
            </div>

            {gameOver && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-center">
                  {score.home > score.away ? (
                    <>
                      <Trophy className="text-yellow-400 mx-auto mb-2" size={48} />
                      <p className="text-green-400 font-bold text-xl">VÝHRA!</p>
                      <p className="text-white mt-2">
                        HC Lancers {score.home} : {score.away} {opponent.name}
                      </p>
                    </>
                  ) : score.home < score.away ? (
                    <>
                      <div className="text-6xl mb-2">😔</div>
                      <p className="text-red-400 font-bold text-xl">PROHRA</p>
                      <p className="text-white mt-2">
                        HC Lancers {score.home} : {score.away} {opponent.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <Award className="text-gray-400 mx-auto mb-2" size={48} />
                      <p className="text-yellow-400 font-bold text-xl">REMÍZA</p>
                      <p className="text-white mt-2">
                        HC Lancers {score.home} : {score.away} {opponent.name}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vizualizace kluziště */}
        <div className="mt-6 bg-blue-900/20 border-2 border-blue-400/30 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {/* Čáry na ledě */}
            <div className="absolute top-0 left-1/3 w-0.5 h-full bg-blue-400"></div>
            <div className="absolute top-0 left-1/2 w-1 h-full bg-red-400"></div>
            <div className="absolute top-0 left-2/3 w-0.5 h-full bg-blue-400"></div>

            {/* Kruhy */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-blue-400 rounded-full"></div>
            <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-blue-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-red-400 rounded-full"></div>
          </div>

          <div className="relative text-center">
            <Clock className="text-blue-400 mx-auto mb-2" size={32} />
            <p className="text-white/60 text-sm">
              {isPlaying ? 'Zápas probíhá...' : 'Zápas skončil'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
