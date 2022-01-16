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

          <span className='track-detail-item'>Track ID: {id}</span>
          <span className='track-detail-item'>Tape ID: {tape}</span>
          <span className='track-detail-item'>
            Category: {performance_type}
          </span>
        </div>
        <div className='cardBodyRight'>
          <span className='track-detail-item'>{location}</span>
          <span className='track-detail-item'>{date}</span>
          <span className='track-detail-item'>Time of Day: {time_of_day}</span>
          <span className='track-detail-item'>
            Solo/Accomanied:{' '}
            {accompanied === true ? 'with tabla' : 'solo sitar'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
