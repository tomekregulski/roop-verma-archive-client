import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RegistrationProvider>
      <AuthProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </AuthProvider>
    </RegistrationProvider>
  </React.StrictMode>,
);
