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

// Získat všechny zápasy, ve kterých hráč hrál
export const getPlayerMatches = (playerId, matches = matchData) => {
  const player = getPlayerById(playerId);
  if (!player) return [];
  
  return matches.filter(match =>
    lineupIncludesPlayer(match.homeLineup, player) ||
    lineupIncludesPlayer(match.awayLineup, player)
  );
};

// Získat statistiky hráče
export const getPlayerStats = (playerId, matches = matchData) => {
  const player = getPlayerById(playerId);
  if (!player) return null;
  
  const playerMatches = getPlayerMatches(playerId, matches);
  const completedStatMatches = playerMatches.filter((match) => match.statsComplete !== false);
  
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
  
  completedStatMatches.forEach(match => {
    // Zjistit, za který tým hráč hrál
    const isHomeTeam = lineupIncludesPlayer(match.homeLineup, player);
    
    const teamSide = isHomeTeam ? 'home' : 'away';
    
    // Počítat góly
    if (match.goals) {
      match.goals.forEach(goal => {
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
    if (match.penalties) {
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
        
        if (match.saves) {
          stats.saves += match.saves[teamSide] || 0;
          stats.goalsAgainst += parseInt(match.score.split(':')[teamSide === 'home' ? 1 : 0]) || 0;
        }
        
        // Výhry/prohry
        const [homeScore, awayScore] = match.score.split(':').map(s => parseInt(s.trim()));
        if (teamSide === 'home' && homeScore > awayScore) stats.wins++;
        else if (teamSide === 'away' && awayScore > homeScore) stats.wins++;
        else stats.losses++;
      }
    }
  });
  
  // Výpočet úspěšnosti brankáře
  if (player.category === 'goalies' && stats.saves > 0) {
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
