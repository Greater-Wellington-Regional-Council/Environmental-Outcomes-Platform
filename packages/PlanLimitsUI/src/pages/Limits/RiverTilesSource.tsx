import { Layer, Source } from 'react-map-gl';

function determineTileServerHost(hostname: string) {
  switch (hostname) {
    case 'plan-limits.gw-eop-dev.tech':
      return 'https://tiles.gw-eop-dev.tech';
    case 'plan-limits.gw-eop-stage.tech':
      return 'https://tiles.gw-eop-stage.tech';
    case 'app.eop.gw.govt.nz':
      return 'https://tiles.eop.gw.govt.nz';
    default:
      return 'http://127.0.0.1:7800';
  }
}

const tileServerHost = determineTileServerHost(window.location.hostname);

export default function RiverTilesSource({ zoom }: { zoom: number }) {
  let minStreamOrder;
  if (zoom <= 8) {
    minStreamOrder = 5;
  } else if (zoom <= 11) {
    minStreamOrder = 4;
  } else {
    minStreamOrder = 3;
  }

  const streamOrderFilter = encodeURIComponent(
    `stream_order >= ${minStreamOrder}`
  );
  const riverTilesUrl = `${tileServerHost}/public.river_tile_features/{z}/{x}/{y}.pbf?filter=${streamOrderFilter}`;

  return (
    <Source id="rivers" type="vector" tiles={[riverTilesUrl]}>
      <Layer
        id="river-line"
        type="line"
        source-layer="public.river_tile_features"
        paint={{
          'line-width': ['+', 0, ['get', 'stream_order']],
          'line-color': [
            'match',
            ['get', 'stream_order'],
            1,
            '#9bc4e2',
            2,
            '#9bc4e2',
            3,
            '#9bc4e2',
            4,
            '#17569B',
            5,
            '#17569B',
            6,
            '#17569B',
            7,
            '#17569B',
            8,
            '#17569B',
            '#17569B',
          ],
        }}
      />
    </Source>
  );
}
