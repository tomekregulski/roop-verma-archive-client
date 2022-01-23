import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

import Button from '../Components/Button/Button';
import YesNoModal from '../Components/Modal/YesNoModal';

const UserAccount = (props) => {
  const { auth, jsonwt, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [jwt, setJwt] = jsonwt;
  const [userData, setUserData] = user;

  let navigate = useNavigate();

  const [passwordModalShow, setPasswordModalShow] = useState(false);
  const changePassword = () => {
    console.log('change password');
    setPasswordModalShow(true);
  };

  const cancelSubscription = async () => {
    console.log('cancel subscription');

    const customer_id = userData.stripe_id;

    const res = await axios.post(
      'http://localhost:5000/api/payments/cancel-subscription',
      {
        customer_id: customer_id,
      }
    );
  };

  const handleLogout = () => {
    axios
      .get('https://roop-verma-archive.herokuapp.com/api/users/logout', {})
      .then((response) => {
        console.log(response);
        setIsAuth(false);
        setJwt('');
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
            open={passwordModalShow}
          />
        </span>
        <span>
          Subscription Status:{' '}
          {userData.subscription_active ? 'Active' : 'Inactive'}
        </span>
        <span>
          <YesNoModal
            action={'Cancel Subscription'}
            message={'Are you sure that you want to cancel your subscription?'}
            callback={cancelSubscription}
            open={passwordModalShow}
          />
        </span>
        <button onClick={handleLogout} style={{ color: 'white' }}>
          Logout
        </button>
      </div>
    </>
  );
};

export default UserAccount;
