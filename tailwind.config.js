const colors = require('tailwindcss/colors')

module.exports = {
    purge: [],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                cyan: colors.cyan,
                teal: colors.teal,
            }
        },

    },
    variants: {
        extend: {},
    },
    plugins: [],
}
