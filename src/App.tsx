import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Stripe } from './components/Stripe';
import { ValidateEmailToken } from './components/ValidateEmailToken';
import { Checkout } from './components/Checkout/Checkout';
import { Welcome } from './views/Welcome';
import { Signup } from './views/Signup';
import { Register } from './views/Register';
import { ManageAccount } from './views/ManageAccount';
import { CompleteRegistration } from './views/CompleteRegistration';
import { RegistrationProvider } from './context/RegistrationContext';
// import { FetchTest } from './components/FetchTest';
// import tw from 'twin.macro';

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
                        {/* <Route path="/" element={<Checkout />} /> */}
                        {/* <Route path="/" element={<FetchTest />} /> */}
                        <Route path="/about" element={<div>About</div>} />
                        <Route
                            path="/validate-email-token"
                            element={<ValidateEmailToken />}
                        />
                    </Routes>
                </Router>
            </RegistrationProvider>
        </>
    );
}
