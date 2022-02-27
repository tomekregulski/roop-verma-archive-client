import React, { useState, createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import { checkJwt } from '../Utils/helperFunctions';
import { AuthContext } from './AuthContext';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [tracksMessage, setTracksMessage] = useState('');
  const [filteredTracks, setFilteredTracks] = useState(null);

  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  useEffect(() => {
    const fetchTracks = async () => {
      let response;
      setTracksMessage('Loading...');
      const jwt = checkJwt();
      try {
        if (isAuth === true && jwt !== false) {
          response = await axios.get(
            // 'http://localhost:5000/api/tracks',
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
      setTracksMessage('');
    };
    fetchTracks();
  }, [isAuth]);

  useEffect(() => {
    setTracksMessage('Loading...');
    switch (searchFilter.type) {
      case 'all':
        setFilteredTracks(trackList);
        setTracksMessage('');
        break;
      case 'none':
        setFilteredTracks([]);
        setTracksMessage('Sorry, there are no tracks that match your search');
        break;
      case 'some':
        const newTracks = trackList.filter((track) =>
          searchFilter.ids.includes(track.id)
        );
        setFilteredTracks(newTracks);
        setTracksMessage('');
        break;
      case 'error':
        setFilteredTracks([]);
        setTracksMessage(
          'Something went wrong. Please refresh the page and try again'
        );
        break;
      default:
        setFilteredTracks(trackList);
        setTracksMessage('');
        break;
    }
  }, [searchFilter, trackList]);

  return (
    <TracksContextData.Provider
      value={{
        searchFilter,
        setSearchFilter,
        trackList,
        setTrackList,
        selectedTrack,
        setSelectedTrack,
        filteredTracks,
        setFilteredTracks,
        tracksMessage,
        setTracksMessage,
      }}
    >
      {props.children}
    </TracksContextData.Provider>
  );
};
