import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isValidJwt } from '../Utils/isValidJwt';

const AboutRoopji = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;

  let navigate = useNavigate();

  useEffect(() => {
    if (!isValidJwt) {
      setUserData({});
      setIsAuth(false);
      document.cookie =
        'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Info About Roopji</h1>
    </div>
  );
};

export default AboutRoopji;
