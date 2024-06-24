import './MapPage.scss';
import InteractiveMap from "@components/InteractiveMap/InteractiveMap";
import {useLoaderData} from "react-router-dom";
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts";
import useEscapeKey from "@lib/useEscapeKey.tsx";
import {useContext, useEffect, useState} from "react";
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import freshwaterManagementService from "@services/FreshwaterManagementUnitService.ts";
import FreshwaterManagementUnit from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.tsx";
import gwrcLogo from "@images/printLogo_2000x571px.png";
import AddressSearch from "@components/AddressSearch/AddressSearch.tsx";
import addressesService, {Address} from "@services/AddressesService.ts";
import {LabelAndValue} from "@elements/ComboBox/ComboBox.tsx";


const ADDRESS_ZOOM = 12;

export default function MapPage() {

  const setError = useContext(ErrorContext).setError;

  const locationDetails = useLoaderData();

  const [selectedLocation, selectLocation] = useState<ViewLocation | null>(null);
  const [selectedFmu, selectFmu] = useState<FmuFullDetails | null>(null);

  const [showPanel, setShowPanel] = useState(false);
  const [fmuChanged, setFmuChanged] = useState(false);

  useEffect(() => {
    const fetchFmu = async () => {
      if (!selectedLocation) {
        setShowPanel(false)
        selectFmu(null);
        return;
      }
      const fmu = await freshwaterManagementService.getByLocation(selectedLocation, setError);
      setFmuChanged(selectedFmu != null && fmu != null && (fmu != selectedFmu));
      setShowPanel(fmu != null)
      selectFmu(fmu);
      fmu && setError(null)
    };

    fetchFmu().then()
  }, [selectedLocation, setError]);

  useEscapeKey(() => setShowPanel(false))

  const revealOrHideInfoPanel = showPanel ? 'animate-in' : 'animate-out';
  const signalUpdatedInfoPanel = fmuChanged ? 'pulsate' : '';

  const selectAddress = (address: LabelAndValue | null = null) => {
    if (!address) return;

    addressesService.getAddress(address).then((selectedAddress: Address | null) => {
      if (!selectedAddress) {
        setError(new Error("Address not found"));
        return;
      }

      selectLocation({latitude: selectedAddress.latitude, longitude: selectedAddress.longitude, description: address.label, zoom: ADDRESS_ZOOM} as ViewLocation);
    });
  }

  return (
    <div className="map-page bg-white">
      <header
        className={"header bold p-4 pl-[1.5em] bg-nui text-white grid grid-cols-12"}>
        <div className={"header-text col-span-10"}>
          <h1
            className={"header-title"}>Freshwater
            Management</h1>
          <h2 className={"header-subtitle mb-3"}>Catchment context, challenges and values (CCCV)</h2>
          <p className={"preamble font-light text-body"}>Find information useful for creating a Freshwater Farm Plan,
            such as contaminant goals, sites
            of significance, and implementation ideas for your catchment area.</p>
        </div>
        <div className={"header-image col-span-2 mt-2 mr-2 scale-105 ml-auto"}>
          <img src={gwrcLogo} style={{maxHeight: "83px"}}
               alt={"Greater Wellington Regional Council logo"}/>
        </div>
      </header>

      <main role="application">
        <div className={`map-panel relative`}>
          <InteractiveMap startLocation={locationDetails as ViewLocation} selected={selectedLocation} select={(selectLocation)}/>
          <div className={`address-box`}>
            <AddressSearch
              onSelect={address => selectAddress(address)}
              placeholder={"Search for address"}
              directionUp={true}
            />
          </div>
        </div>

        <div
          className={`info-panel bg-white font-mono shadow-black ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500`}>
          {selectedFmu && <FreshwaterManagementUnit {...selectedFmu} />}
        </div>
      </main>
    </div>
  )
}