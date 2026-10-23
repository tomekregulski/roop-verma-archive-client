import { api } from '../api/client';

const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchTracks(isAuth: boolean) {
  if (isAuth) {
    console.log('fetching private tracks');
    const response = await api.get(`/track/${apiKey}`);
    console.log(response.data);
    return response.data;
  } else {
    console.log('fetching public tracks');
    const response = await api.get(
      // TEMPORARY CHANGE - TURN BACK BEFORE MERGE
      // `/track/public/${key}`,
      `/track/${apiKey}`,
    );
    return response.data;
  }
}
