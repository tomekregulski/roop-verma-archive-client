import { TrackInfo } from '../components/TrackContainer/TrackContainer';

function getYear(date: string) {
  const year = date.split('/')[2];
  return year;
}

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
    const year = date !== 'n/a' ? getYear(date) : 'Date Unavailable';
    eventInfo = `${eventName ? eventName + ' - ' : ''}${year}${
      location !== 'Unknown' ? ' - ' + location : ''
    }`;
  } else if (eventName && eventName !== 'n/a') {
    title = eventName;
    eventInfo = `${eventName} - ${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  } else {
    title = 'Category Name';
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  }

  // console.log(title, eventInfo);

  return { title, eventInfo };
};
