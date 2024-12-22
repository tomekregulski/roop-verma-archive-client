import { Stripe } from '@stripe/stripe-js';
import axios from 'axios';

import { getErrorMessage } from '../../util/getErrorMessage';

const key = import.meta.env.VITE_API_KEY;

interface HandleCheckoutResponseType {
  status: 'success' | 'error';
  message: string;
}

interface HandleCheckoutProps {
  stripeId: string;
  stripe: Stripe;
}

export async function handleCheckout(
  props: HandleCheckoutProps,
): Promise<HandleCheckoutResponseType> {
  const { stripeId, stripe } = props;

  try {
    const subscriptionRes = await axios.get(
      `${
        import.meta.env.VITE_API_ORIGIN
      }/api/v1/payment/checkout-session/${key}/${stripeId}`,
    );

    const sessionId = subscriptionRes.data.id;
    const { error } = await stripe!.redirectToCheckout({
      //     //     // Make the id field from the Checkout Session creation API response
      //     //     // available to this file, so you can provide it as parameter here
      //     //     // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    const errorMessage = getErrorMessage(error.message);
    if (errorMessage) {
      return { status: 'error', message: errorMessage };
    }
    return { status: 'success', message: 'success' };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return { status: 'error', message: errorMessage };
  }
}
