import {
    Map,
    MapMouseEvent, Source,
} from "react-map-gl"
import {useEffect, useRef, useState} from 'react'
import mapboxgl, {Marker} from "mapbox-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
import './InteractiveMap.scss'
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

import {
    CombinedMapRef,
    InteractiveMapProps,
} from "@components/InteractiveMap/lib/InteractiveMap"
import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx"
import FmuBoundariesLayer from "@components/InteractiveMap/lib/FmuBoundariesLayer/FmuBoundariesLayer.tsx"
import RolloverHighlight from "@components/InteractiveMap/lib/FeatureHighlight/FeatureHighlight.tsx"
import MapControls from "@components/InteractiveMap/lib/MapControls/MapControls.tsx"
import env from "@src/env.ts"
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts"
import {Feature, FeatureCollection, Geometry} from "geojson"
import {ViewLocation} from "@shared/types/global"
import {useViewState} from "@components/InteractiveMap/lib/useViewState.ts"
import {debounce} from "lodash"
import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService.ts"
import {debounceClick} from "@lib/debounceClick.ts"
import {removeSourceWithLayers} from "@lib/removeSourceWithLayers.ts"
import {useMapSnapshot} from "@lib/MapSnapshotContext"

const DEFAULT_VIEW_WIDTH = 100
const DEFAULT_VIEW_HEIGHT = 150
const DEFAULT_CLOSEUP_ZOOM = 20
const DEFAULT_CLOSEUP_PADDING = {top: 60, bottom: 60, left: 60, right: 500}
const MAX_WIDE_ZOOM = 10

const HOVER_LAYER = "freshwater-management-units-candidates"
const CLICK_LAYER = HOVER_LAYER
const HOVER_HIGHLIGHT_LAYER = "fmu-highlight"
const FMU_BOUNDARIES_SOURCE = "freshwater-management-units"

