import './audioControls.css';

import Next from '../../../assets/next.svg';
import Pause from '../../../assets/pause.svg';
import Play from '../../../assets/play.svg';
import Prev from '../../../assets/prev.svg';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: (isPlaying: boolean) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

const AudioControls = (props: AudioControlsProps) => {
  const { isPlaying, onPlayPauseClick, onPrevClick, onNextClick } = props;
  return (
    <div className="audio-controls--container">
      <button
        type="button"
        className="prev audio-controls--button"
        aria-label="Previous"
        onClick={onPrevClick}
      >
        {/* <Prev /> */}
        <span>Prev</span>
      </button>
      {isPlaying ? (
        <button
          type="button"
          className="pause audio-controls--button"
          onClick={() => onPlayPauseClick(false)}
          aria-label="Pause"
        >
          {/* <Pause /> */}
          <span>Pause</span>
        </button>
      ) : (
        <button
          type="button"
          className="play audio-controls--button"
          onClick={() => onPlayPauseClick(true)}
          aria-label="Play"
        >
          {/* <Play /> */}
          <span>Play</span>
        </button>
      )}
      <button
        type="button"
        className="next audio-controls--button"
        aria-label="Next"
        onClick={onNextClick}
      >
        {/* <Next /> */}
        <span>Next</span>
      </button>
    </div>
  );
};

export default AudioControls;
