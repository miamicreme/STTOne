/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy/slate base
        base: {
          950: '#070b16',
          900: '#0b1120',
          850: '#0f1729',
          800: '#131c30',
          700: '#1c2840',
          600: '#28374f',
        },
        // Confident single accent — signal cyan/teal
        accent: {
          DEFAULT: '#38bdf8',
          soft: '#0ea5e9',
          deep: '#0369a1',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(56,189,248,0.45)' },
          '70%': { boxShadow: '0 0 0 6px rgba(56,189,248,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(56,189,248,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-ring': 'pulse-ring 2s infinite',
      },
    },
  },
  plugins: [],
}
