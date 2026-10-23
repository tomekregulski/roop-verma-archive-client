/**
 * Captures email-link proofs in memory and removes them from the browser URL.
 * Startup and cleanup are explicit; the backend handles proof validation.
 */
export const LOGIN_PROOF_EVENT = 'rvdl-login-proof';
let proof: string | null = null;
let listening = false;

function captureProof() {
  if (window.location.pathname !== '/login-gate') return;
  proof = new URLSearchParams(window.location.hash.slice(1)).get('token');
  window.history.replaceState(window.history.state, '', window.location.pathname);
}

// Another email link may change only the fragment in an already-open gate tab.
function handleHashChange() {
  if (window.location.pathname !== '/login-gate') return;
  captureProof();
  // Notify LoginGate without putting the credential in the event.
  window.dispatchEvent(new Event(LOGIN_PROOF_EVENT));
}

function stopLoginProofCapture() {
  window.removeEventListener('hashchange', handleHashChange);
  listening = false;
  proof = null;
}

/** Captures the initial proof, starts listening once, and returns a cleanup function. */
export function initializeLoginProof() {
  if (!listening) {
    captureProof();
    window.addEventListener('hashchange', handleHashChange);
    listening = true;
  }
  return stopLoginProofCapture;
}

/** Returns the captured proof once and clears the module's reference to it. */
export function takeLoginProof() {
  const value = proof;
  proof = null;
  return value;
}
