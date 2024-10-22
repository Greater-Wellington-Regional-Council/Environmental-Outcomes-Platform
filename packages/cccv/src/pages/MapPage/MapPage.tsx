import { useContext, useEffect, useRef, useState } from "react"
import { useLoaderData } from "react-router-dom"
import { Layer, Source } from "react-map-gl"
import { Feature, FeatureCollection } from "geojson"

import "./MapPage.scss"
import gwrcLogo from "@images/printLogo_2000x571px.png"
import { LabelAndValue } from "@elements/ComboBox/ComboBox"
import { IMViewLocation } from "@shared/types/global"
import { DEFAULT_ZOOM } from "@components/InteractiveMap/lib/useViewState.ts"
import { CombinedMapRef } from "@components/InteractiveMap/lib/InteractiveMap"
import mapProperties from "@values/mapProperties.ts"

import AddressSearch from "@components/AddressSearch/AddressSearch"
import FreshwaterManagementUnit from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit"
import SlidingPanel from "@components/InfoPanel/SlidingPanel"
import ErrorContext from "@components/ErrorContext/ErrorContext"
import useLoadingIndicator from "@components/LoadingIndicator/useLoadingIndicator"

import useEscapeKey from "@lib/useEscapeKey"
import { useMapSnapshot } from "@lib/MapSnapshotContext"
import useMapTooltip from "@lib/useMapTooltip"
import addPropertiesToGeoJSON from "@lib/addPropertiesToGeoJSON.ts"
import { calculateCentroids } from "@lib/calculatePolygonCentoid"

import freshwaterManagementService from "@services/FreshwaterManagementUnitService/FreshwaterManagementUnitService.ts"
import addressesService from "@services/AddressesService/AddressesService.ts"
import linzDataService from "@services/LinzDataService/LinzDataService.ts"

import { FmuFullDetails } from "@models/FreshwaterManagementUnit"
import PhysicalAddress from "@components/PhysicalAddress/PhysicalAddress.tsx"
import tooltipProperties from "@lib/values/tooltips.ts"
import {TANGATA_WHENUA_SOURCE, TTW_HIGHLIGHT_LAYER} from "@lib/values/mapSourceAndLayerIds.ts"
import InteractiveMap from "@components/InteractiveMap/InteractiveMap.tsx"
import StringCarousel from "@components/StringCarousel/StringCarousel.tsx"

const ADDRESS_ZOOM = 12

function GWHeader() {
    return (
        <header className="header bold p-4 pl-[1.5em] bg-nui text-white grid grid-cols-12">
            <div className="header-text col-span-10">
                <h1 className="header-title">Freshwater Management</h1>
                <h2 className="header-subtitle mb-1">Catchment context, challenges and values (CCCV)</h2>
            </div>
            <div className="header-image col-span-2 mt-2 mr-2 scale-105 ml-auto">
                <img src={gwrcLogo} style={{ maxHeight: "83px" }} alt="Greater Wellington Regional Council logo" />
            </div>
        </header>
    )
}

const useFMUSelection = () => {
    const [currentFmus, setCurrentFmus] = useState<FmuFullDetails[]>([])
    const [fmuIndex, setFmuIndex] = useState<number | null>(null)

    const fmuSelected = fmuIndex !== null

    const currentFmu = currentFmus && fmuIndex !== null ? currentFmus[fmuIndex] : null

    const clearFmus = () => {
        setCurrentFmus([])
        setFmuIndex(null)
    }

    const loadFmus = (fmus: FmuFullDetails[]) => {
        setCurrentFmus(fmus || [])
        setFmuIndex(0)
    }

    return { fmuSelected, currentFmu, fmuIndex, currentFmus, setCurrentFmus, setFmuIndex, clearFmus, loadFmus }
}

