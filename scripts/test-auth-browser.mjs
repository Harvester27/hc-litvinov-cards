import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect as baseExpect } from '@playwright/test';

const projectId = 'demo-lancers-tipovacka';
const baseURL = 'http://127.0.0.1:3101';
// This runner must be started through npm run test:auth-browser.
// Never create accounts or send verification messages against a real Firebase project.
for (const [key, port] of [['FIREBASE_AUTH_EMULATOR_HOST', 9099], ['FIRESTORE_EMULATOR_HOST', 8080]]) {
  assert.match(process.env[key] ?? '', new RegExp(`^(127\\.0\\.0\\.1|localhost):${port}$`));
}
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const email = `registration-smoke-${Date.now()}@example.test`;
const password = 'DemoRegistrationOnly!2026';
const output = resolve('test-results/auth/resend');
await mkdir(output, { recursive: true });
const env = { ...process.env, NODE_ENV: 'development', GCLOUD_PROJECT: projectId,
  FIREBASE_PROJECT_ID: projectId, NEXT_PUBLIC_FIREBASE_EMULATORS: 'true',
  NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1' };
delete env.FIREBASE_SERVICE_ACCOUNT_JSON;
delete env.GOOGLE_APPLICATION_CREDENTIALS;
const next = spawn(process.execPath, [resolve('node_modules/next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', '3101'], {
  env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
let log = '';
next.stdout.on('data', (data) => { log += data; });
next.stderr.on('data', (data) => { log += data; });
const results = [];
let browser;
let context;
let page;
const expect = baseExpect.configure({ timeout: 30000 });
async function step(name, action) {
  await action();
  results.push({ name, passed: true });
  console.log(`PASS ${name}`);
}
async function oobCodes() {
  const response = await fetch(`http://${authHost}/emulator/v1/projects/${projectId}/oobCodes`);
  assert.equal(response.status, 200);
  return (await response.json()).oobCodes.filter((row) => row.email === email);
}
try {
  const deadline = Date.now() + 150000;
  let ready = false;
  while (Date.now() < deadline) {
    try { if ((await fetch(`${baseURL}/auth`, { signal: AbortSignal.timeout(8000) })).ok) { ready = true; break; } } catch {}
    await new Promise((done) => setTimeout(done, 500));
  }
  assert.ok(ready, 'Next startup timed out');
  console.log('Local Next ready; all auth calls target demo emulator.');
  browser = await chromium.launch({ headless: true,
    ...(!existsSync(chromium.executablePath()) ? { channel: 'msedge' } : {}) });
  context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, locale: 'cs-CZ' });
  page = await context.newPage();
  await page.clock.install();
  const sends = [];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('accounts:sendOobCode')) {
      assert.ok(request.url().startsWith(`http://${authHost}/`));
      sends.push(request);
    }
  });
  const resend = () => page.getByRole('button', { name: 'Odeslat ověřovací e-mail znovu', exact: true });
  const waiting = () => page.getByRole('button', { name: /Další e-mail za \d+ s/ });
  const oobRoute = /accounts:sendOobCode/;
  async function loginUnverified() {
    await page.goto('/auth?next=/games/tipovacka');
    await page.getByLabel('E-mail', { exact: true }).fill(email);
    await page.getByLabel('Heslo', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Přihlásit se', exact: true }).click();
    await expect(page.getByText(/E-mail ještě není potvrzený/)).toBeVisible();
    await expect(page.getByLabel('Heslo', { exact: true })).toHaveValue('');
  }
  async function finishCooldown() {
    await page.clock.fastForward(61000);
    await expect(resend()).toBeEnabled();
  }
  async function screenshot(name) {
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
    const sizes = await page.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(sizes.scroll <= sizes.width + 1, `${name}: horizontal overflow`);
  }
  await step('UI registration creates exactly one VERIFY_EMAIL in Auth emulator', async () => {
    await page.goto('/auth?next=/games/tipovacka');
    await page.getByRole('button', { name: 'Registrace', exact: true }).click();
    await page.getByLabel('E-mail', { exact: true }).fill(email);
    await page.getByLabel('Heslo', { exact: true }).fill(password);
    await page.getByLabel('Heslo znovu', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Vytvořit účet', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Účet je vytvořený.' })).toBeVisible();
    assert.equal(sends.length, 1);
    assert.equal((await sends[0].response()).status(), 200);
    const codes = await oobCodes();
    assert.equal(codes.length, 1);
    assert.equal(codes[0].requestType, 'VERIFY_EMAIL');
    await expect(waiting()).toBeDisabled();
    await screenshot('registration-success-mobile');
  });
  await step('New unverified registration is signed out and cannot enter game', async () => {
    await page.goto('/games/tipovacka');
    await expect(page.getByRole('heading', { name: 'Přihlas se a tipuj s Lancers.' })).toBeVisible();
  });
  await step('Unverified login sends no email and preserves registration cooldown without keeping password', async () => {
    await loginUnverified();
    assert.equal(sends.length, 1);
    assert.equal((await oobCodes()).length, 1);
    await expect(waiting()).toBeDisabled();
    await screenshot('unverified-login-mobile');
  });
  await step('Explicit resend after sign-out sends once; rapid clicks are guarded while pending and in cooldown', async () => {
    await finishCooldown();
    let release;
    const hold = new Promise((done) => { release = done; });
    await page.route(oobRoute, async (route) => { await hold; await route.continue(); }, { times: 1 });
    await resend().evaluate((button) => { button.click(); button.click(); });
    await expect(page.getByRole('button', { name: 'Odesílám…', exact: true })).toBeDisabled();
    await expect.poll(() => sends.length).toBe(2);
    release();
    await expect(waiting()).toBeDisabled();
    await expect.poll(async () => (await oobCodes()).length).toBe(2);
    assert.equal((await sends[1].response()).status(), 200);
    await waiting().evaluate((button) => button.click());
    assert.equal(sends.length, 2);
    await screenshot('resend-success-mobile');
  });
  await step('Reload and another unverified login do not bypass same-account cooldown or send email', async () => {
    await loginUnverified();
    assert.equal(sends.length, 2);
    await expect(waiting()).toBeDisabled();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await screenshot('unverified-login-desktop');
    await page.setViewportSize({ width: 390, height: 844 });
  });
  for (const [failure, expected] of [
    ['TOO_MANY_ATTEMPTS_TRY_LATER', /příliš|pokus|omezen|omezil|limit/i],
    ['QUOTA_EXCEEDED', /limit|kvót/i],
    ['NETWORK', /připojen|připojit|internet|síť/i],
  ]) {
    await step(`Explicit resend handles ${failure} without false success and imposes cooldown`, async () => {
      await finishCooldown();
      const before = sends.length;
      const countBefore = (await oobCodes()).length;
      await page.route(oobRoute, async (route) => {
        if (failure === 'NETWORK') await route.abort('internetdisconnected');
        else await route.fulfill({ status: 400, contentType: 'application/json',
          body: JSON.stringify({ error: { code: 400, message: failure,
            errors: [{ domain: 'global', reason: 'invalid', message: failure }] } }) });
      }, { times: 1 });
      await resend().click();
      await expect(page.getByRole('main').getByRole('alert')).toContainText(expected);
      await expect(waiting()).toBeDisabled();
      assert.equal(sends.length, before + 1);
      assert.equal((await oobCodes()).length, countBefore);
      await screenshot(`error-${failure.toLowerCase()}`);
    });
  }
  await step('Changing email removes prior-account resend context', async () => {
    await page.getByLabel('E-mail', { exact: true }).fill('different-account@example.test');
    await expect(resend()).toHaveCount(0);
    await expect(waiting()).toHaveCount(0);
    await loginUnverified();
  });
  await step('Verification completed elsewhere prevents an unnecessary explicit resend', async () => {
    await finishCooldown();
    const code = (await oobCodes()).at(-1);
    const verified = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-key`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oobCode: code.oobCode }),
    });
    assert.equal(verified.status, 200);
    const before = sends.length;
    await resend().click();
    await expect(page.getByRole('status')).toContainText(/potvrzen|ověřen/i);
    await expect(resend()).toHaveCount(0);
    assert.equal(sends.length, before);
  });
  await step('Generated verification code works and verified login returns to Tipovacka', async () => {
    const before = sends.length;
    await page.goto('/auth?next=/games/tipovacka');
    await page.getByLabel('E-mail', { exact: true }).fill(email);
    await page.getByLabel('Heslo', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Přihlásit se', exact: true }).click();
    await expect(page).toHaveURL(`${baseURL}/games/tipovacka`);
    await expect(page.getByRole('heading', { name: 'Nemáš nastavené jméno do hry.' })).toBeVisible();
    assert.equal(sends.length, before, 'Verified login must not resend verification email');
    await screenshot('verified-login-mobile');
  });
  assert.deepEqual(errors, []);
  console.log('PASS no browser errors; no production accounts or real email used.');
} catch (error) {
  results.push({ passed: false, error: error.stack ?? error.message });
  console.error(error);
  if (page && !page.isClosed()) await page.screenshot({ path: `${output}/failure.png`, fullPage: true });
  process.exitCode = 1;
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify({ projectId, baseURL, runAt: new Date().toISOString(), results }, null, 2));
  await context?.close();
  await browser?.close();
  await writeFile(`${output}/next-server.log`, log);
  if (process.platform === 'win32') {
    const stop = spawn('taskkill', ['/pid', String(next.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    await new Promise((done) => { stop.once('error', done); stop.once('exit', done); });
  } else next.kill('SIGTERM');
}
