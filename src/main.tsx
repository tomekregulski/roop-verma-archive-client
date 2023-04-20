import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RegistrationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </RegistrationProvider>
    </React.StrictMode>
);
