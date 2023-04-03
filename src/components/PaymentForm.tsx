import React, { useState, FormEvent, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import usePaymentForm from './usePaymentForm';
import axios from 'axios';

interface SingUpForm {
    name: string;
    email: string;
}

const PaymentForm = () => {
    const [formData, setFormData] = useState<SingUpForm>({
        name: '',
        email: '',
    });

    const stripe = useStripe();
    const elements = useElements();

    const { handleSubmit } = usePaymentForm();

    const handleFormSubmit = () => {
        const handleCreateUser = async () => {
            // create user
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/signup`,
                {
                    // double check
                    formData,
                }
            );
            console.log(res);
            // create subscription
            const stripeUserId = res.data.stripId;

            const cardElement = elements?.getElement(CardElement);

            if (!stripe || !elements || !cardElement) {
                return;
            }

            const stripeResponse = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            const { error, paymentMethod } = stripeResponse;

            if (error || !paymentMethod) {
                return;
            }

            const paymentMethodId = paymentMethod.id;

            const subscriptionRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/create-subscription`,
                {
                    // NO
                    formData,
                }
            );
            console.log(subscriptionRes);
        };
        handleCreateUser();
    };

    const handleInputChange = (e: InputEvent) => {
        console.log(e);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" onChange={(e) => handleInputChange} />
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                onChange={(e) => handleInputChange}
            />
            <CardElement />
            <button>Sign up</button>
        </form>
    );
};

export default PaymentForm;
