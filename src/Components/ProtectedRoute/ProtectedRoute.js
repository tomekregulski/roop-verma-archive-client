import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';

import { AuthContext } from '../../Context/AuthContext';

// import axios from 'axios';

const ProtectedRoute = (props) => {
  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  // const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    // if (window.location.href.includes('?')) {
    //   const query = window.location.href.split('?');
    //   console.log(query[1].split('&'));
    //   setCredentials({
    //     token: query[1],
    //   });
    // } else {
    //   setIsLoading(false);
    // }
    console.log(isAuth);
  }, []);

  if (isLoading === true) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if ((isLoading === false && isAuth) === true) {
    return <Route {...props} />;
  } else {
    return <Route to={'/login'} />;
  }
};

export default ProtectedRoute;
