import InteractiveMap from "@components/InteractiveMap/InteractiveMap";
import {useLoaderData} from "react-router-dom";
import './MapPage.scss';
import {ViewLocation} from "@src/global";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import useEscapeKey from "@lib/useEscapeKey.tsx";
import {useContext, useEffect, useState} from "react";
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import freshwaterManagementService from "@services/FreshwaterManagementUnits.ts";
import {Feature} from "geojson";
import FreshwaterManagementUnit from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.tsx";

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
      <header className={"headers flex-2 font-medium m-4 mt-4 my-0 rounded-xl p-4 pt-1 bg-teal-900 text-blue-50 font-sans"}>
        <h1
          className={"mb-4 text-4xl text-bo leading-none tracking-tight md:text-5xl lg:text-6xl mx-auto my-4"}>Freshwater
          Management</h1>
        <h2 className={"text-2xl dark:text-white"}>Catchment, context, challenges and values (CCCV)</h2>
      </header>

      <main className="map-page flex hscreen" role="application">
        <div className={`map-panel flex-1 h-full m-4 rounded shrink`}>
          <InteractiveMap location={location} pinLocation={setPinnedLocation} highlightedFeature={featureUnderPointer} setHighlightedFeature={setFeatureUnderPointer}/>
        </div>
        <div
          className={`info-panel border-l-white text-white font-mono xshadow-black m-4 absolute ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500`}>
          {/*<span className="close-button" onClick={() => setShowPanel(false)}>x</span>*/}
          {selectedFmu && <FreshwaterManagementUnit {...selectedFmu} />}
        </div>
      </main>
    </div>
  )
}