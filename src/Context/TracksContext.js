import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from 'react';
import axios from 'axios';
import { checkJwt } from '../Utils/helperFunctions';
import { AuthContext } from './AuthContext';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({});
  const [searchFilter, setSearchFilter] = useState([]);
  const [tracksMessage, setTracksMessage] = useState('');
  const [filteredTracks, setFilteredTracks] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [trackSrc, setTrackSrc] = useState('');

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
            'http://localhost:5000/api/tracks',
            // 'https://roop-verma-archive.herokuapp.com/api/tracks',
            {
              headers: { jwt: jwt },
            }
          );
        } else {
          response = await axios.get(
            'http://localhost:5000/api/tracks/public'
            // 'https://roop-verma-archive.herokuapp.com/api/tracks/public'
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

  const incrementPlays = async (data) => {
    console.log('increment');
    const { userId, trackId, secondsListened } = data;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/tracks/track-plays',
        // 'https://roop-verma-archive.herokuapp.com/api/tracks/track-plays',
        {
          userId,
          trackId,
          secondsListened,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTrackSrc(selectedTrack.url);
  }, [selectedTrack]);

  const audioRef = useRef(new Audio(trackSrc));
  const intervalRef = useRef();
  // const isReady = useRef(false);
  const { duration } = audioRef.current;

  const playPauseValidation = () => {
    if (selectedTrack.length === 0) {
      alert('Please select a track');
    } else {
      if (!isPlaying) {
        // if (isReady.current) {
        if (isReady) {
          console.log('play');
          console.log(audioRef.current);
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          // Set the isReady ref as true for the next pass
          // isReady.current = true;
          setIsReady(true);
        }
      }

      if (isPlaying === true) {
        setIsPlaying(false);
      }
    }
  };

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
        currentTrackIndex,
        setCurrentTrackIndex,
        incrementPlays,
        isPlaying,
        setIsPlaying,
        isReady,
        setIsReady,
        trackSrc,
        setTrackSrc,
        audioRef,
        intervalRef,
        duration,
        playPauseValidation,
      }}
    >
      {props.children}
    </TracksContextData.Provider>
  );
};
