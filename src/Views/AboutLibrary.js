import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Input from '../Components/Input/Input';
import Button from '../Components/Button/Button';
import { init, sendForm } from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import { isValidJwt } from '../Utils/isValidJwt';
import AlertCard from '../Components/Modal/AlertCard';

import './styles/helpStyles.css';

init('user_sWNT4oROPiAoUGksmqFlD');

const AboutLibrary = () => {
  const { auth, user } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  // eslint-disable-next-line no-unused-vars
  const [userData, setUserData] = user;
  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    if (!isValidJwt) {
      setUserData({});
      setIsAuth(false);
      document.cookie =
        'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [helpInfo, setHelpInfo] = useState({
    name: userData.first_name
      ? `${userData.first_name} ${userData.last_name}`
      : '',
    email: userData.email ? userData.email : '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setHelpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = document.querySelector('#contact-form');

    sendForm('rvdl_forms', 'template_xu5gbwo', '#contact-form').then(
      (response) => {
        setMessage('Message successfully sent');
        console.log('SUCCESS!', response.status, response.text);
        form.reset();
      },
      (error) => {
        console.log('FAILED...', error);
        setMessage(
          'Something went wrong and your message was not sent. Error: ',
          error.response.data.error.message
        );
      }
    );
  };

  return (
    <div className='help__container'>
      <section className='help__section'>
        <h2>Help / How to Use the Library</h2>
        <p>
          As the library expands, this page will grow as a resource for using
          its various features.
        </p>
        <p>
          For any technical issues, please use the form below (coming soon) to
          submit a ticket.
        </p>
      </section>
      <section className='help__section'>
        <h2>Media Player</h2>
        <p>
          This feature will provide access to a wide range of Roopji's audio
          recordings, taken over decades of concerts, workshops, and interviews.
          This feature is our immediate priority for expansion, and we aim to
          add new tracks regularly as they are digitized from the original
          cassette tapes.
        </p>
        <p>
          The media player functions similarly to most standard web players. The
          one detail to be aware of is that you need to select the track to load
          it to the player, and then press the "play button" to actually begin
          playing it. This two-step feature has been implemented due to certain
          restrictions on mobile devices. We hope to find a solution to smooth
          out the process in the future.
        </p>
        <p>
          There is a search feature above the tracklist. This allows you to
          search the entire audio library for any keywords. Clearing the field,
          or pressing the "reset" button will bring back the full list.
          Additionally, the "surprise me" button will select a track at random.
        </p>
        <p>
          Over time, we expect to expand the search field into a more detailed
          filter that will allow for a higher level of specificity.
        </p>
      </section>
      <section>
        <form id='contact-form' onSubmit={(event) => handleFormSubmit(event)}>
          <Input
            label='Name'
            name='name'
            value={helpInfo.name}
            type='text'
            callback={handleChange}
            labelColor='white'
            margin='10px 0 0 0'
          />
          {/* {firstnameMessage !== '' && (
            <span className='form--alert'>{firstnameMessage}</span>
          )} */}
          <Input
            label='Email'
            name='email'
            value={helpInfo.email}
            type='text'
            callback={handleChange}
            labelColor='white'
            margin='20px 0 0 0'
          />
          {/* {lastnamelMessage !== '' && (
            <span className='form--alert'>{lastnamelMessage}</span>
          )} */}

          <Input
            label='Message'
            name='message'
            value={helpInfo.message}
            type='text'
            callback={handleChange}
            labelColor='white'
            margin='20px 0 0 0'
          />
          {/* {emailMessage !== '' && (
            <span className='form--alert'>{emailMessage}</span>
          )} */}
          <Button margin='30px 0 0 0' width='100%' name='Send Message' />
        </form>
      </section>
      {message !== '' && (
        <AlertCard
          closeAlert={() => {
            setMessage('');
          }}
          show={message !== '' ? true : false}
        >
          {message}
        </AlertCard>
      )}
    </div>
  );
};

export default AboutLibrary;
