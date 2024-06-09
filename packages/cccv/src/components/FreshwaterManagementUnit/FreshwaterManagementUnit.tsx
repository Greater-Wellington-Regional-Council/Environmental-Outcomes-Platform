import "./FreshwaterManagementUnit.scss";
import purify from "dompurify";
import {Key, useRef, useState} from "react";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {FreshwaterManagementUnitPDF} from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf";
import {PrinterIcon} from '@heroicons/react/24/solid';
import formatFilename from "@lib/formatAsFilename";
import dateTimeString from "@lib/dateTimeString";
import {contaminant, contaminants as fmuContaminants} from "@components/FreshwaterManagementUnit/utils.ts";
import EmailLink from "@components/EmailLink/EmailLink.tsx";
import useIntersectionObserver from "@lib/useIntersectionObserver";

const FreshwaterManagementUnit = (details: FmuFullDetails) => {

  const [showAbout, setShowAbout] = useState(false);

  const ignoreIntersection = useRef(false);

  const handleShowAbout = () => {
    setShowAbout(!showAbout);

    setTimeout(() => {
      const aboutTextElement = document.querySelector('.about-text');
      if (aboutTextElement?.scrollIntoView) {
        ignoreIntersection.current = true;
        aboutTextElement.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
          ignoreIntersection.current = false;
        }, 1000);
      }
    }, 0);
  }

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (ignoreIntersection.current) return;

    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        setShowAbout(false)
      }
    });
  };

  const aboutTextRef = useIntersectionObserver(handleIntersection, { threshold: 0.1 });

  if (!details?.freshwaterManagementUnit) {
    return <div>No data found.</div>
  }

  const {
    id,
    fmuName1,
    catchmentDescription,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  const fileName = formatFilename((fmuName1 || '').toString(), `fmu_${id}`) + `_${dateTimeString()}` + '.pdf';

  const contaminants: Array<contaminant> = fmuContaminants(details.freshwaterManagementUnit);

  return <div className={`FreshwaterManagementUnit bg-white p-6 relative overflow-hidden`} id={`fmu_${id || ''}`}>
    <h1 className={""}>{fmuName1}</h1>

    <div className="absolute top-4 right-8 m-4">
      <PDFDownloadLink document={<FreshwaterManagementUnitPDF {...details} />} fileName={fileName}>
        {({loading}: { loading: boolean }) => loading ? 'Loading document...' :
          <PrinterIcon className="h-8 w-6 text-green-100"/>}
      </PDFDownloadLink>
    </div>

    <div className="overview" data-testid="catchment-desc">
      <h2>Overview</h2>
      <div dangerouslySetInnerHTML={{__html: purify.sanitize(catchmentDescription || "<p>No overview available</p>")}}/>
    </div>

    <div className="contaminants">
      <h2>Contaminants</h2>
      <p>Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)</p>

      <div className="contaminants-list grid grid-cols-2 gap-4 place-items-top">
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

    {tangataWhenuaSites?.length ? (<div className="tangata-whenua">
      <p className={"font-italic"}>This area contains sites of significance to Tangata Whenua including:-</p>
      {tangataWhenuaSites && (<span className="tangata-whenua-sites">
            <ul>
              {tangataWhenuaSites?.map((site: { location: string }, index: Key | null | undefined) => <li
                className="list-disc" key={index}>{site?.location}</li>)}
            </ul>
        </span>)}
    </div>) : <div></div>}

    <div className={`about-this-information cursor-pointer ${showAbout ? 'show-about' : ''}`}>
      <div className={`about-link underline mt-6 bottom`}>
        <a className="font-medium" onClick={handleShowAbout}>About this information</a>
      </div>
      {showAbout &&
          <div className={`about-text p-4 text-black`} data-testid="about-text" ref={aboutTextRef}>
              <p onClick={() => setShowAbout(false)}>The content, data, and information used in this app comes from
                  multiple sources, including Greater
                  Wellington’s <a>Natural Resources Plan</a> (2018) and Whaitua Implentation Plans.</p>
              <EmailLink style={{color: "black", fontSize: "1.2em", textDecoration: "underline" }}>Email us here for more information</EmailLink>
          </div>}
    </div>
  </div>
};

export default FreshwaterManagementUnit;