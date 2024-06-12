import "./FreshwaterManagementUnit.scss";
import purify from "dompurify";
import { Key } from "react";
import { FmuFullDetails } from "@models/FreshwaterManagementUnit.ts";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FreshwaterManagementUnitPDF } from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf";
import formatFilename from "@lib/formatAsFilename";
import dateTimeString from "@lib/dateTimeString";
import { ContaminantList, contaminants as fmuContaminants } from "@components/FreshwaterManagementUnit/utils.ts";
import EmailLink from "@components/EmailLink/EmailLink.tsx";
import { Contaminants } from "@components/Contaminants/Contaminants.tsx";
import {useTranslation} from "react-i18next";

const FreshwaterManagementUnit = (details: FmuFullDetails) => {

  const { t } = useTranslation();

  if (!details?.freshwaterManagementUnit) {
    return <div>{t('No data found.')}</div>;
  }

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const fileName = formatFilename((fmuName1 || '').toString(), `fmu_${id}`) + `_${dateTimeString()}` + '.pdf';

  const contaminants: ContaminantList = fmuContaminants(details.freshwaterManagementUnit);

  return (
    <div className={`FreshwaterManagementUnit bg-white p-6 pt-0 relative overflow-hidden`} id={`fmu_${id || ''}`}>
      <h1>{t(fmuName1 || "")}</h1>

      <div className="absolute top-0 right-0 m-6 mt-0">
        <PDFDownloadLink document={<FreshwaterManagementUnitPDF {...details} />} fileName={fileName}>
          {({ loading }: { loading: boolean }) => <button disabled={loading}>{t('Print')}</button>}
        </PDFDownloadLink>
      </div>

      <div className="overview mt-6" data-testid="catchment-desc">
        <h2>{t('Overview')}</h2>
        <div dangerouslySetInnerHTML={{ __html: purify.sanitize(catchmentDescription || t("<p>No overview available</p>")) }} />
      </div>

      <div className="contaminants mt-6">
        <h2>{t('Contaminants')}</h2>
        <p>{t('Freshwater objectives from')} {t(fmuName1 || "")} {t('Whaitua Implementation Plan (as at August 2018)')}</p>

        <div className="mt-4">
          <Contaminants contaminants={contaminants} />
        </div>
      </div>

      {tangataWhenuaSites?.length ? (
        <div className="tangata-whenua mt-6">
          <p className={"font-italic"}>{t('This area contains sites of significance to Tangata Whenua including:-')}</p>
          {tangataWhenuaSites && (<div className="tangata-whenua-sites">
            <ul className={"mt-2"}>
              {tangataWhenuaSites?.map((site: { location: string }, index: Key | null | undefined) => <li
                className="list-disc" key={index}>{t(site?.location)}</li>)}
            </ul>
          </div>)}
        </div>
      ) : <div></div>}

      <div className={`about-this-information mt-6`}>
        <h3>{t('About this information')}</h3>
        <p>{t('The content, data, and information used in this app comes from multiple sources, including Greater Wellington’s')} <a>{t('Natural Resources Plan')}</a> {t('(2018) and Whaitua Implementation Plans.')}</p>
        <div className="mt-6 flex justify-center">
          <EmailLink>{t('Contact us for more information')}</EmailLink>
        </div>
      </div>
    </div>
  );
};

export default FreshwaterManagementUnit;
