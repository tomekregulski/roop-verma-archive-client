import axios from 'axios';

import { isValidJwt } from '../util/isValidJwt';
const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchTracks(isAuth: boolean) {
  const jwt = isValidJwt();
  if (isAuth /* && jwt */) {
    console.log('fetching private tracks');
    const response = await axios.get(
      `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/${apiKey}`,
      {
        headers: { jwt: jwt },
      },
    );
    console.log(response.data);
    return response.data;
  } else {
    console.log('fetching public tracks');
    const response = await axios.get(
      // TEMPORARY CHANGE - TURN BACK BEFORE MERGE
      // `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/public/${key}`,
      `${import.meta.env.VITE_API_ORIGIN}/api/v1/track/${apiKey}`,
    );
    return response.data;
  }
}
