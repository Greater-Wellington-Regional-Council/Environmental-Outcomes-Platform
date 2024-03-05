import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from '@src/routes.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const router = createBrowserRouter(routes)

export function App() {
    return <RouterProvider router={router} />
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
)