import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';
import { TracksContextData } from '../Context/TracksContext';

import Button from '../Components/Button/Button';
import YesNoModal from '../Components/Modal/YesNoModal';

const UserAccount = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [userData, setUserData] = user;

  const { setTrackJwt, setProceed } = useContext(TracksContextData);

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
      .then((response) => {
        // console.log(response);
        setProceed(false);
        setTrackJwt('');
        setUserData({});
        setIsAuth(false);
        document.cookie =
          'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', color: 'white' }}>Your Account Info</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span style={{ marginTop: '10px', color: 'white' }}>
          {`${userData.first_name} ${userData.last_name} - ${userData.email}`}
        </span>

        <span>
          <YesNoModal
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Change Password'}
            message={'Are you sure that you want to change your password?'}
            callback={changePassword}
          />
        </span>
        <span>
          <YesNoModal
            buttonWidth='250px'
            buttonMargin='15px 0 0 0'
            action={'Change Payment Method'}
            message={
              'Are you sure that you want to change your payment method?'
            }
            callback={changePaymentMethod}
          />
        </span>
        {/* <span style={{ marginTop: '15px', color: 'white' }}>
          Subscription Status:{' '}
          {userData.subscription_active ? 'Active' : 'Inactive'}
        </span> */}
        <span>
          {userData.subscription_active ? (
            <YesNoModal
              buttonWidth='250px'
              buttonMargin='15px 0 0 0'
              action={'Cancel Subscription'}
              message={
                'Are you sure that you want to cancel your subscription?'
              }
              callback={cancelSubscription}
            />
          ) : // <YesNoModal
          //   buttonWidth='250px'
          //   buttonMargin='15px 0 0 0'
          //   action={'Resume Subscription'}
          //   message={
          //     'Are you sure that you want to resume your subscription?'
          //   }
          //   callback={resumeSubscription}
          // />
          null}
        </span>
        <Button
          name='Logout'
          width='250px'
          margin='15px 0 0 0'
          callback={handleLogout}
          style={{ color: 'white' }}
        />
      </div>
    </>
  );
};

export default UserAccount;
