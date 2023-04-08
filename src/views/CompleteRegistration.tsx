import { useEffect, useState } from 'react';
import { init, send } from 'emailjs-com';
import { useRegistrationContext } from '../context/RegistrationContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const key = import.meta.env.VITE_API_KEY;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const stripe = await stripePromise;
console.log(stripe);

init('user_sWNT4oROPiAoUGksmqFlD');

export function CompleteRegistration() {
    const [emailSent, setEmailSent] = useState(false);

    const sendConfirmationEmail = (name: string, email: string) => {
        send('rvdl_forms', 'template_lj7tqph', {
            email,
            name,
        }).then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
                setEmailSent(true);
            },
            (error) => {
                console.log('FAILED...', error);
            }
        );
    };

    useEffect(() => {
        const effect = async () => {
            const url = window.location.href;
            const params = url.split('?')[1].split('&');
            const sessionParam = params[1].split('&');
            const sessionId = sessionParam[0].split('=')[1];

            const session = await axios.post(
                `${
                    import.meta.env.VITE_API_ORIGIN
                }/api/v1/payment/checkout-session-object/${key}`,
                {
                    sessionId,
                }
            );
            const { name, email } = session.data.customer_details;
            if (!emailSent) {
                sendConfirmationEmail(name, email);
            }
        };
        effect();
    }, []);

    if (!emailSent) {
        return (
            <>
                <div>Your Registration is Almost Complete</div>
            </>
        );
    }
    return (
        <>
            <div>We have sent you an email</div>
        </>
    );
}
