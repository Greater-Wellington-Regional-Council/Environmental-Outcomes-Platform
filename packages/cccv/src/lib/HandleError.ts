export const handleError = (errorText: string, setError: null | ((error: Error | null) => void) = null, returnValue?: unknown) => {
    console.error(errorText)
    setError && setError(new Error(errorText))
    return returnValue ?? null
}