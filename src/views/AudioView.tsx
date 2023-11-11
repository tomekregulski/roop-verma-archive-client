import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AudioTopBar } from '../components/AudioPlayerComponents/AudioTopBar/AudioTopBar';
import TrackContainer from '../components/TrackContainer/TrackContainer';
import { useAuthContext } from '../context/AuthContext';
import { fetchTracks } from '../queries/audioQueries';
import { isValidJwt } from '../util/isValidJwt';

// interface AudioViewProps {
//   width: number;
//   breakpoint: number;
// }

const AudioView = (/*props: AudioViewProps*/) => {
  const { /* userData, */ updateUserData, updateAuthStatus, isAuth } = useAuthContext();
  const { isLoading, error, isError } = useQuery(['tracks'], () => fetchTracks(isAuth), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  // const { width, breakpoint } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidJwt) {
      updateUserData(null);
      updateAuthStatus(false);
      document.cookie = 'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
      navigate('/');
    }
    // else {
    //   updateAuthStatus(true);
    // }
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError && error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <div className="flex flex-col justify-start mt-[56px] absolute">
      <AudioTopBar />
      <TrackContainer />
    </div>
  );
};

export default AudioView;
