'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { 
  Trophy, Calendar, MapPin, Users, 
  ArrowRight, Shield, Star, Award,
  Swords, ChevronRight, Clock, Target,
  Medal, CheckCircle
} from 'lucide-react';

export default function TurnajePage() {
  // Zatím máme jen jeden turnaj, ale struktura je připravená na více
  // Aktuální/budoucí turnaje
  const tournaments = [
    // Sem přidáme budoucí turnaje
  ];

  // Dokončené turnaje
  const pastTournaments = [
    {
      id: 'hobby-cup-litvinov-2025',
      name: 'Hobby Hockey Litvínov 2025',
      date: '29. - 31. srpna 2025',
      location: 'Zimní stadion Litvínov',
      teams: 4,
      status: 'finished',
      description: 'Mezinárodní turnaj amatérských hokejových týmů',
      winner: 'Alpha Team A 🇩🇪',
      second: 'Alpha Team B 🇩🇪',
      third: 'HC Litvínov Lancers 🇨🇿',
      featured: true,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <Navigation />
      
      {/* Hero sekce */}
      <div className="relative mt-28 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 animate-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <Swords className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl lg:text-6xl font-black text-white">
                TURNAJE
              </h1>
              <Swords className="w-12 h-12 text-red-500 scale-x-[-1]" />
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mezinárodní hokejové turnaje pořádané HC Litvínov Lancers
            </p>
          </div>
        </div>
      </div>

      {/* Hlavní obsah */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Aktuální/Nadcházející turnaje */}
        {tournaments.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-black text-white">Nadcházející turnaje</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500/50 to-transparent rounded-full"></div>
            </div>

            <div className="text-center py-16 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Žádné nadcházející turnaje</h3>
              <p className="text-gray-400">Nové turnaje budou brzy oznámeny.</p>
            </div>
          </div>
        )}

        {/* Dokončené turnaje */}
        {pastTournaments.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-gray-400" />
              <h2 className="text-3xl font-black text-white">Dokončené turnaje</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-500/50 to-transparent rounded-full"></div>
            </div>

            <div className="grid gap-8">
              {pastTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/turnaje/${tournament.id}`}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-800/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  
                  <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-gray-500/50 transition-all duration-300">
                    {tournament.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          DOKONČENO
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row">
                      {/* Levá část - informace */}
                      <div className="flex-1 p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-3xl font-black text-white mb-2 group-hover:text-gray-400 transition-colors">
                              {tournament.name}
                            </h3>
                            <p className="text-gray-400 text-lg">
                              {tournament.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Termín</div>
                              <div className="font-semibold">{tournament.date}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Místo</div>
                              <div className="font-semibold">{tournament.location}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                              <Users className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Počet týmů</div>
                              <div className="font-semibold">{tournament.teams} týmy</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Vítěz</div>
                              <div className="font-semibold text-yellow-400">{tournament.winner}</div>
                            </div>
                          </div>
                        </div>

                        {/* Medailové pozice */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
                            <Medal className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">1. {tournament.winner}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-400/20 rounded-full">
                            <Medal className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-400">2. {tournament.second}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-orange-600/20 rounded-full">
                            <Medal className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-600">3. {tournament.third}</span>
                          </div>
                        </div>

                        {/* Status a akce */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-semibold text-green-400">Turnaj dokončen</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400 font-bold group-hover:text-white group-hover:gap-4 transition-all">
                            <span>Zobrazit výsledky</span>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>

                      {/* Pravá část - vizuál/logo */}
                      <div className="lg:w-96 h-64 lg:h-auto relative bg-gradient-to-br from-gray-600/20 to-gray-800/20 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative text-center p-8">
                          <Trophy className="w-24 h-24 text-gray-500 mx-auto mb-4" />
                          <div className="text-white font-black text-2xl">HOBBY HOCKEY</div>
                          <div className="text-gray-400 font-black text-3xl">2025</div>
                          <div className="text-gray-500 text-sm mt-2">LITVÍNOV</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Informační sekce */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mezinárodní prestiž</h3>
            <p className="text-gray-400">
              Naše turnaje přitahují týmy z celé Evropy a poskytují jedinečnou příležitost k mezinárodnímu hokejovému setkání.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Skvělá atmosféra</h3>
            <p className="text-gray-400">
              Zažijte nezapomenutelnou hokejovou atmosféru v moderním zázemí zimního stadionu Litvínov.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hodnotné ceny</h3>
            <p className="text-gray-400">
              Vítězové si odnáší nejen putovní pohár, ale také hodnotné ceny a nezapomenutelné zážitky.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}