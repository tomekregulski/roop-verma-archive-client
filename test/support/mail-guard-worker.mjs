// Evaluate the actual browser test entry offline; all imports are inert doubles.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import ts from 'typescript';

/** Compiles existing test TypeScript without executing its imports or any app code. */
function source(file) {
  return ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

/** Checks entry-point refusal before rendering, API setup or any mail attempt. */
async function verify(mode) {
  const effects = { render: 0, adapter: 0, provider: 0 };
  const context = vm.createContext({ document: { getElementById: () => ({}) } });
  const fake = new vm.SourceTextModule(source('test/support-mail.ts'), { context });
  await fake.link(() => {
    throw Error('Fake mail must have no imports');
  });
  await fake.evaluate();
  /** Supplies a distinct initializer without importing a real mail SDK. */
  const inert = () => {};

  /** Counts forbidden sending attempts without exposing any network capability. */
  const provider = () => {
    effects.provider++;
    throw Error('Forbidden synthetic provider attempt');
  };
  const selectedInit =
    mode === 'wrong-init' || mode === 'both-wrong' ? inert : fake.namespace.init;
  const selectedSend =
    mode === 'wrong-send' || mode === 'both-wrong'
      ? provider
      : mode === 'missing-send'
      ? undefined
      : fake.namespace.sendForm;
  const defaults = {};
  Object.defineProperty(defaults, 'adapter', {
    set() {
      effects.adapter++;
    },
  });
  const exports = {
    'emailjs-com': { init: selectedInit, sendForm: selectedSend },
    './support-mail': {
      init: fake.namespace.init,
      sendForm: fake.namespace.sendForm,
      supportMail: fake.namespace.supportMail,
    },
    axios: { AxiosError: class {} },
    react: { StrictMode: inert, useState: inert },
    'react/jsx-runtime': { jsx: inert, jsxs: inert },
    'react-dom/client': {
      /** Stops the positive control immediately after the guard admits fake wiring. */
      createRoot() {
        effects.render++;
        throw Error('RENDER_REACHED');
      },
    },
    'react-router-dom': { BrowserRouter: inert },
    '../src/api/client': { api: { defaults } },
    '../src/components/SupportForm/SupportForm': { SupportForm: inert },
    '../src/context/AuthContext': { AuthProvider: inert, useAuthContext: inert },
    '../src/views/CompleteRegistration': { CompleteRegistration: inert },
    '../src/views/ManageAccount': { ManageAccount: inert },
    '../src/views/OwnerDeletions': { OwnerDeletions: inert },
  };
  const entry = new vm.SourceTextModule(source('test/purchase-ui-browser.tsx'), {
    context,
  });
  await entry.link((name) => {
    if (!Object.hasOwn(exports, name)) throw Error('Unexpected test import: ' + name);
    const values = exports[name];
    return new vm.SyntheticModule(
      Object.keys(values),
      /** Supplies only the explicitly allowed inert module exports. */
      function provide() {
        for (const [key, value] of Object.entries(values)) this.setExport(key, value);
      },
      { context },
    );
  });
  await assert.rejects(
    entry.evaluate(),
    mode === 'fake' ? /RENDER_REACHED/ : /require the fake-mail browser harness/,
  );
  assert.equal(effects.provider, 0);
  assert.equal(fake.namespace.supportMail.length, 0);
  assert.equal(effects.render, mode === 'fake' ? 1 : 0);
  assert.equal(effects.adapter, mode === 'fake' ? 1 : 0);
  // fetch, XMLHttpRequest, sockets and real SDK imports never enter this VM.
}

verify(process.argv[2])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
