import { api, legacyKey } from './client';

export type PendingDeletion = {
  id: number;
  email: string;
  requestedAt: string;
  notification: string;
};
export type DeletionReview = {
  account: PendingDeletion;
  binding: {
    customerId: string;
    subscriptionId: string | null;
    livemode: boolean;
  } | null;
  attempts: {
    attempt: string;
    sessionId: string | null;
    status: string;
    customerId: string | null;
    subscriptionId: string | null;
  }[];
  customers: string[];
  subscriptions: { customerId: string; subscriptionId: string }[];
  blockers: string[];
  checklist: string[];
  review: string;
};
const base = '/user/owner/deletions/';

/** Lists pending deletion requests for the authenticated owner. */
export async function listDeletionRequests(
  signal: AbortSignal,
): Promise<PendingDeletion[]> {
  const { data } = await api.get(base + legacyKey, { signal });
  return data.requests;
}

/** Fetches a fresh closure review and fingerprint for one account. */
export async function reviewDeletion(
  accountId: number,
  signal: AbortSignal,
): Promise<DeletionReview> {
  const { data } = await api.get(base + accountId + '/' + legacyKey, { signal });
  return data;
}

/** Withdraws a deletion request using the supplied review fingerprint. */
export async function withdrawDeletion(review: DeletionReview, signal: AbortSignal) {
  await api.post(
    base + review.account.id + '/withdraw/' + legacyKey,
    { review: review.review },
    { signal },
  );
}

/** Attests Dashboard closure and submits the reviewed account for deletion. */
export async function completeDeletion(review: DeletionReview, signal: AbortSignal) {
  await api.post(
    base + review.account.id + '/complete/' + legacyKey,
    { review: review.review, dashboardClosed: true },
    { signal },
  );
}

/** Records exact Session evidence for a reviewed owned attempt. */
export async function recordExactSession(
  review: DeletionReview,
  attempt: string,
  sessionId: string,
  signal: AbortSignal,
) {
  await api.post(
    base + review.account.id + '/exact-session/' + legacyKey,
    { attempt, sessionId },
    { signal },
  );
}
