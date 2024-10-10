import { useContext } from 'react'
import { LoadingContext } from './LoadingContext'

const useLoadingIndicator = () => {
    const context = useContext(LoadingContext)
    if (!context) {
        throw new Error('useLoadingIndicator must be used within a LoadingProvider')
    }
    return context
}

export default useLoadingIndicator