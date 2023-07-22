import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import Home from './ui/Home';
// import Error from './ui/Error';
// import Menu, { loader as menuLoader } from './features/menu/Menu';
// import Cart from './features/cart/Cart';
// import CreateOrder, { action as createOrderAction } from './features/order/CreateOrder';
// import Order, { loader as orderLoader } from './features/order/Order';
// import { action as updateOrderAction } from './features/order/UpdateOrder';
import { AppLayout } from './layouts/AppLayout';
import AudioView from './views/AudioView';
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
    ],
  },
]);

export function AppContainer() {
  return <RouterProvider router={router} />;
}
