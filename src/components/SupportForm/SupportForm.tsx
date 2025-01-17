import './helpStyles.css';

import { init, sendForm } from 'emailjs-com';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { getErrorMessage } from '../../util/getErrorMessage';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

init('user_sWNT4oROPiAoUGksmqFlD');

export function SupportForm() {
  const { userData } = useAuthContext();
  const [emailMessage, setEmailMessage] = useState('');
  const [helpInfo, setHelpInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData ? userData.email : '',
    message: '',
  });

  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setHelpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateEmail = () => {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (helpInfo.email !== '') {
      if (helpInfo.email.match(validRegex)) {
        setEmailMessage('');
      } else {
        setEmailMessage('Please enter a valid email address');
      }
    } else {
      setEmailMessage('');
    }
  };

  useEffect(() => {
    console.log('email');
    validateEmail();
  }, [helpInfo.email]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (helpInfo.name !== '' && helpInfo.email !== '' && helpInfo.message !== '') {
      updateLoadingState(true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const form = document.querySelector('#contact-form')! as HTMLFormElement;
      sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form').then(
        (response) => {
          updateLoadingState(false);
          updateAlertMessage(['Message successfully sent']);
          console.log('SUCCESS!', response.status, response.text);
          form.reset();
        },
        (error) => {
          updateLoadingState(false);
          console.log('Failed to send support email', error);
          console.log(error);
          const errorMessage = getErrorMessage(error.text);
          updateAlertMessage([`Support email failed to send: ${errorMessage}`]);
        },
      );
    } else {
      updateAlertMessage(['Please fill out the form before submitting.']);
    }
  };

  return (
    <>
      <section>
        <form id="contact-form" onSubmit={(event) => handleFormSubmit(event)}>
          <Input
            id="support-message--name-input"
            label="Name"
            name="name"
            value={helpInfo.name}
            type="text"
            callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            labelColor="white"
            margin="10px 0 0 0"
          />
          <Input
            id="support-message--email-input"
            label="Email"
            name="email"
            value={helpInfo.email}
            type="text"
            callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            labelColor="white"
            margin="20px 0 0 0"
          />
          <Input
            id="support-message--message-input"
            label="Message"
            name="message"
            value={helpInfo.message}
            type="text"
            callback={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            labelColor="white"
            margin="20px 0 0 0"
          />
          {emailMessage !== '' && <span className="form--alert">{emailMessage}</span>}
        </form>
        <Button
          callback={(e: FormEvent) => handleFormSubmit(e)}
          margin="30px 0 0 0"
          width="100%"
          name="Send Message"
        />
      </section>
    </>
  );
}
