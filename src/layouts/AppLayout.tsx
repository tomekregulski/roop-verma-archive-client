// import styled from '@emotion/styled';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import AudioPlayerContainer from '../components/AudioPlayerComponents/AudioPlayerContainer/AudioPlayerContainer';
import { Navbar } from '../components/Navbar/Navbar';
import { useAuthContext } from '../context/AuthContext';
import { isValidJwt } from '../util/isValidJwt';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateAuthStatus, updateUserData } = useAuthContext();

  useEffect(() => {
    const pathName = location.pathname;
    const currentJwt = isValidJwt();
    if (!currentJwt?.foundJwt) {
      updateUserData(null);
      updateAuthStatus(false);
      document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      if (pathName === '/authmanage-account') {
        navigate('/');
      }
    }
  }, [location.pathname]);

  return (
    <div className="grid h-screen grid-rows-[auto_minmax(0,1fr)_auto] isolate">
      <div className="z-10" style={{ zIndex: 100 }}>
        <Navbar />
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </div>
      <div style={{ zIndex: 100 }}>
        <AudioPlayerContainer />
      </div>
    </div>
  );
}
