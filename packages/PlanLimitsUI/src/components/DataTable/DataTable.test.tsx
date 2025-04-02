import React, { useMemo } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTable from './DataTable';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterDescriptor } from '@components/FilterPanel/FilterPanel';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    autoTable: vi.fn(),
    save: vi.fn(),
    addFileToVFS: vi.fn(),
    addFont: vi.fn(),
    setFont: vi.fn(),
    internal: { pageSize: 8 }
  })),
}));

const mockData = [
  { name: 'Location A', category_a: 10, category_b: 20, surface_take: 30 },
  { name: 'Location B', category_a: 15, category_b: 26, surface_take: 40 },
];

const columns = [
  { name: 'name', heading: 'Name', visible: true },
  { name: 'category_a', heading: 'Category A', visible: true, type: 'number' },
  { name: 'category_b', heading: 'Category B', visible: true, type: 'number' },
  { name: 'surface_take', heading: 'Surface Take', visible: true, type: 'number' },
];

const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactNode) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

const emptyFilters: FilterDescriptor[] = [];

describe('DataTable Component', () => {
  test('renders DataTable', () => {
    render(<DataTable data={[]} columns={[]} outerFilters={emptyFilters} />);
  });

  it('handles empty data gracefully', () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        options={{ includeTotals: false }}
      />
    );

    expect(screen.getByText(/There is no data for these criteria/i)).toBeInTheDocument();
  });

  it('calculates totals correctly when enabled', () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        options={{ includeTotals: true }}
      />
    );

    expect(screen.getByText('Grand total')).toBeInTheDocument();
    const totalCategoryA = mockData.reduce((sum, row) => sum + row.category_a, 0);
    const totalCategoryB = mockData.reduce((sum, row) => sum + row.category_b, 0);
    const totalSurfaceTake = mockData.reduce((sum, row) => sum + row.surface_take, 0);

    expect(screen.getByText(totalCategoryA.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(totalCategoryB.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(totalSurfaceTake.toFixed(2))).toBeInTheDocument();
  });

  it('exports data as CSV when download button is clicked', () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        options={{ includeTotals: false }}
      />
    );

    const downloadButton = screen.getByText(/Download/i);
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalled();
    const csvContent = vi.mocked(saveAs).mock.calls[0][0];
    expect(csvContent).toBeInstanceOf(Blob);
  });

  it('exports data as PDF when print button is clicked', () => {
    render(
      <DataTable
        data={mockData}
        columns={columns}
        options={{ includeTotals: false }}
      />
    );

    const printButton = screen.getByText(/Print/i);

    fireEvent.click(printButton);

    expect(jsPDF).toHaveBeenCalled();
    const pdfInstance = vi.mocked(jsPDF).mock.results[0].value;
    expect(pdfInstance.autoTable).toHaveBeenCalled();
  });
});
