// src/__mocks__/react-router-dom.ts
import { vi } from 'vitest';

const actualReactRouterDom = await vi.importActual('react-router-dom');

export const useLoaderData = vi.fn().mockReturnValue({});
export const MemoryRouter = actualReactRouterDom.MemoryRouter;
export const Routes = actualReactRouterDom.Routes;
export const Route = actualReactRouterDom.Route;
export const createMemoryRouter = actualReactRouterDom.createMemoryRouter;
export const RouterProvider = actualReactRouterDom.RouterProvider;
