// Staged contract; normal account routes do not select this helper yet.
import { useCallback, useEffect, useRef, useState } from 'react';

import { api, legacyKey, requestError } from '../api/client';
import { useAuthContext } from '../context/AuthContext';

export interface PurchaseAction {
  action: 'purchase' | 'manage' | 'pending' | 'help';
  reason: string;
  attempt?: string;
  url?: string;
  requestedAt?: string | null;
  notification?: string | null;
}
export const hostedRedirect = (url: string) => window.location.assign(url);
export function purchaseAction(value: unknown): PurchaseAction {
  const data = value as Partial<PurchaseAction> | null;
  if (
    !data ||
    !['purchase', 'manage', 'pending', 'help'].includes(data.action || '') ||
    typeof data.reason !== 'string' ||
    (data.attempt !== undefined && typeof data.attempt !== 'string')
  )
    throw Error('Invalid account response');
  if (data.url !== undefined) {
    const url = new URL(data.url);
    if (
      url.protocol !== 'https:' ||
      !['checkout.stripe.com', 'billing.stripe.com'].includes(url.hostname) ||
      url.username ||
      url.password
    )
      throw Error('Invalid hosted payment destination');
  }
  return data as PurchaseAction;
}

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
  const run = useCallback(
    async (kind: 'refresh' | 'checkout' | 'portal' | 'delete') => {
      if (!userId || pending.current) return;
      const sessionCurrent = captureSession();
      if (!sessionCurrent()) return;
      const revision = ++generation.current;
      const controller = new AbortController();
      pending.current = controller;
      setBusy(true);
      setError('');
      try {
        const response =
          kind === 'refresh'
            ? sessionId
              ? await api.post(
                  `/payment/checkout-session-object/${legacyKey}`,
                  { sessionId },
                  { signal: controller.signal },
                )
              : await api.get(`/payment/account/${legacyKey}`, {
                  signal: controller.signal,
                })
            : await api.post(
                kind === 'delete'
                  ? `/user/account-deletion/${legacyKey}`
                  : kind === 'checkout'
                  ? `/payment/checkout/${legacyKey}`
                  : `/user/create-portal-session/${legacyKey}`,
                kind === 'delete' ? { confirm: true } : {},
                { signal: controller.signal },
              );
        if (
          !active.current ||
          !sessionCurrent() ||
          owner.current !== userId ||
          generation.current !== revision
        )
          return;
        // Request commits independently of mail; reread persistent account state.
        const data =
          kind === 'delete'
            ? (
                await api.get(`/payment/account/${legacyKey}`, {
                  signal: controller.signal,
                })
              ).data
            : response.data;
        if (
          !active.current ||
          !sessionCurrent() ||
          owner.current !== userId ||
          generation.current !== revision
        )
          return;
        const action = purchaseAction(data);
        setResult(action);
        if (kind !== 'refresh' && action.url) redirect(action.url);
        if (kind === 'refresh' && sessionId && action.action === 'manage')
          await refreshSession();
      } catch (failure) {
        if (
          active.current &&
          sessionCurrent() &&
          owner.current === userId &&
          generation.current === revision &&
          !controller.signal.aborted
        )
          setError(
            requestError(
              failure,
              kind === 'delete'
                ? 'Unable to confirm the deletion request. Refresh account before retrying; your request may already be saved.'
                : 'Unable to check this purchase. Retry safely or contact Help; no new purchase has been started.',
            ),
          );
      } finally {
        if (pending.current === controller) pending.current = null;
        if (active.current && owner.current === userId && generation.current === revision)
          setBusy(false);
      }
    },
    [userId, sessionId, redirect, refreshSession, captureSession],
  );
  useEffect(() => {
    active.current = true;
    setResult(null);
    setError('');
    setBusy(false);
    void run('refresh');
    return () => {
      active.current = false;
      ++generation.current;
      pending.current?.abort();
      pending.current = null;
    };
  }, [run]);
  return { result, busy, error, userData, status, run, refreshSession };
}
export const purchaseMessage = (result: PurchaseAction) => {
  if (result.reason === 'deletion_pending')
    return 'Account deletion is pending. New purchases are blocked; existing billing can still be managed.';
  if (result.action === 'help')
    return 'This purchase needs help before another can be started. Contact support with the reference below.';
  if (result.action === 'manage')
    return 'Billing is available in Stripe. Playback eligibility is checked separately when you play a recording.';
  if (result.reason === 'checkout_open')
    return 'Checkout is unfinished. Continue the same purchase when ready.';
  if (result.action === 'pending')
    return 'Purchase confirmation is pending. Refresh or retry the same purchase safely.';
  return 'You can continue to Stripe Checkout to purchase the monthly subscription.';
};
