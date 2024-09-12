import { useLoading } from './LoadingProvider.tsx'

export const useFetchWithSpinner = () => {
    const { setLoading } = useLoading()

    return async (url: string, options?: RequestInit) => {
        setLoading(true)
        try {
            const response = await fetch(url, options)
            return await response.json()
        } catch (error) {
            console.error('Fetch error:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }
}