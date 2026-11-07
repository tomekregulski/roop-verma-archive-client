import { useEffect, useState } from 'react';

import { useAudioContext } from '../../../context/AudioContext';
import { Button } from '../../Button/Button';
import AudioControls from '../AudioControls/AudioControls';

/** Displays the current audio controls and local playback position. */
export function AudioPlayer() {
  const {
    filteredTracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    selectedTrack,
    setSelectedTrack,
    isPlaying,
    isReady,
    trackSrc,
    playbackMessage,
    retryPlayback,
    audioRef,
    intervalRef,
    duration,
    playPauseValidation,
  } = useAudioContext();

  const [trackProgress, setTrackProgress] = useState(0);

  /** Selects a catalog track without recording individual listening history. */
  const changeTrackIndex = (index: number) => {
    if (filteredTracks) {
      const newTrack = filteredTracks[index];
      setCurrentTrackIndex(index);
      setSelectedTrack(newTrack);
    }
  };

  const currentPercentage = duration ? `${(trackProgress / duration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  /** Updates the local progress display and advances after playback ends. */
  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrackIndex();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  /** Seeks authorized media while stopping progress updates during input. */
  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    if (!isReady) return;
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  /** Seeks authorized media while stopping progress updates during input. */
  /** Resumes playback and the local progress timer after seeking. */
  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying && isReady) playPauseValidation();
    if (isReady) startTimer();
  };

  /** Wraps backward through the filtered catalog. */
  const toPrevTrackIndex = () => {
    let index;
    if (currentTrackIndex !== null && filteredTracks?.length) {
      if (currentTrackIndex - 1 < 0) {
        index = filteredTracks.length - 1;
        changeTrackIndex(index);
      } else {
        index = currentTrackIndex - 1;
        changeTrackIndex(index);
      }
    }
  };

  /** Wraps forward through the filtered catalog. */
  const toNextTrackIndex = () => {
    let index;
    if (currentTrackIndex !== null && filteredTracks?.length) {
      if (currentTrackIndex < filteredTracks.length - 1) {
        index = currentTrackIndex + 1;
        changeTrackIndex(index);
      } else {
        changeTrackIndex(0);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else if (isPlaying === false) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setTrackProgress(0);
  }, [selectedTrack?.id, trackSrc]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full mt-8 p-0">
      {/* Perhaps unnecessary?*/}
      {/* <h2 className="mt-[20px] mb-[15px]" style={{ fontWeight: 700 }}>
        {selectedTrack ? selectedTrack.raga.name : ''}
      </h2> */}
      <span
        className="inline-block w-[90%] mt-0 mx-auto mb-[25px] overflow-hidden"
        style={{ fontWeight: 300 }}
      >
        {selectedTrack
          ? `${selectedTrack.raga.name} - ${selectedTrack.tape.event.date}`
          : 'Select a track to begin'}
      </span>
      {playbackMessage && (
        <div aria-live="polite">
          <p>{playbackMessage}</p>
          <Button
            name="Retry playback"
            callback={retryPlayback}
            isDisabledMessage={
              playbackMessage === 'Checking playback access...'
                ? playbackMessage
                : undefined
            }
          />
        </div>
      )}
      <AudioControls
        isPlaying={isPlaying}
        unavailableMessage={
          !isReady ? playbackMessage || 'Select a track to begin' : undefined
        }
        onPrevClick={toPrevTrackIndex}
        onNextClick={toNextTrackIndex}
        onPlayPauseClick={playPauseValidation}
      />
      <span className="w-full ml-10 self-center pb-4">
        {duration
          ? Math.floor(trackProgress / 60) < 10
            ? `0${Math.floor(trackProgress / 60)}:`
            : `${Math.floor(trackProgress / 60)}:`
          : ''}
        {duration
          ? Math.floor(trackProgress % 60) < 10
            ? `0${Math.floor(trackProgress % 60)}`
            : `${Math.floor(trackProgress % 60)}`
          : ''}
        {duration ? ` / ${Math.floor(duration / 60)}:${Math.floor(duration % 60)}` : ''}
      </span>
      <input
        type="range"
        value={trackProgress}
        step="1"
        min="0"
        max={duration || 0}
        aria-label="Playback position"
        aria-disabled={!isReady || undefined}
        // className="progress"
        onChange={(e) => onScrub(parseInt(e.target.value))}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
        style={{ background: trackStyling, transition: 'background 0.2s ease' }}
        className="
          w-full
          h-[5px]
          appearance-none
          mb-[10px]
          ml-[50px]
          rounded-[8px]
          cursor-pointer
        "
      />
    </div>
  );
}
