/**
 * Standalone browser regression page for the real React player/providers.
 * API responses and media playback are simulated here; no remote media is read.
 * Never imported by src/ or enabled by application configuration.
 */
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { api } from '../src/api/client';
import { AudioPlayer } from '../src/components/AudioPlayerComponents/AudioPlayer/AudioPlayer';
import { AudioProvider, useAudioContext } from '../src/context/AudioContext';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import type { Track } from '../src/context/trackTypes';
import type { PlaybackAccess } from '../src/util/playbackAccess';

interface PendingPlaybackRequest {
  config: InternalAxiosRequestConfig;
  resolve: (response: AxiosResponse<PlaybackAccess>) => void;
  reject: (reason: unknown) => void;
}

const calls: InternalAxiosRequestConfig[] = [];
const pending: PendingPlaybackRequest[] = [];
let signedIn = false;
let rejectPlay = false;
class FakeAudio {
  src: string;
  currentTime = 0;
  duration = 180;
  ended = false;
  paused = true;
  onerror: (() => void) | null = null;
  onloadedmetadata: (() => void) | null = null;
  constructor(src = '') {
    this.src = src;
  }
  pause() {
    this.paused = true;
  }
  play() {
    if (rejectPlay) return Promise.reject(Error('synthetic browser rejection'));
    this.paused = false;
    return Promise.resolve();
  }
  load() {
    queueMicrotask(() => {
      if (this.src) this.onloadedmetadata?.();
    });
  }
  removeAttribute() {
    this.src = '';
  }
  getAttribute() {
    return this.src || null;
  }
}
// This double implements only the media methods/events exercised by the player.
// Keep the compatibility cast at this one browser-API replacement boundary.
window.Audio = FakeAudio as unknown as typeof window.Audio;
const response = <T,>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<T> => ({
  config,
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
});
const failure = (config: InternalAxiosRequestConfig, status: number) =>
  new AxiosError('synthetic denial', undefined, config, undefined, {
    ...response(config, { error: { message: 'synthetic denial' } }),
    status,
  });
