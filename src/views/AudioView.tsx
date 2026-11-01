import { AudioTopBar } from '../components/AudioPlayerComponents/AudioTopBar/AudioTopBar';
import TrackContainer from '../components/TrackContainer/TrackContainer';

// AudioProvider owns the single catalog request and its loading/error state.
const AudioView = () => (
  <>
    <AudioTopBar />
    <TrackContainer />
  </>
);

export default AudioView;
