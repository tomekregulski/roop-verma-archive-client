import { useState } from 'react';
import { Link } from 'react-router-dom';

import { api, legacyKey, requestError } from '../api/client';
import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Input } from '../components/Input/Input';
import { useAuthContext } from '../context/AuthContext';
import { Login } from './Login';

export function Signup() {
  const { isAuth } = useAuthContext();
  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '' });
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api.post(`/user/${legacyKey}`, fields);
      // The returned customer ID is neither identity nor proof of provisioning.
      setSubmittedEmail(fields.email);
    } catch (failure) {
      setError(
        requestError(
          failure,
          'Registration could not be completed. If you already registered, try logging in. Otherwise wait and contact Help before repeating registration.',
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  if (isAuth)
    return (
      <p>
        You are logged in.{' '}
        <Link to="/manage-account">Continue to your account and subscription</Link>.
      </p>
    );
  if (submittedEmail) return <Login registrationEmail={submittedEmail} />;
  return (
    <div className="max-w-lg mx-auto mt-8">
      <p>Create an account, verify your email, then continue to hosted Checkout.</p>
      <Form handleSubmit={handleSubmit} isSubmitDisabled={busy} aria-busy={busy}>
        <Input
          id="signup-firstName"
          name="firstName"
          label="First name"
          type="text"
          required
          maxLength={100}
          isDisabledMessage={
            busy ? 'Account creation is in progress. Please wait.' : undefined
          }
          value={fields.firstName}
          callback={(event) => setFields({ ...fields, firstName: event.target.value })}
        />
        <Input
          id="signup-lastName"
          name="lastName"
          label="Last name"
          type="text"
          required
          maxLength={100}
          isDisabledMessage={
            busy ? 'Account creation is in progress. Please wait.' : undefined
          }
          value={fields.lastName}
          callback={(event) => setFields({ ...fields, lastName: event.target.value })}
        />
        <Input
          id="signup-email"
          name="email"
          label="Email"
          type="email"
          required
          maxLength={254}
          isDisabledMessage={
            busy ? 'Account creation is in progress. Please wait.' : undefined
          }
          value={fields.email}
          callback={(event) => setFields({ ...fields, email: event.target.value })}
        />
        <Button
          type="submit"
          name={busy ? 'Creating account request…' : 'Sign up'}
          isDisabledMessage={
            busy ? 'Account creation is in progress. Please wait.' : undefined
          }
          aria-busy={busy}
        />
      </Form>
      {error && (
        <p role="alert">
          {error} <Link to="/">Log in</Link> · <Link to="/library">Help</Link>
        </p>
      )}
    </div>
  );
}
