/**
 * Shared backend client with cookie credentials, CSRF headers and a request timeout.
 * Provides controlled UI error messages; AuthProvider owns session-failure handling.
 */
import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_ORIGIN}/api/v1`,
  withCredentials: true,
  timeout: 15000,
  headers: { 'X-RVDL-CSRF': '1' },
});

/** Returns UI guidance for recognized HTTP errors, or the supplied fallback. */
export function requestError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      // Cross-origin Retry-After may be unavailable unless explicitly exposed by CORS.
      const seconds = Number(error.response.headers['retry-after']);
      return Number.isFinite(seconds) && seconds > 0
        ? `Too many attempts. Wait ${seconds} seconds before trying again.`
        : 'Too many attempts. Wait 15 minutes before requesting another login link (up to an hour for registration).';
    }
    if (error.response?.status === 401)
      return 'Your session has ended. Please log in again.';
    if (error.response?.status === 403)
      return 'This request is not allowed. Refresh your account and try again.';
  }
  return fallback;
}
export const legacyKey = encodeURIComponent(import.meta.env.VITE_API_KEY);
