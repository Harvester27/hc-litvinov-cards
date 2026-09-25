import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Invoke inside Firebase's emulator lifecycle:
// firebase emulators:exec --only auth,firestore --project demo-lancers-tipovacka "node scripts/test-browser.mjs"
for (const key of ['FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST']) {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env[key] ?? '')) {
    throw new Error(`${key} must point to a local emulator. Use Firebase emulators:exec.`);
  }
}
if (process.env.FIRESTORE_EMULATOR_HOST.split(':')[1] !== '8080'
  || process.env.FIREBASE_AUTH_EMULATOR_HOST.split(':')[1] !== '9099') {
  throw new Error('The browser client uses local emulator ports 8080 and 9099.');
}
const env = { ...process.env, NODE_ENV: 'development', GCLOUD_PROJECT: 'demo-lancers-tipovacka',
  FIREBASE_PROJECT_ID: 'demo-lancers-tipovacka', NEXT_PUBLIC_FIREBASE_EMULATORS: 'true',
  NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1',
  TIPOVACKA_EMULATOR_NOW: '2026-09-26T20:00:00.000Z',
  TIPOVACKA_E2E_BASE_URL: 'http://127.0.0.1:3101' };
delete env.FIREBASE_SERVICE_ACCOUNT_JSON;
delete env.GOOGLE_APPLICATION_CREDENTIALS;
await mkdir('test-results/tipovacka', { recursive: true });
let serverLog = '';
const server = spawn(process.execPath, [resolve('node_modules/next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', '--port', '3101'], {
  env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
server.stdout.on('data', (data) => { serverLog += data; });
server.stderr.on('data', (data) => { serverLog += data; });
const serverFailure = new Promise((_, reject) => {
  server.once('error', reject);
  server.once('exit', (code) => reject(new Error(`Next exited before readiness (${code}).\n${serverLog.slice(-5000)}`)));
});
async function ready() {
  const deadline = Date.now() + 150_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${env.TIPOVACKA_E2E_BASE_URL}/games/tipovacka`, { signal: AbortSignal.timeout(8000) });
      if (response.ok) return;
    } catch { /* Next is still starting or compiling. */ }
    await new Promise((resolveWait) => setTimeout(resolveWait, 700));
  }
  throw new Error(`Next did not become ready.\n${serverLog.slice(-5000)}`);
}
try {
  await Promise.race([ready(), serverFailure]);
  console.log('Browser E2E: Next is ready on 127.0.0.1:3101; isolated Firebase demo emulators only.');
  const browserTest = spawn(process.execPath, ['tests/tipovacka.e2e.mjs'], { env, stdio: 'inherit', windowsHide: true });
  process.exitCode = await new Promise((resolveExit, reject) => {
    browserTest.once('error', reject);
    browserTest.once('exit', (code) => resolveExit(code ?? 1));
  });
} finally {
  await writeFile('test-results/tipovacka/next-server.log', serverLog);
  server.removeAllListeners('exit');
  if (process.platform === 'win32') {
    // Terminate only this runner's process tree, including Next's dev worker.
    const stop = spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    await new Promise((resolveStop) => { stop.once('error', resolveStop); stop.once('exit', resolveStop); });
  } else server.kill('SIGTERM');
}
