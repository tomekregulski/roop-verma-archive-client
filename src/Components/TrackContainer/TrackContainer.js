import React, { useEffect, useState, useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';

import TrackCard from '../TrackCard/TrackCard';

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState([]);

  const { trackList, setTrackList, setSelectedTrack } =
    useContext(TracksContextData);

  useEffect(() => {
    let rows = [];
    trackList &&
      trackList.map((item) => {
        return rows.push({
          id: item.id,
          name: item.raag.name,
          tape: item.tape.id,
          date: item.tape.date,
          performance_type: item.performance_type.name,
          location: 'Location',
          time_of_day: 'morning',
          accompanied: true,
          artists: item.artists.map((artist, index) => [
            artist.name,
            artist.instrument,
          ]),
        });
      });
    console.log(rows);
    setTrackRows(rows);
  }, [setTrackList, trackList]);

  const clickHandle = (id) => {
    const newTrack = trackList.filter((track) => track.id === id);
    setSelectedTrack(newTrack);
  };

  return (
    <div>
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
