import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom'
import routes from '@src/routes.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ErrorProvider} from "@components/ErrorContext/ErrorProvider.tsx";

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const router = createBrowserRouter(routes as RouteObject[])

export function App() {
    return <RouterProvider router={router} />
}

createRoot(rootElement).render(
      <QueryClientProvider client={queryClient}>
        <StrictMode>
            <ErrorProvider>
              <App />
            </ErrorProvider>
        </StrictMode>
      </QueryClientProvider>
)