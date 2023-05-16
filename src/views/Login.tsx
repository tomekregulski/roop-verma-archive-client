/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { init, send } from 'emailjs-com';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';

const key = import.meta.env.VITE_API_KEY;

init('user_sWNT4oROPiAoUGksmqFlD');

export function Login() {
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;
    setEmail(value);
  };

  const sendConfirmationEmail = (name: string) => {
    send('rvdl_forms', 'template_lj7tqph', {
      email,
      name,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    );
  };

  const handleSignIn = async () => {
    console.log('signing in...');
    const token = await axios.post(
      `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/login/${key}`,
      {
        email,
      },
    );
    console.log(token);
    // need to get name
    sendConfirmationEmail(token.data.name);
  };

  if (!emailSent) {
    return (
      <>
        <Input
          label="Email"
          value={email}
          type="email"
          callback={handleChange}
          name="email"
          labelColor="white"
          margin="10px 0 0 0"
          id="email-login-input"
        />
        <Button callback={handleSignIn} margin="30px 0 0 0" width="100%" name="Log in" />
        <span>or</span>
        <Link to="/signup">
          <Button callback={() => {}} margin="10px 0 0 0" width="100%" name="Sign up" />
        </Link>
      </>
    );
  }
  return (
    <>
      <div>An email with a login link has been sent to your inbox.</div>
    </>
  );
}
