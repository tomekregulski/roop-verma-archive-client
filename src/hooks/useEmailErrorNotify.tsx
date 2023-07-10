import { init, send } from 'emailjs-com';

import { getErrorMessage } from '../util/getErrorMessage';

interface EmailErrorNotifyProps {
  fn: string;
  args: string;
  errorMessage: string;
  errorStack?: string;
  userName: string;
  userEmail: string;
}

init('user_sWNT4oROPiAoUGksmqFlD');

export function useEmailErrorNotify(props: EmailErrorNotifyProps) {
  const { fn, args, errorMessage, errorStack, userName, userEmail } = props;

  send('rvdl_forms', 'template_fn3hr8a', {
    fn,
    args,
    errorMessage,
    errorStack,
    userName,
    userEmail,
  }).then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
      return { success: true, message: '' };
    },
    (error) => {
      console.log('Error notify email failed to send');
      console.log(error);
      const errorMessage = getErrorMessage(error.text);
      return { success: false, message: errorMessage };
    },
  );
}
