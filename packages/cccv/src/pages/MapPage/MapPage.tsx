import React, { useContext, useEffect, useRef, useState } from "react"
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

import InteractiveMap, { HOVER_LAYER } from "@components/InteractiveMap/InteractiveMap"
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
import addressesService, { Address } from "@services/AddressesService/AddressesService.ts"
import linzDataService from "@services/LinzDataService/LinzDataService.ts"

import { FmuFullDetails } from "@models/FreshwaterManagementUnit"

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

const PhysicalAddress: React.FC<{ address: Address }> = ({ address }) => {
    return (
        <div
            className="FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden flex"
            id={`physical_address_${address.id || ""}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a5568" className="size-6">
                <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                />
            </svg>
            <div className="w-[80%]">
                {address.address.split(",").map((line, i) => (
                    <p key={i} className="w-[80%] font-bold text-lg">
                        {line}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default function MapPage() {
    const { setError } = useContext(ErrorContext)
    const locationDetails = useLoaderData()

    const [selectedLocation, selectLocation] = useState<IMViewLocation | null>(null)
    const [selectedFmu, selectFmu] = useState<FmuFullDetails[] | null>(null)

    const [showPanel, setShowPanel] = useState(false)
    const [fmuChanged, setFmuChanged] = useState(false)

    const sliderRef = useRef<HTMLDivElement>(null)
    const [sliderWidth, setSliderWidth] = useState<number>(0)

    const { mapSnapshot } = useMapSnapshot()
    const { setLoading } = useLoadingIndicator()
    const mapRef = useRef<CombinedMapRef | null>(null)

    const fetchFmu = async () => {
        if (!selectedLocation) {
            setShowPanel(false)
            selectFmu(null)
            return
        }

        const fmuBylatLng = await freshwaterManagementService.getByLocation(selectedLocation, setError)
        const fmuList = fmuBylatLng ? [fmuBylatLng] : null

        setShowPanel(fmuList != null && fmuList.length > 0)
        selectFmu(fmuList)
        setFmuChanged(selectedFmu != null && fmuList != null && JSON.stringify(fmuList) !== JSON.stringify(selectedFmu))

        fmuList && setError(null)
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
        selectFmu(null)
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
    }, [showPanel])

    const TANGATA_WHENUA_SOURCE = "freshwater-management-ttw-sites"
    const TTW_HIGHLIGHT_LAYER = "ttw-highlight"

    const { Tooltip } = useMapTooltip({
        mapRef,
        source: [
            {
                layer: TTW_HIGHLIGHT_LAYER,
                property: "properties.location",
                options: {
                    "fill-color": "black",
                    "fill-outline-color": "black",
                    "text-color": "white",
                    "fill-opacity": 0.8,
                    "font-weight": "bold",
                },
            },
            {
                layer: HOVER_LAYER,
                property: "properties.fmuName1",
                options: {
                    "fill-color": "white",
                    "fill-outline-color": "purple",
                    "text-color": "black",
                    "fill-opacity": 0.8,
                    "font-weight": "normal",
                },
            },
        ],
    })

    const tangataWhenuaSitesData = selectedFmu
        ? {
            type: "FeatureCollection",
            features: selectedFmu.flatMap((fmu) => fmu.tangataWhenuaSites?.features || []),
        }
        : null

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
                        {tangataWhenuaSitesData && (
                            <Source id={TANGATA_WHENUA_SOURCE} type="geojson" data={tangataWhenuaSitesData}>
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

                    {selectedFmu && selectedFmu.length > 0 && (
                        <SlidingPanel showPanel={showPanel} contentChanged={fmuChanged} onClose={() => setShowPanel(false)}>
                            {selectedLocation?.address && <PhysicalAddress address={selectedLocation.address} />}
                            <FreshwaterManagementUnit
                                key={0}
                                {...selectedFmu[0]}
                                mapImage={mapSnapshot}
                                links={{
                                    tangataWhenuaSites: TANGATA_WHENUA_SOURCE,
                                    gotoLink: (f: Feature | FeatureCollection) =>
                                        selectLocation({
                                            ...selectedLocation,
                                            address: undefined,
                                            featuresInFocus: f,
                                        }),
                                }}
                            />
                        </SlidingPanel>
                    )}
                </div>
            </main>
        </div>
    )
}