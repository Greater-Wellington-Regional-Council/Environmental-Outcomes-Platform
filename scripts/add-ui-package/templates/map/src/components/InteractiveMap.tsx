import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import {useState} from "react";

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function InteractiveMap({ startLocation }: { startLocation: ViewLocation }) {
    const location = useState(startLocation)[0]
    return (
        <div className="InteractiveMap" role="application" data-testid="InteractiveMap">
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={location}
                style={{width: 1200, height: 800}}
                mapStyle={`https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${LINZ_API_KEY}`}
            />
        </div>
    )
}
