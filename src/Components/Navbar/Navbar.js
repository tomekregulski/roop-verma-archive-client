import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../Context/AuthContext';

import axios from 'axios';

const Navbar = () => {
  const { auth, jsonwt } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [jwt, setJwt] = jsonwt;

  let navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get('https://roop-verma-archive.herokuapp.com/api/users/logout', {})
      .then((response) => {
        console.log(response);
        setIsAuth(false);
        setJwt('');
        document.cookie =
          'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAuth(false);
  };

  return (
    <nav
      style={{
        textAlign: 'left',
        padding: '40px 0 80px 40px',
        color: 'white',
      }}
    >
      <h1>Welcome to the Acharya Roop Verma Digital Library</h1>
      <div style={{ marginTop: '10px' }}>
        <Link to='/' style={{ marginRight: '20px' }}>
          Audio Library
        </Link>
        <Link to='roopji' style={{ marginRight: '20px' }}>
          About Roopji
        </Link>
        <Link to='library' style={{ marginRight: '20px' }}>
          About the Library
        </Link>
        {isAuth === true ? (
          <button onClick={handleLogout} style={{ color: 'white' }}>
            Logout
          </button>
        ) : (
          <Link to='login' style={{ marginRight: '20px' }}>
            Login / Register
          </Link>
        )}
        {/* <a href='#' style={{ marginRight: '20px' }}>
          Support the Project
        </a> */}
      </div>
    </nav>
  );
};

export default Navbar;
