import { useEffect, useState } from 'react';

import { useAudioContext } from '../../context/AudioContext';
import TrackCard from '../TrackCard/TrackCard';
import type { TrackInfo } from './types';

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState<TrackInfo[] | null>();

  const {
    tracksMessage,
    filteredTracks,
    setFilteredTracks,
    setSelectedTrack,
    setCurrentTrackIndex,
  } = useAudioContext();

  useEffect(() => {
    const rows: TrackInfo[] = [];
    if (filteredTracks && filteredTracks.length > 0) {
      filteredTracks.map((track) => {
        const trackRowItem = {
          id: track.id,
          eventName: track.tape.event.eventName,
          name: track.raga.name,
          date: track.tape.event.date,
          category: track.tape.event.category.name,
          location: track.tape.event.location.name,
          timeOfDay: track.raga.time,
          accompanied: track.accompanied,
          plays: track.plays,
          rasa: track.raga.rasa,
        };
        return rows.push(trackRowItem);
      });
    }
    setTrackRows(rows);
  }, [filteredTracks, setFilteredTracks]);

  const handleClick = (id: number) => {
    if (filteredTracks) {
      const newTrack = filteredTracks.filter((track) => track.id === id);
      const index = filteredTracks.findIndex((track) => track.id === id);
      setSelectedTrack(newTrack[0]);
      setCurrentTrackIndex(index);
    }
  };

  return (
    <div>
      <div className="overflow-scroll">
        {trackRows ? (
          trackRows.map((track) => {
            return <TrackCard key={track.id} callback={handleClick} trackInfo={track} />;
          })
        ) : (
          <p>{tracksMessage}</p>
        )}
      </div>
    </div>
  );
};

export default TrackContainer;
