import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WaterAllocationTable } from '@components/WaterAllocationTable/WaterAllocationTable';
import { Councils } from '@lib/councilData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import monthToToday from '@lib/monthToToday';

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

// const mockData = [
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Lower HuttGW",
//     "plan_region_id": 3,
//     "category_b": 31324423.0,
//     "category_bc": 150580.8,
//     "category_c": 0,
//     "total_allocation": 31475003.8,
//     "allocation_limit": 36500000,
//     "pnrp_allocation_percentage": 86.2,
//     "name": "Lower Hutt"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Upper HuttGW",
//     "plan_region_id": 3,
//     "category_b": 100804.0,
//     "category_bc": 0,
//     "category_c": 0,
//     "total_allocation": 100804.0,
//     "allocation_limit": 770000,
//     "pnrp_allocation_percentage": 13.1,
//     "name": "Upper Hutt"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Dry RiverGW",
//     "plan_region_id": 4,
//     "category_b": 647466.0,
//     "category_bc": 142500.0,
//     "category_c": 0,
//     "total_allocation": 789966.0,
//     "allocation_limit": 650000,
//     "pnrp_allocation_percentage": 121.5,
//     "name": "Dry River"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Fernhill TiffenGW",
//     "plan_region_id": 4,
//     "category_b": 0,
//     "category_bc": 0,
//     "category_c": 1200000.0,
//     "total_allocation": 1200000.0,
//     "allocation_limit": 1200000,
//     "pnrp_allocation_percentage": 100.0,
//     "name": "Fernhill-Tiffen"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "HuangaruaGW",
//     "plan_region_id": 4,
//     "category_b": 351658.6,
//     "category_bc": 636713.8,
//     "category_c": 0,
//     "total_allocation": 988372.4,
//     "allocation_limit": 650000,
//     "pnrp_allocation_percentage": 152.1,
//     "name": "Huangarua"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "LakeGW",
//     "plan_region_id": 4,
//     "category_b": 0,
//     "category_bc": 0,
//     "category_c": 10694925.0,
//     "total_allocation": 10694925.0,
//     "allocation_limit": 6750000,
//     "pnrp_allocation_percentage": 158.4,
//     "name": "Lake"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "MangatarereGW",
//     "plan_region_id": 4,
//     "category_b": 2722616.2,
//     "category_bc": 0,
//     "category_c": 826744.0,
//     "total_allocation": 3549360.2,
//     "allocation_limit": 2300000,
//     "pnrp_allocation_percentage": 154.3,
//     "name": "Mangatarere"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "MartinboroughGW",
//     "plan_region_id": 4,
//     "category_b": 0,
//     "category_bc": 0,
//     "category_c": 781673.15,
//     "total_allocation": 781673.15,
//     "allocation_limit": 800000,
//     "pnrp_allocation_percentage": 97.7,
//     "name": "Martinborough"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "OnokeGW",
//     "plan_region_id": 4,
//     "category_b": 0,
//     "category_bc": 0,
//     "category_c": 1933566.0,
//     "total_allocation": 1933566.0,
//     "allocation_limit": 2100000,
//     "pnrp_allocation_percentage": 92.1,
//     "name": "Onoke"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Parkvale_ConfinedGW",
//     "plan_region_id": 4,
//     "category_b": 0,
//     "category_bc": 0,
//     "category_c": 2162700.0,
//     "total_allocation": 2162700.0,
//     "allocation_limit": 1550000,
//     "pnrp_allocation_percentage": 139.5,
//     "name": "Parkvale"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "TaratahiGW",
//     "plan_region_id": 4,
//     "category_b": 291205.8,
//     "category_bc": 0,
//     "category_c": 278280.0,
//     "total_allocation": 569485.8,
//     "allocation_limit": 1400000,
//     "pnrp_allocation_percentage": 40.7,
//     "name": "Taratahi"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "TauherenikauGW",
//     "plan_region_id": 4,
//     "category_b": 2678989.24,
//     "category_bc": 6026225.0,
//     "category_c": 0,
//     "total_allocation": 8705214.24,
//     "allocation_limit": 6600000,
//     "pnrp_allocation_percentage": 131.9,
//     "name": "Tauherenikau"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Te Ore OreGW",
//     "plan_region_id": 4,
//     "category_b": 1163781.2,
//     "category_bc": 36750.0,
//     "category_c": 0,
//     "total_allocation": 1200531.2,
//     "allocation_limit": 480000,
//     "pnrp_allocation_percentage": 250.1,
//     "name": "Te Ore Ore"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Upper RuamahangaGW",
//     "plan_region_id": 4,
//     "category_b": 688910.0,
//     "category_bc": 29120.0,
//     "category_c": 30985.0,
//     "total_allocation": 749015.0,
//     "allocation_limit": 3550000,
//     "pnrp_allocation_percentage": 21.1,
//     "name": "Upper Ruamāhanga"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "WaingawaGW",
//     "plan_region_id": 4,
//     "category_b": 417494.0,
//     "category_bc": 53156.0,
//     "category_c": 533638.0,
//     "total_allocation": 1004288.0,
//     "allocation_limit": 1900000,
//     "pnrp_allocation_percentage": 52.9,
//     "name": "Waingawa"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "RaumatiGW",
//     "plan_region_id": 1,
//     "category_b": 164358.0,
//     "category_bc": 127302.0,
//     "category_c": 0,
//     "total_allocation": 291660.0,
//     "allocation_limit": 1229000,
//     "pnrp_allocation_percentage": 23.7,
//     "name": "Raumati"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "Te HoroGW",
//     "plan_region_id": 1,
//     "category_b": 98030.0,
//     "category_bc": 522497.0,
//     "category_c": 0,
//     "total_allocation": 620527.0,
//     "allocation_limit": 1620000,
//     "pnrp_allocation_percentage": 38.3,
//     "name": "Te Horo"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "WaikanaeGW",
//     "plan_region_id": 1,
//     "category_b": 11250.0,
//     "category_bc": 2425698.0,
//     "category_c": 0,
//     "total_allocation": 2436948.0,
//     "allocation_limit": 2710000,
//     "pnrp_allocation_percentage": 89.9,
//     "name": "Waikanae"
//   },
//   {
//     "month_start": "2024-11-01",
//     "area_id": "WaitohuGW",
//     "plan_region_id": 1,
//     "category_b": 0,
//     "category_bc": 95811.0,
//     "category_c": 0,
//     "total_allocation": 95811.0,
//     "allocation_limit": 1080000,
//     "pnrp_allocation_percentage": 8.9,
//     "name": "Waitohu Stream subcatchment"
//   }
// ];

