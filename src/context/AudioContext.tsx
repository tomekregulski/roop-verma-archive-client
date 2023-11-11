import axios from 'axios';
import {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// import { getErrorMessage } from '../util/getErrorMessage';
import { isValidJwt } from '../util/isValidJwt';
// import { searchTracks } from '../util/searchTracks';
import { useAuthContext } from './AuthContext';
import { Track } from './trackTypes';

export interface SearchFilter {
  ids: number[];
  type: string;
}

interface IncrementPlaysProps {
  userId: number;
  trackId: number;
  secondsListened: number;
}

interface AudioContextState {
  searchFilter: SearchFilter | null;
  setSearchFilter: Dispatch<SetStateAction<SearchFilter | null>>;
  trackList: Track[] | null;
  setTrackList: Dispatch<SetStateAction<Track[] | null>>;
  selectedTrack: Track | null;
  setSelectedTrack: Dispatch<SetStateAction<Track | null>>;
  trackIsRandom: boolean;
  setTrackIsRandom: Dispatch<SetStateAction<boolean>>;
  filteredTracks: Track[] | null;
  setFilteredTracks: Dispatch<SetStateAction<Track[] | null>>;
  tracksMessage: string;
  setTracksMessage: Dispatch<SetStateAction<string>>;
  currentTrackIndex: number | null;
  setCurrentTrackIndex: Dispatch<SetStateAction<number | null>>;
  incrementPlays: (props: IncrementPlaysProps) => void;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  trackSrc: string;
  setTrackSrc: Dispatch<SetStateAction<string>>;
  audioRef: MutableRefObject<HTMLAudioElement>;
  intervalRef: MutableRefObject<undefined>;
  duration: number;
  playPauseValidation: () => void;
}

interface AudioContextProps {
  children: ReactNode;
}

export const OUTSIDE_AUDIO_PROVIDER_ERROR =
  'Attempting to access AudioContext outside of Provider!';

export const AudioContext = createContext<AudioContextState | null>(null);

export const AudioProvider = (props: AudioContextProps) => {
  const [trackList, setTrackList] = useState<Track[] | null>(null); // but need to fill out interface
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null); // but need to fill out interface
  const [trackIsRandom, setTrackIsRandom] = useState<boolean>(false); // but need to fill out interface
  const [filteredTracks, setFilteredTracks] = useState<Track[] | null>(null); // but need to fill out interface
  // Does not need to be state???
  const [searchFilter, setSearchFilter] = useState<SearchFilter | null>(null);
  // Maybe local state in audio view based on return/loading?
  const [tracksMessage, setTracksMessage] = useState<string>('');
  // See if we can somehow do without this OR selectedTrack
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [trackSrc, setTrackSrc] = useState<string>('');

  const key = import.meta.env.VITE_API_KEY;

  const { isAuth, hasAllowedStatus } = useAuthContext();
  console.log(isAuth);

  useEffect(() => {
    const fetchTracks = async () => {
      setTracksMessage('Loading...');
      const currentJwt = isValidJwt();
      console.log(isAuth);
      console.log(hasAllowedStatus);
      try {
        if (isAuth && hasAllowedStatus /* && jwt */) {
          console.log('fetching private tracks');
          const response = await axios.get(
            `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/${key}`,
            {
              headers: { jwt: currentJwt?.jwt },
            },
          );
          setTrackList(response.data);
        } else {
          console.log('fetching public tracks');
          const response = await axios.get(
            // TEMPORARY CHANGE - TURN BACK BEFORE MERGE
            // `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/${key}`,
            `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/public/${key}`,
          );
          setTrackList(response.data);
        }
      } catch (error) {
        console.log('Failed to retrieve audio library');
        console.log(error);
        // const errorMessage = getErrorMessage(error);
        // setMessage(`Failed to retrieve audio library: ${errorMessage}`);
      }
      setTracksMessage('');
    };
    // this will probably break if registered user !isAuth and then logs in => may need a flag to track this?
    // if (!trackList) {
    fetchTracks();
    // }
    // eslint rule for exhaustive deps was not found
  }, [isAuth]);

  // Change to exported function
  useEffect(() => {
    if (searchFilter && trackList) {
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
          //TODO: fix this - currently updates on render cycle
          // eslint-disable-next-line no-case-declarations
          const newTracks = trackList.filter((track) =>
            searchFilter.ids.includes(track.id),
          );
          setFilteredTracks(newTracks);
          setTracksMessage('');
          break;
        case 'error':
          setFilteredTracks([]);
          setTracksMessage('Something went wrong. Please refresh the page and try again');
          break;
        default:
          setFilteredTracks(trackList);
          setTracksMessage('');
          break;
      }
      // searchTracks(searchFilter, trackList);
    }
  }, [searchFilter, trackList]);

  const incrementPlays = async (props: IncrementPlaysProps) => {
    console.log('increment');
    const { userId, trackId, secondsListened } = props;
    try {
      /* const response = */ await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/track-play/${key}`,
        {
          userId,
          trackId,
          secondsListened,
        },
      );
    } catch (error) {
      console.log('Failed to update track plays');
      console.log(error);
      // const errorMessage = getErrorMessage(error);
      // setMessage(`Failed to retrieve audio library: ${errorMessage}`);
    }
  };

  useEffect(() => {
    if (selectedTrack) {
      // setTrackSrc(selectedTrack.url);
      console.log(selectedTrack);
    }
  }, [selectedTrack]);

  // TODO: this feels bad
  const audioRef = useRef(new Audio(trackSrc));
  const intervalRef = useRef();
  // const isReady = useRef(false);
  const { duration } = audioRef.current;

  const playPauseValidation = () => {
    if (!selectedTrack) {
      alert('Please select a track');
    } else {
      if (!isPlaying) {
        // if (isReady.current) {
        if (isReady) {
          // console.log('play');
          // console.log(audioRef.current);
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
    <AudioContext.Provider
      value={{
        searchFilter,
        setSearchFilter,
        trackList,
        setTrackList,
        selectedTrack,
        setSelectedTrack,
        trackIsRandom,
        setTrackIsRandom,
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
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const audioContext = useContext(AudioContext);

  if (!audioContext) {
    throw new Error(OUTSIDE_AUDIO_PROVIDER_ERROR);
  }

  return audioContext;
};
