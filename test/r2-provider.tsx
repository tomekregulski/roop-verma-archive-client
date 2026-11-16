/** Local test entry only: no media or API doubles and no temporary URL display/storage. */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { api, legacyKey } from '../src/api/client';
import { AudioPlayer } from '../src/components/AudioPlayerComponents/AudioPlayer/AudioPlayer';
import { AudioProvider, useAudioContext } from '../src/context/AudioContext';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import type { Track } from '../src/context/trackTypes';
import { requestPlaybackAccess } from '../src/util/playbackAccess';

/** Runs only the fixed loopback fixture controls, never a production account action. */
async function control(action: string, params = '') {
  const result = await fetch(`/__sample?action=${action}${params}`, {
    method: action === 'state' ? 'GET' : 'POST',
    headers: { 'X-RVDL-Test': '1' },
  });
  if (!result.ok) throw Error('Local fixture action failed');
  return action === 'state' ? result.json() : null;
}

/** Presents fixture controls around the unchanged production player. */
function Sample() {
  const audio = useAudioContext();
  const auth = useAuthContext();
  const [result, setResult] = useState('');
  const [position, setPosition] = useState(0);
  const [nativeState, setNativeState] = useState('');

  /** Selects the exact synthetic Track primary ID through the real catalog endpoint. */
  async function select() {
    const response = await api.get<Track[]>(`/track/${legacyKey}`);
    const sample = response.data.find((track) => track.id === 10);
    if (!sample) throw Error('Synthetic track is missing');
    audio.setFilteredTracks([sample]);
    audio.setCurrentTrackIndex(0);
    audio.setSelectedTrack(sample);
  }

  /** Uses real cookie/session verification against one fixed synthetic actor. */
  async function login(actor: string) {
    audio.setSelectedTrack(null);
    await control('login', `&actor=${actor}`);
    await auth.refreshSession();
  }

  /** Shows sanitized evidence and avoids displaying request/media locators. */
  async function state() {
    setResult(JSON.stringify(await control('state')));
  }

  /** Verifies browser CORS/ranges directly against R2 without displaying the capability. */
  async function range() {
    try {
      const access = await requestPlaybackAccess(10, new AbortController().signal);
      const response = await fetch(access.url, {
        headers: { Range: 'bytes=100000-101023' },
      });
      const bytes = await response.arrayBuffer();
      setResult(
        JSON.stringify({
          status: response.status,
          bytes: bytes.byteLength,
          contentRange: response.headers.get('content-range'),
        }),
      );
    } catch {
      setResult('Browser range check failed; no provider details recorded.');
    }
  }

  useEffect(() => {
    // Silence the generated tone without replacing native playback or decoding.
    audio.audioRef.current.muted = true;
  }, [audio.trackSrc]);

  useEffect(() => {
    /** Samples native media state without retaining its temporary source URL. */
    function sampleNativeState() {
      const media = audio.audioRef.current;
      setPosition(media.currentTime);
      setNativeState(
        JSON.stringify({
          paused: media.paused,
          ended: media.ended,
          readyState: media.readyState,
          errorCode: media.error?.code || null,
          buffered: Array.from({ length: media.buffered.length }, (_, index) => [
            media.buffered.start(index),
            media.buffered.end(index),
          ]),
        }),
      );
    }

    const timer = window.setInterval(sampleNativeState, 1000);
    return () => window.clearInterval(timer);
  }, [audio.audioRef]);

  return (
    <>
      <p>
        Session: {auth.status}; synthetic account: {auth.userData?.id || 'none'}
      </p>
      <button onClick={() => void login('listener')}>Sign in authorized listener</button>{' '}
      <button onClick={() => void login('unsubscribed')}>
        Sign in unsubscribed account
      </button>{' '}
      <button onClick={() => void login('other')}>Sign in other account</button>{' '}
      <button onClick={() => void auth.logout()}>Log out</button>
      <p>
        <button onClick={() => void control('public', '&value=true')}>
          Use public sample
        </button>{' '}
        <button onClick={() => void control('public', '&value=false')}>
          Use protected sample
        </button>{' '}
        <button onClick={() => void select()}>Select sample</button>{' '}
        <button onClick={() => audio.setSelectedTrack(null)}>Clear selection</button>
      </p>
      <p>
        <button onClick={() => void control('past-due')}>Set synthetic past_due</button>{' '}
        <button onClick={() => void control('cancel')}>
          Cancel synthetic subscription
        </button>{' '}
        <button onClick={() => void control('revoke')}>Revoke synthetic sessions</button>{' '}
        <button onClick={() => void state()}>Read sanitized evidence</button>
        <button onClick={() => void range()}>Check browser range</button>
      </p>
      <p>
        Native position: <output id="native-position">{position.toFixed(1)}</output>{' '}
        seconds; duration: {audio.duration.toFixed(1)}; playing: {String(audio.isPlaying)}
      </p>
      <pre id="native-state">{nativeState}</pre>
      <pre id="evidence">{result}</pre>
      {audio.selectedTrack && <AudioPlayer />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AudioProvider>
      <Sample />
    </AudioProvider>
  </AuthProvider>,
);
