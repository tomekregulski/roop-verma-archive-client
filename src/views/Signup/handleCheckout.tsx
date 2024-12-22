import axios from 'axios';

import { getErrorMessage } from '../../util/getErrorMessage';
import { StripeResponseObject } from '../../util/getStripe';

const key = import.meta.env.VITE_API_KEY;

interface HandleCheckoutProps {
  stripeId: string;
  stripe: StripeResponseObject['data'];
}

export async function handleCheckout(props: HandleCheckoutProps) {
  const { stripeId, stripe } = props;

  try {
    const subscriptionRes = await axios.get(
      `${
        import.meta.env.VITE_API_ORIGIN
      }/api/v1/payment/checkout-session/${key}/${stripeId}`,
    );

    const sessionId = subscriptionRes.data.id;
    // const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      //     //     // Make the id field from the Checkout Session creation API response
      //     //     // available to this file, so you can provide it as parameter here
      //     //     // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  } catch (error) {
    console.log('Stripe checkout failed');
    const errorMessage = getErrorMessage(error);
    return { errorMessage };
  }
}
