import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium, expect as playwrightExpect } from '@playwright/test';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { TIPOVACKA_ROUND, scoreRound } from '../src/lib/tipovacka.mjs';

const projectId = 'demo-lancers-tipovacka';
const expect = playwrightExpect.configure({ timeout: 30_000 });
const baseURL = process.env.TIPOVACKA_E2E_BASE_URL ?? 'http://127.0.0.1:3101';
assert.match(baseURL, /^http:\/\/(127\.0\.0\.1|localhost):3101$/);
assert.equal(process.env.GCLOUD_PROJECT, projectId);
for (const key of ['FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST']) {
  assert.match(process.env[key] ?? '', /^(127\.0\.0\.1|localhost):\d+$/);
}
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST;
const app = initializeApp({ projectId }, `browser-e2e-${process.pid}`);
const store = getFirestore(app);
const adminAuth = getAuth(app);
const output = 'test-results/tipovacka';
const password = 'LocalE2eOnly!2026';
const openTime = new Date('2026-09-25T18:00:00+02:00');
const closedTime = new Date('2026-09-26T22:00:00+02:00');
const players = {
  alice: { uid: 'e2e-alice', email: 'alice@example.test', displayName: 'Alice Lancers', emailVerified: true },
  bob: { uid: 'e2e-bob', email: 'bob@example.test', displayName: 'Bob Wolves', emailVerified: true },
  admin: { uid: 'e2e-admin', email: 'sanarycogames@outlook.cz', displayName: 'Správce E2E', emailVerified: true },
  unnamed: { uid: 'e2e-unnamed', email: 'unnamed@example.test', emailVerified: true },
  unverified: { uid: 'e2e-unverified', email: 'unverified@example.test', displayName: 'Neověřený E2E', emailVerified: false },
};
const reports = [];
let activeStep = 'initialization';
let rulesEnv;
let browser;
const contexts = [];
const pages = [];
const unexpectedErrors = [];
const rules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8');
const deadlineExpression = 'timestamp.value(1790442900000)';
assert.equal(rules.split(deadlineExpression).length - 1, 1);
await mkdir(output, { recursive: true });

