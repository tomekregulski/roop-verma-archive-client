import React, { useContext, useEffect, useState } from 'react';
import { TracksContextData } from '../Context/TracksContext';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioControl = () => {
  const { selectedTrack, setSelectedTrack } = useContext(TracksContextData);

  const [trackUrl, setTrackUrl] = useState(null);

  useEffect(() => {
    let url = selectedTrack && selectedTrack[0].url;
    setTrackUrl(url);
  }, [selectedTrack, setSelectedTrack]);

  return (
    <AudioPlayer
      style={{
        width: '300px',
        marginTop: '100px',
      }}
      src={trackUrl}
    />
  );
};

export default AudioControl;
