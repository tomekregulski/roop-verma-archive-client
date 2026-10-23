// Explicit standalone test launcher; does not start the production backend.
import { createRequire } from 'node:module';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

if (process.env.NODE_ENV === 'production') throw new Error('Test harness refuses production');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot = process.env.RVDL_TEST_BACKEND_ROOT || path.resolve(root, '../roop-verma-archive-server');
const require = createRequire(import.meta.url);
const startFixture = require(path.join(backendRoot, 'test/support/browser-fixture.js'));
const backend = await startFixture();
const envDir = await mkdtemp(path.join(tmpdir(), 'rvdl-browser-env-'));
const checks = await readFile(path.join(root, 'test/browser-checks.html'));
const vite = await createServer({ root, envDir, server: { host: '127.0.0.1', port: 3000, strictPort: true },
  define: {
    'import.meta.env.VITE_API_ORIGIN': JSON.stringify('http://127.0.0.1:8090'),
    'import.meta.env.VITE_API_KEY': JSON.stringify('synthetic-public-key'),
    'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': 'undefined',
    'import.meta.env.VITE_RVDL_EMAIL_ADDRESS': JSON.stringify('help@example.invalid'),
  },
  resolve: { alias: { '@stripe/react-stripe-js': path.join(root, 'test/stripe-double.tsx') } },
  plugins: [{ name: 'isolated-browser-checks', configureServer(server) {
    server.middlewares.use('/__identity-checks', (_req, res) => {
      res.setHeader('Content-Type', 'text/html'); res.setHeader('Cache-Control', 'no-store'); res.end(checks);
    });
  } }],
});
await vite.listen();
console.log('Synthetic browser harness: http://127.0.0.1:3000; control UI: http://127.0.0.1:8091');
async function close() { await vite.close(); await backend.close(); await rm(envDir, { recursive: true, force: true }); process.exit(0); }
process.once('SIGINT', close); process.once('SIGTERM', close);
