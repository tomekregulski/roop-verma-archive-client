import { useEffect, useState } from 'react';
import { init, send } from 'emailjs-com';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Button from '../components/Button/Button';

const key = import.meta.env.VITE_API_KEY;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const stripe = await stripePromise;
console.log(stripe);

init('user_sWNT4oROPiAoUGksmqFlD');

export function CompleteRegistration() {
    const [emailSent, setEmailSent] = useState(false);
    const [emailInfo, setEmailInfo] = useState({
        name: '',
        email: '',
        emailKey: '',
    });

    const sendConfirmationEmail = () => {
        send('rvdl_forms', 'template_lj7tqph', {
            email: emailInfo.email,
            name: emailInfo.name,
            key: emailInfo.emailKey,
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

    const handleSendEmail = () => {
        if (!emailSent) {
            sendConfirmationEmail();
        }
    };

    useEffect(() => {
        const effect = async () => {
            if (Object.values(emailInfo).every((v) => v === '')) {
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
                console.log(session);
                const { name, email } = session.data.customer_details;

                const emailKeyResponse = await axios.get(
                    `${
                        import.meta.env.VITE_API_ORIGIN
                    }/api/v1/auth/email-key/${key}/${email}`
                );

                const { emailKey } = emailKeyResponse.data.token;

                setEmailInfo({
                    name,
                    email,
                    emailKey,
                });
            }
        };
        effect();
    }, []);

    if (!emailSent) {
        return (
            <>
                <div>
                    Your Registration is Almost Complete. Please press the
                    button below to complete the process.
                </div>
                <Button
                    callback={handleSendEmail}
                    margin="10px 0 0 0"
                    width="100%"
                    name="Delete"
                />
            </>
        );
    }
    return (
        <>
            <div>
                We have sent you an email to confirm your subscription. Please
                check it and follow the link provided to log in.
            </div>
        </>
    );
}
