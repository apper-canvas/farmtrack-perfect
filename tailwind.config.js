/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',
        secondary: '#7CB342',
        accent: '#FF6F00',
        surface: {
          50: '#FAF8F3',
          100: '#F5F5DC',
          200: '#F0F0E8',
          300: '#E8E8D8',
          400: '#D8D8C8',
          500: '#C8C8B8',
          600: '#B8B8A8',
          700: '#A8A898',
          800: '#989888',
          900: '#888878'
        },
        background: '#FAF8F3',
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 3s infinite'
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      }
    },
  },
  plugins: [],
}