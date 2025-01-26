import { useAudioContext } from '../../../context/AudioContext';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

const AudioPlayerContainer = () => {
  const { selectedTrack } = useAudioContext();
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
      "
      style={{ backgroundColor: 'rgba(0, 180, 249)' }}
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
        {selectedTrack ? <AudioPlayer /> : <div className="h-[88.24px]" />}
      </div>
    </div>
  );
};

export default AudioPlayerContainer;
