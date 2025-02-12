import './SlidingPanel.scss'
import React, { useState, useEffect, useRef } from 'react'

interface InfoPanelProps {
    showPanel: boolean;
    contentChanged: boolean;
    onClose: () => void;
    onResize?: (width: number) => void;
    children?: React.ReactNode;
}

export default function SlidingPanel({ showPanel, contentChanged, onResize, children }: InfoPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null)
    const isResizing = useRef(false)
    const [panelWidth, setPanelWidth] = useState(300)
    const [isPanelVisible, setIsPanelVisible] = useState(showPanel) // Track visibility state
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 640) // Detect if the screen is large

    useEffect(() => {
        // Listen for window resize to update isLargeScreen
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 640)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (panelRef.current && isLargeScreen) {
            const parentWidth = panelRef.current.parentElement?.getBoundingClientRect().width || 0
            const initialWidth = parentWidth * 0.35
            setPanelWidth(initialWidth)
            onResize && onResize(initialWidth)
        }
    }, [onResize, isLargeScreen])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing.current && panelRef.current && isLargeScreen) {
                const panelRightEdge = panelRef.current.getBoundingClientRect().right
                const newWidth = panelRightEdge - e.clientX

                if (newWidth > 100) {
                    setPanelWidth(newWidth)
                    onResize && onResize(newWidth)
                }
            }
            e.preventDefault()
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.body.style.userSelect = '' // Re-enable text selection
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [onResize, isLargeScreen])

    const handleMouseDown = () => {
        if (isLargeScreen) {
            isResizing.current = true
            document.body.style.userSelect = 'none' // Disable text selection
        }
    }

    const handleDoubleClick = () => {
        setIsPanelVisible(!isPanelVisible) // Toggle panel visibility
    }

    const revealOrHideInfoPanel = isPanelVisible ? 'animate-in' : 'animate-out'
    const signalUpdatedInfoPanel = contentChanged ? 'pulsate' : ''
    const stateClass = isPanelVisible ? 'sliding-panel-visible' : 'sliding-panel-hidden'

    return (
        <div
            ref={panelRef}
            className={`sliding-panel ${stateClass} absolute bg-white font-mono shadow-black ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500 z-10`}
            style={{
                width: isLargeScreen ? `${panelWidth}px` : '100%', // Full width for small screens
                height: '100vh', // Full height of the viewport
                maxHeight: '100vh', // Full height of the viewport
                display: isPanelVisible ? 'block' : 'none',
            }}
            data-testid="sliding-panel"
        >
            {isLargeScreen && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                    className="absolute left-[-6px] top-0 bottom-0 w-[6px] cursor-ew-resize z-20 bg-gray-100"
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                />
            )}

            {/* Scrollable content area */}
            <div className="relative z-30 overflow-auto h-full">
                {children}
            </div>
        </div>
    )
}
