import React from 'react'
import { Spinner as MaterialSpinner } from "@material-tailwind/react"

type SpinnerProps = React.ComponentProps<typeof MaterialSpinner> & {
    size?: number;
    color?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = 6, color = 'text-blue-500', ...rest }) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <MaterialSpinner className={`h-${size} w-${size} ${color}`} {...rest} />
        </div>
    )
}

export default Spinner