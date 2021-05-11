const colors = require('tailwindcss/colors')

module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.tsx',
        './pages/**/*.html',
        './pages/**/*.tsx',
        './components/**/*.tsx',
      ],
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
