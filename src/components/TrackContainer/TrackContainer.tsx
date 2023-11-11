import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { useAudioContext } from '../../context/AudioContext';
import TrackCard from '../TrackCard/TrackCard';

interface Location {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}

interface Event {
  id: number;
  eventName: string;
  date: string;
  location: Location;
  locationId: number;
  category: Category;
  categoryId: number;
  notes: string;
  tapes: Tape[];
}
interface Tape {
  id: number;
  eventId: number;
  tapeId: number;
  event: Event;
}

export interface TrackInfo {
  id: number;
  name: string;
  timeOfDay: string;
  accompanied: boolean;
  plays: number;
  eventName: string;
  location: string;
  date: string;
  rasa: string;
}
const TrackContainerWrapper = styled.div();
const TrackList = styled.div();

const TrackContainer = () => {
  const [trackRows, setTrackRows] = useState<TrackInfo[] | null>();

  const {
    tracksMessage,
    filteredTracks,
    setFilteredTracks,
    setSelectedTrack,
    setCurrentTrackIndex,
  } = useAudioContext();

  // console.log(filteredTracks);

  useEffect(() => {
    // @ts-expect-error need rows interface
    const rows = [];
    if (filteredTracks && filteredTracks.length > 0) {
      // console.log(filteredTracks);
      filteredTracks.map((item) => {
        return rows.push({
          id: item.id,
          event_name: item.tape.event.eventName,
          name: item.raga.name,
          date: item.tape.event.date,
          category: item.tape.event.category.name,
          location: item.tape.event.location.name,
          timeOfDay: item.raga.time,
          accompanied: item.accompanied,
          plays: item.plays,
          rasa: item.raga.rasa,
        });
      });
    }
    // @ts-expect-error need interface for track here
    setTrackRows(rows);
  }, [filteredTracks, setFilteredTracks]);

  const clickHandle = (id: number) => {
    if (filteredTracks) {
      const newTrack = filteredTracks.filter((track) => track.id === id);
      const index = filteredTracks.findIndex((track) => track.id === id);
      setSelectedTrack(newTrack[0]);
      setCurrentTrackIndex(index);
    }
  };

  return (
    <TrackContainerWrapper
      className="md:mt-[92px] md:mb-[120px] sm:mt-[206px] sm:mb-[130px]"
      style={{ backgroundColor: 'rgba(0, 180, 249)' }}
    >
      <TrackList className="overflow-scroll">
        {trackRows ? (
          trackRows.map((track) => {
            return <TrackCard key={track.id} callback={clickHandle} trackInfo={track} />;
          })
        ) : (
          <p>{tracksMessage}</p>
        )}
      </TrackList>
    </TrackContainerWrapper>
  );
};

export default TrackContainer;
