import React, { useContext, useState } from 'react';

import { TracksContextData } from '../Context/TracksContext';
import { AuthContext } from '../Context/AuthContext';

import AudioPlayerContainer from '../Components/AudioPlayerContainer/AudioPlayerContainer';
import TrackContainer from '../Components/TrackContainer/TrackContainer';
import LoggedOutView from './LoggedOutView';

// import Select from '../Components/Select/Select';
import Button from '../Components/Button/Button';
import Input from '../Components/Input/Input';

// import { categories } from '../Utils/constants';
import './styles/audioViewStyles.css';

import { getEachItem } from '../Utils/helperFunctions';

const AudioView = (props) => {
  const { width, breakpoint } = props;
  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;
  const [search, setSearch] = useState('');

  const { setSearchFilter, setSelectedTrack, trackList } =
    useContext(TracksContextData);

  const filterSelect = (val) => {
    console.log(val);
    setSearchFilter(val);
  };

  const sendSearch = () => {
    const results = getEachItem(trackList, search);
    filterSelect(results);
  };

  const searchItem = (e, id) => {
    setSearch(e.target.value);
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
          {/* <Select
            callback={filterSelect}
            name='category-filter'
            item='Category Filter'
            values={categories}
          /> */}
          <Input
            label='Search Tracks'
            callback={(e, id) => searchItem(e, id)}
          />
          <Button
            margin='0 15px 0 0'
            name='Search'
            width='180px'
            callback={sendSearch}
            padding='15px 35px'
          />
          <Button
            margin='0 15px 0 0'
            name='Reset Filter'
            width='180px'
            callback={() => filterSelect([])}
            padding='15px 35px'
          />
        </div>
      )}
      <TrackContainer />
    </div>
  );
};

export default AudioView;
