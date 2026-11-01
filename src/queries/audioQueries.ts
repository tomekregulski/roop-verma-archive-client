import { api, legacyKey } from '../api/client';
import type { Track } from '../context/trackTypes';

/** Catalog visibility is a browsing choice; playback always requires issuance. */
export async function fetchTracks(isAuth: boolean): Promise<Track[]> {
  const { data } = await api.get<Track[]>(
    `/track/${isAuth ? '' : 'public/'}${legacyKey}`,
  );
  return data;
}
