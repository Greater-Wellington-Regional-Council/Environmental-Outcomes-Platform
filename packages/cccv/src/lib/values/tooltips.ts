import {POTENTIAL_FMU_LAYER, TANGATA_WHENUA_LOCATIONS_LAYER} from "@lib/values/mapSourceAndLayerIds.ts"

const tooltipProperties = [
        {
            layer: TANGATA_WHENUA_LOCATIONS_LAYER,
            property: "properties.location",
            options: {
                "fill-color": "black",
                "fill-outline-color": "black",
                "text-color": "white",
                "fill-opacity": 0.8,
                "font-weight": "bold",
            },
        },
        {
            layer: POTENTIAL_FMU_LAYER,
            property: "properties.fmuName1",
            options: {
                "fill-color": "white",
                "fill-outline-color": "purple",
                "text-color": "black",
                "fill-opacity": 0.8,
                "font-weight": "normal",
            },
        },
    ]

export default tooltipProperties