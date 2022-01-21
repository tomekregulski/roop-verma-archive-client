import React, { useEffect, useContext } from 'react';

import { TracksContextData } from '../../Context/TracksContext';

import sitar from '../../assets/sitar.png';
import sitarReverse from '../../assets/sitar-reverse.png';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {props.width > props.breakpoint && (
        <img
          src={sitarReverse}
          alt='sitar'
          style={{ height: '200px', marginRight: '50px' }}
        />
      )}
      <AudioPlayer />
      {props.width > props.breakpoint && (
        <img
          src={sitar}
          alt='sitar'
          style={{ height: '200px', marginLeft: '50px' }}
        />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
