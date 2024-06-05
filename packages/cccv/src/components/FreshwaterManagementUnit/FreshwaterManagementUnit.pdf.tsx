import {Document, Page, View, Text, StyleSheet} from '@react-pdf/renderer';
import purify from 'dompurify';
import {contaminants as fmuContaminants, contaminant} from "@components/FreshwaterManagementUnit/utils.ts";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
    letterSpacing: .5,
  },

  freshwaterManagementUnit: {},

  section: {
    marginBottom: 8,
  },

  preHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  subSubheader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  gridItem: {
    width: '48%',
  },

  list: {
  },

  listItem: {
  },

  link: {
    color: '#fbbf24',
    textDecoration: 'none',
    fontSize: 12,
  },

  paragraph: {
    marginBottom: 8,
    fontSize: 12,
  },

  tangataWhenua: {},

  contaminants: {},

  contaminant: {},

  contaminantsList: {
    marginTop: 8,
  },

  tangataWhenuaSite: {},

  tangataWhenuaSites: {
    marginTop: 8,
    marginBottom: 8,
  },

  about: {},
});

export const FreshwaterManagementUnitPDF = (details: FmuFullDetails) => {

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const contaminants: Array<contaminant> = fmuContaminants(details.freshwaterManagementUnit);

  return (
    <Document >
      <Page style={styles.page}>
        <View style={styles.freshwaterManagementUnit} id={`fmu_${id}`}>
          <Text style={styles.preHeader}>Freshwater Management Unit</Text>
          <Text style={styles.header}>{fmuName1}</Text>

          <View style={styles.section}>
            <Text style={styles.subheader}>Overview</Text>
            <Text
              style={styles.paragraph}>{purify.sanitize(catchmentDescription || 'No overview available').replace(/<[^>]+>/g, '')}</Text>
          </View>

          <View style={[styles.section, styles.contaminants]}>
            <Text style={styles.subheader}>Contaminants</Text>
            <Text style={styles.subSubheader}>
              Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)
            </Text>

            <View style={[styles.grid, styles.contaminantsList]}>
              {contaminants.map((contaminant, index) => (
                <View key={index} style={[styles.gridItem, styles.contaminant]}>
                  <Text style={styles.subheader}>{contaminant.title}</Text>
                  <Text style={[styles.listItem]}>{contaminant.base}</Text>
                  <Text style={[styles.listItem]}>{contaminant.objective}</Text>
                  <Text style={[styles.listItem]}>{contaminant.byWhen}</Text>
                </View>
              ))}
            </View>
          </View>

          {tangataWhenuaSites?.length && (
            <View style={[styles.section, styles.tangataWhenua]} wrap={false}>

              <Text>
                This area contains sites of significance to Tangata Whenua.
              </Text>

              <View style={styles.tangataWhenuaSites}>
                <Text style={{color: 'black', marginBottom: 8}}>They may include:-</Text>
                <View style={styles.list}>
                  {tangataWhenuaSites.map((site, index) => (
                    <View key={index} style={styles.tangataWhenuaSite}>
                      <Text key={index} style={[styles.listItem]}>
                        {site.location}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>)}

        </View>
      </Page>
    </Document>
  )
}
