import './audioPlayerContainerStyles.css';

import styled from '@emotion/styled';

import { useAudioContext } from '../../../context/AudioContext';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

const EmptyFooter = styled.div();

const AudioPlayerContainer = () => {
  const { selectedTrack } = useAudioContext();
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 180, 249)',
      }}
    >
      <div
        className="
          flex 
          items-center 
          justify-between 
          w-full 
          border-t 
          mt-[32px]
        "
      >
        {selectedTrack ? <AudioPlayer /> : <EmptyFooter className="h-[88.24px]" />}
      </div>
    </div>
  );
};

export default AudioPlayerContainer;
