import "./FreshwaterManagementUnit.scss";
import purify from "dompurify";
import { Key } from "react";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {FreshwaterManagementUnitPDF} from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf";
import { PrinterIcon } from '@heroicons/react/24/solid';
import formatFilename from "@lib/formatAsFilename";
import dateTimeString from "@lib/dateTimeString";
import {contaminant, contaminants as fmuContaminants} from "@components/FreshwaterManagementUnit/utils.ts";

const FreshwaterManagementUnit = (details: FmuFullDetails) => {
  if (!details) {
    return <div className="FreshwaterManagementUnit p-6 space-y-0 h-full bg-gray-700">No data available</div>
  }

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const fileName = formatFilename((fmuName1 || '').toString(), `fmu_${id}`) + `_${dateTimeString()}` + '.pdf';

  const contaminants: Array<contaminant> = fmuContaminants(details.freshwaterManagementUnit);

  return <div className="FreshwaterManagementUnit p-6 space-y-0 h-full bg-gray-700" id={`fmu_${id || ''}`}>
    <h1 className={""}>{fmuName1}</h1>

    <div className="absolute top-8 right-8 m-4">
      <PDFDownloadLink document={<FreshwaterManagementUnitPDF {...details} />} fileName={fileName}>
        {({loading}: { loading: boolean }) => loading ? 'Loading document...' : <PrinterIcon className="h-8 w-6 text-white" />}
      </PDFDownloadLink>
    </div>

    <div className="overview" data-testid="catchment-desc">
      <h2>Overview</h2>
      <div dangerouslySetInnerHTML={{__html: purify.sanitize(catchmentDescription || "<p>No overview available</p>")}}/>
      <div/>

      <div className="contaminants">
        <h2>Contaminants</h2>
        <p>Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)</p>

        <div className="grid grid-cols-2 gap-4 place-items-center">
          {contaminants.map((contaminant, index) => (
            <div key={index} className="w-full">
              <h3>{contaminant.title}</h3>
              <ol className="contaminant">
                <li>{contaminant.base}</li>
                <li>{contaminant.objective}</li>
                <li>{contaminant.byWhen}</li>
              </ol>
            </div>
          ))}
        </div>
      </div>

      {tangataWhenuaSites?.length && <div className="tangata-whenua text-black">
          <p>This area contains sites of significance to Tangata Whenua.</p>

        {tangataWhenuaSites && (<span className="tangata-whenua-sites p-4">
          <p>They may include:-</p>
            <ul>
              {tangataWhenuaSites?.map((site: { location: string }, index: Key | null | undefined) => <li className="list-disc" key={index}>{site?.location}</li>)}
            </ul>
        </span>)}
      </div>}

      <div className="mt-6">
        <a href={'#about'} className="text-amber-500">About this information</a>
      </div>
    </div>
  </div>
};

export default FreshwaterManagementUnit;