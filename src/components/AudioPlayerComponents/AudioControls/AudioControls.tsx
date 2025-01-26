import type { HTMLAttributes, PropsWithChildren } from 'react';

import { ReactComponent as Next } from '../../../assets/next.svg';
import { ReactComponent as Pause } from '../../../assets/pause.svg';
import { ReactComponent as Play } from '../../../assets/play.svg';
import { ReactComponent as Prev } from '../../../assets/prev.svg';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: (isPlaying: boolean) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

interface AudioControlsButtonProps
  extends PropsWithChildren,
    Pick<HTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  onClick: () => void;
}

function AudioControlsButton(props: AudioControlsButtonProps) {
  const { 'aria-label': ariaLabel, children, onClick } = props;

  return (
    <button
      aria-label={ariaLabel}
      className="bg-none border-none cursor-pointer"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const AudioControls = (props: AudioControlsProps) => {
  const { isPlaying, onPlayPauseClick, onPrevClick, onNextClick } = props;
  return (
    <div
      className="
        flex
        justify-between
        w-[75%]
        mt-0
        mx-auto
        mb-[15px]
      "
    >
      <AudioControlsButton aria-label="Previous" onClick={onPrevClick}>
        <Prev className="w-[35px] h-[35px]" />
      </AudioControlsButton>
      {isPlaying ? (
        <AudioControlsButton onClick={() => onPlayPauseClick(false)} aria-label="Pause">
          <Pause className="w-[40px] h-[40px]" />
        </AudioControlsButton>
      ) : (
        <AudioControlsButton onClick={() => onPlayPauseClick(true)} aria-label="Play">
          <Play className="w-[40px] h-[40px]" />
        </AudioControlsButton>
      )}
      <AudioControlsButton aria-label="Next" onClick={onNextClick}>
        <Next className="w-[35px] h-[35px]" />
      </AudioControlsButton>
    </div>
  );
};

export default AudioControls;
