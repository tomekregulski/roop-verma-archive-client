import axios from 'axios';
import { init, send } from 'emailjs-com';
import { useEffect, useState } from 'react';

import { Button } from '../components/Button/Button';
import { useNotificationContext } from '../context/NotificationContext';
import { getErrorMessage } from '../util/getErrorMessage';
import { logNetworkError } from '../util/logNetworkError';

const key = import.meta.env.VITE_API_KEY;
const emailJsUser = import.meta.env.VITE_EMAILJS_USER;
const supportEmailAddress = import.meta.env.VITE_RVDL_EMAIL_ADDRESS;

init(emailJsUser);

export function CompleteRegistration() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInfo, setEmailInfo] = useState({
    name: '',
    email: '',
    emailKey: '',
  });

  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const sendEmail = async () => {
    send('rvdl_forms', 'template_rgadtp9', {
      email: emailInfo.email,
      name: emailInfo.name,
      key: emailInfo.emailKey,
      baseUrl: import.meta.env.VITE_CLIENT_URL,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        setEmailSent(true);
        updateLoadingState(false);
      },
      async (error) => {
        console.log('Login email failed to send');
        updateLoadingState(false);
        const { errorMessage, errorCode } = getErrorMessage(error.text);
        await logNetworkError({
          errorCode: errorCode,
          errorMessage: errorMessage,
          isRegisteredUser: false,
        });
        updateAlertMessage(['Login email failed to send:', errorMessage]);
      },
    );
  };

  const sendLoginEmail = () => {
    updateLoadingState(true);
    sendEmail();
  };

  async function getEmailKey(name: string, email: string) {
    try {
      const emailKeyResponse = await axios.get(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
      );

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
      const { errorMessage, errorCode } = getErrorMessage(error);
      await logNetworkError({
        errorCode: errorCode,
        errorMessage: errorMessage,
        isRegisteredUser: true,
        userEmailAddress: email,
        userName: name,
      });
      updateAlertMessage(['Failed to retrieve login token:', errorMessage]);
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

        try {
          const session = await axios.post(
            `${
              import.meta.env.VITE_API_ORIGIN
            }/api/v1/payment/checkout-session-object/${key}`,
            {
              sessionId,
            },
          );
          const { name, email } = session.data.customer_details;

          getEmailKey(name, email);
        } catch (error) {
          console.log('Failed to complete the registration process');
          console.log(error);
          const { errorMessage, errorCode } = getErrorMessage(error);
          logNetworkError({
            errorCode,
            errorMessage: `Failed to complete the registration process: ${errorMessage}`,
            isRegisteredUser: false,
            userEmailAddress: 'N/A',
            userName: 'N/A',
          });
          updateAlertMessage([
            'Failed to complete the registration process:',
            errorMessage,
            `Please reach out to ${supportEmailAddress} with a reference to this message`,
          ]);
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
            <Button callback={sendLoginEmail} name="Complete Registration" />
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
            <p>
              We have sent you an email to confirm your subscription. Please check it and
              follow the link provided to log in.
            </p>
            <p>You may close this window now.</p>
          </div>
        )}
      </>
    );
  }

  return isSuccess ? <RenderSuccess /> : <RenderCancel />;
}
