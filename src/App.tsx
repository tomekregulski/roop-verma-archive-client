import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Welcome } from './views/Welcome';
import { Signup } from './views/Signup';
import { Register } from './views/Register';
import { ManageAccount } from './views/ManageAccount';
import { CompleteRegistration } from './views/CompleteRegistration';
import { LoginGate } from './views/LoginGate';
import Navbar from './components/Navbar/Navbar';
import { UserAccount } from './views/UserAccount';
import AboutRoopji from './views/AboutRoopji';
// import { useState } from 'react';
import { AudioProvider } from './context/AudioContext';

export function App() {
    // const [width, setWidth] = useState(window.innerWidth);
    // const breakpoint = 850;

    return (
        <div id="modal-root">
            <Router>
                <Navbar />
                <AudioProvider>
                    <Routes>
                        <Route path="/" element={<Welcome />} />
                        <Route
                            path="/audio"
                            element={<div>Audio Library</div>}
                        />
                        {/* <Route path='audio' element={<AudioView width={width} breakpoint={breakpoint} />}
                        /> */}
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
                        <Route path="/roopji" element={<AboutRoopji />} />
                        {/* <Route path='library' element={<AboutLibrary />} /> */}
                        <Route
                            path="/library"
                            element={<div>About the Library and Help</div>}
                        />
                        <Route path="/account" element={<UserAccount />} />
                    </Routes>
                </AudioProvider>
            </Router>
        </div>
    );
}
