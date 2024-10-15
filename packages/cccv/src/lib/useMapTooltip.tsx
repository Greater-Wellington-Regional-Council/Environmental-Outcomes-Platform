import { useState, useEffect, RefObject } from 'react'
import { debounce, get } from 'lodash'
import { MapRef, MapMouseEvent } from 'react-map-gl'
import { Feature } from 'geojson'
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

interface TooltipSource {
    layer: string;
    property: string;
    options?: {
        'fill-color'?: string;
        'fill-outline-color'?: string;
        'text-color'?: string;
        'fill-opacity'?: number;
        [key: string]: unknown;
    };
}

interface UseMapTooltipProps {
    mapRef: RefObject<MapRef>;
    source: TooltipSource[];
    tooltipClassName?: string;
}

interface Position {
    left: number;
    top: number;
}

// Default property to look for in the feature
// if no property is specified in the source.
// This can be set in code somewhere for a layer.
const DEFAULT_TOOLTIP_PROPERTY = 'properties._tooltip'

const useMapTooltip = ({ mapRef, source, tooltipClassName }: UseMapTooltipProps) => {
    const [tooltipPosition, setTooltipPosition] = useState<Position | null>(null)
    const [tooltipContent, setTooltipContent] = useState<string | null>(null)
    const [tooltipStyle, setTooltipStyle] = useState<{ [key: string]: unknown }>({})

    const moveToolTip = (event: MapMouseEvent) => {
        if (!mapRef?.current) return

        if (mapRef.current.getMap().getZoom() <= DEFAULT_ZOOM) {
            setTooltipContent(null)
            return
        }

        const layers = source.map((s) => s.layer)
        const features = mapRef.current.queryRenderedFeatures(event.point, {
            layers,
        })

        if (!features || features.length === 0) {
            setTooltipContent(null)
            return
        }

        let validFeature: Feature | undefined
        let selectedSource: TooltipSource | undefined

        for (const feature of features) {
            selectedSource = source.find((s) =>
                s.layer == feature.layer!.id && !!get(feature, s.property) || !!get(feature, DEFAULT_TOOLTIP_PROPERTY)
            )
            if (selectedSource) {
                validFeature = feature
                break
            }
        }

        if (!validFeature || !selectedSource) {
            setTooltipContent(null)
            return
        }

        const content = get(validFeature, selectedSource.property)

        if (content) {
            setTooltipContent(content as string)
            const newPosition: Position = { left: event.point.x, top: event.point.y }
            setTooltipPosition(newPosition)
            setTooltipStyle({
                'fill-color': selectedSource.options?.['fill-color'] || 'blue',
                'fill-outline-color': selectedSource.options?.['fill-outline-color'] || 'black',
                'text-color': selectedSource.options?.['text-color'] || 'white',
                'fill-opacity': selectedSource.options?.['fill-opacity'] !== undefined ? selectedSource.options['fill-opacity'] : 1,
                ...selectedSource.options,
            })
        }
    }

    const debouncedMoveToolTip = debounce(moveToolTip, 10)

    useEffect(() => {
        const map = mapRef?.current?.getMap()
        if (map) {
            map.on('mousemove', debouncedMoveToolTip)
        }

        return () => {
            if (map) {
                map.off('mousemove', debouncedMoveToolTip)
            }
        }
    }, [mapRef, source, debouncedMoveToolTip])

    const Tooltip = () => {
        if (!tooltipPosition || !tooltipContent) return null

        return (
            <div
                className={tooltipClassName || 'tooltip'}
                style={{
                    position: 'absolute',
                    left: tooltipPosition.left,
                    top: tooltipPosition.top,
                    // Max zindex to ensure tooltip is on top of everything
                    zIndex: 999999,
                    backgroundColor: tooltipStyle['fill-color'] as string,
                    border: `1px solid ${tooltipStyle['fill-outline-color']}`,
                    opacity: tooltipStyle['fill-opacity'] as number,
                    color: tooltipStyle['text-color'] as string,
                    fontWeight: tooltipStyle['font-weight'] as string,
                }}
            >
                {tooltipContent}
            </div>
        )
    }

    return {
        Tooltip,
    }
}

export default useMapTooltip