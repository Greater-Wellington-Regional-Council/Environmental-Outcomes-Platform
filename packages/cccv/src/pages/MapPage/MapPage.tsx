import InteractiveMap from "@components/InteractiveMap/InteractiveMap";
import {useLoaderData} from "react-router-dom";
import './MapPage.scss';
import {ViewLocation} from "@src/global";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import useEscapeKey from "@lib/useEscapeKey.tsx";
import {useContext, useEffect, useState} from "react";
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import freshwaterManagementService from "@services/FreshwaterManagementUnitService.ts";
import {Feature} from "geojson";
import FreshwaterManagementUnit from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.tsx";
import gwrcLogo from "@images/GWLogoFullColorWhiteText.png";

export default function MapPage() {

  const setError = useContext(ErrorContext).setError;

  const locationDetails = useLoaderData();

  const [location] = useState<ViewLocation>(locationDetails as ViewLocation);
  const [pinnedLocation, setPinnedLocation] = useState<ViewLocation | null>(null);
  const [selectedFmu, setSelectedFmu] = useState<FmuFullDetails | null>(null);

  const [ featureUnderPointer, setFeatureUnderPointer ] = useState<Feature | null>(null);

  const [showPanel, setShowPanel] = useState(false);
  const [fmuChanged, setFmuChanged] = useState(false);

  function useFetchFmu(setSelectedFmu: (fmu: FmuFullDetails | null) => void, setError: (error: Error | null) => void) {
    useEffect(() => {
      const fetchFmu = async () => {
        if (!pinnedLocation) {
          setSelectedFmu(null);
          setShowPanel(false)
          return;
        }
        const fmu = await freshwaterManagementService.getByLngAndLat(pinnedLocation.longitude, pinnedLocation.latitude, setError);
        setFmuChanged(selectedFmu != null && fmu != null  && (fmu != selectedFmu));
        setShowPanel(fmu != null)
        setSelectedFmu(fmu)
        fmu && setError(null)
      };

      fetchFmu().then()
    }, [pinnedLocation, setSelectedFmu, setError]);
  }

  useFetchFmu(setSelectedFmu, setError);

  useEscapeKey(() => setShowPanel(false))

  const revealOrHideInfoPanel = showPanel ? 'animate-in' : 'animate-out';
  const signalUpdatedInfoPanel = fmuChanged ? 'pulsate' : '';

  return (
    <div className="map-page bg-white">
      <header
        className={"header bold p-[0.5em] pl-[1.5em] bg-[#0d2f4a] text-white grid grid-cols-12"}>
        <div className={"header-text col-span-10"}>
          <h1
            className={"header-title"}>Freshwater
            Management</h1>
          <h2 className={"header-subtitle mb-3"}>Catchment, context, challenges and values (CCCV)</h2>
          <p className={"preamble text-[#737373] font-lighter"}>Find information useful for creating a Freshwater Farm Plan, such as contaminant goals, sites
            of significance, and implementation ideas for your catchment area.</p>
        </div>
        <div className={"header-image col-span-2 mt-2 mr-2 scale-105 ml-auto"}>
          <img src={gwrcLogo} alt={"Greater Wellington Regional Council logo"} className={"h-[50px]"} />
        </div>
      </header>

      <main className="map-page" role="application">
        <div className={`map-panel`}>
          <InteractiveMap location={location} pinLocation={setPinnedLocation} highlightedFeature={featureUnderPointer} setHighlightedFeature={setFeatureUnderPointer}/>
        </div>
        <div
          className={`info-panel bg-white font-mono shadow-black ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500`}>
          {/*<span className="close-button" onClick={() => setShowPanel(false)}>x</span>*/}
          {selectedFmu && <FreshwaterManagementUnit {...selectedFmu} />}
        </div>
      </main>
    </div>
  )
}