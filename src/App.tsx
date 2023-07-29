// import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Navbar } from './components/Navbar/Navbar';
// import { useState } from 'react';
// import { AudioProvider } from './context/AudioContext';
import AboutLibrary from './views/AboutLibrary';
import AboutRoopji from './views/AboutRoopji';
import AudioView from './views/AudioView';
import { CompleteRegistration } from './views/CompleteRegistration';
import { LoginGate } from './views/LoginGate';
import { ManageAccount } from './views/ManageAccount';
import { Signup } from './views/Signup';
import { Testimonials } from './views/testimonials/Testimonials';
import { TestimonialTextFull } from './views/testimonials/TestimonialTextFull';
import { Welcome } from './views/Welcome';

export function App() {
  // const [width, setWidth] = useState(window.innerWidth);
  // const breakpoint = 850;

  // useEffect(() => {
  //   const handleResizeWindow = () => setWidth(window.innerWidth);
  //   window.addEventListener('resize', handleResizeWindow);
  //   return () => {
  //     window.removeEventListener('resize', handleResizeWindow);
  //   };
  // }, []);

  return (
    <div id="modal-root">
      <Router>
        <Navbar />
        {/* <AudioProvider> */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/audio"
            element={<AudioView /*width={width} breakpoint={breakpoint}*/ />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complete-registration" element={<CompleteRegistration />} />
          <Route path="/manage-account" element={<ManageAccount />} />
          <Route path="/login-gate" element={<LoginGate />} />
          <Route path="/roopji" element={<AboutRoopji />} />
          {/* <Route path='library' element={<AboutLibrary />} /> */}
          <Route path="/library" element={<AboutLibrary />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonials/:id" element={<TestimonialTextFull />} />
          <Route path="/manage-account" element={<ManageAccount />} />
        </Routes>
        {/* </AudioProvider> */}
      </Router>
    </div>
  );
}
