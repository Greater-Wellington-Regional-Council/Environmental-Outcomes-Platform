export const urlAerialMapStyle = (apiKey: string) => `https://basemaps.linz.govt.nz/v1/tiles/aerial/EPSG:4326/style/aerial.json?api=${apiKey}`;
export const urlTopographicMapStyle = (apiKey: string) => `https://basemaps.linz.govt.nz/v1/tiles/topographic/EPSG:4326/style/topographic.json?api=${apiKey}`

export const urlDefaultMapStyle = (apiKey: string) => urlTopographicMapStyle(apiKey);