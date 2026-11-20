// Explicit local provider test. Production code never imports this launcher.
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

import { createHarnessVite } from './browser-harness.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverRoot = path.resolve(root, '../roop-verma-archive-server');
const require = createRequire(import.meta.url);
const { accountId, bucket, key, readCredentials } = require(path.join(
  serverRoot,
  'test/support/r2-sample',
));

/** Starts one explicit approved object with real R2 and synthetic local identity. */
export async function runProviderHarness(credentialsFile, pilotFile) {
  if (
    process.env.NODE_ENV === 'production' ||
    !credentialsFile ||
    !path.isAbsolute(credentialsFile)
  )
    throw Error('Explicit local provider credentials file required');
  const credentials = readCredentials(credentialsFile);
  let pilot;
  if (pilotFile) {
    if (!path.isAbsolute(pilotFile)) throw Error('Absolute private pilot file required');
    pilot = JSON.parse(await readFile(pilotFile, 'utf8'));
    if (!path.isAbsolute(pilot.manifestFile) || !path.isAbsolute(pilot.catalogTrackFile))
      throw Error('Absolute private manifest and catalog snapshot required');
  }
  const directory = await mkdtemp(path.join(tmpdir(), 'rvdl-r2-provider-'));
  let backend, vite, closing;

  /** Releases only this fixture's listeners and temporary manifest/cache. */
  function close() {
    if (!closing)
      closing = (async () => {
        try {
          if (vite) await vite.close();
        } finally {
          try {
            if (backend) await backend.close();
          } finally {
            await rm(directory, { recursive: true, force: true });
          }
        }
      })();
    return closing;
  }

  try {
    const manifest = pilot?.manifestFile || path.join(directory, 'assets.json');
    if (!pilot)
      await writeFile(manifest, JSON.stringify([{ trackId: 10, key }]), { mode: 0o600 });
    const catalogTrack = pilot
      ? JSON.parse(await readFile(pilot.catalogTrackFile, 'utf8'))
      : undefined;
    if (pilot) {
      const assets = require(path.join(serverRoot, 'playback/assets')).readAssets(manifest);
      if (assets.size !== 1 || !assets.has(catalogTrack.id))
        throw Error('Pilot must map exactly the selected catalog Track.id');
    }
    const delivery = require(path.join(serverRoot, 'playback/r2')).createR2Delivery({
      PLAYBACK_ASSETS_FILE: manifest,
      PLAYBACK_R2_ACCOUNT_ID: pilot?.accountId || accountId,
      PLAYBACK_R2_BUCKET: pilot?.bucket || bucket,
      PLAYBACK_R2_ACCESS_KEY_ID: credentials.accessKeyId,
      PLAYBACK_R2_SECRET_ACCESS_KEY: credentials.secretAccessKey,
    });
    backend = await require(path.join(serverRoot, 'test/support/provider-playback'))({
      delivery,
      catalogTrack,
    });
    vite = await createHarnessVite({
      root,
      configFile: false,
      envDir: directory,
      cacheDir: path.join(directory, 'vite-cache'),
      plugins: [
        react({ jsxImportSource: '@emotion/react' }),
        svgr(),
        {
          name: 'isolated-r2-controls',
          /** Mounts fixed fixture controls only in this explicit loopback launcher. */
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              if (new URL(req.url, 'http://fixture.invalid').pathname !== '/__sample')
                return next();
              void backend
                .control(req, res)
                .catch(() => res.writeHead(500).end('Local fixture failed'));
            });
          },
        },
      ],
      server: {
        host: '127.0.0.1',
        port: 3180,
        strictPort: true,
        hmr: { host: '127.0.0.1' },
      },
      define: {
        'import.meta.env.VITE_API_ORIGIN': JSON.stringify(backend.fixture.origin),
        'import.meta.env.VITE_API_KEY': JSON.stringify('synthetic-public-key'),
      },
    });
    await vite.listen();
    return { close };
  } catch (error) {
    await close();
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runProviderHarness(process.argv[2], process.argv[3])
    .then((harness) => {
      console.log(
        'Private sample test ready: http://127.0.0.1:3180/test/r2-provider.html',
      );
      let stopping = false;
      /** Performs ordered cleanup once without printing provider details. */
      function stop() {
        if (stopping) return;
        stopping = true;
        void harness.close().then(
          () => process.exit(0),
          () => process.exit(1),
        );
      }
      process.on('SIGINT', stop);
      process.on('SIGTERM', stop);
    })
    .catch(() => {
      console.error(
        'Provider fixture failed. Check local credentials, dependencies and loopback ports.',
      );
      process.exitCode = 1;
    });
}
