/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF7ED',
        card: '#FFFBF5',
        brand: '#F97316',
        'brand-deep': '#EA580C',
        ink: '#1F1A17',
        'ink-soft': '#2B231E',
        muted: '#6B5E55',
        line: '#F1E4D3',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 26, 23, 0.04), 0 8px 24px rgba(31, 26, 23, 0.06)',
        lift: '0 2px 4px rgba(31, 26, 23, 0.06), 0 18px 40px rgba(31, 26, 23, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateX(16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'slide-in': 'slide-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
