import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TracksContext } from './Context/TracksContext';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';

import AudioView from './Views/AudioView';
import AboutRoopji from './Views/AboutRoopji';
import AboutLibrary from './Views/AboutLibrary';
import Login from './Views/Login';
import Register from './Views/Register';
import Subscribe from './Views/Subscribe';
import UserAccount from './Views/UserAccount';

// import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
// const Navbar = lazy(() => import('./Components/Navbar/Navbar'));
// const AboutRoopji = lazy(() => import('./Views/AboutRoopji'));
// const AboutLibrary = lazy(() => import('./Views/AboutLibrary'));

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  const breakpoint = 650;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return (
    <>
      <Navbar />
      <TracksContext>
        <Routes>
          <Route
            path='/'
            element={<AudioView width={width} breakpoint={breakpoint} />}
          />
          <Route path='roopji' element={<AboutRoopji />} />
          <Route path='library' element={<AboutLibrary />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='subscribe' element={<Subscribe />} />
          <Route path='account' element={<UserAccount />} />
        </Routes>
      </TracksContext>
    </>
  );
}

export default App;
