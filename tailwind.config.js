export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#F2E3C6",
                "gold": "#F2E3C6",
                "gold-light": "#FFF8E7",
                "ivory": "#FAF8F2",
                "gray-accent": "#4A554C",
                "background-light": "#FAF8F2",
                "background-dark": "#4F6352",
                "card-dark": "#3B4A3D",
                "darkest": "#29332A",
                "olive": "#4A554C",
                "olive-dark": "#29332A",
                "cream": "#FFF8E7",
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"],
                "serif": ["Playfair Display", "serif"],
                "body": ["Spline Sans", "sans-serif"],
            },
            borderRadius: {
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
        },
        animation: {
            'fade-in': 'fadeIn 1s ease-out forwards',
            'fade-in-up': 'fadeInUp 1s ease-out forwards',
            'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
