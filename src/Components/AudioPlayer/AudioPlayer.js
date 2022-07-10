import React, { useContext, useState, useEffect } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import AudioControls from '../AudioControls/AudioControls';
import './audioPlayer.css';

const AudioPlayer = () => {
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
  } = useContext(TracksContextData);

  // const [trackIndex, setTrackIndex] = useState();
  const [trackProgress, setTrackProgress] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [trackSrc, setTrackSrc] = useState('');
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  // const [currentTrack, setCurrentTrack] = useState({});

  useEffect(() => {
    if (selectedTrack) {
      // setCurrentTrack(selectedTrack);
      const trackUrl = selectedTrack.url;
      console.log(selectedTrack);
      setTrackSrc(trackUrl);
      // setTrackIndex(selectedTrack[0].id - 1);
      setCurrentTrackIndex(selectedTrack.id - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack]);

  // const changeTrack = (id) => {
  //   const newTrack = filteredTracks.filter((track) => track.id === id);
  //   setSelectedTrack(newTrack);
  // };

  const changeTrackIndex = (index) => {
    const newTrack = filteredTracks[index];
    setCurrentTrackIndex(index);
    setSelectedTrack(newTrack);
    setSecondsPlayed(0);
  };

  // const audioRef = useRef(new Audio(trackSrc));
  // const intervalRef = useRef();
  // const isReady = useRef(false);
  // const { duration } = audioRef.current;

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
        toNextTrackIndex();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  useEffect(() => {
    setSecondsPlayed((prevState) => prevState + 1);
    if (secondsPlayed > duration / 2) {
      incrementPlays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackProgress]);

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
    setSecondsPlayed(0);
    startTimer();
  };

  // const toPrevTrack = () => {
  //   let id;
  //   if (trackIndex - 1 < 0) {
  //     id = filteredTracks.length;
  //     changeTrack(id);
  //   } else {
  //     id = trackIndex;
  //     changeTrack(id);
  //   }
  // };

  const toPrevTrackIndex = () => {
    let index;
    if (currentTrackIndex - 1 < 0) {
      index = filteredTracks.length - 1;
      changeTrackIndex(index);
    } else {
      index = currentTrackIndex - 1;
      changeTrackIndex(index);
    }
  };

  // const toNextTrack = () => {
  //   if (trackIndex < filteredTracks.length - 1) {
  //     let id = trackIndex + 2;
  //     changeTrack(id);
  //   } else {
  //     changeTrack(1);
  //   }
  // };

  const toNextTrackIndex = () => {
    let index;
    if (currentTrackIndex < filteredTracks.length - 1) {
      index = currentTrackIndex + 1;
      changeTrackIndex(index);
    } else {
      changeTrackIndex(0);
    }
  };

  // const playPauseValidation = () => {
  //   if (selectedTrack.length === 0) {
  //     alert('Please select a track');
  //   } else {
  //     if (!isPlaying) {
  //       // if (isReady.current) {
  //       if (isReady) {
  //         console.log('play');
  //         console.log(audioRef.current);
  //         audioRef.current.play();
  //         setIsPlaying(true);
  //         // startTimer();
  //       } else {
  //         // Set the isReady ref as true for the next pass
  //         // isReady.current = true;
  //         setIsReady(true);
  //       }
  //     }

  //     if (isPlaying === true) {
  //       setIsPlaying(false);
  //     }
  //   }
  // };

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

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

    if (!isReady) {
      // if (!isReady.current) {
      // isReady.current = true;
      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackSrc]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='audio-player--container'>
      <div className='audio-player--track-info'>
        <h2 className='audio-player--title'>
          {selectedTrack ? selectedTrack.raag : ''}
        </h2>
        <p className='audio-player--track-marquee'>
          <span>
            {Object.keys(selectedTrack).length > 0
              ? `${selectedTrack.raga.name} - ${selectedTrack.tape.event.date}`
              : 'Select a track to begin'}
          </span>
        </p>
        <AudioControls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrackIndex}
          onNextClick={toNextTrackIndex}
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
