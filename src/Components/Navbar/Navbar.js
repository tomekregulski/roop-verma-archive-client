import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../Context/AuthContext';
const Navbar = () => {
  const { auth, jsonwt } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [jwt, setJwt] = jsonwt;

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
          <>
            <Link to='account' style={{ marginRight: '20px' }}>
              Account Info
            </Link>
          </>
        ) : (
          <Link to='login' style={{ marginRight: '20px' }}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
