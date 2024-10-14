import React, { useState, useEffect, Key } from "react"
import manaWhenuaSiteService from "@services/ManaWhenuaSiteService.ts"
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

interface TangataWhenuaSitesProps {
    tangataWhenuaSites: FeatureCollection<Geometry, GeoJsonProperties>;
    gotoTangataWhenua: (index: number) => void;
}

const TangataWhenuaSites: React.FC<TangataWhenuaSitesProps> = ({ tangataWhenuaSites, gotoTangataWhenua }) => {
    const [siteDescriptions, setSiteDescriptions] = useState<{ [key: string]: string | undefined }>({})

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

    return (
        <>
            {tangataWhenuaSites?.features.length ? (
                <div className="tangata-whenua mt-6">
                    <h2>Tangata Whenua</h2>
                    <p>This area contains sites of significance to Tangata Whenua including:</p>
                    <div className="tangata-whenua-sites">
                        <ul className="mt-2 list-disc cursor-pointer">
                            {tangataWhenuaSites?.features.map((site: Feature, siteIndex: number) => (
                                <li className="my-0" key={siteIndex} onClick={() => gotoTangataWhenua(siteIndex)}>
                                    {site?.properties?.location}
                                    <ul className="flex flex-wrap gap-4 list-none p-0 m-0 mt-4 mb-6">
                                        {site?.properties?.locationValues?.map((siteName: string, index: Key | null | undefined) => (
                                            <li className="list-none ml-0 inset-0 bg-gray-300 indent-0 px-2"
                                                key={index}
                                                title={siteDescriptions[siteName] || "Loading..."}>{siteName}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </>
    )
}

export default TangataWhenuaSites