api.defaults.adapter = async (config) => {
  calls.push(config);
  if (config.url === '/auth/session') {
    if (!signedIn) throw failure(config, 401);
    return response(config, {
      user: {
        id: 1,
        firstName: 'Synthetic',
        lastName: 'User',
        email: 'a@example.invalid',
        stripeId: 'cus_synthetic',
        subscriptionActive: 'incomplete',
        isAdmin: false,
      },
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
  }
  if (config.url === '/auth/logout') {
    signedIn = false;
    return response(config, {});
  }
  if (config.url?.includes('/playback-access/'))
    return new Promise<AxiosResponse<PlaybackAccess>>((resolve, reject) =>
      pending.push({ config, resolve, reject }),
    );
  return response(config, []);
};
const contexts: {
  audio?: ReturnType<typeof useAudioContext>;
  auth?: ReturnType<typeof useAuthContext>;
} = {};

/** Read the latest render's state; fail clearly if the harness is not mounted. */
function getAudio() {
  if (!contexts.audio) throw Error('AudioProvider has not mounted');
  return contexts.audio;
}
function getAuth() {
  if (!contexts.auth) throw Error('AuthProvider has not mounted');
  return contexts.auth;
}

function latestRequest() {
  const request = pending.at(-1);
  if (!request) throw Error('No playback request captured');
  return request;
}
function Harness() {
  contexts.audio = useAudioContext();
  contexts.auth = useAuthContext();
  return (
    <>
      <p id="auth">{getAuth().status}</p>
      {getAudio().selectedTrack && <AudioPlayer />}
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AudioProvider>
        <Harness />
      </AudioProvider>
    </AuthProvider>
  </StrictMode>,
);
const wait = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(predicate: () => boolean) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await wait();
  }
  throw Error('Timed out waiting for browser state');
}
const lines: string[] = [];
function check(value: unknown, name: string) {
  if (!value) throw Error(name);
  lines.push('PASS ' + name);
}
/** Complete catalog fixture, checked against the same Track type as the player. */
function track(id: number): Track {
  return {
    id,
    trackId: id,
    tapeId: 1,
    ragaId: 1,
    primaryArtistId: 1,
    plays: 0,
    alap: true,
    jor: false,
    jhalla: false,
    slowGat: false,
    mediumGat: false,
    fastGat: false,
    accompanied: false,
    notes: '',
    audioQuality: 'Synthetic',
    mediaTypeId: 1,
    public: id !== 20,
    raga: {
      id: 1,
      name: `Raga ${id}`,
      alternateSpelling: '',
      time: '',
      rasa: '',
      tracks: [],
    },
    tape: {
      id: 1,
      eventId: 1,
      tapeId: 1,
      event: {
        id: 1,
        eventName: 'Synthetic event',
        date: 'Synthetic date',
        notes: '',
        locationId: 1,
        location: { id: 1, name: 'Synthetic location' },
        categoryId: 1,
        category: { id: 1, name: 'Synthetic category' },
        tapes: [],
      },
    },
  };
}
const select = (id: number) => getAudio().setSelectedTrack(track(id));
async function selection(id: number) {
  const count = pending.length;
  select(id);
  await until(() => pending.length > count);
  return latestRequest();
}
function allow(
  request: PendingPlaybackRequest,
  id: number,
  life = 7200000,
  overrides: Partial<PlaybackAccess> = {},
) {
  request.resolve(
    response(request.config, {
      trackId: id,
      url: `https://synthetic.example.invalid/${id}.mp3?temporary=1`,
      expiresAt: new Date(Date.now() + life).toISOString(),
      ...overrides,
    }),
  );
}
async function retry() {
  const count = pending.length;
  getAudio().retryPlayback();
  await until(() => pending.length > count);
  return latestRequest();
}
try {
  await until(() => contexts.auth?.status === 'anonymous');
  const first = await selection(10);
  allow(first, 10);
  await until(() => getAudio().isReady);
  check(
    getAudio().trackSrc.includes('/10.mp3'),
    'public selection consumes temporary issuance response',
  );
  check(
    first.config.method === 'post' &&
      first.config.data === '{}' &&
      first.config.withCredentials &&
      first.config.headers.get('X-RVDL-CSRF') === '1',
    'issuance uses empty POST, credentials and CSRF header',
  );
  const oldAudio = getAudio().audioRef.current;
  const slow = await selection(11);
  check(
    oldAudio.paused && !oldAudio.getAttribute('src') && !getAudio().isReady,
    'selection immediately clears prior audio while authorization is pending',
  );
  const current = await selection(12);
  allow(current, 12);
  await until(() => getAudio().trackSrc.includes('/12.mp3'));
  allow(slow, 11);
  await wait();
  check(
    getAudio().trackSrc.includes('/12.mp3'),
    'late access result cannot replace selected track',
  );
  getAudio().setFilteredTracks([track(12), track(30)]);
  getAudio().setCurrentTrackIndex(0);
  await wait();
  let navigationCount = pending.length;
  document.querySelector<HTMLButtonElement>('button[aria-label="Next"]')!.click();
  await until(() => pending.length > navigationCount);
  check(
    getAudio().selectedTrack?.id === 30,
    'Next from index zero resolves the actual filtered track ID',
  );
  allow(latestRequest(), 30);
  await until(() => getAudio().isReady);
  navigationCount = pending.length;
  document.querySelector<HTMLButtonElement>('button[aria-label="Previous"]')!.click();
  await until(() => pending.length > navigationCount);
  check(
    getAudio().selectedTrack?.id === 12,
    'Previous preserves noncontiguous filtered IDs',
  );
  allow(latestRequest(), 12);
  await until(() => getAudio().isReady);
  const denied = await selection(20);
  denied.reject(failure(denied.config, 401));
  await until(() => getAudio().playbackMessage.includes('log in'));
  check(
    !getAudio().trackSrc && !getAudio().isReady && !getAudio().isPlaying,
    'subscriber denial leaves no playable source and shows login guidance',
  );
  const playButton = document.querySelector<HTMLButtonElement>(
    'button[aria-label="Play"]',
  )!;
  playButton.click();
  check(
    playButton.getAttribute('aria-disabled') === 'true' && !getAudio().isPlaying,
    'unavailable Play stays focusable, explains denial and guards activation',
  );
  for (const [status, text] of [
    [403, 'paid subscription'],
    [503, 'unavailable'],
    [500, 'connection'],
  ] as const) {
    const req = await retry();
    req.reject(failure(req.config, status));
    await until(() => getAudio().playbackMessage.includes(text));
    check(
      !getAudio().trackSrc && !getAudio().isReady,
      `HTTP ${status} is visible and never installs audio`,
    );
  }
  const mismatch = await retry();
  allow(mismatch, 99);
  await until(() => getAudio().playbackMessage.includes('connection'));
  check(!getAudio().trackSrc, 'mismatched response track cannot become the media source');
  const invalid = await retry();
  allow(invalid, 20, 7200000, { url: 'http://synthetic.invalid/insecure.mp3' });
  await until(() => getAudio().playbackMessage.includes('connection'));
  check(!getAudio().trackSrc, 'invalid temporary URL rejected');
  const paidReq = await retry();
  allow(paidReq, 20);
  await until(() => getAudio().isReady);
  rejectPlay = true;
  getAudio().playPauseValidation();
  await until(() => getAudio().playbackMessage.includes('could not start'));
  check(!getAudio().isPlaying, 'rejected browser play promise gives recovery guidance');
  rejectPlay = false;
  getAudio().playPauseValidation();
  await until(() => getAudio().isPlaying);
  check(!getAudio().audioRef.current.paused, 'Play uses the issued URL after retry');
  const count = pending.length;
  signedIn = true;
  await getAuth().refreshSession();
  await until(() => pending.length > count);
  check(
    !getAudio().trackSrc && !getAudio().isPlaying,
    'identity change invalidates current playback before reauthorization',
  );
  const logged = latestRequest();
  allow(logged, 20);
  await until(() => getAudio().isReady);
  check(
    getAuth().userData?.subscriptionActive === 'incomplete' && getAudio().isReady,
    'frontend display status is not a playback-authority gate',
  );
  const media = getAudio().audioRef.current as unknown as FakeAudio;
  media.onerror?.();
  await until(() => getAudio().playbackMessage.includes('Unable to play'));
  check(
    !getAudio().trackSrc && !getAudio().isReady,
    'media error clears source and offers retry',
  );
  const expiring = await retry();
  allow(expiring, 20, 150);
  await until(() => getAudio().isReady);
  await until(() => getAudio().playbackMessage.includes('expired'));
  check(
    !getAudio().trackSrc && !getAudio().isReady,
    'local expiry clears URL and offers explicit renewal',
  );
  const resumed = await retry();
  allow(resumed, 20);
  await until(() => getAudio().isReady);
  check(getAudio().trackSrc.includes('/20.mp3'), 'renewal requests fresh issuance');
  const beforeLogout = pending.length;
  await getAuth().logout();
  await until(() => pending.length > beforeLogout);
  check(
    !getAudio().trackSrc && !getAudio().isPlaying,
    'logout clears subscriber audio and requests a new decision',
  );
  const loggedOut = latestRequest();
  loggedOut.reject(failure(loggedOut.config, 401));
  await until(() => getAudio().playbackMessage.includes('log in'));
  check(
    document.body.textContent?.includes('Retry playback'),
    'player renders accessible recovery controls',
  );
  check(
    calls
      .filter((call) => call.url?.includes('/playback-access/'))
      .every((call) => call.data === '{}'),
    'browser never supplies asset or entitlement authority',
  );
  document.getElementById('results')!.textContent = `${lines.join('\n')}\n${
    lines.length
  } checks passed`;
} catch (error) {
  document.getElementById('results')!.textContent =
    lines.join('\n') + '\nFAIL ' + String(error);
}
