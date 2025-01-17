import axios from 'axios';

import { emailErrorNotify } from './emailErrorNotify';
import { getErrorMessage } from './getErrorMessage';

export interface CreateNetworkErrorProps {
  errorCode?: number;
  errorMessage: string;
  isRegisteredUser: boolean;
  userId?: number;
  userEmailAddress?: string;
  userName?: string;
}

const key = import.meta.env.VITE_API_KEY;

export async function logNetworkError({
  errorCode,
  errorMessage,
  isRegisteredUser,
  userId,
  userEmailAddress,
  userName,
}: CreateNetworkErrorProps) {
  const errorData = {
    errorCode,
    errorMessage,
    isRegisteredUser,
    userId,
    userEmailAddress,
  };
  console.log(errorData);
  try {
    await axios.post(`${import.meta.env.VITE_API_ORIGIN}/api/v1/network-error/${key}`, {
      ...errorData,
    });
    console.log('Successfully logged network error', {
      errorCode,
      errorMessage,
      isRegisteredUser,
      userId,
      userEmailAddress,
    });
  } catch (error) {
    console.log('Failed to log network error.');
    console.log(error);
    const errorObj = getErrorMessage(error);
    emailErrorNotify({
      fn: 'logNetworkError',
      args: `${errorObj.errorCode},
        ${errorObj.errorMessage},
        ${isRegisteredUser},
        ${userId},
        ${userEmailAddress},
      }`,
      errorMessage: errorObj.errorMessage,
      userName: userName ?? 'N/A',
      userEmail: userEmailAddress || 'N/A',
    });
  }
}
