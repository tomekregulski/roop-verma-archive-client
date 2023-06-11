import './styles/welcomeStyles.css';

import { useAuthContext } from '../context/AuthContext';
import { Login } from './Login';

export function Welcome() {
  const { userData, isAuth } = useAuthContext();

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
