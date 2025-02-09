import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
// eslint-disable-next-line import/no-unresolved
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers);

const server = setupServer(
  // For now, simply mock all requests to return an empty object.
  http.get('http://localhost:8080/:path', () => {
    return HttpResponse.json({});
  }),
  http.get('http://localhost:8080/plan-limits/manifest', () => {
    return HttpResponse.json({});
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

// Global mocks
// Example from https://vitest.dev/guide/mocking.html#globals.
// Required to test Headless UI components
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Required to test components using mapbox-gl
const createObjectURLMock = vi.fn();
window.URL.createObjectURL = createObjectURLMock;

// Rendering the Map component is jsdom causes an "Error: Map is not supported by this browser"
// So we mock it globally
vi.mock('react-map-gl');
