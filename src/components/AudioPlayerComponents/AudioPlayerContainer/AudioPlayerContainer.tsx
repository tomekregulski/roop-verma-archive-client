import './audioPlayerContainerStyles.css';

// import tanpuraRight from '../../../assets/sitar.png';
// import tanpuraLeft from '../../../assets/sitar-reverse.png';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

// interface AudioPlayerContainerProps {
//   width: number;
//   breakpoint: number;
// }

const AudioPlayerContainer = (/*props: AudioPlayerContainerProps*/) => {
  // const { width, breakpoint } = props;

  return (
    <div
      className="mt-12"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 180, 249)',
      }}
    >
      <div className="flex items-center justify-between w-full border mt-2">
        {/* {width > breakpoint && (
        <img className="h-[50px] mx-[50px]" src={tanpuraLeft} alt="tanpura" />
      )} */}
        <AudioPlayer />
        {/* {width > breakpoint && (
        <img className="h-[50px] mx-[50px]" src={tanpuraRight} alt="tanpura" />
      )} */}
      </div>
    </div>
  );
};

export default AudioPlayerContainer;
