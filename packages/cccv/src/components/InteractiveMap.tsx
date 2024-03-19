import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import {useEffect, useState} from "react";
import * as mapboxgl from "mapbox-gl";

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function InteractiveMap({ startLocation }: { startLocation: ViewLocation }) {
    const [location] = useState(startLocation)

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: `https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${LINZ_API_KEY}`, // style URL
            center: [location.longitude, location.latitude], // starting position [lng, lat]
            zoom: location.zoom,
            accessToken: MAPBOX_TOKEN
        });

        map.on('click', (event) => {
            console.log(`You clicked at ${event.lngLat.lng}, ${event.lngLat.lat}`);
            // Add your logic here to handle clicks on the map

        });

        return () => map.remove();
    }, [location]);

    return (
        <div id="map" className="InteractiveMap" role="application" data-testid="InteractiveMap"  style={{ width: '100%', height: '800px' }} />
    )
}
