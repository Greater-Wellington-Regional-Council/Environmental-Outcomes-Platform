import "./FreshwaterManagementUnit.scss";
import purify from "dompurify";
import { Key } from "react";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";

const FreshwaterManagementUnit = (details: FmuFullDetails) => {
  if (!details) {
    return <div className="FreshwaterManagementUnit p-6 space-y-0 h-full bg-gray-700">No data available</div>
  }

  const {
    id,
    fmuName1,
    catchmentDescription,
    ecoliBase,
    ecoliObj,
    atoxBase,
    atoxObj,
    ntoxBase,
    ntoxObj,
    periBase,
    periObj,
    mciBase,
    mciObj,
    byWhen,
  } = details.freshwaterManagementUnit;

  const tangataWhenuaSites = details.tangataWhenuaSites;

  return <div className="FreshwaterManagementUnit p-6 space-y-0 h-full bg-gray-700" id={`fmu_${id}`}>
    <h1 className={""}>{fmuName1}</h1>

    <div className="overview" data-testid="catchment-description">
      <h2>Overview</h2>
      <div dangerouslySetInnerHTML={{__html: purify.sanitize(catchmentDescription || "<p>No overview available</p>")}}/>
      <div/>

      <div className="contaminants">
        <h2>Contaminants</h2>
        <p>Freshwater objectives from {fmuName1} Whaitua Implementation Plan (as at August 2018)</p>

        <h3>E. coli</h3>
        <ol className={`contaminant`}>
          <li>{`Ecoli base ${ecoliBase}`}</li>
          <li>{`Ecoli objective ${ecoliObj}`}</li>
          <li>{`By ${byWhen}`}</li>
        </ol>

        <h3>Periphyton</h3>
        <ol className={`contaminant`}>
          <li>{`Base ${periBase}`}</li>
          <li>{`Goal ${periObj}`}</li>
          <li>{`By ${byWhen}`}</li>
        </ol>

        <h3>Ammonia toxicity</h3>
        <ol className={`contaminant`}>
          <li>{`Base ${atoxBase}`}</li>
          <li>{`Goal ${atoxObj}`}</li>
          <li>{`By ${byWhen}`}</li>
        </ol>

        <h3>Nitrate toxicity</h3>
        <ol className={`contaminant`}>
          <li>{`Base ${ntoxBase}`}</li>
          <li>{`Goal ${ntoxObj}`}</li>
          <li>{`By ${byWhen}`}</li>
        </ol>

        <h3>MCI</h3>
        <ol className={`contaminant`}>
          <li>{`Base ${mciBase}`}</li>
          <li>{`Goal ${mciObj}`}</li>
          <li>{`By ${byWhen}`}</li>
        </ol>
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

      {/*<a href={'#about'}>About this information</a>*/}
    </div>
  </div>
};

export default FreshwaterManagementUnit;