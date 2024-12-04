import {useContext} from "react"
import DeviceContext from "@lib/DeviceContext/DeviceContext.tsx"

export const useDevice = (): { isTouchDevice: boolean | undefined } => {
    const context = useContext(DeviceContext)
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider')
    }
    return context
}