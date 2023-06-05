import axios from 'axios';
import { init, send } from 'emailjs-com';
// import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';

import { Button } from '../components/Button/Button';
// import { UserData } from '../context/AuthContext';

const key = import.meta.env.VITE_API_KEY;

init('user_sWNT4oROPiAoUGksmqFlD');

export function CompleteRegistration() {
  const [emailSent, setEmailSent] = useState(false);
  const [emailInfo, setEmailInfo] = useState({
    name: '',
    email: '',
    emailKey: '',
  });

  const sendLoginEmail = () => {
    console.log(emailInfo);
    send('rvdl_forms', 'template_rgadtp9', {
      email: emailInfo.email,
      name: emailInfo.name,
      key: emailInfo.emailKey,
      baseUrl: import.meta.env.VITE_API_ORIGIN,
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

  useEffect(() => {
    const effect = async () => {
      if (Object.values(emailInfo).every((v) => v === '')) {
        const url = window.location.href;
        const params = url.split('?')[1].split('&');
        const sessionParam = params[1].split('&');
        const sessionId = sessionParam[0].split('=')[1];

        const session = await axios.post(
          `${
            import.meta.env.VITE_API_ORIGIN
          }/api/v1/payment/checkout-session-object/${key}`,
          {
            sessionId,
          },
        );
        const { name, email } = session.data.customer_details;

        const emailKeyResponse = await axios.get(
          `${import.meta.env.VITE_API_ORIGIN}/api/v1/auth/email-token/${key}/${email}`,
        );

        const token = emailKeyResponse.data.token;

        setEmailInfo({
          name,
          email,
          emailKey: token,
        });
      }
    };
    effect();
  }, []);

  if (!emailSent) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        <div>
          Your Registration is Almost Complete. Please press the button below to complete
          the process.
        </div>
        <Button
          callback={sendLoginEmail}
          margin="10px 0 0 0"
          width="300px"
          name="Complete Registration"
        />
      </div>
    );
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        We have sent you an email to confirm your subscription. Please check it and follow
        the link provided to log in.
      </div>
    </>
  );
}
