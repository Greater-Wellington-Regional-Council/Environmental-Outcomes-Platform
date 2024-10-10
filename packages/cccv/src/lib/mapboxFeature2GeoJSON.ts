import { Feature, FeatureCollection, Geometry } from "geojson"

export default function mapboxFeature2GeoJSON(featureOrCollection: Feature | FeatureCollection): Feature | FeatureCollection {
    if (!featureOrCollection) {
        throw new Error("Invalid input: Missing feature or feature collection")
    }

    if (isFeatureCollection(featureOrCollection)) {
        return {
            type: "FeatureCollection",
            features: featureOrCollection.features.map((feature) => mapboxFeature2GeoJSON(feature) as Feature)
        }
    } else if (isFeature(featureOrCollection)) {
        return {
            type: "Feature",
            geometry: copyGeometry(featureOrCollection.geometry),
            properties: featureOrCollection.properties || {}
        }
    } else {
        throw new Error(`Unsupported type: ${featureOrCollection}`)
    }
}

// Type guards to help TypeScript infer types
function isFeatureCollection(input: { type: string }): input is FeatureCollection {
    return input.type === "FeatureCollection"
}

function isFeature(input: { type: string }): input is Feature {
    return input.type === "Feature"
}

function copyGeometry(geometry: Geometry): Geometry {
    switch (geometry.type) {
        case "Point":
            return {
                type: "Point",
                coordinates: [...geometry.coordinates]
            }

        case "MultiPoint":
            return {
                type: "MultiPoint",
                coordinates: geometry.coordinates.map(coord => [...coord])
            }

        case "LineString":
            return {
                type: "LineString",
                coordinates: geometry.coordinates.map(coord => [...coord])
            }

        case "MultiLineString":
            return {
                type: "MultiLineString",
                coordinates: geometry.coordinates.map(ring => ring.map(coord => [...coord]))
            }

        case "Polygon":
            return {
                type: "Polygon",
                coordinates: geometry.coordinates.map(ring => ring.map(coord => [...coord]))
            }

        case "MultiPolygon":
            return {
                type: "MultiPolygon",
                coordinates: geometry.coordinates.map(polygon =>
                    polygon.map(ring => ring.map(coord => [...coord]))
                )
            }

        default:
            throw new Error(`Unsupported geometry type: ${geometry.type}`)
    }
}