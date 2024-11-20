import React from 'react'
import {Layer} from 'react-map-gl'
import {BoundaryLinesLayerProps} from "@components/InteractiveMap/lib/InteractiveMap"
import mapProperties from "@lib/values/mapProperties.ts"

const FmuBoundariesLayer: React.FC<BoundaryLinesLayerProps> = ({id, source, fillColor = 'orange', lineColor, fillLayer}) => {
    return (<>
        <Layer
            id={id}
            type="line"
            paint={{ ...mapProperties.fmuBoundaries['line'], 'line-color': lineColor }}
            source={source}
        />
        {fillLayer && <Layer
            id={fillLayer}
            type="fill"
            paint={{ ...mapProperties.fmuBoundaries['fill'], 'fill-color': fillColor, 'fill-opacity': 0 }}
            source={source}
        />}
    </>)
}

export default FmuBoundariesLayer