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
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  let navigate = useNavigate();

  const validatePassword = () => {
    if (userInfo.password !== '' && userInfo.confirm_password !== '') {
      if (userInfo.password === userInfo.confirm_password) {
        setPasswordMessage('');
      } else {
        setPasswordMessage('Passwords must match');
      }
    }
  };

  const validateEmail = () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (userInfo.email.match(validRegex)) {
      setEmailMessage('');
    } else {
      setEmailMessage('Please enter a valid email address');
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
  }, [userInfo.confirm_password]);
  useEffect(() => {
    validateEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // check all fields filled and messages are ''

    if (userInfo.password === userInfo.confirm_password) {
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
        });
    }
  };

  return (
    <>
      <h1>Register a new account</h1>
      <form onSubmit={(event) => handleFormSubmit(event)}>
        <Input
          value={userInfo.first_name}
          type='text'
          callback={handleChange}
          name='first_name'
          label='First Name'
        />
        <Input
          value={userInfo.last_name}
          type='text'
          callback={handleChange}
          name='last_name'
          label='Last Name'
        />
        {emailMessage !== '' && (
          <span style={{ color: 'red' }}>{emailMessage}</span>
        )}
        <Input
          value={userInfo.email}
          type='email'
          callback={handleChange}
          name='email'
          label='Email'
        />
        <Input
          value={userInfo.password}
          type='password'
          callback={handleChange}
          name='password'
          label='Password'
        />
        <Input
          value={userInfo.confirm_password}
          type='password'
          callback={handleChange}
          name='confirm_password'
          label='Confirm Password'
        />
        {passwordMessage !== '' && (
          <span style={{ color: 'red' }}>{passwordMessage}</span>
        )}
        <Button name='Submit' />
      </form>
      <div>
        <p>
          or
          <Link to='/login' style={{ marginRight: '20px' }}>
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
