// Focused component/race checks, separate from the real HTTP/PostgreSQL journey.
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { api } from '../src/api/client';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import type { PurchaseAction } from '../src/util/purchase';
import { PurchaseReturn } from '../src/views/CompleteRegistration';
import { PurchaseAccount } from '../src/views/ManageAccount';
import { OwnerDeletions } from '../src/views/OwnerDeletions';

let signedIn = true,
  userId = 1,
  isAdmin = false;
let action: PurchaseAction = { action: 'purchase', reason: 'ready' };
let failLookup = false,
  failConfirm = false;
const calls: InternalAxiosRequestConfig[] = [];
const redirects: string[] = [];
const redirect = (url: string) => {
  redirects.push(url);
};
type Pending = {
  config: InternalAxiosRequestConfig;
  resolve: (response: AxiosResponse) => void;
  reject: (error: unknown) => void;
};
const pending: Pending[] = [];
const response = (config: InternalAxiosRequestConfig, data: unknown): AxiosResponse => ({
  config,
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
});
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
    return response(config, { requests: [ownerReview.account] });
  }
  return new Promise((resolve, reject) => pending.push({ config, resolve, reject }));
};
const ownerReview = {
  account: {
    id: 1,
    email: 'buyer@example.invalid',
    requestedAt: new Date().toISOString(),
    notification: 'uncertain',
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
function Harness() {
  auth = useAuthContext();
  const [view, setView] = useState('account');
  choose = setView;
  return view === 'account' ? (
    <PurchaseAccount redirect={redirect} />
  ) : view === 'owner' ? (
    <OwnerDeletions />
  ) : view === 'return' ? (
    <PurchaseReturn redirect={redirect} />
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
const wait = () => new Promise((resolve) => setTimeout(resolve, 20));
async function until(check: () => boolean) {
  for (let i = 0; i < 150; i++) {
    if (check()) return;
    await wait();
  }
  throw Error('Timed out waiting for purchase UI');
}
const button = (name: string) =>
  Array.from(document.querySelectorAll('button')).find((el) => el.textContent === name);
const lines: string[] = [];
function check(value: unknown, name: string) {
  if (!value) throw Error(name);
  lines.push('PASS ' + name);
}
async function refresh() {
  const before = calls.length;
  button('Refresh account')!.click();
  await until(() => calls.length > before);
  await wait();
  await until(() => button('Refresh account')?.getAttribute('aria-disabled') !== 'true');
}
function resolvePurchase(url = 'https://checkout.stripe.com/c/pay/cs_test_ui') {
  const request = pending.at(-1)!;
  request.resolve(
    response(request.config, { action: 'pending', reason: 'checkout_open', url }),
  );
}
try {
  await until(() => Boolean(button('Continue to Checkout')));
  check(
    auth!.userData?.stripeId === null && Boolean(button('Continue to Checkout')),
    'verified customer-null account can purchase',
  );
  check(
    auth!.hasAllowedStatus && Boolean(button('Continue to Checkout')),
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
  resolvePurchase();
  await until(() => redirects.length === 1);
  check(
    Boolean(button('Continue same purchase')),
    'open purchase is resumed rather than offered as a new purchase',
  );
  button('Continue same purchase')!.click();
  await until(() => pending.length === 2);
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
  await until(() => pending.length === 3);
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
  await until(() => pending.length === 4);
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
  await until(() => Boolean(button('Request account deletion')));
  check(
    button('Request account deletion')?.getAttribute('aria-disabled') === 'true',
    'deletion requires explicit confirmation',
  );
  (document.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
  await wait();
  button('Request account deletion')!.click();
  button('Request account deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/account-deletion/') === true);
  const deletionCall = pending.at(-1)!;
  check(
    deletionCall.config.data === '{"confirm":true}' &&
      deletionCall.config.withCredentials &&
      deletionCall.config.headers['X-RVDL-CSRF'] === '1',
    'deletion sends only explicit confirmation with session and CSRF',
  );
  deletionCall.reject(failure(deletionCall.config, 503));
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  check(Boolean(button('Request account deletion')), 'request failure remains retryable');
  button('Request account deletion')!.click();
  await until(() => pending.at(-1) !== deletionCall);
  action = {
    action: 'manage',
    reason: 'deletion_pending',
    requestedAt: new Date().toISOString(),
    notification: 'uncertain',
  };
  pending.at(-1)!.resolve(response(pending.at(-1)!.config, { pending: true }));
  await until(
    () => document.body.textContent?.includes('To withdraw this request') === true,
  );
  check(
    Boolean(button('Manage billing in Stripe')) &&
      !button('Request account deletion') &&
      !button('Continue to Checkout'),
    'pending deletion preserves Portal and blocks new purchase/request controls',
  );
  check(
    document.body.textContent?.includes('notification delivery is unconfirmed'),
    'saved pending request explains uncertain support delivery',
  );
  choose!('hidden');
  await wait();
  choose!('account');
  await until(
    () => document.body.textContent?.includes('To withdraw this request') === true,
  );
  check(
    !button('Request account deletion'),
    'persistent server pending state survives remount',
  );
  action = { action: 'purchase', reason: 'ready' };
  await refresh();
  (document.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
  await wait();
  button('Request account deletion')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/account-deletion/') === true);
  const lateDeletion = pending.at(-1)!;
  const beforeLateReads = calls.filter((c) =>
    c.url?.includes('/payment/account/'),
  ).length;
  await auth!.logout();
  lateDeletion.resolve(response(lateDeletion.config, { pending: true }));
  await wait();
  check(
    !button('Request account deletion') &&
      calls.filter((c) => c.url?.includes('/payment/account/')).length ===
        beforeLateReads,
    'logout discards late deletion response before follow-up lookup',
  );
  signedIn = true;
  userId = 3;
  isAdmin = true;
  await auth!.refreshSession();
  choose!('owner');
  await until(() => Boolean(button('Review buyer@example.invalid')));
  button('Review buyer@example.invalid')!.click();
  await until(() => Boolean(button('Complete app account deletion')));
  check(
    button('Complete app account deletion')?.getAttribute('aria-disabled') === 'true',
    'owner completion requires explicit Dashboard attestation',
  );
  (document.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
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
    !(document.querySelector('input[type="checkbox"]') as HTMLInputElement).checked,
    'stale/failed completion clears closure confirmation',
  );
  button('Withdraw deletion request through support')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/withdraw/') === true);
  const withdrawal = pending.at(-1)!;
  withdrawal.resolve(response(withdrawal.config, { withdrawn: true }));
  await until(
    () => document.body.textContent?.includes('Deletion request withdrawn') === true,
  );
  check(
    !button('Complete app account deletion'),
    'successful withdrawal discards old owner review',
  );
  button('Review buyer@example.invalid')!.click();
  await until(() => Boolean(button('Complete app account deletion')));
  button('Withdraw deletion request through support')!.click();
  await until(() => pending.at(-1)?.config.url?.includes('/withdraw/') === true);
  const lateOwner = pending.at(-1)!;
  choose!('hidden');
  await wait();
  lateOwner.resolve(response(lateOwner.config, { withdrawn: true }));
  await wait();
  check(
    lateOwner.config.signal?.aborted &&
      !document.body.textContent?.includes('Deletion request withdrawn'),
    'owner unmount aborts action and ignores late result',
  );
  choose!('owner');
  await until(() => Boolean(button('Review buyer@example.invalid')));
  button('Review buyer@example.invalid')!.click();
  await until(() => Boolean(button('Complete app account deletion')));
  button('Withdraw deletion request through support')!.click();
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
      !document.body.textContent?.includes('Deletion request withdrawn'),
    'owner session change clears prior review and rejects late mutation result',
  );
  isAdmin = false;
  await auth!.refreshSession();
  choose!('owner');
  await wait();
  check(
    !button('Refresh pending requests'),
    'development/login UI cannot authorize owner controls',
  );
  window.history.replaceState(null, '', '?success=true&session_id=cs_test_ui');
  failConfirm = true;
  choose!('return');
  await until(() => Boolean(document.querySelector('[role="alert"]')));
  failConfirm = false;
  button('Refresh purchase confirmation')!.click();
  await until(() => document.body.textContent?.includes('Billing is available') === true);
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
