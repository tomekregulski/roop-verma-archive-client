import axios from 'axios';
import { FormEvent } from 'react';
import tw from 'twin.macro';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const stripe = await stripePromise;

export function ManageAccount() {
    const handlePortal = async () => {
        console.log('portal');
        const portalRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/create-portal-session`,
            {
                customerId: '12345',
            }
        );
        console.log(portalRes);
    };
    return (
        <>
            <button
                id="portal-session-button"
                type="button"
                css={tw`h-[100px] w-[200px] bg-blue-200`}
                onClick={() => handlePortal()}
            >
                Manage Account
            </button>
        </>
    );
}
