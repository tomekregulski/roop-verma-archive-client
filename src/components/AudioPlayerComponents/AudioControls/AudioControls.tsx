// @ts-expect-error TOOD: figure out how to properly handle SVGs
import { ReactComponent as Play } from '../../assets/play.svg';
// @ts-expect-error TOOD: figure out how to properly handle SVGs
import { ReactComponent as Pause } from '../../assets/pause.svg';
// @ts-expect-error TOOD: figure out how to properly handle SVGs
import { ReactComponent as Next } from '../../assets/next.svg';
// @ts-expect-error TOOD: figure out how to properly handle SVGs
import { ReactComponent as Prev } from '../../assets/prev.svg';

import './audioControls.css';

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
                <Prev />
            </button>
            {isPlaying ? (
                <button
                    type="button"
                    className="pause audio-controls--button"
                    onClick={() => onPlayPauseClick(false)}
                    aria-label="Pause"
                >
                    <Pause />
                </button>
            ) : (
                <button
                    type="button"
                    className="play audio-controls--button"
                    onClick={() => onPlayPauseClick(true)}
                    aria-label="Play"
                >
                    <Play />
                </button>
            )}
            <button
                type="button"
                className="next audio-controls--button"
                aria-label="Next"
                onClick={onNextClick}
            >
                <Next />
            </button>
        </div>
    );
};

export default AudioControls;
