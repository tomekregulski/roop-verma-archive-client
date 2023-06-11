import axios from 'axios';
import { useState } from 'react';

import { Alert } from '../components/Alert/Alert';
import { useAuthContext } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';

const key = import.meta.env.VITE_API_KEY;

export function ManageAccount() {
  const [message, setMessage] = useState('');

  const { userData } = useAuthContext();

  const handlePortal = async () => {
    try {
      const portalRes = await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/user/create-portal-session/${key}`,
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          customerId: userData!.stripeId,
        },
      );
      const portalAddress = portalRes.data.session.url;
      window.location.href = portalAddress;
    } catch (error) {
      console.log('Access user account failed');
      console.log(error);
      const errorMessage = getErrorMessage(error);
      setMessage(`Failed to create checkout session - : ${errorMessage}`);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button id="portal-session-button" type="button" onClick={() => handlePortal()}>
        Manage Account
      </button>
      {message !== '' && (
        <Alert closeAlert={() => setMessage('')} show={message !== '' ? true : false}>
          {message}
        </Alert>
      )}
    </div>
  );
}
