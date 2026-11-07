// Focused component/race checks, separate from the real HTTP/PostgreSQL journey.
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { init as initializeMail, sendForm as sendSupportForm } from 'emailjs-com';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import type { PurchaseAction } from '../src/api/billing';
import { api } from '../src/api/client';
import type { DeletionReview } from '../src/api/ownerDeletions';
import { SupportForm } from '../src/components/SupportForm/SupportForm';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import { CompleteRegistration } from '../src/views/CompleteRegistration';
import { ManageAccount } from '../src/views/ManageAccount';
import { OwnerDeletions } from '../src/views/OwnerDeletions';
import {
  init as fakeMailInit,
  sendForm as fakeSendForm,
  supportMail,
} from './support-mail';

// Refuse autorun under ordinary Vite or before an isolated harness restart.
if (initializeMail !== fakeMailInit || sendSupportForm !== fakeSendForm)
  throw Error('These checks require the fake-mail browser harness');

let signedIn = true,
  userId = 1,
  isAdmin = false;
let action: PurchaseAction = { action: 'purchase', reason: 'ready' };
let failLookup = false,
  failConfirm = false,
  failOwnerList = false;
const calls: InternalAxiosRequestConfig[] = [];
const redirects: string[] = [];

/** Records hosted navigation without leaving the regression page. */
const redirect = (url: string) => {
  redirects.push(url);
};
type Pending = {
  config: InternalAxiosRequestConfig;
  resolve: (response: AxiosResponse) => void;
  reject: (error: unknown) => void;
};
const pending: Pending[] = [];

/** Creates a synthetic Axios response for a recorded request. */
const response = (config: InternalAxiosRequestConfig, data: unknown): AxiosResponse => ({
  config,
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
});

/** Creates a synthetic Axios failure without contacting a provider. */
const failure = (config: InternalAxiosRequestConfig, status: number) =>
  new AxiosError('synthetic request failure', undefined, config, undefined, {
    ...response(config, {}),
    status,
  });
api.defaults.adapter = async (config) => {
  calls.push(config);
  if (config.url === '/auth/logout') {
    signedIn = false;
    return response(config, {});
  }
  if (config.url === '/auth/session') {
    if (!signedIn) throw failure(config, 401);
    return response(config, {
      user: {
        id: userId,
        firstName: 'UI',
        lastName: 'Test',
        email: 'ui@example.invalid',
        stripeId: null,
        subscriptionActive: 'active',
        isAdmin,
      },
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });
  }
  if (config.url?.includes('/payment/checkout-session-object/')) {
    if (failConfirm) throw failure(config, 503);
    return response(config, { action: 'manage', reason: 'purchase_confirmed' });
  }
  if (config.url?.includes('/payment/account/')) {
    if (failLookup) throw failure(config, 503);
    return response(config, action);
  }
  if (config.url?.includes('/user/owner/deletions/') && config.method === 'get') {
    if (config.url?.includes('/1/')) return response(config, ownerReview);
    if (failOwnerList) throw failure(config, 503);
    return response(config, { requests: [ownerReview.account] });
  }
  return new Promise((resolve, reject) => pending.push({ config, resolve, reject }));
};
const ownerReview: DeletionReview = {
  account: {
    id: 1,
    email: 'buyer@example.invalid',
    requestedAt: new Date().toISOString(),
  },
  binding: null,
  attempts: [],
  customers: [],
  subscriptions: [],
  blockers: [],
  checklist: [
    'Check exact Stripe mode, all attempts, subscriptions, schedules and invoices.',
  ],
  review: 'a'.repeat(64),
};
let auth: ReturnType<typeof useAuthContext>, choose: (value: string) => void;

