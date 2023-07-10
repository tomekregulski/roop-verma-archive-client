import './audioPlayerContainerStyles.css';

import tanpuraRight from '../../../assets/sitar.png';
import tanpuraLeft from '../../../assets/sitar-reverse.png';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

interface AudioPlayerContainerProps {
  width: number;
  breakpoint: number;
}

const AudioPlayerContainer = (props: AudioPlayerContainerProps) => {
  const { width, breakpoint } = props;

  return (
    <div className="flex items-center justify-between w-full mt-12 border">
      {width > breakpoint && (
        <img className="h-[50px] mx-[50px]" src={tanpuraLeft} alt="tanpura" />
      )}
      <AudioPlayer />
      {width > breakpoint && (
        <img className="h-[50px] mx-[50px]" src={tanpuraRight} alt="tanpura" />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
