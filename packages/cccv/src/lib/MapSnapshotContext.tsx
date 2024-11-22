import { CombinedMapRef } from '@components/InteractiveMap/lib/InteractiveMap'
import {createContext, useContext, useState, ReactNode, MutableRefObject} from 'react'
import { IMViewLocation } from '@shared/types/global'

type MapSnapshotMapRef = MutableRefObject<CombinedMapRef | null>

interface MapSnapshotContextType {
    mapSnapshot: string | null;
    takeMapSnapshot: (mapRef: MapSnapshotMapRef, location: IMViewLocation | null) => void;
}

const MapSnapshotContext = createContext<MapSnapshotContextType | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useMapSnapshot = () => {
    const context = useContext(MapSnapshotContext)

    if (!context) {
        throw new Error("useMapSnapshot must be used within a MapSnapshotProvider")
    }

    return context
}

export const MapSnapshotProvider = ({ children }: { children: ReactNode }) => {
    const [mapSnapshot, setMapSnapshot] = useState<string | null>(null)

    const debugSetMapSnapshot = (value: string | null) => {
        // console.log("setMapSnapshot called with:", value)
        setMapSnapshot(value)
    }

    const takeMapSnapshot = (mapRef: MapSnapshotMapRef | null): void => {
        if (!mapRef?.current) {
            console.warn("Map reference is null when attempting to take a snapshot.")
            debugSetMapSnapshot(null)
            return
        }

        const map = mapRef.current.getMap()
        map.once('idle', () => {
            try {
                const snapshot = `${map.getCanvas().toDataURL('image/png')}?timestamp=${Date.now()}`
                debugSetMapSnapshot(snapshot || null)
            } catch (error) {
                console.error("Error taking map snapshot:", error)
                debugSetMapSnapshot(null)
            }
        })
    }

    return (
        <MapSnapshotContext.Provider value={{ mapSnapshot, takeMapSnapshot }}>
            {children}
        </MapSnapshotContext.Provider>
    )
}