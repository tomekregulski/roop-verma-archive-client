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
    eventInfo = `${eventName ? eventName + ' - ' : ''}${
      date !== 'n/a' ? date : 'Missing Date'
    }${location !== 'Unknown' ? ' - ' + location : ''}`;
  } else if (eventName && eventName !== 'n/a') {
    title = eventName;
    eventInfo = `${eventName} - ${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  } else {
    title = 'Category Name';
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  }

  return { title, eventInfo };
};
