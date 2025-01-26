import MapPage from "@pages/MapPage/MapPage.tsx"
import Layout from "@src/Layout.tsx"

import FmuPdfPreview from "@pages/FmuPdfPreview/FmuPdfPreview.tsx"
import loadFmuById from '@pages/loaders/fmuById'
import loadLocation from '@pages/loaders/location'
import { DefaultRedirect } from "./DefaultRedirect"

const routes = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        path: '/',
        element: <DefaultRedirect />,
      },
      {
        path: 'map/:location',
        loader: loadLocation,
        element: <MapPage />,
      },
      {
        path: 'fmu/:id',
        loader: loadFmuById,
        element: <FmuPdfPreview />,
      },
    ],
  },
  {
    path: '*',
    element: <DefaultRedirect />,
  },
]

export default routes