import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import Layout from './Layout';
import Limits from './pages/Limits';
import React from 'react';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, loader: () => redirect('/limits') },
      {
        path: '/:location',
        element: <Limits />,
      },
      {
        path: '/limits/:location',
        element: <Limits />,
      },
    ],
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
