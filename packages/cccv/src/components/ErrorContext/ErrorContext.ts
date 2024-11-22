import React, {Dispatch, useContext} from 'react'
import {ErrorFlagAndOrMessage} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

export interface Errors {
  errors: {
    all: Array<ErrorFlagAndOrMessage>
    add: Dispatch<ErrorFlagAndOrMessage>
    clear: () => void
    toString: (e: ErrorFlagAndOrMessage) => string
    errorLevel: (e: ErrorFlagAndOrMessage) => number | undefined
  }
}

export const ErrorContext = React.createContext<Errors>({
    errors: {
      all: [],
      add: () => {},
      clear: () => {},
      toString: () => "",
      errorLevel: () => undefined
    }
})

export const useErrors = (): Errors => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useErrors must be used within an ErrorProvider')
  }
  return context
}

export default ErrorContext