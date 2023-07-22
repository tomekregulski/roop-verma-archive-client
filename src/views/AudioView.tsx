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
    selectedTrack,
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

  const narrowSearch = (initialSearchResults: string[], searchTerms: string[]) => {
    let finalResults: string[] = initialSearchResults;

    for (let i = 1; i < searchTerms.length; i++) {
      const results = getEachItem(trackList, searchTerms[i]);
      console.log(results);
      finalResults = finalResults.filter((result) => results.includes(result));
    }
    return finalResults;
  };

  const multiTermSearch = (searchTerms: string[]) => {
    const initialSearchResults = getEachItem(trackList, searchTerms[0]);
    const finalResults =
      searchTerms.length > 1
        ? narrowSearch(initialSearchResults, searchTerms)
        : initialSearchResults;
    return finalResults;
  };

  useEffect(() => {
    console.log('searching');
    let searchResults = { ids: [], type: '' };
    if (search === '') {
      // console.log('empty search');
      searchResults = { ...searchResults, type: 'all' };
      setSearchFilter(searchResults);
    } else {
      // console.log('not empty search');
      const searchTerms = search.split(' ');
      const results = multiTermSearch(searchTerms);
      if (results.length === 0) {
        searchResults = { ...searchResults, type: 'none' };
        // console.log('searchResults === 0');
        // console.log(searchResults);
        setSearchFilter(searchResults);
      } else if (results.length > 0) {
        console.log('else if');
        // @ts-expect-error ids typing to never[] - fix this
        searchResults = { ids: results, type: 'some' };
        // console.log(searchResults);
        setSearchFilter(searchResults);
      } else {
        // this should never happen?
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
      const randomTrackNumber = Math.floor(Math.random() * filteredTracks.length);
      const randomTrack = filteredTracks[randomTrackNumber];
      console.log(randomTrackNumber);
      console.log(randomTrack);
      setSelectedTrack(randomTrack);
    }
  };

  const showAll = () => {
    console.log(trackList);
    setFilteredTracks(trackList);
    setSearch('');
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <div className="audioview--container">
        {isAuth === false ? <LoggedOutView /> : null}
        <div className="flex items-end mt-[20px]">
          <Input
            placeholder="Search Tracks"
            margin="0 0 0 0"
            padding="7px 15px"
            // labelColor="white"
            callback={(e: ChangeEvent<HTMLInputElement>) =>
              // searchItem(e)
              setSearch(e.target.value)
            }
            label="Search Tracks"
            type="text"
            name="search-tracks"
            id="search-tracks-input"
            labelColor="white"
            value={search}
            tooltipContent="Search the library by raga, time of day, mood, data, or location"
          />
          {/** Add breakpoints */}
          {/* <div className="s-flex"> */}
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
          {/* </div> */}
        </div>
        <TrackContainer />
      </div>
      <AudioPlayerContainer width={width} breakpoint={breakpoint} />
    </div>
  );
};

export default AudioView;
