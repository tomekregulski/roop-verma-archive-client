import React from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import UpdatePaymentForm from '../Components/UpdatePaymentForm/UpdatePaymentForm';

import './styles/subscribeStyles.css';

const PUBLIC_KEY =
  'pk_test_51Jg7jKBlr8UFcXJymPB8I3ZU4z3vD7fIdgoWXQS3hDZsDCD98MMFDUozMO3C0hlCUL6stRdUbehbFZA7h7whWoDj00Q2mfpRZw';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const UpdatePaymentMethod = () => {
  return (
    <div className='subscribe--container'>
      <div>
        <Elements stripe={stripeTestPromise}>
          <UpdatePaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default UpdatePaymentMethod;
