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
    <div className="audioContainerWrapper">
      {width > breakpoint && (
        <img className="tanpura__left" src={tanpuraLeft} alt="tanpura" />
      )}
      <AudioPlayer />
      {width > breakpoint && (
        <img className="tanpura__right" src={tanpuraRight} alt="tanpura" />
      )}
    </div>
  );
};

export default AudioPlayerContainer;
