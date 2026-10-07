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
const articlesUrl = moduleUrl(readProjectFile('src/data/articleData.js').replace(
  /from '(\.\/articles\/[^']+)'/g,
  (_, path) => `from ${JSON.stringify(moduleUrl(readProjectFile(`src/data/${path.slice(2)}.js`)))}`,
));
const { getArticleBySlug } = await import(articlesUrl);
const { findPlayersInArticle, createPlayerLinks } = await import(moduleUrl(
  readProjectFile('src/data/ArticleUtils.js')
    .replace("'./playerData'", JSON.stringify(playersUrl))
    .replace("'./articleData'", JSON.stringify(articlesUrl)),
));

test('article player detection respects Czech word boundaries in ordinary prose', () => {
  const text = '<p>Celkově se nám nevídaně daří. Další zastávkou je Most.</p>';
  assert.deepEqual(findPlayersInArticle(text), []);
  assert.equal(createPlayerLinks(text), text);

  const article = getArticleBySlug('uspesny-start-do-nove-sezony-2026');
  assert.ok(article);
  assert.deepEqual(findPlayersInArticle(article.content), []);
  assert.equal(createPlayerLinks(article.content), article.content);
});

test('article links and mentions preserve full names, nicknames and historical Materna aliases', () => {
  const text = '<p>Vašek Materna a Václav Materna, Šali, Tury, Dan Kačeňák a Pavel Schubada St.</p>';
  const expected = ['materna-vaclav', 'salanda-jiri', 'turecek-tomas', 'kacenak-dan', 'schubada-pavel-st'];
  assert.deepEqual(
    findPlayersInArticle(text).map((player) => player.id).sort(),
    [...expected].sort(),
  );
  const linked = createPlayerLinks(text);
  for (const id of expected) {
    assert.ok(linked.includes(`href="/profil/${id}"`), `${id}: a complete name or alias must link`);
  }
  assert.equal((linked.match(/href="\/profil\/materna-vaclav"/g) || []).length, 2);
  assert.match(linked, />Šali<\/a>/);
  assert.match(linked, />Pavel Schubada St\.<\/a>/);
});

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

test('Krokodýli result adds one appearance and the recorded scoring and penalty totals to all eleven Lancers', () => {
  const matches = matchData.filter((match) => match.id === 'khla-krokodyl-2026-10-02');
  assert.equal(matches.length, 1, 'The scheduled entry must become one completed match');
  const match = matches[0];
  assert.equal(match.status, 'completed');
  assert.equal(match.skaterStatsComplete, true);
  assert.equal(match.goalieStatsComplete, false);
  const expected = [
    ['Tomáš Kodrle', 0, 0, 0],
    ['Roman Šimek', 0, 0, 0],
    ['Jiří Belinger', 2, 1, 0],
    ['Roman Beneš', 0, 0, 0],
    ['Luboš Coufal', 0, 2, 0],
    ['Ladislav Černý', 0, 1, 0],
    ['Stanislav Švarc', 2, 0, 2],
    ['Jiří Šalanda', 1, 1, 0],
    ['Ondřej Hrubý', 2, 0, 0],
    ['Michal Koreš', 0, 1, 0],
    ['Jan Schubada', 1, 1, 0],
  ];
  const roster = [match.homeLineup.goalie, ...match.homeLineup.players];
  assert.deepEqual(roster, expected.map(([name]) => name));
  const previousMatches = matchData.filter((entry) => entry.id !== match.id);

  for (const [name, goals, assists, penaltyMinutes] of expected) {
    const player = getPlayerByName(name);
    assert.ok(player, `${name} must resolve to an existing profile`);
    const stats = getPlayerStats(player.id, matches);
    assert.equal(stats.gamesPlayed, 1, `${name}: one appearance`);
    assert.equal(stats.goals, goals, `${name}: goals`);
    assert.equal(stats.assists, assists, `${name}: assists`);
    assert.equal(stats.points, goals + assists, `${name}: points`);
    assert.equal(stats.penaltyMinutes, penaltyMinutes, `${name}: penalty minutes`);
    assert.equal(stats.penalties, penaltyMinutes ? 1 : 0, `${name}: penalties`);
    const before = getPlayerStats(player.id, previousMatches);
    const after = getPlayerStats(player.id);
    for (const field of ['gamesPlayed', 'goals', 'assists', 'points', 'penaltyMinutes', 'penalties']) {
      assert.equal(after[field] - before[field], stats[field], `${name}: cumulative ${field}`);
    }
  }
  assert.equal(playerData.filter((player) => getPlayerStats(player.id, matches).gamesPlayed > 0).length, 11);
});

test('Kodrle keeps one existing profile and earns a win without invented saves or save percentage', () => {
  const match = matchData.find((entry) => entry.id === 'khla-krokodyl-2026-10-02');
  assert.ok(match);
  const player = getPlayerById('kodrle-tomas');
  assert.equal(getPlayerByName('Tomáš Kodrle'), player);
  assert.equal(playerData.filter((entry) => /Kodrle$/.test(entry.name)).length, 1);
  assert.ok(existsSync(new URL(`../public${player.photo}`, import.meta.url)));
  assert.equal(match.goalieStatsComplete, false);
  assert.equal(Object.hasOwn(match, 'saves'), false);
  const stats = getPlayerStats(player.id, [match]);
  assert.equal(stats.gamesPlayed, 1);
  assert.equal(stats.wins, 1);
  assert.equal(stats.losses, 0);
  assert.equal(Object.hasOwn(stats, 'savePercentage'), false);
  const before = getPlayerStats(player.id, matchData.filter((entry) => entry.id !== match.id));
  const after = getPlayerStats(player.id);
  assert.equal(after.gamesPlayed - before.gamesPlayed, 1);
  assert.equal(after.wins - before.wins, 1);
  assert.equal(after.saves, before.saves);
  assert.equal(Object.hasOwn(after, 'savePercentage'), false);
});

test('Warriors remains scheduled and cannot contribute player appearances even with a nominated lineup', () => {
  const fixture = matchData.find((match) => match.id === 'khla-warriors-2026-10-09');
  assert.ok(fixture);
  assert.equal(fixture.status, 'scheduled');
  assert.equal(fixture.date, '9.10.2026');
  assert.equal(fixture.time, '20:45');
  assert.match(fixture.location, /Most/);
  assert.equal(fixture.homeLineup, undefined);
  assert.equal(fixture.awayLineup, undefined);
  assert.equal(fixture.score, undefined);
  const nominated = {
    ...fixture,
    homeLineup: { goalie: 'Tomáš Kodrle', players: ['Jiří Belinger'] },
    awayLineup: { goalie: 'Tomáš Kodrle', players: ['Jiří Belinger'] },
    skaterStatsComplete: true,
  };
  for (const playerId of ['kodrle-tomas', 'belinger-jiri']) {
    assert.deepEqual(getPlayerMatches(playerId, [fixture, nominated]), []);
    assert.equal(getPlayerStats(playerId, [fixture, nominated]).gamesPlayed, 0);
    assert.equal(getPlayerMatches(playerId).some((match) => match.id === fixture.id), false);
  }
});
