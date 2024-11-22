import React, {ReactNode} from "react"
import orgService from "@services/OrgService/OrgService.ts"
import {announceError} from "@components/ErrorContext/announceError.ts"
import {ErrorLevel} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

const EmailLink = ({children = null}: {children: ReactNode}) => {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()

    orgService.getContactDetails().then((contactDetails) => {
      const email = contactDetails?.email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (email && emailRegex.test(email)) {
        window.location.href = `mailto:${email}`
      } else {
        announceError('Invalid or undefined email address', ErrorLevel.WARNING)
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
