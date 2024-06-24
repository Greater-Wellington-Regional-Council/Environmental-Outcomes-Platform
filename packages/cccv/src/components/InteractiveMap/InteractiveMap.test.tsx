import { render, screen } from '@testing-library/react'
import InteractiveMap from "@components/InteractiveMap/InteractiveMap.tsx";
import {expect} from "vitest";

beforeAll(() => {
    vi.mock('mapbox-gl', () => ({
      default: {
        Map: vi.fn(() => ({
            on: vi.fn(),
            remove: vi.fn()
        }))
      }
    }))

  vi.mock('@tanstack/react-query', () => {
    return {
      __esModule: true,
      useQueryClient: vi.fn(() => null),
    };
  });
})

afterAll(() => {
    vi.restoreAllMocks()
})

describe('InteractiveMap component', () => {
    it('it exists', () => {
        expect(InteractiveMap).to.be.ok;
    });

    it('should render', () => {
        render(<InteractiveMap startLocation={{ longitude: 174.7, latitude: -41.3, zoom: 10 }} select={() => {}}  selected={null}/>)

        expect(screen.getByTestId('InteractiveMap')).toBeInTheDocument()
    })
})
