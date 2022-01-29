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
      // .get('https://roop-verma-archive.herokuapp.com/api/users/login', {
      .post('http://localhost:5000/api/users/login', {
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
      });
  };

  return (
    <>
      <h1>Log in through the form below</h1>
      <form onSubmit={(event) => handleFormSubmit(event)}>
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
          <Link to='/register' style={{ marginRight: '20px' }}>
            sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;