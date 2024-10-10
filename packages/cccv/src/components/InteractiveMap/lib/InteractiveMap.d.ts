import React, {Dispatch, MutableRefObject, SetStateAction} from "react"
import {MapRef} from "react-map-gl"
import mapboxgl from "mapbox-gl"
import {Feature, FeatureCollection} from "geojson"
import {MapPaintProperties} from "@values/mapProperties.ts"

interface MapProps {
    startLocation: ViewLocation;
    locationInFocus?: ViewLocation | null;
    hidden?: number;
}

interface InteractiveMapProps extends MapProps {
    setLocationInFocus?: Dispatch<SetStateAction<ViewLocation | null>>;
    highlights_source_url: string;
    mapRef: React.RefObject<CombinedMapRef | null>;
    children?: React.ReactNode;
}

interface BoundaryLinesLayerProps {
    id: string;
    source: string;
    mapStyle: string;
    fillColor?: string;
    fillLayer: string;
}

type CombinedMapRef = MapRef & mapboxgl.Map;

interface FeatureHighlightProps {
    highlightedFeature: Feature | FeatureCollection;
    id?: string;
    mapRef: MutableRefObject<CombinedMapRef | null>;
    paint?: MapPaintProperties;
    filter?: (string | string[] | never)[];
    source: string;
    tooltip?: {
        source: ((feature: Feature) => string);
    };
}