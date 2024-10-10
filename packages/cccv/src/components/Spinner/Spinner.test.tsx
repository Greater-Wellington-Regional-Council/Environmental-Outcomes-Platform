import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import Spinner from "./Spinner"
import {LoadingProvider} from "@components/Spinner/LoadingProvider.tsx"

describe('Spinner Component', () => {
    it('renders with default size and color', () => {
        const { container } = render(<LoadingProvider><Spinner onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /></LoadingProvider>)
        const spinner = container.querySelector('.flex')

        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('h-6')
        expect(spinner).toHaveClass('w-6')
        expect(spinner?.firstChild).toHaveClass('text-blue-500')
    })

    it('renders with custom size and color', () => {
        const { container } = render(<LoadingProvider><Spinner size={8} className="text-red-500" onPointerEnterCapture={undefined}
                                                               onPointerLeaveCapture={undefined} /></LoadingProvider>)
        const spinner = container.querySelector('.flex')

        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('h-8')
        expect(spinner).toHaveClass('w-8')
        expect(spinner?.firstChild).toHaveClass('text-red-500')
    })

    it('passes additional props to MaterialSpinner', () => {
        const mockOnClick = vi.fn()
        const { container } = render(<LoadingProvider><Spinner data-testid="custom-spinner" onClick={mockOnClick}
                                                               onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /></LoadingProvider>)
        const spinner = container.querySelector('.flex')

        expect(spinner).toBeInTheDocument()
        expect(spinner?.firstChild).toHaveAttribute('data-testid', 'custom-spinner')

        spinner?.firstChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
})