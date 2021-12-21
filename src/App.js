import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TracksContext } from './Context/TracksContext';

const Navbar = lazy(() => import('./Components/Navbar'));

const AudioPlayerContainer = lazy(() =>
  import('./Components/AudioPlayerContainer')
);
const TrackList = lazy(() => import('./Components/TrackList'));

const TrackTable = lazy(() => import('./Components/TrackTable'));

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  const breakpoint = 650;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return (
    <TracksContext>
      {/* add background image with overlay at top level? */}
      <main>
        <Suspense fallback={<div>Loading Navigation...</div>}>
          <Navbar />
        </Suspense>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '50px',
          }}
        >
          <Suspense fallback={<div>Loading Audio Player...</div>}>
            <AudioPlayerContainer width={width} breakpoint={breakpoint} />
          </Suspense>
          <Suspense fallback={<div>Loading Track List...</div>}>
            <TrackTable />
          </Suspense>
        </div>
      </main>
    </TracksContext>
  );
}

export default App;
