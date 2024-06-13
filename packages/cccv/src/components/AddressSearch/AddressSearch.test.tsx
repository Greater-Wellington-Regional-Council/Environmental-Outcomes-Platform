// import { render, screen } from '@testing-library/react';
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import AddressSearch, { AddressSearchProps } from './AddressSearch';
// import addressesService, { Address } from '@services/AddressesService';
//
// // Mock the addressesService
// vi.mock('@services/AddressesService', () => {
//   return {
//     default: {
//       getAddresses: () => [
//         { address: '123 Main St' },
//         { address: '456 Elm St' },
//         { address: '789 Oak St' },
//       ],
//     },
//   };
// });
//
// describe('AddressSearch Component', () => {
//   const defaultProps: AddressSearchProps = {
//     startPattern: 'Search here',
//   };
//
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });
//
//   it('renders the Select component with the correct label and placeholder', () => {
//     render(<AddressSearch {...defaultProps} />);
//
//     // Check that the Select component is rendered with the correct label
//     const selectLabel = screen.getByText('Search for address');
//     expect(selectLabel).toBeInTheDocument();
//
//     // Check that the placeholder is set correctly
//     const selectPlaceholder = screen.getByDisplayValue(defaultProps.startPattern);
//     expect(selectPlaceholder).toBeInTheDocument();
//   });
//
//   it('renders the correct number of options from the addressesService', () => {
//     render(<AddressSearch {...defaultProps} />);
//
//     // Check that the Select component contains the correct options
//     const options = addressesService.getAddresses();
//     options.forEach((address: Address) => {
//       const optionElement = screen.getByText(address.address);
//       expect(optionElement).toBeInTheDocument();
//     });
//   });
//
//   it('applies the correct class to the Select component and container', () => {
//     render(<AddressSearch {...defaultProps} />);
//
//     // Check the container class
//     const container = screen.getByText('Search for address').closest('div');
//     expect(container).toHaveClass('w-72');
//
//     // Check the Select component class
//     const selectElement = screen.getByText('Search for address').closest('div');
//     expect(selectElement).toHaveClass('text-textCaption rounded-none');
//   });
// });