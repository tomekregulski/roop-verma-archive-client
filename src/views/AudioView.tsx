import { useQuery } from '@tanstack/react-query';

import { AudioTopBar } from '../components/AudioPlayerComponents/AudioTopBar/AudioTopBar';
import TrackContainer from '../components/TrackContainer/TrackContainer';
import { useAuthContext } from '../context/AuthContext';
import { fetchTracks } from '../queries/audioQueries';

const AudioView = () => {
  const { isAuth } = useAuthContext();
  const { isLoading, error, isError } = useQuery(['tracks'], () => fetchTracks(isAuth), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError && error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <div className="mt-[-4px]">
      <AudioTopBar />
      <div className="absolute top-[140px] bottom-0 left-0 right-0 overflow-auto">
        <TrackContainer />
      </div>
    </div>
  );
};

export default AudioView;
