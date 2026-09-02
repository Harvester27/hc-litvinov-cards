import { matchData } from './matchData';
import { getPlayerById, playerData } from './playerData';

export const getPlayerNameVariants = (player) => [
  player.name,
  ...(player.aliases || [])
];

export const isPlayerName = (value, player) => {
  if (!value || !player) return false;
  return getPlayerNameVariants(player).includes(value);
};

export const includesPlayerName = (value, player) => {
  if (!value || !player) return false;
  const text = Array.isArray(value) ? value.join(', ') : String(value);
  return getPlayerNameVariants(player).some((name) => text.includes(name));
};

export const lineupIncludesPlayer = (lineup, player) => {
  if (!lineup || !player) return false;
  if (isPlayerName(lineup.goalie, player)) return true;

  const skaters = [
    ...(lineup.line1 || []),
    ...(lineup.line2 || []),
    ...(lineup.line3 || []),
    ...(lineup.defenders || []),
    ...(lineup.forwards || [])
  ];

  return skaters.some((name) => isPlayerName(name, player));
};

const areSkaterStatsComplete = (match) =>
  (match.skaterStatsComplete ?? match.statsComplete) !== false;

const areGoalieStatsComplete = (match) =>
  (match.goalieStatsComplete ?? match.statsComplete) !== false;

const hasSpecificStatsCompleteness = (match) =>
  typeof match.skaterStatsComplete === 'boolean' ||
  typeof match.goalieStatsComplete === 'boolean';

const parseMatchScore = (score) => {
  const parsedScore = String(score || '')
    .trim()
    .match(/^(\d+)\s*:\s*(\d+)(?:\s*(sn|pp))?$/i);

  if (!parsedScore) return null;
  return {
    home: Number.parseInt(parsedScore[1], 10),
    away: Number.parseInt(parsedScore[2], 10),
    decision: parsedScore[3]?.toLowerCase() || null
  };
};

const isShootoutGoal = (goal) =>
  goal?.shootout === true || /^sn$/i.test(String(goal?.time || '').trim());

const getLancersSide = (match) => {
  if (/lancers/i.test(String(match.homeTeam || ''))) return 'home';
  if (/lancers/i.test(String(match.awayTeam || ''))) return 'away';
  return null;
};

// Získat všechny zápasy, ve kterých hráč hrál
export const getPlayerMatches = (playerId, matches = matchData) => {
  const player = getPlayerById(playerId);
  if (!player) return [];
  
  return matches.filter((match) => {
    const lancersSide = getLancersSide(match);
    if (lancersSide) {
      return lineupIncludesPlayer(
        lancersSide === 'home' ? match.homeLineup : match.awayLineup,
        player
      );
    }

    return lineupIncludesPlayer(match.homeLineup, player) ||
      lineupIncludesPlayer(match.awayLineup, player);
  });
};

