// Normal application routes with test-only hosted navigation and playback controls. Real fetch/cookies/HTTP/PostgreSQL, fake hosted UI/media.
import '../src/startup';
import '../src/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { AppContainer } from '../src/AppContainer';
import { Button } from '../src/components/Button/Button';
import { AudioProvider } from '../src/context/AudioContext';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { playbackError, requestPlaybackAccess } from '../src/util/playbackAccess';
// Replaces only navigation to the fake hosted provider, never application API calls.
function fakeHostedRedirect(value: string) {
  const url = new URL(value);
  window.location.assign(
    url.hostname === 'billing.stripe.com'
      ? 'http://127.0.0.1:8091/portal'
      : 'http://127.0.0.1:8091/checkout?session=' +
          encodeURIComponent(url.pathname.split('/').at(-1) || ''),
  );
}
function FixtureShell() {
  const { userData, logout } = useAuthContext();
  const [message, setMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  async function play() {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    try {
      await requestPlaybackAccess(20, controller.signal);
      setMessage('Paid playback authorized with fake media delivery.');
    } catch (error) {
      if (!controller.signal.aborted) setMessage(playbackError(error));
    }
  }
  return (
    <main>
      <p>
        Normal application fixture — disposable PostgreSQL; fake Stripe, mail and media.
      </p>
      <nav>
        <a href="/signup">Sign up</a> · <a href="/manage-account">Account</a> ·{' '}
        <a href="http://127.0.0.1:8091/open-latest">Open captured test email</a>
      </nav>
      {userData && (
        <Button
          name="Log out"
          callback={() => {
            void logout();
          }}
        />
      )}
      <a href="/owner/deletions">Owner deletion review</a>
      <AppContainer redirect={fakeHostedRedirect} />
      <Button
        name="Check paid playback"
        callback={() => {
          void play();
        }}
      />
      <p role="status">{message}</p>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <NotificationProvider>
        <AuthProvider>
          <AudioProvider>
            <FixtureShell />
          </AudioProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
