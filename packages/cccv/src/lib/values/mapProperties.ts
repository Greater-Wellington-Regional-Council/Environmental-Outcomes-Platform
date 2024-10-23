import {MapPaintProperties} from "@shared/types/global"

export const MAP_PROPERTIES  = {
    'tangataWhenua': {
        'fill': {
            'fill-color': 'yellow',
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
            'fill-color': 'orange',
            'fill-opacity': 0.4,
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
    }
}

export default MAP_PROPERTIES