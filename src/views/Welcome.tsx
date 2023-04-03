// import { useContext, useEffect } from 'react';

// import { AuthContext } from '../context/AuthContext';

import './styles/welcomeStyles.css';
import { Login } from './Login';
// import { useNavigate } from 'react-router-dom';
// import { isValidJwt } from '../util/isValidJwt';

export function Welcome() {
    // const { auth, user } = useContext(AuthContext);

    // const [userData, setUserData] = user;
    // const [isAuth, setIsAuth] = auth;

    // let navigate = useNavigate();

    // useEffect(() => {
    //     console.log('checking');
    //     const valid = isValidJwt();
    //     console.log(valid);
    //     if (!valid) {
    //         setUserData({});
    //         setIsAuth(false);
    //         document.cookie =
    //             'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    //         navigate('/');
    //     }
    // }, []);

    return (
        <div className="welcome__container">
            <h2>
                Welcome
                {/* {isAuth === true &&
                    Object.keys(userData).length > 0 &&
                    ` ${userData.first_name}`}
                ! */}
            </h2>
            {/* {isAuth === false ? ( */}
            <>
                <p>
                    If you are a subscriber, please login through the form
                    below. If you would like to register as a new user, please
                    click "Sign Up" below, and follow the instructions.
                </p>
                <p>
                    Otherwise, we have made a small selection of materials
                    available to the public. To explore those, please Click on
                    the "Audio Library" link above. Additionally, you can
                    explore the other pages to learn more about Roopji and this
                    project
                </p>
                <Login />
            </>
            {/* ) : (
                 <>
                     <p>
                         Please use the navigation above to move throught the app
                     </p>
                 </>
             )} */}
        </div>
    );
}
