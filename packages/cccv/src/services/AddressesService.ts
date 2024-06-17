// import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts";
// import {determineBackendUri, get} from "@lib/api.tsx";
import { LabelAndValue } from "@elements/ComboBox/ComboBox.tsx";

export interface Address {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

const tempAddressStringsWithLatLng: Address[] = [
  {
    "id": 1,
    "address": "123 Main St, Springfield, IL 62701",
    "latitude": 39.7998,
    "longitude": -89.6446
  },
  {
    "id": 2,
    "address": "456 Elm St, Springfield, IL 62701",
    "latitude": 39.7998,
    "longitude": -89.6446
  },
  {
    "id": 3,
    "address": "789 Oak St, Springfield, IL 62701",
    "latitude": 39.7998,
    "longitude": -89.6446
  }
];

export interface AddressLabelAndValue extends LabelAndValue {
  label: string;
  value: number;
}

const service = {
    getAddressOptions: async (query: string): Promise<AddressLabelAndValue[]> => {
      const addresses = tempAddressStringsWithLatLng.filter(address => address.address.toLowerCase().includes(query.toLowerCase()));
      return addresses.map((address) => ({ label: address.address, value: address.id }));
    },
    getAddress: async (id: unknown): Promise<Address | undefined> => {
      return tempAddressStringsWithLatLng.find(address => address.address.toLowerCase() === id);
    }
}

export default service;
