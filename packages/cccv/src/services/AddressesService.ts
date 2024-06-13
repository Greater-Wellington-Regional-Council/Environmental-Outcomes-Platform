// import {ErrorFlag, ErrorLevel} from "@components/ErrorContext/ErrorContext.ts";
// import {determineBackendUri, get} from "@lib/api.tsx";

export interface Address {
  address: string;
  lat: number;
  lng: number;
}

const tempAddressStringsWithLatLng = [
    {
        "address": "123 Main St, Springfield, IL 62701",
        "lat": 39.7998,
        "lng": -89.6446
    },
    {
        "address": "456 Elm St, Springfield, IL 62701",
        "lat": 39.7998,
        "lng": -89.6446
    },
    {
        "address": "789 Oak St, Springfield, IL 62701",
        "lat": 39.7998,
        "lng": -89.6446
    }
];

const service  =  {
    getAddresses:  (): Address[] =>  tempAddressStringsWithLatLng
}

export default service;
