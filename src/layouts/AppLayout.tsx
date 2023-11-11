// import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
import { Navbar } from '../components/Navbar/Navbar';
// import { useAudioContext } from '../context/AudioContext';

// const OutletWrapper = styled.div();

export function AppLayout() {
  // const { selectedTrack } = useAudioContext();
  return (
    <div className="grid h-screen grid-rows-[auto_minmax(0,1fr)_auto] isolate">
      <div className="z-10" style={{ zIndex: 100 }}>
        <Navbar />
      </div>
      <div
        style={{
          // flex: 1;
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="overflow-auto absolute top-[-135px] bottom-0 left-[25%] right-0 z-10">
          <Outlet />
        </div>
      </div>
      <div style={{ zIndex: 100 }}>{/*selectedTrack &&*/ <AudioPlayerContainer />}</div>
    </div>
  );
}
