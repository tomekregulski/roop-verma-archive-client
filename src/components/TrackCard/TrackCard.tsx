/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './trackCard.css';

import { ReactComponent as Pause } from '../../assets/pause.svg';
import { ReactComponent as Play } from '../../assets/play.svg';
import { /*  Track, */ useAudioContext } from '../../context/AudioContext';
import { getTrackTitle } from '../../util/getTrackTitle';
import { TrackInfo } from '../TrackContainer/TrackContainer';

interface TrackCardProps {
  trackInfo: TrackInfo;
  callback: (id: number) => void;
}

const TrackCard = (props: TrackCardProps) => {
  const { id, timeOfDay, name } = props.trackInfo;

  const { selectedTrack, playPauseValidation, isPlaying } = useAudioContext();

  const isSelected = selectedTrack && selectedTrack.id === id;
  const titleContent = getTrackTitle(props.trackInfo);

  const renderTitle = () => {
    return (
      <div className="card--track-name">
        {titleContent.title}
        {name !== 'unknown' && timeOfDay && (
          <span className="card--track-detail-item">{' - ' + timeOfDay + ' Raga'}</span>
        )}
      </div>
    );
  };

  const renderSubtitle = () => {
    return (
      <div className="card--column-left">
        <span className="card--track-detail-item">
          {/* {`${event_name !== 'n/a' ? event_name + ' - ' : ''
        }${date}${location !== 'Unknown' ? ' - ' + location : ''}`} */}
          {titleContent.eventInfo}
        </span>
      </div>
    );
  };

  return (
    <div
      className={
        isSelected ? 'card--container card--container-playing' : 'card--container'
      }
    >
      <div className="card--body" onClick={() => props.callback(id)}>
        {renderTitle()}
        <div className="card--columns">
          {renderSubtitle()}
          <div className="card--column-right">
            {isSelected && (
              <button className="play audio-controls--button">
                {isPlaying ? (
                  <Pause onClick={playPauseValidation} />
                ) : (
                  <Play onClick={playPauseValidation} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
