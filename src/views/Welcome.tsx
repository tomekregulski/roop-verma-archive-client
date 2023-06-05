import './styles/welcomeStyles.css';

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
// import { isValidJwt } from '../util/isValidJwt';
import { Login } from './Login';

export function Welcome() {
  const { userData, isAuth /* updateUserData, updateAuthStatus */ } = useAuthContext();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isValidJwt) {
  //     updateUserData(null);
  //     updateAuthStatus(false);
  //     document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  //     navigate('/');
  //   }
  // }, []);

  return (
    <div className="welcome__container">
      <h2>Welcome {isAuth === true && userData && ` ${userData.firstName}`}!</h2>
      {!isAuth ? (
        <>
          <p>
            If you are a subscriber, please login through the form below. If you would
            like to register as a new user, please click &quot;Sign Up&quot; below, and
            follow the instructions.
          </p>
          <p>
            Otherwise, we have made a small selection of materials available to the
            public. To explore those, please Click on the &quot;Audio Library&quot; link
            above. Additionally, you can explore the other pages to learn more about
            Roopji and this project
          </p>
          <Login />
        </>
      ) : (
        <>
          <p>Please use the navigation above to move throught the app</p>
        </>
      )}
    </div>
  );
}
