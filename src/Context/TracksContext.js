import React, { useState, createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import { checkJwt } from '../Utils/helperFunctions';
import { AuthContext } from './AuthContext';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState(null);

  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  useEffect(() => {
    const fetchTracks = async () => {
      let response;
      const jwt = checkJwt();
      try {
        if (isAuth === true && jwt !== false) {
          response = await axios.get(
            // .get('http://localhost:5000/api/tracks', {
            'https://roop-verma-archive.herokuapp.com/api/tracks',
            {
              headers: { jwt: jwt },
            }
          );
        } else {
          response = await axios.get(
            // 'http://localhost:5000/api/tracks/public'
            'https://roop-verma-archive.herokuapp.com/api/tracks/public'
          );
        }
        setTrackList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTracks();
  }, [isAuth]);

  useEffect(() => {
    if (categoryFilter === 'all' && searchFilter.length === 0) {
      console.log('reset');
      setFilteredTracks(trackList);
    } else if (categoryFilter !== 'all') {
      const newTracks = trackList.filter(
        (track) => track.raga.name === 'Bhupali'
      );
      setFilteredTracks(newTracks);
    } else if (searchFilter.length > 0) {
      const newTracks = trackList.filter((track) =>
        searchFilter.includes(track.id)
      );
      setFilteredTracks(newTracks);
    }
  }, [searchFilter, categoryFilter, trackList]);

  return (
    <TracksContextData.Provider
      value={{
        searchFilter,
        setSearchFilter,
        trackList,
        setTrackList,
        selectedTrack,
        setSelectedTrack,
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
