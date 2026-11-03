import { useCallback, useEffect, useRef, useState } from 'react';

import { requestError } from '../api/client';
import type { DeletionReview, PendingDeletion } from '../api/ownerDeletions';
import * as owner from '../api/ownerDeletions';
import { useAuthContext } from '../context/AuthContext';

type OwnerRequest = (signal: AbortSignal, current: () => boolean) => Promise<void>;

/** Coordinates owner reviews and mutations within the current administrator session. */
export function useOwnerDeletions() {
  const { userData, status, captureSession, refreshSession } = useAuthContext();
  const ownerId = userData?.id;
  const [requests, setRequests] = useState<PendingDeletion[]>([]);
  const [reviewState, setReview] = useState<{
    data: DeletionReview;
    revision: number;
  } | null>(null);
  const review = reviewState?.data ?? null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const active = useRef(false);
  const displayedOwner = useRef(ownerId);
  displayedOwner.current = ownerId;

  /** Serializes owner requests and discards results from obsolete views or sessions. */
  const perform = useCallback(
    async (request: OwnerRequest) => {
      if (!ownerId || pending.current) return;
      const sessionCurrent = captureSession();
      if (!sessionCurrent()) return;
      const revision = ++generation.current;
      const controller = new AbortController();
      pending.current = controller;

      /** Checks ownership of the mounted owner view before updating request state. */
      const ownsView = () =>
        active.current &&
        displayedOwner.current === ownerId &&
        generation.current === revision;

      /** Requires both the original view and authenticated session to remain current. */
      const current = () => ownsView() && sessionCurrent();
      setBusy(true);
      setError('');
      setMessage('');
      try {
        await request(controller.signal, current);
      } catch (failure) {
        if (current() && !controller.signal.aborted)
          setError(
            requestError(
              failure,
              'Owner action could not be confirmed. Refresh the pending list and review before retrying.',
            ),
          );
      } finally {
        if (pending.current === controller) pending.current = null;
        if (ownsView()) setBusy(false);
      }
    },
    [ownerId, captureSession],
  );

  /** Clears the selected review and refreshes the pending request list. */
  const refreshRequests = useCallback(
    () =>
      perform(async (signal, current) => {
        setReview(null);
        const list = await owner.listDeletionRequests(signal);
        if (current()) setRequests(list);
      }),
    [perform],
  );

  /** Loads a fresh review with a new local confirmation revision. */
  const reviewAccount = useCallback(
    (accountId: number) =>
      perform(async (signal, current) => {
        setReview(null);
        const next = await owner.reviewDeletion(accountId, signal);
        if (current()) setReview({ data: next, revision: generation.current });
      }),
    [perform],
  );

  /** Discards the old review and preserves confirmed mutation success if list refresh fails. */
  const mutateReview = (
    mutation: (signal: AbortSignal) => Promise<void>,
    successMessage: string,
  ) =>
    perform(async (signal, current) => {
      // Discard the review and its confirmation before any mutation, including uncertain outcomes.
      setReview(null);
      await mutation(signal);
      if (!current()) return;
      setMessage(successMessage);
      setRequests([]);
      try {
        const list = await owner.listDeletionRequests(signal);
        if (current()) setRequests(list);
      } catch {
        if (current() && !signal.aborted)
          setError(
            'The action succeeded, but the pending list could not be refreshed. Refresh the pending list before choosing another account.',
          );
      }
    });

  /** Withdraws the currently reviewed deletion request. */
  const withdraw = () => {
    if (review)
      return mutateReview(
        (signal) => owner.withdrawDeletion(review, signal),
        'Deletion request withdrawn. Stripe billing is unchanged.',
      );
  };

  /** Submits the reviewed account after UI closure attestation. */
  const complete = () => {
    if (review)
      return mutateReview(
        (signal) => owner.completeDeletion(review, signal),
        'App account deleted. Stripe records remain.',
      );
  };

  /** Records an exact Session reference and requires a fresh review afterward. */
  const recordExactSession = (attempt: string, sessionId: string) => {
    if (review)
      return mutateReview(
        (signal) => owner.recordExactSession(review, attempt, sessionId, signal),
        'Exact Session reference recorded. Open a fresh review.',
      );
  };

  useEffect(() => {
    active.current = true;
    setRequests([]);
    setReview(null);
    setBusy(false);
    setError('');
    setMessage('');
    if (userData?.isAdmin) {
      const account = Number(new URLSearchParams(window.location.search).get('account'));
      if (Number.isSafeInteger(account) && account > 0) void reviewAccount(account);
      else void refreshRequests();
    }
    return () => {
      active.current = false;
      ++generation.current;
      pending.current?.abort();
      pending.current = null;
    };
  }, [reviewAccount, refreshRequests, userData?.isAdmin]);
  return {
    userData,
    status,
    refreshSession,
    requests,
    review,
    reviewKey: reviewState?.revision,
    busy,
    error,
    message,
    refreshRequests,
    reviewAccount,
    withdraw,
    complete,
    recordExactSession,
  };
}
