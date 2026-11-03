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

  // Registration is local and synchronous. Request one email proof, including in StrictMode.
  useEffect(() => {
    if (!registrationEmail || started.current) return;
    started.current = true;
    void requestLogin(registrationEmail);
  }, [registrationEmail]);
  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setInterval(() => tick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);
  const cooldown = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
  const isSubmitDisabled = busy || cooldown > 0;
  const buttonName = busy
    ? 'Requesting login link…'
    : cooldown > 0
    ? `Retry in ${cooldown}s`
    : 'Request login link';
  const disabledMessage = busy
    ? 'A login request is in progress. Please wait.'
    : cooldown > 0
    ? `Wait ${cooldown} seconds before requesting another link.`
    : undefined;
  return (
    <div className="max-w-lg mx-auto mt-8">
      {registrationEmail && (
        <p>
          Your account request is ready. Verify your email using the login link before
          continuing to Checkout.
        </p>
      )}
      <Form
        isSubmitDisabled={isSubmitDisabled}
        aria-busy={busy}
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
            busy ? 'A login request is in progress. Please wait.' : undefined
          }
          callback={(event) => setEmail(event.target.value)}
        />
        <Button
          type="submit"
          name={buttonName}
          isDisabledMessage={disabledMessage}
          aria-busy={busy}
        />
      </Form>
      {message && <p role="status">{message}</p>}
      {error && (
        <p role="alert">
          {error} <Link to="/library">Get help</Link>
        </p>
      )}
      {message && (
        <p>
          No link? Check the address and spam folder, wait a minute, then retry. Account
          setup or email service may be delayed.{' '}
          {supportEmail ? (
            <a href={`mailto:${supportEmail}`}>Contact support</a>
          ) : (
            <Link to="/library">Visit Help</Link>
          )}{' '}
          if it continues. Use login retry; you do not need to repeat signup.
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
