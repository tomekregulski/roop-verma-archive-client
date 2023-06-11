import './styles/helpStyles.css';

import { init, sendForm } from 'emailjs-com';
import { ChangeEvent, FormEvent, /* useContext, useEffect,*/ useState } from 'react';

// import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert/Alert';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { useAuthContext } from '../context/AuthContext';
import { getErrorMessage } from '../util/getErrorMessage';
// import { isValidJwt } from '../util/isValidJwt';

init('user_sWNT4oROPiAoUGksmqFlD');

const AboutLibrary = () => {
  const { /* isAuth,*/ userData } = useAuthContext();

  const [message, setMessage] = useState('');

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isValidJwt) {
  //     setUserData({});
  //     setIsAuth(false);
  //     document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  //     navigate('/');
  //   }
  // }, []);

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const form = document.querySelector('#contact-form')! as HTMLFormElement;

    sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form').then(
      (response) => {
        setMessage('Message successfully sent');
        // setLoading?
        console.log('SUCCESS!', response.status, response.text);
        form.reset();
      },
      (error) => {
        console.log('Failed to send support email', error);
        console.log(error);
        const errorMessage = getErrorMessage(error.text);
        setMessage(`Support email failed to send: ${errorMessage}`);
      },
    );
  };

  return (
    <div className="help__container">
      <section className="help__section">
        <h2>Help / How to Use the Library</h2>
        <p>
          As the library expands, this page will grow as a resource for using its various
          features.
        </p>
        <p>
          For any technical issues, please use the form below (coming soon) to submit a
          ticket.
        </p>
      </section>
      <section className="help__section">
        <h2>Media Player</h2>
        <p>
          This feature will provide access to a wide range of Roopji&apos;s audio
          recordings, taken over decades of concerts, workshops, and interviews. This
          feature is our immediate priority for expansion, and we aim to add new tracks
          regularly as they are digitized from the original cassette tapes.
        </p>
        <p>
          The media player functions similarly to most standard web players. The one
          detail to be aware of is that you need to select the track to load it to the
          player, and then press the &quot;play button&quot; to actually begin playing it.
          This two-step feature has been implemented due to certain restrictions on mobile
          devices. We hope to find a solution to smooth out the process in the future.
        </p>
        <p>
          There is a search feature above the tracklist. This allows you to search the
          entire audio library for any keywords. Clearing the field, or pressing the
          &quot;reset&quot; button will bring back the full list. Additionally, the
          &quot;surprise mev button will select a track at random.
        </p>
        <p>
          Over time, we expect to expand the search field into a more detailed filter that
          will allow for a higher level of specificity.
        </p>
      </section>
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
    </div>
  );
};

export default AboutLibrary;
