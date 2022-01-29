import React, { useState } from 'react';
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

  let navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'confirm_password') {
      if (userInfo.password !== '' && userInfo.confirm_password !== '') {
        if (userInfo.password !== userInfo.confirm_password) {
          console.log('Passwords must match!');
        }
      }
    }
    if (name === 'email') {
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (value.match(validRegex)) {
        console.log('valid email');
      } else {
        console.log('invalid email');
      }
    }
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // check all fields filled

    if (userInfo.password === userInfo.confirm_password) {
      const { first_name, last_name, email, password } = userInfo;

      axios
        // .post('https://roop-verma-archive.herokuapp.com/api/users/register', {
        //   first_name,
        //   last_name,
        //   email,
        //   password,
        // })
        .post('http://localhost:5000/api/users/', {
          first_name,
          last_name,
          email,
          password,
        })
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
        <Input
          value={userInfo.email}
          type='text'
          callback={handleChange}
          name='email'
          label='Email'
        />
        <Input
          value={userInfo.password}
          type='text'
          callback={handleChange}
          name='password'
          label='Password'
        />
        <Input
          value={userInfo.confirm_password}
          type='text'
          callback={handleChange}
          name='confirm_password'
          label='Confirm Password'
        />
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
