// Test-only route composition. Real fetch/cookies/HTTP/PostgreSQL, fake hosted UI/media.
import '../src/startup';
import '../src/index.css';

import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { Button } from '../src/components/Button/Button';
import { AuthProvider, useAuthContext } from '../src/context/AuthContext';
import { playbackError, requestPlaybackAccess } from '../src/util/playbackAccess';
import { PurchaseReturn } from '../src/views/CompleteRegistration';
import { Login } from '../src/views/Login';
import { LoginGate } from '../src/views/LoginGate';
import { PurchaseAccount } from '../src/views/ManageAccount';
import { OwnerDeletions } from '../src/views/OwnerDeletions';
import { Signup } from '../src/views/Signup';

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
        Isolated purchase fixture — disposable PostgreSQL; fake Stripe, mail and media.
      </p>
      <nav>
        <Link to="/signup">Sign up</Link> · <Link to="/manage-account">Account</Link> ·{' '}
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
      <Link to="/owner/deletions">Owner deletion review</Link>
      <Routes>
        <Route path="/owner/deletions" element={<OwnerDeletions />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup accountReady />} />
        <Route path="/login-gate" element={<LoginGate />} />
        <Route
          path="/manage-account"
          element={<PurchaseAccount redirect={fakeHostedRedirect} />}
        />
        <Route
          path="/complete-registration"
          element={<PurchaseReturn redirect={fakeHostedRedirect} />}
        />
        <Route
          path="/library"
          element={
            <p>
              Contact synthetic support with your purchase reference. Do not start another
              purchase while unresolved.
            </p>
          }
        />
      </Routes>
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
    <BrowserRouter>
      <AuthProvider>
        <FixtureShell />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
