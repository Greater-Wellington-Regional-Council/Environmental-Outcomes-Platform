import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import DataTable from './DataTable';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => ({
    text: vi.fn(),
    autoTable: vi.fn(),
    save: vi.fn(),
  })),
}));

describe('DataTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the table with data', () => {
    render(<DataTable />);

    expect(screen.getByText('BoothsSW')).toBeInTheDocument();
    expect(screen.getByText('HuangaruaSW')).toBeInTheDocument();
    expect(screen.getByText('Hutt_LowerSW')).toBeInTheDocument();
  });

  it('filters data by catchment', () => {
    render(<DataTable />);

    const filterDropdown = screen.getByTestId('dropdown-catchments');
    fireEvent.click(filterDropdown);

    const option = screen.getByTestId('option-BoothsSW');
    fireEvent.click(option);

    expect(screen.getByTestId('selected-BoothsSW')).toBeInTheDocument();
    expect(screen.queryByTestId('selected-HuangaruaSW')).not.toBeInTheDocument();
    expect(screen.queryByTestId('selected-Hutt_LowerSW')).not.toBeInTheDocument();
  });

  it('filters data by month and year', () => {
    render(<DataTable />);

    const monthYearPicker = screen.getByTestId('dropdown-months');
    fireEvent.click(monthYearPicker);

    const option = screen.getByText('January 2024');
    fireEvent.click(option);

    expect(screen.queryByText('BoothsSW')).toBeInTheDocument();
  });

  it('downloads the filtered data as CSV', () => {
    render(<DataTable />);

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'filtered_data.csv');
  });

  it('prints the filtered data as PDF', () => {
    const mockPDFInstance = new jsPDF();
    render(<DataTable />);

    const printButton = screen.getByText('Print');
    fireEvent.click(printButton);

    expect(mockPDFInstance.text).toHaveBeenCalledWith('Filtered Data', 10, 10);
    expect(mockPDFInstance.autoTable).toHaveBeenCalled();
    expect(mockPDFInstance.save).toHaveBeenCalledWith('filtered_data.pdf');
  });

  it('calculates and displays grand totals correctly', () => {
    render(<DataTable />);

    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getByText('2337.500')).toBeInTheDocument();
  });

  it('renders and interacts with the dropdown for water type correctly', () => {
    render(<DataTable />);

    const waterTypeDropdown = screen.getByTestId('dropdown-water-types');
    fireEvent.click(waterTypeDropdown);

    const option = screen.getByText('Surface water');
    fireEvent.click(option);

    expect(waterTypeDropdown).toHaveTextContent('Surface water');
  });
});