async function step(name, callback) {
  activeStep = name;
  const began = Date.now();
  await callback();
  reports.push({ name, status: 'passed', durationMs: Date.now() - began });
  console.log(`PASS ${name}`);
}
async function loadRules(closed = false) {
  if (rulesEnv) await rulesEnv.cleanup();
  const [host, port] = firestoreHost.split(':');
  // request.time is owned by the emulator. Only its deadline comparison is
  // changed to model before/after; all auth, ownership and validation rules stay real.
  rulesEnv = await initializeTestEnvironment({ projectId, firestore: { host, port: Number(port),
    rules: rules.replace(deadlineExpression, closed
      ? 'request.time - duration.value(1, "s")' : 'request.time + duration.value(1, "s")') } });
}
async function newPage(viewport, time = openTime) {
  const context = await browser.newContext({ viewport, baseURL, reducedMotion: 'reduce',
    locale: 'cs-CZ', timezoneId: 'Europe/Prague', hasTouch: viewport.width < 500 });
  contexts.push(context);
  await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  const page = await context.newPage();
  pages.push(page);
  page.setDefaultTimeout(20_000);
  page.setDefaultNavigationTimeout(90_000);
  page.on('pageerror', (error) => unexpectedErrors.push(error.stack ?? error.message));
  await page.clock.setFixedTime(time);
  return page;
}
async function login(page, who) {
  await page.goto('/auth?next=/games/tipovacka');
  await page.getByLabel('E-mail', { exact: true }).fill(players[who].email);
  await page.getByLabel('Heslo', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Přihlásit se', exact: true }).click();
}
async function gameReady(page) {
  await expect(page.getByRole('heading', { name: /Každý zápas/ })).toBeVisible();
  await expect(page.getByText('Online', { exact: true })).toBeVisible();
}
async function screenshot(page, name) {
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  const width = await page.evaluate(() => ({ screen: window.innerWidth, content: document.documentElement.scrollWidth }));
  assert.ok(width.content <= width.screen + 1, `${name}: horizontal overflow ${JSON.stringify(width)}`);
}
async function fillTicket(page, { none = false, total = 5 } = {}) {
  await page.getByRole('button', { name: /^(Začít tipovačku|Upravit tipy)$/ }).click();
  await page.locator('input[name="tip-outcome"][value="lancers"]').check();
  await page.getByRole('button', { name: 'Další otázka', exact: true }).click();
  if (none) await page.getByRole('button', { name: 'Vybrat Nikdo z uvedené pětice za 10 bodů' }).click();
  else await page.getByRole('textbox', { name: 'Počet bodů pro Marian Dlugopolský', exact: true }).fill('10');
  await screenshot(page, none ? 'mobile-scorer' : 'desktop-scorer');
  await page.getByRole('button', { name: 'Další otázka', exact: true }).click();
  await page.locator('input[name="tip-topPoints"][value="tomas-turecek"]').check();
  await page.getByRole('button', { name: 'Další otázka', exact: true }).click();
  await page.locator('input[name="tip-firstGoal"][value="lancers"]').check();
  await page.getByRole('button', { name: 'Další otázka', exact: true }).click();
  await page.getByLabel('Celkový počet gólů', { exact: true }).fill(String(total));
  await page.getByRole('button', { name: 'Dokončit tipovačku', exact: true }).click();
  await expect(page.getByText('Tiket je uložený.', { exact: false })).toBeVisible();
}
async function token(who) {
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: players[who].email, password, returnSecureToken: true }),
  });
  assert.equal(response.status, 200);
  return (await response.json()).idToken;
}
async function readAs(who, document) {
  return fetch(`http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents/${document}`, {
    headers: { Authorization: `Bearer ${await token(who)}` },
  });
}
const roundRef = store.collection('tipovackaRounds').doc(TIPOVACKA_ROUND.id);
const snapshotPoints = async () => Object.fromEntries((await store.collection('tipovackaStandings').get()).docs
  .map((doc) => [doc.id, { totalPoints: doc.data().totalPoints, roundsPlayed: doc.data().roundsPlayed }]));
const initialResult = { homeGoals: 3, awayGoals: 2, scorerIds: [],
  playerPoints: { 'tomas-turecek': 2, 'marian-dlugopolsky': 0, 'gustav-toman': 0 },
  firstGoalTeam: 'lancers',
  didNotPlayIds: ['jan-schubada', 'marian-dlugopolsky', 'lubos-coufal', 'jan-hanus', 'jiri-salanda', 'gustav-toman'] };

