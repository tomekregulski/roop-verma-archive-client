import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

import Button from '../Button/Button';

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
  const [isAuth, setIsAuth] = auth;

  const stripe = useStripe();
  const elements = useElements();

  let navigate = useNavigate();
  const { state } = useLocation();
  const { id, first_name, last_name, email } = state;

  const success = (token) => {
    document.cookie = `roop-verma-library=${token}`;
    setIsAuth(true);
    navigate('/');
  };

  const handleSubmit = async (event) => {
    console.log('pay');
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
      console.log(result.paymentMethod);
      const res = await axios.post(
        'https://roop-verma-archive.herokuapp.com/api/payments/subscribe',
        // 'http://localhost:5000/api/payments/subscribe/',
        {
          payment_method: result.paymentMethod.id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          id: id,
        }
      );

      const { userData, client_secret, status, token } = res.data;
      console.log(userData);

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function (result) {
          if (result.error) {
            console.log('There was an issue.');
            console.log(result.error);
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
    <form onSubmit={handleSubmit} style={{ width: '500px' }}>
      <p style={{ color: 'white', marginBottom: '20px' }}>Enter Card Info</p>
      <div
        style={{
          border: 'solid 1px white',
          padding: '5px',
          borderRadius: '5px',
        }}
      >
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div>
        <Button
          margin='20px 0 0 0'
          width='150px'
          name='Subscribe'
          callback={handleSubmit}
        />
      </div>
    </form>
  );
};

export default PaymentForm;
