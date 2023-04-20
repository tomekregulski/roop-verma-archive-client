import React, {
    useState,
    createContext,
    useEffect,
    ReactNode,
    useMemo,
    useContext,
} from 'react';
import jwt_decode from 'jwt-decode';

import { checkJwt } from '../util/checkJwt';

interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    stripeId: string;
}

interface AuthState {
    isAuth: boolean;
    userData: UserData | null;
    updateAuthStatus: (status: boolean) => void;
    updateUserData: (data: UserData) => void;
}

interface AuthContextProps {
    children: ReactNode;
}

export const OUTSIDE_AUTH_PROVIDER_ERROR =
    'Attempting to access AuthContext outside of Provider!';

export const AuthContext = createContext<AuthState | null>(null);

interface AuthContextProps {
    children: ReactNode;
}

export const AuthProvider = (props: AuthContextProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    function updateAuthStatus(status: boolean) {
        setIsAuth(status);
    }

    function updateUserData(data: UserData) {
        setUserData(data);
    }

    useEffect(() => {
        const currentJwt = checkJwt();
        console.log(currentJwt);
        if (currentJwt !== false) {
            // TODO: update JWT to only have ID and/or stripeId
            const decoded = jwt_decode(currentJwt);
            // TODO: clean this up
            setUserData(decoded as UserData);
            setIsAuth(true);
        } else {
            setIsAuth(false);
            setUserData(null);
        }
    }, [isAuth]);

    const value = useMemo(
        () => ({
            updateAuthStatus,
            updateUserData,
            isAuth,
            userData,
        }),
        [updateAuthStatus, updateUserData, isAuth, userData]
    );

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error(OUTSIDE_AUTH_PROVIDER_ERROR);
    }

    return authContext;
};
