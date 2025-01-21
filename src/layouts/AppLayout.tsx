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
    <div>
      <Navbar />
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
