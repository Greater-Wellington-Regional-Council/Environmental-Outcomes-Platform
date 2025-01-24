import { describe, it, expect, vi, beforeEach } from "vitest"
import service from "@services/SystemValueService/SystemValueService.ts"
import { get } from "@lib/api.tsx"
import { announceError } from "@components/ErrorContext/announceError.ts"

vi.mock("@lib/api")

vi.mock('@components/ErrorContext/announceError.ts', () => ({
    announceError: vi.fn()
}))

const mockedGet = get as unknown as ReturnType<typeof vi.fn>

describe("SystemValueService", () => {
    const mockValueName = "test.value"
    const mockCouncilId = 1

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getSystemValue", () => {
        it("should return system value when councilId is provided", async () => {
            const mockResponse = { value: "value" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getSystemValue(mockValueName, mockCouncilId)

            expect(result).toEqual(mockResponse.value)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining(`/system-values/${mockCouncilId}/${mockValueName}`))
        })

        it("should return system value when councilId is not provided", async () => {
            const mockResponse = { value: "value" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getSystemValue(mockValueName, null)

            expect(result).toEqual(mockResponse.value)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining(`/system-values/${mockValueName}`))
        })

        it("should call announceError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getSystemValue(mockValueName, mockCouncilId)

            expect(result).toBeNull()
            expect(announceError).toHaveBeenCalledWith(
                expect.any(String),
                expect.anything()
            )
        })
    })
})