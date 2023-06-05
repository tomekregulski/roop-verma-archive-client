// import { categories } from '../Utils/constants';
import './styles/audioViewStyles.css';

import React, { ChangeEvent, useEffect, useState } from 'react';
// import { TracksContextData } from '../Context/TracksContext';
// import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
// import Select from '../Components/Select/Select';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import TrackContainer from '../components/TrackContainer/TrackContainer';
import { useAudioContext } from '../context/AudioContext';
import { useAuthContext } from '../context/AuthContext';
import { getEachItem } from '../util/helperFunctions';
import { isValidJwt } from '../util/isValidJwt';
import { LoggedOutView } from './LoggedOutView';

interface AudioViewProps {
  width: number;
  breakpoint: number;
}

const AudioView = (props: AudioViewProps) => {
  const { width, breakpoint } = props;
  const [search, setSearch] = useState('');
  const {
    setSearchFilter,
    setSelectedTrack,
    trackList,
    filteredTracks,
    setFilteredTracks,
  } = useAudioContext();
  // TODO: what is this?

  const { /* userData, */ updateUserData, updateAuthStatus, isAuth } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidJwt) {
      updateUserData(null);
      updateAuthStatus(false);
      document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      navigate('/');
    }
    // else {
    //   updateAuthStatus(true);
    // }
  }, []);

  useEffect(() => {
    // console.log('searching');
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
        // @ts-expect-error ids typing to never[] - fix this
        searchResults = { ids: results, type: 'some' };
        setSearchFilter(searchResults);
      } else {
        searchResults = { ...searchResults, type: 'error' };
        setSearchFilter(searchResults);
      }
    }
  }, [search]);

  // const searchItem = (e: ChangeEvent<HTMLInputElement>) => {
  //     console.log(e);
  //     setTimeout(() => {
  //         setSearch(e.target.value);
  //     }, 1000);
  // };

  const supriseMe = () => {
    if (filteredTracks) {
      const randomTrackNumber = Math.floor(Math.random() * 10);
      const randomTrack = filteredTracks[randomTrackNumber];
      setSelectedTrack(randomTrack);
    }
  };

  const showAll = () => {
    console.log(trackList);
    setFilteredTracks(trackList);
    setSearch('');
  };

  return (
    <div className="audioview--container">
      {isAuth === false ? <LoggedOutView /> : null}
      <AudioPlayerContainer width={width} breakpoint={breakpoint} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <Input
          placeholder="Search Tracks"
          margin="0 0 0 0"
          padding="7px 15px"
          // labelColor="white"
          callback={(e: ChangeEvent<HTMLInputElement>) =>
            // searchItem(e)
            setSearch(e.target.value)
          }
          label="Seach Tracks"
          type="text"
          name="search-tracks"
          id="search-tracks-input"
          labelColor="white"
          value={search}
        />
        <Button
          margin="0 0 0 15px"
          name="Show All"
          width="180px"
          callback={showAll}
          padding="8px 35px"
        />
        <Button
          margin="0 0 0 15px"
          name="Surprise Me"
          width="180px"
          callback={supriseMe}
          padding="8px 35px"
        />
      </div>
      <TrackContainer />
    </div>
  );
};

export default AudioView;
