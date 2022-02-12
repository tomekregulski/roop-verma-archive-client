import React, { useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import './trackCard.css';

const TrackCard = (props) => {
  const {
    accompanied,
    id,
    location,
    tape,
    time_of_day,
    name,
    date,
    performance_type,
  } = props.track;

  const { selectedTrack } = useContext(TracksContextData);

  return (
    <div
      className={
        selectedTrack.length > 0 && selectedTrack[0].id === id
          ? 'card--container card--container-playing'
          : 'card--container'
      }
    >
      <div className='card--body' onClick={() => props.callback(id)}>
        <div className='card--track-name'>{`Event Name - ${date} - ${location} - ${name}`}</div>
        <div className='card--columns'>
          <div className='card--column-left'>
            <span className='card--track-detail-item'>Performance Type</span>
            <span className='card--track-detail-item'>{time_of_day}</span>
          </div>
          <div className='card--column-right'>
            <span className='card--track-detail-item'>
              {
                accompanied === true ? 'Performance with tabla' : 'Solo sitar'
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
