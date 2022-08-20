import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AlertCard from '../Modal/AlertCard';
import Button from '../Button/Button';
import { init, send } from 'emailjs-com';

import axios from 'axios';

import './paymentFormStyles.css';

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
  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [message, setMessage] = useState('');

  const key = process.env.REACT_APP_API_KEY;

  const stripe = useStripe();
  const elements = useElements();

  let navigate = useNavigate();
  const { state } = useLocation();

  const { id, first_name, last_name, email, stripe_id } = state.userData;

  const sendConfirmationEmail = () => {
    send('rvdl_forms', 'template_lj7tqph', {
      email,
      name: first_name,
    }).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (error) => {
        console.log('FAILED...', error);
      }
    );
  };

  const success = (token) => {
    document.cookie = `roop-verma-library=${token}`;
    setIsAuth(true);
    sendConfirmationEmail();
    if (!stripe_id) {
      navigate('/');
    }
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
      console.log(result.error.message);
    } else {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ORIGIN}/api/v1/payments/subscribe/${key}`,
        {
          payment_method: result.paymentMethod.id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          id: id,
        }
      );

      const { client_secret, status, token } = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function (result) {
          if (result.error) {
            console.log('There was an issue.');
            console.log(result.error);
            setMessage(result.error);
          } else {
            console.log('Subscription success!');
            success(token);
          }
        });
      } else {
        console.log('Subscription success!');
        success(token);
      }
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
          name='Subscribe'
          callback={handlePaymentSubmit}
        />
      </div>
      {message !== '' && (
        <AlertCard
          closeAlert={() => setMessage('')}
          show={message !== '' ? true : false}
        >
          {message}
        </AlertCard>
      )}
    </form>
  );
};

export default PaymentForm;
