export const MAP_PROPERTIES = {
    'tangataWhenua': {
        'fill': {
            'fill-color': 'yellow',
            'fill-opacity': 0.6,
            "fill-outline-color": "black",
        }
    },
    'defaultHover': {
        'fill': {
            'fill-color': 'orange',
            'fill-opacity': 0.3,
            "fill-outline-color": "black",
        }
    },
    'defaultSelect': {
        'fill': {
            'fill-color': 'green',
            'fill-opacity': 0.4,
            "fill-outline-color": "black",
        }
    }
}

export interface MapPaintProperties {
    'fill-color': string,
    'fill-opacity': number,
    'fill-outline-color'?: string
}

export default MAP_PROPERTIES