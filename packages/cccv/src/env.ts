const env = import.meta.env;

const config = {
  LINZ_API_KEY: env.VITE_LINZ_API_KEY || env.REACT_LINZ_API_KEY || env.LINZ_API_KEY  || 'missing-linz-api-key',
  MAPBOX_TOKEN: env.VITE_MAPBOX_TOKEN || env.REACT_MAPBOX_TOKEN || env.MAPBOX_TOKEN  || 'missing-mapbox-token',
};

export default config;
