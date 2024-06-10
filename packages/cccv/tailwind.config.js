/* eslint-env node */
/** @type {(tailwindConfig: object) => object} */

import withMT from "@material-tailwind/react/utils/withMT";

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
            colors: {
                nui: '#174A5B',
                kapiti: '#00BAB3',
                cubaStreet: '#E73C3E',
                kaitoke: '#A9C23F',
                castlepoint: '#E1CD00',
                textDefault: '#323232',
                textH6: '#737373',
                textCaption: '#737373',
                grey: '#9D9D9D'
            },
        },
    },
    plugins: [],
})