import { AxiosError } from 'axios';

export function getErrorMessage(error: string | Error | unknown) {
  console.log('Error Message:');
  console.log(error);
  let errorMessage = '';
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof AxiosError) {
    errorMessage =
      error.response?.data.error.message ??
      'a server error has occured, and a detailed message was not returned. Please contact support at roopvermadigitallibrary@gmail.com';
    // error.response.data.error.message, ????
  }

  return errorMessage;
}