export default function MapPage() {
    const { setError } = useContext(ErrorContext)
    const locationDetails = useLoaderData()

    const [selectedLocation, selectLocation] = useState<IMViewLocation | null>(null)

    const { currentFmus, currentFmu, fmuIndex, setFmuIndex, clearFmus, loadFmus } = useFMUSelection()

    const [fmuChanged, setFmuChanged] = useState(false)

    const sliderRef = useRef<HTMLDivElement>(null)
    const [sliderWidth, setSliderWidth] = useState<number>(0)

    const { mapSnapshot } = useMapSnapshot()
    const { setLoading } = useLoadingIndicator()
    const mapRef = useRef<CombinedMapRef | null>(null)

    const fetchFmu = async () => {
        if (!selectedLocation) {
            clearFmus()
            return
        }

        const fmuList = await freshwaterManagementService.getByLocation(selectedLocation, setError)
        console.log(fmuList)

        if (!fmuList || fmuList.length === 0) {
            clearFmus()
            setError(new Error("No Freshwater Management Units were found at that location, or there was an error fetching the data. Please try again."))
            return
        }

        loadFmus(fmuList)

        setFmuChanged(true)
        setError(null)
    }

    useEffect(() => {
        fetchFmu().catch((e) => console.error(e))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLocation, setError, mapSnapshot])

    useEscapeKey(() => {
        selectLocation(null)
        mapRef.current?.getMap().zoomTo(DEFAULT_ZOOM)
    })

    const selectAddress = async (address: LabelAndValue | null = null) => {
        if (!address) return

        setLoading(true)

        clearFmus()
        selectLocation(null)

        try {
            const physicalAddress = await addressesService.getAddressByPxid(address.value)

            if (!physicalAddress) {
                setError(new Error("Address not found"))
                return
            }

            const addressBoundary = await linzDataService.getGeometryForAddressId(physicalAddress.id)

            let location: IMViewLocation

            if (!addressBoundary) {
                setError(new Error("Failed to retrieve address data. The LINZ service may be unavailable."))

                location = {
                    longitude: physicalAddress.location.geometry.coordinates[0],
                    latitude: physicalAddress.location.geometry.coordinates[1],
                    description: `<p>${physicalAddress.address}</p><br/><p class="tooltip-note">Boundary not available</p>`,
                    zoom: ADDRESS_ZOOM,
                } as IMViewLocation
            } else {
                const centroid = calculateCentroids(addressBoundary)

                const desc = `<p>${physicalAddress.address}</p>`

                location = {
                    longitude: centroid[0] || physicalAddress.location.geometry.coordinates[0],
                    latitude: centroid[1] || physicalAddress.location.geometry.coordinates[1],
                    description: desc + (centroid[0] ? "" : '<p class="tooltip-note">Boundary not available</p>'),
                    zoom: ADDRESS_ZOOM,
                    featuresInFocus: addPropertiesToGeoJSON(addressBoundary, { location: physicalAddress.address }),
                    address: physicalAddress,
                } as IMViewLocation
            }

            selectLocation(location)
            setError(null)
        } catch (error) {
            console.error(error)
            setError(new Error("An error occurred while selecting the address"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (sliderRef.current) {
            setSliderWidth(sliderRef.current.clientWidth)
        }
    }, [currentFmu])

    const { Tooltip } = useMapTooltip({
        mapRef,
        source: tooltipProperties})

    return (
        <div className="map-page bg-white">
            <GWHeader />

            <main role="application">
                <div className="map-panel relative">
                    <InteractiveMap
                        startLocation={locationDetails as IMViewLocation}
                        locationInFocus={selectedLocation}
                        setLocationInFocus={selectLocation}
                        hidden={sliderWidth}
                        mapRef={mapRef}
                        highlights_source_url={freshwaterManagementService.urlToGetFmuBoundaries()}
                    >
                        {currentFmu && (
                            <Source id={TANGATA_WHENUA_SOURCE} type="geojson" data={currentFmu.tangataWhenuaSites}>
                                <Layer
                                    id={TTW_HIGHLIGHT_LAYER}
                                    type="fill"
                                    paint={mapProperties.tangataWhenua.fill}
                                    source={TANGATA_WHENUA_SOURCE}
                                />
                                {Tooltip && <Tooltip />}
                            </Source>
                        )}
                    </InteractiveMap>

                    <div className="address-box">
                        <AddressSearch onSelect={selectAddress} placeholder="Search for address" directionUp={true} />
                    </div>

                    {currentFmu && (
                        <SlidingPanel showPanel={!!currentFmus.length} contentChanged={fmuChanged} onClose={() => clearFmus()}>
                            {/*{currentFmus.length > 1 && (<FmuPanelHeader className={"ml-6 mb-8"} fmuName1={currentFmu.freshwaterManagementUnit.fmuName1!}/>)}*/}
                            {selectedLocation?.address && <PhysicalAddress address={selectedLocation.address} />}
                            {currentFmus.length > 1 && (<div className={"mb-0"}>
                                <div className={"text-sm text-center font-light mb-0"}>{`This property sits on ${currentFmus.length} catchments`}</div>
                                <StringCarousel className={"mb-0"} displayValues={currentFmus.map((fmu) => fmu.freshwaterManagementUnit.fmuName1!)} index={fmuIndex} setIndex={setFmuIndex} />
                                <div className="text-sm text-center font-extralight mb-2">{`Catchment ${fmuIndex!+1} of ${currentFmus.length}`}</div>
                            </div>)}
                            <FreshwaterManagementUnit
                                key={0}
                                {...currentFmu}
                                mapImage={mapSnapshot}
                                links={{
                                    tangataWhenuaSites: TANGATA_WHENUA_SOURCE,
                                    gotoLink: (f: Feature | FeatureCollection) =>
                                        selectLocation({
                                            featuresInFocus: f
                                        }),
                                }}
                                showHeader={currentFmus.length === 1}
                            />
                        </SlidingPanel>
                    )}
                </div>
            </main>
        </div>
    )
}