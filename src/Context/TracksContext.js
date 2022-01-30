import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [proceed, setProceed] = useState(false);
  const [trackJwt, setTrackJwt] = useState('');
  const [trackList, setTrackList] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [filteredTracks, setFilteredTracks] = useState(null);

  useEffect(() => {
    if (proceed === true) {
      axios
        // .get('http://localhost:5000/api/tracks', {
        .get('https://roop-verma-archive.herokuapp.com/api/tracks', {
          headers: { jwt: trackJwt },
        })
        .then((response) => {
          setTrackList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (proceed === false) {
      axios
        .get(
          // 'http://localhost:5000/api/tracks/public'
          'https://roop-verma-archive.herokuapp.com/api/tracks/public'
        )
        .then((response) => {
          setTrackList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [proceed, trackJwt]);

  useEffect(() => {
    if (categoryFilter !== '') {
      console.log(categoryFilter);
      if (categoryFilter === 'all') {
        setFilteredTracks(trackList);
      } else {
        const newTracks = trackList.filter(
          (track) => track.raga.name === 'Bhupali'
        );
        setFilteredTracks(newTracks);
      }
    }
  }, [categoryFilter]);

  return (
    <TracksContextData.Provider
      value={{
        trackJwt,
        setTrackJwt,
        trackList,
        setTrackList,
        selectedTrack,
        setSelectedTrack,
        proceed,
        setProceed,
        categoryFilter,
        setCategoryFilter,
        filteredTracks,
        setFilteredTracks,
      }}
    >
      {props.children}
    </TracksContextData.Provider>
  );
};
