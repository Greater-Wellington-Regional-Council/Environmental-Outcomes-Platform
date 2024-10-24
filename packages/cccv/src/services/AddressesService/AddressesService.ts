import {LabelAndValue} from "@elements/ComboBox/ComboBox.tsx"
import env from "@src/env.ts"
import {get} from "@lib/api.tsx"
import {Feature, Point} from "geojson"

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
    getAddressOptions: async (query: string | null = null, setError: null | ((error: Error | null) => void) = null): Promise<AddressLabelAndValue[]> => {
        const regionCode = regionCodes["Wellington"]
        const url = `https://api.addressfinder.io/api/nz/address/autocomplete/?key=${env.ADDRESS_FINDER_KEY}&q=${encodeURIComponent(query || "")}&format=json&post_box=0&strict=2&region_code=${regionCode}&highlight=1`
        const response = await get(url)
        if (!response && setError) {
            setError(new Error("Failed to get matching addresses.  The AddressFinder service may be unavailable."))
            return []
        }
        return response.completions.map((address: AddressFinderCompletion) => ({
            label: address.a,
            value: address.pxid
        }))
    },
    getAddressByPxid: async (id: unknown, setError: null | ((error: Error | null) => void) = null): Promise<Address | null> => {
        // Retrieves address Toitu Te Whenua LINZ AIMS address id and other metadata from AddressFinder
        const url = `https://api.addressfinder.io/api/nz/address/metadata/?key=${env.ADDRESS_FINDER_KEY}&format=json&pxid=${id}`
        const response = await get(url)
        if (!response && setError) {
            setError(new Error("Failed to retrieve address data.  The AddressFinder service may be unavailable."))
            return null
        }
        return {
            id: response.aims_address_id,
            address: response.a,
            location: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [response.x, response.y]
                },
                properties: {}
            } as Feature<Point>
        }
    }
}

export default service
