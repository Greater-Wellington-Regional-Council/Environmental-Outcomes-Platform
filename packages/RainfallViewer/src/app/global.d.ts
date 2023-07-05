interface RainfallObservation {
  id: number;
  name: string;
  amount: number | null;
  // HACK: mapbox seems to serialize properties which are objects to JSON. So
  // we need to type as a string
  hourly_data: string;
  council_name: string;
  council_id: number;
  first_observation_at: string;
  last_observation_at: string;
  observation_count: number;
}

type ColorScale = Array<[number | null, string]>;

interface QSParams {
  hours: number;
  to: date;
  showAccumulation: boolean;
  showTotals: boolean;
}

type ViewParams = QSParams & {
  from: date;
  canShow1HrLater: boolean;
  canShow24HrLater: boolean;
  colorScale: ColorScale;
};

interface MapView {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface Council {
  id: number;
  name: string;
  url: string;
  logo: string;
  defaultViewLocation: MapView;
}
