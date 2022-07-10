import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

import Button from '../Components/Button/Button';
import AlertCard from '../Components/Modal/AlertCard';

import ModalContainer from '../Components/Modal/ModalContainer';

import './styles/userAccountStyles.css';

const UserAccount = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [userData, setUserData] = user;
  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  const changePassword = () => {
    alert('change password functionality coming soon');
  };

  const cancelSubscription = async () => {
    const customer_id = userData.stripe_id;

    await axios
      .post('http://localhost:5000/api/payments/cancel-subscription', {
        customer_id: customer_id,
      })
      .then(
        setUserData((prevState) => ({
          ...prevState,
          subscription_active: false,
          subscription_id: '',
        }))
      )
      .then(
        setMessage(
          'Subscription has been cancelled. Your account will remain active until the end of your current subscription period. At that point, you will still be able to log in, but you will lose member access. You can resubscribe from this page at any time.'
        )
      );
  };

  const resubscribe = () => {
    const { id, stripe_id, first_name, last_name, email } = userData;
    const resubscribeUser = { id, stripe_id, first_name, last_name, email };
    console.log(resubscribeUser);
    navigate('/subscribe', { state: resubscribeUser });
  };
  const changePaymentMethod = () => {
    alert('change payment method functionality coming soon');
  };

  const handleLogout = async () => {
    await axios
      .get('http://localhost:5000/api/users/logout', {})
      // .get('https://roop-verma-archive.herokuapp.com/api/users/logout', {})
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
        action={'Test - Change Password'}
        message={'Are you sure that you want to change your password?'}
        callback={changePassword}
        type='modal'
      />

      <ModalContainer
        buttonWidth='250px'
        buttonMargin='15px 0 0 0'
        action={'Change Payment Method'}
        message={'Are you sure that you want to change your payment method?'}
        callback={changePaymentMethod}
        type='modal'
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
