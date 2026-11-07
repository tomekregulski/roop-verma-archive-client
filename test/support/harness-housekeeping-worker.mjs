// Inert process/filesystem substitutes only; never imports a database driver/tool.
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { createHarnessVite, runBrowserHarness } from '../browser-harness.mjs';

const require = createRequire(import.meta.url);
const directory = process.env.RVDL_HARNESS_TEMP_ROOT;
const scenario = process.env.RVDL_HARNESS_SCENARIO;
const ports = JSON.parse(process.env.RVDL_HARNESS_PORTS);
const toolRequire = createRequire(process.env.EMBEDDED_POSTGRES_MODULE);
const exitHooks = toolRequire('async-exit-hook');
let inert, stopped;

/** Reports synthetic resource ownership and close ordering to the parent test. */
function record(type, value) {
  process.send({ type, value });
}

/** Stops only this worker's inert child and tolerates the optional exit hook's repeat. */
function stopInert() {
  if (!stopped)
    stopped = (async () => {
      if (!inert || inert.exitCode !== null) return;
      const exited = once(inert, 'exit');
      inert.kill('SIGTERM');
      await exited;
    })();
  return stopped;
}

// Use the actual optional dependency's competing signal/exit machinery, without
// importing embedded-postgres. A regression here exits 130/143 before cleanup.
exitHooks((done) => {
  void stopInert().then(done);
});

try {
  const runtime = await runBrowserHarness({
    ports,
    temporaryRoot: directory,
    loadHooks: async () => exitHooks,
    /** Uses an inert Node child and owned markers, never PostgreSQL. */
    createPostgres: async () => {
      const owned = path.join(directory, 'synthetic-process');
      await mkdir(owned);
      await writeFile(path.join(owned, 'marker'), 'synthetic only');
      inert = spawn(
        process.execPath,
        [
          '-e',
          `
        process.on('SIGTERM', () => process.exit(0));
        setInterval(() => {}, 1000);
        process.stdout.write('ready');
      `,
        ],
        { stdio: ['ignore', 'pipe', 'ignore'] },
      );
      await once(inert.stdout, 'data');
      record('process', inert.pid);
      record('owned', owned);
      return {
        url: 'synthetic-memory-only',
        close: async () => {
          record('closed', 'process');
          try {
            await stopInert();
          } finally {
            await rm(owned, { recursive: true, force: true });
          }
        },
      };
    },
    /** Models resource acquisition with a file and the existing in-memory HTTP double. */
    createDatabase: async () => {
      if (scenario === 'storage-startup-failure')
        throw Error('Synthetic storage startup failure');
      const owned = path.join(directory, 'synthetic-storage');
      await mkdir(owned);
      await writeFile(path.join(owned, 'marker'), 'no database');
      record('owned', owned);
      return {
        db: undefined, // Existing HTTP fixture selects its synthetic in-memory double.
        clear: async () => {},
        close: async () => {
          record('closed', 'storage');
          await rm(owned, { recursive: true, force: true });
        },
      };
    },
    /** Exercises the existing backend/control listener ownership with synthetic state. */
    startFixture: async (options) => {
      const backend =
        await require('../../../roop-verma-archive-server/test/support/browser-fixture.js')(
          options,
        );
      return {
        close: async () => {
          record('closed', 'backend');
          await backend.close();
          if (scenario === 'cleanup-failure')
            throw Error('Synthetic close failure after HTTP cleanup');
        },
      };
    },
    /** Exercises real Vite middleware with launcher-owned temporary cache files. */
    createVite: async (options) => {
      record('owned', options.envDir);
      const vite = await createHarnessVite({
        ...options,
        configFile: false,
        server: { ...options.server, hmr: false },
      });
      return {
        listen: () => vite.listen(),
        close: async () => {
          record('closed', 'vite');
          await vite.close();
        },
      };
    },
  });
  // A real ORM or PostgreSQL module import would invalidate this no-DB check.
  if (
    Object.keys(require.cache).some((name) =>
      /[\\/](?:@prisma[\\/]client|embedded-postgres)[\\/]/.test(name),
    )
  )
    throw Error('Unexpected database module load');
  record('ready', true);
  process.on('message', (message) => {
    if (message === 'close')
      void Promise.all([runtime.close(), runtime.close()]).then(
        () => process.exit(0),
        () => process.exit(1),
      );
  });
} catch {
  record('failed', true);
  process.exit(1);
}
