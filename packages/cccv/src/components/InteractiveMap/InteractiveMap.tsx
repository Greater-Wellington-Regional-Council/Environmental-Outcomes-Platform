import {Map, MapRef,} from "react-map-gl"

import {MutableRefObject, useRef} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './InteractiveMap.scss'
import {DEFAULT_ZOOM, useViewState} from "@components/InteractiveMap/lib/useViewState.ts"

import {InteractiveMapProps,} from "@components/InteractiveMap/lib/InteractiveMap"

import MapControls from "@components/InteractiveMap/lib/MapControls/MapControls.tsx"
import env from "@src/env.ts"
import {debounce} from "lodash"

import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

const DEFAULT_VIEW_WIDTH = 100
const DEFAULT_VIEW_HEIGHT = 150

export default function InteractiveMap({
                                           startLocation,
                                           onHover,
                                           onClick,
                                           mapRef,
                                           children,
                                           mapStyle,
                                           onLoad,
                                       }: InteractiveMapProps) {

    const {viewState, handleMove} = useViewState({
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
    })

    const mapContainerRef = useRef<HTMLDivElement>(null)

    const handleClick = onClick ? debounce((e) => onClick(e), 0) : undefined

    const handleHover = onHover ? debounce((e) => onHover(e), 0) : undefined

    const onLoaded = () => {
        if (onLoad) onLoad()
    }

    return (
        <div className="map-container" data-testid={"InteractiveMap"} ref={mapContainerRef}>
            <Map
                ref={mapRef as MutableRefObject<MapRef>}
                data-testid="map"
                mapStyle={mapStyle}
                style={{width: '100%', height: '100vh', aspectRatio: '24/9'}}
                viewState={{...viewState, width: DEFAULT_VIEW_WIDTH, height: DEFAULT_VIEW_HEIGHT}}
                mapboxAccessToken={env.MAPBOX_TOKEN}
                accessToken={env.LINZ_API_KEY}
                doubleClickZoom={false}
                cursor='pointer'
                dragPan={true}
                zoom-={DEFAULT_ZOOM}
                minZoom={8}
                interactive={true}
                onClick={handleClick}
                onMouseMove={handleHover}
                onMove={handleMove}
                onLoad={onLoaded}
                trackResize={true}
                onError={(event: { error: Error; }) => {
                    announceError(event.error, ErrorLevel.WARNING)
                }}>

                <MapControls/>

                {children}
            </Map>
        </div>
    )
}
