import { MapMouseEvent } from "mapbox-gl"
import {CombinedMapRef} from "@components/InteractiveMap/lib/InteractiveMap"

const getFeaturesUnderMouse = (mapRef: React.RefObject<CombinedMapRef | null>, e: MapMouseEvent, layer?: number | string) => {
    const map = mapRef?.current
    if (!map) return []

    const features = map?.queryRenderedFeatures(e.point)

    if (!features) return []

    if (!layer) return features

    if (typeof layer === 'number' && (layer < features.length)) return [features[layer]]

    return [features.find(f => {
        return f.layer?.id === layer
    })]
}

export default getFeaturesUnderMouse