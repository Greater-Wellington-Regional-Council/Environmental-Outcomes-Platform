import {
    Map,
    MapMouseEvent, MapRef, Source,
} from "react-map-gl"
import {MutableRefObject, useEffect, useRef, useState} from 'react'
import mapboxgl, {Marker} from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
import './InteractiveMap.scss'
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

import {
    InteractiveMapProps,
} from "@components/InteractiveMap/lib/InteractiveMap"
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx"
import FmuBoundariesLayer from "@components/InteractiveMap/lib/FmuBoundariesLayer/FmuBoundariesLayer.tsx"
import RolloverHighlight from "@components/InteractiveMap/lib/FeatureHighlight/FeatureHighlight.tsx"
import MapControls from "@components/InteractiveMap/lib/MapControls/MapControls.tsx"
import env from "@src/env.ts"
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts"
import {Feature, FeatureCollection} from "geojson"
import {IMViewLocation} from "@shared/types/global"
import {useViewState} from "@components/InteractiveMap/lib/useViewState.ts"
import {debounce} from "lodash"
import {debounceClick} from "@lib/debounceClick.ts"
import {useMapSnapshot} from "@lib/MapSnapshotContext"
import useMapHighlight from "@lib/useMapHighlight"
import zoomIntoFeatures from "@lib/zoomIntoFeatures.ts"
import mapProperties from "@values/mapProperties.ts"

const DEFAULT_VIEW_WIDTH = 100
const DEFAULT_VIEW_HEIGHT = 150

export const HOVER_LAYER = "freshwater-management-units-candidates"
const CLICK_LAYER = HOVER_LAYER
export const HIGHLIGHT_HOVER_LAYER = "fmu-highlight"
export const HIGHLIGHT_SELECT_LAYER = "fmu-highlight-click"

const HIGHLIGHTS_SOURCE_ID = "highlight-source"