/** Mounts the selected screen against the shared synthetic auth context. */
function Harness() {
  auth = useAuthContext();
  const [view, setView] = useState('account');
  choose = setView;
  return view === 'account' ? (
    <ManageAccount redirect={redirect} />
  ) : view === 'support' ? (
    <SupportForm />
  ) : view === 'owner' ? (
    <OwnerDeletions />
  ) : view === 'return' ? (
    <CompleteRegistration redirect={redirect} />
  ) : null;
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Harness />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

/** Yields to React while synthetic requests settle. */
const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

/** Waits for observable UI state and fails if the fixture does not converge. */
async function until(check: () => boolean) {
  for (let i = 0; i < 150; i++) {
    if (check()) return;
    await wait();
  }
  throw Error('Timed out waiting for purchase UI');
}

/** Finds a rendered action by its visible label. */
const button = (name: string) =>
  Array.from(document.querySelectorAll('button')).find((el) => el.textContent === name);
const lines: string[] = [];

/** Records a passing assertion or stops the regression page. */
function check(value: unknown, name: string) {
  if (!value) throw Error(name);
  lines.push('PASS ' + name);
}

/** Requests an account refresh and waits for controls to become available. */
async function refresh() {
  const before = calls.length;
  button('Refresh account')!.click();
  await until(() => calls.length > before);
  await wait();
  await until(() => button('Refresh account')?.getAttribute('aria-disabled') !== 'true');
}

/** Completes the latest held purchase request with a synthetic hosted URL. */
function resolvePurchase(url = 'https://checkout.stripe.com/c/pay/cs_test_ui') {
  const request = pending.at(-1)!;
  request.resolve(
    response(request.config, { action: 'pending', reason: 'checkout_open', url }),
  );
}
/** Changes a controlled input through React's native input event path. */
function fillInput(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
    input,
    value,
  );
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Opens the exact support account without a request queue. */
async function openReview() {
  fillInput(document.querySelector('input')!, '1');
  await wait();
  button('Open account review')!.click();
}

/** Selects Dashboard closure separately from the support ownership attestation. */
function closureCheckbox() {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
  ).find((input) => input.parentElement?.textContent?.includes('I rechecked'))!;
}

