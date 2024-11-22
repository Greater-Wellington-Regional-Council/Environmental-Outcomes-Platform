import {
    ErrorFlag,
    ErrorFlagAndOrMessage,
    ErrorLevel,
    errorLevel,
    errorMessage,
    notifyError,
} from "@components/ErrorContext/ErrorFlagAndOrMessage.ts"
import { Errors } from "./ErrorContext"

let globalErrorList: Errors | null = null

export const setGlobalErrorList = (errors: Errors) => {
    globalErrorList = errors
}

export const announceError = (e: ErrorFlagAndOrMessage, level?: ErrorLevel) => {
    console.warn("Global error level", errorLevel(e), errorMessage(e))
    if (!globalErrorList) {
        console.error("Global error list is not set")
        return
    }

    globalErrorList.errors.add(new ErrorFlag(errorMessage(e), level ?? errorLevel(e)))
    globalErrorList.errors.all
        .filter((err) => [ErrorLevel.WARNING, ErrorLevel.ERROR].includes(errorLevel(err)))
        .forEach((err) => notifyError(err))
}