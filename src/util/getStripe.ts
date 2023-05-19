import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface StripeResponseObject {
  data?: Stripe | null;
  error?: string;
}
export async function getStripe(): Promise<StripeResponseObject> {
  try {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const stripeKey = await stripePromise;
    return { data: stripeKey };
  } catch (error) {
    console.log(error);
    return { error: 'Something went wrong' };
  }
}
