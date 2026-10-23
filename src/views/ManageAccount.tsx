import { useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, legacyKey, requestError } from '../api/client';
import { Button } from '../components/Button/Button';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import { useAuthContext } from '../context/AuthContext';
import { handleCheckout } from '../util/handleCheckout';

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
      <p>
        {userData.firstName} {userData.lastName} — {userData.email}
      </p>
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
