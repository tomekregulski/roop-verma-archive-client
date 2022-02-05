import React, { useEffect, useContext } from 'react';

import { TracksContextData } from '../../Context/TracksContext';

import tanpuraRight from '../../assets/sitar.png';
import tanpuraLeft from '../../assets/sitar-reverse.png';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

import './audioPlayerContainerStyles.css';

const AudioPlayerContainer = (props) => {
  const { setTrackJwt, setProceed } = useContext(TracksContextData);

  useEffect(() => {
    const allCookies = document.cookie.split('; ');
    let cookies = {};
    for (let i = 0; i < allCookies.length; i++) {
      const currentCookie = allCookies[i].split('=');
      cookies[currentCookie[0]] = currentCookie[1];
    }
    const jwtKey = 'roop-verma-library';
    let currentJwt;
    if (Object.keys(cookies).includes(jwtKey)) {
      currentJwt = cookies[jwtKey];
      setTrackJwt(currentJwt);
      setProceed(true);
    }
  }, [setProceed, setTrackJwt]);

  return (
    <div className='audioContainerWrapper'>
      {props.width > props.breakpoint && (
        <img className='tanpura__left' src={tanpuraLeft} alt='tanpura' />
      )}
      <AudioPlayer />
      {props.width > props.breakpoint && (
        <img className='tanpura__right' src={tanpuraRight} alt='tanpura' />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
