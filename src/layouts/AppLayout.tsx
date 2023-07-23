import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
import { Navbar } from '../components/Navbar/Navbar';
import { useAudioContext } from '../context/AudioContext';

const OutletWrapper = styled.div();

export function AppLayout() {
  const { selectedTrack } = useAudioContext();
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Navbar />
      <OutletWrapper className="mt-[32px] overflow-scroll">
        <Outlet />
      </OutletWrapper>
      {selectedTrack && <AudioPlayerContainer />}
    </div>
  );
}
