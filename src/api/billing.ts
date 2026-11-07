import { api, legacyKey } from './client';

export interface PurchaseAction {
  action: 'purchase' | 'manage' | 'pending' | 'help';
  reason: string;
  attempt?: string;
  url?: string;
  requestedAt?: string | null;
}

/** Validates account actions and restricts hosted redirects to Stripe destinations. */
function purchaseAction(value: unknown): PurchaseAction {
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

/** Reads the server-owned billing action for the signed-in account. */
export async function readAccount(signal: AbortSignal) {
  const { data } = await api.get(`/payment/account/${legacyKey}`, { signal });
  return purchaseAction(data);
}

/** Confirms an owned Checkout Session; the return URL itself grants no access. */
export async function confirmPurchase(sessionId: string, signal: AbortSignal) {
  const { data } = await api.post(
    `/payment/checkout-session-object/${legacyKey}`,
    { sessionId },
    { signal },
  );
  return purchaseAction(data);
}

/** Creates or resumes the account's owned Checkout attempt. */
export async function startCheckout(signal: AbortSignal) {
  const { data } = await api.post(`/payment/checkout/${legacyKey}`, {}, { signal });
  return purchaseAction(data);
}

/** Opens billing management for the server's trusted customer binding. */
export async function openPortal(signal: AbortSignal) {
  const { data } = await api.post(
    `/user/create-portal-session/${legacyKey}`,
    {},
    { signal },
  );
  return purchaseAction(data);
}
