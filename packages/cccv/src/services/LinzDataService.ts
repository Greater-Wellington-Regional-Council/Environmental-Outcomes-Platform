import env from "@src/env.ts"
import {get} from "@lib/api.tsx"
import {AddressId} from "@services/AddressesService.ts"
import {DEFAULT_PROJECTION} from "@lib/projections.ts"
import {FeatureCollection} from "geojson"
import _ from "lodash"
import {handleError} from "@lib/HandleError.ts"

type UnitOfPropertyId = number | string;

export const ERROR_MESSAGES = {
    FAILED_TO_RETRIEVE_ADDRESS_DATA: (addressId: AddressId) => `Failed to retrieve address data for address ${addressId}.  The LINZ data service may be unavailable.`,
    FAILED_TO_RETRIEVE_GEOMETRY_DATA: (addressId: UnitOfPropertyId) => `Failed to retrieve geometry data for address ${addressId}.  The LINZ Data service may be unavailable.`
}

export const URL_LDS_UOP_ID_FOR_ADDRESS_ID = (addressId: AddressId) => `https://data.linz.govt.nz/services;key=${env.LINZ_KOORDINATES_API_KEY}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=table-115638&cql_filter=address_id=${addressId}&PropertyName=(id,unit_of_property_id,address_id)&outputFormat=json`
export const URL_LDS_GET_UOP_GEOMETRY = (unitOfPropertyId: UnitOfPropertyId, projection: string) => `https://data.linz.govt.nz/services;key=${env.LINZ_KOORDINATES_API_KEY}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=layer-113968&cql_filter=unit_of_property_id='${unitOfPropertyId}'&PropertyName=(unit_of_property_id,geom)&SRSName=${projection}&outputFormat=json`

export const DUMMY_UNIT_OF_PROPERTY_LOCATION = {
    location: {
        type: "Feature",
        id: "layer-113968.ff665bbc-efea-47cf-8566-3daa73f6bd28",
        geometry: {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [175.5274944667, -41.0192980833],
                        [175.5271381333, -41.0190800833],
                        [175.5265740667, -41.0194897],
                        [175.5263784833, -41.0196317667],
                        [175.5259184667, -41.0199657167],
                        [175.5256383167, -41.0201700833],
                        [175.5259668833, -41.02036005],
                        [175.5259905333, -41.0203737333],
                        [175.5260505833, -41.0204084667],
                        [175.5261882833, -41.0204881],
                        [175.5267678167, -41.0208232],
                        [175.5270466167, -41.0209843667],
                        [175.5270559167, -41.02098975],
                        [175.5268116833, -41.02125815],
                        [175.5265493, -41.0215305833],
                        [175.5265949, -41.0215569333],
                        [175.5266069833, -41.0215639167],
                        [175.5267395, -41.0216405167],
                        [175.5271523833, -41.0211868],
                        [175.52726955, -41.0210579833],
                        [175.52757115, -41.0211757333],
                        [175.5277083833, -41.0212293667],
                        [175.5278366667, -41.0210889167],
                        [175.5278454667, -41.0210792833],
                        [175.5279685667, -41.0209444833],
                        [175.5281004167, -41.0208000667],
                        [175.5282322667, -41.0206556333],
                        [175.5283641167, -41.0205111833],
                        [175.5284959833, -41.0203667833],
                        [175.52862785, -41.0202223333],
                        [175.5287630833, -41.0200741167],
                        [175.5286845833, -41.02002615],
                        [175.5284713, -41.0198957667],
                        [175.5282997667, -41.0197908167],
                        [175.5282852167, -41.0197819],
                        [175.5281913833, -41.0197245333],
                        [175.52809915, -41.0196680833],
                        [175.5279130167, -41.0195542],
                        [175.5275409, -41.0193265667],
                        [175.5274944667, -41.0192980833]
                    ]
                ]
            ]
        },
        properties: {
            unit_of_property_id: "ff665bbc-efea-47cf-8566-3daa73f6bd28"
        }
    }
}

export const LDS_ADDRESS_BOUNDARY_TIMEOUT = 10000

interface UnitsOfProperty extends FeatureCollection {
    "totalFeatures": string | number,
    "numberReturned": number,
    "timeStamp": string,
    "crs": string
}

const service = {
    getUnitOfPropertyIdForAddressId: async (addressId: AddressId, setError: null | ((error: Error | null) => void) = null): Promise<UnitOfPropertyId | null> => {
        const response = await get(URL_LDS_UOP_ID_FOR_ADDRESS_ID(addressId))
        if (!response) return handleError(`Failed to retrieve address data for address ${addressId}.  The LINZ data service may be unavailable.`, setError) as null
        return _.get(response, "features[0].properties.unit_of_property_id")
    },
    getGeometryForUnitOfProperty: async (unitOfPropertyId: UnitOfPropertyId, projection = DEFAULT_PROJECTION, setError: null | ((error: Error | null) => void) = null): Promise<UnitsOfProperty | null> => {
        const response = await get(URL_LDS_GET_UOP_GEOMETRY(unitOfPropertyId, projection), { timeout: LDS_ADDRESS_BOUNDARY_TIMEOUT } )
        if (!response) return handleError(`Failed to retrieve geometry data for address ${unitOfPropertyId}.  The LINZ Data service may be unavailable.`, setError) as null
        return response
    },
    getGeometryForAddressId: async (addressId: AddressId, projection = 'EPSG:4326', setError: null | ((error: Error | null) => void) = null): Promise<FeatureCollection | null> => {
        const unitOfPropertyId = await service.getUnitOfPropertyIdForAddressId(addressId, setError)
        if (!unitOfPropertyId) return null
        const geom = await service.getGeometryForUnitOfProperty(unitOfPropertyId, projection) as FeatureCollection
        if (!geom) return null
        return geom
    }
}

export default service
