import React, { useState, createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import { checkJwt } from '../Utils/helperFunctions';
import { AuthContext } from './AuthContext';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredTracks, setFilteredTracks] = useState(null);

  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  useEffect(() => {
    const fetchTracks = async () => {
      let response;
      const jwt = checkJwt();
      try {
        if (isAuth === true) {
          response = await axios.get(
            // .get('http://localhost:5000/api/tracks', {
            'https://roop-verma-archive.herokuapp.com/api/tracks',
            {
              headers: { jwt: jwt },
            }
          );
        } else if (isAuth === false) {
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
    if (categoryFilter === 'all') {
      setFilteredTracks(trackList);
    } else {
      const newTracks = trackList.filter(
        (track) => track.raga.name === 'Bhupali'
      );
      setFilteredTracks(newTracks);
    }
  }, [categoryFilter, trackList]);

  return (
    <TracksContextData.Provider
      value={{
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
