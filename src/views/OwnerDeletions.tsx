// Owner controls require the persisted session and current server-side administrator role.
import { useState } from 'react';

import type { DeletionReview } from '../api/ownerDeletions';
import { Button } from '../components/Button/Button';
import { useAuthContext } from '../context/AuthContext';
import { useOwnerDeletions } from '../util/useOwnerDeletions';

/** Resets owner controls whenever the acting account changes. */
export function OwnerDeletions() {
  const { userData } = useAuthContext();
  return <OwnerDeletionControl key={userData?.id ?? 'anonymous'} />;
}

/** Displays one exact account and current support review from the deletion controller. */
function OwnerDeletionControl() {
  const state = useOwnerDeletions();
  const [accountId, setAccountId] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  if (state.status === 'loading') return <p role="status">Checking owner session…</p>;
  if (state.status === 'error')
    return (
      <Button
        name="Retry owner session"
        callback={() => {
          void state.refreshSession();
        }}
      />
    );
  if (!state.userData?.isAdmin)
    return <p>Owner login with a persisted administrator session is required.</p>;
  const unavailable = state.busy
    ? 'An owner request is in progress. Please wait.'
    : undefined;
  return (
    <section>
      <h1>Support account deletion</h1>
      <p>
        Verify the request belongs to this account before starting. Billing closure is
        required before completion.
      </p>
      <label>
        Account ID{' '}
        <input
          value={accountId}
          readOnly={state.busy}
          onChange={(event) => {
            setAccountId(event.target.value);
            setVerified(false);
          }}
        />
      </label>
      <label>
        Account email{' '}
        <input
          type="email"
          value={email}
          readOnly={state.busy}
          onChange={(event) => {
            setEmail(event.target.value);
            setVerified(false);
          }}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={verified}
          disabled={state.busy}
          onChange={(event) => setVerified(event.target.checked)}
        />
        I verified through support that the request belongs to this account.
      </label>
      <Button
        name="Start account deletion"
        isDisabledMessage={
          unavailable ||
          (!verified || !/^[1-9][0-9]{0,9}$/.test(accountId) || !email
            ? 'Enter the account ID and email, then verify request ownership.'
            : undefined)
        }
        callback={() => {
          void state.initiate(Number(accountId), email);
        }}
      />
      <Button
        name="Open account review"
        isDisabledMessage={
          unavailable ||
          (!/^[1-9][0-9]{0,9}$/.test(accountId) ? 'Enter an account ID.' : undefined)
        }
        callback={() => {
          void state.reviewAccount(Number(accountId));
        }}
      />
      {state.busy && <p role="status">Checking owner request…</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {state.message && <p role="status">{state.message}</p>}
      {state.review && (
        <DeletionReviewPanel
          key={state.reviewKey}
          review={state.review}
          busy={state.busy}
          onComplete={() => {
            void state.complete();
          }}
          onWithdraw={() => {
            void state.withdraw();
          }}
          onRecordSession={(attempt, sessionId) => {
            void state.recordExactSession(attempt, sessionId);
          }}
        />
      )}
    </section>
  );
}

/** Collects closure attestation and missing-Session evidence for one fresh review. */
function DeletionReviewPanel({
  review,
  busy,
  onComplete,
  onWithdraw,
  onRecordSession,
}: {
  review: DeletionReview;
  busy: boolean;
  onComplete: () => void;
  onWithdraw: () => void;
  onRecordSession: (attempt: string, sessionId: string) => void;
}) {
  const [closed, setClosed] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [sessionId, setSessionId] = useState('');
  const unavailable = busy ? 'An owner request is in progress. Please wait.' : undefined;
  const missingAttempts = review.attempts.filter((row) => !row.sessionId);
  return (
    <div>
      <h2>Review {review.account.email}</h2>
      <p>
        Account {review.account.id}; requested{' '}
        {new Date(review.account.requestedAt).toLocaleString()}
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
            {row.customerId || 'no customer'} / {row.subscriptionId || 'no subscription'}
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
          onComplete();
        }}
      />
      <Button
        name="Abandon support deletion"
        isDisabledMessage={unavailable}
        callback={() => {
          onWithdraw();
        }}
      />
      {missingAttempts.length > 0 && (
        <div>
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
              {missingAttempts.map((row) => (
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
              onRecordSession(attempt, sessionId);
            }}
          />
        </div>
      )}
    </div>
  );
}
