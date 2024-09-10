import { createContext, useContext, useState, ReactNode } from 'react';

interface MapSnapshotContextType {
    mapSnapshot: string | null;
    setMapSnapshot: (snapshot: string | null) => void;
}

const MapSnapshotContext = createContext<MapSnapshotContextType | null>(null);

export const useMapSnapshot = () => {
    const context = useContext(MapSnapshotContext);
    if (!context) {
        throw new Error("useMapSnapshot must be used within a MapSnapshotProvider");
    }
    return context;
};

export const MapSnapshotProvider = ({ children }: { children: ReactNode }) => {
    const [mapSnapshot, setMapSnapshot] = useState<string | null>(null);

    return (
        <MapSnapshotContext.Provider value={{ mapSnapshot, setMapSnapshot }}>
            {children}
        </MapSnapshotContext.Provider>
    );
};