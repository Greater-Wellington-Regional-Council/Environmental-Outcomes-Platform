import { render, waitFor } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { expect, describe, it } from 'vitest';
import { routes } from './App';

function renderWithProviders(router = createMemoryRouter(routes)) {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

describe('App Routing', () => {
  it('should redirect to the limits page if visiting the root', async () => {
    const router = createMemoryRouter(routes);
    renderWithProviders(router);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should add default location to path when visiting page', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits'],
    });
    renderWithProviders(router);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should switch to default location when unparsable', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits/I-KNOW-NOTHING'],
    });
    renderWithProviders(router);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should do nothing when location is in url', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits/@-44.675,169.138,16z'],
    });
    renderWithProviders(router);

    expect(router.state.location.pathname).toEqual(
      '/limits/@-44.675,169.138,16z'
    );
  });

  it('should do nothing when location and pinned location is in url', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits/@-44.675,169.138,16z?pinned=-40.123,170.001'],
    });
    renderWithProviders(router);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(
        '/limits/@-44.675,169.138,16z'
      );
      expect(router.state.location.search).toEqual('?pinned=-40.123,170.001');
    });
  });
});
