import React from 'react'

interface CarouselProps {
    displayValues: string[];
    index: number | null;
    setIndex: (index: number) => void;
    className?: string;
}

const StringCarousel: React.FC<CarouselProps> = ({ displayValues, index, setIndex, className = null }) => {
    // Set the currentIndex to 0 if index is null
    const currentIndex = index === null ? 0 : index

    // Handle the previous button click
    const handlePrev = () => {
        const newIndex = (currentIndex - 1 + displayValues.length) % displayValues.length
        setIndex(newIndex)
    }

    // Handle the next button click
    const handleNext = () => {
        const newIndex = (currentIndex + 1) % displayValues.length
        setIndex(newIndex)
    }

    return (
        <div className={["flex items-center justify-center space-x-2", className].join(' ')}>
            <button onClick={handlePrev} className="hover:bg-transparent hover:text-nui border-none text-xl">&lt;</button>
            <h2 className="text-2lg h-full text-center">{displayValues[currentIndex]}</h2>
            <button onClick={handleNext} className="hover:bg-transparent hover:text-nui border-none text-xl">&gt;</button>
        </div>
    )
}

export default StringCarousel