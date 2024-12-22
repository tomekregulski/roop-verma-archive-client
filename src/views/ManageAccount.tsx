import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { /* useEffect,*/ useEffect, useState } from 'react';

import { Alert } from '../components/Alert/Alert';
import { useAuthContext } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';

const key = import.meta.env.VITE_API_KEY;
const accountUpdateKey = import.meta.env.VITE_ACCOUNT_UPDATE_KEY;

export function ManageAccount() {
  const [message, setMessage] = useState('');

  const stripe = useStripe();

  const { userData, hasAllowedStatus /* updateUserData*/ } = useAuthContext();

  useEffect(() => {
    const effect = async () => {
      const url = window.location.href;
      const params = url.split('?');
      if (params && userData && params.includes('account-updated')) {
        console.log(params);
        console.log(accountUpdateKey);
        //   try {
        //     await axios
        //       .get(
        //         `${
        //           import.meta.env.VITE_API_ORIGIN
        //         }/api/v1/auth/account-update-token/${key}/${userData.email}/09876`,
        //       )
        //       .then((response) => {
        //         console.log(response);
        //         const token = response.data.authToken;
        //         document.cookie = `roop-verma-library=${token}`;
        //         updateUserData(response.data.userData);
        //       });
        //   } catch (error) {
        //     console.log('Failed to update information');
        //     console.log(error);
        //     const errorMessage = getErrorMessage(error);
        //     setMessage(`Failed to update info: ${errorMessage}`);
        //   }
      }
    };
    effect();
  }, []);

  // useEffect(() => {
  //   const get = async () => {
  //     const stripeResponse = await getStripe();
  //     setStripe(stripeResponse);
  //   };
  //   get();
  // }, []);

  // const handleResubscribe = async () => {
  //   console.log('resubscribing');
  //   console.log(userData?.stripeId);
  //   if (stripe && stripe.data && userData) {
  //     try {
  //       const subscriptionRes = await axios.get(
  //         `${
  //           import.meta.env.VITE_API_ORIGIN
  //         }/api/v1/payment/checkout-session-resubscribe/${key}/${userData?.stripeId}`,
  //       );

  //       const sessionId = subscriptionRes.data.id;
  //       // const stripe = await getStripe();
  //       const { error } = await stripe.data.redirectToCheckout({
  //         //     //     // Make the id field from the Checkout Session creation API response
  //         //     //     // available to this file, so you can provide it as parameter here
  //         //     //     // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
  //         sessionId,
  //       });
  //       // If `redirectToCheckout` fails due to a browser or network
  //       // error, display the localized error message to your customer
  //       // using `error.message`.
  //       console.warn(error.message);
  //     } catch (error) {
  //       console.log('Stripe checkout failed');
  //       console.log(error);
  //       const errorMessage = getErrorMessage(error);
  //       setMessage(`Failed to create checkout session - : ${errorMessage}`);
  //     }
  //   } else {
  //     console.log('stripe not found');
  //   }
  // };

  const handleCheckout = async () => {
    if (stripe && userData) {
      try {
        const subscriptionRes = await axios.get(
          `${
            import.meta.env.VITE_API_ORIGIN
          }/api/v1/payment/checkout-session-resubscribe/${key}/${userData.stripeId}`,
        );

        const sessionId = subscriptionRes.data.id;
        // const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          //     //     // Make the id field from the Checkout Session creation API response
          //     //     // available to this file, so you can provide it as parameter here
          //     //     // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId,
        });
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message);
      } catch (error) {
        console.log('Stripe checkout failed');
        console.log(error);
        const errorMessage = getErrorMessage(error);
        setMessage(`Failed to create checkout session - : ${errorMessage}`);
      }
    } else {
      console.log('stripe not found');
    }
  };

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '32px',
      }}
    >
      <button id="portal-session-button" type="button" onClick={() => handlePortal()}>
        Manage Account
      </button>
      {/* This causes the database to crash  */}
      {!hasAllowedStatus && (
        <button type="button" onClick={() => handleCheckout()}>
          resubscribe
        </button>
      )}
      {message !== '' && (
        <Alert closeAlert={() => setMessage('')} show={message !== '' ? true : false}>
          {message}
        </Alert>
      )}
      {/* {userData?.subscriptionActive === false && (
        <button type="button" onClick={() => handleResubscribe()}>
          Resubscribe
        </button>
      )} */}
    </div>
  );
}
