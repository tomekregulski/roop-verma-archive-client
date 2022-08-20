import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidJwt } from '../Utils/isValidJwt';
import { fetchJwt } from '../Utils/fetchJwt';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';
import { UpdatePasswordForm } from '../Components/UpdatePasswordForm/UpdatePasswordForm';

import Button from '../Components/Button/Button';
import AlertCard from '../Components/Modal/AlertCard';

import ModalContainer from '../Components/Modal/ModalContainer';

import './styles/userAccountStyles.css';

const UserAccount = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [userData, setUserData] = user;
  const [stripeInfo, setStripeInfo] = useState({
    stripe_id: '',
    subscription_id: '',
  });
  const [message, setMessage] = useState('');
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const { id, email, first_name, last_name, subscription_active } = userData;

  const key = process.env.REACT_APP_API_KEY;

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

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      const jwt = fetchJwt();
      if (!jwt) {
        setMessage('Error: cannot find valid token');
        return;
      }
      try {
        const fetchUserStripeInfo = async () => {
          const userStripeInfo = await axios.get(
            `${process.env.REACT_APP_API_ORIGIN}/api/v1/users/${id}/${key}`,
            jwt
          );
          setStripeInfo({
            stripe_id: userStripeInfo.data.stripe_id,
            subscription_id: userStripeInfo.data.subscription_id,
          });
        };
        fetchUserStripeInfo();
      } catch (error) {
        console.log(error);
        setMessage('Server error: ', error.response.data.error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePassword = () => {
    setShowUpdatePassword(true);
  };

  const handleCancellChangePassword = () => {
    setShowUpdatePassword(false);
  };

  const cancelSubscription = async () => {
    if (stripeInfo.stripe_id !== '') {
      const jwt = fetchJwt();
      if (!jwt) {
        setMessage('Error: cannot find valid token');
        return;
      }
      const customer_id = stripeInfo.stripe_id;

      await axios
        .post(
          `${process.env.REACT_APP_API_ORIGIN}/api/payments/cancel-subscription/`,
          {
            customer_id: customer_id,
            jwt,
          }
        )
        .then(
          setUserData((prevState) => ({
            ...prevState,
            subscription_active: false,
          }))
        )
        .then(
          setMessage(
            'Subscription has been cancelled. Your account will remain active until the end of your current subscription period. At that point, you will still be able to log in, but you will lose member access. You can resubscribe from this page at any time.'
          )
        );
    } else {
      setMessage(
        'Error: Cannot locate subscription information. Please refresh the page to try again, If the issue persists, please reach send a message to support.'
      );
    }
  };

  const resubscribe = () => {
    if (stripeInfo.stripe_id !== '') {
      navigate('/resubscribe');
    } else {
      setMessage(
        'Error: Cannot locate subscription information. Please refresh the page to try again, If the issue persists, please reach send a message to support.'
      );
    }
  };

  const changePaymentMethod = () => {
    navigate('/update-payment-method');
  };

  const handleLogout = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_ORIGIN}/api/v1/auth/logout/${key}`)
      .then(() => {
        setUserData({});
        setIsAuth(false);
        document.cookie =
          'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.error.message);
      });
  };

  return (
    <div className='account--container'>
      <h2>Your Account Info</h2>
      <span className='account--text-span'>
        {`${first_name} ${last_name} - ${email}`}
      </span>
      {message !== '' && (
        <AlertCard
          closeAlert={() => setMessage('')}
          show={message !== '' ? true : false}
        >
          {message}
        </AlertCard>
      )}
      <ModalContainer
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Password'}
        message={'Are you sure that you want to change your password?'}
        callback={changePassword}
        type='modal'
      />
      {showUpdatePassword && (
        <UpdatePasswordForm handleCancel={handleCancellChangePassword} />
      )}

      <ModalContainer
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Payment Method'}
        message={'Are you sure that you want to change your payment method?'}
        callback={changePaymentMethod}
        type='modal'
      />
      <span className='account--text-span'>
        Subscription Status: {subscription_active ? 'Active' : 'Inactive'}
      </span>
      <span>
        {subscription_active ? (
          <ModalContainer
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Cancel Subscription'}
            message={'Are you sure that you want to cancel your subscription?'}
            callback={cancelSubscription}
            type='modal'
          />
        ) : (
          <ModalContainer
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Resubscribe'}
            message={'Are you sure that you want to resume your subscription?'}
            callback={resubscribe}
            type='modal'
          />
        )}
      </span>
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
