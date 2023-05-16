import { useAudioContext } from '../../../context/AudioContext';

const {
  filteredTracks,
  currentTrackIndex,
  setCurrentTrackIndex,
  selectedTrack,
  setSelectedTrack,
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
} = useAudioContext();

// export const changeTrackIndex = (index: number) => {
//     if (filteredTracks) {
//         const newTrack = filteredTracks[index];
//         setCurrentTrackIndex(index);
//         setSelectedTrack(newTrack);
//         setSecondsPlayed(0);
//     }
// };
