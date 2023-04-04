import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import Layout from './Layout';
import Limits, { defaultViewLocation, loader } from './pages/Limits';
import { createLocationString } from './pages/Limits/locationString';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        loader: () =>
          redirect(`/limits/${createLocationString(defaultViewLocation)}`),
      },
      {
        path: '/limits',
        loader: () =>
          redirect(`/limits/${createLocationString(defaultViewLocation)}`),
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
