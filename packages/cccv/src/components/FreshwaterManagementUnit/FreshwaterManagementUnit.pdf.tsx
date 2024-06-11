import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer';
import purify from 'dompurify';
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
  <View style={tw('w-full body mt-2')}>
    <View style={tw('flex flex-row border-b border-gray-300')}>
      <Text style={tw('w-1/4 p-2 font-bold')}></Text>
      <Text style={tw('w-1/4 p-2')}>Base</Text>
      <Text style={tw('w-1/4 p-2')}>Objective</Text>
      <Text style={tw('w-1/4 p-2')}>By</Text>
    </View>
    {contaminants.map((contaminant, index) => (
      <View key={index} style={tw('flex flex-row border-b border-gray-300')}>
        <Text style={tw('w-1/4 p-2 font-bold')}>{contaminant.title}</Text>
        <Text style={tw('w-1/4 p-2')}>{contaminant.base}</Text>
        <Text style={tw('w-1/4 p-2')}>{contaminant.objective}</Text>
        <Text style={tw('w-1/4 p-2')}>{contaminant.byWhen}</Text>
      </View>
    ))}
  </View>
);

const BulletList: React.FC<{ items: string[] }> = ({items}) => {
  return (
    items.map((item: string, index: number) => (
      <View key={index} style={tw('flex flex-row items-center mb-2 body')}>
        <Text style={tw('mr-2')}>•</Text>
        <Text style={tw('body')}>{item}</Text>
      </View>
    ))
  );
};

export const FreshwaterManagementUnitPDF = (details: FmuFullDetails) => {

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit);

  return (
    <Document>
      <Page size="A4" style={tw("p-4 bg-white font-sans flex flex-col justify-between")}>
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
          <View style={tw("pt-4")}>

            <View style={tw("mb-4")}>
              <Text style={tw("h1")}>{fmuName1}</Text>

              {catchmentDescription ? (<>
                <Text style={tw("h2 mb-2")}>Overview</Text>
                <Text
                  style={tw("body")}>{purify.sanitize(catchmentDescription || 'No overview available').replace(/<[^>]+>/g, '')}</Text>
              </>) : null}
            </View>

            <View style={tw("mb-6")}>
              <Text style={tw("h2 mb-2")}>Contaminants</Text>
              <Text style={tw("body")}>
                Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)
              </Text>

              <Contaminants contaminants={contaminants}/>
            </View>

            {tangataWhenuaSites?.length ? (
              <View style={tw("mb-4")}>
                <Text style={tw("h2 mb-2")}>Sites of significance</Text>
                <Text style={tw("body mb-1")}>
                  This area contains sites of significance to Tangata Whenua.
                </Text>

                <BulletList items={tangataWhenuaSites?.map(s => s.location)}/>
              </View>
            ) : null}

            <View style={tw("mb-4")} wrap={false}>
              <Text style={tw("h2 mb-2")}>About this Information</Text>
              <Text style={tw("body")}>
                The content, data, and information used in this app comes from multiple sources,
                including Greater Wellington’s Natural Resources Plan (2018) and Whaitua
                Implentation Plans, and the National Policy Statement for Freshwater Management
                2020 (Amended January 2024).
              </Text>
            </View>
          </View>
        </View>
        <Text style={tw("text-sm p-4 text-center text-base")} render={({ pageNumber, totalPages}) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
}
