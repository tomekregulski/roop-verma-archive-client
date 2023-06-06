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

import { isValidJwt } from '../util/isValidJwt';
// import { isValidJwt } from '../util/isValidJwt';
import { useAuthContext } from './AuthContext';

interface Location {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  eventName: string;
  date: string;
  location: Location;
  locationId: number;
  category: Category;
  categoryId: number;
  notes: string;
  tapes: Tape[];
}
interface Tape {
  id: number;
  eventId: number;
  tapeId: number;
  event: Event;
}

export interface Track {
  id: number;
  trackId: number;
  tapeId: number;
  ragaId: number;
  primaryArtistId: number;
  plays: number;
  alap: boolean;
  jor: boolean;
  jhalla: boolean;
  slowGat: boolean;
  mediumGat: boolean;
  fastGat: boolean;
  accompanied: boolean;
  notes: string;
  audioQuality: string;
  master: boolean;
  mediaTypeId: number;
  public: boolean;
  url: string;
  tape: Tape;
}

interface SearchFilter {
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

  const { isAuth } = useAuthContext();
  console.log(isAuth);

  useEffect(() => {
    console.log('fetching tracks');
    const fetchTracks = async () => {
      // console.log('fetching tracks...');
      setTracksMessage('Loading...');
      const jwt = isValidJwt();
      console.log(isAuth);
      try {
        if (isAuth /* && jwt */) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/${key}`,
            {
              headers: { jwt: jwt },
            },
          );
          setTrackList(response.data);
          console.log('private');
        } else {
          const response = await axios.get(
            `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/public/${key}`,
          );
          setTrackList(response.data);
          console.log('public');
        }
      } catch (error) {
        console.log(error);
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
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedTrack) {
      setTrackSrc(selectedTrack.url);
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
