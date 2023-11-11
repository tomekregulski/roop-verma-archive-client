import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import AboutLibrary from './views/AboutLibrary';
// import Error from './ui/Error';
import { AboutRoopji } from './views/AboutRoopji';
import AudioView from './views/AudioView';
import { CompleteRegistration } from './views/CompleteRegistration';
import { LoginGate } from './views/LoginGate';
import { ManageAccount } from './views/ManageAccount';
import { Signup } from './views/Signup';
import { Tributes } from './views/tributes/Tributes';
import { TributeTextFull } from './views/tributes/TributeTextFull';
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
        path: '/tributes',
        element: <Tributes />,
      },
      {
        path: '/tributes/:id',
        element: <TributeTextFull />,
      },
    ],
  },
]);

export function AppContainer() {
  return <RouterProvider router={router} />;
}
