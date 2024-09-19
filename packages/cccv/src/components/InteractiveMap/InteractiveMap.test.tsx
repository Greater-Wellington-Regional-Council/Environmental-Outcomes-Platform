import {render, screen} from '@testing-library/react'
import InteractiveMap from "@components/InteractiveMap/InteractiveMap.tsx"
import {expect} from "vitest"

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
        }
    })

    vi.mock('@lib/MapSnapshotContext', () => {
        return {
            __esModule: true,
            useMapSnapshot: vi.fn(() => ({
                    setMapSnapshot: vi.fn()
                })
            )
        }
    })
})

afterAll(() => {
    vi.restoreAllMocks()
})

describe('InteractiveMap component', () => {
    it('it exists', () => {
        expect(InteractiveMap).to.be.ok
    })

    it('should render', () => {
        render(<InteractiveMap startLocation={{longitude: 174.7, latitude: -41.3, zoom: 10}} setLocationInFocus={() => {
        }} locationInFocus={null}/>)

        expect(screen.getByTestId('InteractiveMap')).toBeInTheDocument()
    })
})
