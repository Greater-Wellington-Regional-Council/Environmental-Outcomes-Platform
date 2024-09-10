export function removeSourceWithLayers(map: mapboxgl.Map | undefined, sourceId: string): void {
    if (!map || !sourceId) {
        return
    }

    const layers = map.getStyle()?.layers || []

    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i]
        if (layer.source === sourceId) {
            const layerId = layer.id
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId)
            }
        }
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId)
    }
}