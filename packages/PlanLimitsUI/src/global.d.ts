interface Council {
  slug: string;
  name: string;
  defaultViewLocation: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

interface PinnedLocation {
  longitude: number;
  latitude: number;
}

interface ViewLocation {
  longitude: number;
  latitude: number;
  zoom: number;
}
