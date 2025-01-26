import type { PropsWithChildren, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { AdminLogin } from '../views/AdminLogin';

interface AdminState {
  isAdmin: boolean;
  checkIsAdmin: (password: string) => void;
}

interface AdminContextProps extends PropsWithChildren {
  children: ReactNode;
}

export const OUTSIDE_ADMIN_PROVIDER_ERROR =
  'Attempting to access AdminContext outside of Provider!';

export const AdminContext = createContext<AdminState | null>(null);

const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

export function AdminProvider(props: AdminContextProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  function checkPassword(password: string) {
    return password === adminPassword;
  }

  function checkIsAdmin(password: string) {
    const isAdmin = checkPassword(password);
    console.log('isAdmin: ', isAdmin);
    if (!isAdmin) {
      alert('Incorrect password');
    }
    setIsAdmin(isAdmin);
  }

  const value = useMemo(
    () => ({
      isAdmin,
      checkIsAdmin,
    }),
    [isAdmin],
  );

  return (
    <AdminContext.Provider value={value}>
      <>{!isAdmin ? <AdminLogin /> : props.children}</>
    </AdminContext.Provider>
  );
}

export const useAdminContext = () => {
  const adminContext = useContext(AdminContext);

  if (!adminContext) {
    throw new Error(OUTSIDE_ADMIN_PROVIDER_ERROR);
  }

  return adminContext;
};
