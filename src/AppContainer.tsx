import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import AboutLibrary from './views/AboutLibrary';
// import Error from './ui/Error';
import AboutRoopji from './views/AboutRoopji';
import AudioView from './views/AudioView';
import { CompleteRegistration } from './views/CompleteRegistration';
import { LoginGate } from './views/LoginGate';
import { ManageAccount } from './views/ManageAccount';
import { Signup } from './views/Signup';
import { Testimonials } from './views/testimonials/Testimonials';
import { TestimonialTextFull } from './views/testimonials/TestimonialTextFull';
import { Welcome } from './views/Welcome';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    // errorElement: <Error />,

    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '/audio',
        element: <AudioView />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/complete-registration',
        element: <CompleteRegistration />,
      },
      {
        path: '/manage-account',
        element: <ManageAccount />,
      },
      {
        path: '/login-gate',
        element: <LoginGate />,
      },
      {
        path: '/roopji',
        element: <AboutRoopji />,
      },
      {
        path: '/library',
        element: <AboutLibrary />,
      },
      {
        path: '/testimonials',
        element: <Testimonials />,
      },
      {
        path: '/testimonials/:id',
        element: <TestimonialTextFull />,
      },
    ],
  },
]);

export function AppContainer() {
  return <RouterProvider router={router} />;
}
