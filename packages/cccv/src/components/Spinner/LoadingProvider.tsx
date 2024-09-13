import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextProps {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
)
}

export const useLoading = () => {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}