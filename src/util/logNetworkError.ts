import axios from 'axios';

import { emailErrorNotify } from './emailErrorNotify';
import { getErrorMessage } from './getErrorMessage';

export interface CreateNetworkErrorProps {
  errorCode: number;
  errorMessage: string;
  // userFriendlyErrorMessage: string;
  isRegisteredUser: boolean;
  userId?: number;
  userEmailAddress?: string;
  userName?: string;
}

const key = import.meta.env.VITE_API_KEY;

export async function logNetworkError({
  errorCode,
  errorMessage,
  // userFriendlyErrorMessage,
  isRegisteredUser,
  userId,
  userEmailAddress,
  userName,
}: CreateNetworkErrorProps) {
  try {
    await axios.post(`${import.meta.env.VITE_API_ORIGIN}/api/v1/error/${key}`, {
      data: {
        errorCode,
        errorMessage,
        isRegisteredUser,
        userId,
        userEmailAddress,
      },
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
    const errorMessage = getErrorMessage(error);
    emailErrorNotify({
      fn: 'logNetworkError',
      args: `${errorCode},
        ${errorMessage},
        ${isRegisteredUser},
        ${userId},
        ${userEmailAddress},
      }`,
      errorMessage: errorMessage,
      userName: userName ?? 'N/A',
      userEmail: userEmailAddress || 'N/A',
    });
  }
  // dispatch errorNotification(userFriendlyErrorMessage)
}
