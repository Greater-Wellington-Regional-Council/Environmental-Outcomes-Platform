import {vi} from 'vitest';
import service, { AddressFinderResponse, AddressLabelAndValue, Address } from './AddressesService';
import { get } from '@lib/api.tsx'; // assuming you have this file and `get` method as an import
import env from '@src/env.ts';
import {mocked} from "@storybook/test"; // assuming this is where you store your env variables

vi.mock('@lib/api.tsx', () => ({
    get: vi.fn(),
}));

describe('AddressFinder Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

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

            (mocked(get)).mockResolvedValueOnce(mockResponse);

            const result = await service.getAddressOptions('Test');

            expect(result).toEqual([{ label: '123 Test Street', value: 'PXID1' }]);
            expect(get).toHaveBeenCalledWith(expect.stringContaining(`https://api.addressfinder.io/api/nz/address/autocomplete/?key=${env.ADDRESS_FINDER_KEY}`));
        });

        it('handles API failure gracefully and calls setError', async () => {
            const setError = vi.fn();

            (mocked(get)).mockResolvedValueOnce(null);

            const result = await service.getAddressOptions('Test', setError);

            expect(result).toEqual([]);
            expect(setError).toHaveBeenCalledWith(expect.any(Error));
            expect(setError.mock.calls[0][0].message).toBe("Failed to get matching addresses.  The AddressFinder service may be unavailable.");
        });
    });

    describe('getAddress', () => {
        it('returns address data when API call succeeds', async () => {
            const mockResponse = {
                aims_address_id: 123,
                a: '123 Test Street',
                x: 174.763336,
                y: -36.848461,
            };

            const selected: AddressLabelAndValue = { label: '123 Test Street', value: 123 };

            (mocked(get)).mockResolvedValueOnce(mockResponse);

            const result = await service.getAddressByPxid(selected);

            const expectedAddress: Address = {
                id: 123,
                address: '123 Test Street',
                location: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [174.763336, -36.848461],
                    },
                    properties: {}
                },
            };

            expect(result).toEqual(expectedAddress);
            expect(get).toHaveBeenCalledWith(expect.stringContaining(`https://api.addressfinder.io/api/nz/address/metadata/?key=${env.ADDRESS_FINDER_KEY}`));
        });

        it('handles API failure gracefully and calls setError', async () => {
            const setError = vi.fn();
            const selected: AddressLabelAndValue = { label: '123 Test Street', value: 123 };

            (mocked(get)).mockResolvedValueOnce(null);

            const result = await service.getAddressByPxid(selected, setError);

            expect(result).toBeNull();
            expect(setError).toHaveBeenCalledWith(expect.any(Error));
            expect(setError.mock.calls[0][0].message).toBe("Failed to retrieve address data.  The AddressFinder service may be unavailable.");
        });
    });
});