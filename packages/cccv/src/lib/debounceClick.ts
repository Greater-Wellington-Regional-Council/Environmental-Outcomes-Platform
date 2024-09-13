import React from "react"

export const debounceClick = (
    clickTimeoutRef: React.MutableRefObject<number | null>,
    delay: number,
    callback: () => void
) => {
    if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
    }

    clickTimeoutRef.current = window.setTimeout(() => {
        callback()
        clickTimeoutRef.current = null
    }, delay)
}