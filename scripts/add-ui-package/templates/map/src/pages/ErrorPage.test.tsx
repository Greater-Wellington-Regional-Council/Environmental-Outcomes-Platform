import { render, screen } from '@testing-library/react'
import ErrorPage from "@pages/ErrorPage.tsx";
import { describe, it, expect } from 'vitest'

describe('Error page', () => {
    it('renders error page', () => {
        render(<ErrorPage />)
        expect(screen.getByRole('error')).toBeInTheDocument()
    })
})