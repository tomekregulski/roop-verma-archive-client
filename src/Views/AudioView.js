import React, { useContext } from 'react';

import { TracksContextData } from '../Context/TracksContext';
import { AuthContext } from '../Context/AuthContext';

import Select from '../Components/Select/Select';
import Button from '../Components/Button/Button';

import AudioPlayerContainer from '../Components/AudioPlayerContainer/AudioPlayerContainer';
import TrackContainer from '../Components/TrackContainer/TrackContainer';

const AudioView = (props) => {
  const { width, breakpoint } = props;

  const { setCategoryFilter, setSelectedTrack, trackList } =
    useContext(TracksContextData);

  const { auth } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = auth;

  const categories = ['all', 'concert', 'meditation'];

  const filterSelect = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
  };

  const supriseMe = () => {
    const randomTrackNumber = Math.floor(Math.random() * 10);
    const randomTrack = [trackList[randomTrackNumber]];
    setSelectedTrack(randomTrack);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '50px',
        }}
      >
        {isAuth === false ? (
          <div>
            <p
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '50px',
                padding: '0 25px',
                lineHeight: '1.5',
              }}
            >
              Please enjoy this limited public selection of Roopji's work. For
              full access, please log in or register through the link in above.
            </p>
          </div>
        ) : null}
        <AudioPlayerContainer width={width} breakpoint={breakpoint} />
        {isAuth === true && (
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <Button
              margin='0 15px 0 0'
              name='Surprise Me'
              callback={() => supriseMe}
              padding='15px 35px'
            />
            <Select
              callback={filterSelect}
              name='category-filter'
              item='Category Filter'
              values={categories}
            />
          </div>
        )}
        <TrackContainer />
      </div>
    </>
  );
};

export default AudioView;
