import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';
import AlertCard from '../Components/Modal/AlertCard';

import axios from 'axios';

import './styles/formStyles.css';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [firstnameMessage, setFirstnameMessage] = useState('');
  const [lastnamelMessage, setLastnameMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');

  const key = process.env.REACT_APP_API_KEY;

  let navigate = useNavigate();

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
    if (userInfo.password !== '' && userInfo.confirm_password !== '') {
      if (userInfo.password === userInfo.confirm_password) {
        setConfirmPasswordMessage('');
      } else {
        setConfirmPasswordMessage('Passwords must match');
      }
    }
  };

  const validateEmail = () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (userInfo.email !== '') {
      if (userInfo.email.match(validRegex)) {
        setEmailMessage('');
      } else {
        setEmailMessage('Please enter a valid email address');
      }
    } else {
      setEmailMessage('');
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
    validateEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (
      Object.values(userInfo).every((v) => v !== '') &&
      confirmPasswordMessage === '' &&
      emailMessage === ''
    ) {
      const { first_name, last_name, email, password } = userInfo;

      axios
        .post(`${process.env.REACT_APP_API_ORIGIN}/api/v1/users/${key}`, {
          first_name,
          last_name,
          email,
          password,
        })
        .then((response) => {
          console.log(response);
          navigate('/subscribe', { state: response.data });
        })
        .catch((error) => {
          setErrorMessage(error.response.data);
        });
    } else {
      if (userInfo.first_name === '') {
        setFirstnameMessage('Please enter a first name');
      }
      if (userInfo.last_name === '') {
        setLastnameMessage('Please enter a last name');
      }
      if (userInfo.email === '') {
        setEmailMessage('Please enter an email');
      }
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
      <h2>Create a new account</h2>
      <p className='form--paragraph'>
        <span>
          Subscribe for Full Library Access / $18 per month (cancel any time).
        </span>
        <span>
          These proceeds help us greatly in continuing to digitize, archive, and
          share Roop Verma's work. Thank you very much for your support.
        </span>
      </p>
      {errorMessage !== '' && (
        <AlertCard
          closeAlert={() => setErrorMessage('')}
          show={errorMessage !== '' ? true : false}
        >
          {errorMessage}
        </AlertCard>
      )}
      <form onSubmit={(event) => handleFormSubmit(event)}>
        <Input
          label='First Name'
          name='first_name'
          value={userInfo.first_name}
          type='text'
          callback={handleChange}
          labelColor='white'
          margin='10px 0 0 0'
        />
        {firstnameMessage !== '' && (
          <span className='form--alert'>{firstnameMessage}</span>
        )}
        <Input
          label='Last Name'
          name='last_name'
          value={userInfo.last_name}
          type='text'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {lastnamelMessage !== '' && (
          <span className='form--alert'>{lastnamelMessage}</span>
        )}

        <Input
          label='Email'
          name='email'
          value={userInfo.email}
          type='text'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {emailMessage !== '' && (
          <span className='form--alert'>{emailMessage}</span>
        )}

        <Input
          label='Password'
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
          label='Confirm Password'
          name='confirm_password'
          value={userInfo.confirm_password}
          type='password'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {confirmPasswordMessage !== '' && (
          <span className='form--alert'>{confirmPasswordMessage}</span>
        )}
        <Button margin='30px 0 0 0' width='100%' name='Register' />
        <div className='form--link-container'>
          <span>Already have an account?</span>
          <Link to='/login' style={{ marginRight: '20px' }}>
            <Button margin='10px 0 0 0' width='100%' name='Sign in' />
          </Link>
          <span>Forgot your password?</span>
          <Link to='/library' style={{ marginRight: '20px' }}>
            <Button margin='10px 0 0 0' width='100%' name='Contact Us' />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
