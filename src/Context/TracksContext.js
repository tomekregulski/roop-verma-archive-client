import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

export const TracksContextData = createContext(null);

export const TracksContext = (props) => {
  const [trackList, setTrackList] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/tracks', {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
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
// export const TracksContext = createContext();

// export const TracksProvider = ({ children }) => {
//   const [trackList, setTrackList] = useState([]);
//   const [selectedTrack, setSelectedTrack] = useState({});

//   useEffect(() => {
//     async function fetchData() {
//       const apiResponse = await axios.get(
//         // 'https://roop-verma-archive.herokuapp.com/api/raags'
//         'http://localhost:5000/api/tracks'
//       );
//       setTrackList(apiResponse.data);
//     }
//     fetchData();
//   }, []);

//   return (
//     <TracksContext.Provider value={{ selectedTrack, setSelectedTrack }}>
//       {children}
//     </TracksContext.Provider>
//   );
// };

// export { TracksContext, TracksContextProvider };
