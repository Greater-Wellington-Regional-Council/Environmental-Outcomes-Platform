import { debounceClick } from './debounceClick'
import { vi } from 'vitest'
import React from "react"

describe('debounceClick', () => {
    let clickTimeoutRef: React.MutableRefObject<number | null>

    beforeEach(() => {
        // Initialize clickTimeoutRef before each test
        clickTimeoutRef = { current: null }
        vi.useFakeTimers() // Ensure fake timers are used
    })

    afterEach(() => {
        vi.clearAllTimers() // Clear timers after each test
    })

    it('should clear an existing timeout if there is one', () => {
        const mockCallback = vi.fn()

        // Set an initial timeout value
        clickTimeoutRef.current = 12345
        const spyClearTimeout = vi.spyOn(window, 'clearTimeout') // Spy on clearTimeout

        debounceClick(clickTimeoutRef, 200, mockCallback)

        expect(spyClearTimeout).toHaveBeenCalledWith(12345) // Clear previous timeout
        expect(clickTimeoutRef.current).not.toBeNull() // Ensure a new timeout is set
    })

    it('should call the callback after the delay', () => {
        const mockCallback = vi.fn()

        debounceClick(clickTimeoutRef, 200, mockCallback)

        expect(mockCallback).not.toHaveBeenCalled() // Ensure callback hasn't been called immediately

        // Fast forward time
        vi.advanceTimersByTime(200)

        expect(mockCallback).toHaveBeenCalled() // Ensure callback is called after the delay
    })

    it('should set clickTimeoutRef to null after executing the callback', () => {
        const mockCallback = vi.fn()

        debounceClick(clickTimeoutRef, 200, mockCallback)

        vi.advanceTimersByTime(200)

        expect(clickTimeoutRef.current).toBeNull() // Ensure the timeout is cleared
    })
})