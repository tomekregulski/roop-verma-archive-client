import React, { useContext, useState } from 'react';
// import { AuthContext } from '../../Context/AuthContext';
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
  // const { auth } = useContext(AuthContext);
  // const [isAuth, setIsAuth] = auth;
  const [message, setMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  let navigate = useNavigate();
  const { state } = useLocation();

  const { id, stripe_id, first_name, last_name, email, subscription_id } =
    state;

  console.log('subscription_id:', subscription_id);

  // const sendConfirmationEmail = () => {
  //   send('rvdl_forms', 'template_rgadtp9', {
  //     email,
  //     name: first_name,
  //   }).then(
  //     (response) => {
  //       console.log('SUCCESS!', response.status, response.text);
  //     },
  //     (error) => {
  //       console.log('FAILED...', error);
  //     }
  //   );
  // };

  const success = (token) => {
    document.cookie = `roop-verma-library=${token}`;
    // sendConfirmationEmail();
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

    console.log(result);

    if (result.error) {
      console.log(result.error.message);
    } else {
      const res = await axios.put(
        // 'https://roop-verma-archive.herokuapp.com/api/payments/udpate-payment/',
        'http://localhost:5000/api/payments/update-payment',
        {
          stripe_id,
          subscription_id,
          payment_method: result.paymentMethod.id,
        }
      );

      console.log('Payment Method Update Success!');
      console.log(res);

      // const { client_secret, status, token } = res.data;

      //   if (status === 'requires_action') {
      //     stripe.confirmCardPayment(client_secret).then(function (result) {
      //       if (result.error) {
      //         console.log('There was an issue.');
      //         console.log(result.error);
      //         setMessage(result.error);
      //       } else {
      //         console.log('Payment Method Update Success!');
      //         success(token);
      //       }
      //     });
      //   } else {
      //     console.log('Payment Method Update Success!');
      //     success(token);
      //   }
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
