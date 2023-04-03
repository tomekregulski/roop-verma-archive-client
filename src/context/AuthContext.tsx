import React, { useState, createContext, useEffect, ReactNode } from 'react';
import jwt_decode from 'jwt-decode';

import { checkJwt } from '../util/checkJwt';

interface AuthContextProps {
    children: ReactNode;
}

export const AuthContext = createContext();

export const AuthProvider = (props: AuthContextProps) => {
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState({});

    // useEffect(() => {
    //     const currentJwt = checkJwt();
    //     if (currentJwt !== false) {
    //         // update JWT to only have ID
    //         const decoded = jwt_decode(currentJwt);
    //         setUserData(decoded);
    //         setIsAuth(true);
    //     } else {
    //         setIsAuth(false);
    //         setUserData({});
    //     }
    // }, [isAuth]);

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
