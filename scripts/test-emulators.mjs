import { spawnSync } from 'node:child_process';

const projectId = 'demo-lancers-tipovacka';
for (const key of ['FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST']) {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env[key] ?? '')) {
    throw new Error(`${key} must point to a local emulator. Run npm run test:emulators.`);
  }
}
// Run serially: suites clear their isolated demo databases between scenarios.
const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1',
  'tests/firestore.rules.test.mjs', 'tests/tipovacka-api.integration.test.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'test', GCLOUD_PROJECT: projectId, FIREBASE_PROJECT_ID: projectId },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
