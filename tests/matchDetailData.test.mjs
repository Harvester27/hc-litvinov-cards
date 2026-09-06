import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const readProjectFile = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const helpers = await import(moduleUrl(readProjectFile('src/components/matchDetailData.js')));
const cupUrl = moduleUrl(readProjectFile('src/data/czechCupMatches.js'));
const { matchData } = await import(moduleUrl(
  readProjectFile('src/data/matchData.js').replace("'./czechCupMatches'", JSON.stringify(cupUrl)),
));
const matchById = (id) => {
  const match = matchData.find((entry) => entry.id === id);
  assert.ok(match, `Fixture ${id} must exist`);
  return match;
};

test('Viper timeline interleaves goals and penalties without losing the served bench penalty', () => {
  const match = matchById('friendly-viper-2026-09-05');
  const before = JSON.stringify(match);
  const events = helpers.getTimelineEvents(match);
  assert.deepEqual(events.map(({ time, kind }) => [time, kind]), [
    ['02:33', 'goal'], ['12:10', 'penalty'], ['21:27', 'goal'],
    ['33:54', 'penalty'], ['35:31', 'goal'], ['38:39', 'goal'],
  ]);
  assert.equal(events[1].servedBy, 'Jiří Belinger');
  assert.equal(events[1].type, 'bench');
  assert.equal(events[1].duration, '2 min');
  assert.deepEqual(helpers.getPeriodScores(match.periods), ['1:0', '0:1', '2:0']);
  assert.equal(JSON.stringify(match), before, 'Rendering helpers must not mutate match data');
});

test('incomplete Berlin match keeps unknown players and never invents match events', () => {
  const match = matchById('friendly-berlin-2026-08-29');
  const groups = helpers.getLineupGroups(match.homeLineup);
  assert.deepEqual(groups.map((group) => group.label), ['Brankář', 'Obránci', 'Útočníci']);
  assert.equal(groups.flatMap((group) => group.players).filter((name) => name === '?').length, 7);
  assert.deepEqual(helpers.getLineupGroups(match.awayLineup), []);
  assert.deepEqual(helpers.getTimelineEvents(match), []);
  assert.deepEqual(helpers.getPeriodScores(match.periods), []);
});

test('away Lancers lineups preserve historical lines, goalkeeper assignments and aliases', () => {
  const match = matchById('czech-cup-2025-26-335');
  assert.equal(helpers.isLancersTeam(match.homeTeam), false);
  assert.equal(helpers.isLancersTeam(match.awayTeam), true);
  assert.equal(helpers.getLineupGroups(match.homeLineup)[0].players[0], 'Tomáš Kodrle');
  const groups = helpers.getLineupGroups(match.awayLineup);
  assert.deepEqual(groups.map((group) => group.label), ['Brankář', '1. řada', '2. řada', '3. řada']);
  assert.deepEqual(groups.flatMap((group) => group.players), [
    match.awayLineup.goalie, ...match.awayLineup.line1, ...match.awayLineup.line2, ...match.awayLineup.line3,
  ]);
  assert.ok(groups[1].players.includes('Vašek Materna'));
});

test('both historical shootout formats retain regulation scoring and attempt results separately', () => {
  const current = matchById('czech-cup-2025-26-359');
  assert.equal(helpers.getRegulationGoals(current).length, 16);
  const attempts = helpers.getShootoutAttempts(current);
  assert.equal(attempts.length, 10);
  assert.equal(helpers.getShootoutResult(attempts[0]), 'Neproměněno');
  assert.equal(helpers.getShootoutResult(attempts[1]), 'Proměněno');
  const historical = matchById('liga-kocouri-2025-01');
  assert.equal(helpers.getRegulationGoals(historical).length, 6);
  assert.equal(helpers.getShootoutResult(helpers.getShootoutAttempts(historical)[0]), 'Rozhodující nájezd');
});

test('legacy shootout fallback does not duplicate decisive goals in the timeline', () => {
  const regular = { time: '14:00', scorer: 'Hráč', team: 'home', score: '1:0' };
  const legacy = { time: 'SN', scorer: 'Hráč', team: 'home', score: '2:1' };
  const flagged = { time: '45:00', shootout: true, scorer: 'Jiný hráč', team: 'away' };
  const match = { goals: [regular, legacy, flagged], shootouts: [] };
  assert.deepEqual(helpers.getRegulationGoals(match), [regular]);
  assert.deepEqual(helpers.getShootoutAttempts(match), [legacy, flagged]);
  assert.deepEqual(helpers.getTimelineEvents(match), [{ ...regular, kind: 'goal' }]);
  assert.deepEqual(helpers.getShootoutAttempts({ ...match, shootout: { attempts: [flagged] } }), [flagged]);
  assert.deepEqual(helpers.getShootoutAttempts({ ...match, shootouts: 'Rozhodl nájezd' }), ['Rozhodl nájezd']);
  assert.deepEqual(helpers.getShootoutAttempts({ ...match, shootout: legacy }), [legacy]);
  assert.deepEqual(helpers.getShootoutAttempts({ ...match, shootouts: [legacy], shootout: [flagged] }), [legacy]);
});

test('timeline uses elapsed match time and preserves untimed events without fabricating values', () => {
  const events = helpers.getTimelineEvents({
    goals: [{ time: '10:01', score: '1:0' }, { time: '2:33', score: '0:1' }],
    penalties: [{ player: 'Neznámý' }, { time: '10:01', player: 'Hráč', duration: '2 min' }],
  });
  assert.deepEqual(events.map((event) => event.time), ['2:33', '10:01', '10:01', undefined]);
  assert.equal(Object.hasOwn(events.at(-1), 'duration'), false);
});

test('all known match clubs resolve to existing logos while unknown opponents have no borrowed logo', () => {
  const names = new Set(matchData.flatMap((match) => [match.homeTeam, match.awayTeam]));
  for (const name of names) {
    const logo = helpers.getTeamLogo(name);
    assert.ok(logo, `${name} must resolve to its known logo`);
    assert.ok(existsSync(new URL(`../public${logo}`, import.meta.url)), `${logo} must exist`);
  }
  assert.equal(helpers.getTeamLogo('Vipers Ústí nad Labem'), '/images/loga/Viper.png');
  assert.equal(helpers.getTeamLogo('Nový soupeř'), null);
  assert.equal(helpers.getTeamLogo(null), null);
  assert.equal(helpers.isLancersTeam('Nonlancers'), false);
});

test('empty match values are safe and supplied historical period separators are accepted', () => {
  assert.deepEqual(helpers.getTimelineEvents(null), []);
  assert.deepEqual(helpers.getShootoutAttempts(undefined), []);
  assert.deepEqual(helpers.getLineupGroups(undefined), []);
  assert.deepEqual(helpers.getPeriodScores('(1:0, 0 : 1, 2:0)'), ['1:0', '0:1', '2:0']);
  assert.deepEqual(helpers.getPeriodScores(undefined), []);
});
