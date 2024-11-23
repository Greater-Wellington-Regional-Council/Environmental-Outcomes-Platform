import "./ErrorProvider.scss"
import React, { useMemo, useState } from "react"

import {
    ErrorFlagAndOrMessage,
    ErrorLevel,
    errorLevel,
    errorMessage, priorityErrors
} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"

import ErrorContext from "./ErrorContext"
import { setGlobalErrorList } from "./announceError.ts"

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [errorList, setErrorList] = useState<Array<ErrorFlagAndOrMessage>>([])

    const addError = (e: ErrorFlagAndOrMessage) => setErrorList((prev) => [...prev, e])

    const clearNonPersistentErrors = () => {
        const errors = errorList.filter((e) => errorLevel(e) == ErrorLevel.PERSISTENT)
        setErrorList(errors as Array<ErrorFlagAndOrMessage>)
    }

    const clearAllErrors = () => setErrorList([])

    const errors = useMemo(
        () => ({
            errors: {
                all: errorList,
                add: addError,
                clear: clearAllErrors,
                clearNonPersistent: clearNonPersistentErrors,
                toString: errorMessage,
                errorLevel,
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [errorList]
    )

    const refErrors = React.useRef(errors)

    React.useEffect(() => {
        refErrors.current = errors
        setGlobalErrorList(refErrors.current)
    }, [errors, errorList])

    return (
        <ErrorContext.Provider value={errors}>
            <div className="error-signal">
                {errorList.filter(e => priorityErrors.includes(errorLevel(e))).map((e, index) => (
                    <div className={`error-info error-level-${errorLevel(e)}`} key={index}>
                        {errorMessage(e)}
                    </div>
                ))}
                {children}
            </div>
        </ErrorContext.Provider>
    )
}