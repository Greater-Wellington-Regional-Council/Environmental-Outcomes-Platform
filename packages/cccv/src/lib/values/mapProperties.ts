import {MapPaintProperties} from "@shared/types/global"
import colors from "@lib/colors.ts"

export const MAP_PROPERTIES  = {
    'tangataWhenua': {
        'fill': {
            'fill-color': 'red',
            'fill-opacity': 0.6,
            'fill-outline-color': "black",
        } as MapPaintProperties
    },
    'defaultHover': {
        'fill': {
            'fill-color': 'orange',
            'fill-opacity': 0.3,
            "fill-outline-color": "black",
        } as MapPaintProperties
    },
    'defaultSelect': {
        'fill': {
            'fill-color': "green",
            'fill-opacity': 0.8,
            "fill-outline-color": "black",
        } as MapPaintProperties
    },
    'currentFMU': {
        'fill': {
            'fill-color': colors.castlepoint,
            'fill-opacity': 0.6,
            "fill-outline-color": "black",
        } as MapPaintProperties
    },
    fmuBoundaries: {
        'line': {
            'line-color': 'yellow',
            'line-width': 2,
            'line-dasharray': [2, 2],
        } as MapPaintProperties,
        'fill': {
            'fill-color': 'orange',
            'fill-opacity': 0,
        } as MapPaintProperties
    },
    'feature': {
        'fill': {
            'fill-color': "green",
            'fill-opacity': 0.8,
            "fill-outline-color": "black",
        } as MapPaintProperties
    },
}

export default MAP_PROPERTIES