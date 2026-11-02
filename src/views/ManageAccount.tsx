import { useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, legacyKey, requestError } from '../api/client';
import { Button } from '../components/Button/Button';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import type { UserData } from '../context/AuthContext';
import { useAuthContext } from '../context/AuthContext';
import { handleCheckout } from '../util/handleCheckout';
import { hostedRedirect, purchaseMessage, usePurchase } from '../util/purchase';

export function ManageAccount() {
  const stripe = useStripe();
  const { userData, status, refreshSession, hasAllowedStatus } = useAuthContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);
  if (status === 'loading') return <p role="status">Loading account…</p>;
  if (status === 'error')
    return (
      <Section>
        <p>Unable to load your account.</p>
        <Button
          name="Retry"
          callback={() => {
            void refreshSession();
          }}
        />
      </Section>
    );
  if (!userData)
    return (
      <p>
        Please <Link to="/">log in</Link> to access your account.
      </p>
    );

  async function portal() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      // The backend derives the customer from the authenticated session.
      const { data } = await api.post(`/user/create-portal-session/${legacyKey}`, {});
      window.location.assign(data.session.url);
    } catch (failure) {
      setError(
        requestError(
          failure,
          'Unable to open account management. Try again or contact Help.',
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function checkout() {
    if (busy || !stripe || !userData) return;
    setBusy(true);
    setError('');
    try {
      await handleCheckout({
        user: userData,
        stripe,
        resubscribe: Boolean(userData.subscriptionActive),
      });
    } catch (failure) {
      setError(
        requestError(failure, 'Unable to open Checkout. Try again or contact Help.'),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Section>
      <ViewTitle title="Account" />
      <AccountIdentity user={userData} />
      <p>
        Current subscription status: {userData.subscriptionActive ?? 'not available'}.
        Changes may take time to appear.
      </p>
      <Button
        id="portal-session-button"
        name="Manage Account"
        isDisabledMessage={
          busy ? 'A payment request is in progress. Please wait.' : undefined
        }
        callback={() => {
          void portal();
        }}
      />
      <Button
        name="Refresh account"
        isDisabledMessage={
          busy ? 'A payment request is in progress. Please wait.' : undefined
        }
        callback={() => {
          void refreshSession();
        }}
      />
      {!hasAllowedStatus && (
        <Button
          name={userData.subscriptionActive ? 'Resubscribe' : 'Continue to Checkout'}
          isDisabledMessage={
            busy
              ? 'A payment request is in progress. Please wait.'
              : !stripe
              ? 'Checkout is unavailable while the payment service loads.'
              : undefined
          }
          callback={() => {
            void checkout();
          }}
        />
      )}
      {!stripe && (
        <p>
          Checkout is unavailable while the payment service loads. Refresh or contact Help
          if this continues.
        </p>
      )}
      {busy && <p role="status">Opening payment service…</p>}
      {error && <p role="alert">{error}</p>}
      <p>
        <Link to="/library">Help</Link>
      </p>
    </Section>
  );
}

function AccountIdentity({ user }: { user: UserData }) {
  return (
    <p>
      {user.firstName} {user.lastName} — {user.email}
    </p>
  );
}

// Named candidate export; AppContainer continues to select ManageAccount above.
export function PurchaseAccount({
  redirect = hostedRedirect,
}: {
  redirect?: (url: string) => void;
}) {
  const state = usePurchase(undefined, redirect);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  useEffect(() => setConfirmDeletion(false), [state.userData?.id, state.result?.reason]);
  if (state.status === 'loading') return <p role="status">Loading account…</p>;
  if (state.status === 'error')
    return (
      <Button
        name="Retry account session"
        callback={() => {
          void state.refreshSession();
        }}
      />
    );
  if (!state.userData)
    return (
      <p>
        Please <Link to="/">log in</Link> to access your account.
      </p>
    );
  const unavailable = state.busy
    ? 'An account request is in progress. Please wait.'
    : undefined;
  return (
    <Section>
      <ViewTitle title="Account" />
      <AccountIdentity user={state.userData} />
      {state.result && (
        <>
          <p role="status">{purchaseMessage(state.result)}</p>
          {state.result.attempt && <p>Purchase reference: {state.result.attempt}</p>}
          {(state.result.action === 'purchase' ||
            (state.result.action === 'pending' &&
              ['checkout_open', 'unknown_provider_outcome'].includes(
                state.result.reason,
              ))) && (
            <Button
              name={
                state.result.action === 'purchase'
                  ? 'Continue to Checkout'
                  : 'Continue same purchase'
              }
              isDisabledMessage={unavailable}
              callback={() => {
                void state.run('checkout');
              }}
            />
          )}
          {state.result.action === 'manage' && (
            <Button
              name="Manage billing in Stripe"
              isDisabledMessage={unavailable}
              callback={() => {
                void state.run('portal');
              }}
            />
          )}
        </>
      )}
      <Button
        name="Refresh account"
        isDisabledMessage={unavailable}
        callback={() => {
          void state.run('refresh');
        }}
      />
      {state.busy && <p role="status">Checking account…</p>}
      {state.error && <p role="alert">{state.error}</p>}
      <hr />
      <h2>Account deletion</h2>
      <p>
        Cancel your subscription in Stripe to stop renewal and keep your account. Account
        deletion is a separate, owner-assisted process. It does not automatically cancel
        billing, refund payments or immediately invalidate issued media links.
      </p>
      {state.result?.reason === 'deletion_pending' ? (
        <div>
          <p role="status">
            Deletion requested
            {state.result.requestedAt
              ? ` on ${new Date(state.result.requestedAt).toLocaleString()}`
              : ''}
            . New purchases are blocked. You can still log in and manage trusted billing.
          </p>
          <p>
            To withdraw this request, contact support through Help. The owner will review
            billing closure before deleting your account.
          </p>
          {state.result.notification && state.result.notification !== 'accepted' && (
            <p>
              Support notification delivery is unconfirmed. Your request is saved; contact
              support through Help so the owner can follow up.
            </p>
          )}
        </div>
      ) : (
        <div>
          <label>
            <input
              type="checkbox"
              checked={confirmDeletion}
              disabled={state.busy}
              onChange={(event) => setConfirmDeletion(event.target.checked)}
            />
            I request account deletion and understand that billing needs owner review.
          </label>
          <Button
            name="Request account deletion"
            isDisabledMessage={
              !confirmDeletion ? 'Confirm the deletion request first.' : unavailable
            }
            callback={() => {
              void state.run('delete');
            }}
          />
        </div>
      )}
      <Link to="/library">Help</Link>
    </Section>
  );
}
