import './styles/formStyles.css';

import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { useRegistrationContext } from '../context/RegistrationContext';

const key = import.meta.env.VITE_API_KEY;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
const stripe = await stripePromise;

const product = 'price_1MdMKqBlr8UFcXJy83qKfDmx';

export function Signup() {
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidFirstName, setInvalidFirstName] = useState('');
  const [invalidLastName, setInvalidLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { updateRegistrationInfo, registrationInfo } = useRegistrationContext();

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateRegistrationInfo({ [name]: value });
  };

  useEffect(() => {
    console.log(registrationInfo);
  }, [registrationInfo]);

  const validateEmail = () => {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (registrationInfo.email !== '') {
      if (registrationInfo.email.match(validRegex)) {
        setInvalidEmail('');
      } else {
        setInvalidEmail('Please enter a valid email address');
      }
    } else {
      setInvalidEmail('');
    }
  };

  useEffect(() => {
    console.log(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    validateEmail();
  }, [registrationInfo.email]);

  const handleDeleteAllUsers = async () => {
    await axios
      .delete(`${import.meta.env.VITE_API_ORIGIN}/api/v1/user/${key}`)
      .then((response) => console.log(response.data));
  };

  const handleCheckout = async (stripeId: string) => {
    console.log('handle checkout');
    try {
      const subscriptionRes = await axios.get(
        `${
          import.meta.env.VITE_API_ORIGIN
        }/api/v1/payment/checkout-session/${key}/${stripeId}`,
      );
      console.log('returned');
      console.log(subscriptionRes);
      const sessionId = subscriptionRes.data.id;
      console.log(sessionId);
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
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    console.log('signup');
    if (Object.values(registrationInfo).every((v) => v !== '') && invalidEmail === '') {
      console.log(registrationInfo);
      setInvalidFirstName('');
      setInvalidLastName('');
      const { firstName, lastName, email } = registrationInfo;
      axios
        .post(`${import.meta.env.VITE_API_ORIGIN}/api/v1/user/${key}`, {
          firstName,
          lastName,
          email,
        })
        .then((response) => {
          console.log(response.data);
          handleCheckout(response.data.stripeId);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error.message);
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
  };

  return (
    <>
      <Input
        id="first-name-login-input"
        label="First Name"
        name="firstName"
        value={registrationInfo.firstName}
        type="text"
        callback={handleChange}
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
        callback={handleChange}
        labelColor="white"
        margin="20px 0 0 0"
      />
      {invalidLastName !== '' && <span className="form--alert">{invalidLastName}</span>}
      <Input
        label="Email"
        value={registrationInfo.email}
        type="email"
        callback={handleChange}
        name="email"
        labelColor="white"
        margin="10px 0 0 0"
        id="email-login-input"
      />
      {invalidEmail !== '' && <span className="form--alert">{invalidEmail}</span>}

      <Button callback={handleSignUp} margin="10px 0 0 0" width="100%" name="Sign up" />
      <Button
        callback={handleDeleteAllUsers}
        margin="10px 0 0 0"
        width="100%"
        name="Delete"
      />
    </>
  );
}
