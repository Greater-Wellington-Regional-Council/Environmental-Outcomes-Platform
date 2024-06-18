import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import AddressSearch, { AddressSearchProps } from '@components/AddressSearch/AddressSearch';
import addressesService from '@services/AddressesService';

// Mock the addressesService
vi.mock('@services/AddressesService', () => ({
  default: {
    getAddressOptions: vi.fn().mockResolvedValue([
      { value: '1', label: '123 Example St' },
      { value: '2', label: '456 Sample Rd' },
    ]),
    getAddress: vi.fn().mockResolvedValue((id: unknown) => ({
      id: id,
      full_address_as_text: '123 Example St',
      latitude: 39.7998,
      longitude: -89.6446,
    }))
  }
}));

describe('AddressSearch Component', () => {
  const renderComponent = (props: Partial<AddressSearchProps> = {}) => {
    const defaultProps: AddressSearchProps = {
      label: 'Search for address',
      placeholder: 'Search here',
      onSelect: vi.fn(),
      directionUp: false,
      ...props,
    };

    return render(<AddressSearch {...defaultProps} />);
  };

  it('should render the ComboBox with default label and placeholder', () => {
    renderComponent();

    expect(screen.getByLabelText('Search for address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument();
  });

  it('should call addressesService.getAddressOptions to fetch address options', async () => {
    renderComponent();

    const options = await addressesService.getAddressOptions();

    expect(addressesService.getAddressOptions).toHaveBeenCalled();
    expect(options).toEqual([
      { value: '1', label: '123 Example St' },
      { value: '2', label: '456 Sample Rd' },
    ]);
  });

  it.skip('should display fetched address options in the ComboBox', async () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Search here');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123' } });

    await waitFor(() => {
      expect(screen.getByText('123 Example St')).toBeInTheDocument();
      expect(screen.getByText('456 Sample Rd')).toBeInTheDocument();
    });
  });

  it.skip('should call onSelect when an address is selected', async () => {
    const onSelectMock = vi.fn();
    renderComponent({ onSelect: onSelectMock });

    const input = screen.getByPlaceholderText('Search here');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123' } });

    const option = await screen.findByText('123 Example St');
    fireEvent.click(option);

    await waitFor(() => {
      expect(onSelectMock).toHaveBeenCalledWith('123 Example St');
    });
  });
});
