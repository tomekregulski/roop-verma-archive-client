import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const [firstnameMessage, setFirstnameMessage] = useState('');
  const [lastnamelMessage, setLastnameMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');

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

    if (name === 'confirm_password') {
    }
    if (name === 'email') {
    }
  };

  useEffect(() => {
    validatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.password]);
  useEffect(() => {
    validateConfirmPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.confirm_password]);
  useEffect(() => {
    validateEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // check all fields filled and messages are ''

    if (
      Object.values(userInfo).every((v) => v !== '') &&
      confirmPasswordMessage === '' &&
      emailMessage === ''
    ) {
      const { first_name, last_name, email, password } = userInfo;

      axios
        .post('https://roop-verma-archive.herokuapp.com/api/users/', {
          first_name,
          last_name,
          email,
          password,
        })
        // .post('http://localhost:5000/api/users/', {
        //   first_name,
        //   last_name,
        //   email,
        //   password,
        // })
        .then((response) => {
          navigate('/subscribe', { state: response.data });
        })
        .catch((error) => {
          console.log(error);
          setMessage('That email already exists');
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15px',
        marginBottom: '50px',
      }}
    >
      <h2
        style={{
          color: 'white',
          marginBottom: '20px',
        }}
      >
        Create a new account
      </h2>
      <form
        style={{ width: '300px' }}
        onSubmit={(event) => handleFormSubmit(event)}
      >
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
          <p style={{ color: 'pink', marginTop: '20px' }}>{firstnameMessage}</p>
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
          <p style={{ color: 'pink', marginTop: '20px' }}>{lastnamelMessage}</p>
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
          <p style={{ color: 'pink', marginTop: '20px' }}>{emailMessage}</p>
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
          <p style={{ color: 'pink', marginTop: '20px' }}>{passwordMessage}</p>
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
          <p style={{ color: 'pink', marginTop: '20px' }}>
            {confirmPasswordMessage}
          </p>
        )}
        <Button margin='30px 0 0 0' width='100%' name='Submit' />
        <div style={{ margin: '10px 0 0 0', width: '100%' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>or</p>
          <Link to='/login' style={{ marginRight: '20px' }}>
            <Button margin='10px 0 0 0' width='100%' name='Sign in' />
          </Link>
          {message !== '' ? (
            <span style={{ color: 'pink' }}>{message}</span>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Register;
