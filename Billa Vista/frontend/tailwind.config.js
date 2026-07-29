/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#21262d',
        primary: {
          DEFAULT: '#1D9E75',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#8b949e',
          foreground: '#c9d1d9',
        },
        accent: {
          orange: '#f5a623',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
