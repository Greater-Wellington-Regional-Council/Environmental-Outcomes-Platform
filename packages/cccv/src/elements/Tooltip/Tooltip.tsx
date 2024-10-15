import React from 'react'

interface TooltipProps {
    description: string;
    x: number;
    y: number;
    isVisible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ description, x, y, isVisible }) => {
    if (!isVisible) return null

    return (
        <div
            style={{
                position: 'fixed',  // Make sure it's positioned relative to the viewport
                top: y,             // Tooltip top position
                left: x,            // Tooltip left position
                backgroundColor: 'black',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                zIndex: 9999,        // Ensure it's on top of other elements
                maxWidth: '300px',   // Set a reasonable max width so the tooltip doesn't stretch too much
                whiteSpace: 'normal', // Allow the text to wrap
                wordWrap: 'break-word', // Break long words if necessary
            }}
        >
            {description}
        </div>
    )
}

export default Tooltip