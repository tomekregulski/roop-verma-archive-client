import React, { useContext, useState, useEffect, useRef } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import AudioControls from '../AudioControls/AudioControls';
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
    if (selectedTrack.length > 0) {
      setCurrentTrack(selectedTrack);
      const trackUrl = selectedTrack[0].url;
      setTrackSrc(trackUrl);
      setTrackIndex(selectedTrack[0].id - 1);
    }
  }, [selectedTrack]);

  const changeTrack = (id) => {
    const newTrack = trackList.filter((track) => track.id === id);
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

  const playPauseValidation = () => {
    if (isPlaying === false) {
      if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
      } else {
        // Set the isReady ref as true for the next pass
        isReady.current = true;
      }
    }

    if (isPlaying === true) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else if (isPlaying === false) {
      audioRef.current.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();
    setIsPlaying(false);
    audioRef.current = new Audio(trackSrc);
    audioRef.current.load();
    setTrackProgress(audioRef.current.currentTime);

    if (!isReady.current) {
      isReady.current = true;
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
    <div className='audio-player--container'>
      <div className='audio-player--track-info'>
        <h2 className='audio-player--title'>
          {currentTrack[0] ? currentTrack[0].raag : ''}
        </h2>
        <p className='audio-player--track-marquee'>
          <span>
            {currentTrack[0]
              ? 'This is placeholder text. Eventually this field will display information about the currently playing track, and scroll it if it does not all fit within the space.'
              : 'Select a track to begin'}
          </span>
        </p>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          // onPlayPauseClick={setIsPlaying}
          onPlayPauseClick={playPauseValidation}
        />
        <p>
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
          {duration
            ? ` / ${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`
            : ''}
        </p>
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
    </div>
  );
};

export default AudioPlayer;
