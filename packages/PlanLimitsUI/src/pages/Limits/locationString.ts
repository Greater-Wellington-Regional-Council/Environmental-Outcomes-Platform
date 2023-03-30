export type PinnedLocation = {
  longitude: number;
  latitude: number;
};

export type ViewLocation = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export function parseLocationString(
  locationString?: String
): ViewLocation | null {
  if (!locationString) {
    return null;
  }

  // e.g. -00.000,000.000,1Z
  const match = locationString.match(
    /^@(-?\d?\d?(\.\d{1,3})?),(\d?\d?\d?(\.\d{1,3})?),(\d\d?)z$/
  );

  return match
    ? {
        latitude: Number(match[1]),
        longitude: Number(match[3]),
        zoom: Number(match[5]),
      }
    : null;
}

export function parsePinnedLocation(
  pinnedLocationString: String | null
): PinnedLocation | null {
  if (!pinnedLocationString) {
    return null;
  }

  const match = pinnedLocationString.match(
    /^(-?\d?\d?(\.\d{1,3})?),(\d?\d?\d?(\.\d{1,3})?)$/
  );

  return match
    ? {
        latitude: Number(match[1]),
        longitude: Number(match[3]),
      }
    : null;
}

function roundToThreeDecimals(value: number) {
  return Math.round(value * 1000) / 1000;
}

export function createLocationString({
  latitude,
  longitude,
  zoom,
}: ViewLocation) {
  return `@${roundToThreeDecimals(latitude)},${roundToThreeDecimals(
    longitude
  )},${Math.round(zoom)}z`;
}

export function createPinnedLocationString({
  latitude,
  longitude,
}: PinnedLocation) {
  return `${roundToThreeDecimals(latitude)},${roundToThreeDecimals(longitude)}`;
}
