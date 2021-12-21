import React, { useContext, useState, useEffect, useRef } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import AudioControls from '../AudioControls/AudioControls';
import Backdrop from '../Backdrop/Backdrop';
import './audioPlayer.css';

const AudioPlayer = () => {
  const { trackList, selectedTrack, setSelectedTrack } =
    useContext(TracksContextData);

  const [trackIndex, setTrackIndex] = useState();
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackSrc, setTrackSrc] = useState('');
  const [currentTrack, setCurrentTrack] = useState({});

  useEffect(() => {
    if (selectedTrack !== null) {
      setCurrentTrack(selectedTrack);
      setTrackSrc(selectedTrack[0].url);
      setTrackIndex(selectedTrack[0].id - 1);
    }
  }, [selectedTrack]);

  const changeTrack = (id) => {
    console.log(id);
    const newTrack = trackList.filter((track) => track.id === id);
    console.log(newTrack);
    setSelectedTrack(newTrack);
  };

  const audioRef = useRef(new Audio(trackSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);
  const { duration } = audioRef.current;

  const currentPercentage = duration
    ? `${(trackProgress / duration) * 100}%`
    : '0%';
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
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
    startTimer();
  };

  const toPrevTrack = () => {
    let id;
    if (trackIndex - 1 < 0) {
      id = trackList.length;
      changeTrack(id);
    } else {
      id = trackIndex;
      changeTrack(id);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < trackList.length - 1) {
      let id = trackIndex + 2;
      changeTrack(id);
    } else {
      changeTrack(1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(trackSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className='audio-player'>
      <div className='track-info'>
        <h2 className='title'>
          {currentTrack[0] ? currentTrack[0].raag.name : ''}
        </h2>
        <h3 className='artist'>
          {currentTrack[0]
            ? currentTrack[0].artists[0].name
            : 'Select a track to begin'}
        </h3>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        />
        <input
          type='range'
          value={trackProgress}
          step='1'
          min='0'
          max={duration ? duration : `${duration}`}
          className='progress'
          onChange={(e) => onScrub(e.target.value)}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
          style={{ background: trackStyling }}
        />
      </div>
      <Backdrop
        trackIndex={trackIndex}
        activeColor={'rgba(0, 180, 249, 0.872)'}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default AudioPlayer;
