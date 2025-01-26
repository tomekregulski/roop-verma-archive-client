import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import { useAudioContext } from '../../../context/AudioContext';
import { useAuthContext } from '../../../context/AuthContext';
import { getEachItem } from '../../../util/helperFunctions';
import { LoggedOutView } from '../../../views/LoggedOutView';
import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';

export function AudioTopBar() {
  const { isAuth } = useAuthContext();
  const [search, setSearch] = useState('');

  const {
    setSearchFilter,
    selectedTrack,
    setSelectedTrack,
    trackList,
    filteredTracks,
    trackIsRandom,
    setTrackIsRandom,
    setFilteredTracks,
  } = useAudioContext();

  const narrowSearch = (initialSearchResults: string[], searchTerms: string[]) => {
    let finalResults: string[] = initialSearchResults;

    for (let i = 1; i < searchTerms.length; i++) {
      const results = getEachItem(trackList, searchTerms[i]);
      // console.log(results);
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
    let searchResults = { ids: [], type: '' };
    if (search === '') {
      // console.log('empty search');
      searchResults = { ...searchResults, type: 'all' };
      setSearchFilter(searchResults);
    } else {
      console.log('searching');
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

  useEffect(() => {
    if (trackIsRandom && selectedTrack) {
      const trackCard = document.getElementById(`${selectedTrack.id}`);
      trackCard?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTrackIsRandom(false);
    }
  }, [trackIsRandom, selectedTrack]);

  const supriseMe = () => {
    if (filteredTracks) {
      const randomTrackNumber = Math.floor(Math.random() * filteredTracks.length);
      const randomTrack = filteredTracks[randomTrackNumber];
      console.log(randomTrackNumber);
      console.log(randomTrack);
      setSelectedTrack(randomTrack);
      setTrackIsRandom(true);
    }
  };

  const showAll = () => {
    console.log(trackList);
    setFilteredTracks(trackList);
    setSearch('');
  };

  return (
    <div
      className="
        flex 
        flex-col 
        items-center 
        sticky 
        top-0
        pb-[48px] 
        text-center
      "
      style={{ backgroundColor: 'rgba(0, 180, 249)' }}
    >
      {isAuth === false ? <LoggedOutView /> : null}
      <div
        className="
          flex
          grow-0 
          md:flex-row 
          md:items-end 
          sm:flex-col 
          sm:gap-4 
          mt-[20px]
        "
      >
        <Input
          placeholder="Search Tracks"
          callback={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          label="Search Tracks"
          type="text"
          name="search-tracks"
          id="search-tracks-input"
          value={search}
          tooltipContent="Search the library by raga, time of day, mood, data, or location"
        />
        <Button name="Show All" callback={showAll} />
        <Button name="Surprise Me" callback={supriseMe} />
      </div>
    </div>
  );
}
