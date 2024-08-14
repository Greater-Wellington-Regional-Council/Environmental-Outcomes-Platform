import React, {ReactNode, useContext} from "react"
import orgService from "@services/OrgService.ts"
import ErrorContext from "@components/ErrorContext/ErrorContext.ts"

const EmailLink = ({children = null}: {children: ReactNode}) => {
  const setError = useContext(ErrorContext).setError

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()

    orgService.getContactDetails(setError).then((contactDetails) => {
      const email = contactDetails?.email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (email && emailRegex.test(email)) {
        window.location.href = `mailto:${email}`
      } else {
        console.error('Invalid or undefined email address')
      }
    })
  }

  return (
      <button onClick={handleEmailClick} aria-label="Send email">
        {children}
      </button>
  )
}

export default EmailLink
