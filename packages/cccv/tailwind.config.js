/* eslint-env node */
/** @type {(tailwindConfig: object) => object} */

import withMT from "@material-tailwind/react/utils/withMT"
import colors from "./src/lib/colors"

module.exports = withMT({
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'source-sans-3': ['"Source Sans 3"', 'sans-serif'],
            },
            colors,
        },
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        }
    },
    plugins: [],
})