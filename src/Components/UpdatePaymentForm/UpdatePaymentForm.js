import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AlertCard from '../Modal/AlertCard';
import Button from '../Button/Button';
import { init, send } from 'emailjs-com';

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
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  let navigate = useNavigate();
  const { state } = useLocation();

  const { stripe_id, first_name, email, subscription_id } = state;

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
    if (stripe_id) {
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
      await axios.put(
        // 'https://roop-verma-archive.herokuapp.com/api/payments/udpate-payment/',
        'http://localhost:5000/api/payments/update-payment',
        {
          stripe_id,
          subscription_id,
          payment_method: result.paymentMethod.id,
        }
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
