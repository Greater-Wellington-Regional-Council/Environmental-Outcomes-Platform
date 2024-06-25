const env = import.meta.env;
import _ from 'lodash';

const envVar = (name: string, defaultValue: unknown | null = null): string =>
  _.get(env, name,
    _.get(env, `VITE_${name}`,
      _.get(env, `REACT_${name}`, defaultValue)
    )
  );

export type EnvVars = { [key: string]: string };

const config = {
  LINZ_API_KEY: envVar("LINZ_API_KEY", 'missing-linz-api-key'),
  MAPBOX_TOKEN: envVar( "MAPBOX_TOKEN", 'missing-mapbox-token'),
  ADDRESS_FINDER_KEY: envVar("ADDRESS_FINDER_KEY" ),
  ADDRESS_FINDER_SECRET:  envVar( "ADDRESS_FINDER_SECRET" ),
};

export default config;
