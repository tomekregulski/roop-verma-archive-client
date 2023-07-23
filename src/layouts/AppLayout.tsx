import { Outlet } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
import { Navbar } from '../components/Navbar/Navbar';
import { useAudioContext } from '../context/AudioContext';

export function AppLayout() {
  const { selectedTrack } = useAudioContext();
  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <div className="max-h-10">
        <Navbar />
      </div>
      <div className="justify-self-start">
        <Outlet />
      </div>
      {selectedTrack && <AudioPlayerContainer />}
    </div>
  );
}
