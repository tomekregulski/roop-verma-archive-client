const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/util/loginProof.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
function browser(pathname, hash, search = '') {
  const events = new Map();
  const replacements = [];
  const window = {
    location: { pathname, hash, search },
    history: { state: { idx: 2 }, replaceState(state, _title, url) {
      replacements.push({ state, url }); window.location.hash = ''; window.location.search = '';
    } },
    addEventListener(name, callback) {
      if (!events.has(name)) events.set(name, new Set());
      events.get(name).add(callback);
    },
    removeEventListener(name, callback) { events.get(name)?.delete(callback); },
    dispatchEvent(event) { events.get(event.type)?.forEach(callback => callback(event)); },
  };
  const exports = {};
  vm.runInNewContext(source, { window, exports, Event, URLSearchParams });
  return { window, exports, replacements, events };
}
test('email proof is scrubbed before use, router history state survives, proof can be taken once', () => {
  const b = browser('/login-gate', '#token=synthetic-proof', '?legacy=discard');
  b.exports.initializeLoginProof();
  assert.deepEqual(b.replacements, [{ state: { idx: 2 }, url: '/login-gate' }]);
  assert.equal(b.exports.takeLoginProof(), 'synthetic-proof');
  assert.equal(b.exports.takeLoginProof(), null);
});
test('a second link in the same tab is scrubbed and made available without reloading', () => {
  const b = browser('/login-gate', '');
  b.exports.initializeLoginProof();
  b.window.location.hash = '#token=second-synthetic-proof';
  b.window.dispatchEvent(new Event('hashchange'));
  assert.equal(b.window.location.hash, '');
  assert.equal(b.exports.takeLoginProof(), 'second-synthetic-proof');
  assert.equal(b.exports.takeLoginProof(), null);
});
test('unrelated page fragments remain unchanged', () => {
  const b = browser('/library', '#help');
  b.exports.initializeLoginProof();
  assert.equal(b.window.location.hash, '#help');
  assert.equal(b.replacements.length, 0);
  assert.equal(b.exports.takeLoginProof(), null);
});

test('importing the module does not capture a proof or install listeners', () => {
  const b = browser('/login-gate', '#token=synthetic-proof');
  assert.equal(b.window.location.hash, '#token=synthetic-proof');
  assert.equal(b.replacements.length, 0);
  assert.equal(b.events.size, 0);
  assert.equal(b.exports.takeLoginProof(), null);
});

test('repeated initialization preserves the initial proof and sends one notification per new link', () => {
  const b = browser('/login-gate', '#token=synthetic-proof');
  b.exports.initializeLoginProof();
  b.exports.initializeLoginProof();
  assert.equal(b.exports.takeLoginProof(), 'synthetic-proof');
  let notifications = 0;
  b.window.addEventListener(b.exports.LOGIN_PROOF_EVENT, () => { notifications += 1; });
  b.window.location.hash = '#token=second-synthetic-proof';
  b.window.dispatchEvent(new Event('hashchange'));
  assert.equal(notifications, 1);
  assert.equal(b.exports.takeLoginProof(), 'second-synthetic-proof');
});

test('cleanup removes the listener and proof; initialization can start capture again', () => {
  const b = browser('/login-gate', '#token=synthetic-proof');
  const stop = b.exports.initializeLoginProof();
  stop();
  assert.equal(b.exports.takeLoginProof(), null);
  b.window.location.hash = '#token=second-synthetic-proof';
  b.window.dispatchEvent(new Event('hashchange'));
  assert.equal(b.window.location.hash, '#token=second-synthetic-proof');
  assert.equal(b.exports.takeLoginProof(), null);
  const stopAgain = b.exports.initializeLoginProof();
  assert.equal(b.window.location.hash, '');
  assert.equal(b.exports.takeLoginProof(), 'second-synthetic-proof');
  stopAgain();
});
