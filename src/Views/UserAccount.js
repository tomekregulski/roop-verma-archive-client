import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

import Button from '../Components/Button/Button';
import YesNoModal from '../Components/Modal/YesNoModal';

const UserAccount = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [userData, setUserData] = user;

  let navigate = useNavigate();

  const changePassword = () => {
    console.log('change password');
  };

  const cancelSubscription = async () => {
    console.log('cancel subscription');

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
      );
  };

  const resumeSubscription = () => {
    console.log('resume subscription');
  };
  const changePaymentMethod = () => {
    console.log('change payment method');
  };

  const handleLogout = async () => {
    await axios
      .get('https://roop-verma-archive.herokuapp.com/api/users/logout', {})
      .then((response) => {
        console.log(response);
        setUserData({});
        setIsAuth(false);

        document.cookie =
          'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAuth(false);
  };

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Your Account Info</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span>
          Name: {userData.first_name} {userData.last_name}
        </span>
        <span>Email: {userData.email}</span>

        <span>
          <YesNoModal
            action={'Change Password'}
            message={'Are you sure that you want to change your password?'}
            callback={changePassword}
          />
        </span>
        <span>
          <YesNoModal
            action={'Change Payment Method'}
            message={
              'Are you sure that you want to change your payment method?'
            }
            callback={changePaymentMethod}
          />
        </span>
        <span>
          Subscription Status:{' '}
          {userData.subscription_active ? 'Active' : 'Inactive'}
        </span>
        <span>
          {userData.subscription_active ? (
            <YesNoModal
              action={'Cancel Subscription'}
              message={
                'Are you sure that you want to cancel your subscription?'
              }
              callback={cancelSubscription}
            />
          ) : (
            <YesNoModal
              action={'Resume Subscription'}
              message={
                'Are you sure that you want to resume your subscription?'
              }
              callback={resumeSubscription}
            />
          )}
        </span>
        <Button
          name='Logout'
          callback={handleLogout}
          style={{ color: 'white' }}
        />
      </div>
    </>
  );
};

export default UserAccount;
