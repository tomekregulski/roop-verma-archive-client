/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { init, send } from 'emailjs-com';
import jwt_decode from 'jwt-decode';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { logNetworkError } from 'util/logNetworkError';

import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { LoadingNotification } from '../components/LoadingNotification/LoadingNotification';
import { UserData } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';

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

  const sendLoginEmail = (user: UserData, emailKey: string) => {
    send('rvdl_forms', 'template_rgadtp912345', {
      email,
      name: user.firstName,
      key: emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
        setLoading(false);
      },
      async (error) => {
        setLoading(false);
        console.log('Login email failed to send');
        console.log(error.text);
        // const errorMessage = getErrorMessage(error.text);
        setMessage(
          `Unable to complete login process. If this issue persists, please reach out to RVDL_EMAIL_ADDRESS`,
        );
        await logNetworkError({
          errorCode: error.status,
          errorMessage: error.text,
          isRegisteredUser: true,
          userId: user.id,
          userEmailAddress: user.email,
          userName: `${user.firstName} ${user.lastName}`,
        });
      },
    );
  };

  const handleLogIn = async () => {
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    } else {
      try {
        const emailKeyResponse = await axios.get(
          `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
        );
        const token = emailKeyResponse.data.token;
        const decodedToken: UserData = jwt_decode(token);
        // const name = decodedToken.firstName;
        sendLoginEmail(decodedToken, token);
        setLoading(true);
      } catch (error) {
        console.log('Login failed');
        console.log(error);
        const errorMessage = getErrorMessage(error);
        setMessage(`Login error: ${errorMessage}`);
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
          marginTop: '50px',
        }}
      >
        <div style={{ width: '250px' }}>
          <Input
            label="Enter email to log in"
            value={email ?? ''}
            type="email"
            callback={handleChange}
            name="email"
            labelColor="white"
            margin="10px 0 0 0"
            id="email-login-input"
            placeholder="Email"
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
          Thank you! An email containing a link to complete your login process has been
          sent to your email address. It should appear within the next minute or so, and
          will have the subject line &quotYour Login Link - The Acharya Roop Verma Digital
          Library&quot.
        </div>
      </>
    );
  }
}
