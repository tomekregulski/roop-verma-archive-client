/**
 * Keeps UI identity in sync with the backend's cookie-managed session.
 * Coordinates restoration, proof exchange, logout and session-failure recovery.
 * The backend remains responsible for authentication and authorization.
 */
import axios from 'axios';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { api } from '../api/client';

export const allowedSubscriptionStatuses = ['trialing', 'active', 'incomplete'];
/** Applies the existing subscription display policy; does not enforce media access. */
export const isAllowedSubscriptionStatus = (status: string | null) =>
  status !== null && allowedSubscriptionStatuses.includes(status);

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  stripeId: string;
  subscriptionActive: string | null;
  isAdmin: boolean;
}
interface Identity {
  user: UserData;
  expiresAt: string;
}
type Status = 'loading' | 'authenticated' | 'anonymous' | 'error';
interface AuthState {
  isAuth: boolean;
  userData: UserData | null;
  hasAllowedStatus: boolean;
  status: Status;
  sessionError: string;
  refreshSession: () => Promise<void>;
  verifyProof: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);

/** Provides current server identity and session actions to the component tree. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [sessionError, setSessionError] = useState('');
  // Coordinate async work without rendering: invalidate old results, pause
  // background lookups during session changes, and share an in-flight lookup.
  const generation = useRef(0);
  const changingSession = useRef(false);
  const pending = useRef<Promise<void> | null>(null);

  /** Clears local identity and invalidates older results without revoking the server session. */
  const clearSession = useCallback(() => {
    generation.current += 1;
    pending.current = null;
    setIdentity(null);
    setStatus('anonymous');
    setSessionError('Your session has ended. Please log in again.');
  }, []);

  /** Restores current identity, sharing overlapping lookups and handling lookup errors. */
  const refreshSession = useCallback(() => {
    if (changingSession.current) return Promise.resolve();
    if (pending.current) return pending.current;
    const revision = generation.current;
    const request = (async () => {
      try {
        const { data } = await api.get<Identity>('/auth/session');
        // A later login, logout or session failure takes precedence over this result.
        if (revision !== generation.current) return;
        setIdentity(data);
        setStatus('authenticated');
        setSessionError('');
      } catch (error) {
        if (revision !== generation.current) return;
        setIdentity(null);
        // An anonymous visitor is expected; a failed lookup needs retry guidance.
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setStatus('anonymous');
          setSessionError('');
        } else {
          setStatus('error');
          setSessionError(
            'Unable to check your session. Check your connection and retry.',
          );
        }
      }
    })();
    pending.current = request;
    void request.finally(() => {
      // An older lookup must not clear the reference to a newer request.
      if (pending.current === request) pending.current = null;
    });
    return request;
  }, []);

  /** Exchanges an email proof, then confirms cookie-backed identity before updating UI. */
  const verifyProof = useCallback(async (token: string) => {
    // Pause background refreshes and prevent their older results from winning.
    changingSession.current = true;
    const revision = ++generation.current;
    pending.current = null;
    try {
      await api.post('/auth/verify', { token });
      // Confirm the browser accepted the cookie before presenting a logged-in UI.
      const { data } = await api.get<Identity>('/auth/session');
      if (revision !== generation.current) throw new Error('Session changed');
      setIdentity(data);
      setStatus('authenticated');
      setSessionError('');
    } catch (error) {
      if (revision === generation.current) {
        setIdentity(null);
        setStatus('anonymous');
      }
      // LoginGate owns link-error messaging. Avoid logging proof-bearing Axios errors.
      throw error;
    } finally {
      changingSession.current = false;
    }
  }, []);

  /** Requests server revocation before clearing local identity; failures reach the caller. */
  const logout = useCallback(async () => {
    changingSession.current = true;
    ++generation.current;
    pending.current = null;
    try {
      await api.post('/auth/logout');
      clearSession();
      setSessionError('');
    } finally {
      changingSession.current = false;
    }
  }, [clearSession]);

  // Keep protected-request 401 handling scoped to this provider's lifetime.
  useEffect(() => {
    let active = true;
    const interceptorId = api.interceptors.response.use(undefined, (error) => {
      // Verification and restoration handle their expected 401 responses directly.
      const expected401 = ['/auth/verify', '/auth/session'].includes(error.config?.url);
      if (active && error.response?.status === 401 && !expected401) {
        clearSession();
      }
      // Preserve rejection so the requesting screen can also handle the failure.
      return Promise.reject(error);
    });

    return () => {
      // Eject affects future requests; also ignore failures already in flight.
      active = false;
      api.interceptors.response.eject(interceptorId);
    };
  }, [clearSession]);

  // Restore on mount and recheck server state when the user returns to the app.
  useEffect(() => {
    void refreshSession();
    /** Rechecks identity when the browser window regains focus. */
    const onFocus = () => {
      void refreshSession();
    };
    /** Rechecks only when a previously hidden tab becomes visible. */
    const onVisible = () => {
      if (document.visibilityState === 'visible') onFocus();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refreshSession]);

  const expiresAt = identity?.expiresAt;
  // Recheck at the server-provided absolute expiry; clamp to the browser timer limit.
  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setTimeout(() => {
      void refreshSession();
    }, Math.max(0, Math.min(Date.parse(expiresAt) - Date.now(), 2147483647)));
    return () => window.clearTimeout(timer);
  }, [expiresAt, refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        status,
        sessionError,
        refreshSession,
        verifyProof,
        logout,
        isAuth: status === 'authenticated',
        userData: identity?.user ?? null,
        hasAllowedStatus: isAllowedSubscriptionStatus(
          identity?.user.subscriptionActive ?? null,
        ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
/** Reads auth state and actions, requiring an enclosing AuthProvider. */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider required');
  return context;
}
