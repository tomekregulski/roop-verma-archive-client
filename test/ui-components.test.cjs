const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Isolate visual tooltip/icon dependencies; keep React elements and component handlers real.
function loadComponent(file) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require(name) {
      if (name === 'antd') return { Tooltip: ({ children }) => children };
      if (name === '@radix-ui/react-icons')
        return { QuestionMarkCircledIcon: () => null };
      if (name === 'react') return { ...React, useId: () => 'test-disabled-reason' };
      return require(name);
    },
  });
  return exports;
}
const { Button } = loadComponent('src/components/Button/Button.tsx');
const { Input } = loadComponent('src/components/Input/Input.tsx');
const { Form } = loadComponent('src/components/Form/Form.tsx');
function findElement(element, tag) {
  if (!React.isValidElement(element)) return;
  if (element.type === tag) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const found = findElement(child, tag);
    if (found) return found;
  }
}
function event() {
  return {
    prevented: false,
    stopped: false,
    preventDefault() {
      this.prevented = true;
    },
    stopPropagation() {
      this.stopped = true;
    },
  };
}

test('an aria-disabled submit action blocks its callback, native submission and bubbling', () => {
  let calls = 0;
  const tree = Button({
    name: 'Submit',
    type: 'submit',
    isDisabledMessage: 'Please wait',
    callback: () => calls++,
  });
  const button = findElement(tree, 'button');
  const click = event();
  button.props.onClick(click);
  assert.equal(button.props['aria-disabled'], true);
  assert.equal(button.props.disabled, undefined);
  assert.notEqual(button.props.tabIndex, -1);
  assert.equal(calls, 0);
  assert.equal(click.prevented, true);
  assert.equal(click.stopped, true);
});

test('disabled reasons block actions and are associated with the button', () => {
  let calls = 0;
  const tree = Button({
    name: 'Submit',
    isDisabledMessage: 'Wait for setup',
    callback: () => calls++,
  });
  const button = findElement(tree, 'button');
  button.props.onClick(event());
  const markup = renderToStaticMarkup(tree);
  assert.equal(calls, 0);
  assert.equal(button.props['aria-describedby'], 'test-disabled-reason');
  assert.match(markup, /id="test-disabled-reason" class="sr-only">Wait for setup/);
});

test('enabled actions preserve callbacks, native attributes and an existing description', () => {
  let received;
  const tree = Button({
    name: 'Continue',
    id: 'continue-button',
    form: 'signup',
    'aria-describedby': 'instructions',
    callback: (value) => {
      received = value;
    },
  });
  const button = findElement(tree, 'button');
  const click = event();
  button.props.onClick(click);
  assert.equal(received, click);
  assert.equal(click.prevented, false);
  assert.equal(button.props.type, 'button');
  assert.equal(button.props.id, 'continue-button');
  assert.equal(button.props.form, 'signup');
  assert.equal(button.props['aria-describedby'], 'instructions');
  assert.equal(button.props['aria-disabled'], undefined);
});

test('disabled explanation supplements rather than replaces an existing description', () => {
  const button = findElement(
    Button({
      name: 'Submit',
      'aria-describedby': 'instructions',
      isDisabledMessage: 'Please wait',
    }),
    'button',
  );
  assert.equal(button.props['aria-describedby'], 'instructions test-disabled-reason');
});

test('form submission remains blocked even when the submit button is bypassed', () => {
  let calls = 0;
  const form = Form({ isSubmitDisabled: true, handleSubmit: () => calls++ });
  const submit = event();
  form.props.onSubmit(submit);
  assert.equal(calls, 0);
  assert.equal(submit.prevented, true);
});

test('enabled forms pass the event and preserve their native attributes', () => {
  let received;
  const form = Form({
    id: 'signup',
    'aria-busy': false,
    handleSubmit: (value) => {
      received = value;
    },
  });
  const submit = event();
  form.props.onSubmit(submit);
  assert.equal(received, submit);
  assert.equal(submit.prevented, true);
  assert.equal(form.props.id, 'signup');
  assert.equal(form.props['aria-busy'], false);
});

test('inputs retain native constraints and correctly associate labels with IDs', () => {
  let received;
  const tree = Input({
    id: 'signup-email',
    name: 'email',
    label: 'Email address',
    type: 'email',
    value: '',
    required: true,
    maxLength: 254,
    callback: (...args) => {
      received = args;
    },
  });
  const input = findElement(tree, 'input');
  const label = findElement(tree, 'label');
  assert.equal(label.props.htmlFor, input.props.id);
  assert.equal(input.props.name, 'email');
  assert.equal(input.props.type, 'email');
  assert.equal(input.props.required, true);
  assert.equal(input.props.maxLength, 254);
  assert.equal(input.props.disabled, undefined);
  assert.equal(input.props.readOnly, false);
  assert.equal(input.props['aria-disabled'], undefined);
  const change = { target: { value: 'a@example.invalid' } };
  input.props.onChange(change);
  assert.equal(received[0], change);
  assert.equal(received[1], 'signup-email');
  assert.match(renderToStaticMarkup(tree), /for="signup-email"/);
});

test('unavailable inputs stay focusable, explain their state and block edits', () => {
  let calls = 0;
  const tree = Input({
    id: 'busy-email',
    name: 'email',
    label: 'Email address',
    type: 'email',
    value: 'a@example.invalid',
    isDisabledMessage: 'A login request is in progress. Please wait.',
    'aria-describedby': 'email-guidance',
    callback: () => calls++,
  });
  const input = findElement(tree, 'input');
  assert.equal(input.props.disabled, undefined);
  assert.notEqual(input.props.tabIndex, -1);
  assert.equal(input.props.readOnly, true);
  assert.equal(input.props['aria-disabled'], true);
  assert.equal(input.props['aria-describedby'], 'email-guidance test-disabled-reason');
  input.props.onChange({ target: { value: 'changed@example.invalid' } });
  assert.equal(calls, 0);
  assert.match(
    renderToStaticMarkup(tree),
    /class="sr-only">A login request is in progress/,
  );
});
