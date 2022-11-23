import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Limits from './pages/Limits';

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Limits /> },
      {
        path: '/:location',
        element: <Limits />,
      },
    ],
  },
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </React.StrictMode>
);
