/** Temporary playback links live only in player memory, never catalog/cache/storage. */
import axios from 'axios';

import { api, legacyKey } from '../api/client';

export interface PlaybackAccess {
  trackId: number;
  url: string;
  expiresAt: string;
}

/** Requests and validates temporary access without granting authority from catalog data. */
export async function requestPlaybackAccess(trackId: number, signal: AbortSignal) {
  const { data } = await api.post<PlaybackAccess>(
    `/track/${trackId}/playback-access/${legacyKey}`,
    {},
    { signal },
  );
  if (
    data.trackId !== trackId ||
    typeof data.url !== 'string' ||
    new URL(data.url).protocol !== 'https:' ||
    !(Date.parse(data.expiresAt) > Date.now())
  ) {
    throw new Error('Invalid playback response');
  }
  return data;
}

/** Offers sign-in, billing or retry guidance without exposing provider details. */
export function playbackError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401)
      return 'Please log in to play this subscriber track.';
    if (error.response?.status === 403)
      return 'Your subscription could not be confirmed. Check or manage billing in your account, then retry.';
    if (error.response?.status === 404)
      return 'This track is no longer available. Refresh the library.';
    if (error.response?.status === 503)
      return 'Playback access is currently unavailable. Retry shortly or contact support through Help.';
  }
  return 'Unable to request playback. Check your connection and retry.';
}
