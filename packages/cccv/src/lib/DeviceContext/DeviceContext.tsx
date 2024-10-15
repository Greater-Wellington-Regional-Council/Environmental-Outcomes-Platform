import React, {createContext, useState, useEffect, ReactNode} from 'react'

const DeviceContext = createContext<{ isTouchDevice: boolean | undefined } | undefined>(undefined)

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false)

    useEffect(() => {
        const checkTouchDevice = (): boolean => {
            return "ontouchstart" in window || navigator.maxTouchPoints > 0
        }
        setIsTouchDevice(checkTouchDevice())
    }, [])

    return (
        <DeviceContext.Provider value={{ isTouchDevice: isTouchDevice }}>
            {children}
        </DeviceContext.Provider>
    )
}

export default DeviceContext