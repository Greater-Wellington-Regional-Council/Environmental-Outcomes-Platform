import {
    consoleErrorLevels,
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
    if (!globalErrorList) {
        console.error("Global error list is not set")
        return
    }

    const errLevel = level || errorLevel(e)

    globalErrorList.errors.add(new ErrorFlag(errorMessage(e), errLevel))

    globalErrorList.errors.all
        .filter((err) => consoleErrorLevels.includes(errorLevel(err)))
        .forEach((err) => notifyError(err))
}

export const clearErrors = (all: boolean = false) => {
    if (!globalErrorList) {
        console.error("Global error list is not set")
        return
    }

    if (all)
        globalErrorList.errors.clear()
    else
        globalErrorList.errors.clearNonPersistent()
}