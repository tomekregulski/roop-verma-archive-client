import type { PropsWithChildren } from 'react';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { Alert } from '../components/Alert/Alert';
import { LoadingNotification } from '../components/LoadingNotification/LoadingNotification';

interface NotificationState {
  isLoading: boolean;
  updateLoadingState: (loading: boolean) => void;
  alertMessage: string | null;
  updateAlertMessage: (message: string | null) => void;
}

interface NotificationContextProps extends PropsWithChildren {
  children: ReactNode;
}

export const OUTSIDE_NOTIFICATION_PROVIDER_ERROR =
  'Attempting to access NotificationContext outside of Provider!';

export const NotificationContext = createContext<NotificationState | null>(null);

export function NotificationProvider(props: NotificationContextProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>('');

  function updateLoadingState(loading: boolean) {
    setIsLoading(loading);
  }
  function updateAlertMessage(message: string | null) {
    setAlertMessage(message);
  }

  const value = useMemo(
    () => ({
      isLoading,
      updateLoadingState,
      alertMessage,
      updateAlertMessage,
    }),
    [isLoading],
  );

  return (
    <NotificationContext.Provider value={value}>
      <>
        {props.children}
        {isLoading && (
          <LoadingNotification show={isLoading}>Please wait...</LoadingNotification>
        )}
        {alertMessage && (
          <Alert closeAlert={() => updateAlertMessage(null)} show={!!alertMessage}>
            {alertMessage}
          </Alert>
        )}
      </>
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => {
  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    throw new Error(OUTSIDE_NOTIFICATION_PROVIDER_ERROR);
  }

  return notificationContext;
};
