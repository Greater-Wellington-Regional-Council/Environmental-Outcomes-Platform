export function parseLocationString(
  locationString: string
): ViewLocation | null {
  // e.g. -00.000,000.000,1Z
  const match = locationString.match(
    /^@(-?\d?\d?(\.\d{1,3})?),(\d?\d?\d?(\.\d{1,3})?),(\d\d?)z$/
  )

  if (!match) return null

  return {
    latitude: Number(match[1]),
    longitude: Number(match[3]),
    zoom: Number(match[5])
  }
}

export function parsePinnedLocation(
  pinnedLocationString: string
): PinnedLocation | null {
  const match = pinnedLocationString.match(
    /^(-?\d?\d?(\.\d{1,3})?),(\d?\d?\d?(\.\d{1,3})?)$/
  )

  if (!match) return null

  return {
    latitude: Number(match[1]),
    longitude: Number(match[3])
  }
}

function roundToThreeDecimals(value: number) {
  return Math.round(value * 1000) / 1000
}

export function createLocationString({
  latitude,
  longitude,
  zoom
}: ViewLocation) {
  return `@${roundToThreeDecimals(latitude)},${roundToThreeDecimals(
    longitude
  )},${Math.round(zoom)}z`
}

export function createPinnedLocationString({
  latitude,
  longitude
}: PinnedLocation) {
  return `${roundToThreeDecimals(latitude)},${roundToThreeDecimals(longitude)}`
}
