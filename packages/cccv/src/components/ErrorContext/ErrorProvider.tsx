import "./ErrorProvider.scss"
import React, { useMemo, useState } from "react"

import {
    ErrorFlagAndOrMessage,
    ErrorLevel,
    errorLevel,
    errorMessage
} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

import ErrorContext from "./ErrorContext"
import { setGlobalErrorList } from "./announceError.ts"

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [errorList, setErrorList] = useState<Array<ErrorFlagAndOrMessage>>([])

    const addError = (e: ErrorFlagAndOrMessage) => setErrorList((prev) => [...prev, e])

    const clearErrors = () => setErrorList([])

    const errors = useMemo(
        () => ({
            errors: {
                all: errorList,
                add: addError,
                clear: clearErrors,
                toString: errorMessage,
                errorLevel,
            },
        }),
        [errorList]
    )

    const refErrors = React.useRef(errors)

    React.useEffect(() => {
        refErrors.current = errors
        setGlobalErrorList(refErrors.current) // Directly update in ErrorUtils
    }, [errors])

    const priorityErrors = () =>
        errorList.filter((e) => [ErrorLevel.ERROR].includes(errorLevel(e)))

    return (
        <ErrorContext.Provider value={errors}>
            <div className="error-signal">
                {priorityErrors().map((e, index) => (
                    <div className={`error-info error-level-${errorLevel(e)}`} key={index}>
                        {errorMessage(e)}
                    </div>
                ))}
                {children}
            </div>
        </ErrorContext.Provider>
    )
}