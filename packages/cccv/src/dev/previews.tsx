import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox"
import {PaletteTree} from "./palette"
import InteractiveMap from "@components/InteractiveMap/InteractiveMap.tsx"
import React from "react"
import {ViewLocation} from "@lib/types/global"
import {CombinedMapRef} from "@components/InteractiveMap/lib/InteractiveMap"

interface ComponentPreviewsProps {
    highlights_source_url: string,
    mapRef: React.RefObject<CombinedMapRef | null>,
    startLocation: ViewLocation
}

const ComponentPreviews = ({ highlights_source_url, mapRef, startLocation }: ComponentPreviewsProps) => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/InteractiveMap">
                <InteractiveMap highlights_source_url={highlights_source_url} mapRef={mapRef} startLocation={startLocation}/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews