import type { Dispatch, MutableRefObject, ReactNode, SetStateAction } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { api } from '../api/client';
import { fetchTracks } from '../queries/audioQueries';
import { playbackError, requestPlaybackAccess } from '../util/playbackAccess';
// import { getErrorMessage } from '../util/getErrorMessage';
// import { searchTracks } from '../util/searchTracks';
import { useAuthContext } from './AuthContext';
import type { Track } from './trackTypes';

export interface SearchFilter {
  ids: number[];
  type: string;
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
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  trackSrc: string;
  setTrackSrc: Dispatch<SetStateAction<string>>;
  audioRef: MutableRefObject<HTMLAudioElement>;
  intervalRef: MutableRefObject<number | undefined>;
  duration: number;
  playPauseValidation: () => void;
  playbackMessage: string;
  retryPlayback: () => void;
}

interface AudioContextProps {
  children: ReactNode;
}

export const OUTSIDE_AUDIO_PROVIDER_ERROR =
  'Attempting to access AudioContext outside of Provider!';

export const AudioContext = createContext<AudioContextState | null>(null);

/** Owns audio and discards access responses after track, account or lifecycle changes. */
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

  const { isAuth, userData, status } = useAuthContext();

  useEffect(() => {
    let active = true;
    setTrackList(null);
    setFilteredTracks(null);
    setTracksMessage('Loading Tracks...');
    void fetchTracks(isAuth)
      .then((tracks) => {
        if (!active) return;
        setTrackList(tracks);
        setTracksMessage('');
      })
      .catch(() => {
        if (active) setTracksMessage('Unable to load tracks. Refresh the page to retry.');
      });
    return () => {
      active = false;
    };
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

  const [initialAudio] = useState(() => new Audio());
  const audioRef = useRef(initialAudio);
  const intervalRef = useRef<number>();
  const [duration, setDuration] = useState(0);
  const [playbackMessage, setPlaybackMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  /** Requests fresh playback access without counting a second start for the selection. */
  const retryPlayback = () => setAttempt((value) => value + 1);

  const counted = useRef(false);
  useLayoutEffect(() => {
    counted.current = false;
  }, [selectedTrack?.id, userData?.id, status]);

  // Invalidate old audio before paint on track/account changes. Cancellation is
  // paired with an active guard because a response may already be in flight.
  useLayoutEffect(() => {
    let active = true;
    let expiryTimer: number | undefined;
    const controller = new AbortController();
    /** Clears the current media and timers before replacement or cleanup. */
    const stop = () => {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      setIsReady(false);
      setTrackSrc('');
      setDuration(0);
    };
    stop();

    if (!selectedTrack) {
      setPlaybackMessage('');
      return;
    }

    setPlaybackMessage('Checking playback access...');
    void requestPlaybackAccess(selectedTrack.id, controller.signal)
      .then((access) => {
        if (!active) return;
        const audio = new Audio(access.url);
        audioRef.current = audio;
        /** Offers an explicit retry without exposing the private media URL. */
        const fail = () => {
          if (!active) return;
          stop();
          setPlaybackMessage('Unable to play this audio. Retry playback.');
        };
        audio.onerror = fail;
        audio.onplaying = () => {
          if (!active || counted.current) return;
          counted.current = true;
          // Best effort, no retries: ordinary resumes, buffering events and rerenders
          // count once per selection. Issuance and failed play() never count.
          void api
            .post(
              `/track/${selectedTrack.id}/listen/${import.meta.env.VITE_API_KEY}`,
              {},
              { signal: controller.signal },
            )
            .catch(() => {
              // Aggregate telemetry failure must not interrupt authorized playback.
            });
        };
        audio.onloadedmetadata = () => {
          if (active) setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        };
        setTrackSrc(access.url);
        setIsReady(true);
        setPlaybackMessage('');
        audio.load();
        expiryTimer = window.setTimeout(() => {
          if (!active) return;
          stop();
          setPlaybackMessage(
            'Playback access expired. Retry playback to request a new link.',
          );
        }, Date.parse(access.expiresAt) - Date.now());
      })
      .catch((error) => {
        if (active) setPlaybackMessage(playbackError(error));
      });

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(expiryTimer);
      audioRef.current.onplaying = null;
      audioRef.current.onerror = null;
      audioRef.current.onloadedmetadata = null;
      stop();
    };
  }, [selectedTrack?.id, userData?.id, status, attempt]);

  /** Starts or pauses the currently authorized audio, handling rejected browser playback. */
  const playPauseValidation = () => {
    if (!selectedTrack || !isReady || !trackSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    const audio = audioRef.current;
    void audio
      .play()
      .then(() => {
        if (audioRef.current === audio && audio.getAttribute('src')) setIsPlaying(true);
      })
      .catch(() => {
        if (audioRef.current !== audio || !audio.getAttribute('src')) return;
        setIsPlaying(false);
        setPlaybackMessage(
          'Playback could not start. Press Play to try again, or retry playback.',
        );
      });
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
        playbackMessage,
        retryPlayback,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};

/** Reads the audio state only within its lifecycle owner. */
export const useAudioContext = () => {
  const audioContext = useContext(AudioContext);

  if (!audioContext) {
    throw new Error(OUTSIDE_AUDIO_PROVIDER_ERROR);
  }

  return audioContext;
};
