'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MatchDetail from '@/components/MatchDetail';
import { matchData, getRecentMatches } from '@/data/matchData';
import { 
  Trophy, Users, Calendar, Flame, Shield, Star, 
  Clock, MapPin, ChevronRight, Award, TrendingUp,
  Target, Zap, Medal, Heart, BarChart3, ArrowRight,
  Instagram, PlayCircle, Newspaper, Swords
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [timeToNextGame, setTimeToNextGame] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchDetail, setShowMatchDetail] = useState(false);

  // Získat poslední 2 zápasy
  const recentMatches = getRecentMatches(2);

  useEffect(() => {
    const calculateTimeToGame = () => {
      const nextGame = new Date('2025-08-23T18:15:00');
      const now = new Date();
      const diff = nextGame - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeToNextGame(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeToNextGame('Zápas právě probíhá!');
      }
    };

    calculateTimeToGame();
    const interval = setInterval(calculateTimeToGame, 60000);
    return () => clearInterval(interval);
  }, []);

  // Nové aktuality
  const newsItems = [
    {
      id: 3,
      title: 'Lancers posílili útok',
      date: '7.1.2025',
      category: 'Přestup',
      image: '⭐',
      excerpt: 'Management přivedl zkušeného útočníka z partnerského týmu.'
    },
    {
      id: 4,
      title: 'Michaela Nováková chytila penaltu',
      date: '6.1.2025',
      category: 'Úspěch',
      image: '🥅',
      excerpt: 'Brankářka předvedla fantastický zákrok v rozhodující chvíli.'
    },
    {
      id: 5,
      title: 'Mladíci dominují',
      date: '4.1.2025',
      category: 'Mládež',
      image: '🌟',
      excerpt: 'Naše juniorka vede svou ligu s náskokem 6 bodů.'
    },
    {
      id: 6,
      title: 'Nový sponzor týmu',
      date: '3.1.2025',
      category: 'Klub',
      image: '🤝',
      excerpt: 'Lancers získali významného partnera pro sezónu 2025.'
    }
  ];

  // KHLA tabulka
  const khlaStandings = [
    { position: 1, team: 'HC Krokodýl', games: 14, points: 30 },
    { position: 2, team: 'HC Kopyta', games: 14, points: 29 },
    { position: 3, team: 'HC Žíhadla', games: 14, points: 28 },
    { position: 4, team: 'HC Band Of Brothers', games: 14, points: 25 },
    { position: 5, team: 'HC North Blades', games: 14, points: 15 },
    { position: 6, team: 'HC F.R.I.E.N.D.S.', games: 14, points: 14 },
    { position: 7, team: 'HC Lancers', games: 14, points: 14, isOurTeam: true },
    { position: 8, team: 'HC Warriors', games: 14, points: 8 }
  ];

  const topPlayers = [
    { name: 'Roman Šimek', number: 27, position: 'Obránce', goals: 4, assists: 8, points: 12 },
    { name: 'Vašek Materna', number: 91, position: 'Útočník', goals: 6, assists: 5, points: 11 },
    { name: 'Michaela Nováková', number: 30, position: 'Brankářka', saves: '89.5%', shutouts: 1 }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Match Detail Modal */}
      <MatchDetail 
        match={selectedMatch} 
        isOpen={showMatchDetail} 
        onClose={() => {
          setShowMatchDetail(false);
          setSelectedMatch(null);
        }} 
      />
      
      {/* Hero Section - Modern minimalist */}
      <section className="relative h-[650px] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/images/stadium-bg.jpg')] bg-cover bg-center opacity-20"></div>
        
        {/* Animated red accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-56 h-56 relative">
                  <Image 
                    src="/images/loga/lancers-logo.png" 
                    alt="HC Litvínov Lancers"
                    width={224}
                    height={224}
                    className="object-contain filter drop-shadow-2xl transform rotate-3 hover:rotate-0 transition-transform"
                  />
                </div>
                <div>
                  <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                    LITVÍNOV
                  </h1>
                  <div className="text-5xl md:text-7xl font-black text-red-600 -mt-2">
                    LANCERS
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-10 font-light">
                Oficiální stránky hokejového klubu • KHLA Sportega Liga
              </p>
            </div>
          </div>
        </div>
        
        {/* Příští zápas widget - modernější */}
        <div className="absolute bottom-8 right-8 bg-white rounded-2xl p-6 text-black max-w-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Příští zápas</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Image 
              src="/images/loga/lancers-logo.png" 
              alt="Lancers"
              width={80}
              height={80}
              className="object-contain"
            />
            <span className="text-xl font-black">vs</span>
            <Image 
              src="/images/loga/HCKopyta.png" 
              alt="HC Kopyta"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="text-2xl font-black mb-2">Lancers vs. HC Kopyta</div>
          <div className="text-gray-600 flex items-center gap-2 mb-4">
            <MapPin size={16} />
            Venkovní zápas • Teplice
          </div>
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl px-4 py-3 text-center">
            <div className="text-white text-sm font-semibold">23. srpna • 18:15</div>
            <div className="text-3xl font-black text-white">{timeToNextGame}</div>
          </div>
        </div>
      </section>

      {/* Stats Bar - černo-červený */}
      <section className="bg-gradient-to-r from-black via-red-600 to-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            <div>
              <div className="text-4xl font-black">7.</div>
              <div className="text-sm font-light uppercase tracking-wider opacity-90">Místo v lize</div>
            </div>
            <div>
              <div className="text-4xl font-black">4/8</div>
              <div className="text-sm font-light uppercase tracking-wider opacity-90">Výhry/Prohry</div>
            </div>
            <div>
              <div className="text-4xl font-black">58</div>
              <div className="text-sm font-light uppercase tracking-wider opacity-90">Vstřelené góly</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400">14</div>
              <div className="text-sm font-light uppercase tracking-wider opacity-90">Bodů</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-8">
        {/* Novinky */}
        <div className="lg:col-span-2 space-y-8">

          {/* Poslední soutěžní zápasy */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-black flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Swords className="text-white" size={20} />
                </div>
                Poslední soutěžní zápasy
              </h2>
              <Link href="/zapasy" className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2">
                Všechny zápasy
                <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recentMatches.map((match) => (
                <article 
                  key={match.id} 
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedMatch(match);
                    setShowMatchDetail(true);
                  }}
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Image 
                        src="/images/loga/CeskyPohar.png" 
                        alt="Český pohár"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {match.category}
                        </span>
                        <span className="text-gray-500 text-xs">{match.date}</span>
                      </div>
                      <div className="bg-black/5 rounded-lg px-3 py-2 mb-3">
                        <div className="text-center font-black text-xl">
                          {match.homeTeam} <span className="text-red-600">{match.score}</span> {match.awayTeam}
                        </div>
                        {match.periods && (
                          <div className="text-center text-sm text-gray-600 mt-1">{match.periods}</div>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors">
                        {match.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{match.excerpt}</p>
                      <div className="mt-3 text-red-600 text-sm font-bold flex items-center gap-1">
                        Zobrazit detail zápasu
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Nové aktuality */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-black flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                  <Newspaper className="text-white" size={20} />
                </div>
                Nové aktuality
              </h2>
              <Link href="/clanky" className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2">
                Všechny články
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="space-y-4">
              {newsItems.map((news) => (
                <article key={news.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {news.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {news.category}
                        </span>
                        <span className="text-gray-400 text-xs">{news.date}</span>
                      </div>
                      <h3 className="font-bold text-black group-hover:text-red-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{news.excerpt}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Instagram Top Video */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black text-black flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <Instagram className="text-white" size={16} />
                </div>
                Instagram
              </h3>
              <a 
                href="https://www.instagram.com/hclancers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-sm font-bold"
              >
                Sledovat
              </a>
            </div>
            <div className="relative bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '177.78%' }}>
              <iframe
                src="https://www.instagram.com/reel/C23YfD1Ium-/embed"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowtransparency="true"
                title="Instagram Reel"
              ></iframe>
            </div>
          </div>

          {/* Tabulka */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-black to-gray-900 p-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                KHLA Sportega Liga
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {khlaStandings.map((team) => (
                <div 
                  key={team.position} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    team.isOurTeam ? 'bg-red-50 border-2 border-red-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-lg ${
                      team.position <= 4 ? 'text-green-600' : 
                      team.position >= 7 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {team.position}.
                    </span>
                    <span className={`${team.isOurTeam ? 'font-black text-red-600' : 'font-semibold text-gray-900'} text-sm`}>
                      {team.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{team.games}z</span>
                    <span className={`font-black text-lg ${team.isOurTeam ? 'text-red-600' : 'text-gray-900'}`}>
                      {team.points}b
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/tabulky" className="block p-4 bg-gray-50 hover:bg-gray-100 text-center text-red-600 font-bold border-t">
              Kompletní tabulka
              <ChevronRight className="inline ml-2" size={16} />
            </Link>
          </div>

          {/* Top hráči */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" size={24} />
              Hvězdy týmu
            </h3>
            <div className="space-y-3">
              {topPlayers.map((player, index) => (
                <div key={index} className="bg-black/20 rounded-xl p-3 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-yellow-400">#{player.number}</span>
                      <div>
                        <div className="font-bold text-sm">{player.name}</div>
                        <div className="text-xs text-red-200">{player.position}</div>
                      </div>
                    </div>
                    {player.points && (
                      <div className="text-right">
                        <div className="text-xl font-black">{player.points}b</div>
                        <div className="text-xs text-red-200">{player.goals}G {player.assists}A</div>
                      </div>
                    )}
                    {player.saves && (
                      <div className="text-right">
                        <div className="text-xl font-black">{player.saves}</div>
                        <div className="text-xs text-red-200">{player.shutouts} SO</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/soupisky" className="block mt-4 text-center text-yellow-400 hover:text-yellow-300 font-bold">
              Celá soupiska →
            </Link>
          </div>

          {/* CTA HC Cards */}
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 text-8xl opacity-10">🃏</div>
            <h3 className="text-2xl font-black mb-3 text-yellow-400">HC Cards</h3>
            <p className="text-gray-300 mb-4">
              Sbírej hokejové kartičky svých oblíbených hráčů!
            </p>
            <Link href="/games/cards" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all transform hover:scale-105">
              Hrát teď
              <Flame className="inline ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - černý */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-28 h-28 relative">
                  <Image 
                    src="/images/loga/lancers-logo.png" 
                    alt="HC Litvínov Lancers"
                    width={112}
                    height={112}
                    className="object-contain filter drop-shadow-lg"
                  />
                </div>
                <div>
                  <div className="text-xl font-black">LITVÍNOV</div>
                  <div className="text-red-500 font-black">LANCERS</div>
                </div>
              </div>
              <p className="text-gray-400">
                Hrdý člen KHLA Sportega ligy
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">Klub</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/historie" className="hover:text-white transition-colors">Historie</Link></li>
                <li><Link href="/sin-slavy" className="hover:text-white transition-colors">Síň slávy</Link></li>
                <li><Link href="/soupisky" className="hover:text-white transition-colors">Soupiska</Link></li>
                <li><Link href="/realizacni-tym" className="hover:text-white transition-colors">Realizační tým</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">Pro fanoušky</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/games/cards" className="hover:text-white transition-colors">HC Cards hra</Link></li>
                <li><Link href="/vstupenky" className="hover:text-white transition-colors">Vstupenky</Link></li>
                <li><Link href="/fanshop" className="hover:text-white transition-colors">Fan Shop</Link></li>
                <li><Link href="/fanklub" className="hover:text-white transition-colors">Fan klub</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-red-500">Sledujte nás</h4>
              <div className="flex gap-3">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span className="text-xl">📘</span>
                </a>
                <a href="https://www.instagram.com/hclancers" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <Instagram size={20} className="text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-all">
                  <span className="text-xl">📺</span>
                </a>
              </div>
              <div className="mt-6">
                <p className="text-gray-500 text-sm">
                  © 2025 HC Litvínov Lancers
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}