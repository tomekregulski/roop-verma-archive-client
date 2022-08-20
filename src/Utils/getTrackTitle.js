export const getTrackTitle = (trackInfo) => {
  const {
    name,
    event_name,
    // category
    location,
    date,
  } = trackInfo;
  let title;
  let eventInfo;
  if (name.toLowerCase() !== 'unknown') {
    title = name;
    eventInfo = `${event_name !== 'n/a' ? event_name + ' - ' : ''}${date}${
      location !== 'Unknown' ? ' - ' + location : ''
    }`;
  } else if (event_name !== 'n/a') {
    title = event_name;
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  } else {
    title = 'Category Name';
    eventInfo = `${date}${location !== 'Unknown' ? ' - ' + location : ''}`;
  }

  return { title, eventInfo };
};
