import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddressSearch from './AddressSearch';

vi.mock('@services/AddressesService', () => {
  return {
    default: {
      getAddresses: vi.fn().mockResolvedValue([
        { address: '123 Main St' },
        { address: '456 Elm St' },
        { address: '789 Oak St' }
      ])
    }
  }
});

describe('AddressSearch Component', () => {
  it('renders the ComboBox with the correct label and placeholder', async () => {
    render(<AddressSearch label="Search for address" placeholder="Search here" onSelect={() => {}} />);

    const label = screen.getByLabelText('Search for address');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Search here');
    expect(input).toBeInTheDocument();
  });

  it('fetches and displays the addresses', async () => {
    render(<AddressSearch label="Search for address" placeholder="Search here" onSelect={() => {}} initialValue="m" />);

    // Wait for the addresses to be fetched and displayed
    const address1 = await screen.findByText('123 Main St');
    const address2 = await screen.findByText('456 Elm St');
    const address3 = await screen.findByText('789 Oak St');

    expect(address1).toBeInTheDocument();
    expect(address2).toBeInTheDocument();
    expect(address3).toBeInTheDocument();
  });

  it('filters the addresses based on the input query', async () => {
    render(<AddressSearch label="Search for address" placeholder="Search here" onSelect={() => {}} />);

    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: '123' } });

    // Only the matching address should be displayed
    const address1 = await screen.findByText('123 Main St');
    expect(address1).toBeInTheDocument();

    // The non-matching addresses should not be displayed
    const address2 = screen.queryByText('456 Elm St');
    const address3 = screen.queryByText('789 Oak St');
    expect(address2).not.toBeInTheDocument();
    expect(address3).not.toBeInTheDocument();
  });

  it('handles address selection correctly', async () => {
    const handleSelect = vi.fn();
    render(<AddressSearch label="Search for address" placeholder="Search here" onSelect={handleSelect} />);

    const input = screen.getByPlaceholderText('Search here');
    fireEvent.change(input, { target: { value: '123' } });

    const address1 = await screen.findByText('123 Main St');
    fireEvent.click(address1);

    expect(handleSelect).toHaveBeenCalledWith('123 Main St');
  });
});