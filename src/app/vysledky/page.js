'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import MatchDetail from '@/components/MatchDetail';
import { matchData } from '@/data/matchData';
import { getAllPlayers } from '@/data/playerData';
import { getPlayerStats } from '@/data/playerStats';
import {
  Trophy,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Activity,
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  SortDesc,
  SortAsc,
} from 'lucide-react';

// Team logos mapping - updated to match actual team names from matchData
const teamLogos = {
  // Litvínov Lancers varianty
  'HC Litvínov Lancers': '/images/loga/lancers-logo.png',
  'Litvínov Lancers': '/images/loga/lancers-logo.png',
  'Lancers': '/images/loga/lancers-logo.png',
  
  // Týmy z Českého poháru (podle matchData.js)
  'Netopýři': '/images/loga/Netopyri.png',
  'Kocouři Beroun': '/images/loga/Kocouri.png',
  'Gurmáni Žatec': '/images/loga/Gurmani.png',
  'Ducks Klášterec': '/images/loga/Ducks.png',
  'Ducks Kláštěrec': '/images/loga/Ducks.png',
  'Viper Ústí': '/images/loga/Viper.png',
  'Sharks Ústí': '/images/loga/Sharks.png',
  
  // KHLA Liga týmy (z tabulky)
  'HC Krokodýl': '/images/loga/HCKrokodyli.png',
  'HC Kopyta': '/images/loga/HCKopyta.png',
  'HC Žíhadla': '/images/loga/HCZihadla.png',
  'HC Band Of Brothers': '/images/loga/HCBandofBrothers.png',
  'HC North Blades': '/images/loga/HCNorthBlades.png',
  'HC F.R.I.E.N.D.S.': '/images/loga/HCFriends.png',
  'HC Warriors': '/images/loga/HCWarriors.png',
  
  'default': '/images/loga/KHLA.png'
};

// Competition logos
const competitionLogos = {
  'Český pohár': '/images/loga/CeskyPohar.png',
  'ČP': '/images/loga/CeskyPohar.png',
  'KHLA': '/images/loga/KHLA.png',
  'Liga': '/images/loga/KHLA.png',
  'default': '/images/loga/KHLA.png'
};

// Helper functions for logos
const getTeamLogo = (teamName) => {
  if (!teamName) return teamLogos.default;
  
  // Try exact match first
  if (teamLogos[teamName]) {
    return teamLogos[teamName];
  }
  
  // Try partial match - check if any key is contained in teamName or vice versa
  for (const [key, value] of Object.entries(teamLogos)) {
    // Skip default
    if (key === 'default') continue;
    
    // Check both directions for partial match
    const keyLower = key.toLowerCase();
    const teamLower = teamName.toLowerCase();
    
    if (teamLower.includes(keyLower) || keyLower.includes(teamLower)) {
      return value;
    }
    
    // Special cases for teams with different naming
    if (teamLower.includes('netopýři') || teamLower.includes('netopyri')) {
      return '/images/loga/Netopyri.png';
    }
    if (teamLower.includes('kocouři') || teamLower.includes('kocouri')) {
      return '/images/loga/Kecouri.png';
    }
    if (teamLower.includes('gurmán') || teamLower.includes('gurman')) {
      return '/images/loga/Gurman.png';
    }
  }
  
  return teamLogos.default;
};

