import Layout from './Layout.tsx'
import { Navigate } from 'react-router-dom'
import MapPage from "@pages/MapPage.tsx";
import ErrorPage from "@pages/ErrorPage.tsx";
import loadLocation from '@loaders/location'

const defaultAppPath = 'map/@-41,175.35,8z'

const routes  = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate replace to={defaultAppPath} />
      },
      {
        path: 'map/:location',
        loader: loadLocation,
        element: <MapPage />
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />,
    loader: () => {
      return { status: 404, message: 'Page Not Found' }
    }
  }
]

export default routes;
