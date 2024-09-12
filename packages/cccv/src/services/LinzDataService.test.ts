import { describe, it, expect, vi, beforeEach } from "vitest"
import service, {
    ERROR_MESSAGES,
    LDS_ADDRESS_BOUNDARY_TIMEOUT,
    URL_LDS_GET_UOP_GEOMETRY,
} from "@services/LinzDataService"
import { get } from "@lib/api"
import env from "@src/env.ts"

vi.mock("@lib/api")

const mockedGet = get as unknown as ReturnType<typeof vi.fn>

describe("LinzDataService", () => {
    const mockAddressId = 123
    const mockUnitOfPropertyId = 456
    const mockProjection = "EPSG:2193"
    const mockSetError = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getUnitOfPropertyIdForAddressId", () => {
        it("should return unit of property ID for a valid address ID", async () => {
            mockedGet.mockResolvedValueOnce({
                features: [{
                    properties: {
                        unit_of_property_id: mockUnitOfPropertyId,
                    },
                }],
            })

            const result = await service.getUnitOfPropertyIdForAddressId(mockAddressId)

            expect(result).toBe(mockUnitOfPropertyId)
            expect(mockedGet).toHaveBeenCalledWith(
                `https://data.linz.govt.nz/services;key=${env.LINZ_KOORDINATES_API_KEY}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=table-115638&cql_filter=address_id=${mockAddressId}&PropertyName=(id,unit_of_property_id,address_id)&outputFormat=json`
            )
        })

        it("should call setError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getUnitOfPropertyIdForAddressId(mockAddressId, mockSetError)

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.FAILED_TO_RETRIEVE_ADDRESS_DATA(mockAddressId)))
        })
    })

    describe("getGeometryForUnitOfProperty", () => {
        it("should return geometry for a valid unit of property ID", async () => {
            const mockResponse = { type: "FeatureCollection", features: [] }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getGeometryForUnitOfProperty(mockUnitOfPropertyId, mockProjection)

            expect(result).toEqual(mockResponse)
            expect(mockedGet).toHaveBeenCalledWith(
                URL_LDS_GET_UOP_GEOMETRY(mockUnitOfPropertyId, mockProjection),
                { timeout: LDS_ADDRESS_BOUNDARY_TIMEOUT }
            )
        })

        it("should call setError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getGeometryForUnitOfProperty(mockUnitOfPropertyId, mockProjection, mockSetError)

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.FAILED_TO_RETRIEVE_GEOMETRY_DATA(mockUnitOfPropertyId)))
        })
    })

    describe("getGeometryForAddressId", () => {
        it("should return geometry for a valid address ID", async () => {
            const mockResponse = { type: "FeatureCollection", features: [] }

            mockedGet.mockResolvedValueOnce({
                features: [{
                    properties: {
                        unit_of_property_id: mockUnitOfPropertyId,
                    },
                }],
            })

            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getGeometryForAddressId(mockAddressId)

            expect(result).toEqual(mockResponse)
        })

        it("should return null if unit of property ID is not found", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getGeometryForAddressId(mockAddressId, mockProjection, mockSetError)

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.FAILED_TO_RETRIEVE_ADDRESS_DATA(mockAddressId)))
        })
    })
})