import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    axios
      .get('https://roop-verma-archive.herokuapp.com/api/tracks', {})
      .then((response) => {
        setTrackList(response.data); // update your state
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  }, []);

  return (
    <TracksContextData.Provider
      value={{ trackList, setTrackList, selectedTrack, setSelectedTrack }} // value of your context
    >
      {props.children}
    </TracksContextData.Provider>
  );
};
