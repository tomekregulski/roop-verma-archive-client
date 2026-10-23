import { initializeLoginProof } from './util/loginProof';

// Import this first in main.tsx to scrub proofs before router and SDK initialization.
const stopLoginProofCapture = initializeLoginProof();
if (import.meta.hot) import.meta.hot.dispose(stopLoginProofCapture);
