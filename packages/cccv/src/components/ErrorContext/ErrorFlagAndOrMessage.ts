export type ErrorFlagAndOrMessage = Error | ErrorFlag | string | null

export const errorMessage = (e: ErrorFlagAndOrMessage) => {
    if (typeof e === "string")
        return e
    else if (e && "message" in e)
        return e.message
    else
        return ""
}

export const errorLevel = (e: ErrorFlagAndOrMessage) => {
    if (typeof e === "string")
        return ErrorLevel.ERROR
    else if (e && "level" in e)
        return e.level
    else
        return ErrorLevel.WARNING
}

export enum ErrorLevel {
    INFO = 0,
    WARNING = 1,
    ERROR = 2,
}

export const DEFAULT_ERROR_LEVEL = ErrorLevel.ERROR

export class ErrorFlag extends Error {
    level: ErrorLevel
    notified: boolean = false
    constructor(message = '', level = ErrorLevel.ERROR) {
        super(message)
        this.level = level
    }
}

export const notifyError = (e: ErrorFlagAndOrMessage) => {
    console.warn("Global error level", errorLevel(e), errorMessage(e))
    if (e instanceof ErrorFlag)
        e.notified = true
}