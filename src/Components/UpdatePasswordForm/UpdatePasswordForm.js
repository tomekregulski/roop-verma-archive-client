import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { fetchJwt } from '../../Utils/fetchJwt';

import Input from '../Input/Input';
import Button from '../Button/Button';
import AlertCard from '../Modal/AlertCard';

import axios from 'axios';

import '../../Views/styles/formStyles.css';

export const UpdatePasswordForm = (props) => {
  const [userInfo, setUserInfo] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const key = process.env.REACT_APP_API_KEY;

  const { user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

  const { handleCancel } = props;

  const validatePassword = () => {
    if (userInfo.password !== '') {
      if (userInfo.password.length < 8 || userInfo.password.length > 15) {
        setPasswordMessage(
          'Password length must be between 8 and 15 characters'
        );
      } else {
        setPasswordMessage('');
      }
    }
  };

  const validateConfirmPassword = () => {
    if (userInfo.password !== '' && userInfo.confirmPassword !== '') {
      if (userInfo.password === userInfo.confirmPassword) {
        setConfirmPasswordMessage('');
      } else {
        setConfirmPasswordMessage('Passwords must match');
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    validatePassword();
    validateConfirmPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (
      Object.values(userInfo).every((v) => v !== '') &&
      confirmPasswordMessage === ''
    ) {
      const { password, currentPassword } = userInfo;

      const jwt = fetchJwt();
      if (!jwt) {
        setErrorMessage('Error: cannot find valid token');
        return;
      }

      axios
        .put(
          `${process.env.REACT_APP_API_ORIGIN}/api/v1/users/update-password/${key}`,
          {
            userId: userData.id,
            currentPassword,
            password,
          },
          jwt
        )
        .then((response) => {
          console.log(response);
          setSuccessMessage(response.data.message);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error.message);
        });
    } else {
      if (userInfo.password === '') {
        setPasswordMessage('Please choose a password');
      }
      if (userInfo.confirm_password === '') {
        setConfirmPasswordMessage('Please confirm your password');
      }
    }
  };

  return (
    <div className='form--container'>
      <form onSubmit={(event) => handleFormSubmit(event)}>
        <Input
          label='Current Password'
          name='currentPassword'
          value={userInfo.currentPassword}
          type='password'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        <Input
          label='New Password'
          name='password'
          value={userInfo.password}
          type='password'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {passwordMessage !== '' && (
          <span className='form--alert'>{passwordMessage}</span>
        )}
        <Input
          label='Confirm New Password'
          name='confirmPassword'
          value={userInfo.confirmPassword}
          type='password'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {confirmPasswordMessage !== '' && (
          <span className='form--alert'>{confirmPasswordMessage}</span>
        )}
        <Button margin='30px 0 0 0' width='100%' name='Update Password' />
        <Button
          margin='30px 0 0 0'
          width='100%'
          name='Cancel'
          callback={handleCancel}
        />
      </form>
      {errorMessage !== '' && (
        <AlertCard
          closeAlert={() => {
            setErrorMessage('');
          }}
          show={errorMessage !== '' ? true : false}
        >
          {errorMessage}
        </AlertCard>
      )}
      {successMessage !== '' && (
        <AlertCard
          closeAlert={() => {
            setSuccessMessage('');
            handleCancel();
          }}
          show={successMessage !== '' ? true : false}
        >
          {successMessage}
        </AlertCard>
      )}
    </div>
  );
};
