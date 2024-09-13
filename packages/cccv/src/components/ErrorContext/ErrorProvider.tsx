import "./ErrorProvider.scss"
import React, { useState } from "react"
import ErrorContext, {ErrorFlag} from "./ErrorContext"

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<Error | null | ErrorFlag>(null)

  return (
    <ErrorContext.Provider value={{error, setError}}>
      <div className="error-signal">
        {error && (
          <div className={`error-info error-level-${(error as ErrorFlag).level}`}>
            {error.message}
          </div>
        )}
        {children}
      </div>
    </ErrorContext.Provider>
  )
}