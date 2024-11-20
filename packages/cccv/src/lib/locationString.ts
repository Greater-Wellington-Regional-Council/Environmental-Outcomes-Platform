import proj4 from '@lib/proj4'
import {PinnedLocation, IMViewLocation} from "@shared/types/global"
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

export function parseLocationString(
  locationString: string
): IMViewLocation | null {
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
}: IMViewLocation) {
  return `@${roundToThreeDecimals(latitude ?? 0)},${roundToThreeDecimals(
    longitude ?? 0
  )},${Math.round(zoom ?? DEFAULT_ZOOM)}z`
}

export function createPinnedLocationString({
  latitude,
  longitude
}: PinnedLocation) {
  return `${roundToThreeDecimals(latitude)},${roundToThreeDecimals(longitude)}`
}

export function defineProjections() {
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
    ]
  ])
}

export function toEpsg4326(lng: number, lat: number, from= "EPSG:2193") {
  const to = "EPSG:4326"

  if (!projectionsDefined(from, to))
    return

  return proj4(from, to, [lng, lat])
}

function projectionsDefined(from: string, to: string) {
  if (!proj4.defs(from) || !proj4.defs(to))
    defineProjections()

  if (!proj4.defs(from))
    throw new Error(`Projection ${from} is not defined`)

  if (!proj4.defs(to))
    throw new Error(`Projection ${to} is not defined`)

  return true
}

export function targetProjection(lngLat: number[], reverse = false, from= "EPSG:2193", to = "EPSG:4326") {
  if (!projectionsDefined(from, to))
    return undefined

  return proj4(reverse ? to : from, reverse ? from : to, [lngLat[0], lngLat[1]])
}
