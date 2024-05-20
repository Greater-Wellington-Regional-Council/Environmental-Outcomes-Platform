import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import purify from 'dompurify';
import  { contaminants as fmuContaminants, contaminant } from "@components/FreshwaterManagementUnit/utils.ts";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Courier',
  },
  section: {
    marginBottom: 24,
  },
  header: {
    fontSize: 32,
    marginBottom: 24,
  },
  subheader: {
    fontSize: 24,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 12,
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
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  link: {
    color: '#fbbf24',
    textDecoration: 'none',
    fontSize: 12,
  },
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
    <Document>
      <Page style={styles.page}>
        <View style={styles.section} id={`fmu_${id}`}>
          <Text>Freshwater Management Unit</Text>
          <Text style={styles.header}>{fmuName1}</Text>

          <View style={styles.section} data-testid="catchment-description">
            <Text style={styles.subheader}>Overview</Text>
            <Text style={styles.paragraph}>{purify.sanitize(catchmentDescription || 'No overview available').replace(/<[^>]+>/g, '')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subheader}>Contaminants</Text>
            <Text style={styles.paragraph}>
              Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)
            </Text>

            <View style={styles.grid}>
              {contaminants.map((contaminant, index) => (
                <View key={index} style={styles.gridItem}>
                  <Text style={styles.subheader}>{contaminant.title}</Text>
                  <View style={styles.list}>
                    <Text style={styles.listItem}>{contaminant.base}</Text>
                    <Text style={styles.listItem}>{contaminant.objective}</Text>
                    <Text style={styles.listItem}>{contaminant.byWhen}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {tangataWhenuaSites?.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={{color: 'black'}}>
                This area contains sites of significance to Tangata Whenua.
              </Text>

              <View style={styles.section}>
                <Text style={{color: 'black'}}>They may include:-</Text>
                <View style={styles.list}>
                  {tangataWhenuaSites.map((site, index) => (
                    <Text key={index} style={[styles.listItem, {color: 'black'}]}>
                      {site.location}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}

          <Link src="#about" style={styles.link}>
            About this information
          </Link>
        </View>
      </Page>
    </Document>
  );
}
