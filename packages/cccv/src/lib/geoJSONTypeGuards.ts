import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

export function isFeature(obj: unknown): obj is Feature<Geometry, GeoJsonProperties> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "type" in obj &&
        (obj as { type: string }).type === "Feature"
    )
}

export function isFeatureCollection(obj: unknown): obj is FeatureCollection<Geometry, GeoJsonProperties> {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "type" in obj &&
        (obj as { type: string }).type === "FeatureCollection"
    )
}