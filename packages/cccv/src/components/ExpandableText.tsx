import React, { useState } from 'react'
import DOMPurify from 'dompurify'

interface ExpandableTextProps {
    text: string;
    maxChars?: number;
    purify?: boolean;
}

const SHOW_CHARS = 250

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxChars = SHOW_CHARS, purify = false }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const displayText = isExpanded ? text : text.slice(0, maxChars)

    const sanitizedText = purify ? DOMPurify.sanitize(displayText) : displayText

    return (
        <p>
            {purify ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: sanitizedText,
                    }}
                />
            ) : (
                displayText
            )}
            {text.length > maxChars && (
                <span
                    onClick={toggleExpand}
                    className="text-nui cursor-pointer ml-1.5"
                >
                    {isExpanded ? '< Read less' : '> Read more...'}
                </span>
            )}
        </p>
    )
}

export default ExpandableText