import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidJwt } from '../Utils/isValidJwt';
import { AuthContext } from '../Context/AuthContext';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import UpdatePaymentForm from '../Components/UpdatePaymentForm/UpdatePaymentForm';

import './styles/subscribeStyles.css';

const PUBLIC_KEY =
  'pk_test_51Jg7jKBlr8UFcXJymPB8I3ZU4z3vD7fIdgoWXQS3hDZsDCD98MMFDUozMO3C0hlCUL6stRdUbehbFZA7h7whWoDj00Q2mfpRZw';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const UpdatePaymentMethod = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

  let navigate = useNavigate();

  useEffect(() => {
    if (!isValidJwt) {
      setUserData({});
      setIsAuth(false);
      document.cookie =
        'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='subscribe--container'>
      <div>
        <Elements stripe={stripeTestPromise}>
          <UpdatePaymentForm />
        </Elements>
      </div>
    </div>
  );
};

export default UpdatePaymentMethod;
