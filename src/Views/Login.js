import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';
// import ReCAPTCHA from 'react-google-recaptcha';
import './styles/formStyles.css';

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  // const [token, setToken] = useState('');

  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

  // function onCaptchaChange(value) {
  //   console.log('Captcha value:', value);
  // }

  let navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleToken = async (token) => {
  //   setToken(token);

  // const res = await axios.post(
  //   `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY}&response=${token}`
  // );

  // if (res.data.success) console.log('Human');
  // else console.log('BOT!!!');
  // };

  // const handleExpire = () => {
  //   setToken(null);
  // };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (Object.values(userInfo).every((v) => v !== '')) {
      const { email, password } = userInfo;
      axios
        // .post('https://roop-verma-archive.herokuapp.com/api/users/login', {
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
          console.log(error);
          setMessage('Invalid email or password');
        });
    } else {
      if (userInfo.email === '') {
        setEmailMessage('Please enter an email address');
      }
      if (userInfo.password === '') {
        setPasswordMessage('Please enter a password');
      }
    }
  };

  return (
    <div className='form--container'>
      <p>
        Please Note - the next month or two will bring with them a few
        structural changes to the database as preparations for public release
        are made. This will require a few complete resets which will clear any
        existing user accounts. If you find that your password suddenly does not
        work, please try recreating it. If that brings any errors, reach out via
        the help form.
      </p>
      <h2>Sign in</h2>
      <form onSubmit={(event) => handleFormSubmit(event)}>
        <Input
          label='Email'
          value={userInfo.email}
          type='email'
          callback={handleChange}
          name='email'
          labelColor='white'
          margin='10px 0 0 0'
        />
        {emailMessage !== '' && (
          <span className='form--alert'>{emailMessage}</span>
        )}
        <Input
          label='Password'
          value={userInfo.password}
          type='password'
          callback={handleChange}
          name='password'
          labelColor='white'
          margin='20px 0 0 0'
        />
        {passwordMessage !== '' && (
          <span className='form--alert'>{passwordMessage}</span>
        )}

        <Button margin='30px 0 0 0' width='100%' name='Log in' />
        {message !== '' ? <span className='form--alert'>{message}</span> : null}
        <div className='form--link-container'>
          <span>or</span>
          <Link to='/register'>
            <Button margin='10px 0 0 0' width='100%' name='Sign up' />
          </Link>
          <span>Forgot your password?</span>
          <Link to='/library' style={{ marginRight: '20px' }}>
            <Button margin='10px 0 0 0' width='100%' name='Contact Us' />
          </Link>
          {/* <div style={{ marginTop: '30px' }}>
            <ReCAPTCHA
              // sitekey='6Lf-pY8eAAAAAK1Jhj_M3GeYyVzZvKz6eWJsbA_d'
              // onChange={onCaptchaChange}
              sitekey={process.env.REACT_APP_SITE_KEY}
              onChange={handleToken}
              // onExpire={handleExpire}
              // size='compact'
            />
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
