import React, { lazy, Suspense } from 'react';

import sitar from '../images/sitar.png';
import sitarReverse from '../images/sitar-reverse.png';

const AudioPlayer = lazy(() => import('./AudioPlayer'));

const AudioPlayerContainer = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {props.width > props.breakpoint && (
        <img
          src={sitarReverse}
          alt='sitar'
          style={{ height: '200px', marginRight: '50px' }}
        />
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <AudioPlayer />
      </Suspense>
      {props.width > props.breakpoint && (
        <img
          src={sitar}
          alt='sitar'
          style={{ height: '200px', marginLeft: '50px' }}
        />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
