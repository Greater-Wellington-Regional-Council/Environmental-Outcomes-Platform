import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Layout from './Layout';
import Limits, { defaultPath, loader } from './pages/Limits';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      // This redirects "/" and "/limits" to a default location
      {
        path: '/limits?',
        element: <Navigate replace to={defaultPath} />,
      },
      {
        path: '/limits/:location',
        loader,
        element: <Limits />,
      },
    ],
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
