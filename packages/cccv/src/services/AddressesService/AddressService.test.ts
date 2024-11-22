import { vi } from 'vitest'
import service, { AddressFinderResponse, AddressLabelAndValue } from './AddressesService.ts'
import { get } from '@lib/api.tsx'
import { mocked } from "@storybook/test"
import { announceError } from "@components/ErrorContext/announceError.ts"

vi.mock('@lib/api.tsx', () => ({
    get: vi.fn(),
    determineBackendUri: vi.fn(() => '<backend>')
}))

vi.mock('@components/ErrorContext/announceError.ts', () => ({
    announceError: vi.fn()
}))

describe('AddressFinder Service', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('getAddressOptions', () => {
        it('returns address options when API call succeeds', async () => {
            const mockResponse: AddressFinderResponse = {
                completions: [
                    { a: '123 Test Street', pxid: 'PXID1', v: 1, highlighted_a: '123 Test Street', success: true },
                ],
                paid: true,
                demo: false,
                success: true
            };

            (mocked(get)).mockResolvedValueOnce(mockResponse)

            const result = await service.getAddressOptions('Test')

            expect(result).toEqual(mockResponse)
            expect(get).toHaveBeenCalledWith(expect.stringContaining(`<backend>/addresses/options?query=Test&regionCode=F&format=json`))
        })

        it('handles API failure gracefully and calls announceError', async () => {
            (mocked(get)).mockResolvedValueOnce(null)

            const result = await service.getAddressOptions('Test')

            expect(result).toEqual([])
            expect(announceError).toHaveBeenCalledWith(
                expect.any(String),
                expect.anything()
            )
        })
    })

    describe('getAddressByPxid', () => {
        it('returns address data when API call succeeds', async () => {
            const mockResponse = {
                aims_address_id: 123,
                a: '123 Test Street',
                x: 174.763336,
                y: -36.848461,
            }

            const selected: AddressLabelAndValue = { label: '123 Test Street', value: 123 };

            (mocked(get)).mockResolvedValueOnce(mockResponse)

            const result = await service.getAddressByPxid(selected.value)

            expect(result).toEqual(mockResponse)
            expect(get).toHaveBeenCalledWith(expect.stringContaining(`<backend>/addresses/123`))
        })

        it('handles API failure gracefully and calls announceError', async () => {
            const selected: AddressLabelAndValue = { label: '123 Test Street', value: 123 };

            (mocked(get)).mockResolvedValueOnce(null)

            const result = await service.getAddressByPxid(selected.value)

            expect(result).toBeNull()
            expect(announceError).toHaveBeenCalledWith(
                expect.any(String),
                expect.anything()
            )
        })
    })
})