export default function InteractiveMap({
                                           startLocation,
                                           locationInFocus,
                                           setLocationInFocus,
                                           highlights_source_url,
                                           mapRef,
                                           children
                                       }: InteractiveMapProps) {

    const {viewState, handleMove} = useViewState({
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
    })

    const mapContainerRef = useRef<HTMLDivElement>(null)

    const [mapStyle, setMapStyle] = useState(urlDefaultMapStyle(env.LINZ_API_KEY))

    const [featureBeingRolledOver, setFeatureBeingRolledOver] = useState<Feature | FeatureCollection | null>(null)
    const [highlightedFeature, setHighlightedFeature] = useState<Feature | FeatureCollection | null>(null)

    const [focusPin, setFocusPin] = useState<Marker | null>(null)

    const {highlightShapes} = useMapHighlight(mapRef, locationInFocus, 'focusView')

    const {updatePrintSnapshot} = useMapSnapshot()

    const clickTimeoutRef = useRef<number | null>(null)

    function focusMap() {
        if (locationInFocus?.featuresInFocus)
            zoomIntoFeatures(mapRef, locationInFocus.featuresInFocus)
        else if (highlightedFeature)
            zoomIntoFeatures(mapRef, highlightedFeature)
        else
            mapRef.current?.flyTo({center: [startLocation.longitude, startLocation.latitude], zoom: DEFAULT_ZOOM})
    }

    function drawFeaturesInFocus(location: IMViewLocation, id: string = 'focusView'): string | null {
        if (!mapRef?.current || !location?.featuresInFocus) return id

        const map = mapRef.current.getMap()
        const source = map.getSource(id)

        if (source) {
            (source as mapboxgl.GeoJSONSource).setData(location.featuresInFocus)
        } else {
            map.addSource(id, {
                type: 'geojson',
                data: location.featuresInFocus,
            })

            highlightShapes(id, {location})
        }

        return id
    }

    function placeFocusPin(location: IMViewLocation) {
        function isValidLngLat(coord: [number | undefined, number | undefined]): boolean {
            const [lng, lat] = coord
            return (
                lng !== undefined && lat !== undefined &&
                !Number.isNaN(lng) && !Number.isNaN(lat) &&
                lng >= -180 && lng <= 180 &&
                lat >= -90 && lat <= 90
            )
        }

        if (!mapRef?.current) return

        if (!location || !isValidLngLat([location.longitude, location.latitude])) {
            focusPin?.remove()
            setFocusPin(null)
            return
        }

        const pin = (focusPin ?? new mapboxgl.Marker())
            .setLngLat([location.longitude!, location.latitude!])
            .addTo(mapRef.current!.getMap())

        if (location.description) {
            const popup = new mapboxgl.Popup({closeButton: false})
                .setLngLat([location.longitude!, location.latitude!])
                .setHTML(location.description ?? '<></>')
                .addTo(mapRef.current!.getMap())

            pin.setPopup(popup)
        }

        setFocusPin(pin)
    }

    useEffect(() => {
        if (!locationInFocus) {
            setHighlightedFeature(null)
            setFeatureBeingRolledOver(null)
            focusPin?.remove()
            setFocusPin(null)
            focusMap()
            return
        }

        focusMap()
        updatePrintSnapshot(mapRef, locationInFocus)

        drawFeaturesInFocus(locationInFocus)
        placeFocusPin(locationInFocus)
        focusMap()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationInFocus, highlightedFeature])

    const handleClick = (e: MapMouseEvent) => {
        debounceClick(clickTimeoutRef, 200, () => {
            const clickedFeature = getFeatureUnderMouse(e, CLICK_LAYER)
            if (clickedFeature) {
                setFeatureBeingRolledOver(clickedFeature as never)
                const location = {
                    longitude: e.lngLat.lng, latitude: e.lngLat.lat,
                    highlight: {fillColor: 'orange', outlineColor: 'rgba(74,119,149,0.44)', fillOpacity: 0.5}
                }
                setLocationInFocus?.(location)
                // setHighlightedFeature(mapboxFeature2GeoJSON(clickedFeature as never))
            }
        })
    }

    const getFeatureUnderMouse = (e: MapMouseEvent, layer?: number | string) => {
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

    const handleHover = debounce((e) => {
        if (locationInFocus) return
        const feature = getFeatureUnderMouse(e, HOVER_LAYER)
        if (feature) {
            console.log('feature', feature)
            setFeatureBeingRolledOver(feature)
        } else {
            console.log('feature', "null")
            setFeatureBeingRolledOver(null)
        }
    }, 0.5)

    return (
        <div className="map-container" data-testid={"InteractiveMap"} ref={mapContainerRef}>
            <MapStyleSelector onStyleChange={setMapStyle}/>
            <Map
                ref={mapRef as MutableRefObject<MapRef>}
                data-Testid="map"
                mapStyle={mapStyle}
                style={{width: '100%', height: '100vh', aspectRatio: '24/9'}}
                viewState={{...viewState, width: DEFAULT_VIEW_WIDTH, height: DEFAULT_VIEW_HEIGHT}}
                mapboxAccessToken={env.MAPBOX_TOKEN}
                accessToken={env.LINZ_API_KEY}
                doubleClickZoom={false}  // Disable the default double-click zoom
                cursor={featureBeingRolledOver ? 'pointer' : 'grab'}
                dragPan={true}
                zoom-={DEFAULT_ZOOM}
                minZoom={8}
                interactive={true}
                onClick={handleClick}
                onMouseMove={handleHover}
                onMove={handleMove}
                trackResize={true}
                onError={(event: { error: Error; }) => {
                    console.error('Map error:', event.error)
                }}>

                <MapControls/>

                <Source
                    id={HIGHLIGHTS_SOURCE_ID}
                    type="geojson"
                    data={highlights_source_url}>

                    <FmuBoundariesLayer id={HIGHLIGHTS_SOURCE_ID} fillLayer={HOVER_LAYER}
                                        source={HIGHLIGHTS_SOURCE_ID} mapStyle={mapStyle}/>

                    {featureBeingRolledOver && <RolloverHighlight id={HIGHLIGHT_HOVER_LAYER}
                                                                  mapRef={mapRef}
                                                                  source={HIGHLIGHTS_SOURCE_ID}
                                                                  highlightedFeature={featureBeingRolledOver}
                                                                  paint={mapProperties.defaultHover.fill}
                                                                  tooltip={{
                                                                      source: (f) => f.properties!.fmuName1,
                                                                  }}/>}

                    {highlightedFeature && <RolloverHighlight id={HIGHLIGHT_SELECT_LAYER}
                                                              mapRef={mapRef}
                                                              source={HIGHLIGHTS_SOURCE_ID}
                                                              highlightedFeature={highlightedFeature}
                                                              paint={mapProperties.defaultSelect.fill}
                                                              tooltip={{
                                                                  source: (f) => f.properties!.fmuName1,
                                                              }}/>}
                </Source>

                {children}
            </Map>
        </div>
    )
}