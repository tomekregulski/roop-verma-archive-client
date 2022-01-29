import React, { useState, createContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const allCookies = document.cookie.split('; ');
    let cookies = {};
    for (let i = 0; i < allCookies.length; i++) {
      const currentCookie = allCookies[i].split('=');
      cookies[currentCookie[0]] = currentCookie[1];
    }
    const jwtKey = 'roop-verma-library';
    let currentJwt;
    if (Object.keys(cookies).includes(jwtKey)) {
      currentJwt = cookies[jwtKey];
      const decoded = jwt_decode(currentJwt);
      // console.log(decoded);
      setUserData(decoded);
      // setJwt(currentJwt);
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <AuthContext.Provider
      value={{
        auth: [isAuth, setIsAuth],
        user: [userData, setUserData],
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
