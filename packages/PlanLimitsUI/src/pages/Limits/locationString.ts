type ViewLocation = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export const parseLocationString = (
  locationString?: String
): ViewLocation | null => {
  if (!locationString) {
    return null;
  }
  const match = locationString.match(
    /@(-?\d?\d?.\d*),(\d?\d?\d?\.\d*),(\d\d?)z/
  );

  return match
    ? {
        latitude: Number(match[1]),
        longitude: Number(match[2]),
        zoom: Number(match[3]),
      }
    : null;
};

const roundToThreeDecimals = (value: number) => Math.round(value * 1000) / 1000;

export const createLocationString = ({
  latitude,
  longitude,
  zoom,
}: ViewLocation) => {
  return `@${roundToThreeDecimals(latitude)},${roundToThreeDecimals(
    longitude
  )},${Math.round(zoom)}z`;
};
