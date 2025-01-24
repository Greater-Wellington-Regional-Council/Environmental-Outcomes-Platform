import { useEffect, useRef } from "react"

const useIdleTimer = (onIdle: () => void, idleTime = 10000) => {
    const timer = useRef<NodeJS.Timeout | null>(null)

    const resetTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            onIdle()
        }, idleTime)
    }

    useEffect(() => {
        const handleActivity = () => {
            resetTimer()
        }

        // Attach activity listeners
        // window.addEventListener("mousemove", handleActivity)
        window.addEventListener("keydown", handleActivity)
        window.addEventListener("scroll", handleActivity)
        window.addEventListener("click", handleActivity)

        // Start the initial timer
        resetTimer()

        return () => {
            // Cleanup listeners and timers
            // window.removeEventListener("mousemove", handleActivity)
            window.removeEventListener("keydown", handleActivity)
            window.removeEventListener("scroll", handleActivity)
            window.removeEventListener("click", handleActivity)
            if (timer.current) {
                clearTimeout(timer.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idleTime, onIdle])
}

export default useIdleTimer