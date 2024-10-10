import { Feature, FeatureCollection } from 'geojson'

export default function addPropertiesToGeoJSON(
    featureOrCollection: Feature | FeatureCollection,
    newProperties: { [key: string]: unknown }
) {
    if ('properties' in featureOrCollection) {
        featureOrCollection.properties = {
            ...featureOrCollection.properties,
            ...newProperties,
        }
    }

    if ('features' in featureOrCollection) {
        featureOrCollection.features = featureOrCollection.features.map((feature) => ({
            ...feature,
            properties: {
                ...feature.properties,
                ...newProperties,
            },
        }))
    }

    return featureOrCollection
}