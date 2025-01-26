import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import type { ChangeEvent } from 'react';

import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Input } from '../components/Input/Input';
import { useNotificationContext } from '../context/NotificationContext';
import { useRegistrationContext } from '../context/RegistrationContext';
import { handleCheckout } from '../util/handleCheckout';
import { logNetworkError } from '../util/logNetworkError';

const key = import.meta.env.VITE_API_KEY;
const supportEmail = import.meta.env.VITE_RVDL_EMAIL_ADDRESS;

export function Signup() {
  const { updateRegistrationInfo, registrationInfo } = useRegistrationContext();
  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const stripe = useStripe();

  const isFormIncomplete =
    registrationInfo.email === '' ||
    registrationInfo.firstName === '' ||
    registrationInfo.lastName === '';
  const isStripeNotFound = !stripe;
  const isSubmitDisabled = isStripeNotFound || isFormIncomplete;

  function getTooltipMessage() {
    if (isStripeNotFound) {
      return `Error initializing stripe, please refresh the page. Contact ${supportEmail} if the issue does not resolve`;
    } else if (isFormIncomplete) {
      return 'Please complete the form';
    }
  }

  const tooltipMessage = getTooltipMessage();

  const handleRegistrationInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateRegistrationInfo({ [name]: value });
  };

  async function handleCheckoutAction(stripeId: string) {
    if (stripe) {
      const { status, message, errorCode } = await handleCheckout({
        stripeId,
        stripe,
      });
      if (status === 'error') {
        logNetworkError({
          errorCode: errorCode,
          errorMessage: message,
          isRegisteredUser: false,
          userEmailAddress: 'N/A',
          userName: 'N/A',
        });
        updateAlertMessage(['There was an error accessing the checkout page:', message]);
      }
    }
  }

  const handleSignUp = async () => {
    if (isSubmitDisabled) {
      return;
    }

    updateLoadingState(true);
    const { firstName, lastName, email } = registrationInfo;
    axios
      .post(`${import.meta.env.VITE_API_ORIGIN}/api/v1/user/${key}`, {
        firstName,
        lastName,
        email,
      })
      .then((response) => {
        updateLoadingState(false);
        console.log(response.data);
        handleCheckoutAction(response.data.newUserStripeId);
      })
      .catch((error) => {
        updateLoadingState(false);
        console.log(error.response.data.error.message);
        logNetworkError({
          errorCode: 500, // TODO: actual error code
          errorMessage: error.response.data.error.message,
          isRegisteredUser: false,
          userEmailAddress: 'N/A',
          userName: 'N/A',
        });
        updateAlertMessage(error.response.data.error.message);
      });
  };

  return (
    <div
      className="
        w-[400px]
        mt-[32px]
        mx-auto
        mb-0
      "
    >
      <Form
        id="signup-form"
        isSubmitDisabled={isSubmitDisabled}
        handleSubmit={handleSignUp}
      >
        <Input
          id="first-name-login-input"
          label="First Name"
          name="firstName"
          value={registrationInfo.firstName}
          type="text"
          callback={handleRegistrationInfo}
        />
        <Input
          id="last-name-login-input"
          label="Last Name"
          name="lastName"
          value={registrationInfo.lastName}
          type="text"
          callback={handleRegistrationInfo}
        />
        <Input
          label="Email"
          value={registrationInfo.email}
          type="email"
          callback={handleRegistrationInfo}
          name="email"
          id="email-login-input"
        />
        <Button
          form="signup-form"
          type="submit"
          name="Sign up"
          isDisabledMessage={tooltipMessage}
        />
      </Form>
    </div>
  );
}
