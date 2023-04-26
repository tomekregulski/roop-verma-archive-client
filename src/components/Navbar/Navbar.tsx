import { Link } from 'react-router-dom';

import { useAuthContext } from '../../context/AuthContext';

import './navbarStyles.css';

const Navbar = () => {
    const { isAuth } = useAuthContext();

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
                            </>
                        ) : (
                            <Link to="register" className="nav--links-link">
                                Sign Up
                            </Link>
                        )}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
