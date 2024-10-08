import './MapPage.scss'
import InteractiveMap, {HOVER_LAYER} from "@components/InteractiveMap/InteractiveMap"
import {useLoaderData} from "react-router-dom"
import {FmuFullDetails} from "@models/FreshwaterManagementUnit"
import useEscapeKey from "@lib/useEscapeKey"
import {useContext, useEffect, useRef, useState} from "react"
import ErrorContext from "@components/ErrorContext/ErrorContext"
import freshwaterManagementService from "@services/FreshwaterManagementUnitService"
import gwrcLogo from "@images/printLogo_2000x571px.png"
import AddressSearch from "@components/AddressSearch/AddressSearch"
import addressesService from "@services/AddressesService"
import {LabelAndValue} from "@elements/ComboBox/ComboBox"
import {IMViewLocation} from "@shared/types/global"
import {calculateCentroids} from "@lib/calculatePolygonCentoid"
import linzDataService from "@services/LinzDataService"
import SlidingPanel from '@components/InfoPanel/SlidingPanel'
import FreshwaterManagementUnit from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit"
import {useMapSnapshot} from "@lib/MapSnapshotContext"
import useLoadingIndicator from "@components/LoadingIndicator/useLoadingIndicator"
import {Layer, Source} from "react-map-gl"
import freshwaterManagementUnitService from "@services/FreshwaterManagementUnitService.ts"
import {Feature, FeatureCollection} from "geojson"
import mapProperties from "@values/mapProperties.ts"
import {CombinedMapRef} from "@components/InteractiveMap/lib/InteractiveMap"
import useMapTooltip from '@lib/useMapTooltip'
import addPropertiesToGeoJSON from "@lib/addPropertiesToGeoJSON.ts"

const ADDRESS_ZOOM = 12

function GWHeader() {
    return <header
        className={"header bold p-4 pl-[1.5em] bg-nui text-white grid grid-cols-12"}>
        <div className={"header-text col-span-10"}>
            <h1 className={"header-title"}>Freshwater Management</h1>
            <h2 className={"header-subtitle mb-1"}>Catchment context, challenges and values (CCCV)</h2>
        </div>
        <div className={"header-image col-span-2 mt-2 mr-2 scale-105 ml-auto"}>
            <img src={gwrcLogo} style={{maxHeight: "83px"}}
                 alt={"Greater Wellington Regional Council logo"}/>
        </div>
    </header>
}

