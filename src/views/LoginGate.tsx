import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { getErrorMessage } from '../util/getErrorMessage';
import { logNetworkError } from '../util/logNetworkError';

const key = import.meta.env.VITE_API_KEY;

export function LoginGate() {
  const { updateAuthStatus, updateUserData } = useAuthContext();
  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const navigate = useNavigate();

  useEffect(() => {
    // currently firing twice
    const effect = async () => {
      const url = window.location.href;
      const params = url.split('?')[1].split('&');
      const emailKey = params[0].split('=')[1];
      const email = params[1].split('=')[1];

      updateLoadingState(true);

      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_API_ORIGIN
            }/api/v1/auth/session-token/${key}/${email}/${emailKey}`,
          )
          .then((response) => {
            const token = response.data.authToken;
            document.cookie = `roop-verma-library=${token}`;
            updateAuthStatus(true);
            updateUserData(response.data.userData);
            updateLoadingState(false);
            navigate('/');
          });
      } catch (error) {
        console.error('Failed to log in');
        const errorObj = getErrorMessage(error);
        await logNetworkError({
          errorCode: errorObj.errorCode,
          errorMessage: errorObj.errorMessage,
          isRegisteredUser: true,
        });
        updateLoadingState(false);
        updateAlertMessage([`Failed to log in: `, errorObj.errorMessage]);
      }
    };
    effect();
  }, []);

  return <div>Please wait a moment while we log you in...</div>;
}
