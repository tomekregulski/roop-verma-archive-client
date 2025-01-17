import { AxiosError } from 'axios';

const supportEmail = import.meta.env.VITE_RVDL_EMAIL_ADDRESS;

export function getErrorMessage(error: string | Error | unknown) {
  let errorMessage = '';
  let errorCode: number | undefined;
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof AxiosError) {
    errorMessage =
      error.response?.data.error.message ??
      `A server error has occured, and a detailed message was not returned. Please contact support at ${supportEmail}`;
    errorCode = error.response?.data.errorCode;
  }

  console.error('errorMessage: ', errorMessage);

  return { errorMessage, errorCode };
}
