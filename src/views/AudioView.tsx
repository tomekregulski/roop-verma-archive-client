import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { AudioTopBar } from '../components/AudioPlayerComponents/AudioTopBar/AudioTopBar';
import TrackContainer from '../components/TrackContainer/TrackContainer';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { fetchTracks } from '../queries/audioQueries';

const AudioView = () => {
  const { isAuth } = useAuthContext();
  const { updateLoadingState, updateAlertMessage } = useNotificationContext();
  const { isLoading, error, isError } = useQuery(['tracks'], () => fetchTracks(isAuth), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    updateLoadingState(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isError && error) {
      updateAlertMessage([error.toString()]);
    }
  }, [isError, error]);

  return (
    <>
      <AudioTopBar />
      <TrackContainer />
    </>
  );
};

export default AudioView;
