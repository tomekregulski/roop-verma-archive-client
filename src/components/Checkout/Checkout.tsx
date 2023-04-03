import axios from 'axios';
import { FormEvent } from 'react';
import tw from 'twin.macro';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const stripe = await stripePromise;
console.log(stripe);

export function Checkout() {
    const product = 'price_1MdMKqBlr8UFcXJy83qKfDmx';
    const handleCheckout = async () => {
        console.log(product);
        const subscriptionRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/create-checkout-session`,
            {
                product,
            }
        );
        console.log(subscriptionRes);
        const sessionId = subscriptionRes.data.id;
        console.log(sessionId);
        const { error } = await stripe!.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId,
        });
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message);
    };

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
                id="checkout-and-portal-button"
                type="button"
                css={tw`h-[100px] w-[200px] bg-red-200`}
                onClick={() => handleCheckout()}
            >
                Checkout
            </button>
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
