import { Polygon } from "geojson";


const calculatePolygonCentroid = (shape: Polygon): [number, number] => {
  let x = 0, y = 0, n = 0;
  for (let i = 0; i < shape.coordinates[0].length; i++) {
    const point = shape.coordinates[0][i];
    x += point[0];
    y += point[1];
    n++;
  }
  return [x / n, y / n];
};

export default calculatePolygonCentroid;