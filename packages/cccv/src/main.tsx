import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom'
import routes from '@src/routes.tsx'
import {ErrorProvider} from "@components/ErrorContext/ErrorProvider.tsx";

import {ThemeProvider} from "@material-tailwind/react";

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const router = createBrowserRouter(routes as RouteObject[])

export function App() {
  return <RouterProvider router={router}/>
}

createRoot(rootElement).render(
  <StrictMode>
      <ErrorProvider>
        <ThemeProvider>
          <App/>
        </ThemeProvider>
      </ErrorProvider>
  </StrictMode>
)