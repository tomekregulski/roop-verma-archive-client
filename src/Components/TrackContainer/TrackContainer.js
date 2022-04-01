import React, { useEffect, useState, useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import TrackCard from '../TrackCard/TrackCard';

import './trackContainerStyles.css';

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState([]);

  const {
    tracksMessage,
    filteredTracks,
    setFilteredTracks,
    setSelectedTrack,
    setCurrentTrackIndex,
  } = useContext(TracksContextData);

  useEffect(() => {
    let rows = [];
    if (filteredTracks) {
      filteredTracks.map((item) => {
        return rows.push({
          id: item.id,
          event_name: item.tape.event.event_name,
          name: item.raga.name,
          date: item.tape.event.date,
          // category: item.tape.event.category.name,
          location: item.tape.event.location.name,
          time_of_day: item.raga.time,
          accompanied: item.accompanied,
        });
      });
    }
    setTrackRows(rows);
  }, [filteredTracks, setFilteredTracks]);

  const clickHandle = (id) => {
    const newTrack = filteredTracks.filter((track) => track.id === id);
    const index = filteredTracks.findIndex((track) => track.id === id);
    setSelectedTrack(newTrack[0]);
    setCurrentTrackIndex(index);
  };

  return (
    <div className='track-list--container'>
      {trackRows.length > 0 ? (
        trackRows.map((track, index) => {
          return <TrackCard key={index} callback={clickHandle} track={track} />;
        })
      ) : (
        <p>{tracksMessage}</p>
      )}
    </div>
  );
};

export default TrackContainer;
