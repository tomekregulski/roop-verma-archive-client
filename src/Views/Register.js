import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';

import axios from 'axios';

import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const { auth } = useContext(AuthContext);
  const [isAuth, setIsAuth] = auth;

  let navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(userInfo);
    const { first_name, last_name, email, password } = userInfo;
    axios
      .post('http://localhost:5000/api/users/register', {
        first_name,
        last_name,
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        setIsAuth(true);
        navigate('/');
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
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
        />
        <Input
          value={userInfo.last_name}
          type='text'
          callback={handleChange}
          name='last_name'
        />
        <Input
          value={userInfo.email}
          type='text'
          callback={handleChange}
          name='email'
        />
        <Input
          value={userInfo.password}
          type='text'
          callback={handleChange}
          name='password'
        />
        <Button name='Submit' />
      </form>
      <div>
        <p>
          or
          <Link to='/login' style={{ marginRight: '20px' }}>
            log in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
