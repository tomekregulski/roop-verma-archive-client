// Explicit standalone test launcher; does not start the production backend.
import { createRequire } from 'node:module';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

if (process.env.NODE_ENV === 'production')
  throw new Error('Test harness refuses production');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot =
  process.env.RVDL_TEST_BACKEND_ROOT ||
  path.resolve(root, '../roop-verma-archive-server');
const require = createRequire(import.meta.url);
const startFixture = require(path.join(backendRoot, 'test/support/browser-fixture.js'));
let backend, pg, database, envDir, vite;
async function close() {
  try {
    if (vite) await vite.close();
  } finally {
    try {
      if (backend) await backend.close();
    } finally {
      try {
        if (database) await database.close();
      } finally {
        try {
          if (pg) await pg.close();
        } finally {
          if (envDir) await rm(envDir, { recursive: true, force: true });
        }
      }
    }
  }
}
try {
  pg = await require(path.join(backendRoot, 'test/support/disposable-postgres.js'))();
  database = await require(path.join(backendRoot, 'test/support/purchase-postgres.js'))(
    pg.url,
  );
  backend = await startFixture({ db: database.db, clearDatabase: database.clear });
  envDir = await mkdtemp(path.join(tmpdir(), 'rvdl-browser-env-'));
  const checks = await readFile(path.join(root, 'test/browser-checks.html'));
  const purchase = await readFile(path.join(root, 'test/purchase-browser.html'));
  vite = await createServer({
    root,
    envDir,
    server: { host: '127.0.0.1', port: 3000, strictPort: true },
    define: {
      'import.meta.env.VITE_API_ORIGIN': JSON.stringify('http://127.0.0.1:8090'),
      'import.meta.env.VITE_API_KEY': JSON.stringify('synthetic-public-key'),
      'import.meta.env.VITE_RVDL_EMAIL_ADDRESS': JSON.stringify('help@example.invalid'),
    },
    plugins: [
      {
        name: 'isolated-browser-checks',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = new URL(req.url, 'http://fixture.invalid').pathname;
            const content =
              pathname === '/__identity-checks'
                ? checks
                : [
                    '/',
                    '/signup',
                    '/manage-account',
                    '/owner/deletions',
                    '/login-gate',
                    '/complete-registration',
                    '/library',
                  ].includes(pathname)
                ? purchase
                : null;
            if (!content) return next();
            try {
              const html = await server.transformIndexHtml(pathname, String(content));
              res.setHeader('Content-Type', 'text/html');
              res.setHeader('Cache-Control', 'no-store');
              res.end(html);
            } catch (error) {
              next(error);
            }
          });
        },
      },
    ],
  });
  await vite.listen();
  console.log(
    `Synthetic PostgreSQL normal-route harness: http://127.0.0.1:3000; control UI: http://127.0.0.1:8091`,
  );
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.once(signal, () => {
      void close().then(() => process.exit(0));
    });
} catch {
  await close();
  console.error(
    'Browser harness startup failed; temporary services cleaned up. Check local prerequisites/ports.',
  );
  process.exit(1);
}
