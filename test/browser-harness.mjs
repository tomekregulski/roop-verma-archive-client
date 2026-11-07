// Explicit standalone test launcher; production code never imports this module.
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer as createHttpServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot =
  process.env.RVDL_TEST_BACKEND_ROOT ||
  path.resolve(root, '../roop-verma-archive-server');
const require = createRequire(import.meta.url);
const signals = ['SIGINT', 'SIGTERM'];

/** Loads only the optional test tool's hook owner, before acquiring resources. */
async function loadExitHooks() {
  const modulePath = process.env.EMBEDDED_POSTGRES_MODULE;
  if (!modulePath || !path.isAbsolute(modulePath))
    throw Error('Set EMBEDDED_POSTGRES_MODULE to the optional test tool');
  await import(pathToFileURL(modulePath).href);
  return createRequire(modulePath)('async-exit-hook');
}

/** Embeds Vite without its standalone signal/stdin handlers exiting ahead of cleanup. */
export async function createHarnessVite(options) {
  const http = createHttpServer();
  const vite = await createServer({
    ...options,
    server: {
      ...options.server,
      middlewareMode: true,
      hmr: options.server.hmr === false ? false : { ...options.server.hmr, server: http },
    },
  });
  http.on('request', vite.middlewares);
  return {
    /** Starts only the loopback listener owned by the harness. */
    listen: () =>
      new Promise((resolve, reject) => {
        http.once('error', reject);
        http.listen(options.server.port, '127.0.0.1', resolve);
      }),

    /** Closes Vite watchers/websockets and the HTTP listener even after a failed listen. */
    close: async () => {
      try {
        await vite.close();
      } finally {
        if (http.listening)
          await new Promise((resolve, reject) => {
            http.close((error) => (error ? reject(error) : resolve()));
          });
      }
    },
  };
}

/** Runs the same lifecycle with injectable synthetic resources for housekeeping checks. */
export async function runBrowserHarness({
  loadHooks = loadExitHooks,
  /** Acquires a new disposable cluster only in the ordinary browser launcher. */
  createPostgres = () =>
    require(path.join(backendRoot, 'test/support/disposable-postgres.js'))(),
  /** Prepares the browser fixture in that launcher-owned cluster. */
  createDatabase = (url) =>
    require(path.join(backendRoot, 'test/support/purchase-postgres.js'))(url),
  /** Mounts the existing fake-provider HTTP fixture. */
  startFixture = (options) =>
    require(path.join(backendRoot, 'test/support/browser-fixture.js'))(options),
  createVite = createHarnessVite,
  temporaryRoot = tmpdir(),
  ports = { ui: 3000, api: 8090, control: 8091 },
} = {}) {
  if (process.env.NODE_ENV === 'production')
    throw Error('Test harness refuses production');
  let backend,
    pg,
    database,
    envDir,
    vite,
    closing,
    startup,
    stopping = false;

  /** Releases every acquired resource once, even if another close fails. */
  function close() {
    if (!closing)
      closing = (async () => {
        const failures = [];
        for (const resource of [vite, backend, database, pg]) {
          try {
            if (resource) await resource.close();
          } catch (error) {
            failures.push(error);
          }
        }
        try {
          if (envDir) await rm(envDir, { recursive: true, force: true });
        } catch (error) {
          failures.push(error);
        }
        for (const signal of signals) process.removeListener(signal, shutdown);
        if (failures.length) throw new AggregateError(failures, 'Harness cleanup failed');
      })();
    return closing;
  }

  /** Waits for acquisition to settle before closing; repeated signals share cleanup. */
  function shutdown() {
    if (stopping) return;
    stopping = true;
    void startup
      .catch(() => {})
      .then(close)
      .then(
        () => process.exit(0),
        () => {
          console.error('Browser harness cleanup failed.');
          process.exit(1);
        },
      );
  }

  const hooks = await loadHooks();
  // The optional tool otherwise stops PostgreSQL and exits concurrently with our
  // ordered cleanup. Its normal-exit hook remains; these signals belong here.
  for (const signal of signals) {
    hooks.unhookEvent(signal);
    process.on(signal, shutdown);
  }
  startup = (async () => {
    pg = await createPostgres();
    database = await createDatabase(pg.url);
    backend = await startFixture({
      db: database.db,
      clearDatabase: database.clear,
      apiPort: ports.api,
      controlPort: ports.control,
    });
    envDir = await mkdtemp(path.join(temporaryRoot, 'rvdl-browser-env-'));
    const checks = await readFile(path.join(root, 'test/browser-checks.html'));
    const purchase = await readFile(path.join(root, 'test/purchase-browser.html'));
    vite = await createVite({
      root,
      envDir,
      cacheDir: path.join(envDir, 'vite-cache'),
      resolve: { alias: { 'emailjs-com': path.join(root, 'test/support-mail.ts') } },
      server: { host: '127.0.0.1', port: ports.ui, strictPort: true },
      define: {
        'import.meta.env.VITE_API_ORIGIN': JSON.stringify(
          `http://127.0.0.1:${ports.api}`,
        ),
        'import.meta.env.VITE_API_KEY': JSON.stringify('synthetic-public-key'),
        'import.meta.env.VITE_RVDL_EMAIL_ADDRESS': JSON.stringify('help@example.invalid'),
      },
      plugins: [
        {
          name: 'isolated-browser-checks',
          /** Serves fixture pages while keeping normal builds free of test controls. */
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
  })();
  try {
    await startup;
    if (!stopping)
      console.log(
        `Synthetic PostgreSQL normal-route harness: http://127.0.0.1:${ports.ui}; control UI: http://127.0.0.1:${ports.control}`,
      );
    return { close };
  } catch (error) {
    await close();
    throw error;
  }
}

// Importing lifecycle helpers is inert: tests never start a database by importing.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runBrowserHarness().catch(() => {
    console.error(
      'Browser harness startup/cleanup failed. Check local prerequisites/ports.',
    );
    process.exit(1);
  });
}
