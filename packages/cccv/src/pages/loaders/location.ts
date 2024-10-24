import {parseLocationString} from "@lib/locationString.ts"
import {DEFAULT_ZOOM} from "@components/InteractiveMap/lib/useViewState.ts"

const loadLocation = async ({ params }: never) => {
    try {
        const p = parseLocationString((params as { location: string })?.location) || getCouncilLocation()
        return p || getCouncilLocation()
    } catch (error) {
        console.error('Failed in loadLocation:', error)
    }
}

const getCouncilLocation = () => {
  return {
    latitude: -41.2865,
    longitude: 174.7762,
    zoom: DEFAULT_ZOOM,
  }
}

export default loadLocation
