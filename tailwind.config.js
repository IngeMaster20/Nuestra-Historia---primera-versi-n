/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF5EF',
        paper: '#FFFDFA',
        ink: '#3A2A2E',
        'ink-soft': '#6B5257',
        blush: '#F3D9DD',
        rose: '#D98E99',
        'rose-deep': '#B96878',
        gold: '#C6A15B',
        'gold-soft': '#E4D2A8',
        plum: '#4A2E35',
        night: '#241A1E',
        'night-card': '#332327'
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        soft: '1.25rem'
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(74, 46, 53, 0.25)'
      },
      keyframes: {
        openEnvelope: {
          '0%': { transform: 'scale(0.96) rotate(-1deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        envelope: 'openEnvelope 0.35s ease-out',
        floatIn: 'floatIn 0.4s ease-out'
      }
    }
  },
  plugins: []
}
