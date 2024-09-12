import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom'
import routes from '@src/routes.tsx'
import {ErrorProvider} from "@components/ErrorContext/ErrorProvider.tsx"
import {QueryClient, QueryClientProvider} from 'react-query'

import {ThemeProvider} from "@material-tailwind/react"
import ErrorBoundary from "@components/ErrorBoundary.tsx"

import {MapSnapshotProvider} from "@lib/MapSnapshotContext.tsx"
import {LoadingProvider} from "@components/LoadingIndicator/LoadingContext.tsx"
import {LoadingIndicatorOverlay} from "@components/LoadingIndicator/LoadingIndicatorOverlay.tsx"
import useLoadingIndicator from "@components/LoadingIndicator/useLoadingIndicator.tsx"

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const router = createBrowserRouter(routes as RouteObject[])

const LoadingOverlayContainer: React.FC = () => {
    const { loading } = useLoadingIndicator()
    return <>{loading && <LoadingIndicatorOverlay />}</>
}

export default LoadingOverlayContainer;
export function App() {

    return (
        <StrictMode>
            <ErrorProvider>
                <ThemeProvider>
                    <LoadingProvider>
                        <QueryClientProvider client={queryClient}>
                            <ErrorBoundary>
                                <MapSnapshotProvider>
                                    <LoadingOverlayContainer/>
                                    <RouterProvider router={router}/>
                                </MapSnapshotProvider>
                            </ErrorBoundary>
                        </QueryClientProvider>
                    </LoadingProvider>
                </ThemeProvider>
            </ErrorProvider>
        </StrictMode>
    )
}

const queryClient = new QueryClient()

createRoot(rootElement).render(<App/>)
