import {useNavigate} from 'react-router-dom';
import loadLocation from "@loaders/location.ts";
import MapPage from "@pages/MapPage/MapPage.tsx";
import Layout from "@src/Layout.tsx";
import {useEffect} from "react";
import loadFmuById from "@loaders/fmuById.ts";
import FmuPdfPreview from "@pages/FmuPdfPreview/FmuPdfPreview.tsx";

export const DefaultRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('map/@-41,175.35,8z', {replace: true});
  }, []);

  return null;
}

const routes = [
  {
    element: <Layout/>,
    children: [
      {
        index: true,
        element: <DefaultRedirect/>
      },
      {
        path: 'map/:location',
        loader: loadLocation,
        element: <MapPage/>
      },
      {
        path: 'fmu/:id',
        loader: loadFmuById,
        element: <FmuPdfPreview />
      }
    ]
  },
  {
    path: '*',
    index: true,
    element: <DefaultRedirect/>
  }
]

export default routes;