import { render, screen } from '@testing-library/react'
import MapPage from '@pages/MapPage/MapPage.tsx'

vi.mock('@components/InteractiveMap/InteractiveMap', () => ({
  default: () => {
    vi.fn()
    return <div>Mock Map</div>
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as object
  return {
    ...actual,
    useLoaderData: () => "@-41,175.35,8z",
  }
})

describe('Map', () => {
  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('exists', () => {
    expect(MapPage).toBeDefined()
  })

  it('should render', () => {
    render(<MapPage />)
    expect(screen.getByText('Mock Map')).toBeInTheDocument()
  })
})