// Získat statistiky hráče
export const getPlayerStats = (playerId, matches = matchData) => {
  const player = getPlayerById(playerId);
  if (!player) return null;
  
  const playerMatches = getPlayerMatches(playerId, matches);
  // Starší zápasy používají pouze statsComplete. Nové, podrobnější příznaky
  // určují úplnost konkrétních událostí, ne známou účast hráče v sestavě.
  const completedStatMatches = playerMatches.filter((match) =>
    hasSpecificStatsCompleteness(match) || match.statsComplete !== false
  );
  
  let stats = {
    gamesPlayed: completedStatMatches.length,
    goals: 0,
    assists: 0,
    points: 0,
    penalties: 0,
    penaltyMinutes: 0,
    // Pro brankáře
    saves: 0,
    goalsAgainst: 0,
    wins: 0,
    losses: 0
  };
  let allGoalieStatsComplete = true;
  
  completedStatMatches.forEach(match => {
    // Zjistit, za který tým hráč hrál
    const lancersSide = getLancersSide(match);
    const isHomeTeam = lineupIncludesPlayer(match.homeLineup, player);
    const teamSide = lancersSide || (isHomeTeam ? 'home' : 'away');
    
    // Počítat góly
    if (areSkaterStatsComplete(match) && match.goals) {
      match.goals.forEach(goal => {
        if (isShootoutGoal(goal)) return;

        if (isPlayerName(goal.scorer, player)) {
          stats.goals++;
          stats.points++;
        }
        // Počítat asistence
        if (includesPlayerName(goal.assists, player)) {
          stats.assists++;
          stats.points++;
        }
      });
    }
    
    // Počítat vyloučení
    if (areSkaterStatsComplete(match) && match.penalties) {
      match.penalties.forEach(penalty => {
        if (isPlayerName(penalty.player, player)) {
          stats.penalties++;
          const minutes = parseInt(penalty.duration) || 2;
          stats.penaltyMinutes += minutes;
        }
      });
    }
    
    // Statistiky pro brankáře
    if (player.category === 'goalies') {
      if ((teamSide === 'home' && isPlayerName(match.homeLineup?.goalie, player)) ||
          (teamSide === 'away' && isPlayerName(match.awayLineup?.goalie, player))) {
        
        const parsedScore = parseMatchScore(match.score);
        const matchGoalieStatsComplete = areGoalieStatsComplete(match);

        if (!matchGoalieStatsComplete) {
          allGoalieStatsComplete = false;
        }

        if (matchGoalieStatsComplete && match.saves && parsedScore) {
          stats.saves += Number.parseInt(match.saves[teamSide], 10) || 0;
          const opponentWon = teamSide === 'home'
            ? parsedScore.away > parsedScore.home
            : parsedScore.home > parsedScore.away;
          const opponentScore = teamSide === 'home' ? parsedScore.away : parsedScore.home;
          stats.goalsAgainst += parsedScore.decision === 'sn' && opponentWon
            ? Math.max(0, opponentScore - 1)
            : opponentScore;
        }
        
        // Výhry/prohry
        if (parsedScore) {
          if (teamSide === 'home' && parsedScore.home > parsedScore.away) stats.wins++;
          else if (teamSide === 'away' && parsedScore.away > parsedScore.home) stats.wins++;
          else stats.losses++;
        }
      }
    }
  });
  
  // Výpočet úspěšnosti brankáře
  if (player.category === 'goalies' && allGoalieStatsComplete && stats.saves > 0) {
    const totalShots = stats.saves + stats.goalsAgainst;
    stats.savePercentage = totalShots > 0 
      ? ((stats.saves / totalShots) * 100).toFixed(1) + '%'
      : '0.0%';
  }
  
  return stats;
};

// Získat poslední zápasy hráče
export const getPlayerRecentMatches = (playerId, limit = 5) => {
  const matches = getPlayerMatches(playerId);
  return matches.slice(0, limit);
};

// Získat nejlepší hráče podle bodů
export const getTopScorers = (limit = 10) => {
  const allPlayers = playerData.map(player => ({
    ...player,
    stats: getPlayerStats(player.id)
  }));
  
  return allPlayers
    .filter(p => p.category === 'forwards' || p.category === 'defenders')
    .sort((a, b) => b.stats.points - a.stats.points)
    .slice(0, limit);
};

// Získat nejlepší brankáře
export const getTopGoalies = (limit = 3) => {
  const goalies = playerData
    .filter(p => p.category === 'goalies')
    .map(player => ({
      ...player,
      stats: getPlayerStats(player.id)
    }));
  
  return goalies
    .filter(g => g.stats.gamesPlayed > 0)
    .sort((a, b) => {
      // Řadit podle úspěšnosti zákroků
      const aPerc = parseFloat(a.stats.savePercentage) || 0;
      const bPerc = parseFloat(b.stats.savePercentage) || 0;
      return bPerc - aPerc;
    })
    .slice(0, limit);
};
