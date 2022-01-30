import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

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
    const { email, password } = userInfo;
    axios
      .post('https://roop-verma-archive.herokuapp.com/api/users/login', {
        // .post('http://localhost:5000/api/users/login', {
        email,
        password,
      })
      .then((response) => {
        const token = response.data.token;
        document.cookie = `roop-verma-library=${token}`;
        setIsAuth(true);
        setUserData(response.data.userData);
        navigate('/');
      })
      .catch((error) => {
        // handle errors
        console.log(error);
        setMessage('Invalid email or password');
        // FIX THIS
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <form
        style={{ width: '300px' }}
        onSubmit={(event) => handleFormSubmit(event)}
      >
        <Input
          label='Email'
          value={userInfo.email}
          type='email'
          callback={handleChange}
          name='email'
          labelColor='white'
        />
        <Input
          label='Password'
          value={userInfo.password}
          type='password'
          callback={handleChange}
          name='password'
          labelColor='white'
          margin='20px 0 0 0'
        />
        <Button margin='20px 0 0 0' width='100%' name='Log in' />
        {message !== '' ? (
          <span style={{ color: 'red' }}>{message}</span>
        ) : null}
        <div style={{ margin: '20px 0 0 0', width: '100%' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>or</p>
          <Link to='/register'>
            <Button margin='20px 0 0 0' width='100%' name='Sign up' />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
