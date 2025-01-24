import { describe, it, expect, vi, beforeEach } from "vitest"
import service from "@services/OrgService/OrgService.ts"
import { get } from "@lib/api.tsx"
import {announceError} from "@components/ErrorContext/announceError.ts"

vi.mock("@lib/api")

vi.mock('@components/ErrorContext/announceError.ts', () => ({
    announceError: vi.fn()
}))

const mockedGet = get as unknown as ReturnType<typeof vi.fn>

describe("OrgService", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("getContactDetails", () => {
        it("should return contact details when API call is successful", async () => {
            const mockResponse = { name: "Organization", email: "contact@org.com" }
            mockedGet.mockResolvedValueOnce(mockResponse)

            const result = await service.getContactDetails()

            expect(result).toEqual(mockResponse)
            expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("/org/contact-details"))
        })

        it("should call announceError and return null on failure", async () => {
            mockedGet.mockResolvedValueOnce(null)

            const result = await service.getContactDetails()

            expect(result).toBeNull()
            expect(announceError).toHaveBeenCalledWith(
                expect.any(String),
                expect.anything()
            )
        })
    })
})