import { init, sendForm } from 'emailjs-com';
import { ChangeEvent, useState } from 'react';

import { Section } from '../../components/Section/Section';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { getErrorMessage } from '../../util/getErrorMessage';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { Input } from '../Input/Input';

init('user_sWNT4oROPiAoUGksmqFlD');

export function SupportForm() {
  const { userData } = useAuthContext();
  const [helpInfo, setHelpInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData ? userData.email : '',
    message: '',
  });

  function isFormComplete() {
    if (helpInfo.name !== '' && helpInfo.email !== '' && helpInfo.message !== '') {
      return true;
    }
    return false;
  }
  const isSubmitDisabled = !isFormComplete();

  const { updateLoadingState, updateAlertMessage } = useNotificationContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setHelpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleFormSubmit() {
    if (helpInfo.name !== '' && helpInfo.email !== '' && helpInfo.message !== '') {
      updateLoadingState(true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const form = document.querySelector('#contact-form')! as HTMLFormElement;
      await sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form').then(
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
  }

  return (
    <Section>
      <Form
        id="contact-form"
        handleSubmit={handleFormSubmit}
        isSubmitDisabled={isSubmitDisabled}
      >
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
          type="email"
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
        <Button
          type="submit"
          margin="30px 0 0 0"
          width="100%"
          name="Send  Message"
          form="contact-form"
          isDisabledMessage={isSubmitDisabled ? 'Please complete the form' : undefined}
        />
      </Form>
    </Section>
  );
}
