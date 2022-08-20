import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AlertCard from '../Modal/AlertCard';
import Button from '../Button/Button';
import { init, send } from 'emailjs-com';
import { fetchJwt } from '../../Utils/fetchJwt';

import axios from 'axios';

import '../PaymentForm/paymentFormStyles.css';

init('user_sWNT4oROPiAoUGksmqFlD');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: 'white',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',

      '::placeholder': {
        color: 'white',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export const PaymentForm = () => {
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stripeInfo, setStripeInfo] = useState({
    stripe_id: '',
    subscription_id: '',
  });
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

  const { id, email, first_name } = userData;

  useEffect(() => {
    try {
      const jwt = fetchJwt();
      if (!jwt) {
        setMessage('Error: cannot find valid token');
        return;
      }
      const fetchUserStripeInfo = async () => {
        const userStripeInfo = await axios.get(
          `${process.env.REACT_APP_API_ORIGIN}/api/v1/users/${id}/${key}`,
          jwt
        );
        setStripeInfo({
          stripe_id: userStripeInfo.data.stripe_id,
          subscription_id: userStripeInfo.data.subscription_id,
        });
      };
      fetchUserStripeInfo();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        'Error: Cannot locate subscription information. Please refresh the page to try again, If the issue persists, please reach send a message to support.'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stripe = useStripe();
  const elements = useElements();

  const key = process.env.REACT_APP_API_KEY;

  let navigate = useNavigate();

  const sendConfirmationEmail = () => {
    send('rvdl_forms', 'template_rgadtp9', {
      email,
      name: first_name,
    }).then(
      (response) => {
        console.log('Email successfully sent', response.status, response.text);
      },
      (error) => {
        console.error('Email did not send', error);
      }
    );
  };

  const success = () => {
    sendConfirmationEmail();
    if (stripeInfo.stripe_id !== '') {
      setStripeInfo({});
      navigate('/account');
    }
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Disable form submissions until Stripe has loaded
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      const jwt = fetchJwt();
      if (!jwt) {
        setMessage('Error: cannot find valid token');
        return;
      }
      await axios.put(
        `${process.env.REACT_APP_API_ORIGIN}/api/v1/payments/update-payment/${key}`,
        {
          stripe_id: stripeInfo.stripe_id,
          subscription_id: stripeInfo.stripe_id,
          payment_method: result.paymentMethod.id,
        },
        jwt
      );
      setMessage('Payment Method Update Success!');
    }
  };

  return (
    <form className='payment-form--container' onSubmit={handlePaymentSubmit}>
      <p>Enter Card Info</p>
      <div className='payment-form--card-element-container'>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div>
        <Button
          margin='20px 0 0 0'
          width='150px'
          name='Update Payment'
          callback={handlePaymentSubmit}
        />
      </div>
      {message !== '' && (
        <AlertCard
          closeAlert={() => {
            setMessage('');
            success();
          }}
          show={message !== '' ? true : false}
        >
          {message}
        </AlertCard>
      )}
      {errorMessage !== '' && (
        <AlertCard
          closeAlert={() => {
            setErrorMessage('');
          }}
          show={message !== '' ? true : false}
        >
          {message}
        </AlertCard>
      )}
    </form>
  );
};

export default PaymentForm;
