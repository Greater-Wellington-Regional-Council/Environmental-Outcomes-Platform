import { describe, it, expect, vi, beforeEach } from "vitest"
import service from "@services/SystemValueService/SystemValueService.ts"
import { get } from "@lib/api.tsx"
import { ErrorFlag, ErrorLevel } from "@components/ErrorContext/ErrorContext.ts"

vi.mock("@lib/api")

const mockedGet = get as unknown as ReturnType<typeof vi.fn>

describe("SystemValueService", () => {
    const mockValueName = "test.value"
    const mockCouncilId = 1
    const mockSetError = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getSystemValue", () => {
        it("should return system value when councilId is provided", async () => {
            const mockResponse = { value: "value" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getSystemValue(mockValueName, mockCouncilId, mockSetError)

            expect(result).toEqual(mockResponse.value)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining(`/system-values/${mockCouncilId}/${mockValueName}`))
        })

        it("should return system value when councilId is not provided", async () => {
            const mockResponse = { value: "value" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getSystemValue(mockValueName, null, mockSetError)

            expect(result).toEqual(mockResponse.value)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining(`/system-values/${mockValueName}`))
        })

        it("should call setError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getSystemValue(mockValueName, mockCouncilId, mockSetError, "System value unavailable")

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(
                new ErrorFlag("System value unavailable", ErrorLevel.WARNING)
            )
        })
    })
})