import React, { useContext } from 'react';

import { TracksContextData } from '../Context/TracksContext';
import { AuthContext } from '../Context/AuthContext';

import AudioPlayerContainer from '../Components/AudioPlayerContainer/AudioPlayerContainer';
import TrackContainer from '../Components/TrackContainer/TrackContainer';
import LoggedOutView from './LoggedOutView';

import Select from '../Components/Select/Select';
import Button from '../Components/Button/Button';

import { categories } from '../Utils/constants';
import './styles/audioViewStyles.css';

const AudioView = (props) => {
  const { width, breakpoint } = props;
  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  const { setCategoryFilter, setSelectedTrack, trackList } =
    useContext(TracksContextData);

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
    <div className='audioview--container'>
      {isAuth === false ? <LoggedOutView /> : null}
      <AudioPlayerContainer width={width} breakpoint={breakpoint} />
      {isAuth === true && (
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <Button
            margin='0 15px 0 0'
            name='Surprise Me'
            width='180px'
            callback={supriseMe}
            padding='15px 35px'
          />
          <Select
            callback={filterSelect}
            name='category-filter'
            item='Category Filter'
            values={categories}
          />
        </div>
      )}
      <TrackContainer />
    </div>
  );
};

export default AudioView;
