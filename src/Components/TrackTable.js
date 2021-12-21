import React, { useEffect, useState, useContext } from 'react';
import { TracksContextData } from '../Context/TracksContext';

import './Table.css';

const TrackTable = () => {
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
          artists: item.artists.map((artist, index) => [
            artist.name,
            artist.instrument,
          ]),
        });
      });
    setTrackRows(rows);
  }, [setTrackList, trackList]);

  const clickHandle = (id) => {
    const newTrack = trackList.filter((track) => track.id === id);
    setSelectedTrack(newTrack);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Raag</th>
          <th>Date</th>
          <th>Performance Type</th>
        </tr>
      </thead>
      <tbody>
        {trackRows.map((track) => (
          <tr
            key={track.id}
            value={track.id}
            onClick={() => clickHandle(track.id)}
          >
            <td>{track.name}</td>
            <td>{track.date}</td>
            <td>{track.performance_type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TrackTable;
