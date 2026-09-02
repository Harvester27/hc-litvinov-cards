'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronRight,
  Crown,
  Crosshair,
  Info,
  Minus,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { khlaSeasonOptions, khlaStandingsBySeason } from '@/data/khlaStandings';
import {
  czechCupSeasonOptions,
  czechCupStandingsBySeason
} from '@/data/czechCupSeasons';

const getTeamLogo = (teamName = '') => {
  const name = teamName.toLocaleLowerCase('cs-CZ');

  if (name.includes('lancers')) return '/images/loga/lancers-logo.png';
  if (name.includes('netop')) return '/images/loga/Netopyri.png';
  if (name.includes('kocou')) return '/images/loga/Kocouri.png';
  if (name.includes('gurm')) return '/images/loga/Gurmani.png';
  if (name.includes('ducks')) return '/images/loga/Ducks.png';
  if (name.includes('viper')) return '/images/loga/Viper.png';
  if (name.includes('sharks')) return '/images/loga/Sharks.png';
  if (name.includes('krokod')) return '/images/loga/HCKrokodyl.png';
  if (name.includes('kopyta')) return '/images/loga/HCKopyta.png';
  if (name.includes('hadla')) return '/images/loga/HCZihadla.png';
  if (name.includes('band of brothers')) return '/images/loga/HCBandofBrothers.png';
  if (name.includes('north blades')) return '/images/loga/HCNorthBlades.png';
  if (name.includes('f.r.i.e.n.d.s')) return '/images/loga/HCFriends.png';
  if (name.includes('warriors') || name.includes('wariors')) return '/images/loga/HCWarriors.png';

  return '/images/loga/KHLA.png';
};

const isLancersTeam = (teamName) => /lancers/i.test(String(teamName || ''));

const formStyles = {
  W: 'bg-green-500 text-white',
  SW: 'bg-emerald-500 text-white',
  D: 'bg-yellow-500 text-white',
  SL: 'bg-amber-500 text-white',
  L: 'bg-red-500 text-white'
};

const formLabels = {
  W: 'V',
  SW: 'VN',
  D: 'R',
  SL: 'PN',
  L: 'P'
};

const resultStyles = {
  W: 'border-green-200 bg-green-50',
  D: 'border-yellow-200 bg-yellow-50',
  L: 'border-red-200 bg-red-50'
};

const medalStyles = {
  1: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black',
  2: 'bg-gradient-to-r from-gray-300 to-gray-400 text-black',
  3: 'bg-gradient-to-r from-orange-500 to-amber-700 text-white'
};

const TeamLogo = ({ team, className = 'h-9 w-9' }) => (
  <img
    src={getTeamLogo(team)}
    alt={`Logo ${team}`}
    className={`${className} shrink-0 object-contain`}
    onError={(event) => {
      event.currentTarget.src = '/images/loga/KHLA.png';
    }}
  />
);

const QuickStat = ({ label, value, accent = false }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-red-100">{label}:</span>
    <span className={`text-right font-bold ${accent ? 'text-yellow-300' : 'text-white'}`}>
      {value}
    </span>
  </div>
);

