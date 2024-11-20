import { CombinedMapRef } from '@components/InteractiveMap/lib/InteractiveMap'
import {createContext, useContext, useState, ReactNode, MutableRefObject} from 'react'
import { ViewLocation } from './types/global'

type MapSnapshotMapRef = MutableRefObject<CombinedMapRef | null>

interface MapSnapshotContextType {
    mapSnapshot: string | null;
    setMapSnapshot: (snapshot: string | null) => void;
    buildPrintSnapshot: (mapRef: MapSnapshotMapRef, location: ViewLocation | null) => string | null;
    updatePrintSnapshot: (mapRef: MapSnapshotMapRef, location: ViewLocation | null) => void;
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

    const buildPrintSnapshot = (mapRef: MapSnapshotMapRef | null, location: ViewLocation | null): string | null => {
        if (!mapRef || !location) return null

        const map = mapRef!.current!.getMap()
        return `${map!.getCanvas().toDataURL('image/png')}?timestamp=${Date.now()}`
    }

    const updatePrintSnapshot = (mapRef: MapSnapshotMapRef | null, location: ViewLocation | null): void => {
        if (!mapRef?.current) {
            setMapSnapshot(null)
            return
        }

        const map = mapRef!.current!.getMap()
            map.once('idle', () => {
            const snapshot = buildPrintSnapshot(mapRef, location)
            setMapSnapshot(snapshot ?? null)
        })
    }

    return (
        <MapSnapshotContext.Provider value={{ mapSnapshot, setMapSnapshot, buildPrintSnapshot, updatePrintSnapshot }}>
            {children}
        </MapSnapshotContext.Provider>
    )
}