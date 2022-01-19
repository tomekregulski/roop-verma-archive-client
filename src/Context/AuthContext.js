import React, { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({});
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    console.log('cookies');
    const allCookies = document.cookie.split('; ');
    let cookies = {};
    for (let i = 0; i < allCookies.length; i++) {
      const currentCookie = allCookies[i].split('=');
      cookies[currentCookie[0]] = currentCookie[1];
    }
    console.log(allCookies);
    console.log(cookies);
    const jwtKey = 'roop-verma-library';
    let currentJwt;
    if (Object.keys(cookies).includes(jwtKey)) {
      currentJwt = cookies[jwtKey];
      setJwt(currentJwt);
      console.log(currentJwt);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth: [isAuth, setIsAuth], user: [userData, setUserData] }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
