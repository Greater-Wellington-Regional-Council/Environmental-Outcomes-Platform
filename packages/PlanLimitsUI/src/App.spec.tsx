import { render, screen, waitFor } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { expect, describe, it } from 'vitest';
import { routes } from './App';

describe('App Routing', () => {
  it('should redirect to the limits page if visiting the root', async () => {
    const router = createMemoryRouter(routes);

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should add default location to path when visiting page', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should switch to default location when unparsable', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits/I-KNOW-NOTHING'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/limits/@-41,175.35,8z');
    });
  });

  it('should do nothing when location is in url', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/limits/@-44.675,169.138,16z'],
    });

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toEqual(
      '/limits/@-44.675,169.138,16z'
    );
  });
});
