import './styles/formStyles.css';

import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';

import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { useNotificationContext } from '../context/NotificationContext';
import { useRegistrationContext } from '../context/RegistrationContext';
import { logNetworkError } from '../util/logNetworkError';
import { validateEmail } from '../util/validateEmail';
import { handleCheckout } from './Signup/handleCheckout';

const key = import.meta.env.VITE_API_KEY;

export function Signup() {
  const [invalidEmail, setInvalidEmail] = useState<string | false>(false);
  const [invalidFirstName, setInvalidFirstName] = useState<string | false>(false);
  const [invalidLastName, setInvalidLastName] = useState<string | false>(false);

  const { updateRegistrationInfo, registrationInfo } = useRegistrationContext();
  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const stripe = useStripe();

  const isFormInvalid = invalidEmail || invalidFirstName || invalidLastName;
  const isStripeNotFound = !stripe;
  const isSubmitDisabled = isFormInvalid || isStripeNotFound;

  function getTooltipMessage() {
    if (isStripeNotFound) {
      return 'Error initializing stripe';
    } else if (isFormInvalid) {
      return 'Please correct the form errors';
    }
  }

  const tooltipMessage = getTooltipMessage();

  const handleRegistrationInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateRegistrationInfo({ [name]: value });
  };

  async function handleCheckoutAction(stripeId: string) {
    if (stripe) {
      const response: { errorMessage: string } | undefined = await handleCheckout({
        stripeId,
        stripe,
      });
      if (response?.errorMessage) {
        logNetworkError({
          errorCode: 500, // TODO: actual error code
          errorMessage: response.errorMessage,
          isRegisteredUser: false,
          userEmailAddress: 'N/A',
          userName: 'N/A',
        });
        updateAlertMessage(
          `Failed to create checkout session - : ${response.errorMessage}`,
        );
      }
    } else {
      console.error('Stripe data not found');
    }
  }

  useEffect(() => {
    const validationResponse = validateEmail(registrationInfo.email);
    setInvalidEmail(validationResponse);
  }, [registrationInfo.email]);

  const handleSignUp = async () => {
    console.log(stripe);
    if (stripe) {
      if (
        Object.values(registrationInfo).every((v) => v !== false) &&
        invalidEmail === false
      ) {
        updateLoadingState(true);
        console.log(registrationInfo);
        setInvalidFirstName(false);
        setInvalidLastName(false);
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
      } else {
        if (registrationInfo.firstName === '') {
          setInvalidFirstName('Please enter a first name');
        }
        if (registrationInfo.lastName === '') {
          setInvalidLastName('Please enter a last name');
        }
        if (registrationInfo.email === '') {
          setInvalidEmail('Please enter an email address');
        }
      }
    } else {
      console.log('stripe key not found');
    }
  };

  // function handleSubmit() {
  //   if (!isSubmitDisabled) {
  //     handleSignUp();
  //   }
  // }

  return (
    <form
      id="signup-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '400px',
        margin: '32px auto 0',
      }}
      // onSubmit={handleSubmit}
    >
      <Input
        id="first-name-login-input"
        label="First Name"
        name="firstName"
        value={registrationInfo.firstName}
        type="text"
        callback={handleRegistrationInfo}
        labelColor="white"
        margin="10px 0 0 0"
      />
      {invalidFirstName !== '' && <span className="form--alert">{invalidFirstName}</span>}
      <Input
        id="last-name-login-input"
        label="Last Name"
        name="lastName"
        value={registrationInfo.lastName}
        type="text"
        callback={handleRegistrationInfo}
        labelColor="white"
        margin="20px 0 0 0"
      />
      {invalidLastName !== '' && <span className="form--alert">{invalidLastName}</span>}
      <Input
        label="Email"
        value={registrationInfo.email}
        type="email"
        callback={handleRegistrationInfo}
        name="email"
        labelColor="white"
        margin="10px 0 0 0"
        id="email-login-input"
      />
      {invalidEmail !== '' && <span className="form--alert">{invalidEmail}</span>}

      <Button
        // form="signup-form"
        // type="submit"
        callback={handleSignUp}
        margin="30px 0 0 0"
        width="200px"
        name="Sign up"
        isDisabledMessage={
          isSubmitDisabled && tooltipMessage ? 'Form is disabled' : undefined
        }
      />
    </form>
  );
}
