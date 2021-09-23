import React, { useContext, useEffect, useState } from 'react';
import { TracksContextData } from '../Context/TracksContext';

import AudioPlayer from 'react-h5-audio-player';

import sitar from '../images/sitar.png';
import sitarReverse from '../images/sitar-reverse.png';

import 'react-h5-audio-player/lib/styles.css';

const AudioControl = () => {
  const { selectedTrack, setSelectedTrack } = useContext(TracksContextData);
  const [trackUrl, setTrackUrl] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let url = selectedTrack && selectedTrack[0].url;
    setTrackUrl(url);
  }, [selectedTrack, setSelectedTrack]);

  const breakpoint = 550;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      {width > breakpoint && (
        <img
          src={sitarReverse}
          alt='sitar'
          style={{ height: '150px', marginRight: '50px' }}
        />
      )}
      <AudioPlayer
        style={{
          width: '300px',
          marginTop: '100px',
        }}
        src={trackUrl}
      />
      {width > breakpoint && (
        <img
          src={sitar}
          alt='sitar'
          style={{ height: '150px', marginLeft: '50px' }}
        />
      )}
    </div>
  );
};

export default AudioControl;
