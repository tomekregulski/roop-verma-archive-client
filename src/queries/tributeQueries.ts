import axios from 'axios';

import { isValidJwt } from '../util/isValidJwt';
const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchTributes() {
  const currentJwt = isValidJwt();
  console.log('fetching tributes');
  const response = await axios.get(
    `${import.meta.env.VITE_API_ORIGIN}/api/v1/tributes/${apiKey}`,
    {
      headers: { jwt: currentJwt?.jwt },
    },
  );
  console.log(response.data);
  return response.data;
}
