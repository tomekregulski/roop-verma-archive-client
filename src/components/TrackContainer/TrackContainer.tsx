import React, { useEffect, useState, useContext } from 'react';

import TrackCard from '../TrackCard/TrackCard';

import './trackContainerStyles.css';
import { useAudioContext } from '../../context/AudioContext';

export interface TrackInfo {
    id: number;
    name: string;
    timeOfDay: string;
    accompanied: boolean;
    plays: number;
    eventName: string;
    location: string;
    date: string;
}
// @ts-expect-error
const TrackContainer = (props) => {
    const [trackRows, setTrackRows] = useState<TrackInfo[] | null>();

    const { handleTriggerPlayPause } = props;

    const {
        tracksMessage,
        filteredTracks,
        setFilteredTracks,
        setSelectedTrack,
        setCurrentTrackIndex,
    } = useAudioContext();

    console.log(filteredTracks);

    useEffect(() => {
        // @ts-expect-error
        let rows = [];
        if (filteredTracks && filteredTracks.length > 0) {
            console.log(filteredTracks);
            filteredTracks.map((item) => {
                return rows.push({
                    id: item.id,
                    // event_name: item.tape.event.event_name,
                    // @ts-expect-error
                    name: item.raga.name,
                    // date: item.tape.event.date,
                    // category: item.tape.event.category.name,
                    // location: item.tape.event.location.name,
                    // @ts-expect-error
                    timeOfDay: item.raga.time,
                    accompanied: item.accompanied,
                    plays: item.plays,
                });
            });
        }
        // @ts-expect-error
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
        <div className="track-list--container">
            {trackRows ? (
                trackRows.map((track, index) => {
                    return (
                        <TrackCard
                            key={index}
                            callback={clickHandle}
                            trackInfo={track}
                            handleTriggerPlayPause={handleTriggerPlayPause}
                        />
                    );
                })
            ) : (
                <p>{tracksMessage}</p>
            )}
        </div>
    );
};

export default TrackContainer;
