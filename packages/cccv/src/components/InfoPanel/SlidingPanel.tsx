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

    useEffect(() => {
        if (panelRef.current) {
            const parentWidth = panelRef.current.parentElement?.getBoundingClientRect().width || 0
            const initialWidth = parentWidth * 0.3
            setPanelWidth(initialWidth)
            onResize && onResize(initialWidth)
        }
    }, [onResize])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing.current && panelRef.current) {
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
    }, [onResize])

    const handleMouseDown = () => {
        isResizing.current = true
        document.body.style.userSelect = 'none' // Disable text selection
    }

    const handleDoubleClick = () => {
        setIsPanelVisible(!isPanelVisible) // Toggle panel visibility
    }

    const revealOrHideInfoPanel = isPanelVisible ? 'animate-in' : 'animate-out'
    const signalUpdatedInfoPanel = contentChanged ? 'pulsate' : ''

    return (
        <div
            ref={panelRef}
            className={`sliding-panel absolute top-0 right-0 bg-white font-mono shadow-black ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500 z-10`}
            style={{ minWidth: '33%', maxWidth: '100%', width: `${panelWidth}px`, height: '100vh', display: isPanelVisible ? 'block' : 'none' }}
            data-testid="sliding-panel"
        >
            {/* Bezel for resizing and double-click to hide */}
            <div
                className="absolute left-[-6px] top-0 bottom-0 w-[6px] cursor-ew-resize z-20 bg-gray-100"
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick} // Added double-click event
            />

            {/* Scrollable content area */}
            <div className="relative z-30 overflow-auto h-full">
                {children}
            </div>
        </div>
    )
}