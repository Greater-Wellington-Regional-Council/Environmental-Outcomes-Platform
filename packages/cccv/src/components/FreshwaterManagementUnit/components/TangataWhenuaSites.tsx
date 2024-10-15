import React, { useState, useEffect, Key } from "react"
import manaWhenuaSiteService from "@services/ManaWhenuaSiteService.ts"
import Tooltip from "@elements/Tooltip/Tooltip.tsx"
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

interface TangataWhenuaSitesProps {
    tangataWhenuaSites: FeatureCollection<Geometry, GeoJsonProperties>;
    gotoTangataWhenua: (index: number) => void;
}

const TangataWhenuaSites: React.FC<TangataWhenuaSitesProps> = ({ tangataWhenuaSites, gotoTangataWhenua }) => {
    const [siteDescriptions, setSiteDescriptions] = useState<{ [key: string]: string | undefined }>({})
    const [tooltip, setTooltip] = useState<{ description: string | null; x: number; y: number } | null>(null)

    useEffect(() => {
        async function fetchDescription(siteName: string) {
            const site = await manaWhenuaSiteService.getBySiteName(siteName, (e) => console.log(e))
            setSiteDescriptions((prevDescriptions) => ({
                ...prevDescriptions,
                [siteName]: site?.explanation,
            }))
        }

        if (tangataWhenuaSites?.features) {
            tangataWhenuaSites.features.forEach((site: Feature) => {
                site?.properties?.locationValues?.forEach((siteName: string) => {
                    if (!siteDescriptions[siteName]) {
                        fetchDescription(siteName) // Fetch description for each siteName
                    }
                })
            })
        }
    }, [tangataWhenuaSites, siteDescriptions])

    const showSiteDescription = (e: React.MouseEvent<HTMLLIElement>, description: string | undefined) => {
        e.stopPropagation()

        // Get the bounding rectangle of the sliding panel (or the parent container)
        const parentRect = e.currentTarget.closest('.sliding-panel')?.getBoundingClientRect()

        if (!parentRect) {
            console.error("Could not find sliding panel element.")
            return
        }

        // Calculate tooltip position relative to the sliding panel
        const x = e.clientX - parentRect.left  // Calculate x relative to the parent
        const y = e.clientY - parentRect.top   // Calculate y relative to the parent

        console.log('Tooltip coordinates relative to sliding panel:', { x, y })

        setTooltip({ description: description || "Loading...", x, y })
    }

    const hideTooltip = () => {
        setTooltip(null)
    }

    return (
        <>
            {tangataWhenuaSites?.features.length ? (
                <div className="tangata-whenua mt-6" onClick={hideTooltip}>
                    <h2>Tangata Whenua</h2>
                    <p>This area contains sites of significance to Tangata Whenua including:</p>
                    <div className="tangata-whenua-sites">
                        <ul className="mt-2 list-disc cursor-pointer">
                            {tangataWhenuaSites?.features.map((site: Feature, siteIndex: number) => (
                                <li className="my-0" key={siteIndex} onClick={() => gotoTangataWhenua(siteIndex)}>
                                    {site?.properties?.location}
                                    <ul className="flex flex-wrap gap-4 list-none p-0 m-0 mt-4 mb-6">
                                        {site?.properties?.locationValues?.map((siteName: string, index: Key | null | undefined) => (
                                            <li
                                                className="list-none ml-0 inset-0 bg-gray-300 indent-0 px-2 hover:underline hover:decoration-dashed"
                                                key={index}
                                                onClick={(e) => showSiteDescription(e, siteDescriptions[siteName])}
                                            >
                                                {siteName}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        {tooltip && (
                            <Tooltip
                                description={tooltip.description || "Loading..."}
                                x={tooltip.x}
                                y={tooltip.y}
                                isVisible={!!tooltip}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </>
    )
}

export default TangataWhenuaSites