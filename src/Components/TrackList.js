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
          // location: item.location.name,
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

  const clickHandle = (e) => {
    const newTrack = trackList.filter((track) => track.id === e.id);
    setSelectedTrack(newTrack);
  };

  return (
    <div
      style={{
        height: 400,
        minWidth: '200px',
        maxWidth: '800px',
        marginTop: '80px',
        backgroundColor: 'white',
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            onRowClick={(e) => clickHandle(e)}
            columns={[
              { field: 'id', headerName: 'Track ID', width: 150 },
              { field: 'name', headerName: 'Name', width: 150 },
              { field: 'tape', headerName: 'Tape', width: 150 },
              { field: 'date', headerName: 'Date', width: 150 },
              {
                field: 'performance_type',
                headerName: 'Performance Type',
                width: 150,
              },
            ]}
            rows={trackRows}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackList;
