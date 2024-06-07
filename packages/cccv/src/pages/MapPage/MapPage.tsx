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
import {MAP_HEIGHT} from "@components/InteractiveMap/InteractiveMap"

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
    <div className="map-page bg-white h-">
      <header
        className={"header bold m-4 mb-0 p-[0.5em] pl-[1.5em] bg-[#0d2f4a] text-white"}>
        <h1
          className={"header-title text-3xl font-bold tracking-wider mt-2"}>Freshwater
          Management</h1>
        <h2 className={"header-subtitle text-2xl tracking-wider mb-2"}>Catchment, context, challenges and values (CCCV)</h2>
        <p className={"preamble font-light text-lg text-gray-400 mb-4"}>Use this app to find information useful for creating a Freshwater Farm Plan, such as contaminant goals, sites
          of significance, and implementation ideas for your catchment area.</p>
      </header>

      <main className="map-page" role="application">
        <div className={`map-panel m-4`}>
          <InteractiveMap location={location} pinLocation={setPinnedLocation} highlightedFeature={featureUnderPointer} setHighlightedFeature={setFeatureUnderPointer}/>
        </div>
        <div
          style={{height: MAP_HEIGHT}}
          className={`info-panel border-l-white text-white font-mono shadow-black m-4 bg-gray-700 ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500`}>
          {/*<span className="close-button" onClick={() => setShowPanel(false)}>x</span>*/}
          {selectedFmu && <FreshwaterManagementUnit {...selectedFmu} />}
        </div>
      </main>
    </div>
  )
}