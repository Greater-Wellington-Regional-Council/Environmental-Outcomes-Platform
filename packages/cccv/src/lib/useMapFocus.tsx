import { MutableRefObject, useEffect, useState } from 'react'
import { CombinedMapRef } from "@components/InteractiveMap/lib/InteractiveMap"
import { IMViewLocation } from "@shared/types/global"
import zoomIntoFeatures from "@lib/zoomIntoFeatures.ts"
import mapboxgl, { Marker } from "mapbox-gl"

const useMapFocus = (
    mapRef: MutableRefObject<CombinedMapRef | null>,
    locationInFocus?: IMViewLocation | null
) => {
    const [focusPin, setFocusPin] = useState<Marker | null>(null)
    const [mapSnapshot, setMapSnapshot] = useState<string | null>(null)
    const [creatingMapSnapshot, setCreatingMapSnapshot] = useState(false)

    useEffect(() => {
        placeFocusPin(locationInFocus)
        zoomIntoFeatures(mapRef, locationInFocus)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef, locationInFocus])

    const placeFocusPin = (location?: IMViewLocation | null) => {
        if (!location || !mapRef.current) {
            focusPin?.remove()
            setFocusPin(null)
            return
        }
        const isValidLngLat = ([lng, lat]: [number | undefined, number | undefined]) =>
            lng !== undefined && lat !== undefined && !(Number.isNaN(lng)) && !(Number.isNaN(lat)) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90

        if (!mapRef.current || !isValidLngLat([location.longitude, location.latitude])) {
            focusPin?.remove()
            setFocusPin(null)
            return
        }

        const pin = (focusPin ?? new mapboxgl.Marker()).setLngLat([location.longitude!, location.latitude!]).addTo(mapRef.current.getMap())
        if (location.description) {
            pin.setPopup(new mapboxgl.Popup({ closeButton: false }).setLngLat([location.longitude!, location.latitude!]).setHTML(location.description || '<></>'))
        }
        setFocusPin(pin)
    }

    const takeMapSnapshot = (mapRef: MutableRefObject<CombinedMapRef | null>): void => {
        if (!mapRef?.current) {
            console.warn("Map reference is null when attempting to take a snapshot.")
            setMapSnapshot(null)
            return
        }

        setCreatingMapSnapshot(true)

        const map = mapRef.current.getMap()

        map.once('idle', () => {
            try {
                const snapshot = `${map.getCanvas().toDataURL('image/png')}?timestamp=${Date.now()}`
                setMapSnapshot(snapshot || null)
            } catch (error) {
                console.error("Error taking map snapshot:", error)
                setMapSnapshot(null)
            } finally {
                setCreatingMapSnapshot(false)
            }
        })
    }

    return {
        takeMapSnapshot,
        mapSnapshot,
        creatingMapSnapshot
    }
}

export default useMapFocus