import React from 'react'

export enum ErrorLevel {
  INFO = 0,
  WARNING = 1,
  ERROR = 2,
}

export class ErrorFlag extends Error {
  level: ErrorLevel
  constructor(message = '', level = ErrorLevel.ERROR) {
    super(message)
    this.level = level
  }
}

export const ErrorContext = React.createContext<{ error: Error | null, setError: (e: Error | null | ErrorFlag) => void }>({error: null, setError: () => {}})

export default ErrorContext