export default function InteractiveMap({
                                           startLocation,
                                           locationInFocus,
                                           setLocationInFocus,
                                           children
                                       }: InteractiveMapProps) {

    const {viewState, handleMove} = useViewState({
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
    })

    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<CombinedMapRef | null>(null)

    const [mapStyle, setMapStyle] = useState(urlDefaultMapStyle(env.LINZ_API_KEY))
    const [featureBeingRolledOver, setFeatureBeingRolledOver] = useState<Feature | null>(null)
    const [focusPin, setFocusPin] = useState<Marker | null>(null)

    const { setMapSnapshot } = useMapSnapshot()

    const clickTimeoutRef = useRef<number | null>(null)

    function buildPrintSnapshot(location: ViewLocation | null, layersToInclude: string[] = []) {
        console.log("buildPrintSnapshot", location, layersToInclude)
        if (!mapRef?.current || !location) return null

        const map = mapRef.current.getMap()

        const dataUrl = `${map.getCanvas().toDataURL('image/png')}?timestamp=${Date.now()}`

        console.log("End buildPrintSnapshot", dataUrl)
        return dataUrl
    }

    function updatePrintSnapshot(location: ViewLocation | null) {
        if (!mapRef?.current) {
            setMapSnapshot(null)
            return
        }

        const map = mapRef.current.getMap()

        map.once('idle', () => {
            const snapshot = buildPrintSnapshot(location)
            setMapSnapshot && setMapSnapshot(snapshot ?? null)
        })
    }

    function fitBoundsToFeatures(featureOrCollection: Feature | FeatureCollection) {
        console.log("fitBoundsToFeatures", featureOrCollection)

        if (!mapRef?.current) return

        const bounds = new mapboxgl.LngLatBounds()

        const extendBounds = (coordinates: [number, number][]) => {
            coordinates.forEach((coordinate) => {
                bounds.extend(coordinate)
            })
        }

        const extendByGeometry = (geometry: Geometry) => {
            if (!geometry) return

            if (geometry.type === 'Polygon') {
                const coords = geometry.coordinates[0] as [number, number][]
                extendBounds(coords)
            } else if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach((polygon) => {
                    const coords = polygon[0] as [number, number][]
                    extendBounds(coords)
                })
            } else if (geometry.type === 'Point') {
                bounds.extend(geometry.coordinates as [number, number])
            } else if (geometry.type === 'LineString') {
                const coords = geometry.coordinates as [number, number][]
                extendBounds(coords)
            }
        }

        if (featureOrCollection.type === 'Feature') {
            extendByGeometry(featureOrCollection.geometry)
        } else if (featureOrCollection.type === 'FeatureCollection') {
            featureOrCollection.features.forEach((feature) => {
                extendByGeometry(feature.geometry)
            })
        }

        console.log("fitBounds", bounds)
        if (bounds && !bounds.isEmpty())
            mapRef.current.getMap().fitBounds(bounds, {
                padding: DEFAULT_CLOSEUP_PADDING,
                maxZoom: DEFAULT_CLOSEUP_ZOOM,
            })
    }

    function isValidLngLat(coord: [number, number]): boolean {
        const [lng, lat] = coord
        return (
            lng !== undefined && lat !== undefined &&
            !Number.isNaN(lng) && !Number.isNaN(lat) &&
            lng >= -180 && lng <= 180 &&
            lat >= -90 && lat <= 90
        )
    }

    function drawFeaturesInFocus(location: ViewLocation, id: string = 'focusView'): string | null {
        console.log('drawFeaturesInFocus', location, id)

        if (!mapRef?.current || !location?.geometry) return id

        const map = mapRef.current.getMap()
        const source = map.getSource(id)

        if (source)
            (source as mapboxgl.GeoJSONSource).setData(location.geometry)
        else {
            map.addSource(id, {
                type: 'geojson',
                data: location.geometry,
            })

            highlightShapes(id, { location })
        }

        return id
    }

    interface HighlightShapesOptions {
        fillColor?: string;
        outlineColor?: string;
        fillOpacity?: number;
        remove?: boolean;
        location?: ViewLocation;
    }

    function highlightShapes(sourceId: string, options: HighlightShapesOptions) {
        console.log('highlightShapes', sourceId, options)

        const defaultOptions: HighlightShapesOptions = { location: undefined, fillColor: 'darkgreen', outlineColor: '#000', fillOpacity: 0.5, remove: false}
        const opts: HighlightShapesOptions = { ...defaultOptions, ...options }

        const map = mapRef.current!.getMap()

        if (options.remove || !map.getSource(sourceId)) return

        function clearPreviousLayers(sourceId: string, auxLayerId: string = "features") {
            const outlineLayerId = `${sourceId}-${auxLayerId}-outline`
            const fillLayerId = `${sourceId}-${auxLayerId}-layer`

            if (map.getLayer(fillLayerId))
                map.removeLayer(fillLayerId)

            if (map.getLayer(outlineLayerId))
                map.removeLayer(outlineLayerId)

            return { fillLayerId, outlineLayerId }
        }

        function addFocusFeatureHighlightLayers(sourceId: string, opts: HighlightShapesOptions) {
            const layers = clearPreviousLayers(sourceId)

            map.addLayer({
                id: layers.fillLayerId,
                type: 'fill',
                source: sourceId,
                layout: {},
                paint: {
                    'fill-color': opts.fillColor,
                    'fill-opacity': opts.fillOpacity,
                },
            })

            map.addLayer({
                id: layers.outlineLayerId,
                type: 'line',
                source: sourceId,
                layout: {},
                paint: {
                    'line-color': opts.outlineColor,
                    'line-width': 2,
                },
            })
        }

        function addRolloverRegionHighlightLayers(sourceId: string, opts: HighlightShapesOptions) {
            const layers = clearPreviousLayers(sourceId, 'hover')

            map.addLayer({
                id: layers.fillLayerId,
                type: 'fill',
                source: sourceId,
                layout: {},
                paint: {
                    'fill-color': opts.fillColor,
                    'fill-opacity': opts.fillOpacity,
                },
            })

            map.addLayer({
                id: layers.outlineLayerId,
                type: 'line',
                source: sourceId,
                layout: {},
                paint: {
                    'line-color': opts.outlineColor,
                    'line-width': 2,
                },
            })
        }

        if (opts.remove) {
            clearPreviousLayers(sourceId)
            clearPreviousLayers(sourceId, 'hover')
            return
        }

        addFocusFeatureHighlightLayers(sourceId, opts)
        addRolloverRegionHighlightLayers(sourceId, opts)
    }

    function placeFocusPin(location: ViewLocation) {
        console.log('placeFocusPin', location, focusPin)

        if (!mapRef?.current) return

        if (!location || !isValidLngLat([location.longitude, location.latitude])) {
            focusPin?.remove()
            setFocusPin(null)
            return
        }

        const pin = (focusPin ?? new mapboxgl.Marker())
            .setLngLat([location.longitude, location.latitude])
            .addTo(mapRef.current!.getMap())

        if (location.description) {
            const popup = new mapboxgl.Popup({closeButton: false})
                .setLngLat([location.longitude, location.latitude])
                .setHTML(location.description ?? '<></>')
                .addTo(mapRef.current!.getMap())

            pin.setPopup(popup)
        }

        setFocusPin(pin)
    }

    function focusMapView(location: ViewLocation | null = null) {
        if (location?.geometry)
            fitBoundsToFeatures(location.geometry)
        else if (location)
            if (!location.description)
                mapRef.current?.getMap().setZoom(location.zoom)
            else
                mapRef.current?.getMap().flyTo({
                    center: [location.longitude, location.latitude],
                    zoom: location.zoom,
                    essential: true,
                })
        else {
            mapRef.current?.getMap().flyTo({
                center: [startLocation.longitude, startLocation.latitude],
                zoom: DEFAULT_ZOOM,
                essential: true,
            })
            setFeatureBeingRolledOver(null)
        }
    }

    useEffect(() => {
        console.log("updatePrintSnapshot", locationInFocus)

        if (locationInFocus) {
            placeFocusPin(locationInFocus)
            drawFeaturesInFocus(locationInFocus, 'focus')
        } else {
            focusPin?.remove()
            const map = mapRef?.current?.getMap()
            map && removeSourceWithLayers(map, 'focus')
        }

        focusMapView(locationInFocus)

        updatePrintSnapshot(locationInFocus)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationInFocus])

    const handleClick = (e: MapMouseEvent) => {
        debounceClick(clickTimeoutRef, 200, () => {
            console.log("handleClick", e)
            setLocationInFocus && setLocationInFocus(null)
            const clickedFeature = getFeatureUnderMouse(e, CLICK_LAYER)
            if (clickedFeature) {
                setFeatureBeingRolledOver(clickedFeature)
                const location = {longitude: e.lngLat.lng, latitude: e.lngLat.lat, zoom: Math.min(mapRef.current!.getZoom(), MAX_WIDE_ZOOM) }
                setLocationInFocus && setLocationInFocus(location)
            }
        })
    }

    const getFeatureUnderMouse = (e: MapMouseEvent, layer?: number | string) => {
        const map = mapRef?.current
        if (!map) return null

        const features = map?.queryRenderedFeatures(e.point)
        console.log("getFeatureUnderMouse", features)
        if (!features) return null

        if (!layer) return features[0]

        if (typeof layer === 'number') return features[layer]

        return features.find(f => {
            console.log("f.layer", f.layer?.id, layer, f.layer?.id === layer)
            return f.layer?.id === layer })
    }

    const handleHover = debounce((e) => {
        if (locationInFocus) return
        const feature = getFeatureUnderMouse(e, HOVER_LAYER)
        console.log("handleHover", featureBeingRolledOver)
        if (feature) {
            setFeatureBeingRolledOver(feature)
        } else {
            setFeatureBeingRolledOver(null)
        }
    }, 0.5)

    return (
        <div className="map-container" data-testid={"InteractiveMap"} ref={mapContainerRef}>
            <MapStyleSelector onStyleChange={setMapStyle}/>
            <Map
                ref={mapRef}
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
                minZoom={5}
                interactive={true}
                onClick={handleClick}
                onMouseMove={handleHover}
                onMove={handleMove}
                trackResize={true}
                onError={(event: { error: Error; }) => {
                    console.error('Map error:', event.error)
                }}>

                <MapControls/>

                {children}

                <Source
                    id={FMU_BOUNDARIES_SOURCE}
                    type="geojson"
                    data={freshwaterManagementUnitService.urlToGetFmuBoundaries()}>

                    <FmuBoundariesLayer id="freshwater-management-units" fillLayer={HOVER_LAYER}
                                        source="freshwater-management-units" mapStyle={mapStyle}/>

                    {featureBeingRolledOver && <RolloverHighlight id={HOVER_HIGHLIGHT_LAYER}
                                      mapRef={mapRef}
                                      source="freshwater-management-units"
                                      highlightedFeature={featureBeingRolledOver}
                                      tooltip={{
                                          source: (f) => f.properties!.fmuName1,
                                      }}/>}
                </Source>
            </Map>
        </div>
    )
}