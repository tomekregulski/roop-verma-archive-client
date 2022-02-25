import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

import Button from '../Components/Button/Button';

import PaymentForm from '../Components/PaymentForm/PaymentForm';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ModalContainer from '../Components/Modal/ModalContainer';

import './styles/userAccountStyles.css';
const PUBLIC_KEY =
  'pk_test_51Jg7jKBlr8UFcXJymPB8I3ZU4z3vD7fIdgoWXQS3hDZsDCD98MMFDUozMO3C0hlCUL6stRdUbehbFZA7h7whWoDj00Q2mfpRZw';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const UserAccount = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [userData, setUserData] = user;
  const [resubscribe, setResubscribe] = useState(false);

  let navigate = useNavigate();

  const changePassword = () => {
    alert('change password functionality coming soon');
  };

  const cancelSubscription = async () => {
    alert('cancel subscription functionality coming soon');

    // const customer_id = userData.stripe_id;

    // await axios
    //   .post('http://localhost:5000/api/payments/cancel-subscription', {
    //     customer_id: customer_id,
    //   })
    //   .then(
    //     setUserData((prevState) => ({
    //       ...prevState,
    //       subscription_active: false,
    //       subscription_id: '',
    //     }))
    //   );
  };

  const resumeSubscription = () => {
    alert('resume subscription functionality coming soon');
  };
  const changePaymentMethod = () => {
    alert('change payment method functionality coming soon');
  };

  const handleLogout = async () => {
    await axios
      .get('https://roop-verma-archive.herokuapp.com/api/users/logout', {})
      .then(() => {
        setUserData({});
        setIsAuth(false);
        document.cookie =
          'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='account--container'>
      <h2>Your Account Info</h2>
      <span className='account--text-span'>
        {`${userData.first_name} ${userData.last_name} - ${userData.email}`}
      </span>
      <ModalContainer
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Test - Change Password'}
        message={'Are you sure that you want to change your password?'}
        callback={changePassword}
      />
      <ModalContainer
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Payment Method'}
        message={'Are you sure that you want to change your payment method?'}
        callback={changePaymentMethod}
      />
      <span className='account--text-span'>
        Subscription Status:{' '}
        {userData.subscription_active ? 'Active' : 'Inactive'}
      </span>
      <span>
        {userData.subscription_active ? (
          <ModalContainer
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Cancel Subscription'}
            message={'Are you sure that you want to cancel your subscription?'}
            callback={cancelSubscription}
          />
        ) : (
          <ModalContainer
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Resume Subscription'}
            message={'Are you sure that you want to resume your subscription?'}
            callback={resumeSubscription}
          />
        )}
      </span>
      {resubscribe === true && (
        <div>
          <Elements stripe={stripeTestPromise}>
            <PaymentForm />
          </Elements>
        </div>
      )}
      <Button
        name='Logout'
        width='250px'
        margin='15px 0 0 0'
        callback={handleLogout}
        style={{ color: 'white' }}
      />
    </div>
  );
};

export default UserAccount;
