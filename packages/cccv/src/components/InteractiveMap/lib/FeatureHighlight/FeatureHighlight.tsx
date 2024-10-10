import React, {useEffect, useState} from 'react'
import {Layer} from 'react-map-gl'
import {FeatureHighlightProps} from "@components/InteractiveMap/lib/InteractiveMap"
import {calculateCentroids} from "@lib/calculatePolygonCentoid.ts"
import mapboxFeature2GeoJSON from "@lib/mapboxFeature2GeoJSON.ts"
import {Feature} from "geojson"


const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
                                                               highlightedFeature,
                                                               id,
                                                               mapRef,
                                                                paint = {
                                                                     'fill-color': 'darkgreen',
                                                                     'fill-opacity': 0.5,
                                                                },
                                                               filter = ['==', ['id'], ("properties" in highlightedFeature) ? highlightedFeature?.properties?.id : null],
                                                               source,
                                                               tooltip = null
                                                           }) => {

    const [tooltipPosition, setTooltipPosition] = useState<{ left: number, top: number } | null>(null)

    const moveToolTip = () => {
        if (!highlightedFeature || !mapRef?.current) return

        const coordinates = calculateCentroids(highlightedFeature)

        if (coordinates?.length) {
            const screenCoords = mapRef.current.project(coordinates)
            setTooltipPosition({left: screenCoords.x, top: screenCoords.y})
        }
    }

    useEffect(() => {
        moveToolTip()
        if (mapRef?.current) {
            const map = mapRef.current.getMap()
            map.on('mouseup', moveToolTip)
            map.on('drag', moveToolTip)
            map.on('move', moveToolTip)
            return () => {
                map.off('move', moveToolTip)
                map.off('mouseup', moveToolTip)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightedFeature, mapRef])

    const tooltipFeature: Feature = ("properties" in highlightedFeature) ? highlightedFeature : highlightedFeature.features[0]

    return (
        <>
            {highlightedFeature && (
                <Layer
                    id={`${id}-highlight`}
                    type="fill"
                    filter={filter}
                    paint={{ ...paint, "fill-antialias": true }}
                    source={source}
                />
            )}
            {highlightedFeature && tooltip?.source(mapboxFeature2GeoJSON(tooltipFeature) as Feature) && tooltipPosition && (
                <div
                    className="tooltip"
                    style={{
                        left: tooltipPosition.left,
                        top: tooltipPosition.top,
                    }}
                >
                    {tooltip?.source(mapboxFeature2GeoJSON(tooltipFeature) as Feature)}
                </div>
            )}
        </>
    )
}

export default FeatureHighlight