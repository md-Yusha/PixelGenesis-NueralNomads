/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#60A5FA',
        'neon-purple': '#3B82F6',
        'dark-bg': '#0D0D0D',
        'dark-card': '#1A1A1A',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'body': ['"Press Start 2P"', 'cursive'],
      },
      borderRadius: {
        'none': '0',
        'DEFAULT': '0',
      },
      fontSize: {
        'xs': '0.6rem',
        'sm': '0.7rem',
        'base': '0.75rem',
        'lg': '0.9rem',
        'xl': '1rem',
        '2xl': '1.2rem',
        '3xl': '1.4rem',
        '4xl': '1.6rem',
        '5xl': '1.8rem',
        '6xl': '2rem',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #3B82F6, 0 0 10px #3B82F6, 0 0 15px #3B82F6' },
          '100%': { boxShadow: '0 0 10px #3B82F6, 0 0 20px #3B82F6, 0 0 30px #3B82F6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}

