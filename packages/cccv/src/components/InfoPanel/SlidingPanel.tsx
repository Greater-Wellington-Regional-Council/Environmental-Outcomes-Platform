import './SlidingPanel.scss'
import React, { useState, useEffect, useRef } from 'react'

interface InfoPanelProps {
    showPanel?: boolean;
    contentChanged: boolean;
    onClose: () => void;
    onResize?: (width: number) => void;
    children?: React.ReactNode;
    className?: string;
}

export default function SlidingPanel({ showPanel, contentChanged, onResize, onClose, children, className }: InfoPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null)
    const isResizing = useRef(false)
    const [panelWidth, setPanelWidth] = useState(300)
    const [isPanelVisible, setIsPanelVisible] = useState(showPanel)
    const [isLargeScreen] = useState(window.innerWidth > 640)

    useEffect(() => {
        setIsPanelVisible(showPanel || true)
    }, [showPanel])

    useEffect(() => {
        if (!isResizing.current && panelRef.current && isLargeScreen) {
            const parentWidth = panelRef.current.parentElement?.getBoundingClientRect().width || 0
            const initialWidth = parentWidth * 0.35
            setPanelWidth(initialWidth)
            onResize?.(initialWidth)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing.current && panelRef.current && isLargeScreen) {
                const panelRightEdge = panelRef.current.getBoundingClientRect().right
                const newWidth = panelRightEdge - e.clientX
                if (newWidth > 100) {
                    setPanelWidth(newWidth)
                    onResize?.(newWidth)
                }
            }
            e.preventDefault()
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.body.style.userSelect = ''
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
            document.body.style.userSelect = 'none'
        }
    }

    const handleDoubleClick = () => {
        setIsPanelVisible(!isPanelVisible)
    }

    const handleClose = () => {
        setIsPanelVisible(false)
        onClose()
    }

    const revealOrHideInfoPanel = isPanelVisible ? 'animate-in' : 'animate-out'
    const signalUpdatedInfoPanel = contentChanged ? 'pulsate' : ''
    const stateClass = isPanelVisible ? 'sliding-panel-visible' : 'sliding-panel-hidden'

    return (
        <div
            ref={panelRef}
            className={`sliding-panel ${stateClass} absolute bg-white font-mono shadow-black ${signalUpdatedInfoPanel} ${revealOrHideInfoPanel} transition ease-in-out duration-500 z-[1000] ${className}`}
            style={{
                width: isLargeScreen ? `${panelWidth}px` : '100%',
                height: isLargeScreen ? `100vh` : '92vh',
                maxHeight: isLargeScreen ? `100vh` : '92vh',
                display: isPanelVisible ? 'block' : 'none',
            }}
            data-testid="sliding-panel"
        >
            <div
                className={`absolute top-0 m-0 p-0 text-gray-400 bg-transparent cursor-pointer leading-none`}
                onClick={handleClose}
                role="button"
                aria-label="Close Panel"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"/>
                </svg>
            </div>
            {isLargeScreen && (
                <div
                    className="absolute left-[-6px] top-0 bottom-0 w-[6px] cursor-ew-resize bg-gray-100"
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                />
            )}
            <div className="relative z-30 mt-10 overflow-auto h-full">
                {children}
            </div>
        </div>
    )
}