export default function TabulkyPage() {
  const [selectedLeague, setSelectedLeague] = useState('khla');
  const [selectedKhlaSeason, setSelectedKhlaSeason] = useState('25/26');
  const [selectedCupSeason, setSelectedCupSeason] = useState('25/26');

  const currentKhlaSeason = khlaStandingsBySeason[selectedKhlaSeason];
  const currentCupSeason = czechCupStandingsBySeason[selectedCupSeason];
  const isCup = selectedLeague === 'cup';
  const currentSeason = isCup ? currentCupSeason : currentKhlaSeason;
  const currentTeams = currentSeason.teams;
  const seasonOptions = isCup ? czechCupSeasonOptions : khlaSeasonOptions;
  const selectedSeason = isCup ? selectedCupSeason : selectedKhlaSeason;
  const setSelectedSeason = isCup ? setSelectedCupSeason : setSelectedKhlaSeason;
  const lancersMatches = currentSeason.lancersMatches;

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="text-green-500" size={20} />;
    if (trend === 'down') return <TrendingDown className="text-red-500" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  const getPositionBadge = (team) => {
    if (team.withdrawn || team.position === null) {
      return {
        bg: 'bg-gradient-to-r from-gray-300 to-gray-400',
        text: 'text-gray-800',
        icon: null,
        label: 'Odstoupil'
      };
    }

    if (isCup) {
      const hadSemifinalBye = currentCupSeason.directSemifinalTeams?.includes(team.team);
      if (hadSemifinalBye) {
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
          text: 'text-black',
          icon: <Crown size={15} />,
          label: 'Přímý postup do semifinále'
        };
      }

      return {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        icon: <Trophy size={15} />,
        label: 'Čtvrtfinále'
      };
    }

    if (team.position === 1) {
      return {
        bg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        text: 'text-black',
        icon: <Crown size={15} />,
        label: '1. místo'
      };
    }
    if (team.position <= 4) {
      return {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        icon: <Trophy size={15} />,
        label: 'Semifinále'
      };
    }
    return {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-white',
      icon: <Shield size={15} />,
      label: 'Play-out'
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <header className="mt-28 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-700"
          >
            <ArrowLeft size={20} />
            Zpět na hlavní stránku
          </Link>

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">Tabulky soutěží</h1>
              <p className="mt-1 text-gray-600">Sezóna {currentSeason.fullSeason}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedLeague('khla')}
              className={`flex items-center gap-3 rounded-full px-6 py-3 font-bold transition-all hover:scale-105 ${
                !isCup
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-red-500'
              }`}
            >
              <img src="/images/loga/KHLA.png" alt="KHLA" className="h-6 w-6 object-contain" />
              KHLA Sportega Liga
            </button>
            <button
              type="button"
              onClick={() => setSelectedLeague('cup')}
              className={`flex items-center gap-3 rounded-full px-6 py-3 font-bold transition-all hover:scale-105 ${
                isCup
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                  : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-red-500'
              }`}
            >
              <img src="/images/loga/CeskyPohar.png" alt="Český pohár" className="h-6 w-6 object-contain" />
              Český pohár
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Sezóna {isCup ? 'ČP' : 'KHLA'}
            </span>
            {seasonOptions.map((season) => (
              <button
                key={season.id}
                type="button"
                aria-pressed={selectedSeason === season.id}
                onClick={() => setSelectedSeason(season.id)}
                className={`rounded-full px-5 py-2.5 font-bold transition-all hover:scale-105 ${
                  selectedSeason === season.id
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                    : 'border-2 border-gray-300 bg-white text-gray-700 hover:border-red-500'
                }`}
              >
                {season.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-gray-900 to-black p-4">
                <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                  <img
                    src={isCup ? '/images/loga/CeskyPohar.png' : '/images/loga/KHLA.png'}
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                  {currentSeason.title}
                </h2>
                <p className="mt-1 text-sm text-gray-300">Tabulka základní části</p>
              </div>

              {isCup ? (
                <div className="border-b border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 shrink-0 text-amber-600" size={22} />
                    <div className="text-sm text-gray-700">
                      <p className="mb-2 font-bold text-gray-900">Formát ročníku</p>
                      <ul className="space-y-1.5">
                        {currentCupSeason.formatNotes.map((note) => (
                          <li key={note}>• {note}</li>
                        ))}
                      </ul>
                      <a
                        href={currentCupSeason.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex text-xs font-bold text-amber-800 underline underline-offset-2 hover:text-amber-950"
                      >
                        {currentCupSeason.sourceLabel}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 shrink-0 text-blue-600" size={22} />
                    <div className="text-sm">
                      <p className="mb-1 font-bold text-gray-900">Systém play-off KHLA Sportega Liga</p>
                      <p className="text-gray-700">1.–4. místo postupuje do semifinále, 5.–8. místo hraje o konečné umístění.</p>
                      {currentKhlaSeason.sourceUrl && (
                        <a
                          href={currentKhlaSeason.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex text-xs font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900"
                        >
                          {currentKhlaSeason.sourceLabel}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className={`w-full ${isCup ? 'min-w-[1060px]' : 'min-w-[900px]'}`}>
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50 text-sm">
                      <th className="p-3 text-left font-bold text-gray-700">#</th>
                      <th className="p-3 text-left font-bold text-gray-700">Tým</th>
                      <th className="p-3 text-center font-bold text-gray-700">Z</th>
                      <th className="p-3 text-center font-bold text-gray-700">V</th>
                      {isCup && <th className="p-3 text-center font-bold text-gray-700" title="Výhry po nájezdech">VN</th>}
                      <th className="p-3 text-center font-bold text-gray-700">R</th>
                      {isCup && <th className="p-3 text-center font-bold text-gray-700" title="Prohry po nájezdech">PN</th>}
                      <th className="p-3 text-center font-bold text-gray-700">P</th>
                      <th className="p-3 text-center font-bold text-gray-700">Skóre</th>
                      <th className="p-3 text-center font-bold text-gray-700">+/-</th>
                      <th className="p-3 text-center font-bold text-gray-700">Body</th>
                      <th className="p-3 text-center font-bold text-gray-700">Forma</th>
                      <th className="p-3 text-center font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeams.map((team) => {
                      const badge = getPositionBadge(team);
                      const goalDifference = team.goalsFor - team.goalsAgainst;

                      return (
                        <tr
                          key={team.code || team.team}
                          className={`border-b transition-colors hover:bg-gray-50 ${
                            team.isOurTeam ? 'bg-red-50 font-bold' : ''
                          } ${team.withdrawn ? 'text-gray-500 opacity-75' : ''}`}
                        >
                          <td className="p-3">
                            <div
                              title={badge.label}
                              className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold shadow-sm ${badge.bg} ${badge.text}`}
                            >
                              {team.position ?? '—'}
                              {isCup && badge.icon && (
                                <span className="absolute -right-1.5 -top-1.5">{badge.icon}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <TeamLogo team={team.team} className={isCup ? 'h-10 w-10' : 'h-9 w-9'} />
                              {team.code && (
                                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">
                                  {team.code}
                                </span>
                              )}
                              <div>
                                <div className={`flex items-center gap-2 ${team.isOurTeam ? 'text-red-600' : 'text-gray-900'}`}>
                                  <span>{team.team}</span>
                                  {team.isOurTeam && <Star className="text-yellow-500" size={16} fill="currentColor" />}
                                </div>
                                {team.note && <div className="mt-0.5 text-xs font-normal text-gray-500">{team.note}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-700">{team.games}</td>
                          <td className="p-3 text-center font-semibold text-green-600">{team.wins}</td>
                          {isCup && <td className="p-3 text-center font-semibold text-emerald-600">{team.shootoutWins}</td>}
                          <td className="p-3 text-center font-semibold text-yellow-600">{team.draws}</td>
                          {isCup && <td className="p-3 text-center font-semibold text-amber-600">{team.shootoutLosses}</td>}
                          <td className="p-3 text-center font-semibold text-red-600">{team.losses}</td>
                          <td className="p-3 text-center text-sm text-gray-700">{team.goalsFor}:{team.goalsAgainst}</td>
                          <td className="p-3 text-center">
                            <span className={`font-bold ${
                              goalDifference > 0
                                ? 'text-green-600'
                                : goalDifference < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}>
                              {goalDifference > 0 ? '+' : ''}{goalDifference}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-xl font-bold ${team.isOurTeam ? 'text-red-600' : 'text-gray-900'}`}>
                              {team.points}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {team.form?.length ? (
                              <div className="flex justify-center gap-1">
                                {team.form.map((result, index) => (
                                  <div
                                    key={`${result}-${index}`}
                                    title={team.lastGames?.[index] || ''}
                                    className={`group relative flex h-7 w-7 items-center justify-center rounded text-xs font-bold shadow-sm ${
                                      formStyles[result] || 'bg-gray-300 text-gray-700'
                                    }`}
                                  >
                                    {formLabels[result] || result}
                                    {team.lastGames?.[index] && (
                                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs font-normal text-white opacity-0 transition-opacity group-hover:opacity-100">
                                        {team.lastGames[index]}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="font-bold text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">{getTrendIcon(team.trend)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t bg-gray-50 p-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {isCup ? (
                    <>
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="h-4 w-4 rounded bg-gradient-to-r from-yellow-400 to-amber-500" />
                        Přímý postup do semifinále
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
                        Postup do čtvrtfinále
                      </div>
                      {currentTeams.some((team) => team.withdrawn) && (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded bg-gradient-to-r from-gray-300 to-gray-400" />
                          Odstoupil ze soutěže
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="h-4 w-4 rounded bg-gradient-to-r from-yellow-400 to-amber-500" />
                        1. místo
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
                        Postup do semifinále
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded bg-gradient-to-r from-blue-500 to-blue-600" />
                        Play-out
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {!isCup && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                    <Shield size={24} />
                    {currentKhlaSeason.placementTitle}
                  </h2>
                  <p className="mt-1 text-sm text-blue-100">{currentKhlaSeason.placementSubtitle}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        {['#', 'Tým', 'Z', 'V', 'R', 'P', 'Skóre', '+/-', 'Body'].map((heading) => (
                          <th
                            key={heading}
                            className={`p-3 font-bold text-gray-700 ${heading === '#' || heading === 'Tým' ? 'text-left' : 'text-center'}`}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentKhlaSeason.placementTeams.map((team) => {
                        const goalDifference = team.goalsFor - team.goalsAgainst;
                        return (
                          <tr key={team.code} className={`border-b ${team.isOurTeam ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                            <td className="p-3">
                              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white ${
                                team.isOurTeam ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'
                              }`}>
                                {team.position}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <TeamLogo team={team.team} />
                                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">{team.code}</span>
                                <span className={team.isOurTeam ? 'font-bold text-red-600' : 'text-gray-900'}>{team.team}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">{team.games}</td>
                            <td className="p-3 text-center font-semibold text-green-600">{team.wins}</td>
                            <td className="p-3 text-center font-semibold text-yellow-600">{team.draws}</td>
                            <td className="p-3 text-center font-semibold text-red-600">{team.losses}</td>
                            <td className="p-3 text-center text-sm">{team.goalsFor}:{team.goalsAgainst}</td>
                            <td className={`p-3 text-center font-bold ${goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {goalDifference > 0 ? '+' : ''}{goalDifference}
                            </td>
                            <td className={`p-3 text-center text-xl font-bold ${team.isOurTeam ? 'text-red-600' : ''}`}>{team.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="border-t bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-green-600" size={22} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{currentKhlaSeason.placementNoteTitle}</p>
                      <p className="mt-1 text-xs text-gray-600">{currentKhlaSeason.placementNoteText}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {isCup && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-red-700 to-red-900 p-4">
                  <h2 className="flex items-center gap-3 text-xl font-bold text-white">
                    <Trophy className="text-yellow-300" size={24} />
                    Konečné pořadí po play-off
                  </h2>
                  <p className="mt-1 text-sm text-red-100">Český pohár {currentCupSeason.fullSeason}</p>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  {currentCupSeason.finalStandings.map((team) => (
                    <div
                      key={team.code}
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        team.isOurTeam
                          ? 'border-red-300 bg-red-50 shadow-sm'
                          : team.withdrawn
                            ? 'border-gray-200 bg-gray-50 text-gray-500'
                            : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black ${
                        medalStyles[team.position] || 'bg-gray-900 text-white'
                      }`}>
                        {team.position}
                      </span>
                      <TeamLogo team={team.team} className="h-10 w-10" />
                      <div className="min-w-0">
                        <div className={`font-bold ${team.isOurTeam ? 'text-red-700' : 'text-gray-900'}`}>{team.team}</div>
                        {team.position === 1 && <div className="text-xs font-bold uppercase tracking-wide text-amber-700">Vítěz poháru</div>}
                        {team.withdrawn && <div className="text-xs text-gray-500">Odstoupil ze soutěže</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {isCup && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-black">
                    <img src="/images/loga/CeskyPohar.png" alt="" className="h-7 w-7 object-contain" />
                    Nejproduktivnější hráči
                  </h3>
                  <p className="mt-1 text-xs text-yellow-950">Top 10 podle bodů • celý ročník</p>
                </div>
                <div className="max-h-[560px] space-y-2 overflow-y-auto p-4">
                  {currentCupSeason.topScorers.map((player) => {
                    const isLancers = isLancersTeam(player.team);
                    return (
                      <div
                        key={`${player.rank}-${player.name}`}
                        className={`flex items-center justify-between gap-3 rounded-lg p-2.5 ${
                          player.rank === 1
                            ? 'border border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'
                            : isLancers
                              ? 'border border-red-200 bg-red-50'
                              : 'border border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            medalStyles[player.rank] || 'bg-gray-300 text-gray-700'
                          }`}>
                            {player.rank}
                          </span>
                          <TeamLogo team={player.team} className="h-8 w-8" />
                          <div className="min-w-0">
                            <div className={`truncate text-sm font-bold ${isLancers ? 'text-red-600' : 'text-gray-900'}`}>{player.name}</div>
                            <div className="truncate text-xs text-gray-500">{player.team} • {player.games} Z</div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-lg font-bold text-gray-900">{player.points} b</div>
                          <div className="text-xs text-gray-500">{player.goals} G • {player.assists} A</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {!isCup && (
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-white">
                    <Trophy size={22} />
                    O KHLA Sportega Lize
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                      <Shield className="text-blue-600" size={18} />
                      Formát soutěže
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• 8 týmů v základní části</li>
                      <li>• Každý s každým dvakrát</li>
                      <li>• Top 4 postupují do semifinále</li>
                      <li>• Týmy 5–8 hrají o umístění</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                      <Crosshair className="text-red-600" size={18} />
                      Výsledek Lancers
                    </h4>
                    <p className="text-sm text-gray-700">{currentKhlaSeason.summaryCard.note}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Calendar size={20} />
                  {isCup ? 'Cesta Lancers play-off' : 'Poslední zápasy Lancers'}
                </h3>
              </div>
              <div className="max-h-[520px] space-y-2 overflow-y-auto p-4">
                {lancersMatches.map((match, index) => (
                  <div
                    key={`${match.dateISO || match.date}-${index}`}
                    className={`rounded-lg border p-3 ${resultStyles[match.result] || 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        {match.stage && <div className="font-bold text-red-700">{match.stage}</div>}
                        <div className="font-semibold text-gray-500">{match.date}</div>
                      </div>
                      <span className={`text-lg font-black ${
                        match.result === 'W' ? 'text-green-700' : match.result === 'D' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {match.score}
                      </span>
                    </div>
                    <div className="mt-1 text-xs">
                      <span className={isLancersTeam(match.home) ? 'font-bold text-red-600' : 'text-gray-700'}>{match.home}</span>
                      <span className="mx-1 text-gray-400">vs</span>
                      <span className={isLancersTeam(match.away) ? 'font-bold text-red-600' : 'text-gray-700'}>{match.away}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Zap className="text-yellow-300" />
                Rychlé statistiky
              </h3>
              <div className="space-y-3 text-sm">
                {isCup ? (
                  <>
                    <QuickStat label="Nejvíce gólů v ZČ" value={`${currentCupSeason.quickStats.mostGoals} (${currentCupSeason.quickStats.mostGoalsCount})`} />
                    <QuickStat label="Nejlepší obrana v ZČ" value={`${currentCupSeason.quickStats.bestDefense} (${currentCupSeason.quickStats.bestDefenseCount})`} />
                    <QuickStat label="Lancers po ZČ" value={currentCupSeason.quickStats.lancersPosition} />
                    <QuickStat label="Bilance v ZČ" value={currentCupSeason.quickStats.record} />
                    <QuickStat label="Skóre v ZČ" value={currentCupSeason.quickStats.score} />
                    <QuickStat label="Play-off" value={currentCupSeason.quickStats.playoffRecord} />
                    <QuickStat label="Celá sezóna" value={currentCupSeason.quickStats.overallRecord} />
                    <QuickStat label="Celkové skóre" value={currentCupSeason.quickStats.overallScore} />
                    <QuickStat label="Konečné pořadí" value={currentCupSeason.quickStats.finalPosition} accent />
                  </>
                ) : (
                  <>
                    <QuickStat label="Nejvíce gólů" value={currentKhlaSeason.quickStats.mostGoals} />
                    <QuickStat label="Nejlepší obrana" value={currentKhlaSeason.quickStats.bestDefense} />
                    <QuickStat label="Lancers pozice" value={currentKhlaSeason.quickStats.lancersPosition} accent />
                    <QuickStat label="Bilance" value={currentKhlaSeason.quickStats.record} />
                    <QuickStat label="Skóre" value={currentKhlaSeason.quickStats.score} />
                  </>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 text-white shadow-xl">
              <h3 className="mb-3 text-lg font-bold">Výsledek sezóny</h3>
              <div className="mb-4 space-y-2">
                <div className="text-2xl font-bold text-red-500">{currentSeason.summaryCard.headline}</div>
                <div className="text-gray-300">{currentSeason.summaryCard.detail}</div>
                <div className="text-sm text-gray-400">{currentSeason.summaryCard.note}</div>
              </div>
              <Link
                href="/vysledky"
                className="block w-full rounded-lg bg-red-600 px-4 py-3 text-center font-bold text-white transition-all hover:scale-105 hover:bg-red-700"
              >
                Zobrazit výsledky
                <ChevronRight className="ml-2 inline" size={16} />
              </Link>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
            <Shield className="text-red-600" size={22} />
            Informace o soutěži
          </h3>
          {isCup ? (
            <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
              {[...currentCupSeason.rulesNotes, ...currentCupSeason.formatNotes].map((note) => (
                <div key={note} className="rounded-lg border border-gray-200 bg-white p-3">{note}</div>
              ))}
              <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">
                <strong className="text-gray-900">Data:</strong>{' '}
                Statický, ověřený snímek dokončeného ročníku.{' '}
                <a
                  href={currentCupSeason.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-red-600 underline underline-offset-2 hover:text-red-800"
                >
                  {currentCupSeason.sourceLabel.replace('Zdroj: ', '')}
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
              <div><strong className="text-gray-900">Systém bodování:</strong> Výhra = 3 body, remíza = 1 bod, prohra = 0 bodů.</div>
              <div><strong className="text-gray-900">Semifinále:</strong> Postup pro týmy na 1.–4. místě.</div>
              <div><strong className="text-gray-900">Play-out:</strong> Týmy na 5.–8. místě hrají o konečné umístění.</div>
              <div><strong className="text-gray-900">Forma:</strong> V = výhra, R = remíza, P = prohra.</div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <div className="font-bold">LITVÍNOV</div>
                  <div className="text-sm font-bold text-red-500">LANCERS</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">Hrdý člen KHLA ligy</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-red-500">Klub</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/historie" className="hover:text-white">Historie</Link></li>
                <li><Link href="/sin-slavy" className="hover:text-white">Síň slávy</Link></li>
                <li><Link href="/soupisky" className="hover:text-white">Soupiska</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-red-500">Pro fanoušky</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/games/cards" className="hover:text-white">HC Cards hra</Link></li>
                <li><Link href="/vstupenky" className="hover:text-white">Vstupenky</Link></li>
                <li><Link href="/fanshop" className="hover:text-white">Fan Shop</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-red-500">Sledujte nás</h4>
              <div className="flex gap-3 text-xl">
                <span aria-label="Facebook">📘</span>
                <span aria-label="Instagram">📷</span>
                <span aria-label="X">🐦</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © 2026 HC Litvínov Lancers • Oficiální stránky
          </div>
        </div>
      </footer>
    </div>
  );
}