const columns = [
  { name: 'month_start', visible: false, type: 'date' },
  { name: 'area_id', visible: false },
  { name: 'plan_region_id', visible: false },
  {
    name: 'category_a', type: 'number', formula: 'sum(category_a)',
    valueOk: [(value: number) => value > 0], heading: 'Surface take',
  },
  {
    name: 'category_b', type: 'number', formula: 'sum(category_b)',
    valueOk: [(value: number) => value > 0], heading: 'Groundwater take',
  },
  {
    name: 'category_bc', type: 'number', formula: 'sum(category_bc)',
    valueOk: [(value: number) => value > 0], heading: 'Groundwater take (confined)',
  },
  {
    name: 'category_c', type: 'number', formula: 'sum(category_c)',
    valueOk: [(value: number) => value > 0], heading: 'Groundwater take (unconfined)',
  },
];

describe('WaterAllocationTable Component', () => {
  it('renders the table with correct headers and data', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <WaterAllocationTable council={Councils.find(c => c.slug == 'gw')!} />
      </QueryClientProvider>
    )

    columns.forEach((col, index) => {
      if (index > 0 && col.visible)
        expect(screen.getByText(col.heading!)).toBeInTheDocument();
    });
  })

  it('includes a dropdown of months', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <WaterAllocationTable council={Councils.find(c => c.slug == 'gw')!} />
      </QueryClientProvider>
    )

    const monthDropdown = screen.getByLabelText(/from:/i);
    expect(monthDropdown).toBeInTheDocument();
  });

  it('has current month as first item of dropdown', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <WaterAllocationTable council={Councils.find(c => c.slug == 'gw')!} />
      </QueryClientProvider>
    )

    const monthDropdown = screen.getByLabelText(/from:/i);
    expect(monthDropdown).toHaveTextContent(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  });

  it('includes day in first item of dropdown if today not end of month', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <WaterAllocationTable council={Councils.find(c => c.slug == 'gw')!} />
      </QueryClientProvider>
    )

    const monthDropdown = screen.getByLabelText(/from:/i);
    const firstEntry = monthToToday();
    console.log(firstEntry)
    expect(monthDropdown).toHaveTextContent(firstEntry);
  });

  it('includes day in first item of dropdown if today Is end of month', () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    today.setDate(lastDayOfMonth);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <WaterAllocationTable council={Councils.find(c => c.slug == 'gw')!} />
      </QueryClientProvider>
    )

    const monthDropdown = screen.getByLabelText(/from:/i);
    const firstEntry = monthToToday(today);
    expect(firstEntry).not.toContain('til the');
    expect(monthDropdown).toHaveTextContent(firstEntry);
  });
});
