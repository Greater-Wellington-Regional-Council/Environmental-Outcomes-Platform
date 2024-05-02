import FreshwaterManagementUnitProps from "@models/FreshwaterManagementUnit.ts";
import "./FreshwaterManagementUnit.scss";
import purify from "dompurify";

const FreshwaterManagementUnit = ({ id, fmuName1, ecoliBase, ecoliObj, periBase, periObj, atoxBase, atoxObj, ntoxBase, ntoxObj, mciBase, mciObj, byWhen, catchmentDescription, tangataWhenua }: FreshwaterManagementUnitProps ) => {

  //TODO: This is a dummy data. Replace it with actual data
  tangataWhenua = {
    iwi: ["Ngāti Kahungunu ki Wairarapa" ],
    sites: [
      { name: "Sample site" },
    ]
  }

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

      {tangataWhenua && <div className="tangataWhenua text-black">
        <h2>Tangata whenua</h2>

        <p>This area contains sites of significance to {tangataWhenua?.iwi.map((iwi: string, key: number) => <span
          key={key}>{iwi}</span>) || "iwi"}</p>

        {tangataWhenua?.sites && (
          <p>They include:-
            <ul>
              {tangataWhenua?.sites?.map((site: { name: string }, index) => <li key={index}>{site?.name}</li>)}
            </ul>
          </p>
        )}
      </div>}

      <a href={'#about'}>About this information</a>
    </div>
  </div>
};

export default FreshwaterManagementUnit;