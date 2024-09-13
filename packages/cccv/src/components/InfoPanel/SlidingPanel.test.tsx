import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import SlidingPanel from '@components/InfoPanel/SlidingPanel.tsx'

describe('SlidingPanel Component', () => {
    it('renders with correct initial width and visibility', () => {
        const { getByTestId } = render(
            <SlidingPanel showPanel={true} contentChanged={false} onClose={() => {}} />
    )
        const panel = getByTestId('sliding-panel')
        expect(panel).toBeInTheDocument()
        expect(panel).toHaveStyle('display: block')
    })

    it('does not render when showPanel is false', () => {
        const { container } = render(
            <SlidingPanel showPanel={false} contentChanged={false} onClose={() => {}} />
    )
        const panel = container.querySelector('div[style*="min-width: 33%"]')
        expect(panel).toHaveStyle('display: none')
    })

    it('toggles visibility on double-click', () => {
        const { container } = render(
            <SlidingPanel showPanel={true} contentChanged={false} onClose={() => {}} />
    )
        const panel = container.querySelector('div[style*="min-width: 33%"]')
        expect(panel).toHaveStyle('display: block')

        // Double-click to hide
        const bezel = container.querySelector('.cursor-ew-resize')
        fireEvent.doubleClick(bezel!)
        expect(panel).toHaveStyle('display: none')

        // Double-click to show again
        fireEvent.doubleClick(bezel!)
        expect(panel).toHaveStyle('display: block')
    })

    it('calls onResize when resizing the panel', () => {
        const mockOnResize = vi.fn()
        const { container } = render(
            <SlidingPanel showPanel={true} contentChanged={false} onClose={() => {}} onResize={mockOnResize} />
        )

        const bezel = container.querySelector('.cursor-ew-resize')
        fireEvent.mouseDown(bezel!)
        fireEvent.mouseMove(document, { clientX: 100 })

        // onResize should have been called with new width
        expect(mockOnResize).toHaveBeenCalledWith(expect.any(Number))
        fireEvent.mouseUp(document)
    })

    it('applies pulsate class when contentChanged is true', () => {
        const { container } = render(
            <SlidingPanel showPanel={true} contentChanged={true} onClose={() => {}} />
    )
        const panel = container.querySelector('div.pulsate')
        expect(panel).toBeInTheDocument()
    })
})