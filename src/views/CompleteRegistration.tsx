import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, legacyKey, requestError } from '../api/client';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import { useAuthContext } from '../context/AuthContext';

export function CompleteRegistration() {
  const { isAuth, status, refreshSession } = useAuthContext();
  const [message, setMessage] = useState('');
  const lookup = useRef<Promise<void> | null>(null);
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const success = params.get('success') === 'true';
  const canceled = params.get('canceled') === 'true';
  useEffect(() => {
    if (!isAuth || !success || !sessionId) return;
    if (!lookup.current) {
      lookup.current = api
        .post(`/payment/checkout-session-object/${legacyKey}`, { sessionId })
        .then(
          async () => {
            await refreshSession();
            setMessage(
              'Checkout returned. Your current account status is available below; payment and subscription updates may still be pending.',
            );
          },
          (failure) => {
            setMessage(
              requestError(
                failure,
                'Unable to check this Checkout session. Use your account or contact Help.',
              ),
            );
          },
        );
    }
  }, [isAuth, success, sessionId, refreshSession]);
  if (status === 'loading') return <p role="status">Checking your session…</p>;
  return (
    <Section>
      <ViewTitle title="Checkout return" />
      {canceled ? (
        <p>Checkout was canceled. You can return to your account when ready.</p>
      ) : success && sessionId ? (
        <p role="status">{message || 'Checking your Checkout session…'}</p>
      ) : (
        <p>No valid Checkout return was provided.</p>
      )}
      {!isAuth && (
        <p>
          Please <Link to="/">log in</Link> to check your account. A return URL does not
          confirm payment.
        </p>
      )}
      <p>
        <Link to="/manage-account">View account</Link> · <Link to="/library">Help</Link>
      </p>
    </Section>
  );
}
