import { MutableRefObject } from "react"
import { CombinedMapRef } from "@components/InteractiveMap/lib/InteractiveMap"
import { Feature, FeatureCollection, Geometry } from "geojson"
import mapboxgl from "mapbox-gl"
import {IMViewLocation} from "@shared/types/global"
import _ from "lodash"
import { isFeature, isFeatureCollection } from "./geoJSONTypeGuards"

export default function zoomIntoFeatures(
    mapRef: MutableRefObject<CombinedMapRef | null>,
    focus: Feature | FeatureCollection | IMViewLocation | null | undefined,
    offset: [number, number] = [6000, -140],
    padding: number = 200,
    maxZoom: number = 20
) {
    if (!focus)
        return

    const featureOrCollection =
        (isFeatureCollection(focus) || isFeature(focus)) ? focus :
            _.get(focus, "featuresInFocus")

    if (!featureOrCollection) return

    const map = mapRef.current?.getMap()

    if (!map) return

    const bounds = calculateBounds(featureOrCollection)

    if (bounds.isEmpty()) return

    const adjustedBounds = applyOffset(bounds, map, offset)

    flyToBounds(map, adjustedBounds, padding, maxZoom)
}

function calculateBounds(featureOrCollection: Feature | FeatureCollection): mapboxgl.LngLatBounds {
    const bounds = new mapboxgl.LngLatBounds()

    const isValidLngLat = (coord: number[]): coord is [number, number] => {
        const [lng, lat] = coord
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
    }

    const extendBounds = (geometry: Geometry) => {
        if (!geometry) return

        switch (geometry?.type) {
            case "Polygon":
                (geometry.coordinates as number[][][]).forEach((ring) => {
                    ring.forEach((coord) => {
                        if (isValidLngLat(coord)) {
                            bounds.extend(coord as [number, number])
                        }
                    })
                })
                break
            case "MultiPolygon":
                (geometry.coordinates as number[][][][]).forEach((polygon) => {
                    polygon.forEach((ring) => {
                        ring.forEach((coord) => {
                            if (isValidLngLat(coord)) {
                                bounds.extend(coord as [number, number])
                            }
                        })
                    })
                })
                break
            case "Point":
                if (isValidLngLat(geometry.coordinates as [number, number])) {
                    bounds.extend(geometry.coordinates as [number, number])
                }
                break
            case "LineString":
                (geometry.coordinates as number[][]).forEach((coord) => {
                    if (isValidLngLat(coord)) {
                        bounds.extend(coord as [number, number])
                    }
                })
                break
            case "MultiLineString":
                (geometry.coordinates as number[][][]).forEach((line) => {
                    line.forEach((coord) => {
                        if (isValidLngLat(coord)) {
                            bounds.extend(coord as [number, number])
                        }
                    })
                })
                break
        }
    }

    if (featureOrCollection.type === "FeatureCollection") {
        featureOrCollection.features.forEach((feature) => {
            extendBounds(feature.geometry)
        })
    } else {
        extendBounds(featureOrCollection.geometry)
    }

    return bounds
}

function applyOffset(
    bounds: mapboxgl.LngLatBounds,
    map: mapboxgl.Map,
    offset: [number, number]
): mapboxgl.LngLatBounds {
    const mapWidth = map.getCanvas().width
    const mapHeight = map.getCanvas().height

    const offsetLng = (offset[0] / mapWidth) * (bounds.getEast() - bounds.getWest()) * 0.1 // Reduced by 10% to prevent over-shifting
    const offsetLat = (offset[1] / mapHeight) * (bounds.getNorth() - bounds.getSouth()) * 0.1

    const southWest = bounds.getSouthWest()
    const northEast = bounds.getNorthEast()

    return new mapboxgl.LngLatBounds(
        [southWest.lng + offsetLng, southWest.lat + offsetLat],
        [northEast.lng + offsetLng, northEast.lat + offsetLat]
    )
}

function flyToBounds(
    map: mapboxgl.Map,
    bounds: mapboxgl.LngLatBounds,
    padding: number,
    maxZoom: number
) {
    map.fitBounds(bounds, {
        padding: padding,
        maxZoom: maxZoom,
        speed: 0.8,
        curve: 1.42,
        easing: (t: number) => t * (2 - t),
        essential: true,
    })
}