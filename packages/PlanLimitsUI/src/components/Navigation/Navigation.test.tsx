import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLoaderData } from 'react-router-dom';
import { Provider, useAtom } from 'jotai';
import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';
import Navigation from './Navigation';

vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof import('jotai')>('jotai');
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

describe('Navigation Component', () => {
  const mockCouncil = { slug: 'mock-council' };
  const mockInitialViewLocation = {
    locationString: '@1,2,3',
    pinnedLocation: 'mock-pinned-location',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the navigation titles correctly', () => {
    (useAtom as Mock).mockReturnValue([mockCouncil]);
    (useLoaderData as Mock).mockReturnValue(mockInitialViewLocation);

    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('View:')).toBeInTheDocument();
    expect(screen.getByText('Allocations and usage map')).toBeInTheDocument();
    expect(screen.getByText('Allocations table')).toBeInTheDocument();
  });

  it('renders the correct links when locationString is provided', () => {
    (useAtom as Mock).mockReturnValue([mockCouncil]);
    (useLoaderData as Mock).mockReturnValue(mockInitialViewLocation);

    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    const usageMapLink = screen.getByText('Allocations and usage map').closest('a');
    const allocationsTableLink = screen.getByText('Allocations table').closest('a');

    expect(usageMapLink).toHaveAttribute(
      'href', // Use href instead of link
      `/limits/${mockCouncil.slug}/@1,2,3`
    );
    expect(allocationsTableLink).toHaveAttribute(
      'href', // Use href instead of link
      `/limits/${mockCouncil.slug}/allocation`
    );
  });

  it('renders the correct link when locationString is not provided', () => {
    (useAtom as Mock).mockReturnValue([mockCouncil]);
    (useLoaderData as Mock).mockReturnValue({ locationString: null });

    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    const usageMapLink = screen.getByText('Allocations and usage map').closest('a');

    expect(usageMapLink).toHaveAttribute(
      'href', // Use href instead of link
      `/limits/${mockCouncil.slug}`
    );
  });
});
