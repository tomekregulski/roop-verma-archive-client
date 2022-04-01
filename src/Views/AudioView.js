import React, { useContext, useState, useEffect } from 'react';

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

  const {
    setSearchFilter,
    setSelectedTrack,
    trackList,
    filteredTracks,
    setFilteredTracks,
  } = useContext(TracksContextData);

  useEffect(() => {
    let searchResults = { ids: [], type: '' };
    if (search === '') {
      searchResults = { ...searchResults, type: 'all' };
      setSearchFilter(searchResults);
    } else {
      const results = getEachItem(trackList, search);
      if (results.length === 0) {
        searchResults = { ...searchResults, type: 'none' };
        setSearchFilter(searchResults);
      } else if (results.length > 0) {
        searchResults = { ids: results, type: 'some' };
        setSearchFilter(searchResults);
      } else {
        searchResults = { ...searchResults, type: 'error' };
        setSearchFilter(searchResults);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const searchItem = (e, id) => {
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  };

  const supriseMe = () => {
    const randomTrackNumber = Math.floor(Math.random() * 10);
    const randomTrack = [filteredTracks[randomTrackNumber]];
    setSelectedTrack(randomTrack);
  };

  const showAll = () => {
    console.log(trackList);
    setFilteredTracks(trackList);
    setSearch('');
  };

  return (
    <div className='audioview--container'>
      {isAuth === false ? <LoggedOutView /> : null}
      <AudioPlayerContainer width={width} breakpoint={breakpoint} />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <Input
          placeholder='Search Tracks'
          margin='0 0 0 0'
          padding='7px 15px'
          callback={(e, id) => searchItem(e, id)}
        />
        <Button
          margin='0 0 0 15px'
          name='Show All'
          width='180px'
          callback={showAll}
          padding='8px 35px'
        />
        <Button
          margin='0 0 0 15px'
          name='Surprise Me'
          width='180px'
          callback={supriseMe}
          padding='8px 35px'
        />
      </div>
      <TrackContainer />
    </div>
  );
};

export default AudioView;
