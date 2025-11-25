import "./FreshwaterManagementUnit.scss"
import purify from "dompurify"
import React, {useEffect, useState} from "react"
import {FmuFullDetailsWithMap} from "@services/models/FreshwaterManagementUnit.ts"

import {ContaminantList, contaminants as fmuContaminants} from "@components/FreshwaterManagementUnit/utils.ts"
import EmailLink from "@components/EmailLink/EmailLink.tsx"
import {Contaminants} from "@components/Contaminants/Contaminants.tsx"
import makeSafe from "@lib/makeSafe.ts"
import {parseHtmlOrTextListToArray} from "@lib/parseHtmlOrTextListToArray.ts"
import TangataWhenuaSites from "@components/FreshwaterManagementUnit/components/TangataWhenuaSites.tsx"
import DOMPurify from "dompurify"
import {getSystemValueForCouncil, SystemValueNames} from "@services/SystemValueService/SystemValueService.ts"

export interface FmuPanelHeaderProps {
    fmuName1: string
    children?: React.ReactNode
    className?: string
}

export const FmuPanelHeader = ({fmuName1, children, className}: FmuPanelHeaderProps) => (
    <div className={["FmuPanelHeader", className].join(' ')}>
        <div className="">
            <h1 className="w-[80%]">{fmuName1 || ""}</h1>
            {children}
        </div>
    </div>
)

const FreshwaterManagementUnit = (
    details: FmuFullDetailsWithMap) => {

    const {
        id,
        fmuName1,
        farmPlanInfo,
    } = details.freshwaterManagementUnit

    const { implementationIdeas, otherInfo, vpo, culturalOverview, catchmentOverview } = farmPlanInfo ?? {}

    const showHeader = details.showHeader

    const vpoSafe = vpo ? DOMPurify.sanitize(vpo) : null

    const otherInfoSafe = otherInfo ? DOMPurify.sanitize(otherInfo) : null

    const culturalOverviewSafe = culturalOverview ? DOMPurify.sanitize(culturalOverview) : null

    const implementationIdeasSafe = implementationIdeas ? parseHtmlOrTextListToArray(implementationIdeas) : []

    const tangataWhenuaSites = details.tangataWhenuaSites

    const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit)

    const links = details.links

    const [overview, setOverview] = useState<string | undefined>(catchmentOverview ?? "")

    useEffect(() => {
        if (catchmentOverview)
            setOverview(catchmentOverview)
        else {
            (async () => {
                const fetchedOverview = await getSystemValueForCouncil(SystemValueNames.RUAMAHANGA_WHAITUA_OVERVIEW) ?? null
                setOverview(fetchedOverview || undefined)
            })()
        }
    }, [catchmentOverview, fmuName1])

    if (!details?.freshwaterManagementUnit) {
        return <div>No data found.</div>
    }

    const gotoTangataWhenua = (i: number) => {
        if (tangataWhenuaSites) {
            links?.gotoLink(tangataWhenuaSites.features[i])
        }
    }

    const outerDiv = React.createRef<HTMLDivElement>()

    return (
        <div ref={outerDiv} className="FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden" id={`fmu_${id || ''}`}>
            {showHeader && <FmuPanelHeader className={"mb-6"} fmuName1={fmuName1!}/>}

            {/* Overview */}
            <div className="overview mt-0" data-testid="catchment-desc">
                <h2>Overview</h2>
                <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(makeSafe(overview!)),
                    }}
                />
            </div>

            {/* VPO */}
            {vpoSafe && <div className="vpo mt-6" data-testid="vpo">
                <h2>Freshwater Values, Priorities, and Outcomes</h2>
                <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(makeSafe(vpoSafe)),
                    }}
                />
            </div>}

            {/* Contaminants */}
            <div className="contaminants mt-6">
                <h2>Contaminants</h2>
                <p>Freshwater objectives from {fmuName1 || ""} Whaitua Implementation Plan (as at August
                    2018)</p>

                <div className="mt-4">
                    <Contaminants contaminants={contaminants}/>
                </div>
            </div>

            {tangataWhenuaSites?.features.length ? (
                <div className="tangata-whenua mt-6">
                    <TangataWhenuaSites tangataWhenuaSites={tangataWhenuaSites}
                                        gotoTangataWhenua={gotoTangataWhenua}
                                        culturalOverview={culturalOverviewSafe}/>
                </div>
            ) : (
                <div></div>
            )}

            {implementationIdeasSafe?.length ? (
                <div className="implementation-ideas mt-6">
                    <h2>Implementation Ideas</h2>
                    <div className="implementation-ideas">
                        {implementationIdeasSafe.length > 1 ? (
                            <ul className={"mt-2"}>
                                {implementationIdeasSafe?.map((idea: string, index) => (
                                    <li className="list-disc my-0" key={index}
                                        dangerouslySetInnerHTML={{
                                          __html: purify.sanitize(makeSafe(idea)),
                                        }} />
                                ))}
                            </ul>
                        ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: purify.sanitize(makeSafe(implementationIdeasSafe[0])),
                              }} />
                        )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}

            {otherInfoSafe && <div className="vpo mt-6" data-testid="vpo">
                <h2>Other Relevant Information</h2>
                <div
                    className="space-y-4"
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(makeSafe(otherInfoSafe)),
                    }}
                />
            </div>}

            <div className="about-this-information mt-6">
                <h3>About this information</h3>
                <p>
                    The content, data, and information used in this app comes from multiple sources, including
                    Greater
                    Wellington’s <a>Natural Resources Plan</a> (2018) and Whaitua Implementation Programmes.
                </p>
                <div className="mt-6 mb-6 flex justify-center">
                    <EmailLink>Contact us for more information</EmailLink>
                </div>
            </div>
        </div>
    )
}

export default FreshwaterManagementUnit
