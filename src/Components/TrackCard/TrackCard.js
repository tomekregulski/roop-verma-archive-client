import React, { useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import './trackCard.css';

const TrackCard = (props) => {
  const { id, location, time_of_day, name, event_name, date, plays } =
    props.track;

  const { selectedTrack } = useContext(TracksContextData);

  return (
    <div
      className={
        Object.keys(selectedTrack).length > 0 && selectedTrack.id === id
          ? 'card--container card--container-playing'
          : 'card--container'
      }
    >
      <div className='card--body' onClick={() => props.callback(id)}>
        <div className='card--track-name'>
          {name}
          <span className='card--track-detail-item'>
            {' - ' + time_of_day + ' Raga'}
          </span>
        </div>
        <div className='card--columns'>
          <div className='card--column-left'>
            <span className='card--track-detail-item'>{`${
              event_name !== 'n/a' ? event_name + ' - ' : ''
            }${date}${location !== 'Unknown' ? ' - ' + location : ''}`}</span>
            {/* <span className='card--track-detail-item'>
              Plays: {plays ? plays : 0}
            </span> */}
          </div>
          <div className='card--column-right'>
            <span className='card--track-detail-item'>
              {/* <span className='card--track-detail-item'>{category}</span> */}
              {
                // accompanied === true ? 'Performance with tabla' : 'Solo sitar'
                // or lecture, guideed meditation, etc...
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
