import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, requestError } from '../api/client';
import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Input } from '../components/Input/Input';

const supportEmail = import.meta.env.VITE_RVDL_EMAIL_ADDRESS;
export function Login({ registrationEmail }: { registrationEmail?: string }) {
  const [email, setEmail] = useState(registrationEmail ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(Boolean(registrationEmail));
  const [retryAt, setRetryAt] = useState(0);
  const [, tick] = useState(0);
  const started = useRef(false);
  const requestPending = useRef(false);

  async function requestLogin(address: string) {
    if (requestPending.current) return false;
    requestPending.current = true;
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/login', { email: address.trim() });
      setMessage(
        'If an eligible account exists, a login link may arrive. Check your inbox and spam folder. Links expire after 15 minutes and work once.',
      );
      setRetryAt(Date.now() + 60000);
      return true;
    } catch (failure) {
      setError(
        requestError(
          failure,
          'Unable to request a login link. Check your connection and try again.',
        ),
      );
      setRetryAt(Date.now() + 60000);
      return false;
    } finally {
      requestPending.current = false;
      setBusy(false);
    }
  }

  // No public readiness endpoint exists. Three generic requests accommodate a
  // delayed customer.created webhook without probing account existence.
  useEffect(() => {
    if (!registrationEmail || started.current) return;
    started.current = true;
    void requestLogin(registrationEmail).then((ok) => {
      if (!ok) setWaiting(false);
    });
  }, [registrationEmail]);
  useEffect(() => {
    if (!registrationEmail || !waiting) return;
    const second = window.setTimeout(() => {
      void requestLogin(registrationEmail).then((ok) => {
        if (!ok) setWaiting(false);
      });
    }, 20000);
    const third = window.setTimeout(() => {
      void requestLogin(registrationEmail).finally(() => setWaiting(false));
    }, 40000);
    return () => {
      window.clearTimeout(second);
      window.clearTimeout(third);
    };
  }, [registrationEmail, waiting]);
  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setInterval(() => tick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);
  const cooldown = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  const isSubmitDisabled = busy || waiting || cooldown > 0;
  const buttonName = busy
    ? 'Requesting login link…'
    : waiting
    ? 'Waiting for account setup…'
    : cooldown > 0
    ? `Retry in ${cooldown}s`
    : 'Request login link';
  const disabledMessage = busy
    ? 'A login request is in progress. Please wait.'
    : waiting
    ? 'Waiting for account setup. Automatic retries are in progress.'
    : cooldown > 0
    ? `Wait ${cooldown} seconds before requesting another link.`
    : undefined;
  return (
    <div className="max-w-lg mx-auto mt-8">
      {registrationEmail && (
        <p>
          Account setup depends on payment-provider processing. We will request a login
          link up to three times over 40 seconds. This does not confirm account creation
          or email delivery. Verify your mailbox before continuing to Checkout.
        </p>
      )}
      <Form
        isSubmitDisabled={isSubmitDisabled}
        aria-busy={busy || waiting}
        handleSubmit={() => {
          void requestLogin(email);
        }}
      >
        <Input
          id="email-login-input"
          name="email"
          label="Email address"
          type="email"
          required
          maxLength={254}
          value={email}
          isDisabledMessage={
            busy
              ? 'A login request is in progress. Please wait.'
              : waiting
              ? 'Waiting for account setup. Automatic retries are in progress.'
              : undefined
          }
          callback={(event) => setEmail(event.target.value)}
        />
        <Button
          type="submit"
          name={buttonName}
          isDisabledMessage={disabledMessage}
          aria-busy={busy || waiting}
        />
      </Form>
      {message && <p role="status">{message}</p>}
      {error && (
        <p role="alert">
          {error} <Link to="/library">Get help</Link>
        </p>
      )}
      {!waiting && message && (
        <p>
          No link? Check the address and spam folder, wait a minute, then retry. Account
          setup or email service may be delayed.{' '}
          {supportEmail ? (
            <a href={`mailto:${supportEmail}`}>Contact support</a>
          ) : (
            <Link to="/library">Visit Help</Link>
          )}{' '}
          if it continues. Repeating registration may create another customer; use login
          retry first.
        </p>
      )}
      {!registrationEmail && (
        <p>
          New here? <Link to="/signup">Sign up</Link>
        </p>
      )}
    </div>
  );
}
