import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
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
        // Southern Tier brand — royal blue (from the logo swoosh)
        accent: {
          DEFAULT: '#2f86e0',
          soft: '#1c6fd0',
          deep: '#13518f',
          glow: '#7db4ef',
        },
        // Southern Tier brand — red (upper logo swoosh), used as a fresh second accent
        brand: {
          red: '#ce1126',
          'red-soft': '#e2384b',
          navy: '#0a2348',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(47,134,224,0.12), 0 18px 40px -16px rgba(47,134,224,0.35)',
        'card-hover': '0 24px 48px -20px rgba(2,8,23,0.85), 0 0 0 1px rgba(47,134,224,0.16)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(14px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(47,134,224,0.5)' },
          '70%': { boxShadow: '0 0 0 7px rgba(47,134,224,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(47,134,224,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        rise: 'rise 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in': 'slide-in 0.35s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        'pulse-ring': 'pulse-ring 2.2s infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        // Opacity-only — no vertical translate, so switching views never
        // nudges the layout (prevents the per-view "jump").
        fade: 'fade 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
