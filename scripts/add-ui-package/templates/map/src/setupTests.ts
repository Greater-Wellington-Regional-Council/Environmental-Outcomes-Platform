import '@testing-library/jest-dom/vitest'
import "@testing-library/jest-dom"

// Rendering the Map component is jsdom causes an "Error: Map is not supported by this browser"
// So we mock it globally
vi.mock('react-map-gl');
