import "./FreshwaterManagementUnit.scss"
import purify from "dompurify"
import React, {useEffect, useMemo, useState} from "react"
import {FmuFullDetailsWithMap} from "@services/models/FreshwaterManagementUnit.ts"
import {usePDF} from "@react-pdf/renderer"
import {FreshwaterManagementUnitPDF} from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf"
import formatFilename from "@lib/formatAsFilename"
import dateTimeString from "@lib/dateTimeString"
import {ContaminantList, contaminants as fmuContaminants} from "@components/FreshwaterManagementUnit/utils.ts"
import EmailLink from "@components/EmailLink/EmailLink.tsx"
import {Contaminants} from "@components/Contaminants/Contaminants.tsx"
import makeSafe from "@lib/makeSafe.ts"
import {parseHtmlListToArray} from "@lib/parseHtmlListToArray.ts"
import {DownloadLink} from "@elements/DownloadLink/DownloadLink.tsx"
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
        catchmentDescription,
        implementationIdeas,
    } = details.freshwaterManagementUnit

    const showHeader = details.showHeader

    const culturalOverview = DOMPurify.sanitize(details.systemValues?.culturalOverview || "")

    const tangataWhenuaSites = details.tangataWhenuaSites

    const fileName = formatFilename(fmuName1 || "", `fmu_${id}`) + `_${dateTimeString()}` + ".pdf"

    const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit)

    const links = details.links

    const pdfDocument = useMemo(() => <FreshwaterManagementUnitPDF {...details} />, [details])

    const [instance, updateInstance] = usePDF({document: pdfDocument})
    const [pdfLoading, setPdfLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const [overview, setOverview] = useState<string | undefined>(catchmentDescription ?? "")

    useEffect(() => {
        if (catchmentDescription)
            setOverview(catchmentDescription)
        else {
            (async () => {
                const fetchedOverview = await getSystemValueForCouncil(SystemValueNames.RUAMAHANGA_WHAITUA_OVERVIEW) ?? null
                setOverview(fetchedOverview || undefined)
            })()
        }
    }, [catchmentDescription, fmuName1])

    useEffect(() => {
        if (instance) {
            const isLoading = instance.loading
            const hasErrorOccurred = !!instance.error

            if (isLoading !== pdfLoading)
                setPdfLoading(isLoading)

            if (hasErrorOccurred !== hasError)
                setHasError(hasErrorOccurred)
        }
    }, [instance, pdfLoading, hasError])

    useEffect(() => {
        updateInstance(pdfDocument)
    }, [fileName, pdfDocument, updateInstance])

    if (!details?.freshwaterManagementUnit) {
        return <div>No data found.</div>
    }

    const gotoTangataWhenua = (i: number) => {
        if (tangataWhenuaSites) links?.gotoLink(tangataWhenuaSites.features[i])
    }

    return (
        <div className="FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden" id={`fmu_${id || ''}`}>
            {showHeader &&
                <FmuPanelHeader className={"mb-6"} fmuName1={fmuName1!}>
                    <div className="absolute top-0 right-0 m-6 mt-0">
                        <DownloadLink pdfLoading={pdfLoading} instance={instance} fileName={fileName}
                                      hasError={hasError}/>
                    </div>
                </FmuPanelHeader>}

                    <div className="overview mt-0" data-testid="catchment-desc">
                        <h2>Overview</h2>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: purify.sanitize(makeSafe(overview!)),
                            }}
                        />
                    </div>

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
                                                culturalOverview={culturalOverview}/>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    {implementationIdeas ? (
                        <div className="implementation-ideas mt-6">
                            <h2>Implementation Ideas</h2>
                            <div className="implementation-ideas">
                                <ul className={"mt-2"}>
                                    {parseHtmlListToArray(implementationIdeas)?.map((idea: string, index) => (
                                        <li className="list-disc my-0" key={index}>
                                            {makeSafe(idea)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <div className="about-this-information mt-6">
                        <h3>About this information</h3>
                        <p>
                            The content, data, and information used in this app comes from multiple sources, including
                            Greater
                            Wellington’s <a>Natural Resources Plan</a> (2018) and Whaitua Implementation Plans.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <EmailLink>Contact us for more information</EmailLink>
                        </div>
                    </div>
                </div>
                )
            }

            export default FreshwaterManagementUnit