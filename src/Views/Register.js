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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
      }}
    >
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
          margin='20px 0 0 0'
        />
        <Input
          label='Last Name'
          name='last_name'
          value={userInfo.last_name}
          type='text'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />

        <Input
          label='Email'
          name='email'
          value={userInfo.email}
          type='email'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {emailMessage !== '' && (
          <p style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>
            {emailMessage}
          </p>
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
        <Input
          label='Confirm Password'
          name='confirm_password'
          value={userInfo.confirm_password}
          type='password'
          callback={handleChange}
          labelColor='white'
          margin='20px 0 0 0'
        />
        {passwordMessage !== '' && (
          <p style={{ color: 'red', marginTop: '20px' }}>{passwordMessage}</p>
        )}
        <Button margin='20px 0 0 0' width='100%' name='Submit' />
        <div style={{ margin: '20px 0 0 0', width: '100%' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>or</p>
          <Link to='/login' style={{ marginRight: '20px' }}>
            <Button margin='20px 0 0 0' width='100%' name='Sign in' />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
