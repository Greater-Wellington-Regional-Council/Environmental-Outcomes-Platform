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

    const takeMapSnapshot = (mapRef: MapSnapshotMapRef | null): void => {
        if (!mapRef?.current) {
            setMapSnapshot(null)
            return
        }

        const map = mapRef!.current!.getMap()
            map.once('idle', () => {
            const snapshot = `${map!.getCanvas().toDataURL('image/png')}?timestamp=${Date.now()}`
            setMapSnapshot(snapshot ?? null)
        })
    }

    return (
        <MapSnapshotContext.Provider value={{ mapSnapshot, takeMapSnapshot }}>
            {children}
        </MapSnapshotContext.Provider>
    )
}