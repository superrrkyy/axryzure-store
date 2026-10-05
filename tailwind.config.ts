import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070709',
          900: '#0B0B0E',
          850: '#0F0F13',
          800: '#131318',
          750: '#17171D',
          700: '#1C1C23',
          600: '#26262F',
          500: '#33333E',
        },
        accent: {
          100: '#E2E8FD',
          200: '#C3CEFB',
          300: '#A9BAFB',
          400: '#8CA0FA',
          500: '#6F87F8',
          600: '#5A6FE0',
          700: '#4957C2',
        },
        gold: {
          200: '#F5E8C8',
          300: '#EEDCAE',
          400: '#E4CB86',
          500: '#D2B062',
        },
        cream: '#F2EFE7',
        mist: '#A2A4B3',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // tighter editorial display sizes
        'display-lg': ['clamp(2.75rem, 6.2vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem, 3.8vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 2.4vw, 2.1rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 24px 48px -24px rgba(0,0,0,0.65)',
        pop: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 32px 64px -28px rgba(0,0,0,0.8)',
        glow: '0 8px 32px -8px rgba(111,135,248,0.45)',
        'glow-sm': '0 4px 20px -6px rgba(111,135,248,0.4)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.82)' },
        },
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        'marquee-slow': 'marquee 64s linear infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