export default function MapPage() {
    const setError = useContext(ErrorContext).setError
    const locationDetails = useLoaderData()

    const [selectedLocation, selectLocation] = useState<IMViewLocation | null>(null)
    const [selectedFmu, selectFmu] = useState<FmuFullDetails | null>(null)

    const [showPanel, setShowPanel] = useState(false)
    const [fmuChanged, setFmuChanged] = useState(false)

    const sliderRef = useRef<HTMLDivElement>(null)
    const [sliderWidth, setSliderWidth] = useState<number>(0)

    const {mapSnapshot} = useMapSnapshot()

    const {setLoading} = useLoadingIndicator()

    const mapRef = useRef<CombinedMapRef | null>(null)

    const fetchFmu = async () => {
        if (!selectedLocation) {
            setShowPanel(false)
            selectFmu(null)
            return
        }

        const fmu = await freshwaterManagementService.getByLocation(selectedLocation, setError)

        setFmuChanged(selectedFmu != null && fmu != null && (fmu != selectedFmu))
        setShowPanel(fmu != null)
        selectFmu(fmu)

        fmu && setError(null)
    }

    useEffect(() => {
        fetchFmu().then().catch((e) => setError(e))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation, setError, mapSnapshot])

    useEscapeKey(() => {
        setShowPanel(false)
        selectLocation(null)
    })

    const selectAddress = async (address: LabelAndValue | null = null) => {
        if (!address) return

        setLoading(true)
        selectFmu(null)
        selectLocation(null)

        const selectedAddress = await addressesService.getAddressByPxid(address.value)

        if (!selectedAddress) {
            setError(new Error("Address not found"))
            setLoading(false)
            return
        }

        const addressBoundary = await linzDataService.getGeometryForAddressId(selectedAddress.id)

        if (!addressBoundary) {
            setError(new Error("Failed to retrieve address data.  The LINZ service may be unavailable."))

            // Default address Point if no geometry is available
            const addressLocation = {
                longitude: selectedAddress.location.geometry.coordinates[0],
                latitude: selectedAddress.location.geometry.coordinates[1],
                description: `<p>${selectedAddress.address}</p><br/><p class="tooltip-note">Boundary not available</p>`,
                zoom: ADDRESS_ZOOM,
            } as IMViewLocation

            selectLocation(addressLocation)

            setLoading(false)
            return
        }

        // We have an address and a boundary object.
        // Use centroid of boundary as location if possible,
        // but resort to address location is that cannot be calculated.
        const centroid = calculateCentroids(addressBoundary!)

        const desc = `<p>${selectedAddress.address}</p>`

        const location = {
            longitude: centroid[0] || selectedAddress.location.geometry.coordinates[0],
            latitude: centroid[1] || selectedAddress.location.geometry.coordinates[1],
            description: desc + (centroid[0] ? '' : '<p class="tooltip-note">Boundary not available</p>'),
            zoom: ADDRESS_ZOOM,
            featuresInFocus: addPropertiesToGeoJSON(addressBoundary, { location: selectedAddress.address }),
        } as IMViewLocation

        selectLocation(location)
        setLoading(false)
    }

    useEffect(() => {
        if (sliderRef.current) {
            setSliderWidth(sliderRef.current.clientWidth)
        }
    }, [showPanel])

    const TANGATA_WHENUA_SOURCE = 'freshwater-management-ttw-sites'
    const TTW_HIGHLIGHT_LAYER = 'ttw-highlight'

    const { Tooltip } = useMapTooltip({
        mapRef,
        source: [
            {
                layer: TTW_HIGHLIGHT_LAYER,
                property: 'properties.fmuName1',
                options: {
                    'fill-color': 'orange',
                    'fill-outline-color': 'black',
                    'text-color': 'black',
                    'fill-opacity': 0.5,
                    'font-weight': 'normal',
                },
            },
            {
                layer: 'focusView-layer',
                property: 'properties.location',
                options: {
                    'fill-color': 'yellow',
                    'fill-outline-color': 'blue',
                    'text-color': 'black',
                    'fill-opacity': 0.7,
                    'font-weight': 'normal',
                },
            },
            {
                layer: HOVER_LAYER,
                property: 'properties.description',
                options: {
                    'fill-color': 'yellow',
                    'fill-outline-color': 'purple',
                    'text-color': 'red',
                    'fill-opacity': 0.5,
                    'font-weight': 'normal',
                },
            },
        ],
    })

    return (
        <div className="map-page bg-white">
            <GWHeader/>

            <main role="application">
                {/* Position the sliding panel relative to this map panel */}
                <div className={`map-panel relative`}>
                    <InteractiveMap startLocation={locationDetails as IMViewLocation} locationInFocus={selectedLocation}
                                    setLocationInFocus={(selectLocation)} hidden={sliderWidth} mapRef={mapRef}
                                    highlights_source_url={freshwaterManagementUnitService.urlToGetFmuBoundaries()}>
                        {selectedFmu?.tangataWhenuaSites && (
                            <Source
                                id={TANGATA_WHENUA_SOURCE}
                                type="geojson"
                                data={selectedFmu?.tangataWhenuaSites}>

                                {selectedFmu && (
                                    <Layer
                                        id={TTW_HIGHLIGHT_LAYER}
                                        type="fill"
                                        paint={mapProperties.tangataWhenua.fill}
                                        source={TANGATA_WHENUA_SOURCE}
                                    />)}
                                {Tooltip && <Tooltip />}
                            </Source>
                        )}
                    </InteractiveMap>
                    <div className={`address-box`}>
                        <AddressSearch
                            onSelect={selectAddress}
                            placeholder={"Search for address"}
                            directionUp={true}
                        />
                    </div>

                    {selectedFmu && (
                        <SlidingPanel
                            showPanel={showPanel}
                            contentChanged={fmuChanged}
                            onClose={() => setShowPanel(false)}>
                            <FreshwaterManagementUnit {...selectedFmu} mapImage={mapSnapshot} links={{
                                tangataWhenuaSites: TANGATA_WHENUA_SOURCE,
                                gotoLink: (f: Feature | FeatureCollection) => selectLocation({...selectedLocation, featuresInFocus: f})
                            }}/>
                        </SlidingPanel>
                    )}
                </div>
            </main>
        </div>
    )
}