import React from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from '../Components/PaymentForm/PaymentForm';

const PUBLIC_KEY =
  'pk_test_51Jg7jKBlr8UFcXJymPB8I3ZU4z3vD7fIdgoWXQS3hDZsDCD98MMFDUozMO3C0hlCUL6stRdUbehbFZA7h7whWoDj00Q2mfpRZw';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Subscribe = () => {
  return (
    <>
      <h1>Enter Card Info</h1>
      <Elements stripe={stripeTestPromise}>
        <PaymentForm />
      </Elements>
    </>
  );
};

export default Subscribe;
