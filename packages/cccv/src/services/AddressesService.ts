// import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts";
// import {determineBackendUri, get} from "@lib/api.tsx";
import { LabelAndValue } from "@elements/ComboBox/ComboBox.tsx";
import env from "@src/env.ts";
import { get } from "@lib/api.tsx";

export interface Address {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

// const DUMMY_ADDRESS: Address = {
// id: 0,
//   address: "19 Rhodes Street, Carterton",
//   latitude: -41.2865,
//   longitude: 174.7762
// };

const regionCodes: { [key: string]: string } = {
  "Auckland": "1",
  "Bay of Plenty": "2",
  "Canterbury": "3",
  "Gisborne": "4",
  "Hawke's Bay": "5",
  "Manawatū-Whanganui": "6",
  "Marlborough": "7",
  "Nelson": "8",
  "Northland": "9",
  "Otago": "A",
  "Southland": "B",
  "Taranaki": "C",
  "Tasman": "D",
  "Waikato": "E",
  "Wellington": "F",
  "West Coast": "G",
  "Chatham Islands": "H"
};

export interface AddressFinderCompletion {
  a: string;
  pxid: string;
  v: number;
  highlighted_a: string;
  success: boolean;
  [key: string]: unknown; // future proofing (prevent type errors)
}

export interface AddressFinderResponse {
  "completions": AddressFinderCompletion[],
  "paid": true,
  "demo": false,
  "success": true
}

export interface AddressLabelAndValue extends LabelAndValue {
  label: string;
  value: number;
}

const service = {
    getAddressOptions: async (query: string | null = null, setError: null | ((error: Error | null) => void) = null): Promise<AddressLabelAndValue[]> => {
      const regionCode = regionCodes["Wellington"];
      const url = `https://api.addressfinder.io/api/nz/address/autocomplete/?key=${env.ADDRESS_FINDER_KEY}&q=${encodeURIComponent(query || "")}&format=json&post_box=0&strict=2&region_code=${regionCode}&highlight=1`
      const response = await get(url);
      if (!response && setError) {
        setError(new Error("Failed to get matching addresses.  The AddressFinder service may be unavailable."));
        return [];
      }
      return response.completions.map((address: AddressFinderCompletion) => ({ label: address.a, value: address.pxid }));
    },
    getAddress: async (selected: LabelAndValue, setError: null | ((error: Error | null) => void) = null): Promise<Address | null> => {
      const url = `https://api.addressfinder.io/api/nz/address/metadata/?key=${env.ADDRESS_FINDER_KEY}&format=json&pxid=${selected.value}`
      const response = await get(url);
      if (!response && setError) {
        setError(new Error("Failed to retrieve address data.  The AddressFinder service may be unavailable."));
        return null;
      }
      return { id: response.pxid, address: response.a, latitude: response.y, longitude: response.x};
    }
}

export default service;
