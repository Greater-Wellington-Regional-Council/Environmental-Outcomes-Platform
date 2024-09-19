import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createBrowserRouter, RouteObject, RouterProvider} from 'react-router-dom'
import routes from '@src/routes'
import {ErrorProvider} from "@components/ErrorContext/ErrorProvider"
import {QueryClient, QueryClientProvider} from 'react-query'

import {ThemeProvider} from "@material-tailwind/react"
import ErrorBoundary from "@components/ErrorBoundary"

import {MapSnapshotProvider} from "@lib/MapSnapshotContext"
import {LoadingProvider} from "@components/LoadingIndicator/LoadingContext"
import useLoadingIndicator from "@components/LoadingIndicator/useLoadingIndicator.tsx";
import {LoadingIndicatorOverlay} from "@components/LoadingIndicator/LoadingIndicatorOverlay.tsx";

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
                <ErrorBoundary>
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
                </ErrorBoundary>
            </ErrorProvider>
        </StrictMode>
    )
}

const queryClient = new QueryClient()

createRoot(rootElement).render(<App/>)
