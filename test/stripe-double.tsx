// Browser harness only: never included by the application's normal Vite config.
import type { ReactNode } from 'react';
export function Elements({ children }: { children: ReactNode }) { return <>{children}</>; }
export function useStripe() {
  return { redirectToCheckout: async ({ sessionId }: { sessionId: string }) => {
    window.location.assign(`http://127.0.0.1:8091/checkout?session=${encodeURIComponent(sessionId)}`);
    return {};
  } };
}
