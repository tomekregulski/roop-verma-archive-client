import './audioPlayer.css';

import { useEffect, useState } from 'react';

import { useAudioContext } from '../../../context/AudioContext';
import { useAuthContext } from '../../../context/AuthContext';
import AudioControls from '../AudioControls/AudioControls';

export function AudioPlayer() {
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
  // TODO: what is this?
  // const track = '';

  const { userData } = useAuthContext();
  const [trackProgress, setTrackProgress] = useState(0);
  const [secondsPlayed, setSecondsPlayed] = useState(0);

  useEffect(() => {
    if (selectedTrack) {
      const trackUrl = selectedTrack.url;
      setTrackSrc(trackUrl);
      setCurrentTrackIndex(selectedTrack.id - 1);
    }
  }, [selectedTrack]);

  const changeTrackIndex = (index: number) => {
    if (filteredTracks) {
      const newTrack = filteredTracks[index];
      setCurrentTrackIndex(index);
      setSelectedTrack(newTrack);
      setSecondsPlayed(0);
    }
  };

  const currentPercentage = duration ? `${(trackProgress / duration) * 100}%` : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    // @ts-expect-error figure out type issue here
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrackIndex();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
      // @ts-expect-error figure out type issue here
    }, [1000]);
  };

  useEffect(() => {
    setSecondsPlayed((prevState) => prevState + 1);
  }, [trackProgress]);

  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    // setSecondsPlayed(0);
    startTimer();
  };

  const toPrevTrackIndex = () => {
    let index;
    if (currentTrackIndex && filteredTracks) {
      if (currentTrackIndex - 1 < 0) {
        index = filteredTracks.length - 1;
        changeTrackIndex(index);
      } else {
        index = currentTrackIndex - 1;
        changeTrackIndex(index);
      }
    }
  };

  const toNextTrackIndex = () => {
    let index;
    if (currentTrackIndex && filteredTracks) {
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
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else if (isPlaying === false) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (userData && selectedTrack && secondsPlayed > 0) {
      incrementPlays({
        userId: userData.id,
        trackId: selectedTrack.id,
        secondsListened: secondsPlayed,
      });
    }
    setSecondsPlayed(0);
  }, [selectedTrack]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();
    setIsPlaying(false);
    audioRef.current = new Audio(trackSrc);
    audioRef.current.load();
    setTrackProgress(audioRef.current.currentTime);

    if (!isReady) {
      // if (!isReady.current) {
      // isReady.current = true;
      setIsReady(true);
    }
  }, [trackSrc]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    // <div className="audio-player--container">
    // <div className="audio-player--track-info">
    <div className="flex items-center justify-between w-full mt-8 p-0">
      <h2 className="audio-player--title">
        {/* Perhaps unnecessary?*/}
        {/* {selectedTrack ? selectedTrack.raga.name : ''} */}
      </h2>
      <span className="audio-player--track-marquee">
        {selectedTrack
          ? `${selectedTrack.raga.name} - ${selectedTrack.tape.event.date}`
          : 'Select a track to begin'}
      </span>
      <AudioControls
        isPlaying={isPlaying}
        onPrevClick={toPrevTrackIndex}
        onNextClick={toNextTrackIndex}
        // onPlayPauseClick={setIsPlaying}
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
        max={duration ? duration : `${duration}`}
        className="progress"
        onChange={(e) => onScrub(parseInt(e.target.value))}
        onMouseUp={onScrubEnd}
        onKeyUp={onScrubEnd}
        style={{ background: trackStyling, marginLeft: '50px' }}
      />
    </div>
    // </div>
  );
}
