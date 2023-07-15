import './helpStyles.css';

import { init, sendForm } from 'emailjs-com';
import { ChangeEvent, FormEvent, /* useContext, useEffect,*/ useState } from 'react';

import { useAuthContext } from '../../context/AuthContext';
import { getErrorMessage } from '../../util/getErrorMessage';
// import { useNavigate } from 'react-router-dom';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { LoadingNotification } from '../LoadingNotification/LoadingNotification';

init('user_sWNT4oROPiAoUGksmqFlD');

export function SupportForm() {
  const { /* isAuth,*/ userData } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [helpInfo, setHelpInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}` : '',
    email: userData ? userData.email : '',
    message: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setHelpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (helpInfo.name !== '' && helpInfo.email !== '' && helpInfo.message !== '') {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const form = document.querySelector('#contact-form')! as HTMLFormElement;
      sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form').then(
        (response) => {
          setLoading(false);
          setMessage('Message successfully sent');
          // setLoading?
          console.log('SUCCESS!', response.status, response.text);
          form.reset();
        },
        (error) => {
          setLoading(false);
          console.log('Failed to send support email', error);
          console.log(error);
          const errorMessage = getErrorMessage(error.text);
          setMessage(`Support email failed to send: ${errorMessage}`);
        },
      );
    } else {
      setMessage('Please fill out the form before submitting.');
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
          {/* {firstnameMessage !== '' && (
            <span className='form--alert'>{firstnameMessage}</span>
          )} */}
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
          {/* {lastnamelMessage !== '' && (
            <span className='form--alert'>{lastnamelMessage}</span>
          )} */}

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
          {/* {emailMessage !== '' && (
            <span className='form--alert'>{emailMessage}</span>
          )} */}
        </form>
        <Button
          callback={(e: FormEvent) => handleFormSubmit(e)}
          margin="30px 0 0 0"
          width="100%"
          name="Send Message"
        />
      </section>
      {loading && (
        <LoadingNotification show={loading}>Please wait...</LoadingNotification>
      )}
      {message !== '' && (
        <Alert
          closeAlert={() => {
            setMessage('');
          }}
          show={message !== '' ? true : false}
        >
          {message}
        </Alert>
      )}
    </>
  );
}
