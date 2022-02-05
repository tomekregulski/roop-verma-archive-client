import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './navbarStyles.css';

import { AuthContext } from '../../Context/AuthContext';
const Navbar = () => {
  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  return (
    <nav className='wrapper'>
      <div className='nav'>
        <h1 className='nav__h1'>
          <span>The Acharya Roop Verma </span>
          <span>Digital Library</span>
        </h1>
        <div className='navlinks'>
          <span className='navlink__span'>
            <Link to='/' className='navlinks__link'>
              Audio Library
            </Link>
            <Link to='roopji' className='navlinks__link'>
              About Roopji
            </Link>
          </span>
          <span className='navlink__span'>
            <Link to='library' className='navlinks__link'>
              About the Library
            </Link>
            {isAuth === true ? (
              <>
                <Link to='account' className='navlinks__link'>
                  Account Info
                </Link>
              </>
            ) : (
              <Link to='login' className='navlinks__link'>
                Login / Register
              </Link>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
