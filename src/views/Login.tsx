/* eslint-disable @typescript-eslint/no-empty-function */
import axios from 'axios';
import { init, send } from 'emailjs-com';
import jwt_decode from 'jwt-decode';
import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Input } from '../components/Input/Input';
import { UserData } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { getErrorMessage } from '../util/getErrorMessage';
import { logNetworkError } from '../util/logNetworkError';

const key = import.meta.env.VITE_API_KEY;
const supportEmailAddress = import.meta.env.VITE_RVDL_EMAIL_ADDRESS;
const emailJsUser = import.meta.env.VITE_EMAILJS_USER;

init(emailJsUser);

export function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;
    setEmail(value);
  };

  const sendLoginEmail = (user: UserData, emailKey: string) => {
    console.log({
      email,
      name: user.firstName,
      key: emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    });
    send('rvdl_forms', 'template_rgadtp9', {
      email,
      name: user.firstName,
      key: emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
        updateLoadingState(false);
      },
      async (error) => {
        updateLoadingState(false);
        console.error('Login email failed to send');
        console.error(error.text);
        updateAlertMessage([
          `Login process failed with error message: ${error.text}.`,
          `If this issue persists, please reach out to ${supportEmailAddress}`,
        ]);
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

  async function handleLogIn() {
    if (!email) {
      updateAlertMessage(['Please enter your email address.']);
      return;
    } else {
      try {
        updateLoadingState(true);
        const emailKeyResponse = await axios.get(
          `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
        );
        const token = emailKeyResponse.data.token;
        const decodedToken: UserData = jwt_decode(token);
        sendLoginEmail(decodedToken, token);
      } catch (error) {
        updateLoadingState(false);
        console.log('Login failed');
        const errorObj = getErrorMessage(error);
        logNetworkError({
          errorCode: errorObj.errorCode,
          errorMessage: errorObj.errorMessage,
          isRegisteredUser: false,
          userEmailAddress: 'N/A',
          userName: 'N/A',
        });
        updateAlertMessage([`Login error: ${errorObj.errorMessage}`]);
      }
    }
  }

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
        <Form id="login-form" handleSubmit={handleLogIn} isSubmitDisabled={!email}>
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
            width="250px"
          />
          <Button
            form="login-form"
            type="submit"
            margin="30px 0 0 0"
            width="100%"
            name="Log in"
            isDisabledMessage={!email ? 'Please enter an email address' : undefined}
          />
        </Form>
        <div style={{ marginTop: '20px' }}>
          Dont&apos;t have an account? <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ color: 'yellow' }}>
        Thank you! An email containing a link to complete your login process has been sent
        to your email address. It should appear within the next minute or so, and will
        have the subject line &quotYour Login Link - The Acharya Roop Verma Digital
        Library&quot.
      </div>
    );
  }
}
