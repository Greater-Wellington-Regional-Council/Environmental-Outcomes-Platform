import React from 'react'
import {Layer} from 'react-map-gl'
import {BoundaryLinesLayerProps} from "@components/InteractiveMap/lib/InteractiveMap"

const FmuBoundariesLayer: React.FC<BoundaryLinesLayerProps> = ({id, source, mapStyle, fillColor = 'orange', fillLayer}) => {
    const lineColor = mapStyle.includes('aerial') ? 'yellow' : 'blue'
    return (<>
        <Layer
            id={id}
            type="line"
            paint={{
                'line-color': lineColor,
                'line-width': 2,
                'line-dasharray': [2, 2],
            }}
            source={source}
        />
        {fillLayer && <Layer
            id={fillLayer}
            type="fill"
            paint={{
                'fill-color': fillColor,
                'fill-opacity': 0,
            }}
            source={source}
        />}
    </>)
}

export default FmuBoundariesLayer