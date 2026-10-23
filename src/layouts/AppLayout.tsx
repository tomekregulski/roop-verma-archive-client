import { Outlet } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
import { Button } from '../components/Button/Button';
import { Navbar } from '../components/Navbar/Navbar';
import { useAuthContext } from '../context/AuthContext';

export function AppLayout() {
  const { status, sessionError, refreshSession } = useAuthContext();

  return (
    <div>
      <Navbar />
      {status === 'loading' && <p role="status">Checking your session…</p>}
      {sessionError && (
        <div role={status === 'error' ? 'alert' : 'status'}>
          <p>{sessionError}</p>
          {status === 'error' && (
            <Button
              name="Retry session check"
              callback={() => {
                void refreshSession();
              }}
            />
          )}
        </div>
      )}
      <div
        className="
          overflow-scroll 
          mt-[32px] 
          mx-auto
        "
        style={{
          height: 'calc(100vh - 90px - 64px - 125px)',
        }}
      >
        <Outlet />
      </div>
      <AudioPlayerContainer />
    </div>
  );
}
