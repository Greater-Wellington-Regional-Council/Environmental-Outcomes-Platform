import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import Spinner from "./Spinner"
import {LoadingProvider} from "@components/Spinner/LoadingProvider.tsx"
import { ThemeProvider } from '@material-tailwind/react'

vi.mock('@material-tailwind/react', () => {
    return {
        ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
        Spinner: ({ className, ...rest }: { className?: string }) => (
            <div className={className} {...rest} />
        ),
    }
})

describe('Spinner Component', () => {
    it('renders with default size and color', () => {
        const { container } = render(
            <LoadingProvider>
                <ThemeProvider>
                    <Spinner onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </ThemeProvider>
            </LoadingProvider>
        )

        const spinner = container.querySelector('.h-6') // Default size is 6
        console.log(container.innerHTML)

        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('h-6')
        expect(spinner).toHaveClass('w-6')
    })

    it('renders with custom size and color', () => {
        const { container } = render(
            <LoadingProvider>
                <ThemeProvider>
                    <Spinner size={8} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </ThemeProvider>
            </LoadingProvider>
        )
        const spinner = container.querySelector('.h-8')

        console.log(container.innerHTML)

        expect(spinner).toBeInTheDocument()
        expect(spinner).toHaveClass('w-8')
    })

    it('passes additional props to MaterialSpinner', () => {
        const mockOnClick = vi.fn()
        const { container } = render(
            <LoadingProvider>
                <ThemeProvider>
                    <Spinner data-testid="custom-spinner" onClick={mockOnClick} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </ThemeProvider>
            </LoadingProvider>
        )
        const spinner = container.querySelector('.flex')

        console.log(container.innerHTML)

        expect(spinner).toBeInTheDocument()
        expect(spinner?.firstChild).toHaveAttribute('data-testid', 'custom-spinner')

        spinner?.firstChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
})