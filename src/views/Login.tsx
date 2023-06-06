/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { init, send } from 'emailjs-com';
import jwt_decode from 'jwt-decode';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { LoadingNotification } from '../components/LoadingNotification/LoadingNotification';
import { UserData } from '../context/AuthContext';

const key = import.meta.env.VITE_API_KEY;

init('user_sWNT4oROPiAoUGksmqFlD');

export function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;
    setEmail(value);
  };

  const sendLoginEmail = (name: string, emailKey: string) => {
    console.log(emailKey);
    console.log(import.meta.env.VITE_CLIENT_URL);
    send('rvdl_forms', 'template_rgadtp9', {
      email,
      name,
      key: emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
        setLoading(false);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    );
  };

  const handleLogIn = async () => {
    console.log('handling login');
    console.log(email);
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    } else {
      try {
        console.log('signing in...');
        const emailKeyResponse = await axios.get(
          `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
        );
        const token = emailKeyResponse.data.token;
        const decodedToken: UserData = jwt_decode(token);
        const name = decodedToken.firstName;
        sendLoginEmail(name, token);
        setLoading(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (!emailSent) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '300px',
        }}
      >
        <div style={{ width: '250px' }}>
          <Input
            label="Email"
            value={email ?? ''}
            type="email"
            callback={handleChange}
            name="email"
            labelColor="white"
            margin="10px 0 0 0"
            id="email-login-input"
          />
        </div>
        <Button callback={handleLogIn} margin="30px 0 0 0" width="100%" name="Log in" />
        <div style={{ marginTop: '20px' }}>
          Dont&apos;t have an account? <Link to="/signup">Sign up!</Link>
        </div>
        {message !== '' && (
          <Alert closeAlert={() => setMessage('')} show={message !== '' ? true : false}>
            {message}
          </Alert>
        )}
        {loading && (
          <LoadingNotification show={loading}>Please wait...</LoadingNotification>
        )}
      </div>
    );
  } else {
    return (
      <>
        <div style={{ color: 'yellow' }}>
          Thank you! An email with a login link to complete your login process has been
          sent to your inbox.
        </div>
      </>
    );
  }
}
