import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { describe, it, beforeEach, vi, Mock } from 'vitest';
import Navigation from './Navigation';
import { useAtom } from 'jotai';
import { useLoaderData, useLocation } from 'react-router-dom';

vi.mock('jotai', () => ({
  useAtom: vi.fn(),
  Provider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('react-router-dom', () => ({
  useLoaderData: vi.fn(),
  useLocation: vi.fn(),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAtom as Mock).mockReturnValue([{ slug: 'mock-council' }]);
    (useLoaderData as Mock).mockReturnValue({
      locationString: { latitude: 1, longitude: 2, zoom: 3 },
    });
    (useLocation as Mock).mockReturnValue({ pathname: '/' });
  });

  it('renders the navigation titles and links correctly', () => {
    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    );

    screen.debug();

    expect(screen.getByText(/View:/i)).toBeInTheDocument();

    expect(screen.getByText('Allocations and usage map')).toHaveAttribute(
      'href',
      '/limits/mock-council/@1,2,3z',
    );
    expect(screen.getByText('Allocations table')).toHaveAttribute(
      'href',
      '/limits/mock-council/allocation',
    );
  });
});

describe('Navigation Component', () => {
  const mockCouncil = { slug: 'mock-council' };
  const mockLocationString = '@1,2,3z';

  beforeEach(() => {
    vi.clearAllMocks();
    (useAtom as Mock).mockReturnValue([mockCouncil]);
    (useLoaderData as Mock).mockReturnValue({
      locationString: { latitude: 1, longitude: 2, zoom: 3 },
    });
    (useLocation as Mock).mockReturnValue({ pathname: '/' });
  });

  it('renders navigation titles correctly', () => {
    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    );

    // Verify the "View:" text
    expect(screen.getByText('View:')).toBeInTheDocument();

    // Verify navigation links
    expect(screen.getByText('Allocations and usage map')).toBeInTheDocument();
    expect(screen.getByText('Allocations table')).toBeInTheDocument();
  });

  it('renders correct links when locationString is provided', () => {
    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    );

    const usageMapLink = screen
      .getByText('Allocations and usage map')
      .closest('a');
    const allocationsTableLink = screen
      .getByText('Allocations table')
      .closest('a');

    expect(usageMapLink).toHaveAttribute(
      'href',
      `/limits/${mockCouncil.slug}/${mockLocationString}`,
    );
    expect(allocationsTableLink).toHaveAttribute(
      'href',
      `/limits/${mockCouncil.slug}/allocation`,
    );
  });

  it('renders correct link when locationString is not provided', () => {
    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    );

    const usageMapLink = screen
      .getByText('Allocations and usage map')
      .closest('a');

    expect(usageMapLink).toHaveAttribute(
      'href',
      `/limits/${mockCouncil.slug}/${mockLocationString}`,
    );
  });

  it('applies active styling to the correct link based on current location', () => {
    (useLocation as Mock).mockReturnValue({
      pathname: '/limits/mock-council/allocation',
    });

    render(
      <Provider>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    );

    const activeLink = screen.getByText('Allocations table').closest('li');
    expect(activeLink?.className).toContain('border-b-4');
    expect(activeLink?.className).toContain('border-kapiti');
  });
});
