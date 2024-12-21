import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isValidJwt } from '../util/isValidJwt';

// const key = import.meta.env.VITE_API_KEY;

type AllowedSubscriptionStatuses = 'trialing' | 'active' | 'incomplete';
type NotAllowedSubscriptionStatuses =
  | 'incomplete_expired'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

// type SubscriptionStatuses = AllowedSubscriptionStatuses | NotAllowedSubscriptionStatuses;

export const allowedSubscriptionStatuses = ['trialing', 'active', 'incomplete'];

// export type AllowedSubscriptionStatuses = typeof allowedSubscriptionStatuses;

export const notAllowedSubscriptionStatuses = [
  'incomplete_expired',
  'past_due',
  'canceled',
  'unpaid',
  'paused',
];

// export type NotAllowedSubscriptionStatuses = typeof notAllowedSubscriptionStatuses;

export const subscriptionStatuses = {
  ...allowedSubscriptionStatuses,
  ...notAllowedSubscriptionStatuses,
};

type SubscriptionStatuses = AllowedSubscriptionStatuses | NotAllowedSubscriptionStatuses;

export const isAllowedSubscriptionStatus = (subscriptionStatus: SubscriptionStatuses) => {
  console.log(subscriptionStatus);
  console.log(allowedSubscriptionStatuses.includes(subscriptionStatus));
  return allowedSubscriptionStatuses.includes(subscriptionStatus);
};
// subscriptionStatus === typeOf AllowedSubscriptionStatuses
export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  stripeId: string;
  subscriptionActive: SubscriptionStatuses;
}

interface AuthState {
  isAuth: boolean;
  userData: UserData | null;
  hasAllowedStatus: boolean;
  updateAuthStatus: (status: boolean) => void;
  updateUserData: (data: UserData | null) => void;
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

async function isUserValidated(stripeId: string) {
  const key = import.meta.env.VITE_API_KEY;
  const res = await axios.get(
    `${
      import.meta.env.VITE_API_ORIGIN
    }/api/v1/user/find-by-stripe-id/${key}?stripeId=${stripeId}`,
  );
  const user = res.data.existingUser as UserData;
  const isValidated = user ? true : false;
  const isAllowed = user ? isAllowedSubscriptionStatus(user.subscriptionActive) : false;
  return { isValidated, isAllowed };
}

export const AuthProvider = (props: AuthContextProps) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasAllowedStatus, setHasAllowedStatus] = useState<boolean>(false);

  function updateAuthStatus(status: boolean) {
    console.log(status);
    setIsAuth(status);
  }

  function updateUserData(data: UserData | null) {
    setUserData(data);
    let isAllowed: boolean;

    if (data === null) {
      isAllowed = false;
    } else {
      isAllowed = isAllowedSubscriptionStatus(data.subscriptionActive);
    }
    setHasAllowedStatus(isAllowed);
  }

  useEffect(() => {
    console.log('AuthContext useEffect');
    const currentJwt = isValidJwt();
    // currently firing 4 times initially
    async function user() {
      if (currentJwt?.foundJwt) {
        // TODO: update JWT to only have ID and/or stripeId
        const decoded = jwt_decode(currentJwt.jwt) as UserData;
        // console.log(decoded);
        // console.log(decoded.subscriptionActive);
        const { isValidated, isAllowed } = await isUserValidated(decoded.stripeId);
        console.log('isValidated: ', isValidated);
        console.log('isAllowed: ', isAllowed);
        // TODO: clean this up
        if (!isValidated) {
          console.log('AuthContext: setting isAuth: false');
          setIsAuth(false);
          setUserData(null);
          setHasAllowedStatus(false);
        } else {
          console.log('AuthContext: setting isAuth: true');
          setUserData(decoded);
          console.log('settng isAllowed: ', isAllowed);
          setHasAllowedStatus(isAllowed);
          // setIsAuth(true);
          setIsAuth(true);
        }
      } else {
        console.log('AuthContext: setting isAuth: false and userData: null');
        setIsAuth(false);
        setUserData(null);
      }
    }
    user();
  }, []);

  const value = useMemo(
    () => ({
      updateAuthStatus,
      updateUserData,
      isAuth,
      userData,
      hasAllowedStatus,
    }),
    [updateAuthStatus, updateUserData, isAuth, userData],
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(OUTSIDE_AUTH_PROVIDER_ERROR);
  }

  return authContext;
};
