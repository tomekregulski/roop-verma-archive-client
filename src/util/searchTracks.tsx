import type { SearchFilter } from '../context/AudioContext';
import type { Track } from '../context/trackTypes';

export function searchTracks(searchFilter: SearchFilter, tracks: Track[]) {
  switch (searchFilter.type) {
    case 'all':
      return tracks;
    // setTracksMessage('');
    case 'none':
      return [];
    // setTracksMessage('Sorry, there are no tracks that match your search');
    case 'some':
      // eslint-disable-next-line no-case-declarations
      const newTracks = tracks.filter((track) => searchFilter.ids.includes(track.id));
      return newTracks;
    case 'error':
      // TODO: see if we need to handle this
      return [];
    // setTracksMessage('Something went wrong. Please refresh the page and try again');
    default:
      return tracks;
  }
}
