import "./FreshwaterManagementUnit.scss"
import purify from "dompurify"
import {Key} from "react"
import { FmuFullDetailsWithMap } from "@models/FreshwaterManagementUnit.ts"
import {BlobProviderParams, PDFDownloadLink } from "@react-pdf/renderer"
import { FreshwaterManagementUnitPDF } from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf"
import formatFilename from "@lib/formatAsFilename"
import dateTimeString from "@lib/dateTimeString"
import { ContaminantList, contaminants as fmuContaminants } from "@components/FreshwaterManagementUnit/utils.ts"
import EmailLink from "@components/EmailLink/EmailLink.tsx"
import { Contaminants } from "@components/Contaminants/Contaminants.tsx"
import makeSafe from "@lib/makeSafe.ts"
import {parseHtmlListToArray} from "@lib/parseHtmlListToArray.ts"

const FreshwaterManagementUnit = (details: FmuFullDetailsWithMap) => {

    if (!details?.freshwaterManagementUnit) {
        return <div>No data found.</div>
    }

    const {
        id,
        fmuName1,
        catchmentDescription,
        implementationIdeas,
    } = details.freshwaterManagementUnit

    const tangataWhenuaSites = details.tangataWhenuaSites

    const fileName = formatFilename((fmuName1 || '').toString(), `fmu_${id}`) + `_${dateTimeString()}` + '.pdf'

    const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit)

    return (
        <div className="FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden" id={`fmu_${id || ''}`}>
            <h1 className="w-[80%]">{fmuName1 || ""}</h1>

            <div className="absolute top-0 right-0 m-6 mt-0">
                <PDFDownloadLink document={<FreshwaterManagementUnitPDF {...details} />} fileName={fileName}>
                    {({loading}: BlobProviderParams) => (loading ? <button disabled>Loading...</button> :
                        <button>Print</button>)}
                </PDFDownloadLink>
            </div>

            <div className="overview mt-6" data-testid="catchment-desc">
                <h2>Overview</h2>
                <div
                    dangerouslySetInnerHTML={{__html: purify.sanitize(makeSafe(catchmentDescription ?? "<p>No overview available</p>"))}}/>
            </div>

            <div className="contaminants mt-6">
                <h2>Contaminants</h2>
                <p>Freshwater objectives from {fmuName1 || ""} Whaitua Implementation Plan (as at August 2018)</p>

                <div className="mt-4">
                    <Contaminants contaminants={contaminants}/>
                </div>
            </div>

            {tangataWhenuaSites?.length ? (
                <div className="tangata-whenua mt-6">
                    <h2>Tangata Whenua</h2>
                    <p className="italic">This area contains sites of significance to Tangata Whenua including:</p>
                    <div className="tangata-whenua-sites">
                        <ul className="mt-2 list-disc">
                            {tangataWhenuaSites?.map((site: { location: string }, index: Key | null | undefined) => <li
                                className="my-0" key={index}>{site?.location}</li>)}
                        </ul>
                    </div>
                </div>
            ) : <div></div>}

            {implementationIdeas ? (
                <div className="implementation-ideas mt-6">
                    <h2>Implementation Ideas</h2>
                    <div className="implementation-ideas">
                        <ul className={"mt-2"}>
                            {parseHtmlListToArray(implementationIdeas)?.map((idea: string, index) => <li
                                className="list-disc my-0" key={index}>{makeSafe(idea)}</li>)}
                        </ul>
                    </div>
                </div>
            ) : <div></div>}

            <div className="about-this-information mt-6">
                <h3>About this information</h3>
                <p>The content, data, and information used in this app comes from multiple sources, including Greater
                    Wellington’s <a>Natural Resources Plan</a> (2018) and Whaitua Implementation Plans.</p>
                <div className="mt-6 flex justify-center">
                    <EmailLink>Contact us for more information</EmailLink>
                </div>
            </div>
        </div>
    )
}

export default FreshwaterManagementUnit