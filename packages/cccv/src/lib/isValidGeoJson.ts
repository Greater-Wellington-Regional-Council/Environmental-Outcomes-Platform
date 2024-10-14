import {Feature, FeatureCollection, Geometry} from "geojson"

export function isValidGeoJson(input: Feature | FeatureCollection): boolean {
    if (input && (input.type === "Feature" || input.type === "FeatureCollection")) {
        if (input.type === "Feature") {
            if (!isValidGeometry(input.geometry)) {
                console.error("Invalid geometry in Feature:", input.geometry)
                return false
            }
            return true
        } else if (input.type === "FeatureCollection") {
            const invalidFeatures = input.features.filter((feature: Feature) => !isValidGeometry(feature.geometry))
            if (invalidFeatures.length > 0) {
                console.error("Invalid features found in FeatureCollection:", invalidFeatures)
                return false
            }
            return true
        }
    } else {
        console.error("Input is not a valid GeoJSON Feature or FeatureCollection:", input)
    }
    return false
}

export function isValidGeometry(geometry: Geometry): boolean {
    if (!geometry) {
        console.error("Geometry is missing:", geometry)
        return false
    }

    if (!geometry.type) {
        console.error("Geometry type is missing:", geometry)
        return false
    }

    if ("coordinates" in geometry && !geometry.coordinates) {
        console.error("Geometry coordinates are missing:", geometry)
        return false
    }

    const isValidCoordinates = (coords: unknown): boolean => {
        if (!Array.isArray(coords)) {
            console.error("Coordinates are not an array:", coords)
            return false
        }

        const valid = coords.every((coord: number[]) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            !Number.isNaN(coord[0]) &&
            !Number.isNaN(coord[1])
        )

        if (!valid) {
            console.error("Invalid coordinates format or value:", coords)
        }

        return valid
    }

    switch (geometry.type) {
        case "Point":
            return isValidCoordinates(geometry.coordinates)
        case "Polygon":
        case "MultiPolygon":
        case "LineString":
        case "MultiLineString":
            if (!Array.isArray(geometry.coordinates)) {
                console.error("Coordinates for geometry type", geometry.type, "should be an array.")
                return false
            }
            return geometry.coordinates.every(isValidCoordinates)
        default:
            console.error("Unsupported geometry type:", geometry.type)
            return false
    }
}
