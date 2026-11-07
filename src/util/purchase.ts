// Coordinate account actions with the lifetime of the authenticated view.
import { useCallback, useEffect, useRef, useState } from 'react';

import type { PurchaseAction } from '../api/billing';
import * as billing from '../api/billing';
import { requestError } from '../api/client';
import { useAuthContext } from '../context/AuthContext';

/** Navigates to the supplied hosted billing URL. */
export const hostedRedirect = (url: string) => window.location.assign(url);

type AccountRequest = (
  signal: AbortSignal,
  current: () => boolean,
) => Promise<PurchaseAction | undefined>;

/** Coordinates account actions while rejecting overlapping requests and stale sessions. */
export function usePurchase(sessionId?: string, redirect = hostedRedirect) {
  const { userData, status, refreshSession, captureSession } = useAuthContext();
  const userId = userData?.id;
  const owner = useRef(userId);
  owner.current = userId;
  const [result, setResult] = useState<PurchaseAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(false);
  const pending = useRef<AbortController | null>(null);
  const generation = useRef(0);

  /** Runs one account request and applies results only to the current view and session. */
  const perform = useCallback(
    async (
      request: AccountRequest,
      failureMessage: string,
      onSuccess?: (action: PurchaseAction) => void | Promise<void>,
    ) => {
      if (!userId || pending.current) return;
      const sessionCurrent = captureSession();
      if (!sessionCurrent()) return;
      const revision = ++generation.current;
      const controller = new AbortController();
      pending.current = controller;

      /** Checks that this request still owns the mounted account view. */
      const ownsView = () =>
        active.current && owner.current === userId && generation.current === revision;

      /** Also requires the original authenticated session to remain current. */
      const current = () => ownsView() && sessionCurrent();
      setBusy(true);
      setError('');
      try {
        const action = await request(controller.signal, current);
        if (!current() || !action) return;
        setResult(action);
        await onSuccess?.(action);
      } catch (failure) {
        if (current() && !controller.signal.aborted)
          setError(requestError(failure, failureMessage));
      } finally {
        if (pending.current === controller) pending.current = null;
        if (ownsView()) setBusy(false);
      }
    },
    [userId, captureSession],
  );

  /** Refreshes the account action or confirms the owned Checkout return. */
  const refresh = useCallback(
    () =>
      perform(
        (signal) =>
          sessionId
            ? billing.confirmPurchase(sessionId, signal)
            : billing.readAccount(signal),
        'Unable to check this purchase. Retry safely or contact Help.',
        async (action) => {
          if (sessionId && action.action === 'manage') await refreshSession();
        },
      ),
    [perform, sessionId, refreshSession],
  );

  /** Follows a hosted URL returned by a validated account action. */
  const followHostedUrl = (action: PurchaseAction) => {
    if (action.url) redirect(action.url);
  };

  /** Starts or resumes Checkout under the shared account-request guard. */
  const startCheckout = () =>
    perform(
      billing.startCheckout,
      'Unable to confirm Checkout. Your purchase may already have started. Refresh your account and continue the same purchase; contact Help if it remains unresolved.',
      followHostedUrl,
    );

  /** Opens Stripe Portal without overlapping another account action. */
  const openPortal = () =>
    perform(
      billing.openPortal,
      'Unable to open billing management. Retry or contact Help.',
      followHostedUrl,
    );

  useEffect(() => {
    active.current = true;
    setResult(null);
    setError('');
    setBusy(false);
    void refresh();
    return () => {
      active.current = false;
      ++generation.current;
      pending.current?.abort();
      pending.current = null;
    };
  }, [refresh]);
  return {
    result,
    busy,
    error,
    userData,
    status,
    refresh,
    startCheckout,
    openPortal,
    refreshSession,
  };
}

/** Maps the server's account action to customer-facing guidance. */
export const purchaseMessage = (result: PurchaseAction) => {
  if (result.reason === 'deletion_pending')
    return 'Account deletion is pending. New purchases are blocked; existing billing can still be managed.';
  if (result.action === 'help')
    return 'This purchase needs help before another can be started. Contact support with the reference below.';
  if (result.action === 'manage')
    return 'You can manage your subscription in Stripe. Play a recording to check access.';
  if (result.reason === 'checkout_open')
    return 'Checkout is unfinished. Continue the same purchase when ready.';
  if (result.action === 'pending')
    return 'Purchase confirmation is pending. Refresh or retry the same purchase safely.';
  return 'You can continue to Stripe Checkout to purchase the monthly subscription.';
};
