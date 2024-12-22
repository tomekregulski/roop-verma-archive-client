import './index.css';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppContainer } from './AppContainer';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { RegistrationProvider } from './context/RegistrationContext';

const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RegistrationProvider>
            <AuthProvider>
              <AudioProvider>
                <AppContainer />
              </AudioProvider>
            </AuthProvider>
          </RegistrationProvider>
        </NotificationProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Elements>
  </React.StrictMode>,
);
