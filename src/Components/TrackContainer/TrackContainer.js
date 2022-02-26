import React, { useEffect, useState, useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import TrackCard from '../TrackCard/TrackCard';

import './trackContainerStyles.css';

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState([]);

  const { filteredTracks, setFilteredTracks, setSelectedTrack } =
    useContext(TracksContextData);

  useEffect(() => {
    let rows = [];
    if (filteredTracks) {
      filteredTracks.map((item) => {
        return rows.push({
          id: item.id,
          name: item.raga.name,
          tape: item.tape.id,
          date: item.tape.date,
          performance_type: item.performance_type,
          location: 'Location',
          time_of_day: 'morning',
          accompanied: true,
          artists: item.artists.map((artist, index) => [
            artist.name,
            artist.instrument,
          ]),
        });
      });
    }
    setTrackRows(rows);
  }, [filteredTracks, setFilteredTracks]);

  const clickHandle = (id) => {
    const newTrack = filteredTracks.filter((track) => track.id === id);
    setSelectedTrack(newTrack);
  };

  return (
    <div className='track-list--container'>
      {trackRows.length ? (
        trackRows.map((track, index) => {
          return <TrackCard key={index} callback={clickHandle} track={track} />;
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrackContainer;
