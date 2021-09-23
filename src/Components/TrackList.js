import React, { useState, useEffect, useContext } from 'react';
import { TracksContextData } from '../Context/TracksContext';

import { DataGrid } from '@mui/x-data-grid';

const TrackList = () => {
  const [trackRows, setTrackRows] = useState([]);

  const { trackList, setTrackList, setSelectedTrack } =
    useContext(TracksContextData);

  useEffect(() => {
    let rows = [];
    trackList &&
      trackList.map((item) => {
        rows.push({
          id: item.id,
          name: item.raag.name,
          tape: item.tape.id,
          location: item.location.name,
        });
      });
    setTrackRows(rows);
  }, [setTrackList, trackList]);

  const clickHandle = (e) => {
    const newTrack = trackList.filter((track) => track.id === e.id);
    setSelectedTrack(newTrack);
  };

  return (
    <div style={{ height: 250, width: '800px', marginTop: '80px' }}>
      <DataGrid
        onRowClick={(e) => clickHandle(e)}
        columns={[
          { field: 'id', headerName: 'Track ID', width: 150 },
          { field: 'name', headerName: 'Name', width: 150 },
          { field: 'tape', headerName: 'Tape', width: 150 },
          { field: 'location', headerName: 'Location', width: 150 },
        ]}
        rows={trackRows}
      />
    </div>
  );
};

export default TrackList;
