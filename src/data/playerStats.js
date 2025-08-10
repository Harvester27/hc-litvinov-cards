import { matchData } from './matchData';
import { getPlayerById } from './playerData';

// Získat všechny zápasy, ve kterých hráč hrál
export const getPlayerMatches = (playerId) => {
  const player = getPlayerById(playerId);
  if (!player) return [];
  
  return matchData.filter(match => {
    // Kontrola brankářů
    if (match.homeLineup?.goalie === player.name || 
        match.awayLineup?.goalie === player.name) {
      return true;
    }
    
    // Kontrola hráčů v sestavách
    const allHomePlayers = [
      ...(match.homeLineup?.line1 || []),
      ...(match.homeLineup?.line2 || []),
      ...(match.homeLineup?.line3 || [])
    ];
    
    const allAwayPlayers = [
      ...(match.awayLineup?.line1 || []),
      ...(match.awayLineup?.line2 || []),
      ...(match.awayLineup?.line3 || [])
    ];
    
    return allHomePlayers.includes(player.name) || 
           allAwayPlayers.includes(player.name);
  });
};

// Získat statistiky hráče
export const getPlayerStats = (playerId) => {
  const player = getPlayerById(playerId);
  if (!player) return null;
  
  const playerMatches = getPlayerMatches(playerId);
  
  let stats = {
    gamesPlayed: playerMatches.length,
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
  
  playerMatches.forEach(match => {
    // Zjistit, za který tým hráč hrál
    const isHomeTeam = 
      match.homeLineup?.goalie === player.name ||
      [
        ...(match.homeLineup?.line1 || []),
        ...(match.homeLineup?.line2 || []),
        ...(match.homeLineup?.line3 || [])
      ].includes(player.name);
    
    const teamSide = isHomeTeam ? 'home' : 'away';
    
    // Počítat góly
    if (match.goals) {
      match.goals.forEach(goal => {
        if (goal.scorer === player.name) {
          stats.goals++;
          stats.points++;
        }
        // Počítat asistence
        if (goal.assists && goal.assists.includes(player.name)) {
          stats.assists++;
          stats.points++;
        }
      });
    }
    
    // Počítat vyloučení
    if (match.penalties) {
      match.penalties.forEach(penalty => {
        if (penalty.player === player.name) {
          stats.penalties++;
          const minutes = parseInt(penalty.duration) || 2;
          stats.penaltyMinutes += minutes;
        }
      });
    }
    
    // Statistiky pro brankáře
    if (player.category === 'goalies') {
      if ((teamSide === 'home' && match.homeLineup?.goalie === player.name) ||
          (teamSide === 'away' && match.awayLineup?.goalie === player.name)) {
        
        if (match.saves) {
          stats.saves += match.saves[teamSide] || 0;
          const opponentSide = teamSide === 'home' ? 'away' : 'home';
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