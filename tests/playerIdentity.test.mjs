import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const readProjectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const playersUrl = moduleUrl(readProjectFile('src/data/playerData.js'));
const cupUrl = moduleUrl(readProjectFile('src/data/czechCupMatches.js'));
const matchesUrl = moduleUrl(readProjectFile('src/data/matchData.js').replace("'./czechCupMatches'", JSON.stringify(cupUrl)));
const { playerData, getPlayerById, getPlayerByName, getPlayersInArticle } = await import(playersUrl);
const { matchData } = await import(matchesUrl);
const { getPlayerMatches, getPlayerStats, getTopScorers } = await import(moduleUrl(
  readProjectFile('src/data/playerStats.js')
    .replace("'./matchData'", JSON.stringify(matchesUrl))
    .replace("'./playerData'", JSON.stringify(playersUrl)),
));

test('both Materna names and old profile ID resolve to one photographed roster player', () => {
  const player = getPlayerById('materna-vaclav');
  assert.equal(getPlayerById('materna-vasek'), player);
  assert.equal(getPlayerByName('Vašek Materna'), player);
  assert.equal(getPlayerByName('Václav Materna'), player);
  assert.equal(playerData.filter((entry) => /Materna$/.test(entry.name)).length, 1);
  assert.equal(player.name, 'Václav Materna');
  assert.equal(player.number, 91);
  assert.equal(player.photo, '/images/players/roster/materna-vasek.webp');
  assert.ok(existsSync(new URL(`../public${player.photo}`, import.meta.url)));
  assert.doesNotMatch(player.description, /bratr/i);
});

test('new Viper goals and historical nickname appearances belong to the same profile', () => {
  const appearances = getPlayerMatches('materna-vaclav');
  assert.deepEqual(getPlayerMatches('materna-vasek'), appearances);
  assert.ok(appearances.some((match) => match.id === 'friendly-viper-2026-09-05'));
  assert.ok(appearances.some((match) => match.id === 'friendly-berlin-2026-08-28'));
  assert.equal(new Set(appearances.map((match) => match.id)).size, appearances.length);
  for (const match of appearances) {
    const lineup = /lancers/i.test(match.homeTeam) ? match.homeLineup : match.awayLineup;
    const maternaEntries = Object.values(lineup || {}).flat().filter((name) =>
      typeof name === 'string' && getPlayerByName(name)?.id === 'materna-vaclav');
    assert.equal(maternaEntries.length, 1, `Match ${match.id} must contain one Materna player card`);
  }

  const viper = matchData.find((match) => match.id === 'friendly-viper-2026-09-05');
  const stats = getPlayerStats('materna-vaclav', [viper]);
  assert.equal(stats.gamesPlayed, 1);
  assert.equal(stats.goals, 2);
  assert.equal(stats.points, 2);
  assert.deepEqual(getPlayerStats('materna-vasek'), getPlayerStats('materna-vaclav'));
  assert.equal(getTopScorers(playerData.length).filter((player) => /Materna$/.test(player.name)).length, 1);
});

test('mixed historical aliases in one match count each appearance, goal and assist once', () => {
  const fixture = {
    id: 'mixed-materna-names',
    homeTeam: 'Litvínov Lancers',
    awayTeam: 'Soupeř',
    homeLineup: { forwards: ['Vašek Materna', 'Václav Materna'] },
    awayLineup: { forwards: ['Někdo Jiný'] },
    goals: [
      { team: 'home', scorer: 'Vašek Materna', assists: '' },
      { team: 'home', scorer: 'Václav Materna', assists: '' },
      { team: 'home', scorer: 'Jiří Belinger', assists: '(Vašek Materna, Václav Materna)' },
    ],
    penalties: [{ team: 'home', player: 'Vašek Materna', duration: '2 min' }],
  };
  const stats = getPlayerStats('materna-vaclav', [fixture]);
  assert.equal(getPlayerMatches('materna-vaclav', [fixture]).length, 1);
  assert.equal(stats.gamesPlayed, 1);
  assert.equal(stats.goals, 2);
  assert.equal(stats.assists, 1);
  assert.equal(stats.points, 3);
  assert.equal(stats.penaltyMinutes, 2);
});

test('opponent names do not create a Lancers appearance, and articles mention one profile', () => {
  const opponentOnly = {
    homeTeam: 'Litvínov Lancers',
    awayTeam: 'Soupeř',
    homeLineup: { forwards: ['Jiří Belinger'] },
    awayLineup: { forwards: ['Vašek Materna', 'Václav Materna'] },
  };
  assert.deepEqual(getPlayerMatches('materna-vaclav', [opponentOnly]), []);
  const mentions = getPlayersInArticle('Vašek Materna a Václav Materna označují stejného hráče.');
  assert.deepEqual(mentions.map((player) => player.id), ['materna-vaclav']);
});
