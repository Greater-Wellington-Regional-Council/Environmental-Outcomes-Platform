import React, { useState, Key } from "react"
import manaWhenuaSiteService from '@services/ManaWhenuaSiteService/ManaWhenuaSiteService.ts';
import Tooltip from "@elements/Tooltip/Tooltip.tsx"
import { Feature, FeatureCollection } from "geojson"
import { MapPinIcon } from '@heroicons/react/20/solid'
import _ from "lodash"

interface TangataWhenuaSitesProps {
    tangataWhenuaSites: FeatureCollection;
    gotoTangataWhenua: (index: number) => void;
    culturalOverview?: string | null;
}

const TangataWhenuaSites: React.FC<TangataWhenuaSitesProps> = ({ tangataWhenuaSites, gotoTangataWhenua, culturalOverview = null }) => {
    const [tooltip, setTooltip] = useState<{ description: string | null; x: number; y: number; isLoading: boolean } | null>(null)

    const showSiteDescription = async (e: React.MouseEvent<HTMLLIElement>, site: Feature, siteName: string) => {
        e.stopPropagation()

        const parentRect = e.currentTarget.closest('.sliding-panel')?.getBoundingClientRect()
        if (!parentRect) {
            console.error("Could not find parent element.")
            return
        }

        const x = e.clientX - parentRect.left
        const y = e.clientY - parentRect.top

        setTooltip({ description: "Loading...", x, y, isLoading: true })

        const description = site?.properties?.siteDescription?.[siteName]
        setTooltip({ description: description || "No description available", x, y, isLoading: false })
    }

    const hideTooltip = () => {
        setTooltip(null)
    }

    return (
        <>
            {tangataWhenuaSites?.features.length ? (
                <div className="tangata-whenua mt-6" onClick={hideTooltip}>
                    <h2>Cultural Significance of the Catchment</h2>
                    {culturalOverview && <div dangerouslySetInnerHTML={{ __html: culturalOverview }} />}
                    <h3 className="mt-6">Sites of Significance</h3>
                    <p className="mt-2">This area contains sites of significance to Tangata Whenua including:</p>
                    <div className="tangata-whenua-sites">
                        <ul className="mt-2 cursor-pointer">
                            {tangataWhenuaSites?.features.sort((a) => a?.properties?.sourceName == "Schedule C" ? 0 : -1).reverse().map((site: Feature, siteIndex: number) => (
                                <li className="list-none" key={siteIndex} onClick={() => gotoTangataWhenua(siteIndex)}>
                                    <div className="group">
                                        <MapPinIcon className="h-4 w-4 inline-block mr-2 group-hover:fill-kaitoke" onClick={() => gotoTangataWhenua(siteIndex)} />
                                        <span className={"underline decoration-dashed decoration-1 group-hover:text-kaitoke"}>{site?.properties?.location}</span>
                                    </div>

                                    <ul className="flex flex-wrap gap-4 list-none p-0 m-0 mt-4 mb-6">
                                        {site?.properties?.sites?.map((siteName: string, index: Key | null | undefined) => (
                                            <li
                                                className="list-none ml-0 mt-0 inset-0 bg-gray-300 indent-0 px-2 hover:underline hover:decoration-dashed"
                                                key={index}
                                                onClick={(e) => showSiteDescription(e, site, siteName)}
                                            >
                                                {siteName.replace(/_/g, " ")}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>

                        {tooltip && (
                            <Tooltip
                                description={tooltip.isLoading ? "Loading..." : tooltip.description}
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
