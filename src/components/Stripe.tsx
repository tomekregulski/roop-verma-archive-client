import React, { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import tw from 'twin.macro';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
console.log('here we go');

export function Stripe() {
    const handleEmailKey = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/signin`,
            {
                email: 'test@test.com',
            }
        );
        console.log(res);
    };
    return (
        <>
            <Elements stripe={stripePromise}>
                <PaymentForm />
            </Elements>
            <button
                css={tw`h-[100px] w-[200px] bg-red-200`}
                onClick={handleEmailKey}
            >
                Email Key
            </button>
        </>
    );
}
