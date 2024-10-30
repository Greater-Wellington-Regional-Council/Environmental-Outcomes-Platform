import { describe, it, expect, vi, beforeEach } from "vitest"
import service from "@services/OrgService/OrgService.ts"
import { get } from "@lib/api.tsx"
import { ErrorFlag, ErrorLevel } from "@components/ErrorContext/ErrorContext.ts"

vi.mock("@lib/api")

const mockedGet = get as unknown as ReturnType<typeof vi.fn>

describe("OrgService", () => {
    const mockSetError = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getContactDetails", () => {
        it("should return contact details when API call is successful", async () => {
            const mockResponse = { name: "Organization", email: "contact@org.com" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getContactDetails(mockSetError)

            expect(result).toEqual(mockResponse)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("/org/contact-details"))
        })

        it("should call setError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getContactDetails(mockSetError, "Contact details unavailable")

            expect(result).toBeNull()
            expect(mockSetError).toHaveBeenCalledWith(
                new ErrorFlag("Contact details unavailable", ErrorLevel.WARNING)
            )
        })
    })
})