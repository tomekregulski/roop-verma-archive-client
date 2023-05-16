import { TrackInfo } from '../components/TrackContainer/TrackContainer';

export const getTrackTitle = (trackInfo: TrackInfo) => {
  const {
    name,
    eventName,
    // category
    location,
    date,
  } = trackInfo;
  let title;
  let eventInfo;
  if (name.toLowerCase() !== 'unknown') {
    title = name;
    eventInfo = `${eventName !== 'n/a' ? eventName + ' - ' : ''}${date}${
      location !== 'Unknown' ? ' - ' + location : ''
    }`;
  } else if (eventName !== 'n/a') {
    title = eventName;
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  } else {
    title = 'Category Name';
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  }

  return { title, eventInfo };
};
