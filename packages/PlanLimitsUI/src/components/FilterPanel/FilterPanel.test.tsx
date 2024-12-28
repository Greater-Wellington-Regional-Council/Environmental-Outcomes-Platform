import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { FilterPanel, FilterDescriptor, FilterValues } from './FilterPanel';

vi.mock('@components/XToClose/XToClose', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Close</button>
  ),
}));

describe('FilterPanel', () => {
  let mockSetFilterValues: (value: FilterValues) => void;
  let mockOnClose: () => void;

  let filters: FilterDescriptor[];
  let filterValues: FilterValues;

  beforeEach(() => {
    mockSetFilterValues = vi.fn();
    mockOnClose = vi.fn();

    filters = [
      {
        name: 'filter1',
        type: ({ filter, onChange }) => (
          <button data-testid={`filter-${filter.name}`} onClick={() => onChange(filter, 'value1')}>
            {filter.name}
          </button>
        ),
      },
      {
        name: 'filter2',
        type: ({ filter, onChange }) => (
          <button data-testid={`filter-${filter.name}`} onClick={() => onChange(filter, 'value2')}>
            {filter.name}
          </button>
        ),
      },
    ];

    filterValues = {
      filter1: 'initialValue1',
      filter2: 'initialValue2',
    };
  });

  it('renders the filters and close button', () => {
    render(
      <FilterPanel
        filters={filters}
        filterValues={filterValues}
        setFilterValues={mockSetFilterValues}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('filter-filter1')).toBeInTheDocument();
    expect(screen.getByTestId('filter-filter2')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls the onChange handler when filters are interacted with', () => {
    render(
      <FilterPanel
        filters={filters}
        filterValues={filterValues}
        setFilterValues={mockSetFilterValues}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByTestId('filter-filter1'));
    expect(mockSetFilterValues).toHaveBeenCalledWith({ ...filterValues, filter1: 'value1' });

    fireEvent.click(screen.getByTestId('filter-filter2'));
    expect(mockSetFilterValues).toHaveBeenCalledWith({ ...filterValues, filter2: 'value2' });
  });

  it('calls the onClose handler when the close button is clicked', () => {
    render(
      <FilterPanel
        filters={filters}
        filterValues={filterValues}
        setFilterValues={mockSetFilterValues}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
