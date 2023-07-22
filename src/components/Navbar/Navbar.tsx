import './navbarStyles.css';

import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../context/AuthContext';

export function Navbar() {
  const { isAuth, updateAuthStatus, updateUserData } = useAuthContext();

  const navigate = useNavigate();

  const handleLogOut = () => {
    updateUserData(null);
    updateAuthStatus(false);
    document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  };

  return (
    <nav>
      <div className="nav--container">
        <h1>
          <span>The Acharya Roop Verma </span>
          <span>Digital Library</span>
        </h1>
        <div className="nav--links">
          <span>
            <Link to="/" className="nav--links-link">
              Home
            </Link>
            <Link to="/audio" className="nav--links-link">
              Audio Library
            </Link>
            <Link to="roopji" className="nav--links-link">
              About Roopji
            </Link>
            <Link to="testimonials" className="nav--links-link">
              Testimonials
            </Link>
          </span>
          <span>
            <Link to="library" className="nav--links-link">
              Help
            </Link>
            {isAuth === true ? (
              <>
                <Link to="account" className="nav--links-link">
                  Account Info
                </Link>
                {
                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                  <Link to="" onClick={() => handleLogOut()}>
                    Log Out
                  </Link>
                }
              </>
            ) : (
              <Link to="signup" className="nav--links-link">
                Sign Up
              </Link>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
}
