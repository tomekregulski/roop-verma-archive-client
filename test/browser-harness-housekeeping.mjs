import assert from 'node:assert/strict';
import { fork, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = fileURLToPath(new URL('.', import.meta.url));

/** Reserves a fresh loopback port without contacting any outside host. */
async function listener(port = 0) {
  const server = net.createServer((socket) => socket.end());
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}

/** Releases a listener before reuse or test teardown. */
function close(server) {
  return new Promise((resolve) => server.close(resolve));
}

/** Chooses nonfixed ports while retaining the deliberate collision listener. */
async function portsFor(scenario) {
  const reservations = [];
  try {
    for (let index = 0; index < 3; index++) reservations.push(await listener());
    const ports = Object.fromEntries(
      ['api', 'control', 'ui'].map((key, index) => [
        key,
        reservations[index].address().port,
      ]),
    );
    const collision =
      scenario === 'control-startup-failure'
        ? 1
        : scenario === 'vite-startup-failure'
        ? 2
        : -1;
    await Promise.all(reservations.filter((_, index) => index !== collision).map(close));
    return { ports, held: reservations[collision] };
  } catch (error) {
    await Promise.all(reservations.filter((server) => server.listening).map(close));
    throw error;
  }
}

/** Confirms that cleanup stopped exactly the synthetic process owned by this test. */
function exited(pid) {
  try {
    process.kill(pid, 0);
    return false;
  } catch (error) {
    if (error.code === 'ESRCH') return true;
    throw error;
  }
}

/** Makes a real idle keep-alive connection that normal HTTP shutdown must release. */
function request(port, agent) {
  return new Promise((resolve, reject) => {
    http
      .get(
        { host: '127.0.0.1', port, path: '/api/v1/auth/session', agent },
        (response) => {
          response.resume();
          response.on('end', resolve);
        },
      )
      .on('error', reject);
  });
}

/** Exercises the normal launcher lifecycle with real HTTP/Vite and inert storage/process resources. */
async function lifecycle(scenario, signal) {
  assert.ok(
    process.env.EMBEDDED_POSTGRES_MODULE,
    'Locate the existing optional exit-hook dependency; no PostgreSQL is loaded',
  );
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), 'rvdl-harness-housekeeping-'),
  );
  const sibling = path.join(directory, 'preserve');
  const events = [];
  const agent = new http.Agent({ keepAlive: true });
  let held, worker, timer;
  try {
    await fs.writeFile(sibling, 'unrelated marker');
    const reservation = await portsFor(scenario);
    const ports = reservation.ports;
    held = reservation.held;
    worker = fork(
      path.join(testDirectory, 'support/harness-housekeeping-worker.mjs'),
      [],
      {
        cwd: path.resolve(testDirectory, '..'),
        env: {
          PATH: process.env.PATH,
          TMPDIR: process.env.TMPDIR,
          EMBEDDED_POSTGRES_MODULE: process.env.EMBEDDED_POSTGRES_MODULE,
          RVDL_HARNESS_TEMP_ROOT: directory,
          RVDL_HARNESS_SCENARIO: scenario,
          RVDL_HARNESS_PORTS: JSON.stringify(ports),
          NODE_ENV: 'test',
        },
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      },
    );
    let output = '';
    worker.stdout.on('data', (chunk) => {
      output += chunk;
    });
    worker.stderr.on('data', (chunk) => {
      output += chunk;
    });
    const completion = new Promise((resolve, reject) => {
      worker.once('error', reject);
      worker.once('exit', (code, received) => resolve({ code, received }));
    });
    const ready = new Promise((resolve) => {
      worker.on('message', (message) => {
        events.push(message);
        if (message.type === 'ready') resolve(true);
      });
      worker.once('exit', () => resolve(false));
    });
    timer = setTimeout(() => {
      worker.kill('SIGKILL');
    }, 20000);
    const started = await ready;
    const normal = scenario === 'normal' || scenario === 'cleanup-failure';
    assert.equal(started, normal, output);
    if (normal) {
      await request(ports.api, agent);
      if (signal) {
        worker.kill(signal);
        worker.kill(signal);
      } else worker.send('close');
    }
    const result = await completion;
    assert.deepEqual(
      result,
      { code: scenario === 'normal' ? 0 : 1, received: null },
      output,
    );
    assert.equal(
      exited(events.find((event) => event.type === 'process').value),
      true,
      'inert child must exit before harness',
    );
    for (const event of events.filter((event) => event.type === 'owned'))
      await assert.rejects(
        fs.stat(event.value),
        { code: 'ENOENT' },
        event.value + ' must be removed',
      );
    assert.deepEqual(
      await fs.readdir(directory),
      ['preserve'],
      'no unowned or generated paths may be removed/left behind',
    );
    const order = events
      .filter((event) => event.type === 'closed')
      .map((event) => event.value);
    assert.deepEqual(
      order,
      scenario === 'storage-startup-failure'
        ? ['process']
        : scenario === 'control-startup-failure'
        ? ['storage', 'process']
        : ['vite', 'backend', 'storage', 'process'],
    );
    for (const key of ['api', 'control', 'ui']) {
      if (held && ports[key] === held.address().port) continue;
      const reusable = await listener(ports[key]);
      await close(reusable);
    }
    assert.equal(await fs.readFile(sibling, 'utf8'), 'unrelated marker');
  } finally {
    clearTimeout(timer);
    agent.destroy();
    if (worker && worker.exitCode === null && worker.signalCode === null)
      worker.kill('SIGKILL');
    const pid = events.find((event) => event.type === 'process')?.value;
    if (pid && !exited(pid)) process.kill(pid, 'SIGTERM');
    if (held) await close(held);
    await fs.rm(directory, { recursive: true, force: true });
  }
}

for (const signal of ['SIGINT', 'SIGTERM'])
  test(
    'normal ' +
      signal +
      ' releases listeners, inert process and temporary files before exit',
    { timeout: 25000 },
    () => lifecycle('normal', signal),
  );

test('repeated explicit close shares one ordered cleanup', { timeout: 25000 }, () =>
  lifecycle('normal'),
);

for (const scenario of [
  'storage-startup-failure',
  'control-startup-failure',
  'vite-startup-failure',
  'cleanup-failure',
])
  test(
    scenario + ' releases all acquired resources and preserves exit failure',
    { timeout: 25000 },
    () => lifecycle(scenario, scenario === 'cleanup-failure' ? 'SIGTERM' : undefined),
  );

for (const mode of ['wrong-init', 'wrong-send', 'both-wrong', 'missing-send', 'fake'])
  test('offline support entry guard: ' + mode, () => {
    const result = spawnSync(
      process.execPath,
      ['--experimental-vm-modules', 'test/support/mail-guard-worker.mjs', mode],
      {
        cwd: path.resolve(testDirectory, '..'),
        encoding: 'utf8',
        env: { PATH: process.env.PATH, TMPDIR: process.env.TMPDIR, NODE_ENV: 'test' },
        timeout: 10000,
      },
    );
    assert.equal(result.status, 0, result.stderr);
  });
