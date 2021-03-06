import React from 'react';

import { ReactComponent as Play } from '../../assets/play.svg';
import { ReactComponent as Pause } from '../../assets/pause.svg';
import { ReactComponent as Next } from '../../assets/next.svg';
import { ReactComponent as Prev } from '../../assets/prev.svg';

import './audioControls.css';

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
}) => (
  <div className='audio-controls--container'>
    <button
      type='button'
      className='prev audio-controls--button'
      aria-label='Previous'
      onClick={onPrevClick}
    >
      <Prev />
    </button>
    {isPlaying ? (
      <button
        type='button'
        className='pause audio-controls--button'
        onClick={() => onPlayPauseClick(false)}
        aria-label='Pause'
      >
        <Pause />
      </button>
    ) : (
      <button
        type='button'
        className='play audio-controls--button'
        onClick={() => onPlayPauseClick(true)}
        aria-label='Play'
      >
        <Play />
      </button>
    )}
    <button
      type='button'
      className='next audio-controls--button'
      aria-label='Next'
      onClick={onNextClick}
    >
      <Next />
    </button>
  </div>
);

export default AudioControls;
