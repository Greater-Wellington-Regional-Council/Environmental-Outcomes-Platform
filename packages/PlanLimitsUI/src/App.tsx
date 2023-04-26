import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  Navigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import { loader, defaultAppPath } from './lib/loader';
import Layout from './Layout';
import Limits from './pages/Limits';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      // This redirects "/" and "/limits" to a default location
      {
        path: '/limits?',
        element: <Navigate replace to={defaultAppPath} />,
      },
      {
        path: '/limits/:council/:location?',
        loader,
        element: <Limits />,
      },
    ],
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

function ErrorPage() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const errorMessage = is404
    ? 'The page you requested cannot be found.'
    : 'The page you requested could not be loaded.';

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <main className="text-center">
        <h1 className="text-xl font-light mb-4">{errorMessage}</h1>
        You can try navigating back to the{' '}
        <a className="underline" href="/">
          home page
        </a>
      </main>
    </div>
  );
}
