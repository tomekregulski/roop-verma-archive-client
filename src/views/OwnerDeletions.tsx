// Staged owner control: mounted only by the isolated candidate fixture.
import { useCallback, useEffect, useRef, useState } from 'react';

import { api, legacyKey, requestError } from '../api/client';
import { Button } from '../components/Button/Button';
import { useAuthContext } from '../context/AuthContext';

type Pending = { id: number; email: string; requestedAt: string; notification: string };
type Review = {
  account: Pending;
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
export function OwnerDeletions() {
  const { userData } = useAuthContext();
  return <OwnerDeletionControl key={userData?.id ?? 'anonymous'} />;
}
function OwnerDeletionControl() {
  const { userData, status, captureSession, refreshSession } = useAuthContext();
  const [requests, setRequests] = useState<Pending[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [closed, setClosed] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const active = useRef(false);
  const displayedOwner = useRef(userData?.id);
  displayedOwner.current = userData?.id;
  const ownerId = userData?.id;
  const run = useCallback(
    async (
      kind: 'list' | 'review' | 'withdraw' | 'complete' | 'exact-session',
      accountId?: number,
      body?: object,
    ) => {
      if (!ownerId || pending.current) return;
      const sessionCurrent = captureSession();
      if (!sessionCurrent()) return;
      const revision = ++generation.current;
      const controller = new AbortController();
      pending.current = controller;
      setBusy(true);
      setError('');
      setMessage('');
      const current = () =>
        active.current &&
        sessionCurrent() &&
        displayedOwner.current === ownerId &&
        generation.current === revision;
      try {
        const base = '/user/owner/deletions/';
        const response =
          kind === 'list'
            ? await api.get(base + legacyKey, { signal: controller.signal })
            : kind === 'review'
            ? await api.get(base + accountId + '/' + legacyKey, {
                signal: controller.signal,
              })
            : await api.post(base + accountId + '/' + kind + '/' + legacyKey, body, {
                signal: controller.signal,
              });
        if (!current()) return;
        if (kind === 'list') setRequests(response.data.requests);
        else if (kind === 'review') {
          setReview(response.data);
          setClosed(false);
          setAttempt('');
          setSessionId('');
        } else {
          // Mutation responses never authorize further actions with an old review.
          setReview(null);
          setClosed(false);
          setMessage(
            kind === 'complete'
              ? 'App account deleted. Stripe records remain.'
              : kind === 'withdraw'
              ? 'Deletion request withdrawn. Stripe billing is unchanged.'
              : 'Exact Session reference recorded. Open a fresh review.',
          );
          const list = await api.get(base + legacyKey, { signal: controller.signal });
          if (current()) setRequests(list.data.requests);
        }
      } catch (failure) {
        if (current() && !controller.signal.aborted) {
          setError(
            requestError(
              failure,
              'Owner action could not be confirmed. Refresh the pending list and review before retrying.',
            ),
          );
          setClosed(false);
        }
      } finally {
        if (pending.current === controller) pending.current = null;
        if (current()) setBusy(false);
      }
    },
    [ownerId, captureSession],
  );
  useEffect(() => {
    active.current = true;
    setRequests([]);
    setReview(null);
    setClosed(false);
    setBusy(false);
    setError('');
    setMessage('');
    if (userData?.isAdmin) {
      const account = Number(new URLSearchParams(window.location.search).get('account'));
      void run(Number.isSafeInteger(account) && account > 0 ? 'review' : 'list', account);
    }
    return () => {
      active.current = false;
      ++generation.current;
      pending.current?.abort();
      pending.current = null;
    };
  }, [run, userData?.isAdmin]);
  if (status === 'loading') return <p role="status">Checking owner session…</p>;
  if (status === 'error')
    return (
      <Button
        name="Retry owner session"
        callback={() => {
          void refreshSession();
        }}
      />
    );
  if (!userData?.isAdmin)
    return <p>Owner login with a persisted administrator session is required.</p>;
  const unavailable = busy ? 'An owner request is in progress. Please wait.' : undefined;
  return (
    <section>
      <h1>Pending account deletions</h1>
      <p>
        Review exact billing identities and complete the Dashboard checklist before
        deleting app identity.
      </p>
      <Button
        name="Refresh pending requests"
        isDisabledMessage={unavailable}
        callback={() => {
          setReview(null);
          setClosed(false);
          void run('list');
        }}
      />
      {busy && <p role="status">Checking owner request…</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <ul>
        {requests.map((row) => (
          <li key={row.id}>
            {row.email} — {new Date(row.requestedAt).toLocaleString()} — notification:{' '}
            {row.notification}
            <Button
              name={`Review ${row.email}`}
              isDisabledMessage={unavailable}
              callback={() => {
                void run('review', row.id);
              }}
            />
          </li>
        ))}
      </ul>
      {review && (
        <div>
          <h2>Review {review.account.email}</h2>
          <p>
            Account {review.account.id}; requested{' '}
            {new Date(review.account.requestedAt).toLocaleString()}; notification:{' '}
            {review.account.notification}
          </p>
          <p>
            Trusted binding:{' '}
            {review.binding
              ? `${review.binding.livemode ? 'live' : 'test'} / ${
                  review.binding.customerId
                } / ${review.binding.subscriptionId || 'no selection'}`
              : 'No associated customer. Inspect all attempts below.'}
          </p>
          <p>Exact customers: {review.customers.join(', ') || 'none'}</p>
          <ul>
            {review.subscriptions.map((row) => (
              <li key={row.subscriptionId}>
                {row.customerId} / {row.subscriptionId}
              </li>
            ))}
          </ul>
          <h3>All owned attempts</h3>
          <ul>
            {review.attempts.map((row) => (
              <li key={row.attempt}>
                {row.attempt} / {row.sessionId || 'Session ID unknown'} / {row.status} /{' '}
                {row.customerId || 'no customer'} /{' '}
                {row.subscriptionId || 'no subscription'}
              </li>
            ))}
          </ul>
          <h3>Completion blockers</h3>
          {review.blockers.length ? (
            <ul>
              {review.blockers.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          ) : (
            <p>
              No blockers found in exact known resources. Dashboard attestation is still
              required.
            </p>
          )}
          <h3>Dashboard closure checklist</h3>
          <ul>
            {review.checklist.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
          <label>
            <input
              type="checkbox"
              checked={closed}
              disabled={busy}
              onChange={(event) => setClosed(event.target.checked)}
            />
            I rechecked the correct Stripe mode and every listed identity, resolved all
            billing items above, and confirm actual Dashboard closure.
          </label>
          <Button
            name="Complete app account deletion"
            isDisabledMessage={
              unavailable ||
              (!closed
                ? 'Confirm Dashboard closure first.'
                : review.blockers.length
                ? 'Resolve all completion blockers first.'
                : undefined)
            }
            callback={() => {
              void run('complete', review.account.id, {
                review: review.review,
                dashboardClosed: true,
              });
            }}
          />
          <Button
            name="Withdraw deletion request through support"
            isDisabledMessage={unavailable}
            callback={() => {
              void run('withdraw', review.account.id, { review: review.review });
            }}
          />
          <h3>Record an exact missing Checkout Session</h3>
          <p>
            Use only a Session verified in Dashboard for this owned attempt. This records
            evidence; it does not associate billing or create Checkout.
          </p>
          <label>
            Owned attempt
            <select
              value={attempt}
              disabled={busy}
              onChange={(event) => setAttempt(event.target.value)}
            >
              <option value="">Choose attempt</option>
              {review.attempts
                .filter((row) => !row.sessionId)
                .map((row) => (
                  <option key={row.attempt} value={row.attempt}>
                    {row.attempt}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Exact Session ID
            <input
              value={sessionId}
              disabled={busy}
              onChange={(event) => setSessionId(event.target.value)}
            />
          </label>
          <Button
            name="Record exact Session evidence"
            isDisabledMessage={
              unavailable ||
              (!attempt || !/^cs_[A-Za-z0-9_]{1,240}$/.test(sessionId)
                ? 'Choose an owned attempt and exact Session ID.'
                : undefined)
            }
            callback={() => {
              void run('exact-session', review.account.id, { attempt, sessionId });
            }}
          />
        </div>
      )}
    </section>
  );
}
