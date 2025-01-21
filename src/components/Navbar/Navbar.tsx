import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../context/AuthContext';

export function Navbar() {
  const { isAuth, updateAuthStatus, updateUserData } = useAuthContext();

  const navigate = useNavigate();

  // This should be handled in auth context
  const handleLogOut = () => {
    updateUserData(null);
    updateAuthStatus(false);
    document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/');
  };

  return (
    <nav
      className="
        flex 
        flex-col 
        items-center 
        justify-center 
        pb-[16px] 
        border-b-2 
        sticky 
        top-0 
        left-0 
        h-[125px]
      "
      style={{ backgroundColor: 'rgba(0, 180, 249)' }}
    >
      <div className="block mt-[15px] mb-[0] mx-auto">
        <h1 className="lg:text-[48px] md:text-[36px] sm:text-[20px]">
          <span>The Acharya Roop Verma </span>
          <span>Digital Library</span>
        </h1>
        <div className="mt-[10px] mx-auto flex justify-center items-center gap-4">
          <Link to="/" className="nav--links-link">
            Home
          </Link>
          <Link to="/audio" className="nav--links-link">
            Audio Library
          </Link>
          <Link to="roopji" className="nav--links-link">
            About Roopji
          </Link>
          <Link to="tributes" className="nav--links-link">
            Tributes
          </Link>
          <Link to="library" className="nav--links-link">
            Help
          </Link>
          {isAuth === true ? (
            <>
              <Link to="manage-account" className="nav--links-link">
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
        </div>
      </div>
    </nav>
  );
}
