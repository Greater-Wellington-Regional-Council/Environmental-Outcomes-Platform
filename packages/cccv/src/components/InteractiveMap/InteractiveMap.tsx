import {
    Map,
    MapRef,
} from "react-map-gl"

import {MutableRefObject, useRef, useState} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './InteractiveMap.scss'
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

import {
    InteractiveMapProps,
} from "@components/InteractiveMap/lib/InteractiveMap"

import MapStyleSelector from "@components/MapStyleSelector/MapStyleSelector.tsx"
import MapControls from "@components/InteractiveMap/lib/MapControls/MapControls.tsx"
import env from "@src/env.ts"
import {useViewState} from "@components/InteractiveMap/lib/useViewState.ts"
import {debounce} from "lodash"
import {urlDefaultMapStyle} from "@lib/urlsAndPaths.ts"

const DEFAULT_VIEW_WIDTH = 100
const DEFAULT_VIEW_HEIGHT = 150

export default function InteractiveMap({
                                           startLocation,
                                           onHover,
                                           onClick,
                                           mapRef,
                                           children,
                                           mapStyle,
                                           setMapStyle,
                                       }: InteractiveMapProps) {

    const {viewState, handleMove} = useViewState({
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
    })

    const mapContainerRef = useRef<HTMLDivElement>(null)

    // const {updatePrintSnapshot} = useMapSnapshot()

    const handleClick = onClick ? debounce((e) => onClick(e), 0) : undefined

    const handleHover = onHover ? debounce((e) => onHover(e), 0) : undefined

    const [ defaultStyle, setDefaultStyle ] = useState(urlDefaultMapStyle(env.LINZ_API_KEY))

    return (
        <div className="map-container" data-testid={"InteractiveMap"} ref={mapContainerRef}>
            <MapStyleSelector onStyleChange={setMapStyle || setDefaultStyle}/>
            <Map
                ref={mapRef as MutableRefObject<MapRef>}
                data-Testid="map"
                mapStyle={mapStyle || defaultStyle}
                style={{width: '100%', height: '100vh', aspectRatio: '24/9'}}
                viewState={{...viewState, width: DEFAULT_VIEW_WIDTH, height: DEFAULT_VIEW_HEIGHT}}
                mapboxAccessToken={env.MAPBOX_TOKEN}
                accessToken={env.LINZ_API_KEY}
                doubleClickZoom={false}  // Disable the default double-click zoom
                cursor='pointer'
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

                {children}
            </Map>
        </div>
    )
}