import React from 'react';

import { AuthContext } from '../Context/AuthContext';

import AudioPlayerContainer from '../Components/AudioPlayerContainer/AudioPlayerContainer';
import TrackContainer from '../Components/TrackContainer/TrackContainer';

const AudioView = (props) => {
  const { width, breakpoint } = props;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '50px',
        }}
      >
        <AudioPlayerContainer width={width} breakpoint={breakpoint} />
        <TrackContainer />
      </div>
    </>
  );
};

export default AudioView;
