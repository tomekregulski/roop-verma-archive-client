import React from 'react';
import { TracksContext } from './Context/TracksContext';

import { trackOne, trackTwo } from './testTracks';

import AudioControl from './Components/AudioControl';
import TrackList from './Components/TrackList';

function App() {
  console.log(trackOne);
  return (
    <TracksContext>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ marginTop: '80px' }}>
          Welcome to the Roop Verma Digital Archive
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AudioControl />
          <TrackList />
        </div>
      </main>
    </TracksContext>
  );
}

export default App;