const getCompetitionLogo = (competitionName) => {
  if (!competitionName) return competitionLogos.default;
  
  if (competitionLogos[competitionName]) {
    return competitionLogos[competitionName];
  }
  
  for (const [key, value] of Object.entries(competitionLogos)) {
    if (competitionName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return competitionLogos.default;
};

export default function VysledkyPage() {
  const [activeTab, setActiveTab] = useState('zapasy'); // 'zapasy' | 'statistiky'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showMatchDetail, setShowMatchDetail] = useState(false);
  const [positionFilter, setPositionFilter] = useState('all'); // 'all' | 'utocnici' | 'obranci'
  const [sortBy, setSortBy] = useState('points'); // 'name' | 'goals' | 'assists' | 'points' | 'penaltyMinutes' | 'games'
  const [sortOrder, setSortOrder] = useState('desc');
  const [playerQuery, setPlayerQuery] = useState('');
  const [matchSortOrder, setMatchSortOrder] = useState('desc'); // 'desc' | 'asc'

  // --- Helpers ---
  const stripScore = (s = '') => String(s).replace(/\s*(sn|pp|SN|PP)\s*/g, '').trim();
  const parseScore = (s = '') => {
    const clean = stripScore(s);
    const [a, b] = clean.split(':').map((n) => parseInt(n || '0', 10));
    return { a: a || 0, b: b || 0 };
  };
  const isHomeLancers = (m) =>
    (m.homeTeam || '').includes('Lancers') || (m.homeTeam || '').includes('Litvínov');
  const getMatchResult = (m) => {
    const { a, b } = parseScore(m.score);
    if (isHomeLancers(m)) return a > b ? 'win' : a < b ? 'loss' : 'tie';
    return b > a ? 'win' : b < a ? 'loss' : 'tie';
  };
  const parseDateTime = (m) => {
    const d = (m.date || '01.01.1900').split('.').map((x) => parseInt(x, 10));
    const [day = 1, month = 1, year = 1900] = d;
    const [hh = 0, mm = 0] = String(m.time || '00:00')
      .split(':')
      .map((x) => parseInt(x, 10));
    return new Date(year, month - 1, day, hh, mm);
  };

  // --- Matches (Český pohár) ---
  const czechCupMatches = useMemo(() => {
    return matchData
      .filter((m) => (m.category || '').includes('ČP') || (m.category || '').includes('Český pohár'))
      .sort((a, b) => {
        const da = parseDateTime(a).getTime();
        const db = parseDateTime(b).getTime();
        return matchSortOrder === 'desc' ? db - da : da - db;
      });
  }, [matchSortOrder]);

  const cupSummary = useMemo(() => {
    let wins = 0,
      losses = 0,
      ties = 0,
      gf = 0,
      ga = 0;
    for (const m of czechCupMatches) {
      const { a, b } = parseScore(m.score);
      const home = isHomeLancers(m);
      gf += home ? a : b;
      ga += home ? b : a;
      const r = getMatchResult(m);
      if (r === 'win') wins++;
      else if (r === 'loss') losses++;
      else ties++;
    }
    return { wins, losses, ties, gf, ga, games: czechCupMatches.length };
  }, [czechCupMatches]);

  // --- Players with stats ---
  const allPlayersWithStats = useMemo(() => {
    const all = getAllPlayers();
    const rows = [];
    for (const p of all) {
      const s = getPlayerStats(p.id);
      if (s && s.gamesPlayed > 0) {
        rows.push({
          id: p.id,
          name: p.name,
          number: p.number,
          position: p.position,
          category: p.category,
          stats: {
            games: s.gamesPlayed || 0,
            goals: s.goals || 0,
            assists: s.assists || 0,
            points: s.points || 0,
            penaltyMinutes: s.penaltyMinutes || 0,
          },
        });
      }
    }
    return rows;
  }, []);

  const filteredPlayers = useMemo(() => {
    let rows = allPlayersWithStats;
    // Hide goalies in skater table
    rows = rows.filter((p) => p.category !== 'goalies');

    if (positionFilter === 'utocnici') rows = rows.filter((p) => p.position === 'Útočník');
    if (positionFilter === 'obranci') rows = rows.filter((p) => p.position === 'Obránce');

    if (playerQuery.trim()) {
      const q = playerQuery.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q) || String(p.number).includes(q));
    }
    return rows;
  }, [allPlayersWithStats, positionFilter, playerQuery]);

  const sortedPlayers = useMemo(() => {
    const rows = [...filteredPlayers];
    if (sortBy === 'name') {
      rows.sort((a, b) =>
        sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    } else {
      rows.sort((a, b) => {
        const av = a.stats[sortBy] ?? 0;
        const bv = b.stats[sortBy] ?? 0;
        return sortOrder === 'asc' ? av - bv : bv - av;
      });
    }
    return rows;
  }, [filteredPlayers, sortBy, sortOrder]);

  const topPoints = useMemo(() => {
    if (!allPlayersWithStats.length) return null;
    return [...allPlayersWithStats]
      .filter((p) => p.category !== 'goalies')
      .sort((a, b) => b.stats.points - a.stats.points)[0];
  }, [allPlayersWithStats]);

  // --- UI helpers ---
  const Section = ({ title, icon, gradient, children }) => (
    <div>
      <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {title}
      </h2>
      {children}
    </div>
  );

  const MatchCard = ({ match, emphasis = false, idx = 0 }) => {
    const result = getMatchResult(match);
    const bgColor =
      result === 'win'
        ? 'from-green-50 to-green-100 border-green-200'
        : result === 'loss'
        ? 'from-red-50 to-red-100 border-red-200'
        : 'from-gray-50 to-gray-100 border-gray-200';
    const iconColor =
      result === 'win' ? 'text-green-600' : result === 'loss' ? 'text-red-600' : 'text-gray-600';

    const homeTeamLogo = getTeamLogo(match.homeTeam);
    const awayTeamLogo = getTeamLogo(match.awayTeam);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.4) }}
        className={`bg-gradient-to-r ${bgColor} border rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer`}
        onClick={() => {
          setSelectedMatch(match);
          setShowMatchDetail(true);
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className={iconColor}>
              {result === 'win' ? (
                <CheckCircle size={emphasis ? 36 : 28} />
              ) : result === 'loss' ? (
                <XCircle size={emphasis ? 36 : 28} />
              ) : (
                <Activity size={emphasis ? 36 : 28} />
              )}
            </div>
            <div className="min-w-0">
              <div className={`flex items-center gap-3 ${emphasis ? 'text-2xl' : 'text-lg'}`}>
                <div className="flex items-center gap-2">
                  <img 
                    src={homeTeamLogo} 
                    alt={match.homeTeam}
                    className={`${emphasis ? 'w-10 h-10' : 'w-8 h-8'} object-contain`}
                    onError={(e) => { e.target.src = '/images/loga/KHLA.png'; }}
                  />
                  <span className="font-black text-black">{match.homeTeam}</span>
                </div>
                <span className="text-gray-500 font-bold">vs</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-black">{match.awayTeam}</span>
                  <img 
                    src={awayTeamLogo} 
                    alt={match.awayTeam}
                    className={`${emphasis ? 'w-10 h-10' : 'w-8 h-8'} object-contain`}
                    onError={(e) => { e.target.src = '/images/loga/KHLA.png'; }}
                  />
                </div>
              </div>
              <div className="text-gray-600 flex items-center gap-3 mt-1 text-sm">
                <Calendar size={16} />
                {match.date}
                <MapPin size={16} />
                {match.location}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-black ${emphasis ? 'text-4xl font-black' : 'text-2xl font-black'}`}>
              {match.score}
            </div>
            <div className="text-gray-600 text-sm">{match.periods}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  const CategorySection = ({ label, keyText, gradient, emphasis = false }) => {
    const items = czechCupMatches.filter((m) => (m.category || '').includes(keyText));
    if (!items.length) return null;
    
    // Use Czech Cup logo for Czech Cup sections
    const sectionIcon = keyText.includes('Finále') || keyText.includes('Semifinále') || 
                       keyText.includes('Čtvrtfinále') || keyText.includes('Skupina') ?
      <img src="/images/loga/CeskyPohar.png" alt="Český pohár" className="w-6 h-6" /> :
      <Trophy className={label === 'FINÁLE' ? 'text-black' : 'text-white'} size={24} />;
    
    return (
      <Section
        title={label}
        gradient={gradient}
        icon={sectionIcon}
      >
        <div className="grid gap-3">
          <AnimatePresence initial={false}>
            {items.map((m, i) => (
              <MatchCard key={m.id} match={m} emphasis={emphasis} idx={i} />
            ))}
          </AnimatePresence>
        </div>
      </Section>
    );
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />

      {/* Modal */}
      <MatchDetail
        match={selectedMatch}
        isOpen={showMatchDetail}
        onClose={() => {
          setShowMatchDetail(false);
          setSelectedMatch(null);
        }}
      />

      {/* Hero */}
      <div className="pt-28 pb-8 px-4 bg-gradient-to-r from-black via-red-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Trophy className="text-black" size={36} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">VÝSLEDKY & STATISTIKY</h1>
                <p className="text-gray-300 mt-1 flex items-center gap-2">
                  <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-5 h-5" />
                  Český pohár 2024/2025 • Kompletní statistiky sezóny
                </p>
              </div>
            </div>

            {/* Quick summary */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              <Tile label="Zápasy" value={cupSummary.games} />
              <Tile label="Bilance" value={`${cupSummary.wins}-${cupSummary.losses}-${cupSummary.ties}`} />
              <Tile label="Skóre" value={`${cupSummary.gf}:${cupSummary.ga}`} />
              <Tile label="+/-" value={cupSummary.gf - cupSummary.ga} />
              <Tile label="Nejvíc bodů" value={topPoints ? `${topPoints.name} (${topPoints.stats.points})` : '—'} />
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-1 inline-flex">
              <TabButton active={activeTab === 'zapasy'} onClick={() => setActiveTab('zapasy')}>
                <span className="flex items-center gap-2">
                  <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-4 h-4" />
                  Český pohár
                </span>
              </TabButton>
              <TabButton active={activeTab === 'statistiky'} onClick={() => setActiveTab('statistiky')}>
                Statistiky sezóny
              </TabButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'zapasy' ? (
          <div className="grid gap-8">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <img src="/images/loga/CeskyPohar.png" alt="ČP" className="w-5 h-5" />
                Zobrazeno <span className="font-semibold text-gray-900">{czechCupMatches.length}</span> zápasů Českého poháru
              </div>
              <button
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-semibold"
                onClick={() => setMatchSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
              >
                {matchSortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                Řadit podle data: {matchSortOrder === 'desc' ? 'nejnovější → nejstarší' : 'nejstarší → nejnovější'}
              </button>
            </div>

            <CategorySection label="FINÁLE" keyText="Finále" gradient="from-yellow-400 to-yellow-600" emphasis />
            <CategorySection label="SEMIFINÁLE" keyText="Semifinále" gradient="from-gray-300 to-gray-500" />
            <CategorySection label="ČTVRTFINÁLE" keyText="Čtvrtfinále" gradient="from-orange-400 to-orange-600" />
            <CategorySection label="ZÁKLADNÍ SKUPINA" keyText="Skupina" gradient="from-blue-400 to-blue-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="grow">
                  <label className="text-sm font-bold text-gray-600 block mb-2">Filtrovat podle pozice</label>
                  <div className="flex flex-wrap gap-2">
                    <Pill active={positionFilter === 'all'} onClick={() => setPositionFilter('all')}>
                      Všichni hráči
                    </Pill>
                    <Pill active={positionFilter === 'utocnici'} onClick={() => setPositionFilter('utocnici')}>
                      Útočníci
                    </Pill>
                    <Pill active={positionFilter === 'obranci'} onClick={() => setPositionFilter('obranci')}>
                      Obránci
                    </Pill>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Klikni na hlavičky sloupců (Z, G, A, B, TM) pro řazení • Celkem {sortedPlayers.length} hráčů
                  </p>
                </div>
                <div className="w-full lg:w-80">
                  <label className="text-sm font-bold text-gray-600 block mb-2">Hledat hráče</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      value={playerQuery}
                      onChange={(e) => setPlayerQuery(e.target.value)}
                      placeholder="Jméno nebo číslo dresu…"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-red-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-black to-gray-900 p-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Star className="text-yellow-400" size={28} />
                  Statistiky hráčů sezóny 2024/2025
                </h2>
                <p className="text-gray-400 text-sm mt-2">Celkové statistiky ze všech soutěží</p>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <Th>#</Th>
                      <Th isSortable onClick={() => toggleSort('name')} isActive={sortBy === 'name'} order={sortOrder} align="left">
                        Hráč
                      </Th>
                      <Th align="center">Číslo</Th>
                      <Th align="left">Pozice</Th>
                      <Th isSortable onClick={() => toggleSort('games')} isActive={sortBy === 'games'} order={sortOrder} align="center">
                        Z
                      </Th>
                      <Th isSortable onClick={() => toggleSort('goals')} isActive={sortBy === 'goals'} order={sortOrder} align="center" tone="success">
                        G
                      </Th>
                      <Th isSortable onClick={() => toggleSort('assists')} isActive={sortBy === 'assists'} order={sortOrder} align="center" tone="info">
                        A
                      </Th>
                      <Th isSortable onClick={() => toggleSort('points')} isActive={sortBy === 'points'} order={sortOrder} align="center" tone="warning">
                        B
                      </Th>
                      <Th isSortable onClick={() => toggleSort('penaltyMinutes')} isActive={sortBy === 'penaltyMinutes'} order={sortOrder} align="center" tone="danger">
                        TM
                      </Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedPlayers.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors">
                        <Td>
                          <div
                            className={`text-lg font-black ${
                              idx === 0 && sortOrder === 'desc'
                                ? 'text-yellow-500'
                                : idx === 1 && sortOrder === 'desc'
                                ? 'text-gray-400'
                                : idx === 2 && sortOrder === 'desc'
                                ? 'text-orange-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {idx + 1}.
                          </div>
                        </Td>
                        <Td>
                          <div className="text-sm font-bold text-gray-900">{p.name}</div>
                        </Td>
                        <Td align="center">
                          <div className="text-lg font-bold text-gray-600">#{p.number}</div>
                        </Td>
                        <Td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              p.position === 'Útočník'
                                ? 'bg-red-100 text-red-700'
                                : p.position === 'Obránce'
                                ? 'bg-green-100 text-green-700'
                                : p.position === 'Brankář'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.position}
                          </span>
                        </Td>
                        <Td align="center">
                          <span className="text-sm font-semibold text-gray-700">{p.stats.games}</span>
                        </Td>
                        <Td align="center">
                          <span className="text-lg font-black text-green-600">{p.stats.goals}</span>
                        </Td>
                        <Td align="center">
                          <span className="text-lg font-black text-blue-600">{p.stats.assists}</span>
                        </Td>
                        <Td align="center">
                          <span className="text-lg font-black text-yellow-600">{p.stats.points}</span>
                        </Td>
                        <Td align="center">
                          <span className={`text-lg font-black ${p.stats.penaltyMinutes > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {p.stats.penaltyMinutes || 0}
                          </span>
                        </Td>
                      </tr>
                    ))}
                    {!sortedPlayers.length && (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-500">
                          Žádní hráči nenalezeni
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky KHLA Sportega Liga</p>
          </div>
        </div>
      </footer>
    </div>
  );

  // --- Small components ---
  function TabButton({ active, children, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${
          active ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' : 'text-gray-200 hover:text-white'
        }`}
      >
        {children}
      </button>
    );
  }

  function Tile({ label, value }) {
    return (
      <div className="px-4 py-3 rounded-xl bg-white/10 text-white">
        <div className="text-xs uppercase tracking-wider text-gray-300 font-bold">{label}</div>
        <div className="text-lg md:text-xl font-black mt-0.5">{value}</div>
      </div>
    );
  }

  function Pill({ active, children, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
          active ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {children}
      </button>
    );
  }

  function Th({ children, isSortable, onClick, isActive, order, align = 'left', tone }) {
    const alignClass = align === 'center' ? 'text-center' : 'text-left';
    const toneClass =
      tone === 'success'
        ? 'text-green-600 hover:bg-green-50'
        : tone === 'info'
        ? 'text-blue-600 hover:bg-blue-50'
        : tone === 'warning'
        ? 'text-yellow-600 hover:bg-yellow-50'
        : tone === 'danger'
        ? 'text-red-600 hover:bg-red-50'
        : 'text-gray-600 hover:bg-gray-100';
    return (
      <th
        className={`px-6 py-4 ${alignClass} text-xs font-bold uppercase tracking-wider ${
          isSortable ? `cursor-pointer transition-colors ${toneClass}` : 'text-gray-600'
        }`}
        onClick={isSortable ? onClick : undefined}
      >
        <div className={`flex items-center ${align === 'center' ? 'justify-center' : ''} gap-1`}>
          <span>{children}</span>
          {isActive && (order === 'desc' ? <ChevronDown size={14} className="opacity-80" /> : <ChevronUp size={14} className="opacity-80" />)}
        </div>
      </th>
    );
  }

  function Td({ children, align = 'left' }) {
    return (
      <td className={`px-6 py-4 whitespace-nowrap ${align === 'center' ? 'text-center' : ''}`}>{children}</td>
    );
  }

  function toggleSort(column) {
    if (sortBy === column) setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(column);
      setSortOrder('desc');
    }
  }
}