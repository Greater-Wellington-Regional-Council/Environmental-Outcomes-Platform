import React from 'react'

interface LoadingIndicatorOverlayProps {
    width?: number;
    height?: number;
}

export function Spinner(props: { width: number, height: number }) {
    return <div
        className={`spinner-border animate-spin inline-block w-${props.width} h-${props.height} border-4 rounded-full`}
        role="status">
        <svg className={`animate-spin -ml-1 mr-3 w-${props.width} h-${props.height} text-white" xmlns="http://www.w3.org/2000/svg`}
             fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="navy"
                    strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
}

export const LoadingIndicatorOverlay: React.FC<LoadingIndicatorOverlayProps> = ({ width = 5, height = 5 }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Spinner width={width} height={height}/>
        </div>
    )
}