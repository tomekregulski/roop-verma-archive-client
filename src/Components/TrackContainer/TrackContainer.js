import React, { useEffect, useState, useContext } from 'react';
import { TracksContextData } from '../../Context/TracksContext';
import { AuthContext } from '../../Context/AuthContext';

import TrackCard from '../TrackCard/TrackCard';

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState([]);

  const { trackList, setTrackList, setSelectedTrack } =
    useContext(TracksContextData);

  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  useEffect(() => {
    let rows = [];
    if (trackList) {
      trackList.map((item) => {
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
    // console.log(rows);
    setTrackRows(rows);
  }, [setTrackList, trackList]);

  const clickHandle = (id) => {
    const newTrack = trackList.filter((track) => track.id === id);
    setSelectedTrack(newTrack);
  };

  return (
    <div style={{ marginTop: '30px' }}>
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
