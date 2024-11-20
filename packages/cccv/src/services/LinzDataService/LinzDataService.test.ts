import { describe, it, expect, vi, beforeEach } from "vitest"
import service, {
    ERROR_MESSAGES
} from "@services/LinzDataService/LinzDataService.ts"
import { get } from "@lib/api.tsx"

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

    describe("getGeometryForAddressId", () => {
        it("should return geometry for a valid address ID", async () => {
            const mockResponse = {
                features: [{
                    properties: {
                        unit_of_property_id: mockUnitOfPropertyId,
                    },
                }],
            }

            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getGeometryForAddressId(mockAddressId)

            expect(result).toEqual(mockResponse)
        })

        it("should return null if unit of property ID is not found", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getGeometryForAddressId(mockAddressId, mockProjection, mockSetError)

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(new Error(ERROR_MESSAGES.FAILED_TO_RETRIEVE_GEOMETRY_DATA(mockAddressId)))
        })
    })
})