import {Document, Page, View, Text, Font, Image} from '@react-pdf/renderer';
// import purify from 'dompurify';
// import {contaminants as fmuContaminants, contaminant} from "@components/FreshwaterManagementUnit/utils.ts";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import colors from '@lib/colors';
import { createTw } from "react-pdf-tailwind";
import gwrcLogo from "@images/GWLogoFullColorWhiteText-forPDF.png";
import _ from "lodash";
import { Style } from '@react-pdf/types';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf',
      fontWeight: 100,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf',
      fontWeight: 200,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf',
      fontWeight: 300,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
      fontWeight: 400,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
      fontWeight: 500,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
      fontWeight: 600,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
      fontWeight: 700,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
      fontWeight: 800,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
      fontWeight: 900,
    },
  ],
});

const source = 'http://fonts.gstatic.com/s/sourcecodepro/v6/mrl8jkM18OlOQN8JLgasD9zbP97U9sKh0jjxbPbfOKg.ttf';

Font.register({ family: 'Source Sans Pro', src: source });

const tw = createTw({
  theme: {
    fontFamily: {
      'inter': ['Inter'],
    },
    extend: {
      colors,
    },
  },
});

const styles = {
  h1: "font-source-sans-3 font-bold text-[32px] leading-[40px]",
  h2: "font-source-sans-3 font-bold text-[22px] leading-[34px]",
  h3: "font-source-sans-3 font-bold text-[18px] leading-[24px]",
  h4: "font-source-sans-3 font-bold text-[18px] leading-[24px] capitalize",
  h5: "font-source-sans-3 font-bold text-[16px] leading-[22px]",
  h6: "font-source-sans-3 font-bold text-[16px] leading-[22px]",
  body: "font-source-sans-3 text-[16px] leading-[22px]",
  caption: "font-source-sans-3 text-[16px] leading-[22px] text-textCaption",
  button: "font-source-sans-3 text-nui font-bold text-[16px] leading-[22px] border-2 rounded-3xl pl-4 border-nui pr-4 pt-2 pb-2",
  "button:hover": "font-source-sans-3 text-white bg-nui font-bold text-[16px] leading-[22px]",
  "button:disabled": "font-source-sans-3 text-nui font-bold text-[16px] leading-[22px]",
  ul: "list-inside ml-[-1.5em] pl-1.5 indent-[-1.5em]",
  "ul li": "list-disc ml-6 pl-6 -mt-1.5 leading-7",
};

const st = (input: string): Style => {
  return tw(_.get(styles, input,  input)) as Style;
}

export const FreshwaterManagementUnitPDF = (details: FmuFullDetails) => {

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  // const tangataWhenuaSites = details.tangataWhenuaSites;
  //
  // const contaminants: Array<contaminant> = fmuContaminants(details.freshwaterManagementUnit);

  return (
    <Document >
      <Page style={st("bg-white font-inter")}>
        <View style={st("")} id={`fmu_${id}`}>
          <View style={st("bg-nui p-4 text-white flex flex-row justify-between items-start")}>
            <View style={st("flex flex-col")}>
              <Text style={st("text-3xl leading-8 font-bold")}>Freshwater Management Unit</Text>
              <Text style={st("text-2xl leading-6 font-bold")}>Catchment context, challenges and values (CCCV)</Text>
              <Text style={st("text-2xl mt-3 leading-6 font-normal")}>Find information useful for creating a Freshwater Farm Plan, such as contaminant
                goals, sites of significance, and implementation ideas for your catchment area.</Text>
            </View>
            <Image style={[{ width: 100, height: 'auto' }, st("ml-4")]} source={gwrcLogo} />
          </View>

          <View style={st("p-4")}>
            <Text style={st("h1")}>{fmuName1}</Text>

            {catchmentDescription ? (<>
              <Text style={st("h2")}>Overview</Text>
              <Text style={st("h2")}>{catchmentDescription}</Text>
            </>) : null}

          </View>

          {/*<View style={st("")}>*/}
          {/*  <Text style={st("")}>Contaminants</Text>*/}
          {/*  <Text style={st("")}>*/}
          {/*    Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)*/}
          {/*  </Text>*/}

          {/*  <View style={st("")}>*/}
          {/*    {contaminants.map((contaminant, index) => (*/}
          {/*      <View key={index} style={st("")}>*/}
          {/*        <Text style={st("")}>{contaminant.title}</Text>*/}
          {/*        <Text style={st("")}>{contaminant.base}</Text>*/}
          {/*        <Text style={st("")}>{contaminant.objective}</Text>*/}
          {/*        <Text style={st("")}>{contaminant.byWhen}</Text>*/}
          {/*      </View>*/}
          {/*    ))}*/}
          {/*  </View>*/}
          {/*</View>*/}

          {/*{tangataWhenuaSites?.length && (*/}
          {/*  <View style={st("")} wrap={false}>*/}

          {/*    <Text>*/}
          {/*      This area contains sites of significance to Tangata Whenua.*/}
          {/*    </Text>*/}

          {/*    <View style={st("")}>*/}
          {/*      <Text style={{color: 'black', marginBottom: 8}}>They may include:-</Text>*/}
          {/*      <View style={st("")}>*/}
          {/*        {tangataWhenuaSites.map((site, index) => (*/}
          {/*          <View key={index} style={st("")}>*/}
          {/*            <Text key={index} style={st("")}>*/}
          {/*              {site.location}*/}
          {/*            </Text>*/}
          {/*          </View>*/}
          {/*        ))}*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*  </View>)}*/}

        </View>
      </Page>
    </Document>
  )
}
