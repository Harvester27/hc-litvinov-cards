'use client';

import { useEffect, useRef } from 'react';

const getMatchCountLabel = (count) => {
  if (count === 1) return '1 zápas';
  if (count >= 2 && count <= 4) return `${count} zápasy`;
  return `${count} zápasů`;
};

const getControlId = (prefix, group, value) =>
  `${prefix}-${group}-${value.replaceAll('/', '-').replaceAll(' ', '-')}`;

export default function SeasonCompetitionFilters({
  playerId,
  playerName,
  seasons,
  competitions,
  selectedSeason,
  selectedCompetition,
  competitionCounts,
  onSeasonChange,
  onCompetitionChange
}) {
  const competitionScrollRef = useRef(null);
  const selectedCompetitionRef = useRef(null);
  const shouldRevealCompetitionRef = useRef(false);
  const idPrefix = `profil-${playerId}`;
  const selectedSeasonInfo = seasons.find((season) => season.id === selectedSeason);
  const selectedCompetitionInfo = competitions.find(
    (competition) => competition.id === selectedCompetition
  );
  const selectedMatchCount = competitionCounts[selectedCompetition] || 0;

  useEffect(() => {
    if (!shouldRevealCompetitionRef.current) return;
    shouldRevealCompetitionRef.current = false;

    const container = competitionScrollRef.current;
    const selectedControl = selectedCompetitionRef.current;

    if (container && selectedControl) {
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedControl.getBoundingClientRect();

      if (selectedRect.left < containerRect.left) {
        container.scrollBy({ left: selectedRect.left - containerRect.left - 8, behavior: 'auto' });
      } else if (selectedRect.right > containerRect.right) {
        container.scrollBy({ left: selectedRect.right - containerRect.right + 8, behavior: 'auto' });
      }
    }
  }, [selectedCompetition]);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
      <fieldset>
        <legend className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
          Sezóna
        </legend>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
          {seasons.map((season) => {
            const controlId = getControlId(idPrefix, 'season', season.id);

            return (
              <div key={season.id} className="relative">
                <input
                  id={controlId}
                  type="radio"
                  name={`${idPrefix}-season`}
                  value={season.id}
                  checked={selectedSeason === season.id}
                  onChange={() => {
                    shouldRevealCompetitionRef.current = true;
                    onSeasonChange(season.id);
                  }}
                  className="peer sr-only"
                />
                <label
                  htmlFor={controlId}
                  className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-sm font-black text-gray-600 transition-colors hover:bg-white hover:text-gray-900 peer-checked:bg-red-600 peer-checked:text-white peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-red-200"
                >
                  {season.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
          Soutěž
        </legend>
        <div ref={competitionScrollRef} className="-m-1 overflow-x-auto p-1">
          <div className="flex min-w-max gap-2">
            {competitions.map((competition) => {
              const controlId = getControlId(idPrefix, 'competition', competition.id);
              const count = competitionCounts[competition.id] || 0;
              const isSelected = selectedCompetition === competition.id;

              return (
                <div
                  key={competition.id}
                  ref={isSelected ? selectedCompetitionRef : undefined}
                  className="relative"
                >
                  <input
                    id={controlId}
                    type="radio"
                    name={`${idPrefix}-competition`}
                    value={competition.id}
                    checked={isSelected}
                    onChange={() => {
                      shouldRevealCompetitionRef.current = true;
                      onCompetitionChange(competition.id);
                    }}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={controlId}
                    className="flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-red-300 hover:text-red-700 peer-checked:border-red-600 peer-checked:bg-red-600 peer-checked:text-white peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-red-200"
                  >
                    <span>{competition.label}</span>
                    <span
                      aria-hidden="true"
                      className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                    <span className="sr-only">{getMatchCountLabel(count)}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </fieldset>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {playerName}: sezóna {selectedSeasonInfo?.fullLabel}, {selectedCompetitionInfo?.fullLabel},{' '}
        {getMatchCountLabel(selectedMatchCount)}.
      </p>
    </div>
  );
}
