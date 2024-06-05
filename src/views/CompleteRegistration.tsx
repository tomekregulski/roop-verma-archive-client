import axios from 'axios';
import { init, send } from 'emailjs-com';
// import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';

import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { LoadingNotification } from '../components/LoadingNotification/LoadingNotification';
import { getErrorMessage } from '../util/getErrorMessage';
import { logNetworkError } from '../util/logNetworkError';
// import { UserData } from '../context/AuthContext';

const key = import.meta.env.VITE_API_KEY;

init('user_sWNT4oROPiAoUGksmqFlD');

export function CompleteRegistration() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInfo, setEmailInfo] = useState({
    name: '',
    email: '',
    emailKey: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendEmail = () => {
    send('rvdl_forms', 'template_rgadtp9', {
      email: emailInfo.email,
      name: emailInfo.name,
      key: emailInfo.emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
        setLoading(false);
      },
      (error) => {
        console.log('Login email failed to send');
        console.log(error);
        const errorMessage = getErrorMessage(error.text);
        setMessage(`Login email failed to send: ${errorMessage}`);
      },
    );
  };

  const sendLoginEmail = () => {
    sendEmail();
    setLoading(true);
  };

  async function getEmailKey(name: string, email: string) {
    try {
      const emailKeyResponse = await axios.get(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
      );

      console.log(emailKeyResponse);

      const token = emailKeyResponse.data.token;

      console.log({
        name,
        email,
        emailKey: token,
      });

      setEmailInfo({
        name,
        email,
        emailKey: token,
      });
    } catch (error) {
      console.log('Failed to retrieve login token');
      console.log(error);
      const errorMessage = getErrorMessage(error);
      setMessage(`Failed to retrieve login token: ${errorMessage}`);
    }
  }

  useEffect(() => {
    if (Object.values(emailInfo).every((v) => v === '')) {
      const url = window.location.href;
      const successOrCancel = url.split('?')[1].split('=')[0];
      const success = successOrCancel === 'success';
      setIsSuccess(success);
    }
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (isSuccess) {
        const url = window.location.href;
        const params = url.split('?')[1].split('&');
        const sessionParam = params[1].split('&');
        const sessionId = sessionParam[0].split('=')[1];
        console.log('sessionId: ', sessionId);
        try {
          const session = await axios.post(
            `${
              import.meta.env.VITE_API_ORIGIN
            }/api/v1/payment/checkout-session-object/${key}`,
            {
              sessionId,
            },
          );
          console.log('session: ', session);
          const { name, email } = session.data.customer_details;
          console.log(name, email);

          // await axios.post(
          //   `${
          //     import.meta.env.VITE_API_ORIGIN
          //   }/api/v1/user/update-subscription-status/${key}`,
          //   {
          //     email,
          //     isSubscriptionActive: true,
          //   },
          // );

          getEmailKey(name, email);
        } catch (error) {
          console.log('Failed to retrieve checkout session');
          console.log(error);
          const errorMessage = getErrorMessage(error);
          logNetworkError({
            errorCode: 0,
            errorMessage: `Failed to retrieve checkout session: ${errorMessage}`,
            isRegisteredUser: false,
            userEmailAddress: 'N/A',
            userName: 'N/A',
          });
          setMessage(`Failed to retrieve checkout session: ${errorMessage}`);
        }
      }
    };
    effect();
  }, [isSuccess]);

  function RenderCancel() {
    return (
      <div className="flex items-center justify-center pt-8">
        Subscription process cancelled. To resume the process, please return to the home
        page and begin again.
      </div>
    );
  }

  function RenderSuccess() {
    return (
      <>
        {!emailSent ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '46px auto 0',
            }}
          >
            <div>
              Your Registration is Almost Complete. Please press the button below to
              complete the process.
            </div>
            <Button
              callback={sendLoginEmail}
              margin="10px 0 0 0"
              width="300px"
              name="Complete Registration"
            />
            {message !== '' && (
              <Alert
                closeAlert={() => setMessage('')}
                show={message !== '' ? true : false}
              >
                {message}
              </Alert>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            We have sent you an email to confirm your subscription. Please check it and
            follow the link provided to log in.
          </div>
        )}
        {loading && (
          <LoadingNotification show={loading}>Please wait...</LoadingNotification>
        )}
      </>
    );
  }

  return <>{isSuccess ? <RenderSuccess /> : <RenderCancel />}</>;
}
