import { MapMouseEvent } from "mapbox-gl"
import {CombinedMapRef} from "@components/InteractiveMap/lib/InteractiveMap"

const getFeatureUnderMouse = (mapRef: React.RefObject<CombinedMapRef | null>, e: MapMouseEvent, layer?: number | string) => {
    const map = mapRef?.current
    if (!map) return null

    const features = map?.queryRenderedFeatures(e.point)
    if (!features) return null

    if (!layer) return features[0]

    if (typeof layer === 'number') return features[layer]

    return features.find(f => {
        return f.layer?.id === layer
    })
}

export default getFeatureUnderMouse