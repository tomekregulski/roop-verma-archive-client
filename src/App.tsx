import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Stripe } from './components/Stripe';
import { Checkout } from './components/Checkout/Checkout';
import { Welcome } from './views/Welcome';
import { Signup } from './views/Signup';
import { Register } from './views/Register';
import { ManageAccount } from './views/ManageAccount';
import { CompleteRegistration } from './views/CompleteRegistration';
import { RegistrationProvider } from './context/RegistrationContext';
import { LoginGate } from './views/LoginGate';

export function App() {
    return (
        <>
            <RegistrationProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/complete-registration"
                            element={<CompleteRegistration />}
                        />
                        <Route
                            path="/manage-account"
                            element={<ManageAccount />}
                        />
                        <Route path="/login-gate" element={<LoginGate />} />
                        <Route path="/about" element={<div>About</div>} />
                    </Routes>
                </Router>
            </RegistrationProvider>
        </>
    );
}