try {
  await until(() => Boolean(button('Continue to Checkout')));
  check(
    auth!.userData?.stripeId === null && Boolean(button('Continue to Checkout')),
    'verified customer-null account can purchase',
  );
  check(
    Boolean(button('Continue to Checkout')),
    'server action overrides legacy display-status policy',
  );
  const start = button('Continue to Checkout')!;
  start.click();
  start.click();
  await until(() => pending.length === 1);
  await until(() => start.getAttribute('aria-disabled') === 'true');
  start.focus();
  check(
    pending.length === 1,
    'rapid repeated clicks share one in-flight browser request',
  );
  check(
    document.activeElement === start && Boolean(start.getAttribute('aria-describedby')),
    'busy action stays focusable with an accessible explanation',
  );
  pending.at(-1)!.reject(failure(pending.at(-1)!.config, 503));
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  check(
    document
      .querySelector('[role="alert"]')
      ?.textContent?.includes('may already have started') &&
      !document.body.textContent?.includes('no new purchase has been started'),
    'uncertain Checkout outcome never promises that no purchase was created',
  );
  start.click();
  await until(() => pending.length === 2);
  resolvePurchase();
  await until(() => redirects.length === 1);
  check(
    Boolean(button('Continue same purchase')),
    'open purchase is resumed rather than offered as a new purchase',
  );
  button('Continue same purchase')!.click();
  await until(() => pending.length === 3);
  resolvePurchase('https://evil.example.invalid/purchase');
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  check(redirects.length === 1, 'untrusted hosted redirect is rejected');
  failLookup = true;
  await refresh();
  check(
    document.querySelector('[role="alert"]')?.textContent?.includes('Retry safely'),
    'failed lookup exposes safe retry/help guidance',
  );
  failLookup = false;
  action = {
    action: 'help',
    reason: 'unknown_provider_outcome',
    attempt: 'synthetic-reference',
  };
  await refresh();
  check(
    !button('Continue same purchase') &&
      !button('Continue to Checkout') &&
      document.body.textContent?.includes('synthetic-reference'),
    'unresolved outcome shows support reference without purchase action',
  );
  action = { action: 'manage', reason: 'ongoing_subscription' };
  await refresh();
  check(
    Boolean(button('Manage billing in Stripe')) && !button('Continue to Checkout'),
    'existing subscription offers management only',
  );
  action = { action: 'purchase', reason: 'ready' };
  await refresh();
  button('Continue to Checkout')!.click();
  await until(() => pending.length === 4);
  await auth!.logout();
  resolvePurchase();
  await wait();
  check(
    redirects.length === 1,
    'logout rejects a late redirect before React commits the session change',
  );
  check(
    !button('Continue to Checkout'),
    'logged-out account cannot retain a purchase action',
  );
  signedIn = true;
  userId = 2;
  await auth!.refreshSession();
  await until(() => Boolean(button('Continue to Checkout')));
  button('Continue to Checkout')!.click();
  await until(() => pending.length === 5);
  const unmounted = pending.at(-1)!;
  choose!('hidden');
  await wait();
  resolvePurchase();
  await wait();
  check(
    redirects.length === 1 && unmounted.config.signal?.aborted,
    'unmount aborts purchase and rejects a late redirect',
  );
  choose!('account');
  await until(() => Boolean(button('Continue to Checkout')));
  check(
    !button('Request account deletion') &&
      document.body.textContent?.includes('contact support through Help'),
    'customers use the existing support route without deletion request controls',
  );
  action = { action: 'manage', reason: 'deletion_pending' };
  await refresh();
  check(
    Boolean(button('Manage billing in Stripe')) && !button('Continue to Checkout'),
    'support-pending state preserves Portal and blocks purchases',
  );
  signedIn = true;
  userId = 3;
  isAdmin = true;
  await auth!.refreshSession();
  choose!('owner');
  await until(() => Boolean(button('Open account review')));
  check(
    button('Start account deletion')?.getAttribute('aria-disabled') === 'true',
    'owner initiation requires exact account and verified support ownership',
  );
  fillInput(document.querySelector('input')!, '1');
  fillInput(document.querySelector('input[type="email"]')!, 'buyer@example.invalid');
  await wait();
  (document.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
  await wait();
  button('Start account deletion')!.click();
  button('Start account deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/initiate/') === true);
  const initiation = pending.at(-1)!;
  check(
    initiation.config.data ===
      '{"accountEmail":"buyer@example.invalid","ownershipConfirmed":true}' &&
      initiation.config.withCredentials &&
      initiation.config.headers['X-RVDL-CSRF'] === '1',
    'owner initiation sends identity confirmation with cookie and CSRF',
  );
  initiation.resolve(response(initiation.config, { pending: true }));
  await until(() => Boolean(button('Complete app account deletion')));
  check(
    button('Complete app account deletion')?.getAttribute('aria-disabled') === 'true',
    'owner completion requires explicit Dashboard attestation',
  );
  check(
    !document.body.textContent?.includes('Record an exact missing Checkout Session'),
    'exact Session recovery is hidden when no attempt needs it',
  );
  closureCheckbox().click();
  await wait();
  await openReview();
  await wait();
  await until(() => Boolean(button('Complete app account deletion')));
  check(
    !closureCheckbox().checked,
    'a fresh review resets attestation even when its fingerprint is unchanged',
  );
  closureCheckbox().click();
  await wait();
  button('Complete app account deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/complete/') === true);
  const completion = pending.at(-1)!;
  check(
    JSON.parse(completion.config.data).dashboardClosed === true &&
      JSON.parse(completion.config.data).review === ownerReview.review,
    'owner submits current review and explicit closure attestation',
  );
  completion.reject(failure(completion.config, 409));
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  check(
    !button('Complete app account deletion'),
    'stale or uncertain completion discards the review and its closure confirmation',
  );
  await openReview();
  await until(() => Boolean(button('Complete app account deletion')));
  check(
    !closureCheckbox().checked,
    'retry after failed completion requires fresh Dashboard attestation',
  );
  button('Abandon support deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/withdraw/') === true);
  const withdrawal = pending.at(-1)!;
  withdrawal.resolve(response(withdrawal.config, { withdrawn: true }));
  await until(
    () => document.body.textContent?.includes('Support case abandoned') === true,
  );
  check(
    !button('Complete app account deletion'),
    'abandonment discards the completed review',
  );
  check(
    !calls.some((call) => /deletions\/synthetic-public-key$/.test(call.url || '')),
    'owner actions have no pending queue or background list refresh',
  );
  await openReview();
  await until(() => Boolean(button('Complete app account deletion')));
  button('Abandon support deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/withdraw/') === true);
  const lateOwner = pending.at(-1)!;
  choose!('hidden');
  await wait();
  lateOwner.resolve(response(lateOwner.config, { withdrawn: true }));
  await wait();
  check(
    lateOwner.config.signal?.aborted &&
      !document.body.textContent?.includes('Support case abandoned'),
    'owner unmount aborts action and ignores late result',
  );
  choose!('owner');
  await until(() => Boolean(button('Open account review')));
  await openReview();
  await until(() => Boolean(button('Complete app account deletion')));
  button('Abandon support deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/withdraw/') === true);
  const previousOwner = pending.at(-1)!;
  userId = 4;
  await auth!.refreshSession();
  await wait();
  previousOwner.resolve(response(previousOwner.config, { withdrawn: true }));
  await wait();
  check(
    previousOwner.config.signal?.aborted &&
      !button('Complete app account deletion') &&
      !document.body.textContent?.includes('Support case abandoned'),
    'owner session change clears prior review and rejects late mutation result',
  );
  ownerReview.attempts = [
    {
      attempt: 'owned-attempt',
      sessionId: null,
      status: 'unknown',
      customerId: null,
      subscriptionId: null,
    },
  ];
  await openReview();
  await until(() => Boolean(button('Record exact Session evidence')));
  const select = document.querySelector('select')!;
  select.value = 'owned-attempt';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  const exactInput = Array.from(document.querySelectorAll('input')).find((el) =>
    el.parentElement?.textContent?.includes('Exact Session ID'),
  )!;
  const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!
    .set!;
  setInput.call(exactInput, 'cs_test_exact');
  exactInput.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  button('Record exact Session evidence')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/exact-session/') === true);
  const exact = pending.at(-1)!;
  check(
    exact.config.data === '{"attempt":"owned-attempt","sessionId":"cs_test_exact"}' &&
      exact.config.withCredentials &&
      exact.config.headers['X-RVDL-CSRF'] === '1',
    'exceptional Session recovery submits only the chosen attempt and exact Session with session protection',
  );
  exact.resolve(response(exact.config, { recorded: true }));
  await until(
    () =>
      document.body.textContent?.includes('Exact Session reference recorded') === true,
  );
  check(
    !button('Complete app account deletion'),
    'recording exact evidence requires a fresh owner review',
  );
  ownerReview.attempts = [];
  isAdmin = false;
  await auth!.refreshSession();
  choose!('owner');
  await wait();
  check(
    !button('Start account deletion'),
    'development/login UI cannot authorize owner controls',
  );
  choose!('support');
  await until(() => Boolean(button('Send Message')));
  check(
    button('Send Message')?.getAttribute('aria-disabled') === 'true',
    'support explains unavailable submission until the form is complete',
  );
  fillInput(document.querySelector('#support-message--name-input')!, 'Synthetic');
  fillInput(
    document.querySelector('#support-message--email-input')!,
    'ui@example.invalid',
  );
  fillInput(
    document.querySelector('#support-message--message-input')!,
    'Please help with my account',
  );
  await wait();
  button('Send Message')!.click();
  button('Send Message')!.click();
  await until(() => supportMail.length === 1);
  check(
    button('Send Message')?.getAttribute('aria-disabled') === 'true',
    'support sends once and exposes an accessible busy explanation',
  );
  supportMail[0].reject(Error('synthetic private provider payload'));
  await until(() => document.body.textContent?.includes('We could not confirm') === true);
  check(
    !document.body.textContent?.includes('synthetic private provider payload'),
    'support failure offers retry without revealing provider details or claiming success',
  );
  button('Send Message')!.click();
  await until(() => supportMail.length === 2);
  supportMail[1].resolve({ status: 200, text: 'OK' });
  await until(
    () => document.body.textContent?.includes('accepted for delivery') === true,
  );
  check(
    !document.querySelector('[role="alert"]'),
    'support acceptance replaces the prior failure',
  );
  fillInput(
    document.querySelector('#support-message--message-input')!,
    'Another synthetic request',
  );
  await wait();
  button('Send Message')!.click();
  await until(() => supportMail.length === 3);
  choose!('hidden');
  await wait();
  supportMail[2].resolve({ status: 200, text: 'OK' });
  await wait();
  check(
    !document.body.textContent?.includes('accepted for delivery'),
    'unmounted support form ignores a late provider result',
  );
  window.history.replaceState(null, '', '?success=true&session_id=cs_test_ui');
  failConfirm = true;
  choose!('return');
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  (failConfirm = false), (failOwnerList = false);
  button('Refresh purchase confirmation')!.click();
  await until(
    () =>
      document.body.textContent?.includes('manage your subscription in Stripe') === true,
  );
  check(
    !document.querySelector('[role="alert"]'),
    'return lookup can retry after failure rather than retain one rejected promise',
  );
  check(
    calls
      .filter(
        (c) =>
          c.url?.includes('/payment/checkout/') ||
          c.url?.includes('/payment/account/') ||
          c.url?.includes('/checkout-session-object/'),
      )
      .every((c) => c.withCredentials && c.headers['X-RVDL-CSRF'] === '1'),
    'purchase contract retains cookie credentials and CSRF header',
  );
  check(
    calls
      .filter((c) => c.url?.includes('/payment/checkout/'))
      .every((c) => c.data === '{}'),
    'browser never supplies customer, price or subscription authority',
  );
  document.getElementById('results')!.textContent =
    lines.join('\n') + '\n' + lines.length + ' checks passed';
} catch (error) {
  document.getElementById('results')!.textContent =
    lines.join('\n') + '\nFAIL ' + String(error);
}
