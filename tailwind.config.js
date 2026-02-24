/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-black': '#0a0a0a',
                'cyber-green': '#00ff9d',
                'alert-red': '#ff4d4d',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            dropShadow: {
                'neon': '0 0 10px rgba(0, 255, 157, 0.5)',
            }
        },
    },
    plugins: [],
}
