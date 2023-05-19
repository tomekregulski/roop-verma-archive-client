import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

interface ResponseObject {
  data: Stripe | null;
  error: string | null;
  loading: boolean;
}

export default function useStripe(): ResponseObject {
  const [data, setData] = useState<Stripe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getStripe = async () => {
    try {
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripeKey = await stripePromise;
      setData(stripeKey);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Something went wrong.');
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getStripe();
  }, []);

  return {
    data,
    error,
    loading,
  };
}
