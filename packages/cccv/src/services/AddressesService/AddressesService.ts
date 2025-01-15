import {LabelAndValue} from "@elements/ComboBox/ComboBox.tsx"
import {determineBackendUri, get} from "@lib/api.tsx"
import {Feature, Point} from "geojson"
import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

export type AddressId = number | string;

export interface Address {
    id: AddressId;
    address: string;
    location: Feature<Point>;
}

// noinspection JSNonASCIINames
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
}

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
    getAddressOptions: async (query: string | null = null): Promise<AddressLabelAndValue[]> => {
        const regionCode = regionCodes["Wellington"]
        const url = `${determineBackendUri(window.location.hostname)}/addresses/options?query=${encodeURIComponent(query || "")}&regionCode=${regionCode}&format=json`
        const response = await get(url)
        if (!response) {
            announceError("Failed to get matching addresses.  The AddressFinder service may be unavailable.", ErrorLevel.WARNING)
            return []
        }
        return response
    },
    getAddressByPxid: async (id: unknown): Promise<Address | null> => {
        // Retrieves address Toitu Te Whenua LINZ AIMS address id and other metadata from AddressFinder
        const url = `${determineBackendUri(window.location.hostname)}/addresses/${id}`
        const response = await get(url)
        if (!response) {
            announceError("Failed to retrieve address data.  If this continues to fail, the AddressFinder service may be unavailable.", ErrorLevel.WARNING)
            return null
        }
        return response
    }
}

export default service
