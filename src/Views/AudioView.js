import React, { useContext } from 'react';

import { TracksContextData } from '../Context/TracksContext';

import Select from '../Components/Select/Select';
import Button from '../Components/Button/Button';

import AudioPlayerContainer from '../Components/AudioPlayerContainer/AudioPlayerContainer';
import TrackContainer from '../Components/TrackContainer/TrackContainer';

const AudioView = (props) => {
  const { width, breakpoint } = props;

  const { setCategoryFilter, setSelectedTrack, trackList } =
    useContext(TracksContextData);

  const categories = ['all', 'concert', 'meditation'];

  const filterSelect = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
  };

  const supriseMe = () => {
    const randomTrackNumber = Math.floor(Math.random() * 10);
    const randomTrack = [trackList[randomTrackNumber]];
    setSelectedTrack(randomTrack);
  };

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
        <Select
          callback={filterSelect}
          name='category-filter'
          item='Category'
          values={categories}
        />
        <Button name='Surprise Me' callback={supriseMe} />
        <TrackContainer />
      </div>
    </>
  );
};

export default AudioView;
