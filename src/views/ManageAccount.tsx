// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Alert } from '../components/Alert/Alert';
import { useAuthContext } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';

const key = import.meta.env.VITE_API_KEY;

// const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function ManageAccount() {
  const [message, setMessage] = useState('');

  const { userData, updateUserData } = useAuthContext();

  // useEffect(() => {
  //   async function getSubscriptions() {
  //     if (userData && stripe) {
  //       const subscription = await stripe!.subscriptions.list({
  //         customer: userData.id,
  //         tatus: 'active',
  //       });
  //       console.log(subscription);
  //     }
  //   }
  //   getSubscriptions();
  // }, [userData, stripe]);

  // need to handle this properly when returning from session
  // return from portal session with session id in url
  // useEffect checks if this exists, and if so
  // if it does, check stripe from customer subscription status
  // if it is different than the status in userData, upate the status
  // if status === false, update auth status.
  // useEffect(() => {
  //   console.log(userData);
  //   async function effect() {
  //     let returnedFromPortalSession = false;
  //     const url = window.location.href.split('?');
  //     if (url.length > 1 && url[1].split('=')[1] === 'true') {
  //       returnedFromPortalSession = true;
  //     }
  //     console.log(returnedFromPortalSession);
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     console.log(userData!);
  //     // get user info from Stripe
  //     if (userData) {
  //       try {
  //         const res = await axios.post(
  //           `${
  //             import.meta.env.VITE_API_ORIGIN
  //           }/api/v1/user/update-subscription-status/${key}`,
  //           {
  //             email: userData.email,
  //             isSubscriptionActive: userData.subscriptionActive,
  //           },
  //         );
  //         console.log(res);
  //         if (res.data.userData.subscriptionActive !== userData.subscriptionActive) {
  //           updateUserData(res.data.userData);
  //         }
  //       } catch (error) {
  //         console.log('Failed to log in');
  //         console.log(error);
  //         const errorMessage = getErrorMessage(error);
  //         console.log(`Failed to log in: ${errorMessage}`);
  //       }
  //     }
  //   }
  //   if (userData) {
  //     effect();
  //   }
  // }, [userData]);
  console.log(userData);

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
