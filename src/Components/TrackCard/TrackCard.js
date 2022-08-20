import React, { useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';
import { ReactComponent as Play } from '../../assets/play.svg';
import { ReactComponent as Pause } from '../../assets/pause.svg';
import { getTrackTitle } from '../../Utils/getTrackTitle';

import './trackCard.css';

const TrackCard = (props) => {
  const { track } = props;
  const { id, time_of_day, name } = track;

  const { selectedTrack, playPauseValidation, isPlaying } =
    useContext(TracksContextData);
  const isSelected =
    Object.keys(selectedTrack).length > 0 && selectedTrack.id === id;
  const titleContent = getTrackTitle(track);

  const renderTitle = () => {
    return (
      <div className='card--track-name'>
        {titleContent.title}
        {name !== 'unknown' && time_of_day && (
          <span className='card--track-detail-item'>
            {' - ' + time_of_day + ' Raga'}
          </span>
        )}
      </div>
    );
  };

  const renderSubtitle = () => {
    return (
      <div className='card--column-left'>
        <span className='card--track-detail-item'>
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
        isSelected
          ? 'card--container card--container-playing'
          : 'card--container'
      }
    >
      <div className='card--body' onClick={() => props.callback(id)}>
        {renderTitle()}
        <div className='card--columns'>
          {renderSubtitle()}
          <div className='card--column-right'>
            {isSelected && (
              <button className='play audio-controls--button'>
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
