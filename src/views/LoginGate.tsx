import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { LOGIN_PROOF_EVENT, takeLoginProof } from '../util/loginProof';

export function LoginGate() {
  const { verifyProof } = useAuthContext();
  const navigate = useNavigate();
  const exchange = useRef<Promise<void> | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const run = () => {
      const token = takeLoginProof();
      if (token) exchange.current = verifyProof(token);
      if (!exchange.current)
        exchange.current = Promise.reject(new Error('Missing proof'));
      const current = exchange.current;
      setFailed(false);
      void current.then(
        () => {
          if (active && exchange.current === current)
            navigate('/manage-account', { replace: true });
        },
        () => {
          if (active && exchange.current === current) setFailed(true);
        },
      );
    };
    run();
    window.addEventListener(LOGIN_PROOF_EVENT, run);
    return () => {
      active = false;
      window.removeEventListener(LOGIN_PROOF_EVENT, run);
    };
  }, [navigate, verifyProof]);
  
  return failed ? (
    <div role="alert">
      This login link is invalid, expired, already used, or could not establish a browser
      session. <Link to="/">Request a new link</Link>. Check your connection and allow
      cookies for this site. <Link to="/library">Get help</Link> if it continues.
    </div>
  ) : (
    <p role="status">Verifying your login link…</p>
  );
}
