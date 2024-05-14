import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ReactNode } from 'react';
import routes from '@src/routes';

type RouteType = {
  path: string;
  element: ReactNode;
  children?: RouteType[];
};

const renderRoutes = (routesArray: RouteType[]) => {
  return routesArray.map((route: RouteType, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
};

vi.mock('@pages/MapPage', () => ({
  default: () => {
    vi.fn();
    return <div>Map Page</div>;
  },
}));

vi.mock('@pages/ErrorPage', () => ({
  default: () => {
    vi.fn();
    return <div>Error Page</div>;
  },
}));

describe('Test Routes', () => {
  it.skip('renders App component at default path', () => {
    render(
      <MemoryRouter initialEntries={['/map/@-41,175.35,8z']}>
        <Routes>{renderRoutes(routes as RouteType[])}</Routes>
      </MemoryRouter>
    );
    const layoutElement = screen.getByText('Map Page');
    expect(layoutElement).toBeInTheDocument();
  });

  it.skip('renders Default Page when invalid', () => {
    render(
      <MemoryRouter initialEntries={['/this-is-bad']}>
        <Routes>{renderRoutes(routes as RouteType[])}</Routes>
      </MemoryRouter>
    );
    const layoutElement = screen.getByText('Map Page');
    expect(layoutElement).toBeInTheDocument();
  });
});
