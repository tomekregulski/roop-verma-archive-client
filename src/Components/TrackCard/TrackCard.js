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
        selectedTrack && selectedTrack[0].id === id
          ? 'cardContainer cardContainerPlaying'
          : 'cardContainer'
      }
    >
      <div className='cardBody' onClick={() => props.callback(id)}>
        <div className='cardBodyLeft'>
          <span className='track-title'>{name}</span>

          <span className='track-detail-item'>{id}</span>
          <span className='track-detail-item'>{tape}</span>
          <span className='track-detail-item'>{performance_type}</span>
        </div>
        <div className='cardBodyRight'>
          <span className='track-detail-item'>{location}</span>
          <span className='track-detail-item'>{date}</span>
          <span className='track-detail-item'>{time_of_day}</span>
          <span className='track-detail-item'>
            {accompanied === true ? 'with tabla' : 'solo'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
