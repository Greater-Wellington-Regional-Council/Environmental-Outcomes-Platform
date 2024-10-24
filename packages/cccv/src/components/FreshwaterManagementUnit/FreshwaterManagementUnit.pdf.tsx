import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import {
    contaminants as fmuContaminants,
    ContaminantList
} from "@components/FreshwaterManagementUnit/utils.ts"
import {FmuFullDetailsWithMap} from "@services/models/FreshwaterManagementUnit.ts"
import colors from '@lib/colors'
import {createTw} from "react-pdf-tailwind"
import gwrcLogo from "@images/printLogo_500x188px.png"
import {tw as predefinedTw} from "@lib/pdfTailwindStyles.ts"
import fonts from "@src/fonts.ts"
import React from "react"
import {
    getObjectiveDescription,
    contaminantTitle,
    byWhen
} from "@components/Contaminants/ContaminantObjectiveDescription"
import makeSafe from "@lib/makeSafe.ts"
import {parseHtmlListToArray} from "@lib/parseHtmlListToArray.ts"

Font.register(fonts.inter)

const twContext = createTw({
    theme: {
        fontFamily: {
            'sans': ['Inter'],
        },
        extend: {
            colors,
        },
    }
})

const tw = (input: string) => twContext(predefinedTw(input))

const Contaminants: React.FC<{ contaminants: ContaminantList }> = ({contaminants}) => (
    <View style={tw('w-full body mt-4')}>
        <View style={tw('flex flex-row border-b border-gray-300')}>
            <Text style={tw('w-1/5 p-2 font-bold')}></Text>
            <Text style={tw('w-2/5 p-2')}>Base</Text>
            <Text style={tw('w-2/5 p-2')}>Objective</Text>
        </View>
        {contaminants.map((contaminant, index) => (
            <View key={index} wrap={false}>
                <View style={tw('flex flex-row mt-2')}>
                    <Text style={tw('w-1/5 p-2 font-bold')}>{contaminantTitle(contaminant)}</Text>
                    <Text style={tw('w-2/5 p-2')}>{contaminant.base}</Text>
                    <Text
                        style={tw('w-2/5 p-2')}>{`${contaminant.objective}${contaminant.byWhen ? ` (${byWhen(contaminant)})` : ''}`}</Text>
                </View>
                <View style={tw('flex flex-row pb-4 border-b border-gray-300')}>
                    <Text style={tw('w-1/5 text-left')}></Text>
                    <Text style={tw('w-2/5 pl-2 text-left')}>
                        <Text>{getObjectiveDescription(contaminant, contaminant.base) ?? ''}</Text>
                    </Text>
                    <Text style={tw('w-2/5 pl-2 text-left')}>
                        <Text>{getObjectiveDescription(contaminant, contaminant.objective) ?? ''}</Text>
                    </Text>
                </View>
            </View>
        ))}
    </View>
)

const BulletList = ({items}: { items: string[] }) => {
    return (
        <View>{items.map((item: string, index: number) => (
            <View key={index} style={tw('flex flex-row items-center mb-2 body')}>
                <Text style={tw('mr-2')}>•</Text>
                <Text style={tw('body')}>{makeSafe(item)}</Text>
            </View>
        ))}</View>
    )
}

const Footer = ({ freshwaterManagementUnit  }: FmuFullDetailsWithMap) => (
    /* Footer */
    <View style={tw('absolute bottom-0 left-0 right-0 flex flex-row justify-between items-center m-4')}
          fixed>
        <Text style={tw('text-xs')}>{new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })}</Text>
        <Text
            style={tw('text-xs')}
            // Only display the FMU name in the footer on the first page
            render={({pageNumber}) => pageNumber > 1 ? `CCCV details for ${freshwaterManagementUnit.fmuName1}` : ''}
        />
        <Text
            style={tw('text-xs')}
            render={({pageNumber, totalPages}) => `Page ${pageNumber} of ${totalPages}`}
        />
    </View>
)

const MapImage: React.FC<{ src: string, width?: string }> = ({ src, width }) => {
    return (
        <Image
            style={[
                { width: width, height: '312px', marginRight: "16px" },
                tw("object-cover")
            ]}
            src={src}
        />
    )
}

export const FreshwaterManagementUnitPDF = (details: FmuFullDetailsWithMap) => {

    const {
        fmuName1,
        catchmentDescription,
        implementationIdeas,
    } = details.freshwaterManagementUnit

    const tangataWhenuaSites = details.tangataWhenuaSites

    const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit)

    return (
        <Document>
            <Page size="A4" style={tw("bg-white font-sans p-4 flex flex-col")}>

                {/* Header */}
                <View style={tw("bg-nui -m-4 p-4 mb-0 text-white flex flex-row justify-between items-start")}>
                    <View style={tw("flex flex-col")}>
                        <Text style={tw("h1 mb-0")}>Freshwater Management Unit</Text>
                        <Text style={tw("h2 mb-4")}>Catchment context, challenges and values (CCCV)</Text>
                        <Text style={tw("body")}>Find information useful for creating a Freshwater Farm Plan, such
                            as contaminant goals, sites of significance, and implementation ideas for your catchment area.</Text>
                    </View>
                    <Image style={[{width: 120, height: 'auto'}, tw("mr-4")]} source={gwrcLogo}/>
                </View>

                {/* Name */}
                <View style={tw("mt-4 mb-2")}>
                    <Text style={tw("h1")}>{fmuName1}</Text>
                </View>

                <View style={[tw("mb-6 flex-row items-start"), { width: '100%' }]} wrap={false}>
                    {catchmentDescription && (
                        <View style={{ flex: 1, marginRight: '12px' }}>
                            <Text style={tw("body")}>{makeSafe(catchmentDescription ?? '')}</Text>
                        </View>
                    )}
                    {details.mapImage && <MapImage width={catchmentDescription ? '42%' : '100%'} src={details.mapImage}/>}
                </View>

                {/* Contaminants */}
                {contaminants?.length ? (
                    <View style={tw("mt-2 mb-2")}>
                        <Text style={tw("h2 mb-2")}>Contaminants</Text>
                        <Text style={tw("body")}>
                            Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)
                        </Text>

                        <Contaminants contaminants={contaminants} />
                    </View>
                ) : <View style={tw("mt-0")} />}

                {/* Tangata Whenua Sites */}
                {tangataWhenuaSites?.features.length ? (
                    <View style={tw("mt-6")} wrap={false}>
                        <Text style={tw("h2 mb-2")}>Sites of significance</Text>
                        <Text style={tw("body mb-1")}>
                            This area contains sites of significance to Tangata Whenua.
                        </Text>

                        <BulletList items={tangataWhenuaSites?.features.map(s => s.properties?.location)} />
                    </View>
                ) : <View style={tw("mt-0")} />}

                {/* Actions */}
                {implementationIdeas ? (
                    <View style={tw("mt-6")} wrap={false}>
                        <Text style={tw("h2")}>Implementation Ideas</Text>
                        <BulletList items={parseHtmlListToArray(implementationIdeas)} />
                    </View>
                ) : <View style={tw("mt-0")} />}

                {/* Disclaimer */}
                <View style={tw("mt-6")} wrap={false}>
                    <Text style={tw("h2 mb-2")}>About this Information</Text>
                    <Text style={tw("body")}>
                        The content, data, and information used in this app comes from multiple sources,
                        including Greater Wellington’s Natural Resources Plan (2018) and Whaitua
                        Implementation Plans, and the National Policy Statement for Freshwater Management
                        2020 (Amended January 2024).
                    </Text>
                </View>

                <Footer {...details} />
            </Page>
        </Document>
    )
}
