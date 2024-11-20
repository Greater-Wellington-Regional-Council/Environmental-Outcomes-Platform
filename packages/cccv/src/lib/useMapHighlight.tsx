import {MutableRefObject, useEffect, useState} from 'react'
import {CombinedMapRef} from "@components/InteractiveMap/lib/InteractiveMap"
import mapboxFeature2GeoJSON from "@lib/mapboxFeature2GeoJSON.ts"
import {IMViewLocation, MapPaintProperties} from "@shared/types/global"

interface HighlightShapesOptions {
    highlights?: MapPaintProperties;
    remove?: boolean;
    location?: IMViewLocation;
}

const defaultHighlightOptions: HighlightShapesOptions = {
    highlights: {
        'fill-color': 'orange',
        'fill-opacity': 0.3,
        'fill-outline-color': 'black',
    },
    remove: false,
}

const useMapHighlight = (
    mapRef: MutableRefObject<CombinedMapRef | null>,
    location?: IMViewLocation,
    id: string = 'objects-in-focus-layer'
) => {
    const [isHighlighted, setIsHighlighted] = useState(false)

    useEffect(() => {
        const map = mapRef?.current?.getMap()
        if (!map || !location) return

        const source = map.getSource(id)

        if (source && location.featuresInFocus) {
            (source as mapboxgl.GeoJSONSource).setData(mapboxFeature2GeoJSON(location.featuresInFocus))
        } else {
            map.addSource(id, {
                type: 'geojson',
                data: location.featuresInFocus ? mapboxFeature2GeoJSON(location.featuresInFocus) : { type: 'FeatureCollection', features: [] },
            })

            highlightShapes(id, { location })
        }

        return () => {
            if (map.getSource(id)) {
                clearLayer(id)
                map.removeSource(id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapRef, location, id])

    const clearLayer = (sourceId: string) => {
        const map = mapRef?.current?.getMap()
        if (!map) return

        const layerId = `${sourceId}-layer`

        if (map.getLayer(layerId)) {
            map.removeLayer(layerId)
            setIsHighlighted(false) // Set state when layers are removed
        }
    }

    const highlightShapes = (sourceId: string, options: HighlightShapesOptions) => {
        const map = mapRef?.current?.getMap()
        if (!map) return

        const opts = { ...defaultHighlightOptions, ...options.location?.highlight, ...options }

        if (opts.remove || !map.getSource(sourceId)) {
            clearLayer(sourceId)
            return
        }

        applyLayer(sourceId, opts)
        setIsHighlighted(true)
    }

    const applyLayer = (sourceId: string, opts: HighlightShapesOptions) => {
        const map = mapRef?.current?.getMap()
        if (!map) return

        const layerId = `${sourceId}-layer`

        clearLayer(sourceId)

        if (!map.getSource(sourceId)) return

        map.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            layout: {},
            paint: {
                'fill-color': opts.highlights?.['fill-color'] || defaultHighlightOptions?.highlights?.['fill-color'],
                'fill-opacity': opts.highlights?.['fill-opacity'] || defaultHighlightOptions?.highlights?.['fill-opacity'],
                'fill-outline-color': opts.highlights?.['fill-outline-color'] || defaultHighlightOptions?.highlights?.['fill-outline-color'],
            },
        })
    }

    return {
        highlightShapes,
        clearLayer,
        isHighlighted,
    }
}

export default useMapHighlight