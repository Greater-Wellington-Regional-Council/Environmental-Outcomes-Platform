import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import EmailLink from './EmailLink'
import orgService from '@services/OrgService/OrgService.ts'

vi.mock('@services/OrgService/OrgService', () => ({
  default: {
    getContactDetails: vi.fn(),
  },
}))

describe('EmailLink', () => {
  it('opens the email client when the button is clicked', async () => {
    // @ts-expect-error: Mocking function not recognized but ok
    const mockGetContactDetails = orgService.getContactDetails as jest.Mock

    const contactDetails = { email: 'test@example.com' }
    mockGetContactDetails.mockResolvedValue(contactDetails)

    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    })

    render(
        <EmailLink>Send Email</EmailLink>
    )

    const button = screen.getByRole('button', { name: /send email/i })
    fireEvent.click(button)

    expect(mockGetContactDetails).toHaveBeenCalled()
    await screen.findByText("Send Email")
    expect(window.location.href).toBe(`mailto:${contactDetails.email}`)
  })
})
