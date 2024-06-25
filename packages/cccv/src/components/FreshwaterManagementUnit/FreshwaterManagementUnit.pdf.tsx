import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer';
import {
  contaminants as fmuContaminants,
  ContaminantList
} from "@components/FreshwaterManagementUnit/utils.ts";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import colors from '@lib/colors';
import {createTw} from "react-pdf-tailwind";
import gwrcLogo from "@images/printLogo_500x188px.png";
import {tw as predefinedTw} from "@lib/pdfTailwindStyles.ts";
import fonts from "@src/fonts.ts";
import React from "react";
import {
  getObjectiveDescription,
  contaminantTitle,
  byWhen
} from "@components/Contaminants/ContaminantObjectiveDescription";
import makeSafe from "@lib/makeSafe.ts";

Font.register(fonts.inter);

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
      <View>
        <View key={index} style={tw('flex flex-row mt-2')}>
          <Text style={tw('w-1/5 p-2 font-bold')}>{contaminantTitle(contaminant)}</Text>
          <Text style={tw('w-2/5 p-2')}>{contaminant.base}</Text>
          <Text style={tw('w-2/5 p-2')}>{`${contaminant.objective}${contaminant.byWhen ? ` (${byWhen(contaminant)})` : ''}`}</Text>
        </View>
        <View style={tw('flex flex-row pb-4 border-b border-gray-300')}>
          <Text style={tw('w-1/5 text-left align-text-top')}></Text>
          <Text style={tw('w-2/5 pl-2 text-left align-text-top')}>
            <Text>{getObjectiveDescription(contaminant, contaminant.base) ?? ''}</Text>
          </Text>
          <Text style={tw('w-2/5 pl-2 text-left align-text-top')}>
            <Text>{getObjectiveDescription(contaminant, contaminant.objective) ?? ''}</Text>
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const BulletList: React.FC<{ items: string[] }> = ({items}) => {
  return (
    items.map((item: string, index: number) => (
      <View key={index} style={tw('flex flex-row items-center mb-2 body')}>
        <Text style={tw('mr-2')}>•</Text>
        <Text style={tw('body')}>{makeSafe(item)}</Text>
      </View>
    ))
  );
};

export const FreshwaterManagementUnitPDF = (details: FmuFullDetails) => {

  const {
    id,
    fmuName1,
    catchmentDescription,
    implementationIdeas,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit);

  return (
    <Document>
      <Page size="A4" style={tw("bg-white font-sans flex flex-col justify-between")}>
        <View style={tw("mb-4")} id={`fmu_${id}`}>
          <View style={tw("bg-nui p-4 pb-6 text-white flex flex-row justify-between items-start")}>
            <View style={tw("flex flex-col")}>
              <Text style={tw("h1 mb-1")}>Freshwater Management Unit</Text>
              <Text style={tw("h2 mb-6")}>Catchment context, challenges and values (CCCV)</Text>
              <Text style={tw("body")}>Find information useful for creating a Freshwater Farm Plan, such as contaminant
                goals, sites of significance, and implementation ideas for your catchment area.</Text>
            </View>
            <Image style={[{width: 120, height: 'auto'}, tw("ml-4")]} source={gwrcLogo}/>
          </View>
          <View style={tw("m-4")}>

            <View style={tw("mb-4")}>
              <Text style={tw("h1")}>{fmuName1}</Text>

              {catchmentDescription ? (<>
                <Text style={tw("h2 mb-2")}>Overview</Text>
                <Text
                  style={tw("body mb-4")}>{makeSafe(catchmentDescription ?? '')}</Text>
              </>) : <View><Text style={tw("body mb4")}>No overview available</Text></View>}
            </View>

            <View style={tw("mb-6")}>
              <Text style={tw("h2 mb-2")}>Contaminants</Text>
              <Text style={tw("body")}>
                Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)
              </Text>

              <Contaminants contaminants={contaminants}/>
            </View>

            {tangataWhenuaSites?.length ? (
              <View style={tw("mb-4")} wrap={false}>
                <Text style={tw("h2")}>Sites of significance</Text>
                <Text style={tw("body mb-1")}>
                  This area contains sites of significance to Tangata Whenua.
                </Text>

                <BulletList items={tangataWhenuaSites?.map(s => s.location)}/>
              </View>
            ) : <View/>}

            {implementationIdeas ? (
              <View style={tw("mb-4")} wrap={false}>
                <Text style={tw("h2")}>Implementation Ideas</Text>
                <BulletList items={implementationIdeas}/>
              </View>
            ) : <View/>}

            <View style={tw("mb-4")} wrap={false}>
              <Text style={tw("h2 mb-2")}>About this Information</Text>
              <Text style={tw("body")}>
                The content, data, and information used in this app comes from multiple sources,
                including Greater Wellington’s Natural Resources Plan (2018) and Whaitua
                Implementation Plans, and the National Policy Statement for Freshwater Management
                2020 (Amended January 2024).
              </Text>
            </View>
          </View>
        </View>

        <View style={tw('absolute bottom-0 left-0 right-0 flex flex-row justify-between items-center m-4')} fixed>
          <Text style={tw('text-xs')}>CCCV details for {fmuName1}</Text>
          <Text
            style={tw('text-xs')}
            render={({pageNumber, totalPages}) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
