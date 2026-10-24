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
        muted: '#6B5E55',
        line: '#F1E4D3',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 26, 23, 0.04), 0 8px 24px rgba(31, 26, 23, 0.06)',
      },
    },
  },
  plugins: [],
}
