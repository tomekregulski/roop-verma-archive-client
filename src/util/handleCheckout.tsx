import type { Stripe } from '@stripe/stripe-js';

import { api, legacyKey } from '../api/client';
import type { UserData } from '../context/AuthContext';

export async function handleCheckout({
  user,
  stripe,
  resubscribe = false,
}: {
  user: UserData;
  stripe: Stripe;
  resubscribe?: boolean;
}) {
  const route = resubscribe ? 'checkout-session-resubscribe' : 'checkout-session';
  const { data } = await api.get(
    `/payment/${route}/${legacyKey}/${encodeURIComponent(user.stripeId)}`,
  );
  const result = await stripe.redirectToCheckout({ sessionId: data.id });
  if (result.error) throw new Error('Checkout redirect failed');
}
