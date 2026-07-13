/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#e8eaf2',
                    100: '#c5c9e0',
                    200: '#9fa5ca',
                    300: '#7880b4',
                    400: '#5a64a3',
                    500: '#3c4893',
                    600: '#2e3a82',
                    700: '#1e2a6e',
                    800: '#111c58',
                    900: '#0c1340',
                    950: '#0A0F1E',
                },
                gold: {
                    300: '#f0d080',
                    400: '#e8bc5a',
                    500: '#D4A853',
                    600: '#b8892e',
                    700: '#9a6e15',
                },
                cream: {
                    50: '#FDFAF4',
                    100: '#F9F3E6',
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.navy.900'),
                        h1: { fontFamily: 'Playfair Display, serif', color: theme('colors.navy.950') },
                        h2: { fontFamily: 'Playfair Display, serif', color: theme('colors.navy.900') },
                        h3: { fontFamily: 'Playfair Display, serif', color: theme('colors.navy.900') },
                        a: { color: theme('colors.gold.600'), '&:hover': { color: theme('colors.gold.700') } },
                        strong: { color: theme('colors.navy.950') },
                    },
                },
            }),
            keyframes: {
                shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
            },
            animation: {
                shimmer: 'shimmer 2s infinite linear',
                fadeIn: 'fadeIn 0.5s ease forwards',
                slideUp: 'slideUp 0.6s ease forwards',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
