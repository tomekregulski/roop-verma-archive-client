import React from 'react';

import tanpuraRight from '../../assets/sitar.png';
import tanpuraLeft from '../../assets/sitar-reverse.png';
import AudioPlayer from '../AudioPlayer/AudioPlayer';

import './audioPlayerContainerStyles.css';

const AudioPlayerContainer = (props) => {
  return (
    <div className='audioContainerWrapper'>
      {props.width > props.breakpoint && (
        <img className='tanpura__left' src={tanpuraLeft} alt='tanpura' />
      )}
      <AudioPlayer />
      {props.width > props.breakpoint && (
        <img className='tanpura__right' src={tanpuraRight} alt='tanpura' />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
