import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert } from '../components/Alert/Alert';
import { useAuthContext } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';

const key = import.meta.env.VITE_API_KEY;

export function LoginGate() {
  const [message, setMessage] = useState('');
  const { updateAuthStatus, updateUserData } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    // currently firing twice
    const effect = async () => {
      const url = window.location.href;
      const params = url.split('?')[1].split('&');
      const emailKey = params[0].split('=')[1];
      const email = params[1].split('=')[1];

      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_API_ORIGIN
            }/api/v1/auth/session-token/${key}/${email}/${emailKey}`,
          )
          .then((response) => {
            console.log(response);
            const token = response.data.authToken;
            document.cookie = `roop-verma-library=${token}`;
            updateAuthStatus(true);
            updateUserData(response.data.userData);
            navigate('/');
          });
      } catch (error) {
        console.log('Failed to log in');
        console.log(error);
        const errorMessage = getErrorMessage(error);
        setMessage(`Failed to log in: ${errorMessage}`);
      }
    };
    effect();
  }, []);

  return (
    <>
      <div>Please wait a moment while we log you in...</div>
      {message !== '' && (
        <Alert closeAlert={() => setMessage('')} show={message !== '' ? true : false}>
          {message}
        </Alert>
      )}
    </>
  );
}
