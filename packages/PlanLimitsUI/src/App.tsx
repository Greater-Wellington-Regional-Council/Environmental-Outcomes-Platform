import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import Layout from './Layout';
import Limits, { defaultViewLocation } from './pages/Limits';
import React from 'react';
import {
  createLocationString,
  parseLocationString,
} from './pages/Limits/locationString';

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
        loader: ({ params }) => {
          return (
            parseLocationString(params.location) ||
            redirect(`/limits/${createLocationString(defaultViewLocation)}`)
          );
        },
        element: <Limits />,
      },
    ],
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
