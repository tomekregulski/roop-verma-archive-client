import axios from 'axios';
// import { FormEvent } from 'react';
import { useLocation /*, useNavigate */ } from 'react-router-dom';
// import tw from 'twin.macro';

export function Register() {
  //   const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  const product = 'price_1MdMKqBlr8UFcXJy83qKfDmx';
  const handleCheckout = async () => {
    console.log(product);
    const subscriptionRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/create-checkout-session`,
      {
        product,
      },
    );
    console.log(subscriptionRes);
    const sessionId = subscriptionRes.data.id;
    console.log(sessionId);
    // const stripe = await getStripe();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // const { error } = await stripe!.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    // sessionId,
    // });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    // console.warn(error.message);
  };

  return (
    <>
      <div>Click on the link below to register your subscription for access.</div>
      <div>
        The link will redirect you to a checkout form hosted by Stripe, which handles our
        payment system.
      </div>
      <div>
        Once you submit your information, you will be redirected back to this site to
        complete registration.
      </div>
      <button
        id="checkout-and-portal-button"
        type="button"
        // css={tw`h-[100px] w-[200px] bg-red-200`}
        onClick={() => handleCheckout()}
      >
        Checkout
      </button>
    </>
  );
}