try {
  await step('isolated demo emulator setup', async () => {
    await loadRules();
    await rulesEnv.clearFirestore();
    const cleared = await fetch(`http://${authHost}/emulator/v1/projects/${projectId}/accounts`, { method: 'DELETE' });
    assert.ok(cleared.ok);
    for (const player of Object.values(players)) await adminAuth.createUser({ ...player, password });
    const channel = process.env.PLAYWRIGHT_CHANNEL
      ?? (!existsSync(chromium.executablePath()) && process.platform === 'win32' ? 'msedge' : undefined);
    browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
  });
  const mobile = { width: 390, height: 844 };
  const desktop = { width: 1440, height: 1000 };
  const alice = await newPage(mobile);
  const bob = await newPage(desktop);
  const admin = await newPage(desktop, closedTime);

  await step('anonymous and unverified accounts see the login gate', async () => {
    await alice.goto('/games/tipovacka');
    await expect(alice.getByRole('heading', { name: 'Přihlas se a tipuj s Lancers.' })).toBeVisible();
    await screenshot(alice, 'mobile-login-gate');
    await login(alice, 'unverified');
    await expect(alice.getByText(/E-mail ještě není potvrzený/)).toBeVisible();
    await alice.goto('/games/tipovacka');
    await expect(alice.getByRole('heading', { name: 'Přihlas se a tipuj s Lancers.' })).toBeVisible();
  });
  await step('verified account without a name sees the profile gate', async () => {
    const unnamed = await newPage(mobile);
    await login(unnamed, 'unnamed');
    await expect(unnamed.getByRole('heading', { name: 'Nemáš nastavené jméno do hry.' })).toBeVisible();
    await screenshot(unnamed, 'mobile-name-gate');
    assert.equal((await store.collection('tipovackaStandings').doc(players.unnamed.uid).get()).exists, false);
  });
  await step('two verified named players save their own tickets through the real UI', async () => {
    await login(alice, 'alice');
    await gameReady(alice);
    await screenshot(alice, 'mobile-game');
    await fillTicket(alice, { none: true, total: 4 });
    await login(bob, 'bob');
    await gameReady(bob);
    await fillTicket(bob);
    await expect(alice.getByRole('row', { name: /Bob Wolves/ })).toBeVisible();
    await expect(bob.getByRole('row', { name: /Alice Lancers/ })).toBeVisible();
    await expect(alice.getByRole('button', { name: 'Zadat a vyhodnotit výsledek' })).toHaveCount(0);
    await expect(bob.getByRole('button', { name: 'Zadat a vyhodnotit výsledek' })).toHaveCount(0);
    assert.equal((await store.collection('tipovackaPreview').get()).size, 2);
  });
  await step('editing and reload preserve only the owner ticket', async () => {
    await alice.getByRole('button', { name: 'Upravit tipy', exact: true }).click();
    for (let index = 0; index < 4; index += 1) await alice.getByRole('button', { name: 'Další otázka', exact: true }).click();
    await alice.getByLabel('Celkový počet gólů', { exact: true }).fill('5');
    await alice.getByRole('button', { name: 'Dokončit tipovačku', exact: true }).click();
    await expect(alice.getByText('Tiket je uložený.', { exact: false })).toBeVisible();
    await alice.reload();
    await gameReady(alice);
    const ownTicket = alice.getByRole('region', { name: 'Tvůj tiket', exact: true });
    await expect(ownTicket.getByText('Nikdo z uvedené pětice: 10 b.', { exact: true })).toBeVisible();
    await expect(ownTicket.getByText('5 gólů', { exact: true })).toBeVisible();
    await expect(ownTicket.getByText('Marian Dlugopolský: 10 b.', { exact: true })).toHaveCount(0);
    await screenshot(alice, 'mobile-saved-ticket');
    await screenshot(bob, 'desktop-saved-ticket');
    assert.equal((await readAs('alice', `tipovackaPreview/${players.alice.uid}`)).status, 200);
    assert.equal((await readAs('alice', `tipovackaPreview/${players.bob.uid}`)).status, 403);
    assert.equal((await readAs('bob', `tipovackaPreview/${players.alice.uid}`)).status, 403);
    assert.equal((await readAs('admin', `tipovackaPreview/${players.bob.uid}`)).status, 200);
  });
  await step('server deadline rejects a stale open tab, then UI closes after reload', async () => {
    const before = (await store.collection('tipovackaPreview').doc(players.alice.uid).get()).data();
    await loadRules(true);
    await alice.getByRole('button', { name: 'Uložit znovu', exact: true }).click();
    await expect(alice.getByText(/Uložení se nepovedlo/)).toBeVisible();
    assert.deepEqual((await store.collection('tipovackaPreview').doc(players.alice.uid).get()).data(), before);
    for (const page of [alice, bob]) {
      await page.clock.setFixedTime(closedTime);
      await page.reload();
      await gameReady(page);
      await expect(page.getByRole('heading', { name: 'Tipování je uzavřené.' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Upravit tipy', exact: true })).toHaveCount(0);
    }
    await screenshot(alice, 'mobile-closed');
  });
  await step('admin confirms final result and reviews annulled scores without publication', async () => {
    await login(admin, 'admin');
    await gameReady(admin);
    await admin.getByRole('button', { name: 'Zadat a vyhodnotit výsledek', exact: true }).click();
    const panel = admin.getByRole('region', { name: 'Zadat skutečný výsledek', exact: true });
    await expect(panel).toBeVisible();
    await panel.getByRole('spinbutton', { name: 'Litvínov Lancers', exact: true }).fill('3');
    await panel.getByRole('spinbutton', { name: 'HC Glacier Wolves', exact: true }).fill('2');
    await panel.getByRole('spinbutton', { name: 'Tomáš Tureček', exact: true }).fill('2');
    const absent = panel.getByRole('group', { name: '5. Kdo nenastoupil?', exact: true });
    for (const id of initialResult.didNotPlayIds) {
      const player = [...TIPOVACKA_ROUND.questions.scorer.options, ...TIPOVACKA_ROUND.questions.topPoints.options].find((item) => item.id === id);
      await absent.getByRole('checkbox', { name: player.label, exact: true }).check();
    }
    await panel.getByRole('combobox', { name: 'Tým prvního střelce' }).selectOption('lancers');
    await expect(panel.getByRole('button', { name: 'Zobrazit náhled bodů', exact: true })).toBeDisabled();
    await panel.getByRole('checkbox', { name: /Potvrzuji, že zápas skončil/ }).check();
    const previewResponse = admin.waitForResponse((response) => response.url().endsWith('/api/tipovacka/preview'));
    await panel.getByRole('button', { name: 'Zobrazit náhled bodů', exact: true }).click();
    const response = await previewResponse;
    assert.equal(response.status(), 200, await response.text());
    await expect(panel.getByText('Nikdo z uvedené pětice do zápasu nenastoupil.', { exact: false })).toBeVisible();
    await expect(panel.getByText('Z vypsané trojice nastoupil nejvýše jeden hráč.', { exact: false }).first()).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Zveřejnit vyhodnocení', exact: true })).toBeDisabled();
    assert.equal((await roundRef.get()).exists, false);
    for (const points of Object.values(await snapshotPoints())) assert.deepEqual(points, { totalPoints: 0, roundsPlayed: 0 });
    await screenshot(admin, 'desktop-admin-preview');
  });
  let publicationRequest;
  await step('publication updates each player exactly once and reveals only their breakdown', async () => {
    const panel = admin.getByRole('region', { name: 'Zadat skutečný výsledek', exact: true });
    await panel.getByRole('checkbox', { name: /Zkontroloval jsem výsledek i body všech tiketů/ }).check();
    const publishing = admin.waitForRequest((request) => request.url().endsWith('/api/tipovacka/publish'));
    await panel.getByRole('button', { name: 'Zveřejnit vyhodnocení', exact: true }).click();
    const request = await publishing;
    publicationRequest = { body: request.postData(), headers: await request.allHeaders() };
    await expect(admin.getByRole('heading', { name: 'Zápas je vyhodnocený.', exact: true })).toBeVisible();
    for (const [page, who] of [[alice, 'alice'], [bob, 'bob']]) {
      await expect(page.getByRole('heading', { name: 'Výsledek zápasu', exact: true })).toBeVisible();
      const evaluation = (await roundRef.collection('evaluations').doc(players[who].uid).get()).data();
      const ticket = (await store.collection('tipovackaPreview').doc(players[who].uid).get()).data();
      assert.equal(evaluation.total, scoreRound(ticket.picks, initialResult).total);
      assert.equal(evaluation.breakdown.scorer.points, 0);
      assert.equal(evaluation.breakdown.topPoints.points, 0);
      assert.equal((await readAs(who, `tipovackaRounds/${TIPOVACKA_ROUND.id}/evaluations/${players[who === 'alice' ? 'bob' : 'alice'].uid}`)).status, 403);
    }
    const beforeRepeat = await snapshotPoints();
    const repeated = await admin.request.post('/api/tipovacka/publish', {
      data: publicationRequest.body,
      headers: { Authorization: publicationRequest.headers.authorization, 'Content-Type': 'application/json' },
    });
    assert.equal(repeated.status(), 200);
    assert.equal((await repeated.json()).alreadyApplied, true);
    assert.deepEqual(await snapshotPoints(), beforeRepeat);
    await screenshot(alice, 'mobile-evaluation');
    await screenshot(bob, 'desktop-evaluation');
  });
  await step('controlled correction changes only point differences and preserves audit history', async () => {
    await admin.reload();
    await gameReady(admin);
    await admin.getByRole('button', { name: 'Opravit zveřejněný výsledek', exact: true }).click();
    const panel = admin.getByRole('region', { name: 'Opravit zveřejněný výsledek', exact: true });
    await expect(panel).toBeVisible();
    const before = await snapshotPoints();
    const absent = panel.getByRole('group', { name: '5. Kdo nenastoupil?', exact: true });
    await absent.getByRole('checkbox', { name: 'Marian Dlugopolský', exact: true }).uncheck();
    await panel.getByRole('group', { name: '2. Střelci z vypsané pětice', exact: true })
      .getByRole('checkbox', { name: 'Marian Dlugopolský', exact: true }).check();
    await panel.getByRole('spinbutton', { name: 'Marian Dlugopolský', exact: true }).fill('1');
    await panel.getByRole('textbox', { name: 'Důvod opravy', exact: true }).fill('Oprava zápisu: Marian nastoupil a vstřelil gól.');
    await panel.getByRole('checkbox', { name: /Potvrzuji, že zápas skončil/ }).check();
    const previewResponse = admin.waitForResponse((response) => response.url().endsWith('/api/tipovacka/preview'));
    await panel.getByRole('button', { name: 'Zobrazit náhled bodů', exact: true }).click();
    const response = await previewResponse;
    assert.equal(response.status(), 200, await response.text());
    await expect(panel.getByText(/Před opravou/).first()).toBeVisible();
    assert.deepEqual(await snapshotPoints(), before);
    await panel.getByRole('checkbox', { name: /Zkontroloval jsem výsledek i body všech tiketů/ }).check();
    await panel.getByRole('button', { name: 'Zveřejnit opravu a rozdíl bodů', exact: true }).click();
    await expect(alice.getByText('Výsledek byl opraven · verze 2.', { exact: true })).toBeVisible();
    await expect(bob.getByText('Výsledek byl opraven · verze 2.', { exact: true })).toBeVisible();
    const correctedResult = { ...initialResult, scorerIds: ['marian-dlugopolsky'],
      playerPoints: { ...initialResult.playerPoints, 'marian-dlugopolsky': 1 },
      didNotPlayIds: initialResult.didNotPlayIds.filter((id) => id !== 'marian-dlugopolsky') };
    const after = await snapshotPoints();
    for (const who of ['alice', 'bob']) {
      const uid = players[who].uid;
      const ticket = (await store.collection('tipovackaPreview').doc(uid).get()).data();
      const evaluation = (await roundRef.collection('evaluations').doc(uid).get()).data();
      const expectedTotal = scoreRound(ticket.picks, correctedResult).total;
      assert.equal(evaluation.total, expectedTotal);
      assert.equal(evaluation.delta, expectedTotal - before[uid].totalPoints);
      assert.equal(after[uid].totalPoints, expectedTotal);
      assert.equal(after[uid].roundsPlayed, 1);
    }
    assert.equal((await roundRef.get()).data().revision, 2);
    assert.equal((await roundRef.collection('revisions').get()).size, 2);
    assert.equal((await readAs('alice', `tipovackaRounds/${TIPOVACKA_ROUND.id}/revisions/2`)).status, 403);
    assert.equal((await readAs('admin', `tipovackaRounds/${TIPOVACKA_ROUND.id}/revisions/2`)).status, 200);
    await screenshot(alice, 'mobile-corrected');
    await screenshot(bob, 'desktop-corrected');
  });
  assert.deepEqual(unexpectedErrors, [], 'Unexpected browser page errors');
} catch (error) {
  reports.push({ name: activeStep, status: 'failed', message: error.stack ?? String(error) });
  for (const [index, page] of pages.entries()) {
    if (!page.isClosed()) await page.screenshot({ path: `${output}/failure-${index}.png`, fullPage: true }).catch(() => {});
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify({
    projectId, baseURL, actualRunAt: new Date().toISOString(), browserEngine: 'Chromium',
    viewportCoverage: ['390x844', '1440x1000'],
    clockHandling: 'Browser Date fixed before/after the match. Publication server clock overridden only inside local demo emulators. Firestore emulator deadline expression varied; all other rules unchanged.',
    reports, unexpectedErrors,
  }, null, 2));
  for (const [index, context] of contexts.entries()) {
    await context.tracing.stop({ path: `${output}/trace-${index}.zip` }).catch(() => {});
    await context.close();
  }
  await browser?.close();
  await rulesEnv?.cleanup();
  await deleteApp(app);
}
