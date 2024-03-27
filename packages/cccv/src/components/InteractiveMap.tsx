import 'mapbox-gl/dist/mapbox-gl.css';
import './InteractiveMap.scss';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as mapboxgl from 'mapbox-gl';
import { QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { determineBackendUri } from '@src/lib/api.tsx';
import proj4 from '@lib/proj4';


const LINZ_API_KEY = import.meta.env.VITE_LINZ_API_KEY;
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const PopupContent = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
  const fetchFmuData = () => {
    const [lng2193, lat2193] = proj4('EPSG:4326', 'EPSG:2193', [longitude, latitude]);
    const url = `${determineBackendUri(window.location.hostname)}/farm-management-units?lng=${lng2193}&lat=${lat2193}`;
    return fetch(url)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        throw err;
      });
  };

  const { isPending, error, data } = useQuery({
    queryFn: () => fetchFmuData(),
    queryKey: ['fmu'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  if (isPending) {
    return 'Loading...';
  }

  return (
    <div id={'popup-container'}>
      {(data && (Object.keys(data).length > 0)) ? <>
        <h2>FMU</h2>
          {
            Object.entries(data).slice(0).map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key}>
                    {Object.entries(value).slice(0, 7).map(([nestedKey, nestedValue]) => (
                      <p key={nestedKey}>{`${nestedKey}: ${nestedValue}`}</p>
                    ))}
                  </div>
                );
              } else {
                return <p key={key}>{`${key}: ${value}`}</p>;
              }
            })
          }</> :
        <p>No data</p>
      }
    </div>
  );
};

export default function InteractiveMap({ startLocation }: { startLocation: ViewLocation }) {
  const queryClient = useQueryClient();
  const [location] = useState(startLocation);
  const [dblClick, setDblClick] = useState(false);

  proj4.defs([
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
    [
      'EPSG:4269',
      '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees',
    ],
    [
      'EPSG:2193',
      '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
    ],
  ]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: `https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${LINZ_API_KEY}`, // style URL
      center: [location.longitude, location.latitude], // starting position [lng, lat]
      zoom: location.zoom,
      accessToken: MAPBOX_TOKEN,
    });

    map.on('dblclick', () => {
      setDblClick(true);
    });

    map.on('click', (e) => {
      if (!dblClick) {
        const htmlString = '<div id="popup-container"></div>';
        const popup = new mapboxgl.Popup();
        popup.setLngLat([e.lngLat.lng, e.lngLat.lat]); // Set the popup's location to the click's location
        popup.setHTML(htmlString); // Set the content of the popup
        popup.addTo(map);

        const container = document.getElementById('popup-container');
        if (container) {
          const root = createRoot(container); // Create a root
          root.render(
            <QueryClientProvider client={queryClient}>
              <PopupContent latitude={e.lngLat.lat} longitude={e.lngLat.lng} />
            </QueryClientProvider>,
          );
        }
      }
    });

    return () => map.remove();
  }, [location, dblClick, queryClient]);

  return (
    <div id="map" className="InteractiveMap" role="application" data-testid="InteractiveMap"
         style={{ width: '100%', height: '800px' }} />
  );
}