import React, { createContext, useState } from 'react'

interface LoadingContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}
