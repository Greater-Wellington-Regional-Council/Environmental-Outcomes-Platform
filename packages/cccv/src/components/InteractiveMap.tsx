import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import {useEffect, useState} from "react";
import * as mapboxgl from "mapbox-gl";
import ReactDOMServer from 'react-dom/server';

const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

//TODO: Move this to a component
export const PopupContent = ({ latitude, longitude }: { latitude: number, longitude: number }) => (
    <div>
        <p>{longitude}, {latitude}</p>
    </div>
)

export default function InteractiveMap({ startLocation }: { startLocation: ViewLocation }) {
    const [location] = useState(startLocation)
    const [dblClick, setDblClick] = useState(false)

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: `https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${LINZ_API_KEY}`, // style URL
            center: [location.longitude, location.latitude], // starting position [lng, lat]
            zoom: location.zoom,
            accessToken: MAPBOX_TOKEN
        });

        map.on('dblclick', () => {
            console.log('dblclick');
            setDblClick(true);
        })

        map.on('click', (e) => {
            if (!dblClick) {
                const popup = new mapboxgl.Popup()
                const htmlString = ReactDOMServer.renderToString(<PopupContent latitude={e.lngLat.lat} longitude={e.lngLat.lng} />);
                popup.setLngLat([e.lngLat.lng, e.lngLat.lat]) // Set the popup's location to the click's location
                popup.setHTML(htmlString) // Set the content of the popup
                popup.addTo(map); // Add the popup to the map
            }
        })

        return () => map.remove();
    }, [location, dblClick]);

    return (
        <div id="map" className="InteractiveMap" role="application" data-testid="InteractiveMap"  style={{ width: '100%', height: '800px' }} />
    )
}