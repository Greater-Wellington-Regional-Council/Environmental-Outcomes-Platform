import { Polygon, MultiPolygon, Feature, FeatureCollection, Geometry } from 'geojson'

const calculateCentroidForPolygon = (polygon: Polygon): [number, number] => {
  let x = 0, y = 0, n = 0
  const coordinates = polygon.coordinates[0]

  for (let i = 0; i < coordinates.length; i++) {
    const point = coordinates[i]
    x += point[0]
    y += point[1]
    n++
  }

  return [x / n, y / n]
}

const calculatePolygonCentroid = (shape: Polygon | MultiPolygon): [number, number] => {
  let totalX = 0, totalY = 0, totalArea = 0

  if (shape.type === "Polygon") {
    return calculateCentroidForPolygon(shape)
  } else if (shape.type === "MultiPolygon") {
    for (const polygon of shape.coordinates) {
      const polyShape: Polygon = { type: "Polygon", coordinates: polygon }
      const centroid = calculateCentroidForPolygon(polyShape)
      const area = calculatePolygonArea(polyShape)
      totalX += centroid[0] * area
      totalY += centroid[1] * area
      totalArea += area
    }
  }

  return [totalX / totalArea, totalY / totalArea]
}

const calculatePolygonArea = (polygon: Polygon): number => {
  const coordinates = polygon.coordinates[0]
  let area = 0

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [x1, y1] = coordinates[i]
    const [x2, y2] = coordinates[i + 1]
    area += x1 * y2 - x2 * y1
  }

  return Math.abs(area / 2)
}

const calculateBoundingBox = (features: Feature<Geometry>[]): [number, number, number, number] => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const feature of features) {
    if (feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon") {
      const coordinates = feature.geometry.type === "Polygon"
          ? (feature.geometry as Polygon).coordinates
          : (feature.geometry as MultiPolygon).coordinates.flat(1)

      for (const polygon of coordinates) {
        for (const [x, y] of polygon) {
          if (x < minX) minX = x
          if (y < minY) minY = y
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
        }
      }
    }
  }

  return [minX, minY, maxX, maxY]
}

const calculateCentroid = (bbox: [number, number, number, number]): [number, number] => {
  const [minX, minY, maxX, maxY] = bbox
  return [(minX + maxX) / 2, (minY + maxY) / 2]
}

const calculateCentroids = (input: Feature<Geometry> | FeatureCollection): [number, number] | [] => {
  if (input.type === "FeatureCollection") {
    const bbox = calculateBoundingBox(input.features)
    return calculateCentroid(bbox)
  } else if (input.type === "Feature") {
    if (input.geometry?.type === "Polygon" || input.geometry?.type === "MultiPolygon") {
      const shape = input.geometry as Polygon | MultiPolygon
      return calculatePolygonCentroid(shape)
    }
  }

  return []
}

export { calculatePolygonCentroid, calculateCentroids, calculateBoundingBox }